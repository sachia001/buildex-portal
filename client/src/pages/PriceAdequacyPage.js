import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { toast, confirmDialog } from '../components/Feedback';
import { pdf } from '@react-pdf/renderer';
import PriceAdequacyReportPdf from '../pdf-components/PriceAdequacyReportPdf';

const STATUS_BADGE = {
    'შესაბამისი':  { bg: '#dcfce7', text: '#15803d' },
    'გაფრთხილება': { bg: '#fef9c3', text: '#b45309' },
    'დარღვევა':    { bg: '#fee2e2', text: '#b91c1c' },
    'ვერ შემოწმდა': { bg: '#f3f4f6', text: '#6b7280' },
    'სამ.პოზ.':    { bg: '#e8f0f7', text: '#003366' },
};

const fmtN = n => n != null ? Number(n).toLocaleString('ka-GE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';
const fmtD = d => d != null ? (d > 0 ? `+${d.toFixed(1)}%` : `${d.toFixed(1)}%`) : '—';

export default function PriceAdequacyPage({ role }) {
    const [inspections, setInspections] = useState([]);
    const [normFiles, setNormFiles] = useState([]);
    const [checks, setChecks] = useState([]);

    const [selectedCase, setSelectedCase] = useState('');
    const [caseData, setCaseData] = useState(null);
    const [normYear, setNormYear] = useState(new Date().getFullYear());
    const [normQuarter, setNormQuarter] = useState(1);
    const [normType, setNormType] = useState('all');
    const [estimateFile, setEstimateFile] = useState(null);
    const [checking, setChecking] = useState(false);
    const [msg, setMsg] = useState(null);

    const [activeCheck, setActiveCheck] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [pdfLoading, setPdfLoading] = useState(false);
    const [view, setView] = useState('list'); // 'list' | 'new' | 'result'

    const loadData = useCallback(async () => {
        try {
            const [inspR, normR, checksR] = await Promise.all([
                axios.get('/api/inspections'),
                axios.get('/api/norms/files'),
                axios.get('/api/price-adequacy'),
            ]);
            setInspections(inspR.data);
            setNormFiles(normR.data);
            setChecks(checksR.data);
        } catch { setMsg({ type: 'danger', text: 'მონაცემების ჩატვირთვა ვერ მოხდა' }); }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const handleCaseChange = async (id) => {
        setSelectedCase(id);
        setCaseData(null);
        if (!id) return;
        try {
            const r = await axios.get(`/api/inspections/${id}`);
            setCaseData(r.data);
        } catch { setMsg({ type: 'danger', text: 'საქმის ჩატვირთვა ვერ მოხდა' }); }
    };

    const handleCheck = async () => {
        if (!estimateFile) return setMsg({ type: 'warning', text: 'ხარჯთაღრიცხვის ფაილი არ არის არჩეული' });
        setChecking(true);
        setMsg(null);
        const fd = new FormData();
        fd.append('file', estimateFile);
        if (selectedCase) {
            fd.append('caseId', selectedCase);
            fd.append('caseNumber', caseData?.inspectionNumber || '');
            fd.append('objectName', caseData?.objectName || '');
        }
        fd.append('normYear', normYear);
        fd.append('normQuarter', normQuarter);
        fd.append('normType', normType);
        try {
            const r = await axios.post('/api/price-adequacy/check', fd);
            setActiveCheck(r.data);
            setView('result');
            loadData();
        } catch (err) {
            setMsg({ type: 'danger', text: err.response?.data?.error || 'შემოწმება ვერ მოხდა' });
        } finally { setChecking(false); }
    };

    const openCheck = async (id) => {
        try {
            const r = await axios.get(`/api/price-adequacy/${id}`);
            setActiveCheck(r.data);
            setView('result');
        } catch { setMsg({ type: 'danger', text: 'ჩატვირთვა ვერ მოხდა' }); }
    };

    const deleteCheck = async (id) => {
        if (!(await confirmDialog('წაშლით შემოწმებას?'))) return;
        try {
            await axios.delete(`/api/price-adequacy/${id}`);
            setChecks(c => c.filter(x => x._id !== id));
            if (activeCheck?._id === id) { setActiveCheck(null); setView('list'); }
        } catch { setMsg({ type: 'danger', text: 'წაშლა ვერ მოხდა' }); }
    };

    const downloadPdf = async () => {
        if (!activeCheck) return;
        setPdfLoading(true);
        try {
            const blob = await pdf(<PriceAdequacyReportPdf data={activeCheck} />).toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `${activeCheck.checkNumber}.pdf`; a.click();
            URL.revokeObjectURL(url);
        } catch (err) { setMsg({ type: 'danger', text: 'PDF გენერაცია ვერ მოხდა: ' + err.message }); }
        finally { setPdfLoading(false); }
    };

    const downloadWord = async () => {
        if (!activeCheck) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/price-adequacy/${activeCheck._id}/word`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });
            const url = URL.createObjectURL(new Blob([res.data], { type: 'application/msword' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = (activeCheck.checkNumber || 'report') + '.doc';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            toast('Word გენერაცია ვერ მოხდა: ' + (err.response?.status === 401 ? 'ავტორიზაცია საჭიროა' : err.message), 'danger');
        }
    };

    const downloadExcel = () => {
        if (!activeCheck) return;
        const rows = (activeCheck.lineItems || []).map(it => ({
            'N': it.lineNum,
            'შიფრი': it.code || '',
            'სამუშაოს დასახელება': it.description || '',
            'განზ.ერთ.': it.unit || '',
            'რაოდ.': it.quantity || '',
            'მასალ. ერთ.ფ.': it.matUnitPrice || '',
            'მასალ. ჯამი': it.matTotal || '',
            'ხელფ. ერთ.ფ.': it.wageUnitPrice || '',
            'ხელფ. ჯამი': it.wageTotal || '',
            'მექ. ერთ.ფ.': it.machUnitPrice || '',
            'მექ. ჯამი': it.machTotal || '',
            'სულ ერთ.ფ. (₾)': it.unitPrice || '',
            'სულ ჯამი (₾)': it.totalPrice || '',
            'ნორმ. ერთ.ფ. (₾)': it.normUnitPrice ?? '',
            'ნორმ. წყარო': it.normSource || '',
            'გადახრა %': it.deviation ?? '',
            'სტატუსი': it.lineStatus || '',
            'ნორმ. კოდი': it.normCode || '',
            'ნორმ. დასახელება': it.normDescription || '',
        }));
        const srcUsed = [...new Set((activeCheck.lineItems || []).filter(r => r.normSource).map(r => r.normSource))];
        const normLabelXlsx = srcUsed.length > 0 ? srcUsed.join(', ') : (activeCheck.normType || 'ყველა');
        const summary = [
            { '#': 'შემოწმება', 'კოდი': activeCheck.checkNumber },
            { '#': 'BE-CASE', 'კოდი': activeCheck.caseNumber || '—' },
            { '#': 'ობიექტი', 'კოდი': activeCheck.objectName || '—' },
            { '#': 'თარიღი', 'კოდი': new Date(activeCheck.checkDate).toLocaleDateString('ka-GE') },
            { '#': 'ნორმ. წყაროები', 'კოდი': normLabelXlsx + (activeCheck.normYear ? ` ${activeCheck.normYear}` : '') + (activeCheck.normQuarter ? ` კვ.${activeCheck.normQuarter}` : '') },
            { '#': 'სულ პოზ.', 'კოდი': activeCheck.totalLines },
            { '#': 'შესაბამ.', 'კოდი': activeCheck.okCount },
            { '#': 'გაფრთხ.', 'კოდი': activeCheck.warningCount },
            { '#': 'დარღვევა', 'კოდი': activeCheck.violationCount },
            { '#': 'ვ.შ.', 'კოდი': activeCheck.unmatchedCount },
            {},
            { '#': 'დასკვნა', 'კოდი': activeCheck.conclusion },
        ];
        const wb = XLSX.utils.book_new();
        const wsInfo = XLSX.utils.json_to_sheet(summary, { skipHeader: true });
        const wsData = XLSX.utils.json_to_sheet(rows);
        // Style header row of data sheet
        XLSX.utils.book_append_sheet(wb, wsInfo, 'შეჯამება');
        XLSX.utils.book_append_sheet(wb, wsData, 'ანალიზი');
        XLSX.writeFile(wb, `${activeCheck.checkNumber}.xlsx`);
    };

    const filteredItems = activeCheck?.lineItems?.filter(it =>
        filterStatus === 'all' || it.lineStatus === filterStatus
    ) || [];

    const normLabel = (c) => {
        const base = c.normType === 'all' ? 'ყველა' : (c.normType || 'ყველა');
        return [base, c.normYear, c.normQuarter ? `კვ.${c.normQuarter}` : null].filter(Boolean).join(' ');
    };

    return (
        <div className="container-fluid py-3" style={{ maxWidth: 1400 }}>
            <div className="d-flex align-items-center gap-3 mb-4">
                <h4 className="fw-bold mb-0" style={{ color: '#003366' }}>💰 ფასწარმოქმნის ადეკვატურობა</h4>
                <div className="ms-auto d-flex gap-2">
                    <button className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('list')}>
                        📋 შემოწმებების სია
                    </button>
                    <button className={`btn btn-sm ${view === 'new' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setView('new')}>
                        ➕ ახალი შემოწმება
                    </button>
                    {view === 'result' && activeCheck && (
                        <button className="btn btn-sm btn-outline-info" disabled>
                            📄 {activeCheck.checkNumber}
                        </button>
                    )}
                </div>
            </div>

            {msg && <div className={`alert alert-${msg.type} alert-dismissible`} role="alert">
                {msg.text}
                <button type="button" className="btn-close" onClick={() => setMsg(null)} />
            </div>}

            {/* ── NEW CHECK FORM ── */}
            {view === 'new' && (
                <div className="row g-4">
                    <div className="col-md-5">
                        <div className="card shadow-sm h-100">
                            <div className="card-header fw-bold" style={{ background: '#003366', color: '#fff' }}>
                                1. საქმის და ხარჯთაღრიცხვის შეყვანა
                            </div>
                            <div className="card-body">
                                <label className="form-label fw-bold small">BE-CASE № (სურვილისამებრ)</label>
                                <select className="form-select form-select-sm mb-3" value={selectedCase} onChange={e => handleCaseChange(e.target.value)}>
                                    <option value="">— ყველა საქმე —</option>
                                    {inspections.map(i => (
                                        <option key={i._id} value={i._id}>
                                            {i.inspectionNumber} — {i.objectName?.substring(0, 50)}
                                        </option>
                                    ))}
                                </select>

                                {caseData && (
                                    <div className="p-2 mb-3 rounded" style={{ background: '#e8f0f7', fontSize: '0.8rem' }}>
                                        <div><strong>ობიექტი:</strong> {caseData.objectName}</div>
                                        <div><strong>მისამართი:</strong> {caseData.objectAddress}</div>
                                        <div><strong>კლიენტი:</strong> {caseData.clientName}</div>
                                        {caseData.documents && Object.keys(caseData.documents).length > 0 && (
                                            <div className="mt-2">
                                                <strong>ატვირთული დოკ.:</strong>
                                                <div className="d-flex flex-wrap gap-1 mt-1">
                                                    {Object.entries(caseData.documents).map(([k, v]) => (
                                                        <a key={k} href={`/${v}`} target="_blank" rel="noreferrer"
                                                            className="badge bg-primary text-decoration-none">{k}</a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <label className="form-label fw-bold small">ხარჯთაღრიცხვის ფაილი (.xlsx / .xls) *</label>
                                <input type="file" className="form-control form-control-sm mb-1"
                                    accept=".xlsx,.xls,.xlsm"
                                    onChange={e => setEstimateFile(e.target.files[0])} />
                                <div className="text-muted small mb-3">
                                    ფაილი ავტომატურად დამუშავდება: კოდი, დასახელება, ერთ., რაოდ., ფასი
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-header fw-bold" style={{ background: '#003366', color: '#fff' }}>
                                2. ნორმატიული ბაზა
                            </div>
                            <div className="card-body">
                                <label className="form-label fw-bold small">ნორმის სახეობა</label>
                                <select className="form-select form-select-sm mb-2" value={normType} onChange={e => setNormType(e.target.value)}>
                                    {['all', 'NER', 'მშენ. კავშირი', 'SNIP', 'SNiP', 'SHNEB', 'სხვა'].map(t => <option key={t} value={t}>{t === 'all' ? '✅ ყველა ნორმ-ბაზა' : t}</option>)}
                                </select>

                                <div className="row g-2 mb-3">
                                    <div className="col">
                                        <label className="form-label fw-bold small">წელი</label>
                                        <select className="form-select form-select-sm" value={normYear} onChange={e => setNormYear(Number(e.target.value))}>
                                            {[2023, 2024, 2025, 2026, 2027].map(y => <option key={y}>{y}</option>)}
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label className="form-label fw-bold small">კვარტალი</label>
                                        <select className="form-select form-select-sm" value={normQuarter} onChange={e => setNormQuarter(Number(e.target.value))}>
                                            {[1, 2, 3, 4].map(q => <option key={q} value={q}>{q}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {normFiles.length === 0
                                    ? <div className="alert alert-warning small p-2">⚠️ ნორმ-ბაზა ცარიელია. გთხოვთ ჯერ ჩატვირთოთ NER Excel ფაილი «ნორმ-ბაზა» გვერდზე.</div>
                                    : (
                                        <div className="p-2 rounded" style={{ background: '#f0f4f8', fontSize: '0.78rem' }}>
                                            <strong>ხელმისაწვდომი ნორმ-ფაილები:</strong>
                                            {normFiles.filter(f => normType === 'all' || f.normType === normType).map(f => (
                                                <div key={f._id} className="mt-1">
                                                    • {f.normType} {f.year}/კვ.{f.quarter} — <span className="text-muted">{f.entryCount} ჩანაწ.</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                <div className="mt-3 p-2 rounded" style={{ background: '#fff8e1', fontSize: '0.75rem' }}>
                                    <strong>შემოწმების ზღვრები:</strong><br />
                                    🟢 ≤5% — შესაბამისი<br />
                                    🟡 5–15% — გაფრთხილება<br />
                                    🔴 &gt;15% — დარღვევა (ISO 17020 §7.3)
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 d-flex flex-column justify-content-center">
                        <button
                            className="btn btn-lg fw-bold w-100 mb-3"
                            style={{ background: '#003366', color: '#fff', padding: '1rem' }}
                            onClick={handleCheck}
                            disabled={checking || !estimateFile}
                        >
                            {checking
                                ? <><span className="spinner-border spinner-border-sm me-2" />შემოწმება...</>
                                : '🔍 შემოწმება'}
                        </button>
                        <div className="text-center text-muted small">
                            სისტემა ავტომატურად:<br />
                            1. გაარჩევს ხარჯთაღრ. Excel-ს<br />
                            2. შეადარებს ყველა ნორმ-ბაზას<br />
                            3. გამოთვლის გადახრებს<br />
                            4. შექმნის ანგარიშს
                        </div>
                    </div>
                </div>
            )}

            {/* ── CHECKS LIST ── */}
            {view === 'list' && (
                <div className="card shadow-sm">
                    <div className="card-header fw-bold d-flex justify-content-between align-items-center" style={{ background: '#003366', color: '#fff' }}>
                        <span>📋 შემოწმებების სია</span>
                        <span className="badge bg-light text-dark">{checks.length}</span>
                    </div>
                    <div className="card-body p-0">
                        {checks.length === 0
                            ? <div className="text-center p-5 text-muted">
                                <div style={{ fontSize: '3rem' }}>💰</div>
                                <div>შემოწმებები ჯერ არ ჩატარებულა</div>
                                <button className="btn btn-primary mt-3" onClick={() => setView('new')}>➕ ახალი შემოწმება</button>
                            </div>
                            : (
                                <table className="table table-hover mb-0">
                                    <thead style={{ background: '#f0f4f8' }}>
                                        <tr>
                                            <th>შემ. №</th>
                                            <th>BE-CASE</th>
                                            <th>ობიექტი</th>
                                            <th>თარიღი</th>
                                            <th>ნორმ.ბ.</th>
                                            <th>სულ</th>
                                            <th>შეს.</th>
                                            <th>გაფ.</th>
                                            <th>დარ.</th>
                                            <th>ვ.შ.</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {checks.map(c => (
                                            <tr key={c._id} style={{ cursor: 'pointer' }} onClick={() => openCheck(c._id)}>
                                                <td className="fw-bold small">{c.checkNumber}</td>
                                                <td className="small">{c.caseNumber || '—'}</td>
                                                <td className="small" style={{ maxWidth: 180 }}>{c.objectName || '—'}</td>
                                                <td className="small">{new Date(c.checkDate).toLocaleDateString('ka-GE')}</td>
                                                <td className="small"><span className="badge" style={{ background: '#003366' }}>{normLabel(c)}</span></td>
                                                <td className="small">{c.totalLines}</td>
                                                <td><span className="badge" style={{ background: '#dcfce7', color: '#15803d' }}>{c.okCount}</span></td>
                                                <td><span className="badge" style={{ background: '#fef9c3', color: '#b45309' }}>{c.warningCount}</span></td>
                                                <td><span className="badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>{c.violationCount}</span></td>
                                                <td><span className="badge bg-secondary">{c.unmatchedCount}</span></td>
                                                <td onClick={e => e.stopPropagation()}>
                                                    {role === 'admin' && (
                                                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteCheck(c._id)}>🗑️</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                    </div>
                </div>
            )}

            {/* ── RESULT VIEW ── */}
            {view === 'result' && activeCheck && (
                <div>
                    {/* Header */}
                    <div className="card shadow-sm mb-3" style={{ borderLeft: '4px solid #003366' }}>
                        <div className="card-body">
                            <div className="row g-3 align-items-center">
                                <div className="col-md-8">
                                    <h5 className="mb-1 fw-bold" style={{ color: '#003366' }}>
                                        {activeCheck.checkNumber}
                                        {activeCheck.violationCount > 0
                                            ? <span className="badge ms-2" style={{ background: '#fee2e2', color: '#b91c1c' }}>⚠️ {activeCheck.violationCount} დარღვევა</span>
                                            : activeCheck.warningCount > 0
                                                ? <span className="badge ms-2" style={{ background: '#fef9c3', color: '#b45309' }}>⚠️ {activeCheck.warningCount} გაფრთხილება</span>
                                                : <span className="badge ms-2" style={{ background: '#dcfce7', color: '#15803d' }}>✅ შესაბამისი</span>}
                                    </h5>
                                    <div className="small text-muted">
                                        {activeCheck.caseNumber && <span className="me-3">📂 {activeCheck.caseNumber}</span>}
                                        {activeCheck.objectName && <span className="me-3">🏗️ {activeCheck.objectName}</span>}
                                        <span className="me-3">📅 {new Date(activeCheck.checkDate).toLocaleDateString('ka-GE')}</span>
                                        <span>👤 {activeCheck.checkedBy}</span>
                                    </div>
                                </div>
                                <div className="col-md-4 d-flex gap-2 justify-content-end flex-wrap">
                                    <button className="btn btn-outline-secondary btn-sm" onClick={() => setView('list')}>← სია</button>
                                    <button className="btn btn-outline-success btn-sm" onClick={() => setView('new')}>➕ ახალი</button>
                                    <button className="btn btn-danger btn-sm" onClick={downloadPdf} disabled={pdfLoading}>
                                        {pdfLoading ? <span className="spinner-border spinner-border-sm" /> : '📄 PDF'}
                                    </button>
                                    <button className="btn btn-success btn-sm" onClick={downloadExcel}>📊 Excel</button>
                                    <button className="btn btn-primary btn-sm" onClick={downloadWord}>📝 Word</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary cards */}
                    <div className="row g-3 mb-3">
                        {[
                            { label: 'სულ პოზ.', val: activeCheck.totalLines, bg: '#e8f0f7', text: '#003366' },
                            { label: 'შემოწმდა', val: activeCheck.matchedLines, bg: '#dbeafe', text: '#1d4ed8' },
                            { label: 'შესაბამ.', val: activeCheck.okCount, bg: '#dcfce7', text: '#15803d' },
                            { label: 'გაფ. (5–15%)', val: activeCheck.warningCount, bg: '#fef9c3', text: '#b45309' },
                            { label: 'დარღვ. (>15%)', val: activeCheck.violationCount, bg: '#fee2e2', text: '#b91c1c' },
                            { label: 'ვ.შ.', val: activeCheck.unmatchedCount, bg: '#f3f4f6', text: '#6b7280' },
                        ].map(({ label, val, bg, text }) => (
                            <div className="col" key={label}>
                                <div className="card text-center h-100" style={{ background: bg, border: 'none' }}>
                                    <div className="card-body py-2">
                                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: text }}>{val}</div>
                                        <div className="small" style={{ color: text }}>{label}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Conclusion */}
                    <div className="alert mb-3" style={{ background: '#e8f0f7', border: '1px solid #003366', borderRadius: 6 }}>
                        <strong>📋 დასკვნა:</strong> {activeCheck.conclusion}
                    </div>

                    {/* Line items table */}
                    <div className="card shadow-sm">
                        <div className="card-header d-flex align-items-center gap-2" style={{ background: '#003366', color: '#fff' }}>
                            <span className="fw-bold">ხარჯთაღრიცხვის ანალიზი</span>
                            <div className="ms-auto d-flex gap-1 flex-wrap">
                                {['all', 'შესაბამისი', 'გაფრთხილება', 'დარღვევა', 'ვერ შემოწმდა', 'სამ.პოზ.'].map(s => (
                                    <button key={s} className="btn btn-sm"
                                        style={{
                                            background: filterStatus === s ? '#fff' : 'transparent',
                                            color: filterStatus === s ? '#003366' : 'rgba(255,255,255,0.8)',
                                            border: '1px solid rgba(255,255,255,0.4)',
                                            fontSize: '0.75rem',
                                        }}
                                        onClick={() => setFilterStatus(s)}>
                                        {s === 'all' ? 'ყველა' : s} {s === 'all' ? `(${activeCheck.lineItems?.length})` : `(${activeCheck.lineItems?.filter(i => i.lineStatus === s).length})`}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="card-body p-0" style={{ overflowX: 'auto' }}>
                            <table className="table table-sm mb-0" style={{ minWidth: 1300, fontSize: '0.78rem' }}>
                                <thead style={{ background: '#f0f4f8', position: 'sticky', top: 0 }}>
                                    <tr>
                                        <th rowSpan={2} style={{ width: 36, verticalAlign: 'middle' }}>#</th>
                                        <th rowSpan={2} style={{ width: 72, verticalAlign: 'middle' }}>შიფრი</th>
                                        <th rowSpan={2} style={{ verticalAlign: 'middle' }}>სამუშაოს დასახელება</th>
                                        <th rowSpan={2} style={{ width: 42, verticalAlign: 'middle' }}>ერთ.</th>
                                        <th rowSpan={2} style={{ width: 50, verticalAlign: 'middle' }}>რაოდ.</th>
                                        <th colSpan={2} style={{ textAlign: 'center', borderLeft: '2px solid #ddd' }}>მასალები (₾)</th>
                                        <th colSpan={2} style={{ textAlign: 'center', borderLeft: '1px solid #ddd' }}>ხელფასი (₾)</th>
                                        <th colSpan={2} style={{ textAlign: 'center', borderLeft: '1px solid #ddd' }}>მშენ.მექ. (₾)</th>
                                        <th rowSpan={2} style={{ width: 75, verticalAlign: 'middle', borderLeft: '2px solid #ddd' }}>სულ ერთ.ფ.</th>
                                        <th rowSpan={2} style={{ width: 75, verticalAlign: 'middle' }}>ნორმ. ₾</th>
                                        <th rowSpan={2} style={{ width: 68, verticalAlign: 'middle' }}>ნ.წყარო</th>
                                        <th rowSpan={2} style={{ width: 62, verticalAlign: 'middle' }}>გადახ.%</th>
                                        <th rowSpan={2} style={{ width: 95, verticalAlign: 'middle' }}>სტატუსი</th>
                                    </tr>
                                    <tr>
                                        <th style={{ width: 68, borderLeft: '2px solid #ddd', fontWeight: 'normal', fontSize: '0.7rem' }}>ერთ.ფ.</th>
                                        <th style={{ width: 68, fontWeight: 'normal', fontSize: '0.7rem' }}>ჯამი</th>
                                        <th style={{ width: 68, borderLeft: '1px solid #ddd', fontWeight: 'normal', fontSize: '0.7rem' }}>ერთ.ფ.</th>
                                        <th style={{ width: 68, fontWeight: 'normal', fontSize: '0.7rem' }}>ჯამი</th>
                                        <th style={{ width: 68, borderLeft: '1px solid #ddd', fontWeight: 'normal', fontSize: '0.7rem' }}>ერთ.ფ.</th>
                                        <th style={{ width: 68, fontWeight: 'normal', fontSize: '0.7rem' }}>ჯამი</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.length === 0
                                        ? <tr><td colSpan={16} className="text-center text-muted py-4">შედეგები ვერ მოიძებნა</td></tr>
                                        : filteredItems.map((it, i) => {
                                            const sc = STATUS_BADGE[it.lineStatus] || STATUS_BADGE['ვერ შემოწმდა'];
                                            const devAbs = it.deviation != null ? Math.abs(it.deviation) : 0;
                                            const hasComponents = it.matUnitPrice || it.wageUnitPrice || it.machUnitPrice;
                                            return (
                                                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                                                    <td>{it.lineNum}</td>
                                                    <td className="text-muted" style={{ fontSize: '0.72rem' }}>{it.code || ''}</td>
                                                    <td>
                                                        <div>{it.description}</div>
                                                        {it.normDescription && it.normDescription !== it.description && (
                                                            <div className="text-muted" style={{ fontSize: '0.68rem' }}>
                                                                ≈ {it.normDescription.substring(0, 70)}{it.normDescription.length > 70 ? '…' : ''}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>{it.unit || ''}</td>
                                                    <td>{it.quantity || ''}</td>
                                                    {/* მასალები */}
                                                    <td style={{ borderLeft: '2px solid #ddd' }}>{hasComponents ? fmtN(it.matUnitPrice) : '—'}</td>
                                                    <td className="text-muted">{hasComponents ? fmtN(it.matTotal) : '—'}</td>
                                                    {/* ხელფასი */}
                                                    <td style={{ borderLeft: '1px solid #ddd' }}>{hasComponents ? fmtN(it.wageUnitPrice) : '—'}</td>
                                                    <td className="text-muted">{hasComponents ? fmtN(it.wageTotal) : '—'}</td>
                                                    {/* მექ. */}
                                                    <td style={{ borderLeft: '1px solid #ddd' }}>{hasComponents ? fmtN(it.machUnitPrice) : '—'}</td>
                                                    <td className="text-muted">{hasComponents ? fmtN(it.machTotal) : '—'}</td>
                                                    {/* სულ + ნორმ + გადახ + სტატ */}
                                                    <td className="fw-bold" style={{ borderLeft: '2px solid #ddd' }}>{fmtN(it.unitPrice)}</td>
                                                    <td>{fmtN(it.normUnitPrice)}</td>
                                                    <td>
                                                        {it.normSource
                                                            ? <span className="badge" style={{ background: '#e8f0f7', color: '#003366', fontSize: '0.65rem' }}>{it.normSource}</span>
                                                            : <span className="text-muted">—</span>}
                                                    </td>
                                                    <td>
                                                        <span style={{ fontWeight: 'bold', color: devAbs > 15 ? '#b91c1c' : devAbs > 5 ? '#b45309' : '#15803d' }}>
                                                            {fmtD(it.deviation)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="badge" style={{ background: sc.bg, color: sc.text, fontSize: '0.7rem' }}>
                                                            {it.lineStatus}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
