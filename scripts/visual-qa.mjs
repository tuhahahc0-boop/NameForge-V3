import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.VISUAL_QA_BASE_URL || 'http://127.0.0.1:4173/';
const outputDir = 'artifacts/visual-qa';
await mkdir(outputDir, { recursive: true });

const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], {
  stdio: 'ignore',
  shell: process.platform === 'win32',
});

let browser;
const failures = [];
const results = [];
const localizationFindings = [];
async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('Vite preview did not become available at ' + baseUrl);
}

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const viewports = [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'mobile', width: 390, height: 844 },
  ];
  const themes = ['light', 'dark'];
  const pages = [
    { name: 'home', hash: '' },
    { name: 'catalog', hash: '#/generators' },
    { name: 'generator-detail', hash: '#/generator/fantasy' },
    { name: 'my-names', hash: '#/my-names' },
    { name: 'style-studio', hash: '#/style-studio' },
  ];

  for (const viewport of viewports) {
    for (const theme of themes) {
      for (const view of pages) {
        const page = await browser.newPage({
          viewport: { width: viewport.width, height: viewport.height },
          deviceScaleFactor: 1,
          reducedMotion: 'reduce',
        });
        const pageErrors = [];
        page.on('pageerror', (error) => pageErrors.push(error.message));
        await page.addInitScript((selectedTheme) => {
          localStorage.setItem('nameforge_settings', JSON.stringify({
            language: 'en',
            theme: selectedTheme,
            defaultGenLanguage: 'auto',
            textSize: 'normal',
          }));
        }, theme);

        const response = await page.goto(baseUrl + view.hash, { waitUntil: 'networkidle', timeout: 45000 });
        await page.waitForTimeout(500);

        const state = await page.evaluate(() => ({
          title: document.title,
          bodyTextLength: (document.body?.innerText || '').trim().length,
          htmlClass: document.documentElement.className,
          viewportWidth: window.innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          mainCount: document.querySelectorAll('main').length,
          articleCount: document.querySelectorAll('article').length,
          selects: [...document.querySelectorAll('select')].map((select) => {
            const rect = select.getBoundingClientRect();
            const style = getComputedStyle(select);
            return {
              id: select.id,
              label: select.labels?.[0]?.innerText?.trim() || select.getAttribute('aria-label') || '',
              optionCount: select.options.length,
              visible: rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none',
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              backgroundImage: style.backgroundImage,
              value: select.value,
            };
          }),
          pressedChoiceCount: document.querySelectorAll('button[aria-pressed], button[aria-selected]').length,
          visiblePressedChoiceCount: [...document.querySelectorAll('button[aria-pressed], button[aria-selected]')].filter((button) => {
            const rect = button.getBoundingClientRect();
            const style = getComputedStyle(button);
            return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
          }).length,
          images: [...document.images].map((img) => ({
            src: img.currentSrc || img.src,
            loaded: img.complete && img.naturalWidth > 0,
          })),
        }));

        const label = viewport.name + '-' + theme + '-' + view.name;
        const screenshotPath = outputDir + '/' + label + '.png';

        await page.screenshot({ path: screenshotPath, fullPage: true, animations: 'disabled' });

        // Expand every FAQ answer so each accordion's content and light/dark styling
        // is actually rendered, not only represented by its collapsed heading.
        if (view.name === 'home') {
          // Settings is a second entry point for generation-language choices.
          const settingsButton = page.locator('button[aria-label="Settings"]:visible').first();
          if (await settingsButton.count()) {
            await settingsButton.click();
            const settingsDialog = page.locator('[role="dialog"][aria-labelledby="settings-title"]');
            const defaultLanguage = settingsDialog.locator('#settings-default-generation-language');
            if (!(await defaultLanguage.isVisible())) failures.push(label + ': default generation-language selector is missing or hidden in Settings');
            if (await defaultLanguage.count()) {
              if (await defaultLanguage.locator('option').count() < 20) failures.push(label + ': Settings language selector has fewer than 20 language choices');
              const indicator = await defaultLanguage.evaluate((select) => getComputedStyle(select).backgroundImage);
              if (indicator === 'none') failures.push(label + ': Settings language selector has no visible dropdown indicator');
            }
            await settingsDialog.locator('button[aria-label]').first().click();
          } else {
            failures.push(label + ': Settings button is not discoverable by its accessible name');
          }

          const faqSection = page.getByTestId('home-faq-section');
          const faqItems = faqSection.locator('div.space-y-3 > div');
          const faqButtons = faqItems.locator('button');
          const faqCount = await faqButtons.count();
          if (faqCount < 10) failures.push(label + ': expected a substantial FAQ list, found ' + faqCount + ' items');
          for (let index = 0; index < faqCount; index++) {
            const item = faqItems.nth(index);
            const button = item.locator('button');
            const answer = item.locator('div.px-5.pb-5.pt-1');
            await button.scrollIntoViewIfNeeded();
            if (!(await answer.isVisible())) await button.click();
            if (!(await answer.isVisible())) {
              failures.push(label + ': FAQ answer ' + (index + 1) + ' did not open');
              continue;
            }
            const answerText = (await answer.innerText()).trim();
            if (answerText.length < 10) failures.push(label + ': FAQ answer ' + (index + 1) + ' is empty or too short');
            if (viewport.name === 'desktop') {
              const faqShot = outputDir + '/faq-' + theme + '-' + String(index + 1).padStart(2, '0') + '.png';
              await item.screenshot({ path: faqShot, animations: 'disabled' });
            }
          }
          const familyChoices = page.locator('button[aria-pressed]');
          if (await familyChoices.count() > 1) {
            await familyChoices.nth(1).click();
            if (await familyChoices.nth(1).getAttribute('aria-pressed') !== 'true') {
              failures.push(label + ': home category choice did not expose its selected state after interaction');
            }
          } else {
            failures.push(label + ': home category choice buttons are missing');
          }
        }

        if (!response || response.status() >= 400) failures.push(label + ': HTTP response failed (' + (response?.status() ?? 'none') + ')');
        if (state.bodyTextLength < 100) failures.push(label + ': likely blank/incomplete page (' + state.bodyTextLength + ' text characters)');
        if (!state.htmlClass.includes(theme === 'light' ? 'light' : 'dark')) failures.push(label + ': requested theme class missing; html class=' + state.htmlClass);
        if (state.documentWidth > state.viewportWidth + 2) failures.push(label + ': horizontal overflow (' + state.documentWidth + 'px content vs ' + state.viewportWidth + 'px viewport)');
        for (const select of state.selects) {
          if (!select.visible) failures.push(label + ': selector ' + (select.id || select.label || '(unlabelled)') + ' is not visible');
          if (select.optionCount < 2) failures.push(label + ': selector ' + (select.id || select.label || '(unlabelled)') + ' has fewer than 2 options');
          if (select.backgroundImage === 'none') failures.push(label + ': selector ' + (select.id || select.label || '(unlabelled)') + ' has no visible dropdown indicator');
          if (!select.label) failures.push(label + ': selector ' + (select.id || '(unlabelled)') + ' has no accessible label');
        }
        if (view.name === 'home' && state.visiblePressedChoiceCount < 5) failures.push(label + ': home-page multi-choice filters are missing selected-state semantics or are not visible');
        if (view.name === 'catalog' && state.articleCount !== 234) failures.push(label + ': expected 234 generator cards, found ' + state.articleCount);
        if (view.name === 'catalog' && state.visiblePressedChoiceCount < 2) failures.push(label + ': category choice buttons are missing or not visible');
        if (view.name === 'style-studio' && state.visiblePressedChoiceCount < 4) failures.push(label + ': expected the four visible Style Studio tab choices');
        if (view.name === 'generator-detail') {
          if (state.selects.length < 6) failures.push(label + ': expected 6 generator selectors, found ' + state.selects.length);
          // Exercise each control to verify the choice is functional, not just decorative.
          for (const id of ['generator-style', 'generator-language', 'generator-length', 'generator-format', 'generator-gender', 'generator-quantity']) {
            const control = page.locator('#' + id);
            if (await control.count()) {
              const optionCount = await control.locator('option').count();
              const oldValue = await control.inputValue();
              if (optionCount > 1) {
                const secondValue = await control.locator('option').nth(1).getAttribute('value');
                const nextIndex = oldValue === secondValue ? 0 : 1;
                const nextValue = await control.locator('option').nth(nextIndex).getAttribute('value');
                if (nextValue !== oldValue) {
                  await control.selectOption({ index: nextIndex });
                  const selectedValue = await control.inputValue();
                  if (selectedValue !== nextValue) failures.push(label + ': ' + id + ' did not accept a new selection');
                } else {
                  failures.push(label + ': ' + id + ' has no distinct selectable value');
                }
              }
            }
          }
        }
        if (pageErrors.length) failures.push(label + ': JavaScript page errors: ' + pageErrors.join(' | '));
        const brokenImages = state.images.filter((img) => !img.loaded && !img.src.startsWith('data:'));
        if (brokenImages.length) failures.push(label + ': broken images: ' + brokenImages.map((img) => img.src).join(', '));

        results.push({
          view: view.name,
          theme,
          viewport: viewport.name,
          status: response?.status() ?? null,
          title: state.title,
          textCharacters: state.bodyTextLength,
          htmlClass: state.htmlClass,
          viewportWidth: state.viewportWidth,
          documentWidth: state.documentWidth,
          articleCount: state.articleCount,
          imageCount: state.images.length,
          brokenImageCount: brokenImages.length,
          pageErrors,
          screenshot: screenshotPath,
        });
        await page.close();
      }
    }
  }

  const primaryLanguages = ['fr','en','ar','tr','es','de','it','pt','ja','ko','zh','ru','hi','nl','pl','sv','vi','id','th','el','he','cs','ro','da','fi'];
  for (const language of primaryLanguages) {
    for (const theme of themes) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.addInitScript(({ selectedLanguage, selectedTheme }) => {
      localStorage.setItem('nameforge_settings', JSON.stringify({ language: selectedLanguage, theme: selectedTheme, defaultGenLanguage: 'auto', textSize: 'normal' }));
    }, { selectedLanguage: language, selectedTheme: theme });
    const response = await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(300);
    const state = await page.evaluate(() => ({ text: (document.body?.innerText || '').trim(), width: document.documentElement.scrollWidth, viewport: window.innerWidth }));
    const label = 'locale-' + language + '-' + theme;
    const screenshotPath = outputDir + '/' + label + '.png';
    await page.screenshot({ path: screenshotPath, fullPage: true, animations: 'disabled' });
    if (!response || response.status() >= 400) failures.push(label + ': HTTP response failed');
    if (state.text.length < 100) failures.push(label + ': likely blank Home page');
    if (state.width > state.viewport + 2) failures.push(label + ': horizontal overflow');
    if (pageErrors.length) failures.push(label + ': JavaScript page errors: ' + pageErrors.join(' | '));
    if (!(await page.getByTestId('home-faq-section').count())) failures.push(label + ': FAQ section missing');
    results.push({ view: 'home-localization', language, theme, viewport: 'desktop', status: response?.status() ?? null, textCharacters: state.text.length, documentWidth: state.width, viewportWidth: state.viewport, pageErrors, screenshot: screenshotPath });
    await page.close();
    }
  }

  // Expand locale coverage beyond the home page: verify the catalogue and a
  // generator detail page in every supported priority locale and both themes.
  // Keep this matrix desktop-only; the full responsive matrix above covers both viewports.
  const localizationPages = [
    { name: 'catalog-localization', hash: '#/generators' },
    { name: 'detail-localization', hash: '#/generator/fantasy' },
  ];
  const expectedRtlLanguages = new Set(['ar', 'he']);
    for (const language of primaryLanguages) {
    for (const theme of themes) {
      for (const view of localizationPages) {
        const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
        const pageErrors = [];
        page.on('pageerror', (error) => pageErrors.push(error.message));
        await page.addInitScript(({ selectedLanguage, selectedTheme }) => {
          localStorage.setItem('nameforge_settings', JSON.stringify({
            language: selectedLanguage, theme: selectedTheme,
            defaultGenLanguage: 'auto', textSize: 'normal',
          }));
        }, { selectedLanguage: language, selectedTheme: theme });
        const response = await page.goto(baseUrl + view.hash, { waitUntil: 'networkidle', timeout: 45000 });
        await page.waitForTimeout(300);
        const state = await page.evaluate(() => ({
          text: (document.body?.innerText || '').trim(),
          title: document.title,
          htmlLang: document.documentElement.lang,
          htmlDir: document.documentElement.dir,
          width: document.documentElement.scrollWidth,
          viewport: window.innerWidth,
          headings: [...document.querySelectorAll('h1,h2')].slice(0, 12).map((el) => (el.textContent || '').trim()),
          cards: [...document.querySelectorAll('article h2')].map((el) => (el.textContent || '').trim()),
          frenchMarkers: [
            'Générateur de Noms', 'Comment choisir', 'Avantages clés',
            'Points de vigilance', 'Applications & Univers Recommandés',
            'Explorer d’autres catégories', 'Générateur de noms',
          ].filter((marker) => (document.body?.innerText || '').includes(marker)),
        }));
        const label = view.name + '-' + language + '-' + theme;
        const screenshotPath = outputDir + '/' + label + '.png';
        await page.screenshot({ path: screenshotPath, fullPage: false, animations: 'disabled' });
        if (!response || response.status() >= 400) failures.push(label + ': HTTP response failed');
        if (state.text.length < 100) failures.push(label + ': likely blank or incomplete page');
        if (state.width > state.viewport + 2) failures.push(label + ': horizontal overflow');
        if (state.htmlLang !== language) failures.push(label + ': html lang mismatch (' + state.htmlLang + ')');
        const expectedDir = expectedRtlLanguages.has(language) ? 'rtl' : 'ltr';
        if (state.htmlDir !== expectedDir) failures.push(label + ': expected dir=' + expectedDir + ', got ' + state.htmlDir);
        if (pageErrors.length) failures.push(label + ': JavaScript page errors: ' + pageErrors.join(' | '));
        if (view.name === 'catalog-localization' && await page.locator('article').count() !== 234) {
          failures.push(label + ': expected 234 generator cards, found ' + await page.locator('article').count());
        }
        // Preserve visible text samples in the report for language-by-language review.
        // These are diagnostic findings, not automatic failures: proper nouns and
        // intentionally source-language name examples must not be translated blindly.
        localizationFindings.push({
          language, theme, view: view.name, title: state.title,
          headings: state.headings, generatorCardTitles: state.cards,
          potentialFrenchFallbackMarkers: language === 'fr' ? [] : state.frenchMarkers,
          htmlLang: state.htmlLang, htmlDir: state.htmlDir,
        });
        results.push({
          view: view.name, language, theme, viewport: 'desktop',
          status: response?.status() ?? null, textCharacters: state.text.length,
          documentWidth: state.width, viewportWidth: state.viewport,
          pageErrors, screenshot: screenshotPath,
        });
        await page.close();
      }
    }
  }

} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}

const report = { baseUrl, testedCombinations: results.length, failures, localizationFindings, results };
await (await import('node:fs/promises')).writeFile(outputDir + '/report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
