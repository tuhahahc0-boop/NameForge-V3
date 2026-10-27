type SeoPage = 'home' | 'generators' | 'my-names' | 'style-studio' | 'generator-detail';

const COPY: Record<string, {
  home: string;
  generators: string;
  myNames: string;
  styleStudio: string;
  generator: string;
  locale: string;
}> = {
  en: { home: 'Discover 234+ free name generators for brands, characters, games and creative projects.', generators: 'Browse NameForge name generators by category and find the right tool for your next idea.', myNames: 'Review your saved names, favorites and notes in NameForge.', styleStudio: 'Transform text with creative typography and Unicode styles using NameForge.', generator: 'Generate distinctive names with the {title} on NameForge. Explore ideas, save favorites and find inspiration for your next project.', locale: 'en_US' },
  fr: { home: 'Découvrez plus de 234 générateurs de noms gratuits pour les marques, personnages, jeux et projets créatifs.', generators: 'Parcourez les générateurs de noms NameForge par catégorie et trouvez l’outil adapté à votre idée.', myNames: 'Retrouvez vos noms enregistrés, favoris et notes dans NameForge.', styleStudio: 'Transformez vos textes avec des styles typographiques et Unicode créatifs.', generator: 'Créez des noms originaux avec {title} sur NameForge. Explorez des idées et trouvez l’inspiration pour votre projet.', locale: 'fr_FR' },
  es: { home: 'Descubre más de 234 generadores de nombres gratis para marcas, personajes, juegos y proyectos creativos.', generators: 'Explora los generadores de nombres de NameForge por categoría y encuentra la herramienta ideal.', myNames: 'Consulta tus nombres guardados, favoritos y notas en NameForge.', styleStudio: 'Transforma texto con tipografías creativas y estilos Unicode.', generator: 'Genera nombres originales con {title} en NameForge y encuentra inspiración para tu próximo proyecto.', locale: 'es_ES' },
  de: { home: 'Entdecke über 234 kostenlose Namensgeneratoren für Marken, Figuren, Spiele und kreative Projekte.', generators: 'Durchsuche die NameForge-Namensgeneratoren nach Kategorie und finde das passende Werkzeug.', myNames: 'Verwalte gespeicherte Namen, Favoriten und Notizen in NameForge.', styleStudio: 'Verwandle Texte mit kreativer Typografie und Unicode-Stilen.', generator: 'Erstelle einzigartige Namen mit {title} auf NameForge und finde Inspiration für dein nächstes Projekt.', locale: 'de_DE' },
  it: { home: 'Scopri oltre 234 generatori di nomi gratuiti per marchi, personaggi, giochi e progetti creativi.', generators: 'Esplora i generatori di nomi NameForge per categoria e trova lo strumento giusto.', myNames: 'Consulta i nomi salvati, i preferiti e le note in NameForge.', styleStudio: 'Trasforma il testo con tipografia creativa e stili Unicode.', generator: 'Crea nomi originali con {title} su NameForge e trova ispirazione per il tuo prossimo progetto.', locale: 'it_IT' },
  pt: { home: 'Descubra mais de 234 geradores de nomes gratuitos para marcas, personagens, jogos e projetos criativos.', generators: 'Explore os geradores de nomes NameForge por categoria e encontre a ferramenta ideal.', myNames: 'Consulte seus nomes salvos, favoritos e notas no NameForge.', styleStudio: 'Transforme textos com tipografia criativa e estilos Unicode.', generator: 'Crie nomes originais com {title} no NameForge e encontre inspiração para seu próximo projeto.', locale: 'pt_PT' },
  ar: { home: 'اكتشف أكثر من 234 مولّد أسماء مجانيًا للعلامات التجارية والشخصيات والألعاب والمشاريع الإبداعية.', generators: 'تصفّح مولّدات الأسماء في NameForge حسب الفئة واعثر على الأداة المناسبة.', myNames: 'راجع الأسماء المحفوظة والمفضلة والملاحظات في NameForge.', styleStudio: 'حوّل النصوص باستخدام خطوط إبداعية وأنماط Unicode.', generator: 'أنشئ أسماء مميزة باستخدام {title} على NameForge واستلهم أفكارًا لمشروعك القادم.', locale: 'ar' },
  tr: { home: 'Markalar, karakterler, oyunlar ve yaratıcı projeler için 234’ten fazla ücretsiz isim oluşturucu keşfet.', generators: 'NameForge isim oluşturucularına kategorilere göre göz at ve doğru aracı bul.', myNames: 'Kaydettiğin isimleri, favorileri ve notları NameForge’da görüntüle.', styleStudio: 'Metinleri yaratıcı tipografi ve Unicode stilleriyle dönüştür.', generator: 'NameForge üzerinde {title} ile özgün isimler oluştur ve yeni projen için ilham bul.', locale: 'tr_TR' },
  ja: { home: 'ブランド、キャラクター、ゲーム、創作プロジェクト向けの234種類以上の無料名前ジェネレーター。', generators: 'NameForgeの名前ジェネレーターをカテゴリ別に探して、最適なツールを見つけましょう。', myNames: 'NameForgeで保存した名前、お気に入り、メモを確認できます。', styleStudio: 'クリエイティブな文字デザインとUnicodeスタイルでテキストを変換。', generator: 'NameForgeの{title}で個性的な名前を作成し、次のプロジェクトのアイデアを見つけましょう。', locale: 'ja_JP' },
  ko: { home: '브랜드, 캐릭터, 게임 및 창작 프로젝트를 위한 234개 이상의 무료 이름 생성기.', generators: 'NameForge 이름 생성기를 카테고리별로 살펴보고 적합한 도구를 찾아보세요.', myNames: 'NameForge에서 저장한 이름, 즐겨찾기 및 메모를 확인하세요.', styleStudio: '창의적인 타이포그래피와 유니코드 스타일로 텍스트를 변환하세요.', generator: 'NameForge의 {title}로 독창적인 이름을 만들고 다음 프로젝트의 영감을 얻으세요.', locale: 'ko_KR' },
  zh: { home: '探索 234 多种免费名称生成器，适用于品牌、角色、游戏和创意项目。', generators: '按类别浏览 NameForge 名称生成器，找到适合你创意的工具。', myNames: '查看你在 NameForge 中保存的名称、收藏和备注。', styleStudio: '使用创意排版和 Unicode 样式转换文本。', generator: '使用 NameForge 的{title}生成独特名称，为下一个项目寻找灵感。', locale: 'zh_CN' },
  ru: { home: 'Более 234 бесплатных генераторов имён для брендов, персонажей, игр и творческих проектов.', generators: 'Просматривайте генераторы имён NameForge по категориям и выбирайте подходящий инструмент.', myNames: 'Просматривайте сохранённые имена, избранное и заметки в NameForge.', styleStudio: 'Преобразуйте текст с помощью творческой типографики и стилей Unicode.', generator: 'Создавайте уникальные имена с помощью «{title}» в NameForge и находите идеи для проекта.', locale: 'ru_RU' },
  hi: { home: 'ब्रांड, पात्रों, गेम और रचनात्मक परियोजनाओं के लिए 234 से अधिक मुफ़्त नाम जनरेटर।', generators: 'NameForge के नाम जनरेटर श्रेणी के अनुसार देखें और सही टूल चुनें।', myNames: 'NameForge में सहेजे गए नाम, पसंदीदा और नोट्स देखें।', styleStudio: 'रचनात्मक टाइपोग्राफी और Unicode शैलियों से टेक्स्ट बदलें।', generator: 'NameForge के {title} से अनोखे नाम बनाएँ और अपने अगले प्रोजेक्ट के लिए प्रेरणा पाएँ।', locale: 'hi_IN' },
  nl: { home: 'Ontdek 234+ gratis naamgeneratoren voor merken, personages, games en creatieve projecten.', generators: 'Bekijk NameForge-naamgeneratoren per categorie en vind de juiste tool.', myNames: 'Bekijk opgeslagen namen, favorieten en notities in NameForge.', styleStudio: 'Transformeer tekst met creatieve typografie en Unicode-stijlen.', generator: 'Genereer unieke namen met {title} op NameForge en vind inspiratie voor je volgende project.', locale: 'nl_NL' },
  pl: { home: 'Odkryj ponad 234 darmowe generatory nazw dla marek, postaci, gier i kreatywnych projektów.', generators: 'Przeglądaj generatory nazw NameForge według kategorii i znajdź odpowiednie narzędzie.', myNames: 'Przeglądaj zapisane nazwy, ulubione i notatki w NameForge.', styleStudio: 'Przekształcaj tekst za pomocą kreatywnej typografii i stylów Unicode.', generator: 'Twórz wyjątkowe nazwy za pomocą {title} w NameForge i znajdź inspirację do kolejnego projektu.', locale: 'pl_PL' },
  sv: { home: 'Upptäck över 234 kostnadsfria namnverktyg för varumärken, karaktärer, spel och kreativa projekt.', generators: 'Bläddra bland NameForge-namngeneratorer efter kategori och hitta rätt verktyg.', myNames: 'Se sparade namn, favoriter och anteckningar i NameForge.', styleStudio: 'Förvandla text med kreativ typografi och Unicode-stilar.', generator: 'Skapa unika namn med {title} på NameForge och hitta inspiration till nästa projekt.', locale: 'sv_SE' },
  vi: { home: 'Khám phá hơn 234 công cụ tạo tên miễn phí cho thương hiệu, nhân vật, trò chơi và dự án sáng tạo.', generators: 'Duyệt các công cụ tạo tên NameForge theo danh mục để tìm công cụ phù hợp.', myNames: 'Xem tên đã lưu, mục yêu thích và ghi chú trong NameForge.', styleStudio: 'Biến đổi văn bản bằng kiểu chữ sáng tạo và phong cách Unicode.', generator: 'Tạo tên độc đáo với {title} trên NameForge và tìm cảm hứng cho dự án tiếp theo.', locale: 'vi_VN' },
  id: { home: 'Jelajahi 234+ generator nama gratis untuk merek, karakter, game, dan proyek kreatif.', generators: 'Jelajahi generator nama NameForge berdasarkan kategori dan temukan alat yang tepat.', myNames: 'Lihat nama tersimpan, favorit, dan catatan di NameForge.', styleStudio: 'Ubah teks dengan tipografi kreatif dan gaya Unicode.', generator: 'Buat nama unik dengan {title} di NameForge dan temukan inspirasi untuk proyek berikutnya.', locale: 'id_ID' },
  th: { home: 'ค้นพบเครื่องมือสร้างชื่อฟรีกว่า 234 แบบสำหรับแบรนด์ ตัวละคร เกม และโปรเจกต์สร้างสรรค์', generators: 'เลือกดูเครื่องมือสร้างชื่อ NameForge ตามหมวดหมู่และค้นหาเครื่องมือที่เหมาะสม', myNames: 'ดูชื่อที่บันทึก รายการโปรด และบันทึกใน NameForge', styleStudio: 'เปลี่ยนข้อความด้วยรูปแบบตัวอักษรสร้างสรรค์และ Unicode', generator: 'สร้างชื่อที่โดดเด่นด้วย {title} บน NameForge และค้นหาแรงบันดาลใจสำหรับโปรเจกต์ถัดไป', locale: 'th_TH' },
  el: { home: 'Ανακάλυψε πάνω από 234 δωρεάν γεννήτριες ονομάτων για brands, χαρακτήρες, παιχνίδια και δημιουργικά έργα.', generators: 'Περιηγήσου στις γεννήτριες ονομάτων του NameForge ανά κατηγορία.', myNames: 'Δες αποθηκευμένα ονόματα, αγαπημένα και σημειώσεις στο NameForge.', styleStudio: 'Μεταμόρφωσε κείμενο με δημιουργική τυπογραφία και στυλ Unicode.', generator: 'Δημιούργησε μοναδικά ονόματα με το {title} στο NameForge και βρες έμπνευση για το επόμενο έργο σου.', locale: 'el_GR' },
  he: { home: 'גלו יותר מ־234 מחוללי שמות חינמיים למותגים, דמויות, משחקים ופרויקטים יצירתיים.', generators: 'עיינו במחוללי השמות של NameForge לפי קטגוריה ומצאו את הכלי המתאים.', myNames: 'צפו בשמות השמורים, במועדפים ובהערות שלכם ב־NameForge.', styleStudio: 'הפכו טקסט באמצעות טיפוגרפיה יצירתית וסגנונות Unicode.', generator: 'צרו שמות ייחודיים באמצעות {title} ב־NameForge ומצאו השראה לפרויקט הבא.', locale: 'he_IL' },
  cs: { home: 'Objevte více než 234 bezplatných generátorů jmen pro značky, postavy, hry a kreativní projekty.', generators: 'Procházejte generátory jmen NameForge podle kategorií a najděte správný nástroj.', myNames: 'Prohlížejte uložená jména, oblíbené položky a poznámky v NameForge.', styleStudio: 'Proměňujte text pomocí kreativní typografie a stylů Unicode.', generator: 'Vytvářejte jedinečná jména pomocí {title} na NameForge a najděte inspiraci pro další projekt.', locale: 'cs_CZ' },
  ro: { home: 'Descoperă peste 234 de generatoare gratuite de nume pentru mărci, personaje, jocuri și proiecte creative.', generators: 'Explorează generatoarele de nume NameForge pe categorii și găsește instrumentul potrivit.', myNames: 'Consultă numele salvate, favoritele și notițele din NameForge.', styleStudio: 'Transformă textul cu tipografie creativă și stiluri Unicode.', generator: 'Creează nume unice cu {title} pe NameForge și găsește inspirație pentru următorul proiect.', locale: 'ro_RO' },
  da: { home: 'Udforsk mere end 234 gratis navnegeneratorer til brands, figurer, spil og kreative projekter.', generators: 'Gennemse NameForge-navnegeneratorer efter kategori, og find det rette værktøj.', myNames: 'Se gemte navne, favoritter og noter i NameForge.', styleStudio: 'Forvandl tekst med kreativ typografi og Unicode-stile.', generator: 'Skab unikke navne med {title} på NameForge, og find inspiration til dit næste projekt.', locale: 'da_DK' },
  fi: { home: 'Tutustu yli 234 ilmaiseen nimigeneraattoriin brändeille, hahmoille, peleille ja luoville projekteille.', generators: 'Selaa NameForgen nimigeneraattoreita kategorioittain ja löydä sopiva työkalu.', myNames: 'Tarkastele NameForgeen tallennettuja nimiä, suosikkeja ja muistiinpanoja.', styleStudio: 'Muunna tekstiä luovalla typografialla ja Unicode-tyyleillä.', generator: 'Luo omaperäisiä nimiä NameForgen työkalulla {title} ja löydä inspiraatiota seuraavaan projektiisi.', locale: 'fi_FI' },
};

const FALLBACK = COPY.en;

export function getSeoDescription(page: SeoPage, language: string, generatorTitle?: string): string {
  const copy = COPY[language] || FALLBACK;
  if (page === 'generators') return copy.generators;
  if (page === 'my-names') return copy.myNames;
  if (page === 'style-studio') return copy.styleStudio;
  if (page === 'generator-detail') return copy.generator.replace('{title}', generatorTitle || 'Name Generator');
  return copy.home;
}

export function getOpenGraphLocale(language: string): string {
  return (COPY[language] || FALLBACK).locale;
}

export function setMetaContent(selector: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    if (selector.startsWith('meta[property=')) {
      const property = selector.match(/property="([^"]+)"/)?.[1];
      if (property) element.setAttribute('property', property);
    } else {
      const name = selector.match(/name="([^"]+)"/)?.[1];
      if (name) element.setAttribute('name', name);
    }
    document.head.appendChild(element);
  }
  element.content = content;
}
