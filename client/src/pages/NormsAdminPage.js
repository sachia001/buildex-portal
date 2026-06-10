import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { confirmDialog } from '../components/Feedback';

const NORM_TYPES = ['NER', 'მშენ. კავშირი', 'SNIP', 'SNiP', 'SHNEB', 'სხვა'];

export default function NormsAdminPage({ role }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchNormFileId, setSearchNormFileId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [entries, setEntries] = useState([]);
    const [entTotal, setEntTotal] = useState(0);
    const [entPage, setEntPage] = useState(1);
    const [form, setForm] = useState({ normType: 'NER', year: new Date().getFullYear(), quarter: 2 });
    const [file, setFile] = useState(null);
    const [msg, setMsg] = useState(null);
    const [seeding, setSeeding] = useState(false);

    const canUpload = ['admin', 'quality_manager'].includes(role);

    useEffect(() => { loadFiles(); }, []);

    const loadFiles = async () => {
        setLoading(true);
        try { const r = await axios.get('/api/norms/files'); setFiles(r.data); }
        catch { setMsg({ type: 'danger', text: 'ფაილების ჩატვირთვა ვერ მოხდა' }); }
        finally { setLoading(false); }
    };

    const handleSeedDemo = async () => {
        if (!(await confirmDialog(`ჩაიტვირთოს საცდელი NER ბაზა ${form.year} კვ.${form.quarter}?`))) return;
        setSeeding(true); setMsg(null);
        try {
            const r = await axios.post('/api/norms/seed-demo', { year: form.year, quarter: form.quarter, normType: form.normType });
            setMsg({ type: 'success', text: `✅ საცდელი NER ბაზა: ${r.data.entryCount} ჩანაწ. — ${r.data.normFile.originalName}` });
            loadFiles();
        } catch (err) {
            setMsg({ type: 'danger', text: err.response?.data?.error || 'შეცდომა' });
        } finally { setSeeding(false); }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return setMsg({ type: 'warning', text: 'გთხოვთ აირჩიოთ ფაილი' });
        setUploading(true);
        setMsg(null);
        const fd = new FormData();
        fd.append('file', file);
        fd.append('normType', form.normType);
        fd.append('year', form.year);
        fd.append('quarter', form.quarter);
        try {
            const r = await axios.post('/api/norms/upload', fd);
            setMsg({ type: 'success', text: `✅ ჩაიტვირთა ${r.data.entryCount} ნორმა — ${r.data.normFile.originalName}` });
            setFile(null);
            loadFiles();
        } catch (err) {
            setMsg({ type: 'danger', text: err.response?.data?.error || 'შეცდომა ატვირთვისას' });
        } finally { setUploading(false); }
    };

    const handleDelete = async (id) => {
        if (!(await confirmDialog('ნამდვილად წაშლით ნორმ-ფაილს და მის ყველა ჩანაწერს?'))) return;
        try {
            await axios.delete(`/api/norms/files/${id}`);
            setFiles(f => f.filter(x => x._id !== id));
            setMsg({ type: 'success', text: 'ფაილი წაიშალა' });
        } catch { setMsg({ type: 'danger', text: 'წაშლა ვერ მოხდა' }); }
    };

    const loadEntries = async (normFileId, search, page) => {
        const params = { limit: 50, page };
        if (normFileId) params.normFileId = normFileId;
        if (search) params.search = search;
        try {
            const r = await axios.get('/api/norms/entries', { params });
            setEntries(r.data.entries);
            setEntTotal(r.data.total);
        } catch { setMsg({ type: 'danger', text: 'ჩანაწერების ჩატვირთვა ვერ მოხდა' }); }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setEntPage(1);
        loadEntries(searchNormFileId, searchQuery, 1);
    };

    return (
        <div className="container-fluid py-4" style={{ maxWidth: 1200 }}>
            <h4 className="fw-bold mb-4" style={{ color: '#003366' }}>🗂️ ნორმატიული ბაზის მართვა (NER / SNIP)</h4>

            {msg && <div className={`alert alert-${msg.type} alert-dismissible`} role="alert">
                {msg.text}
                <button type="button" className="btn-close" onClick={() => setMsg(null)} />
            </div>}

            <div className="row g-4">
                {/* Upload panel */}
                {canUpload && (
                    <div className="col-md-4">
                        <div className="card shadow-sm">
                            <div className="card-header fw-bold" style={{ background: '#003366', color: '#fff' }}>
                                📤 ნორმ-ფაილის ატვირთვა (Excel)
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleUpload}>
                                    <div className="mb-2">
                                        <label className="form-label fw-bold small">ნორმის სახეობა</label>
                                        <select className="form-select form-select-sm" value={form.normType}
                                            onChange={e => setForm(f => ({ ...f, normType: e.target.value }))}>
                                            {NORM_TYPES.map(t => <option key={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="row g-2 mb-2">
                                        <div className="col">
                                            <label className="form-label fw-bold small">წელი</label>
                                            <input type="number" className="form-control form-control-sm" value={form.year}
                                                min={2020} max={2035}
                                                onChange={e => setForm(f => ({ ...f, year: e.target.value }))} />
                                        </div>
                                        <div className="col">
                                            <label className="form-label fw-bold small">კვარტალი</label>
                                            <select className="form-select form-select-sm" value={form.quarter}
                                                onChange={e => setForm(f => ({ ...f, quarter: e.target.value }))}>
                                                {[1, 2, 3, 4].map(q => <option key={q} value={q}>{q}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small">Excel ფაილი (.xlsx / .xls)</label>
                                        <input type="file" className="form-control form-control-sm"
                                            accept=".xlsx,.xls,.xlsm"
                                            onChange={e => setFile(e.target.files[0])} />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-sm w-100" disabled={uploading}>
                                        {uploading ? '⏳ ტვირთავს...' : '📤 Excel-ის ატვირთვა'}
                                    </button>
                                </form>

                                <hr />
                                <div className="mb-2 small fw-bold text-muted">ან ჩაიტვირთოს სადემო NER ბაზა:</div>
                                <button
                                    className="btn btn-outline-warning btn-sm w-100"
                                    onClick={handleSeedDemo}
                                    disabled={seeding}
                                >
                                    {seeding ? '⏳ ...' : `🧪 საცდელი NER — ${form.year} კვ.${form.quarter}`}
                                </button>
                                <div className="mt-1 text-muted" style={{ fontSize: '0.7rem' }}>
                                    ~80 ტიპური ქართული სამუშაო (ბეტ., ქვა, სანტ., ელ., ფინ.) — 2025 საბაზრო ფასებით
                                </div>

                                <div className="mt-3 p-2 rounded" style={{ background: '#f8f9fa', fontSize: '0.75rem', color: '#555' }}>
                                    <strong>Excel სტრუქტურა:</strong><br />
                                    სვეტები: კოდი | დასახელება | ერთეული | ერთ.ფასი<br />
                                    <span className="text-muted">სათაური სტრიქონი ავტომატურად მოიძებნება</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Files list */}
                <div className={canUpload ? 'col-md-8' : 'col-12'}>
                    <div className="card shadow-sm">
                        <div className="card-header fw-bold" style={{ background: '#003366', color: '#fff' }}>
                            📋 ჩატვირთული ნორმ-ფაილები
                        </div>
                        <div className="card-body p-0">
                            {loading ? <div className="text-center p-4"><span className="spinner-border spinner-border-sm" /></div>
                                : files.length === 0
                                    ? <div className="text-center p-4 text-muted">ნორმ-ფაილები არ არის ჩატვირთული</div>
                                    : (
                                        <table className="table table-hover table-sm mb-0">
                                            <thead style={{ background: '#f0f4f8' }}>
                                                <tr>
                                                    <th>ფაილი</th>
                                                    <th>სახეობა</th>
                                                    <th>წელი / კვ.</th>
                                                    <th>ჩანაწ.</th>
                                                    <th>ატვირთვა</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {files.map(f => (
                                                    <tr key={f._id}>
                                                        <td style={{ maxWidth: 250 }} className="text-truncate">{f.originalName}</td>
                                                        <td><span className="badge" style={{ background: '#003366' }}>{f.normType}</span></td>
                                                        <td>{f.year} / {f.quarter}</td>
                                                        <td><span className="badge bg-secondary">{f.entryCount}</span></td>
                                                        <td className="small text-muted">{new Date(f.createdAt).toLocaleDateString('ka-GE')}</td>
                                                        <td>
                                                            <button className="btn btn-outline-primary btn-sm me-1" title="ჩანაწ. ნახვა"
                                                                onClick={() => { setSearchNormFileId(f._id); setEntPage(1); loadEntries(f._id, searchQuery, 1); }}>
                                                                🔍
                                                            </button>
                                                            {role === 'admin' && (
                                                                <button className="btn btn-outline-danger btn-sm" title="წაშლა"
                                                                    onClick={() => handleDelete(f._id)}>🗑️</button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                        </div>
                    </div>

                    {/* Entry search */}
                    {(entries.length > 0 || searchNormFileId) && (
                        <div className="card shadow-sm mt-3">
                            <div className="card-header fw-bold" style={{ background: '#003366', color: '#fff' }}>
                                🔍 ნორმ-ჩანაწერების ძიება
                            </div>
                            <div className="card-body">
                                <form className="d-flex gap-2 mb-3" onSubmit={handleSearch}>
                                    <input className="form-control form-control-sm" placeholder="კოდი ან დასახელება..."
                                        value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                                    <button className="btn btn-primary btn-sm" type="submit">ძიება</button>
                                    <button className="btn btn-outline-secondary btn-sm" type="button"
                                        onClick={() => { setSearchQuery(''); setEntries([]); setSearchNormFileId(''); }}>გასუფთ.</button>
                                </form>
                                <div className="small text-muted mb-2">სულ: {entTotal} ჩანაწერი</div>
                                {entries.length > 0 && (
                                    <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                                        <table className="table table-sm table-hover">
                                            <thead style={{ background: '#f0f4f8', position: 'sticky', top: 0 }}>
                                                <tr>
                                                    <th>კოდი</th>
                                                    <th>დასახელება</th>
                                                    <th>ერთ.</th>
                                                    <th>ერთ.ფ. (₾)</th>
                                                    <th>თავი</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {entries.map((e, i) => (
                                                    <tr key={i}>
                                                        <td className="small">{e.code}</td>
                                                        <td className="small">{e.description}</td>
                                                        <td className="small">{e.unit}</td>
                                                        <td className="small fw-bold">{Number(e.unitPrice).toFixed(2)}</td>
                                                        <td className="small text-muted" style={{ maxWidth: 150 }} title={e.chapter}>{e.chapter?.substring(0, 40)}{e.chapter?.length > 40 ? '…' : ''}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {entTotal > 50 && (
                                    <div className="d-flex gap-2 mt-2">
                                        <button className="btn btn-sm btn-outline-secondary" disabled={entPage === 1}
                                            onClick={() => { const p = entPage - 1; setEntPage(p); loadEntries(searchNormFileId, searchQuery, p); }}>← წინა</button>
                                        <span className="small my-auto">გვ. {entPage}</span>
                                        <button className="btn btn-sm btn-outline-secondary" disabled={entries.length < 50}
                                            onClick={() => { const p = entPage + 1; setEntPage(p); loadEntries(searchNormFileId, searchQuery, p); }}>შემდეგი →</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
