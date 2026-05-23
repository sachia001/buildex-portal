import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

// ─────────────────────────────────────────────────────────────────────────────
// CHECKLIST DATA — ISO/IEC 17020:2012 — სრული ტექსტი
// ─────────────────────────────────────────────────────────────────────────────
const SECS = [
  {
    id: 'qm', title: '1. ხარისხის სახელმძღვანელო (QM-01)', period: 'quarterly', doc: 'QM-01',
    items: [
      { n: 'QM-01 — სისრულე, ვერსია და გადახედვის თარიღი შემოწმებულია',           c: '§4–8' },
      { n: 'QM-01 — ხელმოწერა (დირექტორი) და მოქმედი სტატუსი დადასტურებულია',     c: '§4.1.3' },
      { n: 'მიუკერძოებლობის პოლიტიკა (POL-01) — ჩართული და სრულია',              c: '§4.1' },
      { n: 'კონფიდენციალობის პოლიტიკა (POL-02) — ჩართული და სრულია',             c: '§4.2' },
      { n: 'ხარისხის პოლიტიკა (POL-03) — ჩართული და ხელმოწერილია',               c: '§5.1' },
      { n: 'ორგანიზაციული სქემა — განახლებულია და ასახავს მიმდინარე სტრუქტურას', c: '§4.1.4' },
      { n: 'პერსონალის როლები და უფლება-მოვალეობები განსაზღვრულია (HR-JD)',        c: '§4.1.5' },
      { n: 'ხელმძღვანელობის დელეგირების ბრძანება (QM-01/ORD) ვალიდურია',         c: '§4.1.5' },
      { n: 'QM-01 პერიოდული მიმოხილვა ჩატარებულია (მინ. წელიწადში ერთხელ)',       c: '§8.9' },
    ],
  },
  {
    id: 'pol', title: '2. პოლიტიკები (POL-01 – POL-04)', period: 'annual', doc: 'F_პოლიტიკები',
    items: [
      { n: 'POL-01: მიუკერძოებლობის პოლიტიკა — ხელმოწერილია და გამოქვეყნებულია', c: '§4.1' },
      { n: 'POL-02: კონფიდენციალობის პოლიტიკა — ხელმოწერილია',                   c: '§4.2' },
      { n: 'POL-03: ხარისხის პოლიტიკა — ხელმოწერილია და ეცნობა პერსონალს',       c: '§5.1' },
      { n: 'POL-04: IT და მონაცემთა უსაფრთხოების პოლიტიკა — ხელმოწერილია',       c: '§8.4' },
      { n: 'ყველა პერსონალი გაცნობია პოლიტიკებს (FM-22 გაცნობის ფურცელი)',       c: '§6.1' },
    ],
  },
  {
    id: 'pr_core', title: '3. პროცედურები — ინსპექტირების ძირითადი ციკლი (BE-PR-01–06)', period: 'quarterly', doc: 'B_პროცედურები',
    items: [
      { n: 'BE-PR-01: განაცხადების მიღება და კლიენტებთან ხელშეკრულება — სრულია',   c: '§7.1' },
      { n: 'BE-PR-02: სახელშეკრულებო მოთხოვნათა შეთანხმება — სრულია',             c: '§7.2' },
      { n: 'BE-PR-03: ინსპექტირების დაგეგმვა — სრულია',                            c: '§7.3' },
      { n: 'BE-PR-04: ინსპექტირების ჩატარება — სრულია',                            c: '§7.4' },
      { n: 'BE-PR-05: შედეგების გაფორმება — ყველა ველი სრულყოფილია',              c: '§7.5' },
      { n: 'BE-PR-06: ინსპექციის ანგარიშის გაცემა — სტანდარტი სრულია',            c: '§7.6' },
      { n: 'BE-PR-MAIN: ინსპექტირების სრული პროცესის დოკუმენტი — სრულია',         c: '§7.1–7.6' },
    ],
  },
  {
    id: 'pr_qms', title: '4. პროცედურები — ხარისხის მართვა (BE-PR-07–15)', period: 'quarterly', doc: 'B_პროცედურები',
    items: [
      { n: 'BE-PR-07: საჩივრებისა და აპელაციების განხილვა — სრულია',              c: '§7.7' },
      { n: 'BE-PR-08: შეუსაბამო სამუშაოს მართვა — სრულია',                        c: '§8.7' },
      { n: 'BE-PR-09: კორექტირებითი ქმედებები (CAPA) — ფუძემდებლური ანალიზი ჩართული', c: '§8.8' },
      { n: 'BE-PR-10: შიდა აუდიტი — გეგმა და კომპეტენტური შემმოწმებელი განსაზღვრული', c: '§8.6' },
      { n: 'BE-PR-11: მენეჯმენტის მიმოხილვა — დღის წესრიგი სრულია',              c: '§8.9' },
      { n: 'BE-PR-12: დოკუმენტების მართვა — ვერსიების კონტროლი დანერგილია',       c: '§8.3' },
      { n: 'BE-PR-13: ჩანაწერების მართვა — შენახვის ვადები განსაზღვრულია',        c: '§8.4' },
      { n: 'BE-PR-14: პერსონალის კვალიფიკაცია და ტრენინგი — სრულია',              c: '§6.1' },
      { n: 'BE-PR-15: მოწყობილობის მართვა და კალიბრაცია — სრულია',               c: '§6.2' },
    ],
  },
  {
    id: 'wi', title: '5. სამუშაო ინსტრუქციები (BE-WI-01–04)', period: 'quarterly', doc: 'C_სამუშაო_ინსტრუქციები',
    items: [
      { n: 'BE-WI-01: ხარჯთაღრიცხვის შესაბამისობის შემოწმება — ინსტრუქცია სრულია', c: '§7.4' },
      { n: 'BE-WI-02: შესრულებული სამუშაოს ფორმა 2 — ინსტრუქცია სრულია',          c: '§7.4' },
      { n: 'BE-WI-03: ფასწარმოქმნის ადეკვატურობის შემოწმება — ინსტრუქცია სრულია', c: '§7.4' },
      { n: 'BE-WI-04: ტექნიკური ზედამხედველობა — ინსტრუქცია სრულია',             c: '§7.4' },
      { n: 'სამუშაო ინსტრუქციები გაცნობილია ყველა ინსპექტორს',                   c: '§6.1' },
    ],
  },
  {
    id: 'forms', title: '6. ფორმები და შაბლონები (FM-01–FM-25)', period: 'monthly', doc: 'E_ფორმები_და_შაბლონები',
    items: [
      { n: 'FM-01: ინსპექტირების ანგარიშის შაბლონი — სრული და ვალიდური',          c: 'BE-PR-06' },
      { n: 'FM-02: მიუკერძოებლობის დეკლარაცია — ყველა პერსონალს ხელმოწერილი',    c: 'BE-PR-14' },
      { n: 'FM-03: კონფიდენციალობის შეთანხმება — ყველა პერსონალს ხელმოწერილი',   c: 'BE-PR-14' },
      { n: 'FM-04: შიდა აუდიტის გეგმა და ანგარიში — განახლებულია',               c: 'BE-PR-10' },
      { n: 'FM-05: მომსახურების ხელშეკრულება — შაბლონი სრულია',                   c: 'BE-PR-01' },
      { n: 'FM-06: საჩივრის/აპელაციის ფორმა — სრულია',                            c: 'BE-PR-07' },
      { n: 'FM-07: მოწყობილობის ვერიფიკაციის ფორმა — შევსებულია',                c: 'BE-PR-15' },
      { n: 'FM-08: კომპეტენციის შეფასების ფორმა — შევსებულია',                    c: 'BE-PR-14' },
      { n: 'FM-09: ხელშეკრულების განხილვის ფორმა — შევსებულია',                   c: 'BE-PR-02' },
      { n: 'FM-10: CAPA ფორმა — შევსებული და თვალყური ადევნებული',               c: 'BE-PR-09' },
      { n: 'FM-11: ინსპექტირების გეგმა — შევსებულია',                             c: 'BE-PR-03' },
      { n: 'FM-16: ვიზიტის ჩანაწერი — შევსებულია',                               c: 'BE-PR-04' },
      { n: 'FM-18: განაცხადის ფორმა — სრულია',                                    c: 'BE-PR-01' },
      { n: 'FM-21: ინსპექტირების რეგისტრი — განახლებულია',                        c: '§7.3' },
    ],
  },
  {
    id: 'hr', title: '7. HR — სამუშაო აღწერილობები და კვალიფიკაცია', period: 'quarterly', doc: 'D_სამუშაო_აღწერილობები',
    items: [
      { n: 'HR-JD-001: აღმასრულებელი დირექტორის სამუშაო აღწერილობა — სრულია',    c: '§6.1' },
      { n: 'HR-JD-002: ხარისხის მენეჯერის სამუშაო აღწერილობა — სრულია',          c: '§6.1' },
      { n: 'HR-JD-003: ტექნიკური მენეჯერის სამუშაო აღწერილობა — სრულია',         c: '§6.1' },
      { n: 'HR-JD-004: ინსპექტორის სამუშაო აღწერილობა — სრულია',                 c: '§6.1' },
      { n: 'HR-JD-005: ადმინისტრატორის სამუშაო აღწერილობა — სრულია',             c: '§6.1' },
      { n: 'ხარისხის მენეჯერი არ ახდენს ინსპექტირებას ერთდროულად (კონფლ. ინტ.)', c: '§4.1' },
      { n: 'პერსონალის კვალიფიკაციის ჩანაწერები — CV, სერთიფიკატები განახლებულია', c: '§6.1.2' },
      { n: 'ტრენინგის წლიური გეგმა შედგენილია და მიმდინარეობს',                  c: '§6.1.3' },
      { n: 'FM-13 ტრენინგის ჩანაწერი — შევსებულია და შენახულია',                 c: '§6.1' },
    ],
  },
  {
    id: 'tech', title: '8. ტექნიკური სფერო და მოწყობილობა', period: 'annual', doc: 'BE-PR-15',
    items: [
      { n: 'ინსპექტირების მეთოდების და სტანდარტების ნუსხა განახლებულია',          c: '§7.1' },
      { n: 'მოწყობილობების სრული სია — ინვენტარი შედგენილია',                    c: '§6.2' },
      { n: 'კალიბრაციის ვადები — ყველა მოწყობილობა 12 თვის ფარგლებშია',          c: '§6.2.3' },
      { n: 'FM-07 მოწყობილობის ვერიფიკაციის ჩანაწერები — შევსებული',             c: '§6.2' },
      { n: 'გარე ქვეკონტრაქტორების სია შედგენილია (FM-12)',                       c: '§6.3' },
      { n: 'BE-WI-01..04 სამუშაო ინსტრუქციები — ხელმისაწვდომია ინსპ. ადგილზე',   c: '§7.4' },
    ],
  },
  {
    id: 'impart', title: '9. მიუკერძოებლობა და კონფლიქტი', period: 'annual', doc: 'POL-01',
    items: [
      { n: 'FM-02 მიუკერძოებლობის დეკლარაცია — ყველა პერსონალს ხელმოწერილი',    c: '§4.1' },
      { n: 'კონფლიქტი ინტერესების რეესტრი — განახლებულია',                       c: '§4.1' },
      { n: 'კლიენტებთან კონფიდენციალობის შეთანხმება (FM-03) — ხელმოწერილია',     c: '§4.2' },
      { n: 'მიუკერძოებლობის გადასინჯვა განხორციელდა — ბოლო 12 თვე',             c: '§4.1.4' },
      { n: 'POL-01 მიუკერძოებლობის პოლიტიკა — ხელმისაწვდომია კლიენტებისთვის',   c: '§4.1' },
    ],
  },
  {
    id: 'risk', title: '10. რისკების მართვა (RM-01)', period: 'annual', doc: 'G_რისკების_მართვა',
    items: [
      { n: 'RM-01 რისკების რეესტრი — განახლებულია მიმდინარე წლისთვის',           c: '§8.1' },
      { n: 'ყველა მაღალი რისკი იდენტიფიცირებულია და კონტროლის ზომები განსაზღვრულია', c: '§8.1' },
      { n: 'რისკების მართვა განხილულია მენეჯმენტის მიმოხილვაზე',                 c: '§8.9' },
    ],
  },
  {
    id: 'records', title: '11. მართვის ჩანაწერები და რეგისტრები', period: 'monthly', doc: 'BE-PR-13',
    items: [
      { n: 'შიდა აუდიტის განრიგი — შედგენილია (მინ. წელიწადში 2-ჯერ)',           c: '§8.6' },
      { n: 'ბოლო შიდა აუდიტის ანგარიში (FM-04) — შენახულია',                     c: '§8.6' },
      { n: 'ღია კორექტირებითი ქმედებების სტატუსი და ვადები — კონტროლდება',       c: '§8.8' },
      { n: 'მენეჯმენტის მიმოხილვის ოქმი (FM-15) — ბოლო შეხვედრის ოქმი შენახულია', c: '§8.9' },
      { n: 'დოკუმენტების განახლების რეესტრი (FM-24) — განახლებულია',              c: '§8.3' },
      { n: 'კლიენტების საჩივრების რეესტრი — წარმოებული და განახლებული',          c: '§7.7' },
      { n: 'FM-21 ინსპექტირების რეგისტრი — განახლებულია ყველა საქმით',           c: '§7.3' },
    ],
  },
];

const PERIOD_LABEL = { monthly: 'ყოველთვ.', quarterly: 'კვარტ.', annual: 'წლიური' };
const PERIOD_COLOR = { monthly: '#0F6E56', quarterly: '#185FA5', annual: '#534AB7' };
const PERIOD_BG    = { monthly: '#E1F5EE', quarterly: '#E6F1FB', annual: '#EEEDFE' };

const ST_OPTS = [
  { v: '',        l: '— აირჩიეთ' },
  { v: 'ok',      l: '✅ შესაბამისი' },
  { v: 'partial', l: '⚠️ ნაწილობრივ' },
  { v: 'bad',     l: '❌ შეუსაბამო' },
  { v: 'na',      l: '— არ ვრცელდება' },
];

const makeInitState = () => {
  const s = {};
  SECS.forEach(sec => { s[sec.id] = { reviewer: 'dir', items: sec.items.map(() => ({ sd: '', sq: '', note: '' })) }; });
  return s;
};

const effSt = (item, rev) => {
  if (rev === 'dir') return item.sd;
  if (rev === 'qm')  return item.sq;
  if (item.sd === 'bad' || item.sq === 'bad') return 'bad';
  if (item.sd === 'partial' || item.sq === 'partial') return 'partial';
  if (item.sd === 'ok' && item.sq === 'ok') return 'ok';
  if (item.sd === 'na' && item.sq === 'na') return 'na';
  return item.sd || item.sq || '';
};

// ── Section component ─────────────────────────────────────────────────────────
function SectionBlock({ sec, st, onChange, onReviewerChange }) {
  const [open, setOpen] = useState(false);
  const rev = st.reviewer;

  const okCnt  = st.items.filter(i => effSt(i, rev) === 'ok').length;
  const badCnt = st.items.filter(i => effSt(i, rev) === 'bad').length;
  const parCnt = st.items.filter(i => effSt(i, rev) === 'partial').length;
  const badgeColor = badCnt ? '#A32D2D' : parCnt ? '#854F0B' : okCnt === st.items.length && okCnt > 0 ? '#3B6D11' : '#5F5E5A';
  const badgeBg    = badCnt ? '#FCEBEB' : parCnt ? '#FAEEDA' : okCnt === st.items.length && okCnt > 0 ? '#EAF3DE' : '#F1EFE8';
  const isBoth = rev === 'both';

  return (
    <div style={{ marginBottom: 8, border: '0.5px solid #ddd', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '9px 14px', background: '#f8f9fa', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 9, background: PERIOD_BG[sec.period], color: PERIOD_COLOR[sec.period], flexShrink: 0, fontWeight: 600 }}>
          {PERIOD_LABEL[sec.period]}
        </span>
        <span onClick={() => setOpen(o => !o)} style={{ flex: 1, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', userSelect: 'none', color: '#003366' }}>
          {sec.title}
        </span>
        <select value={rev} onChange={e => onReviewerChange(sec.id, e.target.value)}
          style={{ fontSize: 11, padding: '3px 7px', border: '0.5px solid #aaa', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>
          <option value="dir">დირექტორი</option>
          <option value="qm">ხ. მენეჯერი</option>
          <option value="both">ორივე</option>
        </select>
        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: badgeBg, color: badgeColor, flexShrink: 0 }}>
          {okCnt}/{st.items.length}
        </span>
        <button onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#888' }}>
          {open ? '▲' : '▼'}
        </button>
      </div>

      {open && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
            <thead>
              <tr style={{ background: '#f0f4f8' }}>
                <th style={{ padding: '6px 12px', textAlign: 'left', fontWeight: 500, color: '#444', borderBottom: '1px solid #e0e0e0' }}>საკ. პუნქტი</th>
                {isBoth ? (
                  <>
                    <th style={{ padding: '6px 10px', color: '#185FA5', fontWeight: 600, width: 150, borderBottom: '1px solid #e0e0e0' }}>დირექტ. სტ.</th>
                    <th style={{ padding: '6px 10px', color: '#3B6D11', fontWeight: 600, width: 150, borderBottom: '1px solid #e0e0e0' }}>ხ.მ. სტ.</th>
                  </>
                ) : (
                  <th style={{ padding: '6px 10px', fontWeight: 500, color: '#444', width: 170, borderBottom: '1px solid #e0e0e0' }}>
                    {rev === 'dir' ? 'დირექტ.' : 'ხ.მ.'} სტატუსი
                  </th>
                )}
                <th style={{ padding: '6px 10px', fontWeight: 500, color: '#444', width: 180, borderBottom: '1px solid #e0e0e0' }}>შენიშვნა</th>
              </tr>
            </thead>
            <tbody>
              {sec.items.map((it, i) => {
                const rowSt = st.items[i];
                const eff = effSt(rowSt, rev);
                const rowBg = eff === 'bad' ? '#fff5f5' : eff === 'partial' ? '#fffbeb' : eff === 'ok' ? '#f0fdf4' : '#fff';
                return (
                  <tr key={i} style={{ background: rowBg, borderBottom: '0.5px solid #eee' }}>
                    <td style={{ padding: '6px 12px', lineHeight: 1.5 }}>
                      {it.n}
                      <span style={{ display: 'inline-block', marginLeft: 6, fontSize: 9, color: '#999', background: '#f0f0f0', padding: '1px 5px', borderRadius: 3 }}>{it.c}</span>
                    </td>
                    {isBoth ? (
                      <>
                        <td style={{ padding: '4px 8px' }}>
                          <select value={rowSt.sd} onChange={e => onChange(sec.id, i, 'd', e.target.value)}
                            style={{ width: '100%', fontSize: 10.5, padding: '3px 4px', border: '0.5px solid #ccc', borderRadius: 4 }}>
                            {ST_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '4px 8px' }}>
                          <select value={rowSt.sq} onChange={e => onChange(sec.id, i, 'q', e.target.value)}
                            style={{ width: '100%', fontSize: 10.5, padding: '3px 4px', border: '0.5px solid #ccc', borderRadius: 4 }}>
                            {ST_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                          </select>
                        </td>
                      </>
                    ) : (
                      <td style={{ padding: '4px 8px' }}>
                        <select value={rev === 'dir' ? rowSt.sd : rowSt.sq}
                          onChange={e => onChange(sec.id, i, rev === 'dir' ? 'd' : 'q', e.target.value)}
                          style={{ width: '100%', fontSize: 10.5, padding: '3px 4px', border: '0.5px solid #ccc', borderRadius: 4 }}>
                          {ST_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                        </select>
                      </td>
                    )}
                    <td style={{ padding: '4px 8px' }}>
                      <input type="text" value={rowSt.note} placeholder="შენიშვნა..."
                        onChange={e => onChange(sec.id, i, 'note', e.target.value)}
                        style={{ width: '100%', fontSize: 10.5, padding: '3px 6px', border: '0.5px solid #ccc', borderRadius: 4 }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── PDF Print Report ──────────────────────────────────────────────────────────
function buildPrintHtml({ chkState, chkDate, sessionNum, period, conclusion, dirSig, qmSig, summary }) {
  const stLabel = v => v === 'ok' ? '✅ შესაბამისი' : v === 'partial' ? '⚠️ ნაწილობრივ' : v === 'bad' ? '❌ შეუსაბამო' : v === 'na' ? '— ნ/გ' : '—';
  const stBg    = v => v === 'ok' ? '#f0fdf4' : v === 'partial' ? '#fffbeb' : v === 'bad' ? '#fff5f5' : '#fff';

  const sectionsHtml = SECS.map(sec => {
    const st = chkState[sec.id];
    const rev = st.reviewer;
    const rows = sec.items.map((it, i) => {
      const item = st.items[i];
      const dSt = item.sd, qSt = item.sq;
      const eff = effSt(item, rev);
      return `<tr style="background:${stBg(eff)}">
        <td style="padding:5px 8px;font-size:10pt;border-bottom:0.5px solid #eee">${it.n} <span style="font-size:8pt;color:#999">${it.c}</span></td>
        ${rev === 'both'
          ? `<td style="text-align:center;padding:4px;font-size:9pt;border-bottom:0.5px solid #eee">${stLabel(dSt)}</td>
             <td style="text-align:center;padding:4px;font-size:9pt;border-bottom:0.5px solid #eee">${stLabel(qSt)}</td>`
          : `<td style="text-align:center;padding:4px;font-size:9pt;border-bottom:0.5px solid #eee">${stLabel(rev === 'dir' ? dSt : qSt)}</td>`
        }
        <td style="padding:4px 8px;font-size:9pt;color:#555;border-bottom:0.5px solid #eee">${item.note || ''}</td>
      </tr>`;
    }).join('');

    const okCnt = st.items.filter(i => effSt(i, rev) === 'ok').length;
    const thExtra = rev === 'both'
      ? '<th style="width:120px">დირ. სტ.</th><th style="width:120px">ხ.მ. სტ.</th>'
      : `<th style="width:140px">${rev === 'dir' ? 'დირ.' : 'ხ.მ.'} სტ.</th>`;

    return `
      <div style="margin-bottom:16px;break-inside:avoid">
        <div style="background:#003366;color:#fff;padding:7px 10px;border-radius:5px 5px 0 0;display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:11pt;font-weight:600">${sec.title}</span>
          <span style="font-size:9pt">${okCnt}/${st.items.length}</span>
        </div>
        <table style="width:100%;border-collapse:collapse;font-family:Sylfaen,Arial,sans-serif">
          <thead><tr style="background:#e8f0f7">
            <th style="padding:5px 8px;text-align:left;font-size:9pt;font-weight:600">საკ. პუნქტი</th>
            ${thExtra}
            <th style="width:140px;padding:5px 8px;text-align:left;font-size:9pt;font-weight:600">შენიშვნა</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${sessionNum || 'MON'} — შიდა მონიტორინგი</title>
<style>
  @page { size: A4; margin: 1.5cm; }
  body { font-family: Sylfaen, Arial, sans-serif; font-size: 11pt; color: #222; margin: 0; }
  h1 { font-size: 15pt; color: #003366; text-align: center; margin-bottom: 4px; }
  .meta-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 14px; }
  .meta-cell { background: #f0f4f8; border-radius: 5px; padding: 7px 10px; }
  .meta-cell label { font-size: 8pt; color: #666; display: block; margin-bottom: 2px; }
  .meta-cell span { font-size: 10pt; font-weight: 600; }
  .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 14px; }
  .sum-box { border-radius: 6px; padding: 8px 4px; text-align: center; }
  .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; }
  .sig-box { border: 1px solid #ccc; border-radius: 6px; padding: 10px 12px; }
  .sig-box label { font-size: 9pt; color: #666; }
  .sig-line { border-bottom: 1px solid #999; margin-top: 30px; margin-bottom: 4px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<h1>📋 შიდა მონიტორინგის ჩეკლისტი</h1>
<p style="text-align:center;color:#555;font-size:9pt;margin-top:0">შპს „ბილდექს ექსპერტიზა" | ISO/IEC 17020:2012 Type A | GAC/SAAC</p>

<div class="meta-grid">
  <div class="meta-cell"><label>შემოწმების №</label><span>${sessionNum || '—'}</span></div>
  <div class="meta-cell"><label>თარიღი</label><span>${chkDate ? new Date(chkDate).toLocaleDateString('ka-GE') : '—'}</span></div>
  <div class="meta-cell"><label>პერიოდი</label><span>${period || '—'}</span></div>
</div>

<div class="summary">
  <div class="sum-box" style="background:#EAF3DE"><div style="font-size:20pt;font-weight:700;color:#3B6D11">${summary.ok}</div><div style="font-size:9pt;color:#3B6D11">შესაბამისი</div></div>
  <div class="sum-box" style="background:#FAEEDA"><div style="font-size:20pt;font-weight:700;color:#854F0B">${summary.partial}</div><div style="font-size:9pt;color:#854F0B">ნაწილობრივ</div></div>
  <div class="sum-box" style="background:#FCEBEB"><div style="font-size:20pt;font-weight:700;color:#A32D2D">${summary.bad}</div><div style="font-size:9pt;color:#A32D2D">შეუსაბამო</div></div>
  <div class="sum-box" style="background:#E6F1FB"><div style="font-size:20pt;font-weight:700;color:#185FA5">${summary.pct != null ? summary.pct + '%' : '—'}</div><div style="font-size:9pt;color:#185FA5">შესაბ. %</div></div>
</div>

${sectionsHtml}

${conclusion ? `<div style="border:1px solid #003366;background:#f0f4f8;border-radius:6px;padding:10px 12px;margin-bottom:16px">
  <div style="font-size:9pt;font-weight:600;color:#003366;margin-bottom:4px">დასკვნა</div>
  <div style="font-size:10pt">${conclusion}</div>
</div>` : ''}

<div class="sig-grid">
  <div class="sig-box">
    <label>დირექტორი</label>
    <div class="sig-line"></div>
    <div style="font-size:10pt">${dirSig || 'Levan Sachiashvili'}</div>
  </div>
  <div class="sig-box">
    <label>ხარისხის მენეჯერი</label>
    <div class="sig-line"></div>
    <div style="font-size:10pt">${qmSig || 'Alexandre Sumbadze'}</div>
  </div>
</div>
</body></html>`;
}

// ── Excel Export ─────────────────────────────────────────────────────────────
function buildExcel({ chkState, chkDate, sessionNum, period, conclusion, dirSig, qmSig, summary }) {
  const wb = XLSX.utils.book_new();

  const stText = v =>
    v === 'ok'      ? '✅ შესაბამისი'   :
    v === 'partial' ? '⚠️ ნაწილობრივ'  :
    v === 'bad'     ? '❌ შეუსაბამო'   :
    v === 'na'      ? '— არ ვრცელდება' : '—';

  // ── Sheet 1: Cover / Summary ──────────────────────────────────────────────
  const coverData = [
    ['შპს „ბილდექს ექსპერტიზა"', '', 'ISO/IEC 17020:2012 Type A'],
    ['შიდა მონიტორინგის ჩეკლისტი', '', ''],
    [],
    ['შემოწმების №',   sessionNum || '—'],
    ['თარიღი',         chkDate ? new Date(chkDate).toLocaleDateString('ka-GE') : '—'],
    ['პერიოდი',        period || '—'],
    [],
    ['✅ შესაბამისი',  summary.ok],
    ['⚠️ ნაწილობრივ', summary.partial],
    ['❌ შეუსაბამო',  summary.bad],
    ['შესაბამისობა %', (summary.pct != null ? summary.pct + '%' : '—')],
    [],
    ['დირექტორი',      dirSig || '—'],
    ['ხარისხის მენეჯერი', qmSig || '—'],
    [],
    ['დასკვნა', conclusion || '—'],
  ];
  const wsCover = XLSX.utils.aoa_to_sheet(coverData);
  wsCover['!cols'] = [{ wch: 30 }, { wch: 45 }, { wch: 30 }];
  wsCover['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },
    { s: { r: 15, c: 1 }, e: { r: 15, c: 2 } },
  ];
  XLSX.utils.book_append_sheet(wb, wsCover, 'შეჯამება');

  // ── Sheet 2: Full Checklist ───────────────────────────────────────────────
  const header = [
    'სექცია', 'ISO პუნქტი', 'საკ. პუნქტი', 'ISO §',
    'დირექტ. სტ.', 'ხ.მ. სტ.', 'ეფ. სტ.', 'შენიშვნა',
  ];
  const rows = [header];

  SECS.forEach(sec => {
    const st = chkState[sec.id];
    const rev = st.reviewer;
    sec.items.forEach((it, i) => {
      const item = st.items[i];
      const eff = effSt(item, rev);
      rows.push([
        sec.title,
        sec.doc,
        it.n,
        it.c,
        stText(item.sd),
        stText(item.sq),
        stText(eff),
        item.note || '',
      ]);
    });
    // blank separator row between sections
    rows.push(['', '', '', '', '', '', '', '']);
  });

  const wsMain = XLSX.utils.aoa_to_sheet(rows);
  wsMain['!cols'] = [
    { wch: 38 }, { wch: 20 }, { wch: 60 }, { wch: 12 },
    { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 35 },
  ];

  // Color the header row
  const headerRange = XLSX.utils.decode_range(wsMain['!ref']);
  for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!wsMain[addr]) continue;
    wsMain[addr].s = {
      fill: { patternType: 'solid', fgColor: { rgb: '003366' } },
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      alignment: { wrapText: true, vertical: 'center' },
    };
  }

  // Color data rows by effective status
  for (let R = 1; R < rows.length; R++) {
    const effVal = rows[R][6]; // column G = effective status
    let rgb = null;
    if (effVal && effVal.includes('შესაბამისი'))  rgb = 'EAF3DE';
    else if (effVal && effVal.includes('ნაწილ'))  rgb = 'FAEEDA';
    else if (effVal && effVal.includes('შეუსაბ')) rgb = 'FCEBEB';

    if (rgb) {
      for (let C = 0; C <= 7; C++) {
        const addr = XLSX.utils.encode_cell({ r: R, c: C });
        if (!wsMain[addr]) wsMain[addr] = { t: 's', v: '' };
        wsMain[addr].s = {
          fill: { patternType: 'solid', fgColor: { rgb } },
          alignment: { wrapText: true, vertical: 'top' },
        };
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, wsMain, 'ჩეკლისტი');

  // ── Sheet 3: Non-conformities only ───────────────────────────────────────
  const ncHeader = ['სექცია', 'პუნქტი', 'ISO §', 'სტ.', 'შენიშვნა'];
  const ncRows = [ncHeader];
  SECS.forEach(sec => {
    const st = chkState[sec.id];
    const rev = st.reviewer;
    sec.items.forEach((it, i) => {
      const item = st.items[i];
      const eff = effSt(item, rev);
      if (eff === 'bad' || eff === 'partial') {
        ncRows.push([sec.title, it.n, it.c, stText(eff), item.note || '']);
      }
    });
  });
  if (ncRows.length > 1) {
    const wsNC = XLSX.utils.aoa_to_sheet(ncRows);
    wsNC['!cols'] = [{ wch: 35 }, { wch: 60 }, { wch: 12 }, { wch: 18 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, wsNC, 'შეუსაბამობები');
  }

  // Download
  const fileName = `ჩეკლისტი_${sessionNum || 'MON'}_${chkDate || new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ChecklistPage({ role }) {
  const [sessions, setSessions]     = useState([]);
  const [view, setView]             = useState('list');
  const [activeSession, setActive]  = useState(null);
  const [saving, setSaving]         = useState(false);
  const [msg, setMsg]               = useState(null);

  const [chkState, setChkState]     = useState(makeInitState());
  const [chkDate, setChkDate]       = useState(new Date().toISOString().split('T')[0]);
  const [period, setPeriod]         = useState('');
  const [sessionNum, setSessionNum] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [nextDate, setNextDate]     = useState('');
  const [dirSig, setDirSig]         = useState('Levan Sachiashvili');
  const [qmSig, setQmSig]           = useState('Alexandre Sumbadze');

  const [aiLoading, setAiLoading]   = useState(false);
  const [aiResult, setAiResult]     = useState('');
  const printRef                    = useRef();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchSessions = useCallback(async () => {
    try { const r = await axios.get('/api/checklists', { headers }); setSessions(r.data); }
    catch {}
  }, []); // eslint-disable-line

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const summary = (() => {
    let ok = 0, partial = 0, bad = 0, total = 0;
    SECS.forEach(sec => {
      const st = chkState[sec.id];
      st.items.forEach(item => {
        const v = effSt(item, st.reviewer);
        if (!v || v === 'na') return;
        total++;
        if (v === 'ok') ok++;
        else if (v === 'partial') partial++;
        else if (v === 'bad') bad++;
      });
    });
    return { ok, partial, bad, pct: total ? Math.round(ok / total * 100) : null };
  })();

  const handleItemChange = (secId, idx, who, val) => {
    setChkState(prev => {
      const next = { ...prev };
      const items = [...next[secId].items];
      items[idx] = { ...items[idx] };
      if (who === 'note') items[idx].note = val;
      else if (who === 'd') items[idx].sd = val;
      else items[idx].sq = val;
      next[secId] = { ...next[secId], items };
      return next;
    });
    setAiResult('');
  };

  const handleReviewerChange = (secId, val) => {
    setChkState(prev => ({ ...prev, [secId]: { ...prev[secId], reviewer: val } }));
  };

  const handlePdfPrint = () => {
    const html = buildPrintHtml({ chkState, chkDate, sessionNum, period, conclusion, dirSig, qmSig, summary });
    const win = window.open('', '_blank', 'width=960,height=750');
    if (!win) { alert('ბრაუზერი ბლოკავს pop-up-ს. გთხოვთ, დაუშვათ.'); return; }
    win.document.write(html);
    win.document.close();
    win.onload = () => { win.focus(); win.print(); };
  };

  const handleExcelExport = () => {
    buildExcel({ chkState, chkDate, sessionNum, period, conclusion, dirSig, qmSig, summary });
  };

  const openNew = () => {
    setChkState(makeInitState()); setChkDate(new Date().toISOString().split('T')[0]);
    setPeriod(''); setSessionNum(''); setConclusion(''); setNextDate('');
    setDirSig('Levan Sachiashvili'); setQmSig('Alexandre Sumbadze');
    setAiResult(''); setActive(null); setView('new');
  };

  const openEdit = async (sess) => {
    try {
      const r = await axios.get(`/api/checklists/${sess._id}`, { headers });
      const s = r.data;
      setChkState(s.state && Object.keys(s.state).length ? s.state : makeInitState());
      setChkDate(s.checkDate ? s.checkDate.split('T')[0] : '');
      setPeriod(s.period || ''); setSessionNum(s.sessionNumber || '');
      setConclusion(s.conclusion || ''); setNextDate(s.nextCheckDate ? s.nextCheckDate.split('T')[0] : '');
      setDirSig(s.directorSig || 'Levan Sachiashvili'); setQmSig(s.qmSig || 'Alexandre Sumbadze');
      setAiResult(''); setActive(s); setView('edit');
    } catch (e) { setMsg({ type: 'danger', text: e.message }); }
  };

  const saveSession = async () => {
    setSaving(true);
    try {
      const payload = { state: chkState, checkDate: chkDate, period, sessionNumber: sessionNum,
        conclusion, nextCheckDate: nextDate || null, directorSig: dirSig, qmSig };
      if (activeSession) {
        await axios.put(`/api/checklists/${activeSession._id}`, payload, { headers });
        setMsg({ type: 'success', text: 'შენახულია ✅' });
      } else {
        const r = await axios.post('/api/checklists', payload, { headers });
        setActive(r.data); setSessionNum(r.data.sessionNumber);
        setMsg({ type: 'success', text: 'შეიქმნა: ' + r.data.sessionNumber });
      }
      fetchSessions();
    } catch (e) { setMsg({ type: 'danger', text: e.message }); }
    setSaving(false);
  };

  const deleteSession = async (id) => {
    if (!window.confirm('გსურთ წაშლა?')) return;
    try { await axios.delete(`/api/checklists/${id}`, { headers }); fetchSessions(); }
    catch (e) { setMsg({ type: 'danger', text: e.message }); }
  };

  const buildPrompt = (who) => {
    const lines = [];
    SECS.forEach(sec => {
      const st = chkState[sec.id]; const rev = st.reviewer;
      const secLines = [];
      sec.items.forEach((it, i) => {
        const item = st.items[i]; const parts = [];
        if ((who === 'all' || who === 'dir') && (rev === 'dir' || rev === 'both') && item.sd && item.sd !== 'na')
          parts.push('დ:' + (item.sd === 'ok' ? '✅' : item.sd === 'partial' ? '⚠️' : '❌'));
        if ((who === 'all' || who === 'qm') && (rev === 'qm' || rev === 'both') && item.sq && item.sq !== 'na')
          parts.push('ხ.მ:' + (item.sq === 'ok' ? '✅' : item.sq === 'partial' ? '⚠️' : '❌'));
        if (item.note) parts.push('შენ: ' + item.note);
        if (parts.length) secLines.push('  • ' + it.n + ' [' + it.c + ']: ' + parts.join(' | '));
      });
      if (secLines.length) { lines.push('\n' + sec.title + ':'); lines.push(...secLines); }
    });
    const report = lines.join('\n');
    const whoLbl = who === 'dir' ? 'დირექტორის' : who === 'qm' ? 'ხ. მენეჯერის' : 'სრული';
    if (!report.trim())
      return `შენ ხარ ISO/IEC 17020:2012 Type A ექსპერტი. Buildex Expertise — სამშენებლო ინსპექტირების კომპანია საქართველოში, ემზადება GAC/SAAC აკრედიტაციისთვის. ჩეკლისტი ჯერ ცარიელია. მოგვეცი: 3 ყველაზე კრიტიკული GAC-ის შემოწმების სფერო + 1 პრაქტიკული რჩევა სად დაიწყოს. ქართულად, მოკლედ.`;
    return `შენ ხარ ISO/IEC 17020:2012 Type A ექსპერტი. Buildex Expertise ${whoLbl} შემოწმების შედეგები:\n${report}\n\nქართულად, კონკრეტულად:\n1. შეჯამება (2 წინადადება)\n2. კრიტიკული ❌ ხარვეზები + ISO კლაუზი\n3. ⚠️ ყველაზე სარისკო პუნქტები\n4. 3 მთავარი კორექტირებითი ქმედება (CAPA) პრიორიტეტით\n5. GAC მზადყოფნა 1–10 + 1 წინადადება დასაბუთება`;
  };

  const runAI = async (who) => {
    setAiLoading(true); setAiResult('');
    try {
      const r = await axios.post('/api/checklist-analyze', { prompt: buildPrompt(who) }, { headers });
      setAiResult(r.data.text);
    } catch (e) { setAiResult('შეცდომა: ' + (e.response?.data?.error || e.message)); }
    setAiLoading(false);
  };

  // ── List view ───────────────────────────────────────────────────────────────
  if (view === 'list') {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 0' }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold mb-0" style={{ color: '#003366' }}>📋 შიდა მონიტორინგის ჩეკლისტი</h3>
            <small className="text-muted">ISO/IEC 17020:2012 Type A · GAC/SAAC · 11 სექცია · {SECS.reduce((a,s)=>a+s.items.length,0)} პუნქტი</small>
          </div>
          {['admin', 'quality_manager'].includes(role) && (
            <button className="btn btn-primary fw-bold" onClick={openNew}>+ ახალი შემოწმება</button>
          )}
        </div>
        {msg && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}
        {sessions.length === 0 ? (
          <div className="text-center text-muted py-5"><div style={{ fontSize: 50 }}>📋</div><p>შემოწმებები არ არის. შექმენი პირველი!</p></div>
        ) : (
          <div className="card shadow-sm">
            <table className="table table-hover mb-0" style={{ fontSize: '0.84rem' }}>
              <thead style={{ background: '#003366', color: '#fff' }}>
                <tr>
                  <th className="py-2 px-3">№</th><th className="py-2 px-3">თარიღი</th>
                  <th className="py-2 px-3">პერიოდი</th><th className="py-2 px-3">შემმოწმ.</th>
                  <th className="py-2 px-3">დასკვნა</th><th className="py-2 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s._id}>
                    <td className="px-3 fw-bold">{s.sessionNumber}</td>
                    <td className="px-3">{new Date(s.checkDate).toLocaleDateString('ka-GE')}</td>
                    <td className="px-3">{s.period || '—'}</td>
                    <td className="px-3">{s.createdBy}</td>
                    <td className="px-3" style={{ maxWidth: 280, fontSize: '0.78rem' }}>
                      {s.conclusion ? s.conclusion.slice(0, 80) + (s.conclusion.length > 80 ? '...' : '') : '—'}
                    </td>
                    <td className="px-3">
                      <div className="d-flex gap-1 flex-wrap">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(s)}>✏️ გახსნა</button>
                        {role === 'admin' && <button className="btn btn-sm btn-outline-danger" onClick={() => deleteSession(s._id)}>🗑️</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // ── Form view ───────────────────────────────────────────────────────────────
  return (
    <div ref={printRef} style={{ maxWidth: 1150, margin: '0 auto', padding: '16px 0 80px' }}>
      <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
        <button className="btn btn-sm btn-outline-secondary" onClick={() => setView('list')}>← სია</button>
        <h5 className="fw-bold mb-0 ms-1" style={{ color: '#003366' }}>
          📋 {activeSession ? activeSession.sessionNumber : 'ახალი შემოწმება'}
        </h5>
        <div className="ms-auto d-flex gap-2 flex-wrap">
          <button className="btn btn-outline-danger btn-sm fw-bold" onClick={handlePdfPrint}
            title="A4 PDF — ბრაუზერის Print Dialog-ით">
            📄 PDF
          </button>
          <button className="btn btn-outline-success btn-sm fw-bold" onClick={handleExcelExport}
            title="Excel ცხრილი — 3 ფურცელი: შეჯამება, ჩეკლისტი, შეუსაბამობები">
            📊 Excel
          </button>
          <button className="btn btn-primary btn-sm fw-bold" onClick={saveSession} disabled={saving}>
            {saving ? '⏳...' : '💾 შენახვა'}
          </button>
        </div>
      </div>

      {msg && <div className={`alert alert-${msg.type} py-2`} onClick={() => setMsg(null)}>{msg.text}</div>}

      {/* Meta */}
      <div className="card shadow-sm mb-3 p-3">
        <div className="row g-2">
          <div className="col-md-3"><label className="form-label fw-bold small">თარიღი</label>
            <input type="date" className="form-control form-control-sm" value={chkDate} onChange={e => setChkDate(e.target.value)} /></div>
          <div className="col-md-3"><label className="form-label fw-bold small">ნომერი</label>
            <input className="form-control form-control-sm" value={sessionNum} onChange={e => setSessionNum(e.target.value)} placeholder="MON-2026-001" /></div>
          <div className="col-md-3"><label className="form-label fw-bold small">პერიოდი</label>
            <input className="form-control form-control-sm" value={period} onChange={e => setPeriod(e.target.value)} placeholder="Q2 2026" /></div>
          <div className="col-md-3"><label className="form-label fw-bold small">შემდ. შემოწ.</label>
            <input type="date" className="form-control form-control-sm" value={nextDate} onChange={e => setNextDate(e.target.value)} /></div>
        </div>
      </div>

      {/* Summary */}
      <div className="d-flex gap-2 mb-3">
        {[
          { l: 'შესაბამისი', v: summary.ok,      c: '#3B6D11', bg: '#EAF3DE' },
          { l: 'ნაწილობრივ', v: summary.partial,  c: '#854F0B', bg: '#FAEEDA' },
          { l: 'შეუსაბამო',  v: summary.bad,      c: '#A32D2D', bg: '#FCEBEB' },
          { l: 'შესაბ. %',   v: summary.pct != null ? summary.pct + '%' : '—', c: '#003366', bg: '#e8f0f7' },
        ].map(b => (
          <div key={b.l} style={{ flex: 1, textAlign: 'center', background: b.bg, borderRadius: 8, padding: '9px 4px' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: b.c }}>{b.v}</div>
            <div style={{ fontSize: 10, color: b.c, marginTop: 2 }}>{b.l}</div>
          </div>
        ))}
      </div>

      {/* Sections */}
      {SECS.map(sec => (
        <SectionBlock key={sec.id} sec={sec} st={chkState[sec.id]}
          onChange={handleItemChange} onReviewerChange={handleReviewerChange} />
      ))}

      {/* AI */}
      <div className="card shadow-sm mt-3 p-3">
        <h6 className="fw-bold mb-2" style={{ color: '#003366' }}>🤖 AI ანალიზი — ISO 17020:2012 / GAC</h6>
        <div className="d-flex gap-2 flex-wrap mb-2">
          <button className="btn btn-primary btn-sm" onClick={() => runAI('all')} disabled={aiLoading}>
            {aiLoading ? '⏳ მიმდინარეობს...' : '✨ სრული ანალიზი'}
          </button>
          <button className="btn btn-outline-primary btn-sm" onClick={() => runAI('dir')} disabled={aiLoading}>👤 დირ. ანალიზი</button>
          <button className="btn btn-outline-success btn-sm" onClick={() => runAI('qm')} disabled={aiLoading}>✅ ხ.მ. ანალიზი</button>
        </div>
        {aiResult && (
          <div style={{ background: '#f8f9fa', border: '0.5px solid #ddd', borderRadius: 8, padding: 14, fontSize: 12.5, lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
            {aiResult}
          </div>
        )}
      </div>

      {/* Signatures + Conclusion */}
      <div className="card shadow-sm mt-3 p-3">
        <h6 className="fw-bold mb-2">✍️ ხელმოწერები და დასკვნა</h6>
        <div className="row g-2">
          <div className="col-md-6"><label className="form-label small">დირექტორი</label>
            <input className="form-control form-control-sm" value={dirSig} onChange={e => setDirSig(e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label small">ხარისხის მენეჯერი</label>
            <input className="form-control form-control-sm" value={qmSig} onChange={e => setQmSig(e.target.value)} /></div>
          <div className="col-12"><label className="form-label small">დასკვნა / კომენტარი</label>
            <textarea className="form-control form-control-sm" rows={3} value={conclusion} onChange={e => setConclusion(e.target.value)} /></div>
        </div>
      </div>
    </div>
  );
}
