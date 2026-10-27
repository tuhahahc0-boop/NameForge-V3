import { LanguageCode } from '../types';

export interface MyNamesAuditLabels {
  trackedNames: string;
  resetFilters: string;
  notRated: string;
  rateStars: string;
  importSuccess: string;
  importError: string;
  restore: string;
  compare: string;
  all: string;
  saved: string;
  favorites: string;
  withNotes: string;
}

const LABELS: Partial<Record<LanguageCode, MyNamesAuditLabels>> & {
  en: MyNamesAuditLabels;
  fr: MyNamesAuditLabels;
} = {
  en: { trackedNames: 'Tracked names', resetFilters: 'Reset filters', notRated: 'Not rated', rateStars: 'Rate {count} stars', importSuccess: 'Import successful: {added} added, {updated} updated, {skipped} skipped.', importError: 'Error' , restore: "Restore", compare: "Compare", all: "All", saved: "🔖 Saved", favorites: "❤️ Favorites", withNotes: "📝 With notes"},
  fr: { trackedNames: 'Noms suivis', resetFilters: 'Réinitialiser les filtres', notRated: 'Non noté', rateStars: 'Noter {count} étoiles', importSuccess: 'Importation réussie : {added} ajoutés, {updated} mis à jour, {skipped} ignorés.', importError: 'Erreur' , restore: "Restaurer", compare: "Comparer", all: "Tous", saved: "🔖 Enregistrés", favorites: "❤️ Favoris", withNotes: "📝 Avec notes"},
  es: { trackedNames: 'Nombres seguidos', resetFilters: 'Restablecer filtros', notRated: 'Sin valorar', rateStars: 'Valorar con {count} estrellas', importSuccess: 'Importación correcta: {added} añadidos, {updated} actualizados, {skipped} omitidos.', importError: 'Error' , restore: "Restaurar", compare: "Comparar", all: "Todos", saved: "🔖 Guardados", favorites: "❤️ Favoritos", withNotes: "📝 Con notas"},
  de: { trackedNames: 'Verfolgte Namen', resetFilters: 'Filter zurücksetzen', notRated: 'Nicht bewertet', rateStars: 'Mit {count} Sternen bewerten', importSuccess: 'Import erfolgreich: {added} hinzugefügt, {updated} aktualisiert, {skipped} übersprungen.', importError: 'Fehler' , restore: "Wiederherstellen", compare: "Vergleichen", all: "Alle", saved: "🔖 Gespeichert", favorites: "❤️ Favoriten", withNotes: "📝 Mit Notizen"},
  it: { trackedNames: 'Nomi monitorati', resetFilters: 'Reimposta filtri', notRated: 'Non valutato', rateStars: 'Valuta con {count} stelle', importSuccess: 'Importazione riuscita: {added} aggiunti, {updated} aggiornati, {skipped} ignorati.', importError: 'Errore' , restore: "Ripristina", compare: "Confronta", all: "Tutti", saved: "🔖 Salvati", favorites: "❤️ Preferiti", withNotes: "📝 Con note"},
  pt: { trackedNames: 'Nomes acompanhados', resetFilters: 'Redefinir filtros', notRated: 'Sem avaliação', rateStars: 'Avaliar com {count} estrelas', importSuccess: 'Importação concluída: {added} adicionados, {updated} atualizados, {skipped} ignorados.', importError: 'Erro' , restore: "Restaurar", compare: "Comparar", all: "Todos", saved: "🔖 Guardados", favorites: "❤️ Favoritos", withNotes: "📝 Com notas"},
  ar: { trackedNames: 'الأسماء المتابعة', resetFilters: 'إعادة ضبط عوامل التصفية', notRated: 'غير مُقيّم', rateStars: 'قيّم بـ {count} نجوم', importSuccess: 'تم الاستيراد بنجاح: أُضيف {added}، وحُدّث {updated}، وتُخطّي {skipped}.', importError: 'خطأ' , restore: "استعادة", compare: "مقارنة", all: "الكل", saved: "🔖 المحفوظة", favorites: "❤️ المفضلة", withNotes: "📝 مع ملاحظات"},
  tr: { trackedNames: 'Takip edilen adlar', resetFilters: 'Filtreleri sıfırla', notRated: 'Puanlanmadı', rateStars: '{count} yıldızla puanla', importSuccess: 'İçe aktarma başarılı: {added} eklendi, {updated} güncellendi, {skipped} atlandı.', importError: 'Hata' , restore: "Geri yükle", compare: "Karşılaştır", all: "Tümü", saved: "🔖 Kaydedilenler", favorites: "❤️ Favoriler", withNotes: "📝 Notlu"},
  ja: { trackedNames: '追跡中の名前', resetFilters: 'フィルターをリセット', notRated: '未評価', rateStars: '{count}つ星で評価', importSuccess: 'インポート成功：{added}件追加、{updated}件更新、{skipped}件スキップ。', importError: 'エラー' , restore: "復元", compare: "比較", all: "すべて", saved: "🔖 保存済み", favorites: "❤️ お気に入り", withNotes: "📝 メモあり"},
  ko: { trackedNames: '추적 중인 이름', resetFilters: '필터 초기화', notRated: '평가되지 않음', rateStars: '{count}개 별점 주기', importSuccess: '가져오기 성공: {added}개 추가, {updated}개 업데이트, {skipped}개 건너뜀.', importError: '오류' , restore: "복원", compare: "비교", all: "전체", saved: "🔖 저장됨", favorites: "❤️ 즐겨찾기", withNotes: "📝 메모 있음"},
  zh: { trackedNames: '已跟踪名称', resetFilters: '重置筛选条件', notRated: '未评分', rateStars: '评为 {count} 星', importSuccess: '导入成功：新增 {added} 项，更新 {updated} 项，跳过 {skipped} 项。', importError: '错误' , restore: "恢复", compare: "比较", all: "全部", saved: "🔖 已保存", favorites: "❤️ 收藏", withNotes: "📝 有备注"},
  ru: { trackedNames: 'Отслеживаемые имена', resetFilters: 'Сбросить фильтры', notRated: 'Без оценки', rateStars: 'Оценить в {count} звёзд', importSuccess: 'Импорт выполнен: добавлено {added}, обновлено {updated}, пропущено {skipped}.', importError: 'Ошибка' , restore: "Восстановить", compare: "Сравнить", all: "Все", saved: "🔖 Сохранённые", favorites: "❤️ Избранное", withNotes: "📝 С заметками"},
  hi: { trackedNames: 'ट्रैक किए गए नाम', resetFilters: 'फ़िल्टर रीसेट करें', notRated: 'रेटिंग नहीं दी गई', rateStars: '{count} स्टार की रेटिंग दें', importSuccess: 'आयात सफल: {added} जोड़े गए, {updated} अपडेट हुए, {skipped} छोड़े गए।', importError: 'त्रुटि' , restore: "पुनर्स्थापित करें", compare: "तुलना करें", all: "सभी", saved: "🔖 सहेजे गए", favorites: "❤️ पसंदीदा", withNotes: "📝 नोट्स वाले"},
  nl: { trackedNames: 'Gevolgde namen', resetFilters: 'Filters resetten', notRated: 'Niet beoordeeld', rateStars: 'Beoordeel met {count} sterren', importSuccess: 'Import geslaagd: {added} toegevoegd, {updated} bijgewerkt, {skipped} overgeslagen.', importError: 'Fout' , restore: "Herstellen", compare: "Vergelijken", all: "Alles", saved: "🔖 Opgeslagen", favorites: "❤️ Favorieten", withNotes: "📝 Met notities"},
  pl: { trackedNames: 'Śledzone nazwy', resetFilters: 'Resetuj filtry', notRated: 'Brak oceny', rateStars: 'Oceń na {count} gwiazdek', importSuccess: 'Import zakończony: dodano {added}, zaktualizowano {updated}, pominięto {skipped}.', importError: 'Błąd' , restore: "Przywróć", compare: "Porównaj", all: "Wszystkie", saved: "🔖 Zapisane", favorites: "❤️ Ulubione", withNotes: "📝 Z notatkami"},
  sv: { trackedNames: 'Följda namn', resetFilters: 'Återställ filter', notRated: 'Inte betygsatt', rateStars: 'Betygsätt med {count} stjärnor', importSuccess: 'Importen lyckades: {added} tillagda, {updated} uppdaterade, {skipped} överhoppade.', importError: 'Fel' , restore: "Återställ", compare: "Jämför", all: "Alla", saved: "🔖 Sparade", favorites: "❤️ Favoriter", withNotes: "📝 Med anteckningar"},
  vi: { trackedNames: 'Tên đang theo dõi', resetFilters: 'Đặt lại bộ lọc', notRated: 'Chưa đánh giá', rateStars: 'Đánh giá {count} sao', importSuccess: 'Nhập thành công: thêm {added}, cập nhật {updated}, bỏ qua {skipped}.', importError: 'Lỗi' , restore: "Khôi phục", compare: "So sánh", all: "Tất cả", saved: "🔖 Đã lưu", favorites: "❤️ Yêu thích", withNotes: "📝 Có ghi chú"},
  id: { trackedNames: 'Nama yang dilacak', resetFilters: 'Atur ulang filter', notRated: 'Belum dinilai', rateStars: 'Beri nilai {count} bintang', importSuccess: 'Impor berhasil: {added} ditambahkan, {updated} diperbarui, {skipped} dilewati.', importError: 'Kesalahan' , restore: "Pulihkan", compare: "Bandingkan", all: "Semua", saved: "🔖 Tersimpan", favorites: "❤️ Favorit", withNotes: "📝 Dengan catatan"},
  th: { trackedNames: 'ชื่อที่ติดตาม', resetFilters: 'รีเซ็ตตัวกรอง', notRated: 'ยังไม่ได้ให้คะแนน', rateStars: 'ให้คะแนน {count} ดาว', importSuccess: 'นำเข้าสำเร็จ: เพิ่ม {added} รายการ อัปเดต {updated} รายการ ข้าม {skipped} รายการ', importError: 'ข้อผิดพลาด' , restore: "กู้คืน", compare: "เปรียบเทียบ", all: "ทั้งหมด", saved: "🔖 บันทึกแล้ว", favorites: "❤️ รายการโปรด", withNotes: "📝 มีบันทึก"},
  el: { trackedNames: 'Παρακολουθούμενα ονόματα', resetFilters: 'Επαναφορά φίλτρων', notRated: 'Χωρίς αξιολόγηση', rateStars: 'Βαθμολόγηση με {count} αστέρια', importSuccess: 'Επιτυχής εισαγωγή: προστέθηκαν {added}, ενημερώθηκαν {updated}, παραλείφθηκαν {skipped}.', importError: 'Σφάλμα' , restore: "Επαναφορά", compare: "Σύγκριση", all: "Όλα", saved: "🔖 Αποθηκευμένα", favorites: "❤️ Αγαπημένα", withNotes: "📝 Με σημειώσεις"},
  he: { trackedNames: 'שמות במעקב', resetFilters: 'איפוס מסננים', notRated: 'לא דורג', rateStars: 'דירוג של {count} כוכבים', importSuccess: 'הייבוא הצליח: נוספו {added}, עודכנו {updated}, דולגו {skipped}.', importError: 'שגיאה' , restore: "שחזור", compare: "השוואה", all: "הכול", saved: "🔖 שמורים", favorites: "❤️ מועדפים", withNotes: "📝 עם הערות"},
  cs: { trackedNames: 'Sledovaná jména', resetFilters: 'Obnovit filtry', notRated: 'Bez hodnocení', rateStars: 'Ohodnotit {count} hvězdami', importSuccess: 'Import úspěšný: přidáno {added}, aktualizováno {updated}, přeskočeno {skipped}.', importError: 'Chyba' , restore: "Obnovit", compare: "Porovnat", all: "Vše", saved: "🔖 Uložené", favorites: "❤️ Oblíbené", withNotes: "📝 S poznámkami"},
  ro: { trackedNames: 'Nume urmărite', resetFilters: 'Resetează filtrele', notRated: 'Neevaluat', rateStars: 'Evaluează cu {count} stele', importSuccess: 'Import reușit: {added} adăugate, {updated} actualizate, {skipped} omise.', importError: 'Eroare' , restore: "Restaurare", compare: "Compară", all: "Toate", saved: "🔖 Salvate", favorites: "❤️ Favorite", withNotes: "📝 Cu note"},
  da: { trackedNames: 'Navne, der følges', resetFilters: 'Nulstil filtre', notRated: 'Ikke bedømt', rateStars: 'Bedøm med {count} stjerner', importSuccess: 'Import gennemført: {added} tilføjet, {updated} opdateret, {skipped} sprunget over.', importError: 'Fejl' , restore: "Gendan", compare: "Sammenlign", all: "Alle", saved: "🔖 Gemte", favorites: "❤️ Favoritter", withNotes: "📝 Med noter"},
  fi: { trackedNames: 'Seuratut nimet', resetFilters: 'Nollaa suodattimet', notRated: 'Ei arvioitu', rateStars: 'Arvioi {count} tähdellä', importSuccess: 'Tuonti onnistui: lisätty {added}, päivitetty {updated}, ohitettu {skipped}.', importError: 'Virhe' , restore: "Palauta", compare: "Vertaa", all: "Kaikki", saved: "🔖 Tallennetut", favorites: "❤️ Suosikit", withNotes: "📝 Muistiinpanoilla"},
};

export function getMyNamesAuditLabels(language: LanguageCode): MyNamesAuditLabels {
  return LABELS[language] || LABELS.en;
}
