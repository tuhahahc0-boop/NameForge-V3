import React, { useState, useEffect, useRef } from 'react';
import {
  Bookmark,
  Heart,
  FileText,
  Trash2,
  Copy,
  Check,
  Star,
  Search,
  Download,
  Upload,
  Sparkles,
  AlertTriangle,
  FolderPlus,
  History,
  Scale,
  Plus,
  Folder,
} from 'lucide-react';
import {
  clearAllSavedNames,
  deleteSavedName,
  getSavedNames,
  setStoredRating,
  toggleLikeName,
  toggleSaveName,
  getCollections,
  deleteCollection,
  assignNameToCollection,
  getGenerationHistory,
  clearGenerationHistory,
  exportDataJSON,
  exportDataCSV,
  importDataJSON,
  getNameForgeStats,
  subscribeToStorage,
} from '../services/storage';
import { GeneratorId, HistoryEntry, NamedCollection, SavedNameEntry, StorageStats } from '../types';
import { NoteModal } from '../components/NoteModal';
import { CollectionModal } from '../components/CollectionModal';
import { CompareModal } from '../components/CompareModal';
import { ALL_GENERATORS_LIST } from '../data/generators';
import { getAppSettings, subscribeToSettings } from '../services/settings';
import { getTranslations } from '../i18n';
import { getMyNamesAuditLabels } from '../i18n/myNames';
import { getLocalizedStyleLabel } from '../i18n/styleLabels';

interface MyNamesViewProps {
  onNavigate: (view: string, generatorId?: GeneratorId) => void;
}

export const MyNamesView: React.FC<MyNamesViewProps> = ({ onNavigate }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => getAppSettings().language);
  useEffect(() => subscribeToSettings((settings) => setCurrentLanguage(settings.language)), []);
  const libraryText: Record<string, { empty: string; emptyDescription: string; generate: string; noResults: string; collections: string; collectionsDescription: string; create: string; noCollections: string; noCollectionsDescription: string; clear: string }> = {
    fr: { empty: 'Votre collection est vide', emptyDescription: "Vous n’avez pas encore enregistré de nom. Utilisez les actions « Enregistrer » ou « J’aime » dans un générateur pour constituer votre collection !", generate: 'Générer des noms', noResults: 'Aucun nom ne correspond à vos critères de recherche.', collections: 'Vos collections thématiques', collectionsDescription: 'Regroupez vos noms par livre, faction, campagne ou équipe.', create: 'Créer une collection', noCollections: 'Aucune collection créée', noCollectionsDescription: 'Créez votre première collection pour classer vos noms par projet ou campagne.', clear: 'Tout supprimer' },
    en: { empty: 'Your collection is empty', emptyDescription: 'You have not saved any names yet. Use Save or Like in a generator to build your collection!', generate: 'Generate names', noResults: 'No names match your search criteria.', collections: 'Your themed collections', collectionsDescription: 'Group names by book, faction, campaign, or team.', create: 'Create a collection', noCollections: 'No collections created', noCollectionsDescription: 'Create your first collection to organize names by project or campaign.', clear: 'Delete all' },
    es: { empty: 'Tu colección está vacía', emptyDescription: 'Aún no has guardado nombres. Usa Guardar o Me gusta en un generador para crear tu colección.', generate: 'Generar nombres', noResults: 'Ningún nombre coincide con tu búsqueda.', collections: 'Tus colecciones temáticas', collectionsDescription: 'Agrupa nombres por libro, facción, campaña o equipo.', create: 'Crear una colección', noCollections: 'No hay colecciones', noCollectionsDescription: 'Crea tu primera colección para organizar nombres por proyecto o campaña.', clear: 'Eliminar todo' },
    de: { empty: 'Deine Sammlung ist leer', emptyDescription: 'Du hast noch keine Namen gespeichert. Nutze Speichern oder Gefällt mir in einem Generator.', generate: 'Namen generieren', noResults: 'Keine Namen entsprechen deiner Suche.', collections: 'Deine thematischen Sammlungen', collectionsDescription: 'Gruppiere Namen nach Buch, Fraktion, Kampagne oder Team.', create: 'Sammlung erstellen', noCollections: 'Keine Sammlungen vorhanden', noCollectionsDescription: 'Erstelle deine erste Sammlung, um Namen nach Projekt oder Kampagne zu ordnen.', clear: 'Alle löschen' },
    ar: { empty: 'مجموعتك فارغة', emptyDescription: 'لم تحفظ أي أسماء بعد. استخدم الحفظ أو الإعجاب من أي مولّد لإضافة الأسماء إلى مجموعتك.', generate: 'إنشاء أسماء', noResults: 'لا توجد أسماء تطابق معايير البحث.', collections: 'مجموعاتك الموضوعية', collectionsDescription: 'نظّم الأسماء حسب الكتاب أو الفصيل أو الحملة أو الفريق.', create: 'إنشاء مجموعة', noCollections: 'لا توجد مجموعات', noCollectionsDescription: 'أنشئ مجموعتك الأولى لتنظيم الأسماء حسب المشروع أو الحملة.', clear: 'حذف الكل' },
    pt: { empty: 'Sua coleção está vazia', emptyDescription: 'Você ainda não salvou nomes. Use Salvar ou Curtir em um gerador para montar sua coleção.', generate: 'Gerar nomes', noResults: 'Nenhum nome corresponde à sua pesquisa.', collections: 'Suas coleções temáticas', collectionsDescription: 'Agrupe nomes por livro, facção, campanha ou equipe.', create: 'Criar coleção', noCollections: 'Nenhuma coleção criada', noCollectionsDescription: 'Crie sua primeira coleção para organizar nomes por projeto ou campanha.', clear: 'Excluir tudo' },
    it: { empty: 'La tua raccolta è vuota', emptyDescription: 'Non hai ancora salvato nomi. Usa Salva o Mi piace in un generatore per creare la raccolta.', generate: 'Genera nomi', noResults: 'Nessun nome corrisponde alla ricerca.', collections: 'Le tue raccolte tematiche', collectionsDescription: 'Raggruppa i nomi per libro, fazione, campagna o squadra.', create: 'Crea una raccolta', noCollections: 'Nessuna raccolta creata', noCollectionsDescription: 'Crea la prima raccolta per organizzare i nomi per progetto o campagna.', clear: 'Elimina tutto' },
    tr: { empty: 'Koleksiyonun boş', emptyDescription: 'Henüz isim kaydetmedin. Koleksiyonunu oluşturmak için oluşturucularda Kaydet veya Beğen seçeneklerini kullan.', generate: 'İsim oluştur', noResults: 'Aramanla eşleşen isim yok.', collections: 'Tematik koleksiyonların', collectionsDescription: 'İsimleri kitap, grup, kampanya veya takıma göre grupla.', create: 'Koleksiyon oluştur', noCollections: 'Henüz koleksiyon yok', noCollectionsDescription: 'İsimleri projeye veya kampanyaya göre düzenlemek için ilk koleksiyonunu oluştur.', clear: 'Tümünü sil' },
    ja: { empty: 'コレクションは空です', emptyDescription: 'まだ名前が保存されていません。ジェネレーターで保存またはいいねを使ってください。', generate: '名前を生成', noResults: '検索条件に一致する名前はありません。', collections: 'テーマ別コレクション', collectionsDescription: '本、陣営、キャンペーン、チームごとに名前を整理します。', create: 'コレクションを作成', noCollections: 'コレクションはありません', noCollectionsDescription: '最初のコレクションを作成して、プロジェクト別に名前を整理しましょう。', clear: 'すべて削除' },
    ko: { empty: '컬렉션이 비어 있습니다', emptyDescription: '아직 저장한 이름이 없습니다. 생성기에서 저장 또는 좋아요를 사용하세요.', generate: '이름 생성', noResults: '검색 조건과 일치하는 이름이 없습니다.', collections: '테마별 컬렉션', collectionsDescription: '책, 진영, 캠페인 또는 팀별로 이름을 묶으세요.', create: '컬렉션 만들기', noCollections: '생성된 컬렉션이 없습니다', noCollectionsDescription: '프로젝트나 캠페인별로 이름을 정리할 첫 컬렉션을 만드세요.', clear: '모두 삭제' },
    zh: { empty: '你的收藏集为空', emptyDescription: '你还没有保存名称。请在生成器中使用保存或点赞来添加名称。', generate: '生成名称', noResults: '没有名称符合搜索条件。', collections: '主题收藏集', collectionsDescription: '按书籍、阵营、战役或团队整理名称。', create: '创建收藏集', noCollections: '尚无收藏集', noCollectionsDescription: '创建第一个收藏集，按项目或战役整理名称。', clear: '全部删除' },
    ru: { empty: 'Ваша коллекция пуста', emptyDescription: 'Вы ещё не сохраняли имена. Используйте «Сохранить» или «Нравится» в генераторе.', generate: 'Создать имена', noResults: 'Нет имён, соответствующих поиску.', collections: 'Тематические коллекции', collectionsDescription: 'Группируйте имена по книгам, фракциям, кампаниям или командам.', create: 'Создать коллекцию', noCollections: 'Коллекций пока нет', noCollectionsDescription: 'Создайте первую коллекцию для организации имён по проектам.', clear: 'Удалить всё' },
    hi: { empty: 'आपका संग्रह खाली है', emptyDescription: 'आपने अभी तक कोई नाम सहेजा नहीं है। नाम जोड़ने के लिए जनरेटर में सेव या लाइक करें।', generate: 'नाम बनाएँ', noResults: 'आपकी खोज से कोई नाम मेल नहीं खाता।', collections: 'विषयगत संग्रह', collectionsDescription: 'नामों को किताब, गुट, अभियान या टीम के अनुसार व्यवस्थित करें।', create: 'संग्रह बनाएँ', noCollections: 'कोई संग्रह नहीं', noCollectionsDescription: 'नामों को व्यवस्थित करने के लिए अपना पहला संग्रह बनाएँ।', clear: 'सभी हटाएँ' },
    nl: { empty: 'Je collectie is leeg', emptyDescription: 'Je hebt nog geen namen opgeslagen. Gebruik Opslaan of Leuk in een generator.', generate: 'Namen genereren', noResults: 'Geen namen voldoen aan je zoekopdracht.', collections: 'Je themacollecties', collectionsDescription: 'Groepeer namen per boek, factie, campagne of team.', create: 'Collectie maken', noCollections: 'Nog geen collecties', noCollectionsDescription: 'Maak je eerste collectie om namen per project te ordenen.', clear: 'Alles verwijderen' },
    pl: { empty: 'Twoja kolekcja jest pusta', emptyDescription: 'Nie zapisano jeszcze żadnych nazw. Użyj opcji Zapisz lub Polub w generatorze.', generate: 'Generuj nazwy', noResults: 'Brak nazw pasujących do wyszukiwania.', collections: 'Kolekcje tematyczne', collectionsDescription: 'Grupuj nazwy według książki, frakcji, kampanii lub zespołu.', create: 'Utwórz kolekcję', noCollections: 'Brak kolekcji', noCollectionsDescription: 'Utwórz pierwszą kolekcję, aby uporządkować nazwy według projektu.', clear: 'Usuń wszystko' },
    sv: { empty: 'Din samling är tom', emptyDescription: 'Du har inte sparat några namn ännu. Använd Spara eller Gilla i en generator.', generate: 'Generera namn', noResults: 'Inga namn matchar din sökning.', collections: 'Dina temasamlingar', collectionsDescription: 'Gruppera namn efter bok, fraktion, kampanj eller lag.', create: 'Skapa samling', noCollections: 'Inga samlingar ännu', noCollectionsDescription: 'Skapa din första samling för att organisera namn efter projekt.', clear: 'Ta bort alla' },
    vi: { empty: 'Bộ sưu tập của bạn đang trống', emptyDescription: 'Bạn chưa lưu tên nào. Hãy dùng Lưu hoặc Thích trong trình tạo.', generate: 'Tạo tên', noResults: 'Không có tên phù hợp với tìm kiếm.', collections: 'Bộ sưu tập theo chủ đề', collectionsDescription: 'Nhóm tên theo sách, phe phái, chiến dịch hoặc đội.', create: 'Tạo bộ sưu tập', noCollections: 'Chưa có bộ sưu tập', noCollectionsDescription: 'Tạo bộ sưu tập đầu tiên để sắp xếp tên theo dự án.', clear: 'Xóa tất cả' },
    id: { empty: 'Koleksi Anda kosong', emptyDescription: 'Anda belum menyimpan nama. Gunakan Simpan atau Suka di generator.', generate: 'Buat nama', noResults: 'Tidak ada nama yang cocok dengan pencarian.', collections: 'Koleksi bertema', collectionsDescription: 'Kelompokkan nama berdasarkan buku, faksi, kampanye, atau tim.', create: 'Buat koleksi', noCollections: 'Belum ada koleksi', noCollectionsDescription: 'Buat koleksi pertama untuk mengatur nama berdasarkan proyek.', clear: 'Hapus semua' },
    th: { empty: 'คอลเลกชันของคุณว่างเปล่า', emptyDescription: 'คุณยังไม่ได้บันทึกชื่อ ใช้บันทึกหรือถูกใจในตัวสร้างเพื่อเพิ่มชื่อ', generate: 'สร้างชื่อ', noResults: 'ไม่พบชื่อที่ตรงกับการค้นหา', collections: 'คอลเลกชันตามธีม', collectionsDescription: 'จัดกลุ่มชื่อตามหนังสือ ฝ่าย แคมเปญ หรือทีม', create: 'สร้างคอลเลกชัน', noCollections: 'ยังไม่มีคอลเลกชัน', noCollectionsDescription: 'สร้างคอลเลกชันแรกเพื่อจัดระเบียบชื่อตามโปรเจกต์', clear: 'ลบทั้งหมด' },
    el: { empty: 'Η συλλογή σας είναι κενή', emptyDescription: 'Δεν έχετε αποθηκεύσει ονόματα ακόμη. Χρησιμοποιήστε Αποθήκευση ή Μου αρέσει σε μια γεννήτρια.', generate: 'Δημιουργία ονομάτων', noResults: 'Δεν βρέθηκαν ονόματα που να ταιριάζουν.', collections: 'Θεματικές συλλογές', collectionsDescription: 'Ομαδοποιήστε ονόματα ανά βιβλίο, παράταξη, εκστρατεία ή ομάδα.', create: 'Δημιουργία συλλογής', noCollections: 'Δεν υπάρχουν συλλογές', noCollectionsDescription: 'Δημιουργήστε την πρώτη συλλογή για να οργανώσετε ονόματα ανά έργο.', clear: 'Διαγραφή όλων' },
    he: { empty: 'האוסף שלך ריק', emptyDescription: 'עדיין לא שמרת שמות. השתמש בשמירה או בלייק במחולל כדי להוסיף שמות.', generate: 'יצירת שמות', noResults: 'לא נמצאו שמות התואמים לחיפוש.', collections: 'אוספים לפי נושא', collectionsDescription: 'קבץ שמות לפי ספר, סיעה, מערכה או צוות.', create: 'יצירת אוסף', noCollections: 'אין עדיין אוספים', noCollectionsDescription: 'צור את האוסף הראשון כדי לארגן שמות לפי פרויקט.', clear: 'מחיקת הכול' },
    cs: { empty: 'Vaše kolekce je prázdná', emptyDescription: 'Zatím jste neuložili žádná jména. Použijte Uložit nebo Líbí se mi v generátoru.', generate: 'Generovat jména', noResults: 'Žádná jména neodpovídají hledání.', collections: 'Tematické kolekce', collectionsDescription: 'Třiďte jména podle knihy, frakce, kampaně nebo týmu.', create: 'Vytvořit kolekci', noCollections: 'Zatím žádné kolekce', noCollectionsDescription: 'Vytvořte první kolekci a uspořádejte jména podle projektu.', clear: 'Smazat vše' },
    ro: { empty: 'Colecția ta este goală', emptyDescription: 'Nu ai salvat încă nume. Folosește Salvează sau Îmi place într-un generator.', generate: 'Generează nume', noResults: 'Niciun nume nu corespunde căutării.', collections: 'Colecții tematice', collectionsDescription: 'Grupează numele după carte, facțiune, campanie sau echipă.', create: 'Creează o colecție', noCollections: 'Nu există colecții', noCollectionsDescription: 'Creează prima colecție pentru a organiza numele după proiect.', clear: 'Șterge tot' },
    da: { empty: 'Din samling er tom', emptyDescription: 'Du har ikke gemt nogen navne endnu. Brug Gem eller Synes godt om i en generator.', generate: 'Generér navne', noResults: 'Ingen navne matcher din søgning.', collections: 'Temasamlinger', collectionsDescription: 'Gruppér navne efter bog, fraktion, kampagne eller hold.', create: 'Opret samling', noCollections: 'Ingen samlinger endnu', noCollectionsDescription: 'Opret din første samling for at organisere navne efter projekt.', clear: 'Slet alle' },
    fi: { empty: 'Kokoelmasi on tyhjä', emptyDescription: 'Et ole vielä tallentanut nimiä. Lisää nimiä käyttämällä Tallenna- tai Tykkää-toimintoa generaattorissa.', generate: 'Luo nimiä', noResults: 'Hakua vastaavia nimiä ei löytynyt.', collections: 'Aihekokoelmat', collectionsDescription: 'Ryhmittele nimet kirjan, ryhmittymän, kampanjan tai tiimin mukaan.', create: 'Luo kokoelma', noCollections: 'Ei vielä kokoelmia', noCollectionsDescription: 'Luo ensimmäinen kokoelmasi järjestääksesi nimet projektin mukaan.', clear: 'Poista kaikki' },
  };
  const copy = libraryText[currentLanguage] || libraryText.en;
  const controlText: Record<string, {
    compareLimit: string; localBadge: string; exportJson: string; exportCsv: string;
    restore: string; allCollections: string; noCollection: string; allGenerators: string;
    searchPlaceholder: string; compare: string; recentHistory: string; emptyHistory: string;
  }> = {
    fr: { compareLimit: "Vous pouvez comparer jusqu’à 4 noms simultanément.", localBadge: "ESPACE PERSONNEL LOCAL", exportJson: "Sauvegarder tout en JSON", exportCsv: "Exporter en tableau CSV", restore: "Restaurer un fichier JSON", allCollections: "Toutes les collections", noCollection: "Sans collection", allGenerators: "Tous les générateurs", searchPlaceholder: "Filtrer par nom, note ou style...", compare: "Comparer", recentHistory: "Historique récent des générations", emptyHistory: "Historique vide" },
    en: { compareLimit: "You can compare up to 4 names at once.", localBadge: "LOCAL PERSONAL SPACE", exportJson: "Back up everything as JSON", exportCsv: "Export as CSV spreadsheet", restore: "Restore a JSON file", allCollections: "All collections", noCollection: "No collection", allGenerators: "All generators", searchPlaceholder: "Filter by name, note, or style...", compare: "Compare", recentHistory: "Recent generation history", emptyHistory: "History is empty" },
    es: { compareLimit: "Puedes comparar hasta 4 nombres a la vez.", localBadge: "ESPACIO PERSONAL LOCAL", exportJson: "Guardar todo como JSON", exportCsv: "Exportar como hoja CSV", restore: "Restaurar archivo JSON", allCollections: "Todas las colecciones", noCollection: "Sin colección", allGenerators: "Todos los generadores", searchPlaceholder: "Filtrar por nombre, nota o estilo...", compare: "Comparar", recentHistory: "Historial reciente de generación", emptyHistory: "Historial vacío" },
    de: { compareLimit: "Du kannst bis zu 4 Namen gleichzeitig vergleichen.", localBadge: "LOKALER PERSÖNLICHER BEREICH", exportJson: "Alles als JSON sichern", exportCsv: "Als CSV-Tabelle exportieren", restore: "JSON-Datei wiederherstellen", allCollections: "Alle Sammlungen", noCollection: "Keine Sammlung", allGenerators: "Alle Generatoren", searchPlaceholder: "Nach Name, Notiz oder Stil filtern...", compare: "Vergleichen", recentHistory: "Letzter Generierungsverlauf", emptyHistory: "Verlauf ist leer" },
    ar: { compareLimit: "يمكنك مقارنة 4 أسماء كحد أقصى في الوقت نفسه.", localBadge: "مساحة شخصية محلية", exportJson: "حفظ الكل بصيغة JSON", exportCsv: "تصدير كجدول CSV", restore: "استعادة ملف JSON", allCollections: "كل المجموعات", noCollection: "بلا مجموعة", allGenerators: "كل المولّدات", searchPlaceholder: "تصفية حسب الاسم أو الملاحظة أو النمط...", compare: "مقارنة", recentHistory: "سجل التوليد الأخير", emptyHistory: "السجل فارغ" },
    pt: { compareLimit: "Você pode comparar até 4 nomes ao mesmo tempo.", localBadge: "ESPAÇO PESSOAL LOCAL", exportJson: "Guardar tudo como JSON", exportCsv: "Exportar como planilha CSV", restore: "Restaurar arquivo JSON", allCollections: "Todas as coleções", noCollection: "Sem coleção", allGenerators: "Todos os geradores", searchPlaceholder: "Filtrar por nome, nota ou estilo...", compare: "Comparar", recentHistory: "Histórico recente de geração", emptyHistory: "Histórico vazio" },
    it: { compareLimit: "Puoi confrontare fino a 4 nomi contemporaneamente.", localBadge: "SPAZIO PERSONALE LOCALE", exportJson: "Salva tutto come JSON", exportCsv: "Esporta come foglio CSV", restore: "Ripristina file JSON", allCollections: "Tutte le raccolte", noCollection: "Nessuna raccolta", allGenerators: "Tutti i generatori", searchPlaceholder: "Filtra per nome, nota o stile...", compare: "Confronta", recentHistory: "Cronologia recente delle generazioni", emptyHistory: "Cronologia vuota" },
    tr: { compareLimit: "Aynı anda en fazla 4 ismi karşılaştırabilirsin.", localBadge: "YEREL KİŞİSEL ALAN", exportJson: "Tümünü JSON olarak yedekle", exportCsv: "CSV tablosu olarak dışa aktar", restore: "JSON dosyasını geri yükle", allCollections: "Tüm koleksiyonlar", noCollection: "Koleksiyon yok", allGenerators: "Tüm oluşturucular", searchPlaceholder: "İsim, not veya stile göre filtrele...", compare: "Karşılaştır", recentHistory: "Son oluşturma geçmişi", emptyHistory: "Geçmiş boş" },
    ja: { compareLimit: "一度に比較できる名前は最大4件です。", localBadge: "ローカル個人スペース", exportJson: "すべてJSONでバックアップ", exportCsv: "CSV表としてエクスポート", restore: "JSONファイルを復元", allCollections: "すべてのコレクション", noCollection: "コレクションなし", allGenerators: "すべてのジェネレーター", searchPlaceholder: "名前・メモ・スタイルで絞り込む...", compare: "比較", recentHistory: "最近の生成履歴", emptyHistory: "履歴は空です" },
    ko: { compareLimit: "한 번에 최대 4개의 이름을 비교할 수 있습니다.", localBadge: "로컬 개인 공간", exportJson: "모두 JSON으로 백업", exportCsv: "CSV 스프레드시트로 내보내기", restore: "JSON 파일 복원", allCollections: "모든 컬렉션", noCollection: "컬렉션 없음", allGenerators: "모든 생성기", searchPlaceholder: "이름, 메모 또는 스타일로 필터링...", compare: "비교", recentHistory: "최근 생성 기록", emptyHistory: "기록이 비어 있습니다" },
    zh: { compareLimit: "一次最多可比较 4 个名称。", localBadge: "本地个人空间", exportJson: "备份为 JSON", exportCsv: "导出为 CSV 表格", restore: "恢复 JSON 文件", allCollections: "所有收藏集", noCollection: "未分类", allGenerators: "所有生成器", searchPlaceholder: "按名称、备注或风格筛选...", compare: "比较", recentHistory: "最近生成记录", emptyHistory: "记录为空" },
    ru: { compareLimit: "Можно сравнить не более 4 имён одновременно.", localBadge: "ЛИЧНОЕ ЛОКАЛЬНОЕ ПРОСТРАНСТВО", exportJson: "Сохранить всё в JSON", exportCsv: "Экспортировать в CSV", restore: "Восстановить файл JSON", allCollections: "Все коллекции", noCollection: "Без коллекции", allGenerators: "Все генераторы", searchPlaceholder: "Поиск по имени, заметке или стилю...", compare: "Сравнить", recentHistory: "Недавняя история генераций", emptyHistory: "История пуста" },
    hi: { compareLimit: "आप एक बार में अधिकतम 4 नामों की तुलना कर सकते हैं।", localBadge: "स्थानीय व्यक्तिगत स्थान", exportJson: "JSON में सबका बैकअप लें", exportCsv: "CSV के रूप में निर्यात करें", restore: "JSON फ़ाइल पुनर्स्थापित करें", allCollections: "सभी संग्रह", noCollection: "कोई संग्रह नहीं", allGenerators: "सभी जनरेटर", searchPlaceholder: "नाम, नोट या शैली से फ़िल्टर करें...", compare: "तुलना करें", recentHistory: "हाल के जनरेशन का इतिहास", emptyHistory: "इतिहास खाली है" },
    nl: { compareLimit: "Je kunt maximaal 4 namen tegelijk vergelijken.", localBadge: "LOKALE PERSOONLIJKE RUIMTE", exportJson: "Alles als JSON back-uppen", exportCsv: "Exporteren als CSV", restore: "JSON-bestand herstellen", allCollections: "Alle collecties", noCollection: "Geen collectie", allGenerators: "Alle generators", searchPlaceholder: "Filter op naam, notitie of stijl...", compare: "Vergelijken", recentHistory: "Recente generatiegeschiedenis", emptyHistory: "Geschiedenis is leeg" },
    pl: { compareLimit: "Możesz porównać maksymalnie 4 nazwy naraz.", localBadge: "LOKALNA PRZESTRZEŃ OSOBISTA", exportJson: "Zapisz kopię w JSON", exportCsv: "Eksportuj do CSV", restore: "Przywróć plik JSON", allCollections: "Wszystkie kolekcje", noCollection: "Bez kolekcji", allGenerators: "Wszystkie generatory", searchPlaceholder: "Filtruj według nazwy, notatki lub stylu...", compare: "Porównaj", recentHistory: "Ostatnia historia generowania", emptyHistory: "Historia jest pusta" },
    sv: { compareLimit: "Du kan jämföra högst 4 namn åt gången.", localBadge: "LOKALT PERSONLIGT UTRYMME", exportJson: "Säkerhetskopiera som JSON", exportCsv: "Exportera som CSV", restore: "Återställ JSON-fil", allCollections: "Alla samlingar", noCollection: "Ingen samling", allGenerators: "Alla generatorer", searchPlaceholder: "Filtrera efter namn, anteckning eller stil...", compare: "Jämför", recentHistory: "Senaste genereringshistorik", emptyHistory: "Historiken är tom" },
    vi: { compareLimit: "Bạn có thể so sánh tối đa 4 tên cùng lúc.", localBadge: "KHÔNG GIAN CÁ NHÂN CỤC BỘ", exportJson: "Sao lưu tất cả dưới dạng JSON", exportCsv: "Xuất bảng CSV", restore: "Khôi phục tệp JSON", allCollections: "Tất cả bộ sưu tập", noCollection: "Chưa phân loại", allGenerators: "Tất cả trình tạo", searchPlaceholder: "Lọc theo tên, ghi chú hoặc phong cách...", compare: "So sánh", recentHistory: "Lịch sử tạo gần đây", emptyHistory: "Lịch sử trống" },
    id: { compareLimit: "Anda dapat membandingkan hingga 4 nama sekaligus.", localBadge: "RUANG PRIBADI LOKAL", exportJson: "Cadangkan semua sebagai JSON", exportCsv: "Ekspor sebagai CSV", restore: "Pulihkan file JSON", allCollections: "Semua koleksi", noCollection: "Tanpa koleksi", allGenerators: "Semua generator", searchPlaceholder: "Filter berdasarkan nama, catatan, atau gaya...", compare: "Bandingkan", recentHistory: "Riwayat pembuatan terbaru", emptyHistory: "Riwayat kosong" },
    th: { compareLimit: "คุณสามารถเปรียบเทียบชื่อได้สูงสุด 4 ชื่อพร้อมกัน", localBadge: "พื้นที่ส่วนตัวในเครื่อง", exportJson: "สำรองทั้งหมดเป็น JSON", exportCsv: "ส่งออกเป็น CSV", restore: "กู้คืนไฟล์ JSON", allCollections: "คอลเลกชันทั้งหมด", noCollection: "ไม่มีคอลเลกชัน", allGenerators: "ตัวสร้างทั้งหมด", searchPlaceholder: "กรองตามชื่อ บันทึก หรือสไตล์...", compare: "เปรียบเทียบ", recentHistory: "ประวัติการสร้างล่าสุด", emptyHistory: "ประวัติว่างเปล่า" },
    el: { compareLimit: "Μπορείτε να συγκρίνετε έως 4 ονόματα ταυτόχρονα.", localBadge: "ΤΟΠΙΚΟΣ ΠΡΟΣΩΠΙΚΟΣ ΧΩΡΟΣ", exportJson: "Αντίγραφο ασφαλείας σε JSON", exportCsv: "Εξαγωγή σε CSV", restore: "Επαναφορά αρχείου JSON", allCollections: "Όλες οι συλλογές", noCollection: "Χωρίς συλλογή", allGenerators: "Όλες οι γεννήτριες", searchPlaceholder: "Φιλτράρισμα με όνομα, σημείωση ή στυλ...", compare: "Σύγκριση", recentHistory: "Πρόσφατο ιστορικό δημιουργίας", emptyHistory: "Το ιστορικό είναι κενό" },
    he: { compareLimit: "ניתן להשוות עד 4 שמות בו־זמנית.", localBadge: "מרחב אישי מקומי", exportJson: "גיבוי הכול כ־JSON", exportCsv: "ייצוא כטבלת CSV", restore: "שחזור קובץ JSON", allCollections: "כל האוספים", noCollection: "ללא אוסף", allGenerators: "כל המחוללים", searchPlaceholder: "סינון לפי שם, הערה או סגנון...", compare: "השוואה", recentHistory: "היסטוריית יצירה אחרונה", emptyHistory: "ההיסטוריה ריקה" },
    cs: { compareLimit: "Najednou můžete porovnat až 4 jména.", localBadge: "MÍSTNÍ OSOBNÍ PROSTOR", exportJson: "Zálohovat vše do JSON", exportCsv: "Exportovat jako CSV", restore: "Obnovit soubor JSON", allCollections: "Všechny kolekce", noCollection: "Bez kolekce", allGenerators: "Všechny generátory", searchPlaceholder: "Filtrovat podle jména, poznámky nebo stylu...", compare: "Porovnat", recentHistory: "Nedávná historie generování", emptyHistory: "Historie je prázdná" },
    ro: { compareLimit: "Poți compara cel mult 4 nume simultan.", localBadge: "SPAȚIU PERSONAL LOCAL", exportJson: "Fă backup în JSON", exportCsv: "Exportă ca tabel CSV", restore: "Restabilește fișierul JSON", allCollections: "Toate colecțiile", noCollection: "Fără colecție", allGenerators: "Toți generatorii", searchPlaceholder: "Filtrează după nume, notă sau stil...", compare: "Compară", recentHistory: "Istoricul generărilor recente", emptyHistory: "Istoricul este gol" },
    da: { compareLimit: "Du kan sammenligne op til 4 navne ad gangen.", localBadge: "LOKALT PERSONLIGT OMRÅDE", exportJson: "Sikkerhedskopiér som JSON", exportCsv: "Eksportér som CSV", restore: "Gendan JSON-fil", allCollections: "Alle samlinger", noCollection: "Ingen samling", allGenerators: "Alle generatorer", searchPlaceholder: "Filtrér efter navn, note eller stil...", compare: "Sammenlign", recentHistory: "Seneste genereringshistorik", emptyHistory: "Historikken er tom" },
    fi: { compareLimit: "Voit vertailla enintään neljää nimeä kerralla.", localBadge: "PAIKALLINEN HENKILÖKOHTAINEN TILA", exportJson: "Varmuuskopioi JSON-muodossa", exportCsv: "Vie CSV-taulukkona", restore: "Palauta JSON-tiedosto", allCollections: "Kaikki kokoelmat", noCollection: "Ei kokoelmaa", allGenerators: "Kaikki generaattorit", searchPlaceholder: "Suodata nimen, muistiinpanon tai tyylin mukaan...", compare: "Vertaa", recentHistory: "Viimeisin luontihistoria", emptyHistory: "Historia on tyhjä" },
  };
  const controls = controlText[currentLanguage] || controlText.en;
  const extraLabels = getMyNamesAuditLabels(currentLanguage);
  const t = getTranslations(currentLanguage);
  const actionText: Record<string, {
    deleteCollectionConfirm: string; clearHistoryConfirm: string; clearHistory: string;
    assignFolder: string; copyName: string; deleteForever: string; editCollection: string;
    delete: string; save: string; like: string; recentHistoryShort: string;
    copyFiltered: string; copyAll: string; copied: string; copyShort: string;
  }> = {
    fr: { copyFiltered: "Copier les noms filtrés", copyAll: "Tout copier", copied: "Copié", copyShort: "Copier", deleteCollectionConfirm: "Supprimer toute votre collection ?", clearHistoryConfirm: "Vider l’historique des générations ?", clearHistory: "Vider l’historique", assignFolder: "Classer dans un dossier...", copyName: "Copier le nom", deleteForever: "Supprimer définitivement", editCollection: "Modifier la collection", delete: "Supprimer", save: "Enregistrer", like: "Aimer", recentHistoryShort: "Historique récent" },
    en: { copyFiltered: "Copy filtered names", copyAll: "Copy all", copied: "Copied", copyShort: "Copy", deleteCollectionConfirm: "Delete your entire collection?", clearHistoryConfirm: "Clear generation history?", clearHistory: "Clear history", assignFolder: "Move to a collection...", copyName: "Copy name", deleteForever: "Delete permanently", editCollection: "Edit collection", delete: "Delete", save: "Save", like: "Like", recentHistoryShort: "Recent history" },
    es: { copyFiltered: "Copiar nombres filtrados", copyAll: "Copiar todo", copied: "Copiado", copyShort: "Copiar", deleteCollectionConfirm: "¿Eliminar toda tu colección?", clearHistoryConfirm: "¿Vaciar el historial de generación?", clearHistory: "Vaciar historial", assignFolder: "Organizar en una carpeta...", copyName: "Copiar nombre", deleteForever: "Eliminar definitivamente", editCollection: "Editar colección", delete: "Eliminar", save: "Guardar", like: "Me gusta", recentHistoryShort: "Historial reciente" },
    de: { copyFiltered: "Gefilterte Namen kopieren", copyAll: "Alle kopieren", copied: "Kopiert", copyShort: "Kopieren", deleteCollectionConfirm: "Gesamte Sammlung löschen?", clearHistoryConfirm: "Generierungsverlauf leeren?", clearHistory: "Verlauf leeren", assignFolder: "In einen Ordner verschieben...", copyName: "Namen kopieren", deleteForever: "Endgültig löschen", editCollection: "Sammlung bearbeiten", delete: "Löschen", save: "Speichern", like: "Gefällt mir", recentHistoryShort: "Letzter Verlauf" },
    ar: { copyFiltered: "نسخ الأسماء المُصفّاة", copyAll: "نسخ الكل", copied: "تم النسخ", copyShort: "نسخ", deleteCollectionConfirm: "هل تريد حذف مجموعتك بالكامل؟", clearHistoryConfirm: "هل تريد مسح سجل التوليد؟", clearHistory: "مسح السجل", assignFolder: "التصنيف في مجلد...", copyName: "نسخ الاسم", deleteForever: "حذف نهائي", editCollection: "تعديل المجموعة", delete: "حذف", save: "حفظ", like: "إعجاب", recentHistoryShort: "السجل الأخير" },
    pt: { copyFiltered: "Copiar nomes filtrados", copyAll: "Copiar tudo", copied: "Copiado", copyShort: "Copiar", deleteCollectionConfirm: "Excluir toda a sua coleção?", clearHistoryConfirm: "Limpar o histórico de geração?", clearHistory: "Limpar histórico", assignFolder: "Organizar em uma pasta...", copyName: "Copiar nome", deleteForever: "Excluir permanentemente", editCollection: "Editar coleção", delete: "Excluir", save: "Salvar", like: "Curtir", recentHistoryShort: "Histórico recente" },
    it: { copyFiltered: "Copia i nomi filtrati", copyAll: "Copia tutto", copied: "Copiato", copyShort: "Copia", deleteCollectionConfirm: "Eliminare tutta la raccolta?", clearHistoryConfirm: "Svuotare la cronologia delle generazioni?", clearHistory: "Svuota cronologia", assignFolder: "Organizza in una cartella...", copyName: "Copia nome", deleteForever: "Elimina definitivamente", editCollection: "Modifica raccolta", delete: "Elimina", save: "Salva", like: "Mi piace", recentHistoryShort: "Cronologia recente" },
    tr: { copyFiltered: "Filtrelenen adları kopyala", copyAll: "Tümünü kopyala", copied: "Kopyalandı", copyShort: "Kopyala", deleteCollectionConfirm: "Tüm koleksiyon silinsin mi?", clearHistoryConfirm: "Oluşturma geçmişi temizlensin mi?", clearHistory: "Geçmişi temizle", assignFolder: "Bir klasöre yerleştir...", copyName: "İsmi kopyala", deleteForever: "Kalıcı olarak sil", editCollection: "Koleksiyonu düzenle", delete: "Sil", save: "Kaydet", like: "Beğen", recentHistoryShort: "Son geçmiş" },
    ja: { copyFiltered: "絞り込んだ名前をコピー", copyAll: "すべてコピー", copied: "コピーしました", copyShort: "コピー", deleteCollectionConfirm: "コレクション全体を削除しますか？", clearHistoryConfirm: "生成履歴を消去しますか？", clearHistory: "履歴を消去", assignFolder: "フォルダーに分類...", copyName: "名前をコピー", deleteForever: "完全に削除", editCollection: "コレクションを編集", delete: "削除", save: "保存", like: "いいね", recentHistoryShort: "最近の履歴" },
    ko: { copyFiltered: "필터링된 이름 복사", copyAll: "모두 복사", copied: "복사됨", copyShort: "복사", deleteCollectionConfirm: "컬렉션 전체를 삭제할까요?", clearHistoryConfirm: "생성 기록을 지울까요?", clearHistory: "기록 지우기", assignFolder: "폴더에 정리...", copyName: "이름 복사", deleteForever: "영구 삭제", editCollection: "컬렉션 편집", delete: "삭제", save: "저장", like: "좋아요", recentHistoryShort: "최근 기록" },
    zh: { copyFiltered: "复制筛选后的名称", copyAll: "全部复制", copied: "已复制", copyShort: "复制", deleteCollectionConfirm: "删除整个收藏集？", clearHistoryConfirm: "清除生成历史记录？", clearHistory: "清除历史", assignFolder: "移至收藏集...", copyName: "复制名称", deleteForever: "永久删除", editCollection: "编辑收藏集", delete: "删除", save: "保存", like: "喜欢", recentHistoryShort: "最近记录" },
    ru: { copyFiltered: "Копировать отфильтрованные имена", copyAll: "Копировать всё", copied: "Скопировано", copyShort: "Копировать", deleteCollectionConfirm: "Удалить всю коллекцию?", clearHistoryConfirm: "Очистить историю генераций?", clearHistory: "Очистить историю", assignFolder: "Переместить в коллекцию...", copyName: "Копировать имя", deleteForever: "Удалить навсегда", editCollection: "Изменить коллекцию", delete: "Удалить", save: "Сохранить", like: "Нравится", recentHistoryShort: "Недавняя история" },
    hi: { copyFiltered: "फ़िल्टर किए गए नाम कॉपी करें", copyAll: "सभी कॉपी करें", copied: "कॉपी किया गया", copyShort: "कॉपी करें", deleteCollectionConfirm: "पूरा संग्रह हटाएँ?", clearHistoryConfirm: "जनरेशन इतिहास साफ़ करें?", clearHistory: "इतिहास साफ़ करें", assignFolder: "संग्रह में ले जाएँ...", copyName: "नाम कॉपी करें", deleteForever: "हमेशा के लिए हटाएँ", editCollection: "संग्रह संपादित करें", delete: "हटाएँ", save: "सहेजें", like: "पसंद", recentHistoryShort: "हाल का इतिहास" },
    nl: { copyFiltered: "Gefilterde namen kopiëren", copyAll: "Alles kopiëren", copied: "Gekopieerd", copyShort: "Kopiëren", deleteCollectionConfirm: "Je volledige collectie verwijderen?", clearHistoryConfirm: "Generatiegeschiedenis wissen?", clearHistory: "Geschiedenis wissen", assignFolder: "Verplaatsen naar collectie...", copyName: "Naam kopiëren", deleteForever: "Definitief verwijderen", editCollection: "Collectie bewerken", delete: "Verwijderen", save: "Opslaan", like: "Leuk", recentHistoryShort: "Recente geschiedenis" },
    pl: { copyFiltered: "Kopiuj przefiltrowane nazwy", copyAll: "Kopiuj wszystko", copied: "Skopiowano", copyShort: "Kopiuj", deleteCollectionConfirm: "Usunąć całą kolekcję?", clearHistoryConfirm: "Wyczyścić historię generowania?", clearHistory: "Wyczyść historię", assignFolder: "Przenieś do kolekcji...", copyName: "Kopiuj nazwę", deleteForever: "Usuń na stałe", editCollection: "Edytuj kolekcję", delete: "Usuń", save: "Zapisz", like: "Lubię", recentHistoryShort: "Ostatnia historia" },
    sv: { copyFiltered: "Kopiera filtrerade namn", copyAll: "Kopiera alla", copied: "Kopierat", copyShort: "Kopiera", deleteCollectionConfirm: "Ta bort hela samlingen?", clearHistoryConfirm: "Rensa genereringshistoriken?", clearHistory: "Rensa historik", assignFolder: "Flytta till samling...", copyName: "Kopiera namn", deleteForever: "Ta bort permanent", editCollection: "Redigera samling", delete: "Ta bort", save: "Spara", like: "Gilla", recentHistoryShort: "Senaste historik" },
    vi: { copyFiltered: "Sao chép tên đã lọc", copyAll: "Sao chép tất cả", copied: "Đã sao chép", copyShort: "Sao chép", deleteCollectionConfirm: "Xóa toàn bộ bộ sưu tập?", clearHistoryConfirm: "Xóa lịch sử tạo tên?", clearHistory: "Xóa lịch sử", assignFolder: "Chuyển vào bộ sưu tập...", copyName: "Sao chép tên", deleteForever: "Xóa vĩnh viễn", editCollection: "Chỉnh sửa bộ sưu tập", delete: "Xóa", save: "Lưu", like: "Thích", recentHistoryShort: "Lịch sử gần đây" },
    id: { copyFiltered: "Salin nama yang difilter", copyAll: "Salin semua", copied: "Disalin", copyShort: "Salin", deleteCollectionConfirm: "Hapus seluruh koleksi?", clearHistoryConfirm: "Hapus riwayat pembuatan?", clearHistory: "Hapus riwayat", assignFolder: "Pindahkan ke koleksi...", copyName: "Salin nama", deleteForever: "Hapus permanen", editCollection: "Edit koleksi", delete: "Hapus", save: "Simpan", like: "Suka", recentHistoryShort: "Riwayat terbaru" },
    th: { copyFiltered: "คัดลอกชื่อที่กรองแล้ว", copyAll: "คัดลอกทั้งหมด", copied: "คัดลอกแล้ว", copyShort: "คัดลอก", deleteCollectionConfirm: "ลบคอลเลกชันทั้งหมดหรือไม่", clearHistoryConfirm: "ล้างประวัติการสร้างหรือไม่", clearHistory: "ล้างประวัติ", assignFolder: "ย้ายไปยังคอลเลกชัน...", copyName: "คัดลอกชื่อ", deleteForever: "ลบถาวร", editCollection: "แก้ไขคอลเลกชัน", delete: "ลบ", save: "บันทึก", like: "ถูกใจ", recentHistoryShort: "ประวัติล่าสุด" },
    el: { copyFiltered: "Αντιγραφή φιλτραρισμένων ονομάτων", copyAll: "Αντιγραφή όλων", copied: "Αντιγράφηκε", copyShort: "Αντιγραφή", deleteCollectionConfirm: "Να διαγραφεί ολόκληρη η συλλογή;", clearHistoryConfirm: "Να διαγραφεί το ιστορικό δημιουργίας;", clearHistory: "Εκκαθάριση ιστορικού", assignFolder: "Μετακίνηση σε συλλογή...", copyName: "Αντιγραφή ονόματος", deleteForever: "Οριστική διαγραφή", editCollection: "Επεξεργασία συλλογής", delete: "Διαγραφή", save: "Αποθήκευση", like: "Μου αρέσει", recentHistoryShort: "Πρόσφατο ιστορικό" },
    he: { copyFiltered: "העתקת שמות מסוננים", copyAll: "העתקת הכול", copied: "הועתק", copyShort: "העתקה", deleteCollectionConfirm: "למחוק את כל האוסף?", clearHistoryConfirm: "לנקות את היסטוריית היצירה?", clearHistory: "ניקוי היסטוריה", assignFolder: "העברה לאוסף...", copyName: "העתקת שם", deleteForever: "מחיקה לצמיתות", editCollection: "עריכת אוסף", delete: "מחיקה", save: "שמירה", like: "אהבתי", recentHistoryShort: "היסטוריה אחרונה" },
    cs: { copyFiltered: "Kopírovat filtrovaná jména", copyAll: "Kopírovat vše", copied: "Zkopírováno", copyShort: "Kopírovat", deleteCollectionConfirm: "Smazat celou kolekci?", clearHistoryConfirm: "Vymazat historii generování?", clearHistory: "Vymazat historii", assignFolder: "Přesunout do kolekce...", copyName: "Kopírovat jméno", deleteForever: "Trvale smazat", editCollection: "Upravit kolekci", delete: "Smazat", save: "Uložit", like: "Líbí se mi", recentHistoryShort: "Nedávná historie" },
    ro: { copyFiltered: "Copiază numele filtrate", copyAll: "Copiază tot", copied: "Copiat", copyShort: "Copiază", deleteCollectionConfirm: "Ștergi întreaga colecție?", clearHistoryConfirm: "Ștergi istoricul generării?", clearHistory: "Șterge istoricul", assignFolder: "Mută în colecție...", copyName: "Copiază numele", deleteForever: "Șterge definitiv", editCollection: "Editează colecția", delete: "Șterge", save: "Salvează", like: "Îmi place", recentHistoryShort: "Istoric recent" },
    da: { copyFiltered: "Kopiér filtrerede navne", copyAll: "Kopiér alle", copied: "Kopieret", copyShort: "Kopiér", deleteCollectionConfirm: "Slet hele samlingen?", clearHistoryConfirm: "Rydde genereringshistorikken?", clearHistory: "Ryd historik", assignFolder: "Flyt til samling...", copyName: "Kopiér navn", deleteForever: "Slet permanent", editCollection: "Rediger samling", delete: "Slet", save: "Gem", like: "Synes godt om", recentHistoryShort: "Seneste historik" },
    fi: { copyFiltered: "Kopioi suodatetut nimet", copyAll: "Kopioi kaikki", copied: "Kopioitu", copyShort: "Kopioi", deleteCollectionConfirm: "Poistetaanko koko kokoelma?", clearHistoryConfirm: "Tyhjennetäänkö luontihistoria?", clearHistory: "Tyhjennä historia", assignFolder: "Siirrä kokoelmaan...", copyName: "Kopioi nimi", deleteForever: "Poista pysyvästi", editCollection: "Muokkaa kokoelmaa", delete: "Poista", save: "Tallenna", like: "Tykkää", recentHistoryShort: "Viimeisin historia" },
  };
  const actions = actionText[currentLanguage] || actionText.en;
  const [entries, setEntries] = useState<SavedNameEntry[]>([]);
  const [collections, setCollections] = useState<NamedCollection[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState<StorageStats>({
    total: 0,
    saved: 0,
    liked: 0,
    notes: 0,
    generators: 0,
    collections: 0,
    history: 0,
  });

  // Navigation tab inside MyNames: 'names' | 'collections' | 'history'
  const [activeMainTab, setActiveMainTab] = useState<'names' | 'collections' | 'history'>('names');

  // Filters for names tab
  const [filterTab, setFilterTab] = useState<'all' | 'saved' | 'liked' | 'notes'>('all');
  const [filterGenerator, setFilterGenerator] = useState<string>('all');
  const [filterCollectionId, setFilterCollectionId] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Notifications & Modals
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);

  // Compare selection (2 to 4 names)
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Collection modal
  const [editingCollection, setEditingCollection] = useState<NamedCollection | null | undefined>(undefined);

  // Note modal
  const [activeNoteModal, setActiveNoteModal] = useState<{
    name: string;
    generatorId: string;
    style: string;
  } | null>(null);

  // Import feedback
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reloadData = () => {
    setEntries(getSavedNames());
    setCollections(getCollections());
    setHistory(getGenerationHistory());
    setStats(getNameForgeStats());
  };

  useEffect(() => {
    reloadData();
    const unsubscribe = subscribeToStorage(reloadData);
    return () => unsubscribe();
  }, []);

  const handleCopySingle = async (name: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(name);
      } else {
        const t = document.createElement('textarea');
        t.value = name;
        document.body.appendChild(t);
        t.select();
        document.execCommand('copy');
        t.remove();
      }
      setCopiedName(name);
      setTimeout(() => setCopiedName(null), 1400);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyAll = async () => {
    if (!filteredEntries.length) return;
    const text = filteredEntries.map((e) => e.name).join('\n');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1600);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportJSON = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nameforge-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csvStr = exportDataCSV();
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nameforge-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importDataJSON(content);
      if (res.success) {
        setImportStatus(
          extraLabels.importSuccess.replace('{added}', String(res.added)).replace('{updated}', String(res.updated)).replace('{skipped}', String(res.skipped))
        );
        reloadData();
      } else {
        setImportStatus(`${extraLabels.importError}: ${res.errors.join(', ')}`);
      }
      setTimeout(() => setImportStatus(null), 5000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleToggleCompareSelection = (name: string) => {
    if (selectedForCompare.includes(name)) {
      setSelectedForCompare(selectedForCompare.filter((n) => n !== name));
    } else {
      if (selectedForCompare.length >= 4) {
        alert(controls.compareLimit);
        return;
      }
      setSelectedForCompare([...selectedForCompare, name]);
    }
  };

  const handleRate = (name: string, r: number, currentRating: number = 0) => {
    const next = currentRating === r ? 0 : r;
    setStoredRating(name, next);
    reloadData();
  };

  const handleDelete = (name: string, generator?: string) => {
    deleteSavedName(name, generator);
    setSelectedForCompare(selectedForCompare.filter((n) => n !== name));
    reloadData();
  };

  const handleClearEverything = () => {
    clearAllSavedNames();
    setShowClearConfirm(false);
    setSelectedForCompare([]);
    reloadData();
  };

  const handleClearHistory = () => {
    clearGenerationHistory();
    setShowClearHistoryConfirm(false);
    reloadData();
  };

  // Filter entries
  const filteredEntries = entries.filter((item) => {
    if (filterTab === 'saved' && !item.saved) return false;
    if (filterTab === 'liked' && !item.liked) return false;
    if (filterTab === 'notes' && !item.note?.trim()) return false;

    if (filterGenerator !== 'all' && item.generator.toLowerCase() !== filterGenerator.toLowerCase()) {
      return false;
    }

    if (filterCollectionId !== 'all') {
      if (filterCollectionId === 'none' && item.collectionId) return false;
      if (filterCollectionId !== 'none' && item.collectionId !== filterCollectionId) return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchNote = item.note?.toLowerCase().includes(q);
      const matchStyle = item.style?.toLowerCase().includes(q);
      if (!matchName && !matchNote && !matchStyle) return false;
    }

    return true;
  });

  const isRtlLanguage = ['ar', 'he', 'fa', 'ur', 'ps'].includes(currentLanguage);

  return (
    <div dir={isRtlLanguage ? 'rtl' : 'ltr'} lang={currentLanguage} className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-8 py-10 space-y-8 text-start">
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        accept=".json"
        className="hidden"
      />

      {/* Note Modal */}
      {activeNoteModal && (
        <NoteModal
          name={activeNoteModal.name}
          generatorId={activeNoteModal.generatorId}
          style={activeNoteModal.style}
          onClose={() => setActiveNoteModal(null)}
          onSave={reloadData}
        />
      )}

      {/* Collection Modal */}
      {editingCollection !== undefined && (
        <CollectionModal
          collection={editingCollection}
          onClose={() => setEditingCollection(undefined)}
          onSaved={reloadData}
        />
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <CompareModal
          initialNames={selectedForCompare}
          onClose={() => setShowCompareModal(false)}
          onUpdate={reloadData}
        />
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0f172a] border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">{actions.deleteCollectionConfirm}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.settingsModal.confirmClearMsg}
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
              >
                {t.settingsModal.confirmClearCancel}
              </button>
              <button
                onClick={handleClearEverything}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-600/30 cursor-pointer"
              >
                {t.settingsModal.confirmClearYes}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear History Confirmation Modal */}
      {showClearHistoryConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0f172a] border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">{actions.clearHistoryConfirm}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {actions.clearHistoryConfirm}
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowClearHistoryConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-md cursor-pointer"
              >
                {actions.clearHistory}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-extrabold uppercase tracking-widest mb-3">
          <Bookmark className="w-3.5 h-3.5" />
          <span>{controls.localBadge}</span>
        </div>
        <h1 className="nf-animated-heading text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3">
          {t.nav.myNames}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          {t.settingsModal.dataDesc}
        </p>
      </div>

      {/* Import Status Alert */}
      {importStatus && (
        <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-500/50 text-xs text-purple-200 text-center font-medium animate-fade-in">
          {importStatus}
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-[#0f172a] border border-slate-800 text-center">
          <div className="text-xl sm:text-2xl font-black text-white">{stats.total}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
            {extraLabels.trackedNames}
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#0f172a] border border-slate-800 text-center">
          <div className="text-xl sm:text-2xl font-black text-purple-400">{stats.saved}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
            {t.nameCard.saved}
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#0f172a] border border-slate-800 text-center">
          <div className="text-xl sm:text-2xl font-black text-pink-400">{stats.liked}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
            {t.nameCard.liked}
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#0f172a] border border-slate-800 text-center">
          <div className="text-xl sm:text-2xl font-black text-cyan-400">{stats.collections}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
            Collections
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#0f172a] border border-slate-800 text-center">
          <div className="text-xl sm:text-2xl font-black text-amber-400">{stats.notes}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
            Avec Notes
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#0f172a] border border-slate-800 text-center col-span-2 sm:col-span-1">
          <div className="text-xl sm:text-2xl font-black text-emerald-400">{stats.history}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
            Historique (50)
          </div>
        </div>
      </div>

      {/* Main Mode Tabs: Noms | Collections | Historique */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMainTab('names')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeMainTab === 'names'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{t.nav.myNames} ({entries.length})</span>
          </button>

          <button
            onClick={() => setActiveMainTab('collections')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeMainTab === 'collections'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>{copy.collections} ({collections.length})</span>
          </button>

          <button
            onClick={() => setActiveMainTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeMainTab === 'history'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{actions.recentHistoryShort} ({history.length})</span>
          </button>
        </div>

        {/* Global Export/Import & Compare Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {selectedForCompare.length > 0 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{extraLabels.compare} ({selectedForCompare.length})</span>
            </button>
          )}

          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            title={controls.exportJson}
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>JSON</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            title={controls.exportCsv}
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            title={controls.restore}
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>{extraLabels.restore}</span>
          </button>
        </div>
      </div>

      {/* ====================================================================
          TAB 1 : NOMS ENREGISTRÉS
      ===================================================================== */}
      {activeMainTab === 'names' && (
        <div className="space-y-6">
          {/* Controls & Search Toolbar */}
          <div className="space-y-3.5 p-4 rounded-3xl bg-[#0f172a] border border-slate-800">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Status filter tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {(
                  [
                    ['all', extraLabels.all],
                    ['saved', extraLabels.saved],
                    ['liked', extraLabels.favorites],
                    ['notes', extraLabels.withNotes],
                  ] as const
                ).map(([tabKey, label]) => (
                  <button
                    key={tabKey}
                    onClick={() => setFilterTab(tabKey)}
                    aria-pressed={filterTab === tabKey}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer border ${
                      filterTab === tabKey
                        ? 'bg-purple-600 text-white border-purple-400'
                        : 'bg-[#0a0f1d] text-slate-400 hover:text-white border-slate-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Generator & Collection dropdowns */}
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  aria-label={controls.allCollections}
                  value={filterCollectionId}
                  onChange={(e) => setFilterCollectionId(e.target.value)}
                  className="h-9 px-3 bg-[#0a0f1d] border border-slate-700/80 rounded-xl text-xs font-semibold text-white cursor-pointer"
                >
                  <option value="all">{controls.allCollections}</option>
                  <option value="none">{controls.noCollection}</option>
                  {collections.map((col) => (
                    <option key={col.id} value={col.id}>
                      📁 {col.name}
                    </option>
                  ))}
                </select>

                <select
                  aria-label={controls.allGenerators}
                  value={filterGenerator}
                  onChange={(e) => setFilterGenerator(e.target.value)}
                  className="h-9 px-3 bg-[#0a0f1d] border border-slate-700/80 rounded-xl text-xs font-semibold text-white cursor-pointer"
                >
                  <option value="all">{controls.allGenerators}</option>
                  {ALL_GENERATORS_LIST.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.icon} {g.shortTitle}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search bar + Bulk export actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={controls.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-9 ps-9 pe-3 bg-[#0a0f1d] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {filteredEntries.length > 0 && (
                  <button
                    onClick={handleCopyAll}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    title={actions.copyFiltered}
                  >
                    {copiedAll ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{actions.copied} {filteredEntries.length}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{actions.copyAll} ({filteredEntries.length})</span>
                      </>
                    )}
                  </button>
                )}

                {entries.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{copy.clear}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {entries.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#0e1627] border border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto text-2xl">
                🔖
              </div>
              <h3 className="nf-animated-heading text-xl font-bold">{copy.empty}</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                {copy.emptyDescription}
              </p>
              <button
                onClick={() => onNavigate('home')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 shadow-lg shadow-purple-600/30 transition inline-flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>{copy.generate}</span>
              </button>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-sm">{copy.noResults}</p>
              <button
                onClick={() => {
                  setFilterTab('all');
                  setFilterGenerator('all');
                  setFilterCollectionId('all');
                  setSearch('');
                }}
                className="mt-2 text-xs font-bold text-purple-400 hover:underline cursor-pointer"
              >
                {extraLabels.resetFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEntries.map((item) => {
                const assignedCol = collections.find((c) => c.id === item.collectionId);
                const isSelected = selectedForCompare.includes(item.name);

                return (
                  <article
                    key={item.id}
                    className={`p-5 rounded-2xl bg-[#101625] border transition flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'border-cyan-400/80 shadow-lg shadow-cyan-900/20 ring-1 ring-cyan-400/50'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-950/50 text-purple-300 border border-purple-800/40">
                            {item.generator}
                          </span>
                          {assignedCol && (
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1"
                              style={{ backgroundColor: assignedCol.color || '#8b5cf6' }}
                            >
                              📁 {assignedCol.name}
                            </span>
                          )}
                        </div>

                        {/* Compare Checkbox */}
                        <label className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-cyan-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleCompareSelection(item.name)}
                            className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0 cursor-pointer"
                          />
                          <span>{controls.compare}</span>
                        </label>
                      </div>

                      <h3 className="text-xl font-black text-white break-words">{item.name}</h3>
                      {item.style && (
                        <p className="text-xs text-pink-400 font-semibold mt-0.5">Style : {getLocalizedStyleLabel(item.style, currentLanguage, item.generator)}</p>
                      )}

                      {/* 5-star rating */}
                      <div className="flex items-center gap-1 mt-2.5">
                        {[1, 2, 3, 4, 5].map((starIndex) => (
                          <button
                            key={starIndex}
                            onClick={() => handleRate(item.name, starIndex, item.rating)}
                            className="p-0.5 text-slate-600 hover:text-amber-400 transition cursor-pointer"
                            title={extraLabels.rateStars.replace('{count}', String(starIndex))}
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                starIndex <= (item.rating || 0)
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-[11px] text-slate-500 ms-1">
                          {item.rating ? `${item.rating}/5` : extraLabels.notRated}
                        </span>
                      </div>

                      {/* Collection assigner */}
                      <div className="mt-2.5">
                        <select
                          aria-label={actions.assignFolder}
                          value={item.collectionId || ''}
                          onChange={(e) => {
                            assignNameToCollection(item.name, e.target.value || undefined);
                            reloadData();
                          }}
                          className="w-full text-[11px] px-2 py-1 bg-[#0a0f1d] border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
                        >
                          <option value="">📁 {actions.assignFolder}</option>
                          {collections.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Note display */}
                      {item.note ? (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-[#090e1c] border border-slate-800 text-xs text-slate-300 leading-relaxed italic relative">
                          "{item.note}"
                        </div>
                      ) : null}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-slate-800/80 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            toggleSaveName(item.name, item.generator, item.style);
                            reloadData();
                          }}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                            item.saved
                              ? 'bg-purple-600/30 text-purple-300 border-purple-500/50'
                              : 'bg-[#101a2c] text-slate-400 border-slate-700/80'
                          }`}
                        >
                          <Bookmark
                            className={`w-3.5 h-3.5 ${item.saved ? 'fill-current text-purple-400' : ''}`}
                          />
                          <span>{item.saved ? t.nameCard.saved : actions.save}</span>
                        </button>

                        <button
                          onClick={() => {
                            toggleLikeName(item.name, item.generator, item.style);
                            reloadData();
                          }}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                            item.liked
                              ? 'bg-pink-600/30 text-pink-300 border-pink-500/50'
                              : 'bg-[#101a2c] text-slate-400 border-slate-700/80'
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${item.liked ? 'fill-current text-pink-400' : ''}`}
                          />
                          <span>{actions.like}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setActiveNoteModal({
                              name: item.name,
                              generatorId: item.generator,
                              style: item.style,
                            })
                          }
                          className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-purple-400" />
                          <span>{item.note ? 'Note' : '+ Note'}</span>
                        </button>

                        <button
                          onClick={() => handleCopySingle(item.name)}
                          className="py-1.5 px-3 rounded-xl bg-[#182236] hover:bg-[#202e48] text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                          title={actions.copyName}
                        >
                          {copiedName === item.name ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(item.name, item.generator)}
                          className="py-1.5 px-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs transition cursor-pointer"
                          title={actions.deleteForever}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          TAB 2 : DOSSIERS & COLLECTIONS
      ===================================================================== */}
      {activeMainTab === 'collections' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="nf-animated-heading text-xl font-bold">{copy.collections}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {copy.collectionsDescription}
              </p>
            </div>
            <button
              onClick={() => setEditingCollection(null)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{copy.create}</span>
            </button>
          </div>

          {collections.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#0e1627] border border-slate-800 space-y-3">
              <FolderPlus className="w-12 h-12 text-purple-400 mx-auto opacity-70" />
              <h3 className="text-base font-bold text-white">{copy.noCollections}</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {copy.noCollectionsDescription}
              </p>
              <button
                onClick={() => setEditingCollection(null)}
                className="mt-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer"
              >
                + {copy.create}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((col) => {
                const count = entries.filter((e) => e.collectionId === col.id).length;
                return (
                  <div
                    key={col.id}
                    className="p-5 rounded-2xl bg-[#101827] border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: col.color || '#8b5cf6' }}
                        />
                        <span className="text-[11px] font-bold text-purple-300">
                          {count} {count <= 1 ? 'nom' : 'noms'}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-white">{col.name}</h3>
                      {col.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{col.description}</p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setFilterCollectionId(col.id);
                          setActiveMainTab('names');
                        }}
                        className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
                      >
                        {`${t.nav.myNames} (${count}) →`}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingCollection(col)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                          title={actions.editCollection}
                        >
                          {actions.editCollection}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`${actions.deleteCollectionConfirm}\n\n${col.name}`)) {
                              deleteCollection(col.id);
                              reloadData();
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs cursor-pointer"
                          title={actions.delete}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          TAB 3 : HISTORIQUE RÉCENT (50 NOMS)
      ===================================================================== */}
      {activeMainTab === 'history' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="nf-animated-heading text-xl font-bold">{controls.recentHistory}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {controls.recentHistory}
              </p>
            </div>
            {history.length > 0 && (
              <button
                onClick={() => setShowClearHistoryConfirm(true)}
                className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{actions.clearHistory}</span>
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#0e1627] border border-slate-800 space-y-3">
              <History className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">{controls.emptyHistory}</h3>
              <p className="text-xs text-slate-400">
                {copy.emptyDescription}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {history.map((item) => {
                const isSaved = entries.some((e) => e.name.toLowerCase() === item.name.toLowerCase() && e.saved);
                const isLiked = entries.some((e) => e.name.toLowerCase() === item.name.toLowerCase() && e.liked);

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#0f1728] border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                          {item.generator}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(item.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <h4 className="text-lg font-black text-white">{item.name}</h4>
                      {item.style && <p className="text-xs text-pink-400 font-semibold mt-0.5">{getLocalizedStyleLabel(item.style, currentLanguage, item.generator)}</p>}
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            toggleSaveName(item.name, item.generator, item.style);
                            reloadData();
                          }}
                          className={`p-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                            isSaved
                              ? 'bg-purple-600/30 text-purple-300 border-purple-500/50'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                          title={actions.save}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>

                        <button
                          onClick={() => {
                            toggleLikeName(item.name, item.generator, item.style);
                            reloadData();
                          }}
                          className={`p-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                            isLiked
                              ? 'bg-pink-600/30 text-pink-300 border-pink-500/50'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                          title={actions.like}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-pink-400' : ''}`} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleCopySingle(item.name)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1 transition cursor-pointer"
                      >
                        {copiedName === item.name ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{actions.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{actions.copyShort}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
