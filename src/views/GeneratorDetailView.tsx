import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronDown, Check, ArrowLeft, ShieldAlert, Star, Award, Copy, Download, Layers } from 'lucide-react';
import { GeneratorControl } from '../components/GeneratorControl';
import { NameCard } from '../components/NameCard';
import { NoteModal } from '../components/NoteModal';
import { GENERATORS_METADATA, ALL_GENERATORS_LIST } from '../data/generators';
import { generateNames } from '../services/generatorEngine';
import { getTopRatedNamesByCategory, subscribeToStorage } from '../services/storage';
import {
  FormatOption,
  GenderOption,
  GeneratedName,
  GeneratorId,
  GenLanguageCode,
  LengthOption,
  SavedNameEntry,
} from '../types';
import { getAppSettings, subscribeToSettings } from '../services/settings';
import { getLocalizedGeneratorDescription } from '../i18n/generatorContent';
import { getLocalizedStyleLabel } from '../i18n/styleLabels';
import { getLocalizedGeneratorTitle, getLocalizedGeneratorShortTitle } from '../i18n/generatorTitles';
import { getLocalizedEditorialMeta } from '../i18n/localizedGeneratorMeta';

interface GeneratorDetailViewProps {
  generatorId: GeneratorId;
  onNavigate: (view: string, genId?: GeneratorId) => void;
}

export const GeneratorDetailView: React.FC<GeneratorDetailViewProps> = ({
  generatorId,
  onNavigate,
}) => {
  const sourceMeta = GENERATORS_METADATA[generatorId] || GENERATORS_METADATA.fantasy;
  const settings = getAppSettings();
  const [language, setLanguage] = useState(settings.language);
  const localizedTitle = getLocalizedGeneratorTitle(generatorId, language, sourceMeta.title);
  const localizedShortTitle = getLocalizedGeneratorShortTitle(generatorId, language, sourceMeta.shortTitle);
  const meta = getLocalizedEditorialMeta(sourceMeta, language, localizedShortTitle);
  const localizedDescription = getLocalizedGeneratorDescription(sourceMeta, language);

  useEffect(() => subscribeToSettings((next) => setLanguage(next.language)), []);

  const ui: Record<string, Record<string, string>> = {
    en: { back: 'Back to all generators', proposals: 'names generated', inspired: 'Inspired by:', copyAllTitle: 'Copy the full list with descriptions', copiedBatch: 'Batch copied!', copyBatch: 'Copy batch', exportTextTitle: 'Download this batch as text', exportCsvTitle: 'Download this batch as CSV spreadsheet', tip: 'Tip: Press', tipEnd: 'to forge a new batch instantly.', leaderboard: 'INDEPENDENT LEADERBOARD', bestNames: 'Your Top Rated Names', leaderboardDesc: 'Ranked strictly by your 1–5 star ratings for this category.', ratedCount: 'rated suggestion(s)', stars: 'stars', copied: 'Copied', copy: 'Copy', noRatings: 'No ratings yet for', noRatingsDesc: 'Rate the names above to build your personal leaderboard for this generator.', advantages: 'Key Advantages', limits: 'Points to Consider', explore: 'Explore other categories' },
    fr: { back: 'Retour à tous les générateurs', proposals: 'propositions façonnées', inspired: 'Inspiré de :', copyAllTitle: 'Copier toute la liste avec descriptions', copiedBatch: 'Lot copié !', copyBatch: 'Copier tout le lot', exportTextTitle: 'Télécharger ce lot au format texte', exportCsvTitle: 'Télécharger ce lot au format tableur CSV', tip: 'Astuce : appuyez sur', tipEnd: 'pour forger un nouveau lot instantanément.', leaderboard: 'PALMARÈS INDÉPENDANT', bestNames: 'Vos meilleurs noms évalués', leaderboardDesc: 'Classement basé sur vos notes de 1 à 5 étoiles pour cette catégorie.', ratedCount: 'proposition(s) notée(s)', stars: 'étoiles', copied: 'Copié', copy: 'Copier', noRatings: 'Pas encore d’évaluation pour', noRatingsDesc: 'Attribuez des étoiles aux noms générés ci-dessus pour bâtir votre palmarès personnel.', advantages: 'Avantages clés', limits: 'Points de vigilance', explore: 'Explorer d’autres catégories' },
    ar: { back: 'العودة إلى جميع المولّدات', proposals: 'أسماء تم إنشاؤها', inspired: 'مستوحى من:', copyAllTitle: 'نسخ القائمة كاملة مع الأوصاف', copiedBatch: 'تم نسخ المجموعة!', copyBatch: 'نسخ المجموعة', exportTextTitle: 'تنزيل المجموعة كملف نصي', exportCsvTitle: 'تنزيل المجموعة كجدول CSV', tip: 'نصيحة: اضغط على', tipEnd: 'لإنشاء مجموعة جديدة فورًا.', leaderboard: 'قائمة التقييم المستقلة', bestNames: 'الأسماء الأعلى تقييمًا', leaderboardDesc: 'ترتيب وفق تقييماتك من نجمة إلى خمس نجوم لهذه الفئة.', ratedCount: 'اقتراحات مقيّمة', stars: 'نجوم', copied: 'تم النسخ', copy: 'نسخ', noRatings: 'لا توجد تقييمات بعد لـ', noRatingsDesc: 'قيّم الأسماء أعلاه لبناء قائمتك الشخصية لهذا المولد.', advantages: 'المزايا الرئيسية', limits: 'نقاط يجب مراعاتها', explore: 'استكشف فئات أخرى' },
    es: { back: 'Volver a todos los generadores', proposals: 'nombres generados', inspired: 'Inspirado en:', copyAllTitle: 'Copiar la lista completa con descripciones', copiedBatch: '¡Lote copiado!', copyBatch: 'Copiar lote', exportTextTitle: 'Descargar este lote como texto', exportCsvTitle: 'Descargar este lote como hoja CSV', tip: 'Consejo: pulsa', tipEnd: 'para crear un lote nuevo al instante.', leaderboard: 'CLASIFICACIÓN INDEPENDIENTE', bestNames: 'Tus nombres mejor valorados', leaderboardDesc: 'Clasificación basada en tus valoraciones de 1 a 5 estrellas para esta categoría.', ratedCount: 'propuesta(s) valorada(s)', stars: 'estrellas', copied: 'Copiado', copy: 'Copiar', noRatings: 'Aún no hay valoraciones para', noRatingsDesc: 'Valora los nombres anteriores para crear tu clasificación personal.', advantages: 'Ventajas principales', limits: 'Aspectos a tener en cuenta', explore: 'Explorar otras categorías' },
    de: { back: 'Zurück zu allen Generatoren', proposals: 'generierte Namen', inspired: 'Inspiriert von:', copyAllTitle: 'Gesamte Liste mit Beschreibungen kopieren', copiedBatch: 'Stapel kopiert!', copyBatch: 'Stapel kopieren', exportTextTitle: 'Stapel als Text herunterladen', exportCsvTitle: 'Stapel als CSV-Tabelle herunterladen', tip: 'Tipp: Drücke', tipEnd: ', um sofort einen neuen Stapel zu erstellen.', leaderboard: 'UNABHÄNGIGE RANGLISTE', bestNames: 'Deine bestbewerteten Namen', leaderboardDesc: 'Rangliste anhand deiner Bewertungen von 1 bis 5 Sternen für diese Kategorie.', ratedCount: 'bewertete Vorschläge', stars: 'Sterne', copied: 'Kopiert', copy: 'Kopieren', noRatings: 'Noch keine Bewertungen für', noRatingsDesc: 'Bewerte die Namen oben, um deine persönliche Rangliste aufzubauen.', advantages: 'Wichtige Vorteile', limits: 'Zu beachten', explore: 'Weitere Kategorien entdecken' },
    it: { back: 'Torna a tutti i generatori', proposals: 'nomi generati', inspired: 'Ispirato da:', copyAllTitle: 'Copiare l’elenco completo con descrizioni', copiedBatch: 'Lotto copiato!', copyBatch: 'Copia lotto', exportTextTitle: 'Scarica il lotto come testo', exportCsvTitle: 'Scarica il lotto come foglio CSV', tip: 'Suggerimento: premi', tipEnd: 'per creare subito un nuovo lotto.', leaderboard: 'CLASSIFICA INDIPENDENTE', bestNames: 'I tuoi nomi più votati', leaderboardDesc: 'Classifica basata sulle tue valutazioni da 1 a 5 stelle per questa categoria.', ratedCount: 'proposta/e valutata/e', stars: 'stelle', copied: 'Copiato', copy: 'Copia', noRatings: 'Ancora nessuna valutazione per', noRatingsDesc: 'Valuta i nomi qui sopra per creare la tua classifica personale.', advantages: 'Vantaggi principali', limits: 'Aspetti da considerare', explore: 'Esplora altre categorie' },
    pt: { back: 'Voltar a todos os geradores', proposals: 'nomes gerados', inspired: 'Inspirado em:', copyAllTitle: 'Copiar a lista completa com descrições', copiedBatch: 'Lote copiado!', copyBatch: 'Copiar lote', exportTextTitle: 'Baixar este lote como texto', exportCsvTitle: 'Baixar este lote como planilha CSV', tip: 'Dica: pressione', tipEnd: 'para criar um novo lote instantaneamente.', leaderboard: 'CLASSIFICAÇÃO INDEPENDENTE', bestNames: 'Seus nomes mais bem avaliados', leaderboardDesc: 'Classificação baseada nas suas avaliações de 1 a 5 estrelas nesta categoria.', ratedCount: 'sugestão(ões) avaliada(s)', stars: 'estrelas', copied: 'Copiado', copy: 'Copiar', noRatings: 'Ainda sem avaliações para', noRatingsDesc: 'Avalie os nomes acima para criar sua classificação pessoal.', advantages: 'Principais vantagens', limits: 'Pontos de atenção', explore: 'Explorar outras categorias' },
    tr: { back: 'Tüm oluşturuculara dön', proposals: 'oluşturulan ad', inspired: 'Şundan ilham aldı:', copyAllTitle: 'Açıklamalarla tüm listeyi kopyala', copiedBatch: 'Liste kopyalandı!', copyBatch: 'Listeyi kopyala', exportTextTitle: 'Listeyi metin olarak indir', exportCsvTitle: 'Listeyi CSV tablosu olarak indir', tip: 'İpucu: Yeni bir liste oluşturmak için', tipEnd: 'tuşuna basın.', leaderboard: 'BAĞIMSIZ SIRALAMA', bestNames: 'En yüksek puanlı adlarınız', leaderboardDesc: 'Bu kategori için 1–5 yıldız puanlarınıza göre sıralanır.', ratedCount: 'puanlanan öneri', stars: 'yıldız', copied: 'Kopyalandı', copy: 'Kopyala', noRatings: 'Henüz puan yok:', noRatingsDesc: 'Kişisel sıralamanızı oluşturmak için yukarıdaki adları puanlayın.', advantages: 'Temel avantajlar', limits: 'Dikkat edilmesi gerekenler', explore: 'Diğer kategorileri keşfet' },
    ja: { back: 'すべてのジェネレーターに戻る', proposals: '生成された名前', inspired: '着想元：', copyAllTitle: '説明付きのリスト全体をコピー', copiedBatch: '一括コピーしました！', copyBatch: '一括コピー', exportTextTitle: 'テキスト形式でダウンロード', exportCsvTitle: 'CSV形式でダウンロード', tip: 'ヒント：', tipEnd: 'キーを押すとすぐに新しい候補を生成できます。', leaderboard: '独立ランキング', bestNames: '高評価の名前', leaderboardDesc: 'このカテゴリでの1〜5つ星評価に基づくランキングです。', ratedCount: '件の評価済み候補', stars: 'つ星', copied: 'コピー済み', copy: 'コピー', noRatings: 'まだ評価がありません：', noRatingsDesc: '上の名前を評価して、自分だけのランキングを作成しましょう。', advantages: '主なメリット', limits: '注意点', explore: 'ほかのカテゴリを探す' },
    ko: { back: '모든 생성기로 돌아가기', proposals: '생성된 이름', inspired: '영감 출처:', copyAllTitle: '설명이 포함된 전체 목록 복사', copiedBatch: '목록 복사 완료!', copyBatch: '목록 복사', exportTextTitle: '텍스트 파일로 다운로드', exportCsvTitle: 'CSV 스프레드시트로 다운로드', tip: '팁: ', tipEnd: ' 키를 누르면 새 목록을 바로 생성합니다.', leaderboard: '독립 순위표', bestNames: '최고 평점 이름', leaderboardDesc: '이 카테고리의 1~5점 별점 평가를 기준으로 합니다.', ratedCount: '개 평가된 제안', stars: '개 별', copied: '복사됨', copy: '복사', noRatings: '아직 평가가 없습니다:', noRatingsDesc: '위의 이름에 별점을 주어 개인 순위표를 만들어 보세요.', advantages: '주요 장점', limits: '유의 사항', explore: '다른 카테고리 둘러보기' },
    zh: { back: '返回所有生成器', proposals: '已生成的名称', inspired: '灵感来源：', copyAllTitle: '复制带描述的完整列表', copiedBatch: '已复制整批！', copyBatch: '复制整批', exportTextTitle: '下载为文本文件', exportCsvTitle: '下载为 CSV 表格', tip: '提示：按下', tipEnd: '即可立即生成新的一批。', leaderboard: '独立排行榜', bestNames: '评分最高的名称', leaderboardDesc: '严格按此类别的 1–5 星评分排序。', ratedCount: '条已评分建议', stars: '星', copied: '已复制', copy: '复制', noRatings: '暂无评分：', noRatingsDesc: '为上方名称评分，建立此生成器的个人排行榜。', advantages: '主要优势', limits: '注意事项', explore: '探索其他类别' },
    ru: { back: 'Ко всем генераторам', proposals: 'сгенерированных имён', inspired: 'Вдохновлено:', copyAllTitle: 'Копировать список с описаниями', copiedBatch: 'Пакет скопирован!', copyBatch: 'Копировать пакет', exportTextTitle: 'Скачать как текст', exportCsvTitle: 'Скачать таблицу CSV', tip: 'Совет: нажмите', tipEnd: ', чтобы создать новую подборку.', leaderboard: 'НЕЗАВИСИМЫЙ РЕЙТИНГ', bestNames: 'Лучшие имена по оценкам', leaderboardDesc: 'Сортировка по вашим оценкам от 1 до 5 звёзд.', ratedCount: 'оценённых предложений', stars: 'звёзд', copied: 'Скопировано', copy: 'Копировать', noRatings: 'Пока нет оценок для', noRatingsDesc: 'Оцените имена выше, чтобы создать личный рейтинг.', advantages: 'Преимущества', limits: 'Что учесть', explore: 'Другие категории' },
    hi: { back: 'सभी जनरेटर पर वापस जाएँ', proposals: 'बनाए गए नाम', inspired: 'प्रेरणा स्रोत:', copyAllTitle: 'विवरण सहित पूरी सूची कॉपी करें', copiedBatch: 'सूची कॉपी हुई!', copyBatch: 'सूची कॉपी करें', exportTextTitle: 'टेक्स्ट के रूप में डाउनलोड करें', exportCsvTitle: 'CSV शीट डाउनलोड करें', tip: 'सुझाव: दबाएँ', tipEnd: ' और तुरंत नए नाम बनाएँ।', leaderboard: 'स्वतंत्र रैंकिंग', bestNames: 'सबसे अधिक रेट किए गए नाम', leaderboardDesc: 'इस श्रेणी में आपकी 1–5 स्टार रेटिंग के आधार पर।', ratedCount: 'रेट किए गए सुझाव', stars: 'स्टार', copied: 'कॉपी हुआ', copy: 'कॉपी करें', noRatings: 'अभी रेटिंग नहीं है:', noRatingsDesc: 'अपनी व्यक्तिगत रैंकिंग बनाने के लिए ऊपर के नामों को रेट करें।', advantages: 'मुख्य लाभ', limits: 'ध्यान देने योग्य बातें', explore: 'अन्य श्रेणियाँ देखें' },
    nl: { back: 'Terug naar alle generators', proposals: 'gegenereerde namen', inspired: 'Geïnspireerd door:', copyAllTitle: 'Kopieer de volledige lijst met beschrijvingen', copiedBatch: 'Batch gekopieerd!', copyBatch: 'Batch kopiëren', exportTextTitle: 'Download als tekst', exportCsvTitle: 'Download als CSV-tabel', tip: 'Tip: druk op', tipEnd: ' om direct een nieuwe batch te maken.', leaderboard: 'ONAFHANKELIJKE RANGLIJST', bestNames: 'Best beoordeelde namen', leaderboardDesc: 'Gerangschikt op jouw beoordelingen van 1–5 sterren.', ratedCount: 'beoordeelde suggesties', stars: 'sterren', copied: 'Gekopieerd', copy: 'Kopiëren', noRatings: 'Nog geen beoordelingen voor', noRatingsDesc: 'Beoordeel de namen hierboven om je persoonlijke ranglijst op te bouwen.', advantages: 'Belangrijkste voordelen', limits: 'Aandachtspunten', explore: 'Andere categorieën bekijken' },
    pl: { back: 'Wróć do wszystkich generatorów', proposals: 'wygenerowanych nazw', inspired: 'Inspiracja:', copyAllTitle: 'Kopiuj całą listę z opisami', copiedBatch: 'Skopiowano zestaw!', copyBatch: 'Kopiuj zestaw', exportTextTitle: 'Pobierz jako tekst', exportCsvTitle: 'Pobierz arkusz CSV', tip: 'Wskazówka: naciśnij', tipEnd: ', aby natychmiast utworzyć nowy zestaw.', leaderboard: 'NIEZALEŻNY RANKING', bestNames: 'Najwyżej oceniane nazwy', leaderboardDesc: 'Ranking według ocen od 1 do 5 gwiazdek w tej kategorii.', ratedCount: 'ocenionych propozycji', stars: 'gwiazdek', copied: 'Skopiowano', copy: 'Kopiuj', noRatings: 'Brak ocen dla', noRatingsDesc: 'Oceń powyższe nazwy, aby utworzyć własny ranking.', advantages: 'Najważniejsze zalety', limits: 'Warto rozważyć', explore: 'Poznaj inne kategorie' },
    sv: { back: 'Till alla generatorer', proposals: 'genererade namn', inspired: 'Inspirerad av:', copyAllTitle: 'Kopiera hela listan med beskrivningar', copiedBatch: 'Listan kopierad!', copyBatch: 'Kopiera listan', exportTextTitle: 'Ladda ned som text', exportCsvTitle: 'Ladda ned CSV-kalkylblad', tip: 'Tips: tryck på', tipEnd: ' för att skapa en ny omgång direkt.', leaderboard: 'OBEROENDE TOPPLISTA', bestNames: 'Högst betygsatta namn', leaderboardDesc: 'Sorterat efter dina betyg på 1–5 stjärnor.', ratedCount: 'betygsatta förslag', stars: 'stjärnor', copied: 'Kopierat', copy: 'Kopiera', noRatings: 'Inga betyg ännu för', noRatingsDesc: 'Betygsätt namnen ovan för att skapa din personliga topplista.', advantages: 'Viktiga fördelar', limits: 'Att tänka på', explore: 'Utforska fler kategorier' },
    vi: { back: 'Quay lại tất cả trình tạo', proposals: 'tên đã tạo', inspired: 'Lấy cảm hứng từ:', copyAllTitle: 'Sao chép toàn bộ danh sách kèm mô tả', copiedBatch: 'Đã sao chép danh sách!', copyBatch: 'Sao chép danh sách', exportTextTitle: 'Tải xuống dạng văn bản', exportCsvTitle: 'Tải xuống bảng CSV', tip: 'Mẹo: nhấn', tipEnd: ' để tạo ngay một danh sách mới.', leaderboard: 'BẢNG XẾP HẠNG ĐỘC LẬP', bestNames: 'Tên được đánh giá cao nhất', leaderboardDesc: 'Xếp hạng theo đánh giá 1–5 sao của bạn.', ratedCount: 'gợi ý đã đánh giá', stars: 'sao', copied: 'Đã sao chép', copy: 'Sao chép', noRatings: 'Chưa có đánh giá cho', noRatingsDesc: 'Đánh giá tên phía trên để tạo bảng xếp hạng riêng.', advantages: 'Ưu điểm chính', limits: 'Điểm cần cân nhắc', explore: 'Khám phá danh mục khác' },
    id: { back: 'Kembali ke semua generator', proposals: 'nama dihasilkan', inspired: 'Terinspirasi oleh:', copyAllTitle: 'Salin seluruh daftar beserta deskripsi', copiedBatch: 'Daftar disalin!', copyBatch: 'Salin daftar', exportTextTitle: 'Unduh sebagai teks', exportCsvTitle: 'Unduh lembar CSV', tip: 'Tips: tekan', tipEnd: ' untuk membuat kumpulan baru seketika.', leaderboard: 'PERINGKAT INDEPENDEN', bestNames: 'Nama dengan nilai tertinggi', leaderboardDesc: 'Diurutkan berdasarkan penilaian 1–5 bintang Anda.', ratedCount: 'saran dinilai', stars: 'bintang', copied: 'Disalin', copy: 'Salin', noRatings: 'Belum ada penilaian untuk', noRatingsDesc: 'Nilai nama di atas untuk membuat peringkat pribadi.', advantages: 'Keunggulan utama', limits: 'Hal yang perlu dipertimbangkan', explore: 'Jelajahi kategori lain' },
    th: { back: 'กลับไปยังตัวสร้างทั้งหมด', proposals: 'ชื่อที่สร้างแล้ว', inspired: 'แรงบันดาลใจจาก:', copyAllTitle: 'คัดลอกรายการทั้งหมดพร้อมคำอธิบาย', copiedBatch: 'คัดลอกรายการแล้ว!', copyBatch: 'คัดลอกรายการ', exportTextTitle: 'ดาวน์โหลดเป็นข้อความ', exportCsvTitle: 'ดาวน์โหลดตาราง CSV', tip: 'เคล็ดลับ: กด', tipEnd: ' เพื่อสร้างชุดใหม่ทันที', leaderboard: 'อันดับอิสระ', bestNames: 'ชื่อที่ได้คะแนนสูงสุด', leaderboardDesc: 'จัดอันดับจากคะแนน 1–5 ดาวของคุณในหมวดนี้', ratedCount: 'ข้อเสนอที่ให้คะแนนแล้ว', stars: 'ดาว', copied: 'คัดลอกแล้ว', copy: 'คัดลอก', noRatings: 'ยังไม่มีคะแนนสำหรับ', noRatingsDesc: 'ให้คะแนนชื่อด้านบนเพื่อสร้างอันดับส่วนตัว', advantages: 'ข้อดีหลัก', limits: 'ข้อควรพิจารณา', explore: 'สำรวจหมวดหมู่อื่น' },
    el: { back: 'Επιστροφή σε όλους τους δημιουργούς', proposals: 'ονόματα που δημιουργήθηκαν', inspired: 'Έμπνευση από:', copyAllTitle: 'Αντιγραφή πλήρους λίστας με περιγραφές', copiedBatch: 'Η λίστα αντιγράφηκε!', copyBatch: 'Αντιγραφή λίστας', exportTextTitle: 'Λήψη ως κείμενο', exportCsvTitle: 'Λήψη φύλλου CSV', tip: 'Συμβουλή: πατήστε', tipEnd: ' για να δημιουργήσετε αμέσως νέα λίστα.', leaderboard: 'ΑΝΕΞΑΡΤΗΤΗ ΚΑΤΑΤΑΞΗ', bestNames: 'Ονόματα με τις υψηλότερες βαθμολογίες', leaderboardDesc: 'Ταξινόμηση βάσει των αξιολογήσεών σας 1–5 αστέρων.', ratedCount: 'αξιολογημένες προτάσεις', stars: 'αστέρια', copied: 'Αντιγράφηκε', copy: 'Αντιγραφή', noRatings: 'Δεν υπάρχουν ακόμη αξιολογήσεις για', noRatingsDesc: 'Βαθμολογήστε τα παραπάνω ονόματα για προσωπική κατάταξη.', advantages: 'Βασικά πλεονεκτήματα', limits: 'Σημεία προσοχής', explore: 'Εξερευνήστε άλλες κατηγορίες' },
    he: { back: 'חזרה לכל המחוללים', proposals: 'שמות שנוצרו', inspired: 'בהשראת:', copyAllTitle: 'העתקת הרשימה המלאה עם תיאורים', copiedBatch: 'הרשימה הועתקה!', copyBatch: 'העתקת הרשימה', exportTextTitle: 'הורדה כטקסט', exportCsvTitle: 'הורדת גיליון CSV', tip: 'טיפ: לחצו על', tipEnd: ' כדי ליצור אוסף חדש מיד.', leaderboard: 'דירוג עצמאי', bestNames: 'השמות בעלי הדירוג הגבוה ביותר', leaderboardDesc: 'ממוינים לפי הדירוג שלך מ־1 עד 5 כוכבים.', ratedCount: 'הצעות שדורגו', stars: 'כוכבים', copied: 'הועתק', copy: 'העתקה', noRatings: 'עדיין אין דירוגים עבור', noRatingsDesc: 'דרגו את השמות למעלה כדי ליצור דירוג אישי.', advantages: 'יתרונות מרכזיים', limits: 'נקודות שכדאי לשקול', explore: 'גילוי קטגוריות נוספות' },
    cs: { back: 'Zpět ke všem generátorům', proposals: 'vygenerovaných jmen', inspired: 'Inspirace:', copyAllTitle: 'Kopírovat celý seznam s popisy', copiedBatch: 'Sada zkopírována!', copyBatch: 'Kopírovat sadu', exportTextTitle: 'Stáhnout jako text', exportCsvTitle: 'Stáhnout tabulku CSV', tip: 'Tip: stiskněte', tipEnd: ' a okamžitě vytvoříte novou sadu.', leaderboard: 'NEZÁVISLÝ ŽEBŘÍČEK', bestNames: 'Nejlépe hodnocená jména', leaderboardDesc: 'Seřazeno podle vašich hodnocení 1–5 hvězdiček.', ratedCount: 'hodnocených návrhů', stars: 'hvězdiček', copied: 'Zkopírováno', copy: 'Kopírovat', noRatings: 'Zatím žádná hodnocení pro', noRatingsDesc: 'Ohodnoťte jména výše a vytvořte osobní žebříček.', advantages: 'Hlavní výhody', limits: 'Na co myslet', explore: 'Prozkoumat další kategorie' },
    ro: { back: 'Înapoi la toți generatorii', proposals: 'nume generate', inspired: 'Inspirat de:', copyAllTitle: 'Copiază lista completă cu descrieri', copiedBatch: 'Lista a fost copiată!', copyBatch: 'Copiază lista', exportTextTitle: 'Descarcă ca text', exportCsvTitle: 'Descarcă foaia CSV', tip: 'Sfat: apasă', tipEnd: ' pentru a crea imediat un lot nou.', leaderboard: 'CLASAMENT INDEPENDENT', bestNames: 'Nume cel mai bine evaluate', leaderboardDesc: 'Ordonate după evaluările tale de la 1 la 5 stele.', ratedCount: 'sugestii evaluate', stars: 'stele', copied: 'Copiat', copy: 'Copiază', noRatings: 'Încă nu există evaluări pentru', noRatingsDesc: 'Evaluează numele de mai sus pentru a crea clasamentul personal.', advantages: 'Avantaje principale', limits: 'Aspecte de luat în calcul', explore: 'Explorează alte categorii' },
    da: { back: 'Tilbage til alle generatorer', proposals: 'genererede navne', inspired: 'Inspireret af:', copyAllTitle: 'Kopiér hele listen med beskrivelser', copiedBatch: 'Listen er kopieret!', copyBatch: 'Kopiér liste', exportTextTitle: 'Download som tekst', exportCsvTitle: 'Download CSV-regneark', tip: 'Tip: tryk på', tipEnd: ' for straks at lave en ny omgang.', leaderboard: 'UAFHÆNGIG TOPLISTE', bestNames: 'Bedst bedømte navne', leaderboardDesc: 'Rangeret efter dine vurderinger fra 1 til 5 stjerner.', ratedCount: 'bedømte forslag', stars: 'stjerner', copied: 'Kopieret', copy: 'Kopiér', noRatings: 'Ingen vurderinger endnu for', noRatingsDesc: 'Bedøm navnene ovenfor for at opbygge din personlige topliste.', advantages: 'Vigtigste fordele', limits: 'Overvejelser', explore: 'Udforsk andre kategorier' },
    fi: { back: 'Takaisin kaikkiin generaattoreihin', proposals: 'luotua nimeä', inspired: 'Innoittajana:', copyAllTitle: 'Kopioi koko luettelo kuvauksineen', copiedBatch: 'Luettelo kopioitu!', copyBatch: 'Kopioi luettelo', exportTextTitle: 'Lataa tekstinä', exportCsvTitle: 'Lataa CSV-taulukkona', tip: 'Vinkki: paina', tipEnd: ' luodaksesi uuden erän heti.', leaderboard: 'RIIPPUMATON LISTAUS', bestNames: 'Parhaiten arvioidut nimet', leaderboardDesc: 'Järjestetty tämän luokan 1–5 tähden arvioidesi mukaan.', ratedCount: 'arvioitua ehdotusta', stars: 'tähteä', copied: 'Kopioitu', copy: 'Kopioi', noRatings: 'Ei vielä arvioita kohteelle', noRatingsDesc: 'Arvioi yllä olevat nimet rakentaaksesi oman listasi.', advantages: 'Keskeiset edut', limits: 'Huomioitavaa', explore: 'Tutustu muihin luokkiin' },
  };
  const text = ui[language] || ui.en;
  const exportLabels: Record<string, string[]> = {
    en: ['Date', 'Generator', 'Style', 'Archetype', 'Tone', 'Description', 'Ideal for', 'Name', 'Pronunciation', 'Name batch'],
    fr: ['Date', 'Générateur', 'Style', 'Archétype', 'Tonalité', 'Description', 'Idéal pour', 'Nom', 'Prononciation', 'Lot de noms'],
    ar: ['التاريخ', 'المولّد', 'النمط', 'النموذج', 'النبرة', 'الوصف', 'مناسب لـ', 'الاسم', 'النطق', 'مجموعة أسماء'],
    es: ['Fecha', 'Generador', 'Estilo', 'Arquetipo', 'Tono', 'Descripción', 'Ideal para', 'Nombre', 'Pronunciación', 'Lote de nombres'],
    de: ['Datum', 'Generator', 'Stil', 'Archetyp', 'Ton', 'Beschreibung', 'Ideal für', 'Name', 'Aussprache', 'Namensliste'],
    it: ['Data', 'Generatore', 'Stile', 'Archetipo', 'Tono', 'Descrizione', 'Ideale per', 'Nome', 'Pronuncia', 'Lotto di nomi'],
    pt: ['Data', 'Gerador', 'Estilo', 'Arquétipo', 'Tom', 'Descrição', 'Ideal para', 'Nome', 'Pronúncia', 'Lote de nomes'],
    tr: ['Tarih', 'Oluşturucu', 'Stil', 'Arketip', 'Ton', 'Açıklama', 'Şunun için ideal', 'Ad', 'Telaffuz', 'Ad listesi'],
    ja: ['日付', 'ジェネレーター', 'スタイル', 'アーキタイプ', 'トーン', '説明', 'おすすめ用途', '名前', '発音', '名前一覧'],
    ko: ['날짜', '생성기', '스타일', '원형', '어조', '설명', '추천 용도', '이름', '발음', '이름 목록'],
    zh: ['日期', '生成器', '风格', '原型', '语气', '描述', '适用场景', '名称', '发音', '名称批次'],
    ru: ['Дата', 'Генератор', 'Стиль', 'Архетип', 'Тон', 'Описание', 'Подходит для', 'Имя', 'Произношение', 'Набор имён'],
    hi: ['तारीख', 'जनरेटर', 'शैली', 'आदिरूप', 'स्वर', 'विवरण', 'के लिए उपयुक्त', 'नाम', 'उच्चारण', 'नामों का समूह'],
    nl: ['Datum', 'Generator', 'Stijl', 'Archetype', 'Toon', 'Beschrijving', 'Geschikt voor', 'Naam', 'Uitspraak', 'Batch namen'],
    pl: ['Data', 'Generator', 'Styl', 'Archetyp', 'Ton', 'Opis', 'Idealne dla', 'Nazwa', 'Wymowa', 'Zestaw nazw'],
    sv: ['Datum', 'Generator', 'Stil', 'Arketyp', 'Ton', 'Beskrivning', 'Passar för', 'Namn', 'Uttal', 'Namnomgång'],
    vi: ['Ngày', 'Trình tạo', 'Phong cách', 'Nguyên mẫu', 'Sắc thái', 'Mô tả', 'Phù hợp với', 'Tên', 'Phát âm', 'Danh sách tên'],
    id: ['Tanggal', 'Generator', 'Gaya', 'Arketipe', 'Nada', 'Deskripsi', 'Cocok untuk', 'Nama', 'Pelafalan', 'Kumpulan nama'],
    th: ['วันที่', 'ตัวสร้าง', 'สไตล์', 'ต้นแบบ', 'โทน', 'คำอธิบาย', 'เหมาะสำหรับ', 'ชื่อ', 'การออกเสียง', 'ชุดชื่อ'],
    el: ['Ημερομηνία', 'Δημιουργός', 'Στυλ', 'Αρχέτυπο', 'Τόνος', 'Περιγραφή', 'Ιδανικό για', 'Όνομα', 'Προφορά', 'Ομάδα ονομάτων'],
    he: ['תאריך', 'מחולל', 'סגנון', 'ארכיטיפ', 'גוון', 'תיאור', 'מתאים ל־', 'שם', 'הגייה', 'אוסף שמות'],
    cs: ['Datum', 'Generátor', 'Styl', 'Archetyp', 'Tón', 'Popis', 'Vhodné pro', 'Jméno', 'Výslovnost', 'Sada jmen'],
    ro: ['Data', 'Generator', 'Stil', 'Arhetip', 'Ton', 'Descriere', 'Potrivit pentru', 'Nume', 'Pronunție', 'Lot de nume'],
    da: ['Dato', 'Generator', 'Stil', 'Arketype', 'Tone', 'Beskrivelse', 'Velegnet til', 'Navn', 'Udtale', 'Navneliste'],
    fi: ['Päiväys', 'Generaattori', 'Tyyli', 'Arkkityyppi', 'Sävy', 'Kuvaus', 'Sopii kohteelle', 'Nimi', 'Ääntäminen', 'Nimierä'],
  };
  const exportText = exportLabels[language] || exportLabels.en;
  const exportFormatLabels: Record<string, { txt: string; csv: string }> = {
    en:{txt:'Export .TXT',csv:'Export .CSV'}, fr:{txt:'Exporter en .TXT',csv:'Exporter en .CSV'},
    es:{txt:'Exportar .TXT',csv:'Exportar .CSV'}, de:{txt:'.TXT exportieren',csv:'.CSV exportieren'},
    it:{txt:'Esporta .TXT',csv:'Esporta .CSV'}, pt:{txt:'Exportar .TXT',csv:'Exportar .CSV'},
    ar:{txt:'تصدير .TXT',csv:'تصدير .CSV'}, tr:{txt:'.TXT dışa aktar',csv:'.CSV dışa aktar'},
    ja:{txt:'.TXTを書き出す',csv:'.CSVを書き出す'}, ko:{txt:'.TXT 내보내기',csv:'.CSV 내보내기'},
    zh:{txt:'导出 .TXT',csv:'导出 .CSV'}, ru:{txt:'Экспорт .TXT',csv:'Экспорт .CSV'},
    hi:{txt:'.TXT निर्यात करें',csv:'.CSV निर्यात करें'}, nl:{txt:'.TXT exporteren',csv:'.CSV exporteren'},
    pl:{txt:'Eksportuj .TXT',csv:'Eksportuj .CSV'}, sv:{txt:'Exportera .TXT',csv:'Exportera .CSV'},
    vi:{txt:'Xuất .TXT',csv:'Xuất .CSV'}, id:{txt:'Ekspor .TXT',csv:'Ekspor .CSV'},
    th:{txt:'ส่งออก .TXT',csv:'ส่งออก .CSV'}, el:{txt:'Εξαγωγή .TXT',csv:'Εξαγωγή .CSV'},
    he:{txt:'ייצוא .TXT',csv:'ייצוא .CSV'}, cs:{txt:'Exportovat .TXT',csv:'Exportovat .CSV'},
    ro:{txt:'Exportă .TXT',csv:'Exportă .CSV'}, da:{txt:'Eksportér .TXT',csv:'Eksportér .CSV'},
    fi:{txt:'Vie .TXT',csv:'Vie .CSV'}
  };
  const exportFormat = exportFormatLabels[language] || exportFormatLabels.en;

  const [selectedStyle, setSelectedStyle] = useState('default');
  const [selectedLength, setSelectedLength] = useState<LengthOption>('medium');
  const [selectedFormat, setSelectedFormat] = useState<FormatOption>('title');
  const [selectedGender, setSelectedGender] = useState<GenderOption>('any');
  const [selectedGenLanguage, setSelectedGenLanguage] = useState<GenLanguageCode>(
    settings.defaultGenLanguage || 'auto'
  );
  const previousDefaultGenLanguage = useRef<GenLanguageCode>(settings.defaultGenLanguage || 'auto');

  // The interface language and the generated-name language are independent.
  // Only update the generator selector when its dedicated preference changes.
  useEffect(() => subscribeToSettings((next) => {
    const nextDefault = next.defaultGenLanguage || 'auto';
    if (nextDefault !== previousDefaultGenLanguage.current) {
      previousDefaultGenLanguage.current = nextDefault;
      setSelectedGenLanguage(nextDefault);
    }
  }), []);
  const [quantity, setQuantity] = useState(9);
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<GeneratedName[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const generationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [batchCopied, setBatchCopied] = useState(false);

  // Note Modal state
  const [noteModalData, setNoteModalData] = useState<{
    name: string;
    generatorId: GeneratorId | string;
    style: string;
  } | null>(null);

  // Category-specific top-rated names based on real star ratings
  const [categoryTopRated, setCategoryTopRated] = useState<SavedNameEntry[]>([]);
  const [copiedTopName, setCopiedTopName] = useState<string | null>(null);

  useEffect(() => () => {
    if (generationTimeout.current) clearTimeout(generationTimeout.current);
  }, []);

  const refreshCategoryTopRated = () => {
    setCategoryTopRated(getTopRatedNamesByCategory(generatorId, 6));
  };

  useEffect(() => {
    refreshCategoryTopRated();
    const unsub = subscribeToStorage(refreshCategoryTopRated);
    return () => unsub();
  }, [generatorId]);

  const handleCopyTop = async (text: string) => {
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
      setCopiedTopName(text);
      setTimeout(() => setCopiedTopName(null), 1400);
    } catch {
      // ignore
    }
  };

  const handleCopyBatch = async () => {
    if (!results.length) return;
    const text = results.map((r) => `${r.name} — ${getLocalizedStyleLabel(r.style, language, generatorId)} (${r.tone}) : ${r.description}`).join('\n');
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
      setBatchCopied(true);
      setTimeout(() => setBatchCopied(false), 1800);
    } catch {}
  };

  const handleExportBatchTXT = () => {
    if (!results.length) return;
    const content = [
      `========================================================`,
      `NameForge — ${exportText[9]} (${localizedTitle})`,
      `${exportText[0]}: ${new Date().toLocaleString(language)}`,
      `${exportText[1]}: ${generatorId} | ${exportText[2]}: ${getLocalizedStyleLabel(selectedStyle, language, generatorId)}`,
      `========================================================\n`,
      ...results.map((r, i) => `${i + 1}. ${r.name}\n   ${exportText[3]}: ${getLocalizedStyleLabel(r.style, language, generatorId)} | ${exportText[4]}: ${r.tone}\n   ${exportText[5]}: ${r.description}\n   ${exportText[6]}: ${r.bestFor}\n`),
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nameforge-${generatorId}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportBatchCSV = () => {
    if (!results.length) return;
    const header = [exportText[7], exportText[3], exportText[4], exportText[5], exportText[6], exportText[8]];
    const rows = results.map((r) => [
      `"${r.name.replace(/"/g, '""')}"`,
      `"${getLocalizedStyleLabel(r.style, language, generatorId).replace(/"/g, '""')}"`,
      `"${r.tone.replace(/"/g, '""')}"`,
      `"${r.description.replace(/"/g, '""')}"`,
      `"${r.bestFor.replace(/"/g, '""')}"`,
      `"${(r.pronunciation || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = '\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nameforge-${generatorId}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = () => {
    if (generationTimeout.current) clearTimeout(generationTimeout.current);
    setIsGenerating(true);
    // Debounce rapid control/keyword edits so typing does not trigger a full batch for every keystroke.
    generationTimeout.current = setTimeout(() => {
      // In Auto mode, generate names in the currently selected interface language
      // whenever a matching phonetic profile exists. Explicit user choices always win.
      const localizedGenerationLanguages: GenLanguageCode[] = [
        'fr', 'en', 'es', 'de', 'it', 'pt', 'ar', 'tr', 'ja', 'ko', 'zh', 'ru',
        'hi', 'nl', 'pl', 'sv', 'vi', 'id', 'th', 'el', 'he', 'cs', 'ro', 'da', 'fi',
      ];
      const effectiveGenLanguage: GenLanguageCode =
        selectedGenLanguage === 'auto' && localizedGenerationLanguages.includes(language as GenLanguageCode)
          ? (language as GenLanguageCode)
          : selectedGenLanguage;
      const generated = generateNames({
        generator: generatorId,
        style: selectedStyle,
        length: selectedLength,
        format: selectedFormat,
        gender: selectedGender,
        genLanguage: effectiveGenLanguage,
        quantity,
        keyword,
      });
      setResults(generated);
      setIsGenerating(false);
      generationTimeout.current = null;
    }, 280);
  };

  useEffect(() => {
    handleGenerate();
    // Cancel pending work when controls change or this generator page unmounts.
    // This prevents stale batches from updating a page the user has already left.
    return () => {
      if (generationTimeout.current) {
        clearTimeout(generationTimeout.current);
        generationTimeout.current = null;
      }
    };
  }, [
    generatorId,
    selectedStyle,
    selectedLength,
    selectedFormat,
    selectedGender,
    selectedGenLanguage,
    quantity,
    keyword,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    generatorId,
    selectedStyle,
    selectedLength,
    selectedFormat,
    selectedGender,
    selectedGenLanguage,
    quantity,
  ]);

  // Keep all supported right-to-left scripts aligned with the app's language registry.
  const isRtlLanguage = ['ar', 'he', 'fa', 'ur', 'ps'].includes(language);

  return (
    <div dir={isRtlLanguage ? 'rtl' : 'ltr'} lang={language} className="space-y-16 pb-20">
      {/* Note Modal */}
      {noteModalData && (
        <NoteModal
          name={noteModalData.name}
          generatorId={noteModalData.generatorId}
          style={noteModalData.style}
          onClose={() => setNoteModalData(null)}
          onSave={() => handleGenerate()}
        />
      )}

      {/* Back link + Hero */}
      <div className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-8 pt-8">
        <button
          onClick={() => onNavigate('generators')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-purple-300 transition mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{text.back}</span>
        </button>

        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-extrabold uppercase tracking-widest mb-4">
            <span>{meta.badge}</span>
          </div>

          <h1 className="nf-animated-heading text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4">
            <span className="bg-gradient-to-r from-white via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              {localizedTitle}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {getLocalizedGeneratorDescription(meta, language)}
          </p>

          {/* Legal disclaimer if applicable */}
          {meta.legalDisclaimer && (
            <div className="mt-4 p-3 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-[11px] text-amber-300 flex items-center justify-center gap-2 max-w-xl mx-auto">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{meta.legalDisclaimer}</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Generator Card */}
      <section id="generator" className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#141d2f]/95 to-[#0c111d]/95 border border-slate-700/80 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="nf-animated-heading text-xl sm:text-2xl font-black flex items-center gap-2">
                <span>{meta.icon}</span>
                <span>{localizedTitle}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {localizedDescription}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <GeneratorControl
              generatorId={generatorId}
              style={selectedStyle}
              onStyleChange={setSelectedStyle}
              length={selectedLength}
              onLengthChange={setSelectedLength}
              format={selectedFormat}
              onFormatChange={setSelectedFormat}
              gender={selectedGender}
              onGenderChange={setSelectedGender}
              genLanguage={selectedGenLanguage}
              onGenLanguageChange={setSelectedGenLanguage}
              quantity={quantity}
              onQuantityChange={setQuantity}
              keyword={keyword}
              onKeywordChange={setKeyword}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>

          {/* Batch Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 p-3 rounded-2xl bg-[#090f1e]/90 border border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>{results.length} {text.proposals}</span>
              {keyword && (
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px]">
                  {text.inspired} « {keyword} »
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleCopyBatch}
                className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700/80"
                title={text.copyAllTitle}
              >
                {batchCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">{text.copiedBatch}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>{text.copyBatch}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleExportBatchTXT}
                className="py-1.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition flex items-center gap-1 cursor-pointer border border-slate-700/60"
                title={text.exportTextTitle}
              >
                <Download className="w-3 h-3 text-cyan-400" />
                <span>{exportFormat.txt}</span>
              </button>

              <button
                onClick={handleExportBatchCSV}
                className="py-1.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition flex items-center gap-1 cursor-pointer border border-slate-700/60"
                title={text.exportCsvTitle}
              >
                <Download className="w-3 h-3 text-purple-400" />
                <span>{exportFormat.csv}</span>
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((item) => (
              <NameCard
                key={item.name}
                item={item}
                onOpenNote={(name, genId, st) =>
                  setNoteModalData({ name, generatorId: genId, style: st })
                }
                onDataChange={refreshCategoryTopRated}
              />
            ))}
          </div>

          <div className="text-center mt-8 text-xs text-slate-500">
            {text.tip} <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">G</kbd> {text.tipEnd}
          </div>
        </div>
      </section>

      {/* Category-Specific Top Rated Leaderboard */}
      <section className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#12182c] via-[#0e1424] to-[#090d18] border border-amber-500/20 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{text.leaderboard} • {localizedShortTitle.toUpperCase()}</span>
              </div>
              <h2 className="nf-animated-heading text-xl sm:text-2xl font-black tracking-tight">
                {text.bestNames} ({localizedShortTitle})
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {text.leaderboardDesc}
              </p>
            </div>
            <div className="text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <span>{categoryTopRated.length} {text.ratedCount}</span>
            </div>
          </div>

          {categoryTopRated.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTopRated.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#0a0f1d] border border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{item.rating || 5}/5 {text.stars}</span>
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {getLocalizedStyleLabel(item.style, language, generatorId)}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-white tracking-tight">{item.name}</h3>
                    {item.note && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 italic">
                        « {item.note} »
                      </p>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString(language)}
                    </span>
                    <button
                      onClick={() => handleCopyTop(item.name)}
                      className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedTopName === item.name ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{text.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{text.copy}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 px-4 text-center max-w-md mx-auto space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">{text.noRatings} {localizedShortTitle}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {text.noRatingsDesc}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Guidance Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl bg-[#0c1222] border border-slate-800 shadow-xl space-y-6">
          <h2 className="nf-animated-heading text-xl sm:text-2xl font-black">
            {meta.guideTitle}
          </h2>
          <div className="space-y-4">
            {meta.guide.map((step, idx) => (
              <div key={idx} className="space-y-1">
                <h3 className="text-sm font-bold text-cyan-300">{step.h}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{step.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Cards Section */}
      <section className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-8">
        <h2 className="nf-animated-heading text-xl sm:text-2xl font-black text-center mb-8">
          {meta.cardsTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {meta.cards.map((card, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-purple-500/50 transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl mb-3 block">{card.icon}</span>
                <h3 className="text-base font-bold text-white mb-2">{card.h}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{card.p}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advantages vs Limits */}
      {(meta.advantages || meta.limits) && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {meta.advantages && (
              <div className="p-5 rounded-2xl bg-[#0e1628] border border-emerald-500/30">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{text.advantages}</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {meta.advantages.map((adv, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">•</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {meta.limits && (
              <div className="p-5 rounded-2xl bg-[#0e1628] border border-amber-500/30">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>{text.limits}</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {meta.limits.map((lim, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400">•</span>
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ specific to category */}
      {meta.faq && meta.faq.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="nf-animated-heading text-xl sm:text-2xl font-black text-center mb-6">
            {meta.faqTitle}
          </h2>
          <div className="space-y-3">
            {meta.faq.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
                <h3 className="text-sm font-bold text-white mb-1.5">{item.q}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other generators slider/switcher */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 border-t border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">
          {text.explore}
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {ALL_GENERATORS_LIST.filter((g) => g.id !== generatorId).slice(0, 10).map((g) => (
            <button
              key={g.id}
              onClick={() => onNavigate('generator-detail', g.id)}
              className="py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5"
            >
              <span>{g.icon}</span>
              <span>{getLocalizedGeneratorShortTitle(g.id, language, g.shortTitle)}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
