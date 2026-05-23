import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// ── Checklist data (ISO/IEC 17020:2012) ──────────────────────────────────────
const SECS = [
  { id: 'qm', title: '1. ხარისხის სახელმძღვანელო (QM-01)', period: 'quarterly', items: [
    { n: 'QM-01 — სისრულე, ვერსია, გადახ. თარიღი', c: '§4–8' },
    { n: 'QM-01 — ხელმოწ. (დირ.) და მოქ. სტ.', c: '§4.1.3' },
    { n: 'მიუმხრ. პოლიტ. — ჩართ. და სრული', c: '§4.1' },
    { n: 'კონფ. პოლიტ. — ჩართ. და სრული', c: '§4.2' },
    { n: 'ორგ. სქემა — ანახლებული', c: '§4.1.4' },
    { n: 'პერს. როლები და უფლ-ები განსაზ.', c: '§4.1.5' },
    { n: 'QM-01/ORD — ხელმ. დელ. ბრძ. ვალ.', c: '§4.1.5' },
    { n: 'QM-01 პერიოდ. მიმოიხილება', c: '§8.8' },
  ]},
  { id: 'pr_core', title: '2. პროცედ. — ინსპ. ძირ. ციკლი (PR-01–06)', period: 'quarterly', items: [
    { n: 'PR-01: განაცხ. მიღება — სრულია', c: '§7.1' },
    { n: 'PR-02: სახელშ. შეთ. — სრულია', c: '§7.2' },
    { n: 'PR-03: ინსპ. დაგეგმვა — სრულია', c: '§7.3' },
    { n: 'PR-04: ინსპ. ჩატარება — სრულია', c: '§7.4' },
    { n: 'PR-05: შედ. გაფ. — ყველა ველი', c: '§7.5' },
    { n: 'PR-06: ანგ. გაცემა — სტ. სრულია', c: '§7.6' },
  ]},
  { id: 'pr_qms', title: '3. პროცედ. — ხარისხ. მართვა (PR-07–14)', period: 'quarterly', items: [
    { n: 'PR-07: საჩივ. და აპელ. — სრულია', c: '§7.7' },
    { n: 'PR-08: შეუს. სამ. — სრულია', c: '§8.7' },
    { n: 'PR-09: კა — ფ. ანალ. ჩართ.', c: '§8.8' },
    { n: 'PR-10: შ. აუდ. — გეგმა, კომპ.', c: '§8.6' },
    { n: 'PR-11: მენ. მიმ. — დ. წ. სრულია', c: '§8.9' },
    { n: 'PR-12: დოკ. მართ. — ვ. კონტ.', c: '§8.3' },
    { n: 'PR-13: ჩ. მართ. — შ. ვადები', c: '§8.4' },
    { n: 'PR-14: პ. კვ. — ტრ., შ.', c: '§6.1' },
  ]},
  { id: 'forms', title: '4. ფორმები (F-01–F-10)', period: 'monthly', items: [
    { n: 'F-01: განაცხ. ფ.', c: 'PR-01' }, { n: 'F-02: ინსპ. გეგმა', c: 'PR-03' },
    { n: 'F-03: ინსპ. ჩეკლ.', c: 'PR-04' }, { n: 'F-04: ინსპ. ანგ.', c: 'PR-06' },
    { n: 'F-05: საჩ. ფ.', c: 'PR-07' }, { n: 'F-06: კა ფ.', c: 'PR-09' },
    { n: 'F-07: შ. აუდ. ფ.', c: 'PR-10' }, { n: 'F-08: ტრ. ჩ.', c: 'PR-14' },
    { n: 'F-09: მ.მ. ოქმი', c: 'PR-11' }, { n: 'F-10: კალ. ჩ.', c: '§6.2' },
  ]},
  { id: 'hr', title: '5. HR დოკუმენტ.', period: 'quarterly', items: [
    { n: 'HR-JD-001: აღმ. დირ. სამ. აღწ.', c: '§6.1' },
    { n: 'HR-JD-002: ხ. მ. სამ. აღწ.', c: '§6.1' },
    { n: 'ხ.მ. ≠ ინსპ. ჩამტ. (ერთდ.)', c: '§4.1' },
    { n: 'პ. კვ. ჩ. — CV, სერთ.', c: '§6.1.2' },
    { n: 'ტრ. წლ. გეგმა', c: '§6.1.3' },
    { n: 'QM-01/ORD ვალ.', c: '§4.1.5' },
  ]},
  { id: 'tech', title: '6. ტექ. სფ. და აღჭ.', period: 'annual', items: [
    { n: 'TM-INS-001 სრულია', c: '§6.2' },
    { n: 'ინსპ. მეთ./სტ. ნუსხა', c: '§7.1' },
    { n: 'აღჭ. სია — ინვ., კალ.', c: '§6.2' },
    { n: 'კალ. ვადები — 12 თვ.', c: '§6.2.3' },
    { n: 'გ. სუბ-კ. სია', c: '§6.3' },
  ]},
  { id: 'impart', title: '7. მიუმხრ. და კონფ.', period: 'annual', items: [
    { n: 'მ. დეკლ. — ყ. პ.', c: '§4.1' },
    { n: 'კ. ინტ. რეე.', c: '§4.1' },
    { n: 'კ. შეთ. — ყ. კლ.', c: '§4.2' },
    { n: 'მ. გ. საფ. — 12 თ.', c: '§4.1.4' },
  ]},
  { id: 'records', title: '8. მართვ. ჩანაწ.', period: 'monthly', items: [
    { n: 'შ. აუდ. განრ.', c: '§8.6' },
    { n: 'ბოლო შ. აუდ. ანგ.', c: '§8.6' },
    { n: 'ღია KA სტ./ვადა', c: '§8.8' },
    { n: 'მ.მ. ოქმი — ბოლო', c: '§8.9' },
    { n: 'დ. განახ. რეე.', c: '§8.3' },
    { n: 'კლ. საჩ. რეე.', c: '§7.7' },
  ]},
];

const PERIOD_LABEL = { monthly: 'ყოველთვ.', quarterly: 'კვარტ.', annual: 'წლიური' };
const PERIOD_COLOR = { monthly: '#0F6E56', quarterly: '#185FA5', annual: '#534AB7' };
const PERIOD_BG    = { monthly: '#E1F5EE', quarterly: '#E6F1FB', annual: '#EEEDFE' };
const ST_OPTS = [
  { v: '', l: '— აირჩ.' },
  { v: 'ok',      l: '✅ შესაბ.' },
  { v: 'partial', l: '⚠️ ნაწ.' },
  { v: 'bad',     l: '❌ შეუს.' },
  { v: 'na',      l: '— ნ/გ' },
];

const makeInitState = () => {
  const s = {};
  SECS.forEach(sec => {
    s[sec.id] = { reviewer: 'dir', items: sec.items.map(() => ({ sd: '', sq: '', note: '' })) };
  });
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

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionBlock({ sec, st, onChange, onReviewerChange }) {
  const [open, setOpen] = useState(false);
  const rev = st.reviewer;

  const okCnt  = st.items.filter(i => effSt(i, rev) === 'ok').length;
  const badCnt = st.items.filter(i => effSt(i, rev) === 'bad').length;
  const parCnt = st.items.filter(i => effSt(i, rev) === 'partial').length;
  const badgeColor = badCnt ? '#A32D2D' : parCnt ? '#854F0B' : okCnt === st.items.length ? '#3B6D11' : '#5F5E5A';
  const badgeBg    = badCnt ? '#FCEBEB' : parCnt ? '#FAEEDA' : okCnt === st.items.length ? '#EAF3DE' : '#F1EFE8';

  const isBoth = rev === 'both';

  return (
    <div style={{ marginBottom: 8, border: '0.5px solid #ddd', borderRadius: 10, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '8px 12px', background: '#f8f9fa', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 9, background: PERIOD_BG[sec.period], color: PERIOD_COLOR[sec.period], flexShrink: 0 }}>
          {PERIOD_LABEL[sec.period]}
        </span>
        <span onClick={() => setOpen(o => !o)}
          style={{ flex: 1, fontSize: 12, fontWeight: 500, cursor: 'pointer', userSelect: 'none' }}>
          {sec.title}
        </span>
        <select
          value={rev}
          onChange={e => onReviewerChange(sec.id, e.target.value)}
          style={{ fontSize: 11, padding: '2px 6px', border: '0.5px solid #aaa', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>
          <option value="dir">დირექტორი</option>
          <option value="qm">ხ. მენეჯერი</option>
          <option value="both">ორივე</option>
        </select>
        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: 600, background: badgeBg, color: badgeColor, flexShrink: 0 }}>
          {okCnt}/{st.items.length}
        </span>
        <button onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#888' }}>
          {open ? '▲' : '▼'}
        </button>
      </div>

      {/* Body */}
      {open && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: '#f0f4f8' }}>
                <th style={{ padding: '5px 10px', textAlign: 'left', fontWeight: 500, color: '#555', width: isBoth ? '42%' : '50%' }}>საკ. პუნქტი</th>
                {isBoth ? (
                  <>
                    <th style={{ padding: '5px 10px', color: '#185FA5', fontWeight: 500, width: '20%' }}>დირექტ. სტ.</th>
                    <th style={{ padding: '5px 10px', color: '#3B6D11', fontWeight: 500, width: '20%' }}>ხ.მ. სტ.</th>
                  </>
                ) : (
                  <th style={{ padding: '5px 10px', fontWeight: 500, color: '#555', width: '28%' }}>{rev === 'dir' ? 'დირ.' : 'ხ.მ.'} სტატუსი</th>
                )}
                <th style={{ padding: '5px 10px', fontWeight: 500, color: '#555' }}>შენიშვ.</th>
              </tr>
            </thead>
            <tbody>
              {sec.items.map((it, i) => {
                const rowSt = st.items[i];
                const eff = effSt(rowSt, rev);
                const rowBg = eff === 'bad' ? '#fff5f5' : eff === 'partial' ? '#fffbeb' : eff === 'ok' ? '#f0fdf4' : '#fff';
                return (
                  <tr key={i} style={{ background: rowBg, borderBottom: '0.5px solid #eee' }}>
                    <td style={{ padding: '5px 10px', lineHeight: 1.4 }}>
                      {it.n}
                      <span style={{ display: 'block', fontSize: 9, color: '#999' }}>{it.c}</span>
                    </td>
                    {isBoth ? (
                      <>
                        <td style={{ padding: '4px 8px' }}>
                          <select value={rowSt.sd} onChange={e => onChange(sec.id, i, 'd', e.target.value)}
                            style={{ width: '100%', fontSize: 10, padding: '2px 4px', border: '0.5px solid #ccc', borderRadius: 4, background: '#fff' }}>
                            {ST_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '4px 8px' }}>
                          <select value={rowSt.sq} onChange={e => onChange(sec.id, i, 'q', e.target.value)}
                            style={{ width: '100%', fontSize: 10, padding: '2px 4px', border: '0.5px solid #ccc', borderRadius: 4, background: '#fff' }}>
                            {ST_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                          </select>
                        </td>
                      </>
                    ) : (
                      <td style={{ padding: '4px 8px' }}>
                        <select value={rev === 'dir' ? rowSt.sd : rowSt.sq}
                          onChange={e => onChange(sec.id, i, rev === 'dir' ? 'd' : 'q', e.target.value)}
                          style={{ width: '100%', fontSize: 10, padding: '2px 4px', border: '0.5px solid #ccc', borderRadius: 4, background: '#fff' }}>
                          {ST_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                        </select>
                      </td>
                    )}
                    <td style={{ padding: '4px 8px' }}>
                      <input type="text" value={rowSt.note} placeholder="შ..."
                        onChange={e => onChange(sec.id, i, 'note', e.target.value)}
                        style={{ width: '100%', fontSize: 10, padding: '2px 6px', border: '0.5px solid #ccc', borderRadius: 4 }} />
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

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ChecklistPage({ role }) {
  const [sessions, setSessions]     = useState([]);
  const [view, setView]             = useState('list'); // 'list' | 'new' | 'edit'
  const [activeSession, setActive]  = useState(null);
  const [saving, setSaving]         = useState(false);
  const [msg, setMsg]               = useState(null);

  // Checklist state
  const [chkState, setChkState]     = useState(makeInitState());
  const [chkDate, setChkDate]       = useState(new Date().toISOString().split('T')[0]);
  const [period, setPeriod]         = useState('');
  const [sessionNum, setSessionNum] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [nextDate, setNextDate]     = useState('');
  const [dirSig, setDirSig]         = useState('Levan Sachiashvili');
  const [qmSig, setQmSig]           = useState('Alexandre Sumbadze');

  // AI
  const [aiLoading, setAiLoading]   = useState(false);
  const [aiResult, setAiResult]     = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchSessions = useCallback(async () => {
    try {
      const r = await axios.get('/api/checklists', { headers });
      setSessions(r.data);
    } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  // Summary
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
    setAiResult(''); // clear stale AI result when checklist changes
  };

  const handleReviewerChange = (secId, val) => {
    setChkState(prev => ({ ...prev, [secId]: { ...prev[secId], reviewer: val } }));
  };

  const openNew = () => {
    setChkState(makeInitState());
    setChkDate(new Date().toISOString().split('T')[0]);
    setPeriod(''); setSessionNum(''); setConclusion(''); setNextDate('');
    setDirSig('Levan Sachiashvili'); setQmSig('Alexandre Sumbadze');
    setAiResult(''); setActive(null);
    setView('new');
  };

  const openEdit = async (sess) => {
    try {
      const r = await axios.get(`/api/checklists/${sess._id}`, { headers });
      const s = r.data;
      setChkState(s.state && Object.keys(s.state).length ? s.state : makeInitState());
      setChkDate(s.checkDate ? s.checkDate.split('T')[0] : '');
      setPeriod(s.period || ''); setSessionNum(s.sessionNumber || '');
      setConclusion(s.conclusion || ''); setNextDate(s.nextCheckDate ? s.nextCheckDate.split('T')[0] : '');
      setDirSig(s.directorSig || 'Levan Sachiashvili');
      setQmSig(s.qmSig || 'Alexandre Sumbadze');
      setAiResult(''); setActive(s);
      setView('edit');
    } catch (e) { setMsg({ type: 'danger', text: e.message }); }
  };

  const saveSession = async () => {
    setSaving(true);
    try {
      const payload = {
        state: chkState, checkDate: chkDate, period, sessionNumber: sessionNum,
        conclusion, nextCheckDate: nextDate || null,
        directorSig: dirSig, qmSig,
      };
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
    try {
      await axios.delete(`/api/checklists/${id}`, { headers });
      fetchSessions();
    } catch (e) { setMsg({ type: 'danger', text: e.message }); }
  };

  // Build AI prompt from current state
  const buildPrompt = (who) => {
    const lines = [];
    SECS.forEach(sec => {
      const st = chkState[sec.id];
      const rev = st.reviewer;
      const secLines = [];
      sec.items.forEach((it, i) => {
        const item = st.items[i];
        const parts = [];
        if ((who === 'all' || who === 'dir') && (rev === 'dir' || rev === 'both') && item.sd && item.sd !== 'na')
          parts.push('დ:' + (item.sd === 'ok' ? '✅' : item.sd === 'partial' ? '⚠️' : '❌'));
        if ((who === 'all' || who === 'qm') && (rev === 'qm' || rev === 'both') && item.sq && item.sq !== 'na')
          parts.push('ხ.მ:' + (item.sq === 'ok' ? '✅' : item.sq === 'partial' ? '⚠️' : '❌'));
        if (item.note) parts.push('შენ: ' + item.note);
        if (parts.length) secLines.push('  • ' + it.n + ' [' + it.c + ']: ' + parts.join(' | '));
      });
      if (secLines.length) { lines.push('\n' + sec.title + ':'); lines.push(...secLines); }
    });
    const whoLbl = who === 'dir' ? 'დირექტორის' : who === 'qm' ? 'ხ. მენეჯერის' : 'სრული';
    const report = lines.join('\n');
    if (!report.trim()) {
      return `შენ ხარ ISO/IEC 17020:2012 Type A ექსპერტი. Buildex Expertise — სამშენებლო ინსპექტირების კომპანია საქართველოში, ემზადება GAC/SAAC აკრედიტაციისთვის. ჩეკლისტი ჯერ ცარიელია. მოგვეცი: 3 ყველაზე კრიტიკული GAC-ის შემოწმების სფერო + 1 პრაქტიკული რჩევა სად დაიწყოს. ქართულად, მოკლედ.`;
    }
    return `შენ ხარ ISO/IEC 17020:2012 Type A ექსპერტი. Buildex Expertise ${whoLbl} შემოწმების შედეგები:\n${report}\n\nქართულად, კონკრეტულად:\n1. შეჯამება (2 წინადადება)\n2. კრიტიკული ❌ ხარვეზები + ISO კლაუზი\n3. ⚠️ ყველაზე სარისკო პუნქტები\n4. 3 მთავარი KA პრიორიტეტი\n5. GAC მზადყოფნა 1–10 + 1 წინადადება დასაბუთება`;
  };

  const runAI = async (who) => {
    setAiLoading(true); setAiResult('');
    try {
      const prompt = buildPrompt(who);
      const r = await axios.post('/api/checklist-analyze', { prompt }, { headers });
      setAiResult(r.data.text);
    } catch (e) {
      setAiResult('შეცდომა: ' + (e.response?.data?.error || e.message));
    }
    setAiLoading(false);
  };

  // ── Render list view ───────────────────────────────────────────────────────
  if (view === 'list') {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 0' }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold mb-0" style={{ color: '#003366' }}>📋 შიდა მონიტორინგის ჩეკლისტი</h3>
            <small className="text-muted">ISO/IEC 17020:2012 Type A · GAC/SAAC</small>
          </div>
          {['admin', 'quality_manager'].includes(role) && (
            <button className="btn btn-primary fw-bold" onClick={openNew}>+ ახალი შემოწმება</button>
          )}
        </div>

        {msg && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

        {sessions.length === 0 ? (
          <div className="text-center text-muted py-5">
            <div style={{ fontSize: 40 }}>📋</div>
            <p>შემოწმებები არ არის. შექმენი პირველი!</p>
          </div>
        ) : (
          <div className="card shadow-sm">
            <table className="table table-hover mb-0" style={{ fontSize: '0.85rem' }}>
              <thead style={{ background: '#003366', color: '#fff' }}>
                <tr>
                  <th className="py-2 px-3">№</th>
                  <th className="py-2 px-3">თარიღი</th>
                  <th className="py-2 px-3">პერიოდი</th>
                  <th className="py-2 px-3">შემმოწმ.</th>
                  <th className="py-2 px-3">დასკვნა</th>
                  <th className="py-2 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s._id}>
                    <td className="px-3 fw-bold">{s.sessionNumber}</td>
                    <td className="px-3">{new Date(s.checkDate).toLocaleDateString('ka-GE')}</td>
                    <td className="px-3">{s.period || '—'}</td>
                    <td className="px-3">{s.createdBy}</td>
                    <td className="px-3" style={{ maxWidth: 300 }}>
                      <span style={{ fontSize: '0.78rem' }}>{s.conclusion ? s.conclusion.slice(0, 80) + (s.conclusion.length > 80 ? '...' : '') : '—'}</span>
                    </td>
                    <td className="px-3">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(s)}>✏️ გახსნა</button>
                      {role === 'admin' && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteSession(s._id)}>🗑️</button>
                      )}
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

  // ── Render checklist form (new / edit) ────────────────────────────────────
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 0 60px' }}>
      {/* Top bar */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <button className="btn btn-sm btn-outline-secondary" onClick={() => setView('list')}>← სია</button>
        <h5 className="fw-bold mb-0 ms-2" style={{ color: '#003366' }}>
          📋 {activeSession ? activeSession.sessionNumber : 'ახალი შემოწმება'}
        </h5>
        <div className="ms-auto d-flex gap-2">
          <button className="btn btn-success btn-sm fw-bold" onClick={saveSession} disabled={saving}>
            {saving ? '⏳...' : '💾 შენახვა'}
          </button>
        </div>
      </div>

      {msg && <div className={`alert alert-${msg.type} py-2`} onClick={() => setMsg(null)}>{msg.text}</div>}

      {/* Meta fields */}
      <div className="card shadow-sm mb-3 p-3">
        <div className="row g-2">
          <div className="col-md-3">
            <label className="form-label fw-bold" style={{ fontSize: '0.78rem' }}>თარიღი</label>
            <input type="date" className="form-control form-control-sm" value={chkDate} onChange={e => setChkDate(e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-bold" style={{ fontSize: '0.78rem' }}>ნომერი</label>
            <input className="form-control form-control-sm" value={sessionNum} onChange={e => setSessionNum(e.target.value)} placeholder="MON-2026-001" />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-bold" style={{ fontSize: '0.78rem' }}>პერიოდი</label>
            <input className="form-control form-control-sm" value={period} onChange={e => setPeriod(e.target.value)} placeholder="Q2 2026" />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-bold" style={{ fontSize: '0.78rem' }}>შემდ. შემოწ.</label>
            <input type="date" className="form-control form-control-sm" value={nextDate} onChange={e => setNextDate(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Summary badges */}
      <div className="d-flex gap-2 mb-3">
        {[
          { label: 'შესაბამისი', val: summary.ok,      color: '#3B6D11', bg: '#EAF3DE' },
          { label: 'ნაწილობრივ', val: summary.partial,  color: '#854F0B', bg: '#FAEEDA' },
          { label: 'შეუსაბამო',  val: summary.bad,      color: '#A32D2D', bg: '#FCEBEB' },
          { label: 'შესაბ. %',   val: summary.pct != null ? summary.pct + '%' : '—', color: '#003366', bg: '#e8f0f7' },
        ].map(b => (
          <div key={b.label} style={{ flex: 1, textAlign: 'center', background: b.bg, borderRadius: 8, padding: '8px 4px' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: b.color }}>{b.val}</div>
            <div style={{ fontSize: 10, color: b.color, marginTop: 2 }}>{b.label}</div>
          </div>
        ))}
      </div>

      {/* Sections */}
      {SECS.map(sec => (
        <SectionBlock key={sec.id} sec={sec} st={chkState[sec.id]}
          onChange={handleItemChange} onReviewerChange={handleReviewerChange} />
      ))}

      {/* AI Analysis panel */}
      <div className="card shadow-sm mt-3 p-3">
        <h6 className="fw-bold mb-2" style={{ color: '#003366' }}>🤖 AI ანალიზი — ISO 17020:2012</h6>
        <div className="d-flex gap-2 flex-wrap mb-2">
          <button className="btn btn-primary btn-sm" onClick={() => runAI('all')} disabled={aiLoading}>
            {aiLoading ? '⏳ მიმდინარეობს...' : '✨ სრული ანალიზი'}
          </button>
          <button className="btn btn-outline-primary btn-sm" onClick={() => runAI('dir')} disabled={aiLoading}>👤 დირ. ანალიზი</button>
          <button className="btn btn-outline-success btn-sm" onClick={() => runAI('qm')} disabled={aiLoading}>✅ ხ.მ. ანალიზი</button>
        </div>
        {aiResult && (
          <div style={{ background: '#f8f9fa', border: '0.5px solid #ddd', borderRadius: 8, padding: 12, fontSize: 12, lineHeight: 1.8, whiteSpace: 'pre-wrap', marginTop: 8 }}>
            {aiResult}
          </div>
        )}
      </div>

      {/* Signatures */}
      <div className="card shadow-sm mt-3 p-3">
        <h6 className="fw-bold mb-2">✍️ ხელმოწერები</h6>
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label" style={{ fontSize: '0.78rem' }}>დირექტორი</label>
            <input className="form-control form-control-sm" value={dirSig} onChange={e => setDirSig(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" style={{ fontSize: '0.78rem' }}>ხარისხის მენეჯერი</label>
            <input className="form-control form-control-sm" value={qmSig} onChange={e => setQmSig(e.target.value)} />
          </div>
          <div className="col-12">
            <label className="form-label" style={{ fontSize: '0.78rem' }}>დასკვნა / კომენტარი</label>
            <textarea className="form-control form-control-sm" rows={2} value={conclusion} onChange={e => setConclusion(e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
