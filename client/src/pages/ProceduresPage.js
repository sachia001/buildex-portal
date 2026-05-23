import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Row, Col, Card, Button, Badge, Modal, Form } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Link } from 'react-router-dom';

// ── All existing PDF forms ──────────────────────────────────────────────────
import BlankLetterhead             from '../pdf-components/BlankLetterhead';
import BlankApplicationForm        from '../pdf-components/BlankApplicationForm';
import ImpartialityDeclarationPdf  from '../pdf-components/ImpartialityDeclarationPdf';
import ConfidentialityAgreementPdf from '../pdf-components/ConfidentialityAgreementPdf';
import FM04_InternalAuditPdf       from '../pdf-components/FM04_InternalAuditPdf';
import FM06_ComplaintAppealPdf     from '../pdf-components/FM06_ComplaintAppealPdf';
import FM07_EquipmentVerificationPdf from '../pdf-components/FM07_EquipmentVerificationPdf';
import FM08_CompetencyAssessmentPdf  from '../pdf-components/FM08_CompetencyAssessmentPdf';
import FM09_ContractReviewPdf      from '../pdf-components/FM09_ContractReviewPdf';
import FM10_CAPAFormPdf            from '../pdf-components/FM10_CAPAFormPdf';
import FM11_InspectionPlanPdf      from '../pdf-components/FM11_InspectionPlanPdf';
import FM12_SubcontractorPdf       from '../pdf-components/FM12_SubcontractorPdf';
import FM13_TrainingRecordNewPdf   from '../pdf-components/FM13_TrainingRecordNewPdf';
import FM14_NonConformingPdf       from '../pdf-components/FM14_NonConformingPdf';
import FM15_MgmtReviewPdf          from '../pdf-components/FM15_MgmtReviewPdf';
import FM16_VisitRecordPdf         from '../pdf-components/FM16_VisitRecordPdf';
import FM21_InspectionRegisterPdf  from '../pdf-components/FM21_InspectionRegisterPdf';
import FM22_FamiliarizationPdf     from '../pdf-components/FM22_FamiliarizationPdf';
import FM23_DocChangePdf           from '../pdf-components/FM23_DocChangePdf';
import FM24_ChangeRegisterPdf      from '../pdf-components/FM24_ChangeRegisterPdf';
import FM25_LiquidationActPdf      from '../pdf-components/FM25_LiquidationActPdf';
import FormFillModal               from '../components/FormFillModal';
import { FORM_CONFIGS }            from '../components/formConfigs';

// ── Default procedure metadata (shown before any upload) ─────────────────────
const PROCEDURE_META = [
  { code: 'QM-01',       title: 'ხარისხის სახელმძღვანელო',                    category: 'manual',    icon: '📖', color: '#003366' },
  { code: 'BE-PR-SET',   title: 'პროცედურების სარჩევი (ინდექსი)',              category: 'index',     icon: '📑', color: '#6f42c1' },
  { code: 'BE-PR-01',    title: 'განცხადებათა მიღება და კლიენტთა ხელშ.',      category: 'procedure', icon: '📋', color: '#0d6efd' },
  { code: 'BE-PR-02',    title: 'სახელშეკრულებო მოთხოვნათა შეთანხმება',       category: 'procedure', icon: '🤝', color: '#0d6efd' },
  { code: 'BE-PR-03',    title: 'ინსპექტირების დაგეგმვა',                     category: 'procedure', icon: '🗺️', color: '#0d6efd' },
  { code: 'BE-PR-04',    title: 'ინსპექტირების ჩატარება',                     category: 'procedure', icon: '🔍', color: '#0d6efd' },
  { code: 'BE-PR-05',    title: 'შედეგების გაფორმება',                         category: 'procedure', icon: '📊', color: '#0d6efd' },
  { code: 'BE-PR-06',    title: 'ინსპექციის ანგარიშის გაცემა',               category: 'procedure', icon: '📤', color: '#0d6efd' },
  { code: 'BE-PR-07',    title: 'საჩივრებისა და აპელაციების განხილვა',         category: 'procedure', icon: '📣', color: '#dc3545' },
  { code: 'BE-PR-08',    title: 'შეუსაბამო სამუშაოს მართვა',                  category: 'procedure', icon: '🚫', color: '#dc3545' },
  { code: 'BE-PR-09',    title: 'კორექტირებითი ქმედებები (CAPA)',             category: 'procedure', icon: '⚙️', color: '#dc3545' },
  { code: 'BE-PR-10',    title: 'შიდა აუდიტი',                               category: 'procedure', icon: '🔎', color: '#dc3545' },
  { code: 'BE-PR-11',    title: 'მართვის ანალიზი',                            category: 'procedure', icon: '📈', color: '#dc3545' },
  { code: 'BE-PR-12',    title: 'დოკუმენტების მართვა',                        category: 'procedure', icon: '🗂️', color: '#6f42c1' },
  { code: 'BE-PR-13',    title: 'ჩანაწერების მართვა',                         category: 'procedure', icon: '📁', color: '#6f42c1' },
  { code: 'BE-PR-14',    title: 'პერსონალის კვალიფიკაცია და ტრენინგი',        category: 'procedure', icon: '👥', color: '#198754' },
  { code: 'BE-PR-15',    title: 'მოწყობილობის მართვა და კალიბრაცია',         category: 'procedure', icon: '🔧', color: '#fd7e14' },
];

// ── Forms catalogue ───────────────────────────────────────────────────────────
const FORMS_DATA = [
  // ბლანკები
  { section: '🏢 ბლანკები და გენერატორები', items: [
    { icon: '📄', code: 'ბლანკი',    title: 'ოფიციალური ბლანკი',          desc: 'ლოგო და რეკვიზიტები',                pdf: <BlankLetterhead />,              fileName: 'ბილდექს_ბლანკი',   color: 'primary' },
    { icon: '⚖️', code: 'ბრძანება',  title: 'ბრძანების გენერატორი',        desc: 'დანიშვნა / შვებ. / მივლ.',          linkTo: '/order-generator',            color: 'primary' },
    { icon: '🤝', code: 'შრ.ხელშ.', title: 'შრომის ხელშეკრულება',         desc: '+ 2 დანართი',                       linkTo: '/contract-generator',         color: 'primary' },
    { icon: '📑', code: 'მომ.ხელშ.', title: 'მომსახ. ხელშეკრულება',        desc: 'BE-PR-01..04',                      linkTo: '/company-docs',               color: 'primary' },
  ]},
  // ინსპექტირება
  { section: '🔍 ინსპექტირების ფორმები', items: [
    { icon: '📝', code: 'FM-18', title: 'განცხადების ფორმა',       desc: 'ინსპექციის მოთხოვნა',           pdf: <BlankApplicationForm />,          fileName: 'FM-18_განცხადება', color: 'info' },
    { icon: '📋', code: 'FM-09', title: 'ხელშეკრ. განხილვა',       desc: 'ISO §7.1',                      pdf: <FM09_ContractReviewPdf />,        fileName: 'FM-09_ხელშ_განხ',  color: 'info', fill: 'FM-09' },
    { icon: '🗺️', code: 'FM-11', title: 'ინსპექციის გეგმა',        desc: 'ISO §7.1',                      pdf: <FM11_InspectionPlanPdf />,        fileName: 'FM-11_ინსპ_გეგმა', color: 'info', fill: 'FM-11' },
    { icon: '📍', code: 'FM-16', title: 'ვიზიტის ჩანაწერი',        desc: 'ISO §7.3',                      pdf: <FM16_VisitRecordPdf />,           fileName: 'FM-16_ვიზ_ჩანაწ', color: 'info', fill: 'FM-16' },
    { icon: '📊', code: 'FM-21', title: 'ინსპ. რეგისტრი',          desc: 'ISO §7.3 (ჟურნალი)',             pdf: <FM21_InspectionRegisterPdf />,   fileName: 'FM-21_ინსპ_რეგ',   color: 'info', fill: 'FM-21' },
  ]},
  // პერსონალი
  { section: '👥 პერსონალი და კომპეტენცია', items: [
    { icon: '⚖️', code: 'FM-02', title: 'მიუკერძ. დეკლარ.',        desc: 'ISO §4',                        pdf: <ImpartialityDeclarationPdf data={{}} />,  fileName: 'FM-02_მიუკ_დეკლ', color: 'success', fill: 'FM-02' },
    { icon: '🤐', code: 'FM-03', title: 'კონფ. შეთანხმება',         desc: 'ISO §5 — 5 წელი',               pdf: <ConfidentialityAgreementPdf data={{}} />, fileName: 'FM-03_კონფ_შეთ',  color: 'success', fill: 'FM-03' },
    { icon: '🎯', code: 'FM-08', title: 'კომპეტ. შეფასება',         desc: 'ISO §6.1',                      pdf: <FM08_CompetencyAssessmentPdf />,          fileName: 'FM-08_კომპ_შეფ',  color: 'success', fill: 'FM-08' },
    { icon: '📚', code: 'FM-13', title: 'ტრენინგის ჩანაწ.',         desc: 'ISO §6.1 — 5 წელი',             pdf: <FM13_TrainingRecordNewPdf />,             fileName: 'FM-13_ტრენ_ჩანაწ',color: 'success', fill: 'FM-13' },
  ]},
  // ხარისხი
  { section: '🛡️ ხარისხის მართვა', items: [
    { icon: '📣', code: 'FM-06', title: 'საჩივარი / აპელაცია',       desc: 'ISO §7.5/7.7/7.8',              pdf: <FM06_ComplaintAppealPdf />,       fileName: 'FM-06_საჩ_აპ',    color: 'danger', fill: 'FM-06' },
    { icon: '⚠️', code: 'FM-10', title: 'CAPA მაკორექტ. ქმ.',        desc: 'ISO §8.5',                      pdf: <FM10_CAPAFormPdf />,              fileName: 'FM-10_CAPA',       color: 'danger', fill: 'FM-10' },
    { icon: '🚫', code: 'FM-14', title: 'შეუსაბამო სამ. მართვა',     desc: 'ISO §8.7',                      pdf: <FM14_NonConformingPdf />,         fileName: 'FM-14_შეუსაბ',     color: 'danger', fill: 'FM-14' },
    { icon: '🔎', code: 'FM-04', title: 'შიდა აუდიტი',               desc: 'ISO §8.6 — 2-ჯერ/წელ.',         pdf: <FM04_InternalAuditPdf />,         fileName: 'FM-04_შ_აუდ',      color: 'danger', fill: 'FM-04' },
    { icon: '📈', code: 'FM-15', title: 'მართვის ანალიზი',            desc: 'ISO §8.5',                      pdf: <FM15_MgmtReviewPdf />,            fileName: 'FM-15_მენ_ანალ',   color: 'danger', fill: 'FM-15' },
  ]},
  // მოწყობილობა
  { section: '🔧 მოწყობილობა და ქვეკონტრ.', items: [
    { icon: '🔩', code: 'FM-07', title: 'მოწყ. ვერიფიკაცია',         desc: 'ISO §6.2',                      pdf: <FM07_EquipmentVerificationPdf />, fileName: 'FM-07_მოწყ_ვერ',   color: 'warning', fill: 'FM-07' },
    { icon: '🏗️', code: 'FM-12', title: 'ქვეკონტრ. შეფასება',        desc: 'ISO §6.6',                      pdf: <FM12_SubcontractorPdf />,         fileName: 'FM-12_ქვეკ_შეფ',   color: 'warning', fill: 'FM-12' },
  ]},
  // დოკ. მართვა
  { section: '🗂️ დოკუმენტაციის მართვა', items: [
    { icon: '👁️', code: 'FM-22', title: 'გაცნობის ფურცელი',          desc: 'ISO §6.1 — 5 სამ. დღე',         pdf: <FM22_FamiliarizationPdf />,       fileName: 'FM-22_გაცნ_ფ',     color: 'secondary', fill: 'FM-22' },
    { icon: '✍️', code: 'FM-23', title: 'ცვლ. წინადადება',           desc: 'PR-01',                         pdf: <FM23_DocChangePdf />,             fileName: 'FM-23_ცვლ_წინ',    color: 'secondary', fill: 'FM-23' },
    { icon: '📒', code: 'FM-24', title: 'ცვლ. რეგისტრი',             desc: 'PR-01 (ჟურნალი)',                pdf: <FM24_ChangeRegisterPdf />,        fileName: 'FM-24_ცვლ_რეგ',    color: 'secondary', fill: 'FM-24' },
    { icon: '🗑️', code: 'FM-25', title: 'ლიკვიდაციის აქტი',         desc: 'PR-02 §6',                      pdf: <FM25_LiquidationActPdf />,        fileName: 'FM-25_ლიკვ',        color: 'secondary', fill: 'FM-25' },
  ]},
];

// ── Single form card ──────────────────────────────────────────────────────────
function FormCard({ icon, code, title, desc, pdf, fileName, linkTo, color, fill }) {
  const [showFill, setShowFill] = useState(false);
  return (
    <>
      <Col xl={2} lg={3} md={4} sm={6}>
        <Card className="h-100 shadow-sm border-0" style={{ borderTop: `3px solid var(--bs-${color})` }}>
          <Card.Body className="d-flex flex-column p-2 text-center">
            <div className="fs-4 mb-1">{icon}</div>
            <Badge bg={color} className="mb-1" style={{ fontSize: '0.6rem' }}>{code}</Badge>
            <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.75rem', lineHeight: 1.3 }}>{title}</div>
            <p className="text-muted mb-2 flex-grow-1" style={{ fontSize: '0.62rem' }}>{desc}</p>
            {linkTo ? (
              <Button as={Link} to={linkTo} variant={color} size="sm" className="w-100 fw-bold" style={{ fontSize: '0.68rem' }}>⚙️ შექმნა</Button>
            ) : (
              <div className="d-flex flex-column gap-1">
                {fill && FORM_CONFIGS[fill] && (
                  <Button variant={color} size="sm" className="w-100 fw-bold" style={{ fontSize: '0.68rem' }} onClick={() => setShowFill(true)}>📝 შევსება</Button>
                )}
                <PDFDownloadLink document={pdf} fileName={`${fileName}_ცარიელი.pdf`} style={{ textDecoration: 'none' }}>
                  {({ loading }) => (
                    <Button variant={`outline-${color}`} size="sm" className="w-100 fw-bold" style={{ fontSize: '0.68rem' }}>
                      {loading ? '⏳' : '📄 ჩამოტვირთვა'}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
      {fill && FORM_CONFIGS[fill] && (
        <FormFillModal show={showFill} onHide={() => setShowFill(false)}
          config={FORM_CONFIGS[fill]} pdfComponent={pdf} pdfFileName={fileName} formCode={code} />
      )}
    </>
  );
}

// ── Upload/Edit Modal ─────────────────────────────────────────────────────────
function ProcUploadModal({ show, onHide, onSaved, existing }) {
  const [code, setCode]       = useState('');
  const [title, setTitle]     = useState('');
  const [version, setVersion] = useState('1.0');
  const [notes, setNotes]     = useState('');
  const [file, setFile]       = useState(null);
  const [saving, setSaving]   = useState(false);
  const [err, setErr]         = useState('');
  const fileRef               = useRef();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (existing) {
      setCode(existing.code || ''); setTitle(existing.title || '');
      setVersion(existing.version || '1.0'); setNotes(existing.notes || '');
    } else { setCode(''); setTitle(''); setVersion('1.0'); setNotes(''); }
    setFile(null); setErr('');
  }, [existing, show]);

  const handleSave = async () => {
    if (!title.trim()) { setErr('სათაური სავალდებულოა'); return; }
    if (!existing && !file) { setErr('ფაილი სავალდებულოა'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('code', code); fd.append('title', title);
      fd.append('version', version); fd.append('notes', notes);
      if (file) fd.append('file', file);
      const headers = { Authorization: `Bearer ${token}` };
      if (existing) {
        await axios.put(`/api/procedures/${existing._id}`, fd, { headers });
      } else {
        await axios.post('/api/procedures', fd, { headers });
      }
      onSaved();
    } catch (e) { setErr(e.response?.data?.error || e.message); }
    setSaving(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ background: '#003366', color: '#fff' }}>
        <Modal.Title style={{ fontSize: '1rem' }}>{existing ? '✏️ განახლება' : '📤 ატვირთვა'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {err && <div className="alert alert-danger py-1 small">{err}</div>}
        <Form.Group className="mb-2">
          <Form.Label className="small fw-bold">კოდი (მაგ. BE-PR-01)</Form.Label>
          <Form.Control size="sm" value={code} onChange={e => setCode(e.target.value)} placeholder="BE-PR-01" />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label className="small fw-bold">სათაური *</Form.Label>
          <Form.Control size="sm" value={title} onChange={e => setTitle(e.target.value)} placeholder="პროცედურის სახელი" />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label className="small fw-bold">ვერსია</Form.Label>
          <Form.Control size="sm" value={version} onChange={e => setVersion(e.target.value)} placeholder="1.0" />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label className="small fw-bold">ფაილი (.docx / .pdf) {existing && '(სურვილისამებრ — ჩაანაცვლებს)'}</Form.Label>
          <input ref={fileRef} type="file" className="form-control form-control-sm"
            accept=".docx,.doc,.pdf"
            onChange={e => setFile(e.target.files[0])} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label className="small fw-bold">შენიშვნები</Form.Label>
          <Form.Control as="textarea" size="sm" rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="sm" onClick={onHide}>გაუქმება</Button>
        <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
          {saving ? '⏳...' : existing ? '💾 განახლება' : '📤 ატვირთვა'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProceduresPage({ role }) {
  const [tab, setTab]             = useState('procedures'); // 'procedures' | 'forms'
  const [docs, setDocs]           = useState([]);
  const [loading, setLoading]     = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [msg, setMsg]             = useState(null);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const canEdit = ['admin', 'quality_manager'].includes(role);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const r = await axios.get('/api/procedures', { headers });
      setDocs(r.data);
    } catch {}
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleDelete = async (doc) => {
    if (!window.confirm(`წაიშალოს "${doc.title}"?`)) return;
    try {
      await axios.delete(`/api/procedures/${doc._id}`, { headers });
      setMsg({ type: 'success', text: 'წაიშალა' });
      fetchDocs();
    } catch (e) { setMsg({ type: 'danger', text: e.message }); }
  };

  // Merge PROCEDURE_META with uploaded docs
  const mergedList = PROCEDURE_META.map(meta => {
    const uploaded = docs.find(d => d.code === meta.code);
    return { ...meta, uploaded };
  });
  // Also show any extra uploaded docs not in metadata
  const extraDocs = docs.filter(d => !PROCEDURE_META.find(m => m.code === d.code));

  const downloadDoc = (doc) => {
    const a = document.createElement('a');
    a.href = doc.filePath;
    a.download = doc.originalName || doc.code;
    a.click();
  };

  const categoryLabel = { manual: 'სახ-ლო', procedure: 'პროც.', index: 'ინდ.' };
  const categoryColor = { manual: '#003366', procedure: '#0d6efd', index: '#6f42c1' };

  // ── TAB STYLES ──────────────────────────────────────────────────────────────
  const tabStyle = (active) => ({
    padding: '8px 20px', borderRadius: '8px 8px 0 0', border: 'none',
    background: active ? '#003366' : '#e8f0f7',
    color: active ? '#fff' : '#003366', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 0 60px' }}>
      <h3 className="fw-bold mb-1" style={{ color: '#003366' }}>📂 პროცედურები და ფორმები</h3>
      <p className="text-muted small mb-3">ISO/IEC 17020:2012 — ხარისხის სახელმძღვანელო, პროცედურები, ფორმები</p>

      {msg && <div className={`alert alert-${msg.type} py-2 small`} onClick={() => setMsg(null)}>{msg.text} <span style={{ cursor: 'pointer', float: 'right' }}>✕</span></div>}

      {/* Tabs */}
      <div className="d-flex gap-1 mb-0" style={{ borderBottom: '2px solid #003366' }}>
        <button style={tabStyle(tab === 'procedures')} onClick={() => setTab('procedures')}>
          📄 პროცედურები და სახელმძღვანელო
        </button>
        <button style={tabStyle(tab === 'forms')} onClick={() => setTab('forms')}>
          📋 ფორმები და შაბლონები
        </button>
      </div>

      {/* ── PROCEDURES TAB ───────────────────────────────────────────────────── */}
      {tab === 'procedures' && (
        <div style={{ background: '#fff', border: '1px solid #003366', borderTop: 'none', borderRadius: '0 8px 8px 8px', padding: 20 }}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="text-muted small">სულ {PROCEDURE_META.length} პოზიცია · {docs.length} ატვირთული</span>
            {canEdit && (
              <button className="btn btn-primary btn-sm fw-bold" onClick={() => { setEditing(null); setShowModal(true); }}>
                + ატვირთვა
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-4 text-muted">⏳ იტვირთება...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table table-hover table-sm mb-0" style={{ fontSize: '0.82rem' }}>
                <thead style={{ background: '#003366', color: '#fff', position: 'sticky', top: 0 }}>
                  <tr>
                    <th className="py-2 px-3" style={{ width: 32 }}></th>
                    <th className="py-2 px-3" style={{ width: 110 }}>კოდი</th>
                    <th className="py-2 px-3">სათაური</th>
                    <th className="py-2 px-3" style={{ width: 80 }}>კატ.</th>
                    <th className="py-2 px-3" style={{ width: 70 }}>ვერ.</th>
                    <th className="py-2 px-3" style={{ width: 130 }}>ატვირთვა</th>
                    <th className="py-2 px-3" style={{ width: 70 }}>სტ.</th>
                    <th className="py-2 px-3" style={{ width: 130 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {mergedList.map((item) => {
                    const up = item.uploaded;
                    return (
                      <tr key={item.code} style={{ background: up ? '#f0fdf4' : '#fffbeb' }}>
                        <td className="px-3 text-center" style={{ fontSize: 16 }}>{item.icon}</td>
                        <td className="px-3">
                          <span className="fw-bold" style={{ color: categoryColor[item.category] || '#333', fontSize: '0.78rem' }}>{item.code}</span>
                        </td>
                        <td className="px-3">
                          <div style={{ fontWeight: 500 }}>{up ? up.title : item.title}</div>
                          {up?.notes && <div className="text-muted" style={{ fontSize: '0.7rem' }}>{up.notes}</div>}
                        </td>
                        <td className="px-3">
                          <span style={{ fontSize: '0.7rem', padding: '1px 5px', borderRadius: 4, background: '#e8f0f7', color: categoryColor[item.category] || '#333' }}>
                            {categoryLabel[item.category] || item.category}
                          </span>
                        </td>
                        <td className="px-3 text-muted">{up?.version || '—'}</td>
                        <td className="px-3 text-muted" style={{ fontSize: '0.72rem' }}>
                          {up ? new Date(up.updatedAt).toLocaleDateString('ka-GE') : '—'}
                        </td>
                        <td className="px-3 text-center">
                          {up
                            ? <span style={{ color: '#15803d', fontWeight: 600, fontSize: '0.75rem' }}>✅ ატვირთ.</span>
                            : <span style={{ color: '#b45309', fontWeight: 600, fontSize: '0.75rem' }}>⚠️ ცარ.</span>
                          }
                        </td>
                        <td className="px-3">
                          <div className="d-flex gap-1">
                            {up && (
                              <button className="btn btn-sm btn-outline-primary py-0 px-2" style={{ fontSize: '0.72rem' }}
                                onClick={() => downloadDoc(up)}>
                                ⬇️ გადმოტვ.
                              </button>
                            )}
                            {canEdit && (
                              <button className="btn btn-sm btn-outline-secondary py-0 px-2" style={{ fontSize: '0.72rem' }}
                                onClick={() => { setEditing(up || { code: item.code, title: item.title, category: item.category }); setShowModal(true); }}>
                                {up ? '✏️' : '📤'}
                              </button>
                            )}
                            {canEdit && up && (
                              <button className="btn btn-sm btn-outline-danger py-0 px-2" style={{ fontSize: '0.72rem' }}
                                onClick={() => handleDelete(up)}>🗑️</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {/* Extra docs not in metadata */}
                  {extraDocs.map(doc => (
                    <tr key={doc._id} style={{ background: '#f0fdf4' }}>
                      <td className="px-3 text-center">📄</td>
                      <td className="px-3 fw-bold" style={{ fontSize: '0.78rem', color: '#6f42c1' }}>{doc.code}</td>
                      <td className="px-3">{doc.title}</td>
                      <td className="px-3"><span style={{ fontSize: '0.7rem' }}>{categoryLabel[doc.category] || doc.category}</span></td>
                      <td className="px-3 text-muted">{doc.version}</td>
                      <td className="px-3 text-muted" style={{ fontSize: '0.72rem' }}>{new Date(doc.updatedAt).toLocaleDateString('ka-GE')}</td>
                      <td className="px-3 text-center"><span style={{ color: '#15803d', fontSize: '0.75rem', fontWeight: 600 }}>✅</span></td>
                      <td className="px-3">
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-primary py-0 px-2" style={{ fontSize: '0.72rem' }} onClick={() => downloadDoc(doc)}>⬇️ გადმოტვ.</button>
                          {canEdit && (
                            <>
                              <button className="btn btn-sm btn-outline-secondary py-0 px-2" style={{ fontSize: '0.72rem' }} onClick={() => { setEditing(doc); setShowModal(true); }}>✏️</button>
                              <button className="btn btn-sm btn-outline-danger py-0 px-2" style={{ fontSize: '0.72rem' }} onClick={() => handleDelete(doc)}>🗑️</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── FORMS TAB ────────────────────────────────────────────────────────── */}
      {tab === 'forms' && (
        <div style={{ background: '#fff', border: '1px solid #003366', borderTop: 'none', borderRadius: '0 8px 8px 8px', padding: 20 }}>
          <p className="text-muted small mb-3">
            📝 <strong>შევსება</strong> — ონლაინ შევსება + PDF გენერაცია &nbsp;|&nbsp;
            📄 <strong>ჩამოტვირთვა</strong> — ცარიელი შაბლონი
          </p>
          {FORMS_DATA.map(sec => (
            <div key={sec.section} className="mb-4">
              <div className="d-flex align-items-center mb-2 mt-3">
                <h6 className="fw-bold m-0" style={{ color: '#003366' }}>{sec.section}</h6>
                <div style={{ flex: 1, height: 1, background: '#003366', opacity: 0.2, marginLeft: 10 }} />
              </div>
              <Row className="g-2">
                {sec.items.map(item => (
                  <FormCard key={item.code} {...item} />
                ))}
              </Row>
            </div>
          ))}
        </div>
      )}

      {/* Upload / Edit Modal */}
      <ProcUploadModal
        show={showModal}
        onHide={() => setShowModal(false)}
        existing={editing?._id ? editing : null}
        onSaved={() => { setShowModal(false); fetchDocs(); setMsg({ type: 'success', text: 'შენახულია ✅' }); }}
      />
    </div>
  );
}
