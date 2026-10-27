import React, { useEffect, useState } from 'react';
import { ALL_GENERATORS_LIST, GENERATOR_FAMILIES_CONFIG } from '../data/generators';
import { GeneratorId } from '../types';
import { Logo } from './Logo';
import { getAppSettings, subscribeToSettings } from '../services/settings';
import { getTranslations } from '../i18n';
import { getLocalizedGeneratorShortTitle } from '../i18n/generatorTitles';
import { ShieldAlert, Facebook } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, generatorId?: GeneratorId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState(getAppSettings());

  useEffect(() => subscribeToSettings(setSettings), []);

  const t = getTranslations(settings.language).footer;
  const footerLabels: Record<string, { studio: string; favorites: string; catalog: string; home: string; all: string; names: string; generators: string; styles: string; free: string }> = {
    fr: { studio: 'Studio de style (Unicode & Canvas)', favorites: 'Favoris et notes', catalog: 'Catalogue', home: 'Accueil', all: 'Tous les générateurs', names: 'Mes noms', generators: 'Générateurs', styles: 'Styles', free: '100 % gratuit et local' },
    en: { studio: 'Style Studio (Unicode & Canvas)', favorites: 'Favorites & Notes', catalog: 'Catalog', home: 'Home', all: 'All generators', names: 'My names', generators: 'Generators', styles: 'Styles', free: '100% free & local' },
    ar: { studio: 'استوديو الأنماط (Unicode وCanvas)', favorites: 'المفضلة والملاحظات', catalog: 'الفهرس', home: 'الرئيسية', all: 'جميع المولدات', names: 'أسمائي', generators: 'مولدات الأسماء', styles: 'الأنماط', free: 'مجاني ومحلي 100٪' },
    es: { studio: 'Estudio de estilo (Unicode y Canvas)', favorites: 'Favoritos y notas', catalog: 'Catálogo', home: 'Inicio', all: 'Todos los generadores', names: 'Mis nombres', generators: 'Generadores', styles: 'Estilos', free: '100 % gratis y local' },
    de: { studio: 'Style-Studio (Unicode & Canvas)', favorites: 'Favoriten & Notizen', catalog: 'Katalog', home: 'Startseite', all: 'Alle Generatoren', names: 'Meine Namen', generators: 'Generatoren', styles: 'Stile', free: '100 % kostenlos & lokal' },
    it: { studio: 'Studio Stile (Unicode & Canvas)', favorites: 'Preferiti e note', catalog: 'Catalogo', home: 'Home', all: 'Tutti i generatori', names: 'I miei nomi', generators: 'Generatori', styles: 'Stili', free: '100% gratuito e locale' },
    pt: { studio: 'Estúdio de estilo (Unicode & Canvas)', favorites: 'Favoritos e notas', catalog: 'Catálogo', home: 'Início', all: 'Todos os geradores', names: 'Meus nomes', generators: 'Geradores', styles: 'Estilos', free: '100% gratuito e local' },
    tr: { studio: 'Stil Stüdyosu (Unicode & Canvas)', favorites: 'Favoriler ve Notlar', catalog: 'Katalog', home: 'Ana sayfa', all: 'Tüm oluşturucular', names: 'İsimlerim', generators: 'Oluşturucular', styles: 'Stiller', free: '%100 ücretsiz ve yerel' },
    ja: { studio: 'スタイルスタジオ (Unicode & Canvas)', favorites: 'お気に入りとメモ', catalog: 'カタログ', home: 'ホーム', all: 'すべてのジェネレーター', names: 'マイネーム', generators: 'ジェネレーター', styles: 'スタイル', free: '完全無料・ローカル' },
    ko: { studio: '스타일 스튜디오 (Unicode & Canvas)', favorites: '즐겨찾기 및 메모', catalog: '카탈로그', home: '홈', all: '모든 생성기', names: '내 이름', generators: '생성기', styles: '스타일', free: '100% 무료 및 로컬' },
    nl: { studio: 'Stijlstudio (Unicode & Canvas)', favorites: 'Favorieten en notities', catalog: 'Catalogus', home: 'Home', all: 'Alle generatoren', names: 'Mijn namen', generators: 'Generatoren', styles: 'Stijlen', free: '100% gratis en lokaal' },
    pl: { studio: 'Studio stylu (Unicode i Canvas)', favorites: 'Ulubione i notatki', catalog: 'Katalog', home: 'Strona główna', all: 'Wszystkie generatory', names: 'Moje nazwy', generators: 'Generatory', styles: 'Style', free: '100% bezpłatnie i lokalnie' },
    sv: { studio: 'Stilstudio (Unicode och Canvas)', favorites: 'Favoriter och anteckningar', catalog: 'Katalog', home: 'Hem', all: 'Alla generatorer', names: 'Mina namn', generators: 'Generatorer', styles: 'Stilar', free: '100 % gratis och lokalt' },
    vi: { studio: 'Studio phong cách (Unicode & Canvas)', favorites: 'Yêu thích và ghi chú', catalog: 'Danh mục', home: 'Trang chủ', all: 'Tất cả trình tạo', names: 'Tên của tôi', generators: 'Trình tạo', styles: 'Kiểu', free: 'Miễn phí và cục bộ 100%' },
    id: { studio: 'Studio Gaya (Unicode & Canvas)', favorites: 'Favorit & Catatan', catalog: 'Katalog', home: 'Beranda', all: 'Semua generator', names: 'Nama saya', generators: 'Generator', styles: 'Gaya', free: '100% gratis dan lokal' },
    th: { studio: 'สตูดิโอสไตล์ (Unicode & Canvas)', favorites: 'รายการโปรดและบันทึก', catalog: 'แค็ตตาล็อก', home: 'หน้าแรก', all: 'เครื่องมือสร้างทั้งหมด', names: 'ชื่อของฉัน', generators: 'เครื่องมือสร้าง', styles: 'สไตล์', free: 'ฟรีและทำงานในเครื่อง 100%' },
    el: { studio: 'Εργαστήριο στυλ (Unicode & Canvas)', favorites: 'Αγαπημένα και σημειώσεις', catalog: 'Κατάλογος', home: 'Αρχική', all: 'Όλες οι γεννήτριες', names: 'Τα ονόματά μου', generators: 'Γεννήτριες', styles: 'Στυλ', free: '100% δωρεάν και τοπικά' },
    he: { studio: 'סטודיו סגנון (Unicode ו-Canvas)', favorites: 'מועדפים והערות', catalog: 'קטלוג', home: 'דף הבית', all: 'כל המחוללים', names: 'השמות שלי', generators: 'מחוללים', styles: 'סגנונות', free: 'חינם ומקומי ב-100%' },
    cs: { studio: 'Studio stylu (Unicode a Canvas)', favorites: 'Oblíbené a poznámky', catalog: 'Katalog', home: 'Domů', all: 'Všechny generátory', names: 'Moje názvy', generators: 'Generátory', styles: 'Styly', free: '100% zdarma a lokálně' },
    ro: { studio: 'Studio de stil (Unicode și Canvas)', favorites: 'Favorite și notițe', catalog: 'Catalog', home: 'Acasă', all: 'Toate generatoarele', names: 'Numele mele', generators: 'Generatoare', styles: 'Stiluri', free: '100% gratuit și local' },
    da: { studio: 'Stilstudie (Unicode og Canvas)', favorites: 'Favoritter og noter', catalog: 'Katalog', home: 'Hjem', all: 'Alle generatorer', names: 'Mine navne', generators: 'Generatorer', styles: 'Stilarter', free: '100 % gratis og lokalt' },
    fi: { studio: 'Tyylistudio (Unicode ja Canvas)', favorites: 'Suosikit ja muistiinpanot', catalog: 'Luettelo', home: 'Etusivu', all: 'Kaikki generaattorit', names: 'Omat nimet', generators: 'Generaattorit', styles: 'Tyylit', free: '100 % maksuton ja paikallinen' },
    zh: { studio: '样式工作室 (Unicode 与 Canvas)', favorites: '收藏与备注', catalog: '目录', home: '首页', all: '所有生成器', names: '我的名称', generators: '生成器', styles: '样式', free: '100% 免费且本地运行' },
    ru: { studio: 'Студия стилей (Unicode и Canvas)', favorites: 'Избранное и заметки', catalog: 'Каталог', home: 'Главная', all: 'Все генераторы', names: 'Мои имена', generators: 'Генераторы', styles: 'Стили', free: 'Бесплатно и локально на 100%' },
    hi: { studio: 'स्टाइल स्टूडियो (Unicode और Canvas)', favorites: 'पसंदीदा और नोट्स', catalog: 'कैटलॉग', home: 'होम', all: 'सभी जनरेटर', names: 'मेरे नाम', generators: 'जनरेटर', styles: 'शैलियाँ', free: '100% मुफ़्त और स्थानीय' },
  };
  const labels = footerLabels[settings.language] || footerLabels.en;
  const isRtlLanguage = ['ar', 'he', 'fa', 'ur', 'ps'].includes(settings.language);

  const fantasyGens = ALL_GENERATORS_LIST.filter((g) => g.category === 'fantasy').slice(0, 5);
  const businessGens = ALL_GENERATORS_LIST.filter((g) => g.category === 'business').slice(0, 5);
  const creativeGens = ALL_GENERATORS_LIST.filter((g) => g.category === 'creative').slice(0, 5);

  return (
    <footer lang={settings.language} dir={isRtlLanguage ? 'rtl' : 'ltr'} className="border-t border-white/5 bg-[#05070e] py-14 mt-20 text-slate-400">
      <div className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="cursor-pointer text-start focus:outline-none"
            >
              <Logo size="lg" />
            </button>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {t.tagline}
            </p>

            <a
              href="https://web.facebook.com/profile.php?id=61593116982219"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook — NameForge"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-300 transition hover:border-blue-400/60 hover:bg-blue-500/20 hover:text-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <Facebook className="h-4 w-4" aria-hidden="true" />
              <span>Facebook</span>
              <span className="sr-only"> — NameForge</span>
            </a>
            <div className="text-xs text-purple-400 font-semibold pt-1">
              ✨ {ALL_GENERATORS_LIST.length} {labels.generators} • {getTranslations(settings.language).hero.fastStatStyles} • {labels.free}
            </div>
            {/* Legal Notice */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2 max-w-md">
              <ShieldAlert className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>{t.legalNote}</span>
            </div>
          </div>

          {/* Fantasy Column */}
          <div>
            <h4 className="nf-footer-heading text-xs font-bold uppercase tracking-wider mb-4">
              {t.exploreTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              {fantasyGens.map((gen) => (
                <li key={gen.id}>
                  <button
                    onClick={() => onNavigate('generator-detail', gen.id)}
                    className="hover:text-purple-300 transition flex items-center gap-1.5 cursor-pointer text-start"
                  >
                    <span>{gen.icon}</span>
                    <span>{getLocalizedGeneratorShortTitle(gen.id, settings.language, gen.shortTitle)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Column */}
          <div>
            <h4 className="nf-footer-heading text-xs font-bold uppercase tracking-wider mb-4">
              {t.businessTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              {businessGens.map((gen) => (
                <li key={gen.id}>
                  <button
                    onClick={() => onNavigate('generator-detail', gen.id)}
                    className="hover:text-purple-300 transition flex items-center gap-1.5 cursor-pointer text-start"
                  >
                    <span>{gen.icon}</span>
                    <span>{getLocalizedGeneratorShortTitle(gen.id, settings.language, gen.shortTitle)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Creative & Tools Column */}
          <div>
            <h4 className="nf-footer-heading text-xs font-bold uppercase tracking-wider mb-4">
              {t.creativeTitle}
            </h4>
            <ul className="space-y-2 text-xs mb-6">
              {creativeGens.map((gen) => (
                <li key={gen.id}>
                  <button
                    onClick={() => onNavigate('generator-detail', gen.id)}
                    className="hover:text-purple-300 transition flex items-center gap-1.5 cursor-pointer text-start"
                  >
                    <span>{gen.icon}</span>
                    <span>{getLocalizedGeneratorShortTitle(gen.id, settings.language, gen.shortTitle)}</span>
                  </button>
                </li>
              ))}
            </ul>

            <h4 className="nf-footer-heading text-xs font-bold uppercase tracking-wider mb-2">
              {t.toolsTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('style-studio')}
                  className="hover:text-pink-300 transition flex items-center gap-1.5 cursor-pointer text-pink-400"
                >
                  <span>✨</span>
                  <span>{labels.studio}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-names')}
                  className="hover:text-purple-300 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>📁</span>
                  <span>{labels.favorites}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('generators')}
                  className="hover:text-purple-300 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🔍</span>
                  <span>{labels.catalog} ({ALL_GENERATORS_LIST.length})</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} NameForge. {t.rights}
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-slate-400 transition cursor-pointer"
            >
              {labels.home}
            </button>
            <button
              onClick={() => onNavigate('generators')}
              className="hover:text-slate-400 transition cursor-pointer"
            >
              {labels.all}
            </button>
            <button
              onClick={() => onNavigate('my-names')}
              className="hover:text-slate-400 transition cursor-pointer"
            >
              {labels.names}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
