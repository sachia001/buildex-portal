// On-demand PDF download — აგენერებს PDF-ს მხოლოდ დაჭერისას (არა eager-ად რენდერზე).
// ცვლის PDFDownloadLink-ს, რომელიც ყველა ბარათზე ერთდროულად აგენერებდა PDF-ს და აფერხებდა გვერდს.
import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';

export default function PdfDownloadButton({ document: doc, fileName, className = '', style, label = '📄 PDF ჩამოტვ.' }) {
  const [busy, setBusy] = useState(false);
  const go = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = (fileName || 'document').replace(/\.pdf$/i, '') + '.pdf';
      window.document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (e) { console.error('PDF generation error:', e); }
    setBusy(false);
  };
  return (
    <button type="button" className={className} style={style} disabled={busy} onClick={go}>
      {busy ? '⏳' : label}
    </button>
  );
}
