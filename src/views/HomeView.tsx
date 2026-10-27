import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  BookOpen,
  Compass,
  ChevronDown,
  Search,
  Star,
  Copy,
  Check,
  Bookmark,
  Layers,
  Award,
  HelpCircle,
  TrendingUp,
  Cpu,
  Flame,
  Globe,
  Sliders,
  Lock,
  Dices,
  RefreshCw,
  Wand2,
} from 'lucide-react';
import { ALL_GENERATORS_LIST, GENERATOR_FAMILIES_CONFIG, GENERATORS_METADATA } from '../data/generators';
import { getLocalizedFaq } from '../i18n/localizedFaq';
import { GeneratedName, GeneratorFamily, GeneratorId, SavedNameEntry } from '../types';
import { getSavedNames, subscribeToStorage } from '../services/storage';
import { getAppSettings, subscribeToSettings } from '../services/settings';
import { getTranslations } from '../i18n';
import { getLocalizedGeneratorDescription } from '../i18n/generatorContent';
import { getShellLabels } from '../i18n/shell';
import { getLocalizedGeneratorTitle, getLocalizedGeneratorShortTitle } from '../i18n/generatorTitles';
import { NameCard } from '../components/NameCard';

interface HomeViewProps {
  onNavigate: (view: string, generatorId?: GeneratorId) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState(getAppSettings());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [faqCategory, setFaqCategory] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [savedEntries, setSavedEntries] = useState<SavedNameEntry[]>([]);
  const [copiedName, setCopiedName] = useState<string | null>(null);

  // Quick Express Forge state
  const [quickGenId, setQuickGenId] = useState<GeneratorId>('brand');
  const [quickKeyword, setQuickKeyword] = useState('');
  const [quickResults, setQuickResults] = useState<GeneratedName[]>([]);
  const [quickGenerating, setQuickGenerating] = useState(false);

  const t = getTranslations(settings.language);
  const familyLabels = getShellLabels(settings.language).families;
  const quickForgeCopy: Record<string, { badge: string; title: string; description: string; regenerate: string; categories: string[]; random?: string; randomTitle?: string }> = {
    fr: { badge: 'FORGE EXPRESS DIRECTE', title: 'Essayez NameForge en 1 clic', description: 'Sélectionnez un univers, tapez un mot-clé (optionnel) et forgez 3 identités en direct.', regenerate: 'Forger à nouveau', categories: ['Marque & Business', 'Fantasy & Héros', 'Startup & Tech', 'Dragon & Mythe', 'Noms & Prénoms', 'Pseudo & Gamer', 'Resto & Café', 'Agent & IA'] },
    en: { badge: 'QUICK NAME FORGE', title: 'Try NameForge in one click', description: 'Choose a universe, enter an optional keyword, and forge 3 identities instantly.', regenerate: 'Forge again', categories: ['Brand & Business', 'Fantasy & Heroes', 'Startup & Tech', 'Dragon & Myth', 'Baby Names', 'Gamertags', 'Restaurant & Café', 'AI Agent'] },
    es: { badge: 'GENERADOR RÁPIDO', title: 'Prueba NameForge con un clic', description: 'Elige un universo, escribe una palabra opcional y genera 3 identidades al instante.', regenerate: 'Generar de nuevo', categories: ['Marca y negocios', 'Fantasía y héroes', 'Startup y tecnología', 'Dragón y mito', 'Nombres', 'Gamertags', 'Restaurante y café', 'Agente IA'] },
    de: { badge: 'SCHNELLGENERATOR', title: 'NameForge mit einem Klick testen', description: 'Wähle ein Universum, gib optional ein Stichwort ein und erstelle sofort 3 Namen.', regenerate: 'Erneut generieren', categories: ['Marke & Business', 'Fantasy & Helden', 'Startup & Technik', 'Drache & Mythos', 'Vornamen', 'Gamertags', 'Restaurant & Café', 'KI-Agent'] },
    ar: { badge: 'توليد سريع للأسماء', title: 'جرّب NameForge بنقرة واحدة', description: 'اختر عالمًا واكتب كلمة اختيارية وأنشئ 3 هويات فورًا.', regenerate: 'أنشئ من جديد', categories: ['العلامات والأعمال', 'الخيال والأبطال', 'الشركات والتقنية', 'التنين والأساطير', 'أسماء الأطفال', 'أسماء اللاعبين', 'مطعم ومقهى', 'وكيل ذكاء اصطناعي'] },
    pt: { badge: 'GERADOR RÁPIDO', title: 'Experimente o NameForge com um clique', description: 'Escolha um universo, digite uma palavra opcional e gere 3 identidades na hora.', regenerate: 'Gerar novamente', categories: ['Marca e negócios', 'Fantasia e heróis', 'Startup e tecnologia', 'Dragão e mito', 'Nomes próprios', 'Gamertags', 'Restaurante e café', 'Agente de IA'] },
    it: { badge: 'GENERATORE RAPIDO', title: 'Prova NameForge con un clic', description: 'Scegli un universo, inserisci una parola facoltativa e crea subito 3 identità.', regenerate: 'Genera di nuovo', categories: ['Brand e business', 'Fantasy ed eroi', 'Startup e tecnologia', 'Drago e mito', 'Nomi propri', 'Gamertag', 'Ristorante e caffè', 'Agente IA'] },
    tr: { badge: 'HIZLI İSİM ÜRETİCİ', title: 'NameForge’u tek tıkla dene', description: 'Bir evren seç, isteğe bağlı anahtar kelime gir ve anında 3 kimlik oluştur.', regenerate: 'Yeniden oluştur', categories: ['Marka ve iş', 'Fantastik kahramanlar', 'Girişim ve teknoloji', 'Ejderha ve mit', 'İsimler', 'Oyuncu adları', 'Restoran ve kafe', 'Yapay zekâ ajanı'] },
    ja: { badge: 'クイック生成', title: 'ワンクリックでNameForgeを試す', description: '世界観を選び、任意のキーワードを入力すると、3つの名前をすぐに生成します。', regenerate: 'もう一度生成', categories: ['ブランド・ビジネス', 'ファンタジー・英雄', 'スタートアップ・技術', 'ドラゴン・神話', '名前', 'ゲーム名', 'レストラン・カフェ', 'AIエージェント'] },
    ko: { badge: '빠른 이름 생성', title: '한 번의 클릭으로 NameForge 체험', description: '세계관을 선택하고 선택적으로 키워드를 입력하면 이름 3개를 즉시 만듭니다.', regenerate: '다시 생성', categories: ['브랜드·비즈니스', '판타지·영웅', '스타트업·기술', '용·신화', '이름', '게임 닉네임', '식당·카페', 'AI 에이전트'] },
    zh: { badge: '快速命名', title: '一键体验 NameForge', description: '选择一个主题，可输入关键词，即刻生成 3 个名称。', regenerate: '再次生成', categories: ['品牌与商业', '奇幻与英雄', '初创与科技', '巨龙与神话', '人名', '游戏昵称', '餐厅与咖啡馆', 'AI 代理'] },
    ru: { badge: 'БЫСТРАЯ ГЕНЕРАЦИЯ', title: 'Попробуйте NameForge в один клик', description: 'Выберите тему, при желании введите ключевое слово и мгновенно получите 3 имени.', regenerate: 'Создать ещё', categories: ['Бренды и бизнес', 'Фэнтези и герои', 'Стартапы и технологии', 'Драконы и мифы', 'Имена', 'Игровые ники', 'Рестораны и кафе', 'ИИ-агенты'] },
    hi: { badge: 'त्वरित नाम निर्माण', title: 'एक क्लिक में NameForge आज़माएँ', description: 'एक दुनिया चुनें, चाहें तो कीवर्ड डालें और तुरंत 3 नाम बनाएँ।', regenerate: 'फिर से बनाएँ', categories: ['ब्रांड और व्यवसाय', 'फैंटेसी और नायक', 'स्टार्टअप और तकनीक', 'ड्रैगन और मिथक', 'नाम', 'गेमर टैग', 'रेस्तराँ और कैफ़े', 'AI एजेंट'] },
    nl: { badge: 'SNELLE NAMENMAKER', title: 'Probeer NameForge met één klik', description: 'Kies een wereld, voer eventueel een trefwoord in en maak direct 3 namen.', regenerate: 'Opnieuw genereren', categories: ['Merk en bedrijf', 'Fantasy en helden', 'Start-ups en tech', 'Draak en mythe', 'Voornamen', 'Gamertags', 'Restaurant en café', 'AI-agent'] },
    pl: { badge: 'SZYBKIE TWORZENIE NAZW', title: 'Wypróbuj NameForge jednym kliknięciem', description: 'Wybierz świat, opcjonalnie wpisz słowo kluczowe i od razu utwórz 3 nazwy.', regenerate: 'Generuj ponownie', categories: ['Marki i biznes', 'Fantasy i bohaterowie', 'Startupy i technologia', 'Smoki i mity', 'Imiona', 'Nicki graczy', 'Restauracje i kawiarnie', 'Agenci AI'] },
    sv: { badge: 'SNABB NAMNGENERATOR', title: 'Testa NameForge med ett klick', description: 'Välj en värld, ange valfritt ett nyckelord och skapa 3 namn direkt.', regenerate: 'Skapa igen', categories: ['Varumärken och företag', 'Fantasy och hjältar', 'Startup och teknik', 'Drakar och myter', 'Namn', 'Spelarnamn', 'Restaurang och café', 'AI-agent'] },
    vi: { badge: 'TẠO TÊN NHANH', title: 'Thử NameForge chỉ với một cú nhấp', description: 'Chọn một thế giới, nhập từ khóa tùy chọn và tạo ngay 3 tên.', regenerate: 'Tạo lại', categories: ['Thương hiệu và kinh doanh', 'Fantasy và anh hùng', 'Startup và công nghệ', 'Rồng và thần thoại', 'Tên riêng', 'Tên game thủ', 'Nhà hàng và cà phê', 'Tác nhân AI'] },
    id: { badge: 'PEMBUAT NAMA CEPAT', title: 'Coba NameForge dengan satu klik', description: 'Pilih dunia, masukkan kata kunci jika mau, lalu buat 3 nama seketika.', regenerate: 'Buat lagi', categories: ['Merek dan bisnis', 'Fantasi dan pahlawan', 'Startup dan teknologi', 'Naga dan mitos', 'Nama', 'Nama gamer', 'Restoran dan kafe', 'Agen AI'] },
    th: { badge: 'สร้างชื่ออย่างรวดเร็ว', title: 'ลองใช้ NameForge ในคลิกเดียว', description: 'เลือกโลกที่ต้องการ ใส่คำค้นหาหากต้องการ แล้วสร้างชื่อ 3 ชื่อทันที', regenerate: 'สร้างอีกครั้ง', categories: ['แบรนด์และธุรกิจ', 'แฟนตาซีและวีรบุรุษ', 'สตาร์ทอัพและเทคโนโลยี', 'มังกรและตำนาน', 'ชื่อบุคคล', 'ชื่อเกมเมอร์', 'ร้านอาหารและคาเฟ่', 'เอเจนต์ AI'] },
    el: { badge: 'ΓΡΗΓΟΡΗ ΔΗΜΙΟΥΡΓΙΑ ΟΝΟΜΑΤΩΝ', title: 'Δοκιμάστε το NameForge με ένα κλικ', description: 'Επιλέξτε έναν κόσμο, προσθέστε προαιρετικά μια λέξη-κλειδί και δημιουργήστε αμέσως 3 ονόματα.', regenerate: 'Δημιουργία ξανά', categories: ['Μάρκες και επιχειρήσεις', 'Φαντασία και ήρωες', 'Startup και τεχνολογία', 'Δράκοι και μύθοι', 'Ονόματα', 'Ψευδώνυμα παικτών', 'Εστιατόριο και καφέ', 'Πράκτορας AI'] },
    he: { badge: 'יצירת שמות מהירה', title: 'נסו את NameForge בלחיצה אחת', description: 'בחרו עולם, הוסיפו מילת מפתח אם תרצו וקבלו מיד 3 שמות.', regenerate: 'יצירה מחדש', categories: ['מותגים ועסקים', 'פנטזיה וגיבורים', 'סטארטאפים וטכנולוגיה', 'דרקונים ומיתוסים', 'שמות', 'כינויי גיימרים', 'מסעדות ובתי קפה', 'סוכן AI'] },
    cs: { badge: 'RYCHLÉ TVOŘENÍ JMEN', title: 'Vyzkoušejte NameForge jedním kliknutím', description: 'Vyberte svět, případně zadejte klíčové slovo a ihned vytvořte 3 jména.', regenerate: 'Vytvořit znovu', categories: ['Značky a podnikání', 'Fantasy a hrdinové', 'Startupy a technologie', 'Draci a mýty', 'Jména', 'Herní přezdívky', 'Restaurace a kavárny', 'AI agenti'] },
    ro: { badge: 'GENERATOR RAPID DE NUME', title: 'Încearcă NameForge cu un singur clic', description: 'Alege un univers, introdu opțional un cuvânt-cheie și generează instant 3 nume.', regenerate: 'Generează din nou', categories: ['Mărci și afaceri', 'Fantasy și eroi', 'Startup și tehnologie', 'Dragoni și mituri', 'Prenume', 'Nume de gameri', 'Restaurant și cafenea', 'Agent AI'] },
    da: { badge: 'HURTIG NAVNEGENERATOR', title: 'Prøv NameForge med ét klik', description: 'Vælg et univers, indtast eventuelt et nøgleord, og skab straks 3 navne.', regenerate: 'Generér igen', categories: ['Brands og virksomheder', 'Fantasy og helte', 'Startup og teknologi', 'Drager og myter', 'Navne', 'Gamernavne', 'Restaurant og café', 'AI-agent'] },
    fi: { badge: 'NOPEA NIMIGENERAATTORI', title: 'Kokeile NameForgea yhdellä napsautuksella', description: 'Valitse maailma, lisää halutessasi hakusana ja luo heti 3 nimeä.', regenerate: 'Luo uudelleen', categories: ['Brändit ja yritykset', 'Fantasia ja sankarit', 'Startupit ja tekniikka', 'Lohikäärmeet ja myytit', 'Etunimet', 'Pelaajanimet', 'Ravintola ja kahvila', 'Tekoälyagentti'] },
  };
  const quickCopy = quickForgeCopy[settings.language] || quickForgeCopy.en;
  const homeCtaCopy: Record<string, { title: string; description: string; browse: string; favorites: string }> = {
    en: { title: 'Ready to forge the perfect name for your project?', description: `Explore our ${ALL_GENERATORS_LIST.length} themed generators and save your favorite creations to private collections.`, browse: `Explore all ${ALL_GENERATORS_LIST.length} generators`, favorites: 'View my favorites' },
    fr: { title: 'Prêt à forger le nom idéal pour votre projet ?', description: `Explorez nos ${ALL_GENERATORS_LIST.length} générateurs thématiques et sauvegardez vos créations préférées dans vos collections privées.`, browse: `Explorer les ${ALL_GENERATORS_LIST.length} générateurs`, favorites: 'Consulter mes favoris' },
    es: { title: '¿Listo para crear el nombre ideal para tu proyecto?', description: `Explora nuestros ${ALL_GENERATORS_LIST.length} generadores temáticos y guarda tus creaciones favoritas en colecciones privadas.`, browse: `Explorar los ${ALL_GENERATORS_LIST.length} generadores`, favorites: 'Ver mis favoritos' },
    de: { title: 'Bereit, den idealen Namen für dein Projekt zu finden?', description: `Entdecke unsere ${ALL_GENERATORS_LIST.length} thematischen Generatoren und speichere deine Favoriten in privaten Sammlungen.`, browse: `Alle ${ALL_GENERATORS_LIST.length} Generatoren ansehen`, favorites: 'Meine Favoriten ansehen' },
    it: { title: 'Pronto a creare il nome ideale per il tuo progetto?', description: `Esplora i nostri ${ALL_GENERATORS_LIST.length} generatori tematici e salva le tue creazioni preferite nelle raccolte private.`, browse: `Esplora tutti i ${ALL_GENERATORS_LIST.length} generatori`, favorites: 'Visualizza i miei preferiti' },
    pt: { title: 'Pronto para criar o nome ideal para o seu projeto?', description: `Explore os nossos ${ALL_GENERATORS_LIST.length} geradores temáticos e guarde as suas criações favoritas em coleções privadas.`, browse: `Explorar todos os ${ALL_GENERATORS_LIST.length} geradores`, favorites: 'Ver os meus favoritos' },
    ar: { title: 'هل أنت مستعد لإنشاء الاسم المثالي لمشروعك؟', description: `استكشف ${ALL_GENERATORS_LIST.length} مولّدًا حسب الموضوع واحفظ إبداعاتك المفضلة في مجموعات خاصة.`, browse: `استكشف جميع المولّدات وعددها ${ALL_GENERATORS_LIST.length}`, favorites: 'عرض المفضلة' },
    tr: { title: 'Projen için ideal ismi oluşturmaya hazır mısın?', description: `Temalı ${ALL_GENERATORS_LIST.length} isim oluşturucumuzu keşfet ve favori çalışmalarını özel koleksiyonlarında sakla.`, browse: `${ALL_GENERATORS_LIST.length} oluşturucunun tümünü keşfet`, favorites: 'Favorilerimi görüntüle' },
    ja: { title: 'プロジェクトにぴったりの名前を作りませんか？', description: `${ALL_GENERATORS_LIST.length}種類のテーマ別ジェネレーターを探索し、お気に入りをプライベートコレクションに保存できます。`, browse: `${ALL_GENERATORS_LIST.length}種類すべてのジェネレーターを見る`, favorites: 'お気に入りを見る' },
    ko: { title: '프로젝트에 꼭 맞는 이름을 만들 준비가 되셨나요?', description: `테마별 생성기 ${ALL_GENERATORS_LIST.length}개를 살펴보고 마음에 드는 결과를 비공개 컬렉션에 저장하세요.`, browse: `${ALL_GENERATORS_LIST.length}개 생성기 모두 보기`, favorites: '즐겨찾기 보기' },
    zh: { title: '准备好为你的项目打造理想名称了吗？', description: `探索我们的 ${ALL_GENERATORS_LIST.length} 个主题生成器，并将喜欢的结果保存到私人收藏集中。`, browse: `浏览全部 ${ALL_GENERATORS_LIST.length} 个生成器`, favorites: '查看我的收藏' },
    ru: { title: 'Готовы подобрать идеальное имя для своего проекта?', description: `Изучите ${ALL_GENERATORS_LIST.length} тематических генераторов и сохраняйте понравившиеся варианты в личных коллекциях.`, browse: `Все генераторы: ${ALL_GENERATORS_LIST.length}`, favorites: 'Мои избранные' },
    hi: { title: 'क्या आप अपने प्रोजेक्ट के लिए सही नाम बनाने को तैयार हैं?', description: `हमारे ${ALL_GENERATORS_LIST.length} विषयगत जनरेटर देखें और पसंदीदा नाम निजी संग्रहों में सहेजें।`, browse: `सभी ${ALL_GENERATORS_LIST.length} जनरेटर देखें`, favorites: 'मेरे पसंदीदा देखें' },
    nl: { title: 'Klaar om de perfecte naam voor je project te bedenken?', description: `Ontdek onze ${ALL_GENERATORS_LIST.length} thematische generators en bewaar je favorieten in privécollecties.`, browse: `Bekijk alle ${ALL_GENERATORS_LIST.length} generators`, favorites: 'Mijn favorieten bekijken' },
    pl: { title: 'Gotowy, aby stworzyć idealną nazwę dla swojego projektu?', description: `Poznaj nasze ${ALL_GENERATORS_LIST.length} tematycznych generatorów i zapisuj ulubione propozycje w prywatnych kolekcjach.`, browse: `Zobacz wszystkie generatory (${ALL_GENERATORS_LIST.length})`, favorites: 'Zobacz moje ulubione' },
    sv: { title: 'Redo att skapa det perfekta namnet för ditt projekt?', description: `Utforska våra ${ALL_GENERATORS_LIST.length} tematiska generatorer och spara favoriter i privata samlingar.`, browse: `Utforska alla ${ALL_GENERATORS_LIST.length} generatorer`, favorites: 'Visa mina favoriter' },
    vi: { title: 'Sẵn sàng tạo tên hoàn hảo cho dự án của bạn?', description: `Khám phá ${ALL_GENERATORS_LIST.length} công cụ tạo tên theo chủ đề và lưu các lựa chọn yêu thích vào bộ sưu tập riêng.`, browse: `Khám phá tất cả ${ALL_GENERATORS_LIST.length} công cụ`, favorites: 'Xem mục yêu thích' },
    id: { title: 'Siap membuat nama yang tepat untuk proyek Anda?', description: `Jelajahi ${ALL_GENERATORS_LIST.length} generator bertema dan simpan hasil favorit dalam koleksi pribadi.`, browse: `Jelajahi semua ${ALL_GENERATORS_LIST.length} generator`, favorites: 'Lihat favorit saya' },
    th: { title: 'พร้อมสร้างชื่อที่เหมาะกับโปรเจกต์ของคุณหรือยัง?', description: `สำรวจเครื่องมือสร้างชื่อตามธีม ${ALL_GENERATORS_LIST.length} รายการ และบันทึกชื่อที่ชอบไว้ในคอลเลกชันส่วนตัว`, browse: `ดูเครื่องมือสร้างชื่อทั้งหมด ${ALL_GENERATORS_LIST.length} รายการ`, favorites: 'ดูรายการโปรดของฉัน' },
    el: { title: 'Έτοιμοι να δημιουργήσετε το ιδανικό όνομα για το έργο σας;', description: `Εξερευνήστε τις ${ALL_GENERATORS_LIST.length} θεματικές γεννήτριές μας και αποθηκεύστε τις αγαπημένες σας δημιουργίες σε ιδιωτικές συλλογές.`, browse: `Δείτε και τις ${ALL_GENERATORS_LIST.length} γεννήτριες`, favorites: 'Προβολή αγαπημένων' },
    he: { title: 'מוכנים ליצור את השם המושלם לפרויקט שלכם?', description: `גלו את ${ALL_GENERATORS_LIST.length} מחוללי השמות לפי נושא ושמרו יצירות מועדפות באוספים פרטיים.`, browse: `לכל ${ALL_GENERATORS_LIST.length} המחוללים`, favorites: 'הצגת המועדפים שלי' },
    cs: { title: 'Jste připraveni vytvořit ideální název pro svůj projekt?', description: `Prozkoumejte našich ${ALL_GENERATORS_LIST.length} tematických generátorů a ukládejte oblíbené návrhy do soukromých kolekcí.`, browse: `Prozkoumat všech ${ALL_GENERATORS_LIST.length} generátorů`, favorites: 'Zobrazit oblíbené' },
    ro: { title: 'Ești gata să creezi numele ideal pentru proiectul tău?', description: `Explorează cei ${ALL_GENERATORS_LIST.length} de generatori tematici și salvează creațiile preferate în colecții private.`, browse: `Explorează toți cei ${ALL_GENERATORS_LIST.length} de generatori`, favorites: 'Vezi favoritele mele' },
    da: { title: 'Klar til at skabe det perfekte navn til dit projekt?', description: `Udforsk vores ${ALL_GENERATORS_LIST.length} tematiske generatorer, og gem dine favoritter i private samlinger.`, browse: `Udforsk alle ${ALL_GENERATORS_LIST.length} generatorer`, favorites: 'Se mine favoritter' },
    fi: { title: 'Valmis luomaan projektiisi täydellisen nimen?', description: `Tutustu ${ALL_GENERATORS_LIST.length} teemakohtaiseen generaattoriimme ja tallenna suosikkisi yksityisiin kokoelmiin.`, browse: `Tutustu kaikkiin ${ALL_GENERATORS_LIST.length} generaattoriin`, favorites: 'Näytä suosikkini' },
  };
  const homeCta = homeCtaCopy[settings.language] || homeCtaCopy.en;

  const refreshSaved = () => {
    setSavedEntries(getSavedNames());
  };

  const handleQuickForge = (targetId?: GeneratorId) => {
    const id = targetId || quickGenId;
    setQuickGenerating(true);
    setTimeout(async () => {
      try {
        // Defer the generation engine until the quick forge actually runs,
        // allowing the Home view to render before this heavier module is fetched.
        const { generateNames } = await import('../services/generatorEngine');
        const res = generateNames({
          generator: id,
          quantity: 3,
          keyword: quickKeyword,
          // Keep the Home quick-forge action aligned with the dedicated generation-language preference.
          genLanguage: getAppSettings().defaultGenLanguage || 'auto',
        });
        setQuickResults(res);
      } finally {
        setQuickGenerating(false);
      }
    }, 100);
  };

  useEffect(() => {
    refreshSaved();
    handleQuickForge('brand');
    const unsubStorage = subscribeToStorage(refreshSaved);
    const unsubSettings = subscribeToSettings((s) => setSettings(s));
    return () => {
      unsubStorage();
      unsubSettings();
    };
  }, []);

  // Filtered generators for interactive search bar
  const searchedGenerators = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return ALL_GENERATORS_LIST.filter(
      (gen) =>
        getLocalizedGeneratorTitle(gen.id, settings.language, gen.title).toLowerCase().includes(q) || gen.title.toLowerCase().includes(q) ||
        getLocalizedGeneratorShortTitle(gen.id, settings.language, gen.shortTitle).toLowerCase().includes(q) || gen.shortTitle.toLowerCase().includes(q) ||
        getLocalizedGeneratorDescription(gen, settings.language).toLowerCase().includes(q) || gen.description.toLowerCase().includes(q) ||
        gen.badge.toLowerCase().includes(q)
    );
  }, [searchQuery, settings.language]);

  // Featured Generators: prioritize the broadest, most intuitive naming needs.
  // This is a curated editorial selection, not a live search-volume ranking.
  const featuredGenerators = useMemo(() => {
    const featuredIds: GeneratorId[] = [
      'brand',
      'baby_name',
      'gaming',
      'startup',
      'fantasy',
      'anime',
      'domain',
      'videogame',
    ];
    return featuredIds
      .map((id) => ALL_GENERATORS_LIST.find((generator) => generator.id === id))
      .filter((generator): generator is (typeof ALL_GENERATORS_LIST)[number] => Boolean(generator));
  }, []);

  // Top Rated Names calculation (Bayesian weighted based on user evaluations with fallback gems)
  const [ratedCategoryFilter, setRatedCategoryFilter] = useState<string>('all');

  // Top Rated Names calculation (based strictly on user's real star ratings, independently filterable by category)
  const topRatedItems = useMemo(() => {
    const rated = savedEntries.filter((e) => {
      const hasRating = typeof e.rating === 'number' && e.rating > 0;
      if (!hasRating) return false;
      if (ratedCategoryFilter === 'all') return true;
      const meta = GENERATORS_METADATA[e.generator as GeneratorId];
      return meta && meta.category === ratedCategoryFilter;
    });

    rated.sort((a, b) => {
      const diff = (b.rating || 0) - (a.rating || 0);
      if (diff !== 0) return diff;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return rated.slice(0, 12);
  }, [savedEntries, ratedCategoryFilter]);

  const handleCopy = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      setCopiedName(text);
      setTimeout(() => setCopiedName(null), 1400);
    } catch {
      // ignore
    }
  };


  const faqUi: Record<string, { badge: string; title: string; description: string; all: string; general: string; features: string; technical: string; legal: string }> = {
    fr: { badge: 'RÉPONSES CLAIRES & HONNÊTES', title: 'Foire aux questions', description: 'Tout ce que vous devez savoir sur le moteur, les usages légaux et vos données.', all: 'Toutes les questions (18)', general: 'Principes généraux', features: 'Fonctionnalités', technical: 'Technique & vie privée', legal: 'Aspects légaux & marques' },
    en: { badge: 'CLEAR & HONEST ANSWERS', title: 'Frequently Asked Questions', description: 'Everything you need to know about the engine, legal use, and your data.', all: 'All questions (18)', general: 'General', features: 'Features', technical: 'Technical & privacy', legal: 'Legal & trademarks' },
    ar: { badge: 'إجابات واضحة وصادقة', title: 'الأسئلة الشائعة', description: 'كل ما تحتاج إلى معرفته عن المحرك والاستخدام القانوني وبياناتك.', all: 'كل الأسئلة (18)', general: 'معلومات عامة', features: 'الميزات', technical: 'التقنية والخصوصية', legal: 'القانون والعلامات التجارية' },
    tr: { badge: 'AÇIK VE DÜRÜST YANITLAR', title: 'Sıkça Sorulan Sorular', description: 'Motor, yasal kullanım ve verileriniz hakkında bilmeniz gerekenler.', all: 'Tüm sorular (18)', general: 'Genel bilgiler', features: 'Özellikler', technical: 'Teknik ve gizlilik', legal: 'Hukuk ve markalar' },
    es: { badge: 'RESPUESTAS CLARAS Y HONESTAS', title: 'Preguntas frecuentes', description: 'Todo lo que necesitas saber sobre el motor, el uso legal y tus datos.', all: 'Todas las preguntas (18)', general: 'Información general', features: 'Funciones', technical: 'Técnica y privacidad', legal: 'Legal y marcas' },
    de: { badge: 'KLARE UND EHRLICHE ANTWORTEN', title: 'Häufig gestellte Fragen', description: 'Alles Wissenswerte über die Engine, die rechtliche Nutzung und deine Daten.', all: 'Alle Fragen (18)', general: 'Allgemeines', features: 'Funktionen', technical: 'Technik & Datenschutz', legal: 'Recht & Marken' },
    it: { badge: 'RISPOSTE CHIARE E ONESTE', title: 'Domande frequenti', description: 'Tutto ciò che devi sapere sul motore, sull’uso legale e sui tuoi dati.', all: 'Tutte le domande (18)', general: 'Informazioni generali', features: 'Funzionalità', technical: 'Tecnica e privacy', legal: 'Aspetti legali e marchi' },
    pt: { badge: 'RESPOSTAS CLARAS E HONESTAS', title: 'Perguntas frequentes', description: 'Tudo o que precisa saber sobre o motor, o uso legal e os seus dados.', all: 'Todas as perguntas (18)', general: 'Informações gerais', features: 'Funcionalidades', technical: 'Técnica e privacidade', legal: 'Questões legais e marcas' },
    ja: { badge: '明確で誠実な回答', title: 'よくある質問', description: '生成エンジン、法的な利用、データについて知っておきたいこと。', all: 'すべての質問（18）', general: '一般', features: '機能', technical: '技術とプライバシー', legal: '法律と商標' },
    ko: { badge: '명확하고 솔직한 답변', title: '자주 묻는 질문', description: '이름 생성 엔진, 합법적 사용, 데이터에 대해 알아야 할 모든 내용입니다.', all: '전체 질문 (18)', general: '일반', features: '기능', technical: '기술 및 개인정보', legal: '법률 및 상표' },
    zh: { badge: '清晰诚实的解答', title: '常见问题', description: '了解命名引擎、合法使用和数据隐私所需的一切信息。', all: '全部问题（18）', general: '常规问题', features: '功能', technical: '技术与隐私', legal: '法律与商标' },
    ru: { badge: 'ЧЕСТНЫЕ И ПОНЯТНЫЕ ОТВЕТЫ', title: 'Часто задаваемые вопросы', description: 'Всё о движке, законном использовании и ваших данных.', all: 'Все вопросы (18)', general: 'Общие вопросы', features: 'Возможности', technical: 'Техника и конфиденциальность', legal: 'Право и товарные знаки' },
    hi: { badge: 'स्पष्ट और ईमानदार जवाब', title: 'अक्सर पूछे जाने वाले प्रश्न', description: 'नाम इंजन, कानूनी उपयोग और आपके डेटा के बारे में ज़रूरी जानकारी।', all: 'सभी प्रश्न (18)', general: 'सामान्य', features: 'सुविधाएँ', technical: 'तकनीक और गोपनीयता', legal: 'कानून और ट्रेडमार्क' },
    nl: { badge: 'DUIDELIJKE EN EERLIJKE ANTWOORDEN', title: 'Veelgestelde vragen', description: 'Alles over de naamgenerator, legaal gebruik en je gegevens.', all: 'Alle vragen (18)', general: 'Algemeen', features: 'Functies', technical: 'Techniek en privacy', legal: 'Juridisch en merken' },
    pl: { badge: 'JASNE I UCZCIWE ODPOWIEDZI', title: 'Często zadawane pytania', description: 'Wszystko o generatorze, legalnym użyciu i Twoich danych.', all: 'Wszystkie pytania (18)', general: 'Ogólne', features: 'Funkcje', technical: 'Technika i prywatność', legal: 'Prawo i znaki towarowe' },
    sv: { badge: 'TYDLIGA OCH ÄRLIGA SVAR', title: 'Vanliga frågor', description: 'Allt du behöver veta om motorn, laglig användning och dina data.', all: 'Alla frågor (18)', general: 'Allmänt', features: 'Funktioner', technical: 'Teknik och integritet', legal: 'Juridik och varumärken' },
    vi: { badge: 'CÂU TRẢ LỜI RÕ RÀNG VÀ TRUNG THỰC', title: 'Câu hỏi thường gặp', description: 'Thông tin về công cụ tạo tên, việc sử dụng hợp pháp và dữ liệu của bạn.', all: 'Tất cả câu hỏi (18)', general: 'Tổng quan', features: 'Tính năng', technical: 'Kỹ thuật và quyền riêng tư', legal: 'Pháp lý và nhãn hiệu' },
    id: { badge: 'JAWABAN JELAS DAN JUJUR', title: 'Pertanyaan yang Sering Diajukan', description: 'Semua yang perlu diketahui tentang mesin, penggunaan legal, dan data Anda.', all: 'Semua pertanyaan (18)', general: 'Umum', features: 'Fitur', technical: 'Teknis dan privasi', legal: 'Hukum dan merek dagang' },
    th: { badge: 'คำตอบที่ชัดเจนและตรงไปตรงมา', title: 'คำถามที่พบบ่อย', description: 'ทุกสิ่งที่ควรรู้เกี่ยวกับระบบ การใช้งานอย่างถูกกฎหมาย และข้อมูลของคุณ', all: 'คำถามทั้งหมด (18)', general: 'ทั่วไป', features: 'คุณสมบัติ', technical: 'เทคนิคและความเป็นส่วนตัว', legal: 'กฎหมายและเครื่องหมายการค้า' },
    el: { badge: 'ΣΑΦΕΙΣ ΚΑΙ ΕΙΛΙΚΡΙΝΕΙΣ ΑΠΑΝΤΗΣΕΙΣ', title: 'Συχνές ερωτήσεις', description: 'Όλα όσα πρέπει να γνωρίζετε για τη μηχανή, τη νόμιμη χρήση και τα δεδομένα σας.', all: 'Όλες οι ερωτήσεις (18)', general: 'Γενικά', features: 'Λειτουργίες', technical: 'Τεχνικά και απόρρητο', legal: 'Νομικά και εμπορικά σήματα' },
    he: { badge: 'תשובות ברורות וכנות', title: 'שאלות נפוצות', description: 'כל מה שחשוב לדעת על המנוע, שימוש חוקי והנתונים שלך.', all: 'כל השאלות (18)', general: 'כללי', features: 'תכונות', technical: 'טכנולוגיה ופרטיות', legal: 'משפט וסימני מסחר' },
    cs: { badge: 'JASNÉ A UPŘÍMNÉ ODPOVĚDI', title: 'Často kladené otázky', description: 'Vše o generátoru, legálním použití a vašich datech.', all: 'Všechny otázky (18)', general: 'Obecné', features: 'Funkce', technical: 'Technika a soukromí', legal: 'Právo a ochranné známky' },
    ro: { badge: 'RĂSPUNSURI CLARE ȘI SINCERE', title: 'Întrebări frecvente', description: 'Tot ce trebuie să știi despre motor, utilizarea legală și datele tale.', all: 'Toate întrebările (18)', general: 'General', features: 'Funcții', technical: 'Tehnic și confidențialitate', legal: 'Legal și mărci comerciale' },
    da: { badge: 'KLARE OG ÆRLIGE SVAR', title: 'Ofte stillede spørgsmål', description: 'Alt, du bør vide om motoren, lovlig brug og dine data.', all: 'Alle spørgsmål (18)', general: 'Generelt', features: 'Funktioner', technical: 'Teknik og privatliv', legal: 'Jura og varemærker' },
    fi: { badge: 'SELKEÄT JA REHELLISET VASTAUKSET', title: 'Usein kysytyt kysymykset', description: 'Kaikki olennainen generaattorista, laillisesta käytöstä ja tiedoistasi.', all: 'Kaikki kysymykset (18)', general: 'Yleistä', features: 'Ominaisuudet', technical: 'Tekniikka ja tietosuoja', legal: 'Laki ja tavaramerkit' },
  };
  const faqLabels = faqUi[settings.language] || faqUi.en;
  const homeSearchUi: Record<string, { title: string; featuredBadge: string; featuredTitle: string; catalog: string }> = {
    en: { title: 'What would you like to name?', featuredBadge: 'FEATURED PICKS', featuredTitle: 'Popular Generators', catalog: `View the full catalog (${ALL_GENERATORS_LIST.length})` },
    fr: { title: 'Quel univers souhaitez-vous nommer ?', featuredBadge: 'SÉLECTIONS À DÉCOUVRIR', featuredTitle: 'Générateurs populaires', catalog: `Voir tout le catalogue (${ALL_GENERATORS_LIST.length})` },
    es: { title: '¿Qué te gustaría nombrar?', featuredBadge: 'SELECCIÓN DESTACADA', featuredTitle: 'Generadores populares', catalog: `Ver el catálogo completo (${ALL_GENERATORS_LIST.length})` },
    de: { title: 'Was möchtest du benennen?', featuredBadge: 'EMPFOHLENE AUSWAHL', featuredTitle: 'Beliebte Generatoren', catalog: `Gesamten Katalog ansehen (${ALL_GENERATORS_LIST.length})` },
    it: { title: 'Che cosa vorresti nominare?', featuredBadge: 'SCELTE IN EVIDENZA', featuredTitle: 'Generatori popolari', catalog: `Vedi il catalogo completo (${ALL_GENERATORS_LIST.length})` },
    pt: { title: 'O que gostaria de nomear?', featuredBadge: 'SELEÇÕES EM DESTAQUE', featuredTitle: 'Geradores populares', catalog: `Ver catálogo completo (${ALL_GENERATORS_LIST.length})` },
    ar: { title: 'ما الذي ترغب في اختيار اسم له؟', featuredBadge: 'اختيارات مميزة', featuredTitle: 'مولّدات شائعة', catalog: `عرض الفهرس الكامل (${ALL_GENERATORS_LIST.length})` },
    tr: { title: 'Neye isim vermek istiyorsun?', featuredBadge: 'ÖNE ÇIKAN SEÇİMLER', featuredTitle: 'Popüler oluşturucular', catalog: `Tüm kataloğu gör (${ALL_GENERATORS_LIST.length})` },
    ja: { title: '何に名前を付けますか？', featuredBadge: 'おすすめ', featuredTitle: '人気のジェネレーター', catalog: `カタログをすべて見る（${ALL_GENERATORS_LIST.length}）` },
    ko: { title: '무엇의 이름을 만들고 싶으신가요?', featuredBadge: '추천 항목', featuredTitle: '인기 생성기', catalog: `전체 카탈로그 보기 (${ALL_GENERATORS_LIST.length})` },
    zh: { title: '你想为哪些事物取名？', featuredBadge: '精选推荐', featuredTitle: '热门生成器', catalog: `查看完整目录（${ALL_GENERATORS_LIST.length}）` },
    ru: { title: 'Для чего вы хотите придумать название?', featuredBadge: 'РЕКОМЕНДУЕМЫЕ ВАРИАНТЫ', featuredTitle: 'Популярные генераторы', catalog: `Весь каталог (${ALL_GENERATORS_LIST.length})` },
    hi: { title: 'आप किस चीज़ का नाम रखना चाहते हैं?', featuredBadge: 'चुनिंदा विकल्प', featuredTitle: 'लोकप्रिय जनरेटर', catalog: `पूरा कैटलॉग देखें (${ALL_GENERATORS_LIST.length})` },
    nl: { title: 'Wat wil je een naam geven?', featuredBadge: 'UITGELICHTE KEUZES', featuredTitle: 'Populaire generators', catalog: `Bekijk de volledige catalogus (${ALL_GENERATORS_LIST.length})` },
    pl: { title: 'Czemu chcesz nadać nazwę?', featuredBadge: 'POLECANE WYBORY', featuredTitle: 'Popularne generatory', catalog: `Zobacz cały katalog (${ALL_GENERATORS_LIST.length})` },
    sv: { title: 'Vad vill du hitta ett namn till?', featuredBadge: 'UTVALDA TIPS', featuredTitle: 'Populära generatorer', catalog: `Visa hela katalogen (${ALL_GENERATORS_LIST.length})` },
    vi: { title: 'Bạn muốn đặt tên cho điều gì?', featuredBadge: 'LỰA CHỌN NỔI BẬT', featuredTitle: 'Công cụ tạo tên phổ biến', catalog: `Xem toàn bộ danh mục (${ALL_GENERATORS_LIST.length})` },
    id: { title: 'Apa yang ingin Anda beri nama?', featuredBadge: 'PILIHAN UNGGULAN', featuredTitle: 'Generator populer', catalog: `Lihat katalog lengkap (${ALL_GENERATORS_LIST.length})` },
    th: { title: 'คุณต้องการตั้งชื่อให้สิ่งใด?', featuredBadge: 'รายการแนะนำ', featuredTitle: 'เครื่องมือสร้างชื่อยอดนิยม', catalog: `ดูแค็ตตาล็อกทั้งหมด (${ALL_GENERATORS_LIST.length})` },
    el: { title: 'Τι θα θέλατε να ονομάσετε;', featuredBadge: 'ΠΡΟΤΕΙΝΟΜΕΝΕΣ ΕΠΙΛΟΓΕΣ', featuredTitle: 'Δημοφιλείς γεννήτριες', catalog: `Προβολή πλήρους καταλόγου (${ALL_GENERATORS_LIST.length})` },
    he: { title: 'למה תרצו לתת שם?', featuredBadge: 'בחירות מומלצות', featuredTitle: 'מחוללים פופולריים', catalog: `צפייה בקטלוג המלא (${ALL_GENERATORS_LIST.length})` },
    cs: { title: 'Čemu chcete vymyslet název?', featuredBadge: 'DOPORUČENÝ VÝBĚR', featuredTitle: 'Oblíbené generátory', catalog: `Zobrazit celý katalog (${ALL_GENERATORS_LIST.length})` },
    ro: { title: 'Pentru ce ai dori să găsești un nume?', featuredBadge: 'ALEGERI RECOMANDATE', featuredTitle: 'Generatoare populare', catalog: `Vezi catalogul complet (${ALL_GENERATORS_LIST.length})` },
    da: { title: 'Hvad vil du finde et navn til?', featuredBadge: 'UDVALGTE FORSLAG', featuredTitle: 'Populære generatorer', catalog: `Se hele kataloget (${ALL_GENERATORS_LIST.length})` },
    fi: { title: 'Mille haluaisit keksiä nimen?', featuredBadge: 'NOSTOT', featuredTitle: 'Suositut generaattorit', catalog: `Näytä koko luettelo (${ALL_GENERATORS_LIST.length})` },
  };
  const homeSearchLabels = homeSearchUi[settings.language] || homeSearchUi.en;
  const searchFeedbackUi: Record<string, { found: (count: number) => string; noResults: string }> = {
    en: { found: (count) => `${count} generator(s) found`, noResults: 'No exact matches; try different keywords' },
    fr: { found: (count) => `${count} générateur(s) trouvé(s)`, noResults: "Aucun résultat exact, essayez d'autres mots-clés" },
    es: { found: (count) => `${count} generador(es) encontrado(s)`, noResults: 'No hay coincidencias exactas; prueba otras palabras clave' },
    de: { found: (count) => `${count} Generator(en) gefunden`, noResults: 'Keine genauen Treffer; versuche andere Suchbegriffe' },
    it: { found: (count) => `${count} generatori trovati`, noResults: 'Nessuna corrispondenza esatta; prova altre parole chiave' },
    pt: { found: (count) => `${count} gerador(es) encontrado(s)`, noResults: 'Nenhuma correspondência exata; tente outras palavras-chave' },
    ar: { found: (count) => `تم العثور على ${count} مولّد(ات)`, noResults: 'لا توجد نتائج مطابقة تمامًا؛ جرّب كلمات مفتاحية أخرى' },
    tr: { found: (count) => `${count} oluşturucu bulundu`, noResults: 'Tam eşleşme yok; farklı anahtar kelimeler deneyin' },
    ja: { found: (count) => `${count} 件のジェネレーターが見つかりました`, noResults: '一致する結果がありません。別のキーワードをお試しください' },
    ko: { found: (count) => `${count}개의 생성기를 찾았습니다`, noResults: '일치하는 결과가 없습니다. 다른 검색어를 시도해 보세요' },
    zh: { found: (count) => `找到 ${count} 个生成器`, noResults: '没有完全匹配的结果，请尝试其他关键词' },
    ru: { found: (count) => `Найдено генераторов: ${count}`, noResults: 'Точных совпадений нет; попробуйте другие ключевые слова' },
    hi: { found: (count) => `${count} जनरेटर मिले`, noResults: 'सटीक परिणाम नहीं मिले; दूसरे कीवर्ड आज़माएँ' },
    nl: { found: (count) => `${count} generator(s) gevonden`, noResults: 'Geen exacte overeenkomsten; probeer andere zoekwoorden' },
    pl: { found: (count) => `Znaleziono generatorów: ${count}`, noResults: 'Brak dokładnych wyników; spróbuj innych słów kluczowych' },
    sv: { found: (count) => `${count} generator(er) hittades`, noResults: 'Inga exakta träffar; prova andra sökord' },
    vi: { found: (count) => `Tìm thấy ${count} công cụ tạo tên`, noResults: 'Không có kết quả khớp chính xác; hãy thử từ khóa khác' },
    id: { found: (count) => `Ditemukan ${count} generator`, noResults: 'Tidak ada kecocokan tepat; coba kata kunci lain' },
    th: { found: (count) => `พบเครื่องมือสร้างชื่อ ${count} รายการ`, noResults: 'ไม่พบผลลัพธ์ที่ตรงกัน ลองใช้คำค้นหาอื่น' },
    el: { found: (count) => `Βρέθηκαν ${count} γεννήτριες`, noResults: 'Δεν βρέθηκαν ακριβείς αντιστοιχίες· δοκιμάστε άλλες λέξεις-κλειδιά' },
    he: { found: (count) => `נמצאו ${count} מחוללים`, noResults: 'לא נמצאו התאמות מדויקות; נסו מילות מפתח אחרות' },
    cs: { found: (count) => `Nalezeno generátorů: ${count}`, noResults: 'Žádné přesné shody; zkuste jiná klíčová slova' },
    ro: { found: (count) => `Au fost găsite ${count} generatoare`, noResults: 'Nicio potrivire exactă; încearcă alte cuvinte-cheie' },
    da: { found: (count) => `Fandt ${count} generatorer`, noResults: 'Ingen præcise match; prøv andre søgeord' },
    fi: { found: (count) => `Löytyi ${count} generaattoria`, noResults: 'Tarkkoja osumia ei löytynyt; kokeile muita hakusanoja' },
  };
  const searchFeedback = searchFeedbackUi[settings.language] || searchFeedbackUi.en;
  const quickSearchUi: Record<string, { keywordPlaceholder: string; apply: string; advancedHint: string; openGenerator: string }> = {
    en: { keywordPlaceholder: 'Keyword or inspiration theme (e.g. Nova, Wolf, Luna, Spark, Zen)…', apply: 'Apply', advancedHint: 'Like these suggestions? Explore advanced options:', openGenerator: 'Full generator' },
    fr: { keywordPlaceholder: 'Mot-clé ou thème d’inspiration (ex. Nova, Wolf, Luna, Spark, Zen)…', apply: 'Appliquer', advancedHint: 'Vous aimez ces propositions ? Accédez aux options approfondies :', openGenerator: 'Générateur complet' },
    es: { keywordPlaceholder: 'Palabra clave o tema de inspiración (p. ej., Nova, Wolf, Luna, Spark, Zen)…', apply: 'Aplicar', advancedHint: '¿Te gustan estas propuestas? Explora las opciones avanzadas:', openGenerator: 'Generador completo' },
    de: { keywordPlaceholder: 'Stichwort oder Inspiration (z. B. Nova, Wolf, Luna, Spark, Zen)…', apply: 'Anwenden', advancedHint: 'Diese Vorschläge gefallen dir? Entdecke die erweiterten Optionen:', openGenerator: 'Vollständiger Generator' },
    it: { keywordPlaceholder: 'Parola chiave o tema d’ispirazione (es. Nova, Wolf, Luna, Spark, Zen)…', apply: 'Applica', advancedHint: 'Ti piacciono questi suggerimenti? Scopri le opzioni avanzate:', openGenerator: 'Generatore completo' },
    pt: { keywordPlaceholder: 'Palavra-chave ou tema de inspiração (ex.: Nova, Wolf, Luna, Spark, Zen)…', apply: 'Aplicar', advancedHint: 'Gostou destas sugestões? Explore as opções avançadas:', openGenerator: 'Gerador completo' },
    ar: { keywordPlaceholder: 'كلمة مفتاحية أو فكرة إلهام (مثل Nova وWolf وLuna وSpark وZen)…', apply: 'تطبيق', advancedHint: 'هل أعجبتك هذه الاقتراحات؟ اكتشف الخيارات المتقدمة:', openGenerator: 'المولّد الكامل' },
    tr: { keywordPlaceholder: 'Anahtar kelime veya ilham teması (örn. Nova, Wolf, Luna, Spark, Zen)…', apply: 'Uygula', advancedHint: 'Bu önerileri beğendiniz mi? Gelişmiş seçenekleri keşfedin:', openGenerator: 'Tam oluşturucu' },
    ja: { keywordPlaceholder: 'キーワードやテーマ（例：Nova、Wolf、Luna、Spark、Zen）…', apply: '適用', advancedHint: 'この候補が気に入りましたか？ 詳細オプションをご覧ください：', openGenerator: '詳細ジェネレーター' },
    ko: { keywordPlaceholder: '키워드 또는 영감 테마 (예: Nova, Wolf, Luna, Spark, Zen)…', apply: '적용', advancedHint: '이 제안이 마음에 드시나요? 고급 옵션을 확인하세요:', openGenerator: '전체 생성기' },
    zh: { keywordPlaceholder: '关键词或灵感主题（例如 Nova、Wolf、Luna、Spark、Zen）…', apply: '应用', advancedHint: '喜欢这些建议吗？探索高级选项：', openGenerator: '完整生成器' },
    ru: { keywordPlaceholder: 'Ключевое слово или тема для вдохновения (например, Nova, Wolf, Luna, Spark, Zen)…', apply: 'Применить', advancedHint: 'Нравятся варианты? Изучите расширенные настройки:', openGenerator: 'Полный генератор' },
    hi: { keywordPlaceholder: 'कीवर्ड या प्रेरणा का विषय (जैसे Nova, Wolf, Luna, Spark, Zen)…', apply: 'लागू करें', advancedHint: 'क्या ये सुझाव पसंद आए? उन्नत विकल्प देखें:', openGenerator: 'पूरा जनरेटर' },
    nl: { keywordPlaceholder: 'Zoekwoord of inspiratie (bijv. Nova, Wolf, Luna, Spark, Zen)…', apply: 'Toepassen', advancedHint: 'Bevallen deze suggesties? Bekijk de geavanceerde opties:', openGenerator: 'Volledige generator' },
    pl: { keywordPlaceholder: 'Słowo kluczowe lub inspiracja (np. Nova, Wolf, Luna, Spark, Zen)…', apply: 'Zastosuj', advancedHint: 'Podobają Ci się te propozycje? Sprawdź opcje zaawansowane:', openGenerator: 'Pełny generator' },
    sv: { keywordPlaceholder: 'Nyckelord eller inspirationstema (t.ex. Nova, Wolf, Luna, Spark, Zen)…', apply: 'Tillämpa', advancedHint: 'Gillar du förslagen? Utforska de avancerade alternativen:', openGenerator: 'Fullständig generator' },
    vi: { keywordPlaceholder: 'Từ khóa hoặc chủ đề gợi ý (ví dụ Nova, Wolf, Luna, Spark, Zen)…', apply: 'Áp dụng', advancedHint: 'Bạn thích các gợi ý này? Khám phá tùy chọn nâng cao:', openGenerator: 'Công cụ tạo tên đầy đủ' },
    id: { keywordPlaceholder: 'Kata kunci atau tema inspirasi (mis. Nova, Wolf, Luna, Spark, Zen)…', apply: 'Terapkan', advancedHint: 'Suka saran ini? Jelajahi opsi lanjutan:', openGenerator: 'Generator lengkap' },
    th: { keywordPlaceholder: 'คำค้นหาหรือธีมสร้างแรงบันดาลใจ (เช่น Nova, Wolf, Luna, Spark, Zen)…', apply: 'นำไปใช้', advancedHint: 'ชอบคำแนะนำเหล่านี้ไหม ดูตัวเลือกขั้นสูง:', openGenerator: 'เครื่องมือสร้างชื่อเต็ม' },
    el: { keywordPlaceholder: 'Λέξη-κλειδί ή θέμα έμπνευσης (π.χ. Nova, Wolf, Luna, Spark, Zen)…', apply: 'Εφαρμογή', advancedHint: 'Σας αρέσουν αυτές οι προτάσεις; Δείτε τις σύνθετες επιλογές:', openGenerator: 'Πλήρης γεννήτρια' },
    he: { keywordPlaceholder: 'מילת מפתח או נושא השראה (למשל Nova, Wolf, Luna, Spark, Zen)…', apply: 'החלה', advancedHint: 'אהבתם את ההצעות? גלו אפשרויות מתקדמות:', openGenerator: 'מחולל מלא' },
    cs: { keywordPlaceholder: 'Klíčové slovo nebo inspirace (např. Nova, Wolf, Luna, Spark, Zen)…', apply: 'Použít', advancedHint: 'Líbí se vám návrhy? Prozkoumejte pokročilé možnosti:', openGenerator: 'Plný generátor' },
    ro: { keywordPlaceholder: 'Cuvânt-cheie sau temă de inspirație (ex. Nova, Wolf, Luna, Spark, Zen)…', apply: 'Aplică', advancedHint: 'Îți plac sugestiile? Explorează opțiunile avansate:', openGenerator: 'Generator complet' },
    da: { keywordPlaceholder: 'Søgeord eller inspirationstema (f.eks. Nova, Wolf, Luna, Spark, Zen)…', apply: 'Anvend', advancedHint: 'Kan du lide forslagene? Se de avancerede muligheder:', openGenerator: 'Fuld generator' },
    fi: { keywordPlaceholder: 'Hakusana tai inspiraation aihe (esim. Nova, Wolf, Luna, Spark, Zen)…', apply: 'Käytä', advancedHint: 'Pidätkö ehdotuksista? Tutustu lisäasetuksiin:', openGenerator: 'Täysi generaattori' },
  };
  const quickSearchLabels = quickSearchUi[settings.language] || quickSearchUi.en;
  const topRatedUi: Record<string, { badge: string; notice: string; filterLabel: string; fantasy: string; business: string; creative: string; innovation: string; stars: string }> = {
    en: { badge: 'INDEPENDENT USER RATINGS', notice: 'Your personal ranking uses your actual 1–5 star ratings stored in this browser.', filterLabel: 'Filter by category:', fantasy: 'Fantasy, Myths & Games', business: 'Business & Brands', creative: 'Creative & eSports', innovation: 'Systems & Web3', stars: 'stars' },
    fr: { badge: 'PALMARÈS INDÉPENDANT DES ÉVALUATIONS', notice: 'Classement personnel établi d’après vos véritables notes par étoiles (1 à 5★) stockées sur ce navigateur.', filterLabel: 'Filtrer par domaine :', fantasy: 'Fantasy, mythes et jeux', business: 'Entreprises et marques', creative: 'Création et eSport', innovation: 'Systèmes et Web3', stars: 'étoiles' },
    es: { badge: 'VALORACIONES INDEPENDIENTES', notice: 'Tu clasificación personal usa tus valoraciones reales de 1 a 5 estrellas guardadas en este navegador.', filterLabel: 'Filtrar por categoría:', fantasy: 'Fantasía, mitos y juegos', business: 'Empresas y marcas', creative: 'Creatividad y eSports', innovation: 'Sistemas y Web3', stars: 'estrellas' },
    de: { badge: 'UNABHÄNGIGE NUTZERBEWERTUNGEN', notice: 'Deine persönliche Rangliste basiert auf deinen echten Bewertungen von 1 bis 5 Sternen in diesem Browser.', filterLabel: 'Nach Kategorie filtern:', fantasy: 'Fantasy, Mythen & Spiele', business: 'Unternehmen & Marken', creative: 'Kreatives & eSports', innovation: 'Systeme & Web3', stars: 'Sterne' },
    it: { badge: 'VALUTAZIONI INDIPENDENTI DEGLI UTENTI', notice: 'La tua classifica personale usa le valutazioni reali da 1 a 5 stelle salvate in questo browser.', filterLabel: 'Filtra per categoria:', fantasy: 'Fantasy, miti e giochi', business: 'Aziende e marchi', creative: 'Creatività ed eSport', innovation: 'Sistemi e Web3', stars: 'stelle' },
    pt: { badge: 'AVALIAÇÕES INDEPENDENTES DOS UTILIZADORES', notice: 'A tua classificação pessoal usa as avaliações reais de 1 a 5 estrelas guardadas neste navegador.', filterLabel: 'Filtrar por categoria:', fantasy: 'Fantasia, mitos e jogos', business: 'Empresas e marcas', creative: 'Criatividade e eSports', innovation: 'Sistemas e Web3', stars: 'estrelas' },
    ar: { badge: 'تقييمات المستخدمين المستقلة', notice: 'يعتمد ترتيبك الشخصي على تقييماتك الفعلية من نجمة إلى خمس نجوم المحفوظة في هذا المتصفح.', filterLabel: 'تصفية حسب الفئة:', fantasy: 'الخيال والأساطير والألعاب', business: 'الشركات والعلامات التجارية', creative: 'الإبداع والرياضات الإلكترونية', innovation: 'الأنظمة وWeb3', stars: 'نجوم' },
    tr: { badge: 'BAĞIMSIZ KULLANICI PUANLARI', notice: 'Kişisel sıralamanız bu tarayıcıda saklanan gerçek 1–5 yıldız puanlarınızı kullanır.', filterLabel: 'Kategoriye göre filtrele:', fantasy: 'Fantastik, Mitler ve Oyunlar', business: 'Şirketler ve Markalar', creative: 'Yaratıcılık ve eSpor', innovation: 'Sistemler ve Web3', stars: 'yıldız' },
    ja: { badge: 'ユーザーによる独立評価', notice: '個人ランキングには、このブラウザーに保存された実際の1〜5つ星評価が使われます。', filterLabel: 'カテゴリで絞り込む：', fantasy: 'ファンタジー・神話・ゲーム', business: '企業・ブランド', creative: 'クリエイティブ・eスポーツ', innovation: 'システム・Web3', stars: 'つ星' },
    ko: { badge: '독립 사용자 평점', notice: '개인 순위는 이 브라우저에 저장된 실제 1~5점 별점을 사용합니다.', filterLabel: '카테고리 필터:', fantasy: '판타지·신화·게임', business: '기업·브랜드', creative: '창작·e스포츠', innovation: '시스템·Web3', stars: '별' },
    zh: { badge: '独立用户评分', notice: '个人排名依据保存在此浏览器中的真实 1–5 星评分。', filterLabel: '按类别筛选：', fantasy: '奇幻、神话与游戏', business: '企业与品牌', creative: '创意与电子竞技', innovation: '系统与 Web3', stars: '星' },
    ru: { badge: 'НЕЗАВИСИМЫЕ ОЦЕНКИ ПОЛЬЗОВАТЕЛЕЙ', notice: 'Личный рейтинг основан на ваших реальных оценках от 1 до 5 звёзд, сохранённых в этом браузере.', filterLabel: 'Фильтр по категории:', fantasy: 'Фэнтези, мифы и игры', business: 'Компании и бренды', creative: 'Творчество и киберспорт', innovation: 'Системы и Web3', stars: 'звёзд' },
    hi: { badge: 'स्वतंत्र उपयोगकर्ता रेटिंग', notice: 'आपकी व्यक्तिगत रैंकिंग इस ब्राउज़र में सहेजी गई आपकी वास्तविक 1–5 स्टार रेटिंग का उपयोग करती है।', filterLabel: 'श्रेणी के अनुसार फ़िल्टर करें:', fantasy: 'फैंटेसी, मिथक और गेम', business: 'व्यवसाय और ब्रांड', creative: 'रचनात्मकता और ई-स्पोर्ट्स', innovation: 'सिस्टम और Web3', stars: 'स्टार' },
    nl: { badge: 'ONAFHANKELIJKE GEBRUIKERSBEOORDELINGEN', notice: 'Je persoonlijke ranglijst gebruikt je echte beoordelingen van 1 tot 5 sterren die in deze browser zijn opgeslagen.', filterLabel: 'Filter op categorie:', fantasy: 'Fantasy, mythen en games', business: 'Bedrijven en merken', creative: 'Creatief en eSports', innovation: 'Systemen en Web3', stars: 'sterren' },
    pl: { badge: 'NIEZALEŻNE OCENY UŻYTKOWNIKÓW', notice: 'Twój ranking wykorzystuje rzeczywiste oceny od 1 do 5 gwiazdek zapisane w tej przeglądarce.', filterLabel: 'Filtruj według kategorii:', fantasy: 'Fantasy, mity i gry', business: 'Firmy i marki', creative: 'Kreatywność i e-sport', innovation: 'Systemy i Web3', stars: 'gwiazdek' },
    sv: { badge: 'OBEROENDE ANVÄNDARBETYG', notice: 'Din personliga ranking använder dina faktiska betyg från 1 till 5 stjärnor som sparats i den här webbläsaren.', filterLabel: 'Filtrera efter kategori:', fantasy: 'Fantasy, myter och spel', business: 'Företag och varumärken', creative: 'Kreativitet och e-sport', innovation: 'System och Web3', stars: 'stjärnor' },
    vi: { badge: 'ĐÁNH GIÁ ĐỘC LẬP CỦA NGƯỜI DÙNG', notice: 'Bảng xếp hạng cá nhân dùng đánh giá 1–5 sao thực tế được lưu trong trình duyệt này.', filterLabel: 'Lọc theo danh mục:', fantasy: 'Fantasy, thần thoại và trò chơi', business: 'Doanh nghiệp và thương hiệu', creative: 'Sáng tạo và thể thao điện tử', innovation: 'Hệ thống và Web3', stars: 'sao' },
    id: { badge: 'PENILAIAN PENGGUNA INDEPENDEN', notice: 'Peringkat pribadi menggunakan penilaian nyata 1–5 bintang yang tersimpan di browser ini.', filterLabel: 'Filter berdasarkan kategori:', fantasy: 'Fantasi, mitos, dan game', business: 'Bisnis dan merek', creative: 'Kreatif dan eSports', innovation: 'Sistem dan Web3', stars: 'bintang' },
    th: { badge: 'คะแนนจากผู้ใช้โดยอิสระ', notice: 'อันดับส่วนตัวใช้คะแนนจริง 1–5 ดาวที่บันทึกไว้ในเบราว์เซอร์นี้', filterLabel: 'กรองตามหมวดหมู่:', fantasy: 'แฟนตาซี ตำนาน และเกม', business: 'ธุรกิจและแบรนด์', creative: 'งานสร้างสรรค์และอีสปอร์ต', innovation: 'ระบบและ Web3', stars: 'ดาว' },
    el: { badge: 'ΑΝΕΞΑΡΤΗΤΕΣ ΑΞΙΟΛΟΓΗΣΕΙΣ ΧΡΗΣΤΩΝ', notice: 'Η προσωπική κατάταξη χρησιμοποιεί τις πραγματικές βαθμολογίες 1–5 αστέρων που είναι αποθηκευμένες σε αυτό το πρόγραμμα περιήγησης.', filterLabel: 'Φιλτράρισμα ανά κατηγορία:', fantasy: 'Φαντασία, μύθοι και παιχνίδια', business: 'Επιχειρήσεις και επωνυμίες', creative: 'Δημιουργία και eSports', innovation: 'Συστήματα και Web3', stars: 'αστέρια' },
    he: { badge: 'דירוגי משתמשים עצמאיים', notice: 'הדירוג האישי מבוסס על דירוגי 1–5 כוכבים אמיתיים שנשמרו בדפדפן הזה.', filterLabel: 'סינון לפי קטגוריה:', fantasy: 'פנטזיה, מיתוסים ומשחקים', business: 'עסקים ומותגים', creative: 'יצירה וספורט אלקטרוני', innovation: 'מערכות ו-Web3', stars: 'כוכבים' },
    cs: { badge: 'NEZÁVISLÁ HODNOCENÍ UŽIVATELŮ', notice: 'Osobní žebříček používá vaše skutečná hodnocení 1–5 hvězdičkami uložená v tomto prohlížeči.', filterLabel: 'Filtrovat podle kategorie:', fantasy: 'Fantasy, mýty a hry', business: 'Firmy a značky', creative: 'Tvorba a eSport', innovation: 'Systémy a Web3', stars: 'hvězdičky' },
    ro: { badge: 'EVALUĂRI INDEPENDENTE ALE UTILIZATORILOR', notice: 'Clasamentul personal folosește evaluările reale de la 1 la 5 stele salvate în acest browser.', filterLabel: 'Filtrează după categorie:', fantasy: 'Fantasy, mituri și jocuri', business: 'Companii și mărci', creative: 'Creativitate și eSports', innovation: 'Sisteme și Web3', stars: 'stele' },
    da: { badge: 'UAFHÆNGIGE BRUGERVURDERINGER', notice: 'Din personlige rangliste bruger dine faktiske vurderinger fra 1 til 5 stjerner gemt i denne browser.', filterLabel: 'Filtrer efter kategori:', fantasy: 'Fantasy, myter og spil', business: 'Virksomheder og brands', creative: 'Kreativitet og e-sport', innovation: 'Systemer og Web3', stars: 'stjerner' },
    fi: { badge: 'RIIPPUMATTOMAT KÄYTTÄJÄARVIOT', notice: 'Henkilökohtainen järjestys käyttää tähän selaimeen tallennettuja todellisia 1–5 tähden arvioitasi.', filterLabel: 'Suodata kategorian mukaan:', fantasy: 'Fantasia, myytit ja pelit', business: 'Yritykset ja brändit', creative: 'Luovuus ja e-urheilu', innovation: 'Järjestelmät ja Web3', stars: 'tähteä' },
  };
  const topRatedLabels = topRatedUi[settings.language] || topRatedUi.en;

  // Filtered FAQ
  const localizedFaq = useMemo(() => getLocalizedFaq(settings.language), [settings.language]);
  const filteredFaq = useMemo(() => {
    if (faqCategory === 'all') return localizedFaq;
    return localizedFaq.filter((item) => item.category === faqCategory);
  }, [faqCategory, localizedFaq]);

  const isRtlLanguage = ['ar', 'he', 'fa', 'ur', 'ps'].includes(settings.language);

  return (
    <div dir={isRtlLanguage ? 'rtl' : 'ltr'} lang={settings.language} className="space-y-24 pb-20 overflow-hidden">
      {/* ========================================================
          1. SECTION HERO & INTRODUCTION
      ========================================================= */}
      <section className="relative text-center pt-16 pb-8 px-4 max-w-5xl mx-auto">
        {/* Glow ambient background circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-black uppercase tracking-widest mb-8 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{t.hero.badge.replace(/\b134\b/g, String(ALL_GENERATORS_LIST.length))}</span>
        </div>

        <h1 className="nf-animated-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6">
          {t.hero.titleA}{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
            {t.hero.titleB}
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
          {t.hero.subtitle}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-xl mx-auto mb-14">
          <button
            onClick={() => onNavigate('generators')}
            className="w-full sm:w-auto h-13 px-7 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 hover:shadow-cyan-500/30 transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.hero.exploreBtn.replace(/\b134\b/g, String(ALL_GENERATORS_LIST.length))}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              const randomGen = ALL_GENERATORS_LIST[Math.floor(Math.random() * ALL_GENERATORS_LIST.length)];
              onNavigate('generator-detail', randomGen.id);
            }}
            className="w-full sm:w-auto h-13 px-6 rounded-2xl bg-gradient-to-r from-amber-500/20 to-purple-600/20 hover:from-amber-500/30 hover:to-purple-600/30 text-amber-300 font-extrabold text-sm border border-amber-500/40 hover:border-amber-400 transition flex items-center justify-center gap-2 cursor-pointer"
            title={quickCopy.randomTitle || getShellLabels(settings.language).randomGeneratorTitle.replace('{count}', String(ALL_GENERATORS_LIST.length))}
          >
            <Dices className="w-4 h-4 text-amber-400" />
            <span>{quickCopy.random || getShellLabels(settings.language).surpriseMe}</span>
          </button>

          <button
            onClick={() => onNavigate('my-names')}
            className="w-full sm:w-auto h-13 px-6 rounded-2xl bg-[#0f172a] hover:bg-[#18233c] text-slate-200 font-bold text-sm border border-slate-700/80 hover:border-slate-600 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-purple-400" />
            <span>{t.hero.myNamesBtn}</span>
          </button>
        </div>

        {/* Stat badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-semibold border-t border-slate-800/80 pt-8 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-slate-300">{t.hero.fastStatGenerators.replace(/\b134\b/g, String(ALL_GENERATORS_LIST.length))}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-slate-300">{t.hero.fastStatStyles}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300">{t.hero.fastStatFree}</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          1.5. SECTION FORGE EXPRESS DIRECTE (TESTEZ IMMÉDIATEMENT)
      ========================================================= */}
      <section className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-8 -mt-10 sm:-mt-8 relative z-20">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#131b2e] via-[#0d1424] to-[#080d19] border border-purple-500/40 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase tracking-wider mb-2">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>{quickCopy.badge}</span>
              </div>
              <h2 className="nf-animated-heading text-xl sm:text-2xl font-black tracking-tight">
                {quickCopy.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {quickCopy.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuickForge()}
                disabled={quickGenerating}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {quickGenerating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{quickCopy.regenerate}</span>
              </button>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'brand' as GeneratorId, label: `🏢 ${quickCopy.categories[0]}`, icon: '🏢' },
                { id: 'fantasy' as GeneratorId, label: `✨ ${quickCopy.categories[1]}`, icon: '🧙' },
                { id: 'startup' as GeneratorId, label: `🚀 ${quickCopy.categories[2]}`, icon: '🚀' },
                { id: 'dragon' as GeneratorId, label: `🐉 ${quickCopy.categories[3]}`, icon: '🐉' },
                { id: 'baby_name' as GeneratorId, label: `👶 ${quickCopy.categories[4]}`, icon: '👶' },
                { id: 'gamertag' as GeneratorId, label: `🎮 ${quickCopy.categories[5]}`, icon: '🎯' },
                { id: 'restaurant' as GeneratorId, label: `🍽️ ${quickCopy.categories[6]}`, icon: '🍽️' },
                { id: 'ai_bot' as GeneratorId, label: `🤖 ${quickCopy.categories[7]}`, icon: '🤖' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => {
                    setQuickGenId(chip.id);
                    handleQuickForge(chip.id);
                  }}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    quickGenId === chip.id
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                      : 'bg-[#0a0f1d] text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>

            {/* Keyword Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={quickSearchLabels.keywordPlaceholder}
                value={quickKeyword}
                onChange={(e) => setQuickKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleQuickForge();
                }}
                className="flex-1 h-11 px-4 bg-[#090d1c] border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 shadow-inner"
              />
              <button
                onClick={() => handleQuickForge()}
                className="h-11 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer border border-slate-700"
              >
                {quickSearchLabels.apply}
              </button>
            </div>
          </div>

          {/* Quick Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {quickResults.map((item) => (
              <NameCard
                key={item.name}
                item={item}
                onDataChange={refreshSaved}
              />
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
            <span>
              {quickSearchLabels.advancedHint}
            </span>
            <button
              onClick={() => onNavigate('generator-detail', quickGenId)}
              className="text-cyan-300 hover:text-cyan-200 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>{quickSearchLabels.openGenerator} {GENERATORS_METADATA[quickGenId]?.shortTitle || ''}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. SECTION AVANTAGES DE NAMEFORGE
      ========================================================= */}
      <section className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="nf-animated-heading text-2xl sm:text-4xl font-black tracking-tight mb-3">
            {t.advantages.title}
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            {t.advantages.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Adv 1 */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#10182c] to-[#0a0f1e] border border-slate-800 hover:border-purple-500/40 transition-all duration-200 hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white mb-2">{t.advantages.adv1Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t.advantages.adv1Desc}</p>
          </div>

          {/* Adv 2 */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#10182c] to-[#0a0f1e] border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white mb-2">{t.advantages.adv2Title.replace(/\b134\b/g, String(ALL_GENERATORS_LIST.length))}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t.advantages.adv2Desc}</p>
          </div>

          {/* Adv 3 */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#10182c] to-[#0a0f1e] border border-slate-800 hover:border-pink-500/40 transition-all duration-200 hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white mb-2">{t.advantages.adv3Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t.advantages.adv3Desc}</p>
          </div>

          {/* Adv 4 */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#10182c] to-[#0a0f1e] border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white mb-2">{t.advantages.adv4Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t.advantages.adv4Desc}</p>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. BARRE DE RECHERCHE INTERACTIVE DE GÉNÉRATEURS
      ========================================================= */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#121a30] via-[#0d1426] to-[#080d1a] border border-purple-500/30 shadow-2xl space-y-5">
          <div className="text-center max-w-lg mx-auto">
            <h3 className="nf-animated-heading text-xl sm:text-2xl font-black">
              {homeSearchLabels.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {t.categories.subtitle}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="w-5 h-5 text-purple-400 absolute start-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.nav.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-13 ps-12 pe-4 bg-[#070b16] border border-slate-700/80 rounded-2xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-inner"
            />
          </div>

          {/* Live Search Results */}
          {searchQuery.trim() && (
            <div className="pt-2 animate-fade-in space-y-2">
              <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                <span>{searchFeedback.found(searchedGenerators.length)}</span>
                {searchedGenerators.length === 0 && (
                  <span className="text-rose-400">{searchFeedback.noResults}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto p-1">
                {searchedGenerators.map((gen) => (
                  <button
                    key={gen.id}
                    onClick={() => onNavigate('generator-detail', gen.id)}
                    className="p-3 rounded-xl bg-[#090e1c] border border-slate-800 hover:border-purple-500/60 transition text-start flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-xl">{gen.icon}</span>
                      <div className="truncate">
                        <div className="font-bold text-white text-xs group-hover:text-cyan-300 transition truncate">
                          {getLocalizedGeneratorTitle(gen.id, settings.language, gen.title)}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{familyLabels[gen.category as keyof typeof familyLabels] || familyLabels.all}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          4. CATÉGORIES POPULAIRES & RECOMMANDÉES
      ========================================================= */}
      <section className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{homeSearchLabels.featuredBadge}</span>
            </div>
            <h2 className="nf-animated-heading text-2xl sm:text-4xl font-black tracking-tight">
              {homeSearchLabels.featuredTitle}
            </h2>
          </div>

          <button
            onClick={() => onNavigate('generators')}
            className="text-xs font-bold text-purple-400 hover:text-purple-300 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>{homeSearchLabels.catalog}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredGenerators.map((gen) => (
            <div
              key={gen.id}
              className="p-6 rounded-3xl bg-gradient-to-b from-[#10182c] to-[#0a0f1e] border border-slate-800 hover:border-purple-500/60 transition-all duration-200 hover:-translate-y-1 shadow-lg flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#090d1a] border border-slate-700/80 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                    {gen.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
                    {familyLabels[gen.category as keyof typeof familyLabels] || familyLabels.all}
                  </span>
                </div>

                <h3 className="text-base font-black text-white group-hover:text-cyan-200 transition mb-2">
                  {getLocalizedGeneratorShortTitle(gen.id, settings.language, gen.shortTitle)}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {getLocalizedGeneratorDescription(gen, settings.language)}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">
                  {gen.advantages?.[0] || 'Forge instantanée'}
                </span>
                <button
                  onClick={() => onNavigate('generator-detail', gen.id)}
                  className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer shadow-md shadow-purple-600/30"
                >
                  <span>{t.categories.openGenerator}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          5. EXPLORER LES FAMILLES — LE CATALOGUE RESTE SUR SA PAGE
      ========================================================= */}
      <section className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-8 py-8">
        <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-[#0f172a] to-cyan-500/10 p-6 sm:p-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-purple-300 mb-4">
            <Compass className="h-4 w-4" />
            <span>{t.categories.subtitle}</span>
          </div>
          <h2 className="nf-animated-heading text-2xl sm:text-4xl font-black tracking-tight mb-3">
            {selectedFamily === 'all' ? t.categories.title : familyLabels[selectedFamily as keyof typeof familyLabels]}
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
            {selectedFamily === 'all'
              ? t.categories.subtitle
              : `${familyLabels[selectedFamily as keyof typeof familyLabels]} · ${t.categories.subtitle}`}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {GENERATOR_FAMILIES_CONFIG.map((fam) => (
              <button
                key={fam.id}
                onClick={() => setSelectedFamily(fam.id)}
                aria-pressed={selectedFamily === fam.id}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer border ${
                  selectedFamily === fam.id
                    ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30'
                    : 'bg-slate-900/70 text-slate-300 border-slate-700 hover:border-purple-400/60 hover:text-white'
                }`}
              >
                <span>{fam.icon}</span>
                <span>{familyLabels[fam.id as keyof typeof familyLabels]} ({fam.count})</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => onNavigate('generators')}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-purple-600/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/20"
          >
            <span>{homeSearchLabels.catalog}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* ========================================================
          6. SECTION NOMS LES MIEUX NOTÉS (CLASSEMENT PAR ÉTOILES INDÉPENDANT)
      ========================================================= */}
      <section className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#121728] via-[#0f1424] to-[#0a0d18] border border-amber-500/20 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>{topRatedLabels.badge}</span>
              </div>
              <h2 className="nf-animated-heading text-2xl sm:text-3xl font-black tracking-tight">
                {t.topRated.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {t.topRated.subtitle}
              </p>
            </div>

            <div className="text-xs text-slate-400 font-semibold bg-slate-800/60 px-3.5 py-2 rounded-xl border border-slate-700/60 max-w-md">
              <span>{topRatedLabels.notice}</span>
            </div>
          </div>

          {/* Category Filter Tabs for Top Rated */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-bold me-1">{topRatedLabels.filterLabel}</span>
            <button
              onClick={() => setRatedCategoryFilter('all')}
              aria-pressed={ratedCategoryFilter === 'all'}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                ratedCategoryFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t.topRated.filterAll}
            </button>
            <button
              onClick={() => setRatedCategoryFilter('fantasy')}
              aria-pressed={ratedCategoryFilter === 'fantasy'}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                ratedCategoryFilter === 'fantasy'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              ✨ {topRatedLabels.fantasy}
            </button>
            <button
              onClick={() => setRatedCategoryFilter('business')}
              aria-pressed={ratedCategoryFilter === 'business'}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                ratedCategoryFilter === 'business'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🏢 {topRatedLabels.business}
            </button>
            <button
              onClick={() => setRatedCategoryFilter('creative')}
              aria-pressed={ratedCategoryFilter === 'creative'}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                ratedCategoryFilter === 'creative'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🎨 {topRatedLabels.creative}
            </button>
            <button
              onClick={() => setRatedCategoryFilter('innovation')}
              aria-pressed={ratedCategoryFilter === 'innovation'}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                ratedCategoryFilter === 'innovation'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🚀 {topRatedLabels.innovation}
            </button>
          </div>

          {/* Top rated grid or empty state */}
          {topRatedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topRatedItems.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-[#090d1a] border border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{entry.rating || 5}/5 {topRatedLabels.stars}</span>
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {entry.generator}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white tracking-tight">{entry.name}</h3>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {entry.note || `Archétype ${entry.style} • Proposition remarquable`}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-purple-400 font-semibold">
                      {entry.style}
                    </span>
                    <button
                      onClick={() => handleCopy(entry.name)}
                      className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedName === entry.name ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{t.nameCard.copied.replace(/^✓\s*/, '')}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{t.nameCard.copy}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 px-4 text-center max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">{t.topRated.emptyText}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.topRated.emptySubtext}
              </p>
              <button
                onClick={() => onNavigate('generators')}
                className="mt-2 py-2 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer keep-white shadow-md shadow-purple-600/30"
              >
                {t.topRated.discoverBtn}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          7. SECTION COMMENT UTILISER NAMEFORGE (3 ÉTAPES)
      ========================================================= */}
      <section className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="nf-animated-heading text-2xl sm:text-4xl font-black tracking-tight mb-3">
            {t.howItWorks.title}
          </h2>
          <p className="text-sm text-slate-400">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#10182c] to-[#0a0f1e] border border-slate-800 relative">
            <div className="text-4xl font-black text-purple-500/30 mb-4">01</div>
            <h3 className="text-lg font-black text-white mb-2">{t.howItWorks.step1Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t.howItWorks.step1Desc.replace(/\b134\b/g, String(ALL_GENERATORS_LIST.length))}</p>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#10182c] to-[#0a0f1e] border border-slate-800 relative">
            <div className="text-4xl font-black text-cyan-500/30 mb-4">02</div>
            <h3 className="text-lg font-black text-white mb-2">{t.howItWorks.step2Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t.howItWorks.step2Desc}</p>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#10182c] to-[#0a0f1e] border border-slate-800 relative">
            <div className="text-4xl font-black text-pink-500/30 mb-4">03</div>
            <h3 className="text-lg font-black text-white mb-2">{t.howItWorks.step3Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t.howItWorks.step3Desc}</p>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. SECTION FAQ RÉÉCRITE (18 QUESTIONS COMPLÈTES)
      ========================================================= */}
      <section data-testid="home-faq-section" className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{faqLabels.badge}</span>
          </div>
          <h2 className="nf-animated-heading text-2xl sm:text-4xl font-black tracking-tight mb-3">
            {faqLabels.title}
          </h2>
          <p className="text-sm text-slate-400">
            {faqLabels.description}
          </p>

          {/* Category Filter Pills for FAQ */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              { id: 'all', label: faqLabels.all },
              { id: 'general', label: faqLabels.general },
              { id: 'features', label: faqLabels.features },
              { id: 'technical', label: faqLabels.technical },
              { id: 'legal', label: faqLabels.legal },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFaqCategory(cat.id)}
                aria-pressed={faqCategory === cat.id}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  faqCategory === cat.id
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-[#10182c] text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-3">
          {filteredFaq.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0f172a] border border-slate-800 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition"
                >
                  <span className="font-bold text-white text-sm sm:text-base leading-snug">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-purple-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 bg-[#0a0f1e]/60 animate-fade-in">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          9. BANNIÈRE D’APPEL À L’ACTION (CTA)
      ========================================================= */}
      <section className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-900/50 via-indigo-900/40 to-cyan-900/40 border border-purple-500/40 shadow-2xl text-center space-y-6">
          <h2 className="nf-animated-heading text-3xl sm:text-4xl font-black tracking-tight">
            {homeCta.title}
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            {homeCta.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('generators')}
              className="py-3 px-8 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 transition cursor-pointer"
            >
              {homeCta.browse}
            </button>
            <button
              onClick={() => onNavigate('my-names')}
              className="py-3 px-6 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition cursor-pointer"
            >
              {homeCta.favorites}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
