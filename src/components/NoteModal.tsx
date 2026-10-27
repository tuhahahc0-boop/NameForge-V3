import React, { useState } from 'react';
import { X, FileText, Check } from 'lucide-react';
import { findSavedEntry, updateEntryNote } from '../services/storage';
import { GeneratorId } from '../types';
import { getAppSettings } from '../services/settings';

interface NoteModalProps {
  name: string;
  generatorId: GeneratorId | string;
  style: string;
  onClose: () => void;
  onSave?: () => void;
}

const NOTE_MODAL_COPY: Record<string, { title: string; description: string; placeholder: string; cancel: string; save: string; saved: string }> = {
  en: { title: 'Private note', description: 'Add background, ideas, or notes for', placeholder: 'Add your notes here…', cancel: 'Cancel', save: 'Save note', saved: 'Saved!' },
  fr: { title: 'Note privée', description: 'Ajoutez un contexte, des idées ou des notes pour', placeholder: 'Écrivez votre note ici…', cancel: 'Annuler', save: 'Enregistrer la note', saved: 'Enregistré !' },
  es: { title: 'Nota privada', description: 'Añade contexto, ideas o notas para', placeholder: 'Escribe tus notas aquí…', cancel: 'Cancelar', save: 'Guardar nota', saved: '¡Guardado!' },
  de: { title: 'Private Notiz', description: 'Ergänze Hintergrundinformationen, Ideen oder Notizen zu', placeholder: 'Notizen hier eingeben…', cancel: 'Abbrechen', save: 'Notiz speichern', saved: 'Gespeichert!' },
  it: { title: 'Nota privata', description: 'Aggiungi contesto, idee o note per', placeholder: 'Scrivi qui le tue note…', cancel: 'Annulla', save: 'Salva nota', saved: 'Salvato!' },
  pt: { title: 'Nota privada', description: 'Adicione contexto, ideias ou notas para', placeholder: 'Escreva suas notas aqui…', cancel: 'Cancelar', save: 'Salvar nota', saved: 'Salvo!' },
  ar: { title: 'ملاحظة خاصة', description: 'أضف معلومات تمهيدية أو أفكارًا أو ملاحظات حول', placeholder: 'اكتب ملاحظاتك هنا…', cancel: 'إلغاء', save: 'حفظ الملاحظة', saved: 'تم الحفظ!' },
  tr: { title: 'Özel not', description: 'Şunun için arka plan, fikir veya not ekleyin:', placeholder: 'Notlarınızı buraya yazın…', cancel: 'İptal', save: 'Notu kaydet', saved: 'Kaydedildi!' },
  ja: { title: 'プライベートメモ', description: '背景情報やアイデア、メモを追加：', placeholder: 'ここにメモを入力…', cancel: 'キャンセル', save: 'メモを保存', saved: '保存しました！' },
  ko: { title: '비공개 메모', description: '배경 정보, 아이디어 또는 메모를 추가하세요:', placeholder: '여기에 메모를 입력하세요…', cancel: '취소', save: '메모 저장', saved: '저장됨!' },
  zh: { title: '私人备注', description: '添加背景信息、想法或备注：', placeholder: '在此输入备注…', cancel: '取消', save: '保存备注', saved: '已保存！' },
  ru: { title: 'Личная заметка', description: 'Добавьте предысторию, идеи или заметки для', placeholder: 'Введите заметку…', cancel: 'Отмена', save: 'Сохранить заметку', saved: 'Сохранено!' },
  hi: { title: 'निजी नोट', description: 'इसके बारे में संदर्भ, विचार या नोट जोड़ें:', placeholder: 'अपने नोट यहाँ लिखें…', cancel: 'रद्द करें', save: 'नोट सहेजें', saved: 'सहेजा गया!' },
  nl: { title: 'Privénotitie', description: 'Voeg achtergrond, ideeën of notities toe voor', placeholder: 'Schrijf hier je notities…', cancel: 'Annuleren', save: 'Notitie opslaan', saved: 'Opgeslagen!' },
  pl: { title: 'Notatka prywatna', description: 'Dodaj tło, pomysły lub notatki dla', placeholder: 'Wpisz tutaj notatkę…', cancel: 'Anuluj', save: 'Zapisz notatkę', saved: 'Zapisano!' },
  sv: { title: 'Privat anteckning', description: 'Lägg till bakgrund, idéer eller anteckningar för', placeholder: 'Skriv dina anteckningar här…', cancel: 'Avbryt', save: 'Spara anteckning', saved: 'Sparat!' },
  vi: { title: 'Ghi chú riêng', description: 'Thêm bối cảnh, ý tưởng hoặc ghi chú cho', placeholder: 'Nhập ghi chú tại đây…', cancel: 'Hủy', save: 'Lưu ghi chú', saved: 'Đã lưu!' },
  id: { title: 'Catatan pribadi', description: 'Tambahkan latar belakang, ide, atau catatan untuk', placeholder: 'Tulis catatan di sini…', cancel: 'Batal', save: 'Simpan catatan', saved: 'Tersimpan!' },
  th: { title: 'บันทึกส่วนตัว', description: 'เพิ่มข้อมูลเบื้องหลัง แนวคิด หรือบันทึกสำหรับ', placeholder: 'เขียนบันทึกที่นี่…', cancel: 'ยกเลิก', save: 'บันทึก', saved: 'บันทึกแล้ว!' },
  el: { title: 'Ιδιωτική σημείωση', description: 'Προσθέστε ιστορικό, ιδέες ή σημειώσεις για', placeholder: 'Γράψτε τις σημειώσεις σας εδώ…', cancel: 'Ακύρωση', save: 'Αποθήκευση σημείωσης', saved: 'Αποθηκεύτηκε!' },
  he: { title: 'הערה פרטית', description: 'הוסיפו רקע, רעיונות או הערות עבור', placeholder: 'כתבו כאן את ההערות…', cancel: 'ביטול', save: 'שמירת הערה', saved: 'נשמר!' },
  cs: { title: 'Soukromá poznámka', description: 'Přidejte pozadí, nápady nebo poznámky k', placeholder: 'Napište poznámku…', cancel: 'Zrušit', save: 'Uložit poznámku', saved: 'Uloženo!' },
  ro: { title: 'Notă privată', description: 'Adaugă context, idei sau note pentru', placeholder: 'Scrie notițele aici…', cancel: 'Anulează', save: 'Salvează nota', saved: 'Salvat!' },
  da: { title: 'Privat note', description: 'Tilføj baggrund, idéer eller noter til', placeholder: 'Skriv dine noter her…', cancel: 'Annuller', save: 'Gem note', saved: 'Gemt!' },
  fi: { title: 'Yksityinen muistiinpano', description: 'Lisää taustatietoja, ideoita tai muistiinpanoja kohteelle', placeholder: 'Kirjoita muistiinpanosi tähän…', cancel: 'Peruuta', save: 'Tallenna muistiinpano', saved: 'Tallennettu!' },
};

export const NoteModal: React.FC<NoteModalProps> = ({
  name,
  generatorId,
  style,
  onClose,
  onSave,
}) => {
  const language = getAppSettings().language;
  const t = NOTE_MODAL_COPY[language] || NOTE_MODAL_COPY.en;
  const existing = findSavedEntry(name, generatorId);
  const [noteText, setNoteText] = useState(existing?.note || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEntryNote(name, noteText, generatorId, style);
    setSavedSuccess(true);
    if (onSave) onSave();
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-2xl p-6 shadow-2xl relative text-start"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 end-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white">{t.title}</h3>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          {t.description}{' '}
          <span className="font-bold text-purple-300">"{name}"</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={4}
            placeholder={t.placeholder}
            className="w-full p-3 bg-[#090d18] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
            autoFocus
          />

          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/25 transition cursor-pointer flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{t.saved}</span>
                </>
              ) : (
                <span>{t.save}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
