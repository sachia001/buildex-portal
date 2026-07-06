import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Row, Col, Button, Form, Table, Badge, Modal, Accordion, Alert } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import axios from 'axios';
import { toast, confirmDialog } from '../components/Feedback';
import { Link } from 'react-router-dom';
import ShareTransferPdf from '../pdf-components/ShareTransferPdf';
import CharterPdf from '../pdf-components/CharterPdf';
import PartnerDecisionPdf from '../pdf-components/PartnerDecisionPdf';
import FoundingAgreementPdf from '../pdf-components/FoundingAgreementPdf';
import ServiceContractPdf from '../pdf-components/ServiceContractPdf';

// ── Shared partner defaults ──────────────────────────────────────────────────
const DEFAULT_PARTNERS = [
  { _id: 1, name: 'ლევან საჩიშვილი', personalId: '20001017959', address: 'ქ. თელავი, ლიონიძის ქ. №22', share: 100 },
];

const DEFAULT_CONFIG = {
  address: 'საქართველო, ქ. თელავი, ლიონიძის ქუჩა №22',
  addressShort: 'ქ. თელავი, ლიონიძის ქ. №22',
  email: 'buildexexspertise@gmail.com',
  phone: '+995 511 747 400',
  director: 'ლევან საჩიშვილი',
  directorId: '20001017959',
  directorAddress: 'ქ. თელავი, ლიონიძის ქ. №22',
  representation: 'ერთპიროვნული',
  totalShares: '100',
  city: 'ქ. თელავი',
};

// ── Preset decisions (PO templates) ─────────────────────────────────────────
const buildFoundationDecisions = (partners, config) => {
  // eslint-disable-next-line no-unused-vars
  const p0 = partners[0] || {};
  return [
    {
      title: 'საზოგადოების დაფუძნება და საფირმო სახელწოდება',
      body: 'დაფუძნდეს შეზღუდული პასუხისმგებლობის საზოგადოება. საზოგადოების საფირმო სახელწოდებაა: შპს „ბილდექს ექსპერტიზა". ინგლისურენოვანი სახელწოდება: BUILDEX EXPERTISE LLC.',
    },
    {
      title: 'საზოგადოების იურიდიული მისამართი',
      body: `საზოგადოების იურიდიულ მისამართად განისაზღვროს: ${config.address}.`,
    },
    {
      title: 'საზოგადოების კაპიტალი და წილთა განაწილება',
      body: `საზოგადოების საწესდებო კაპიტალი არ არის დაყოფილი ნომინალურ ღირებულებად. ${partners.map(p => `საზოგადოების წილის ${p.share}%-ის მფლობელია: ${p.name} (პირადი № ${p.personalId}).`).join(' ')}`,
    },
    {
      title: 'საზოგადოების წესდების დამტკიცება',
      body: 'საზოგადოების საქმიანობის მიზნებისათვის, მათ შორის ISO/IEC 17020:2012/2013 სტანდარტის მიხედვით „A" ტიპის ინსპექტირების ორგანოდ ფუნქციონირებისათვის, დამტკიცდეს საზოგადოების ინდივიდუალური წესდება, რომელიც წარმოადგენს ამ გადაწყვეტილების განუყოფელ ნაწილს.',
    },
    {
      title: 'საზოგადოების ხელმძღვანელობა და წარმომადგენლობა',
      body: `საზოგადოების დირექტორად (ხელმძღვანელობაზე და წარმომადგენლობაზე უფლებამოსილ პირად) განუსაზღვრელი ვადით დაინიშნოს: ${config.director} (პირადი № ${config.directorId}).`,
    },
    {
      title: 'რეგისტრაციის უზრუნველყოფა',
      body: 'დაევალოს საზოგადოების დირექტორს, განახორციელოს ყველა საჭირო სამართლებრივი მოქმედება სსიპ საჯარო რეესტრის ეროვნულ სააგენტოში საზოგადოების სახელმწიფო რეგისტრაციის მიზნით.',
    },
  ];
};

// ── Download button helper ────────────────────────────────────────────────────
const PdfBtn = ({ document: doc, fileName, label, variant = 'primary' }) => (
  <PDFDownloadLink document={doc} fileName={fileName} className={`btn btn-${variant} d-flex align-items-center gap-1`} style={{ textDecoration: 'none' }}>
    {({ loading }) => loading ? '⏳ მზადდება...' : `📄 ${label}`}
  </PDFDownloadLink>
);

// ── Two-button helper: one without signature, one with facsimile ──────────────
const DocBtns = ({ makeDoc, fileName, label, variant = 'primary' }) => (
  <div className="d-flex gap-2 flex-wrap">
    <PdfBtn document={makeDoc(false)} fileName={fileName} label={label} variant={variant} />
    <PdfBtn document={makeDoc(true)} fileName={`signed-${fileName}`} label={`${label} (✍️ ხელმოწ.)`} variant="outline-secondary" />
  </div>
);

// ── Partner row editor ────────────────────────────────────────────────────────
const PartnerRow = ({ p, idx, onEdit, onRemove, canRemove }) => (
  <tr>
    <td className="text-muted small">{idx + 1}</td>
    <td className="fw-bold">{p.name}</td>
    <td className="small text-muted">{p.personalId}</td>
    <td className="small text-muted">{p.address}</td>
    <td className="text-center"><Badge bg={p.share === 100 ? 'success' : 'primary'}>{p.share}%</Badge></td>
    <td className="text-center">
      <div className="d-flex gap-1 justify-content-center">
        <Button size="sm" variant="outline-warning" onClick={() => onEdit(idx)}>✏️</Button>
        {canRemove && <Button size="sm" variant="outline-danger" onClick={() => onRemove(idx)}>🗑️</Button>}
      </div>
    </td>
  </tr>
);

// ── Main component ────────────────────────────────────────────────────────────
const CompanyDocsPage = ({ role }) => {

  // ── Shared state ─────────────────────────────────────────────────────────
  const [partners, setPartners] = useState(DEFAULT_PARTNERS);
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  // ── Persist to backend ────────────────────────────────────────────────────
  const saveTimer = useRef(null);
  const settingsLoaded = useRef(false);

  // Load saved settings on mount
  useEffect(() => {
    axios.get('/api/company-settings')
      .then(res => {
        if (res.data.partners?.length) setPartners(res.data.partners);
        if (res.data.config && Object.keys(res.data.config).length) setConfig(prev => ({ ...prev, ...res.data.config }));
        settingsLoaded.current = true;
      })
      .catch(() => { settingsLoaded.current = true; });
  }, []);

  // Auto-save partners + config whenever they change (debounced 800ms)
  useEffect(() => {
    if (!settingsLoaded.current) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      axios.put('/api/company-settings', { partners, config }).catch(() => {});
    }, 800);
  }, [partners, config]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Partner modal ─────────────────────────────────────────────────────────
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [editingPartnerIdx, setEditingPartnerIdx] = useState(null);
  const [partnerForm, setPartnerForm] = useState({ name: '', personalId: '', address: '', share: 0 });

  const totalSharePct = partners.reduce((s, p) => s + Number(p.share), 0);
  const shareError = totalSharePct !== 100;

  const openAddPartner = () => {
    setEditingPartnerIdx(null);
    setPartnerForm({ name: '', personalId: '', address: '', share: 0 });
    setShowPartnerModal(true);
  };
  const openEditPartner = (idx) => {
    setEditingPartnerIdx(idx);
    setPartnerForm({ ...partners[idx] });
    setShowPartnerModal(true);
  };
  const savePartner = () => {
    const updated = [...partners];
    const p = { ...partnerForm, share: Number(partnerForm.share), _id: Date.now() };
    if (editingPartnerIdx !== null) updated[editingPartnerIdx] = p;
    else updated.push(p);
    setPartners(updated);
    setShowPartnerModal(false);
  };
  const removePartner = (idx) => {
    setPartners(partners.filter((_, i) => i !== idx));
  };

  // ── Uploaded docs ─────────────────────────────────────────────────────────
  const [docs, setDocs] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', category: 'სხვა', description: '', docDate: new Date().toISOString().split('T')[0] });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchDocs = async () => {
    try { const res = await axios.get('/api/company-docs'); setDocs(Array.isArray(res.data) ? res.data : []); }
    catch { setDocs([]); }
  };
  useEffect(() => { fetchDocs(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault(); setUploading(true);
    try {
      const fd = new FormData();
      fd.append('data', JSON.stringify(uploadForm));
      if (uploadFile) fd.append('file', uploadFile);
      await axios.post('/api/company-docs', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowUpload(false);
      setUploadForm({ title: '', category: 'სხვა', description: '', docDate: new Date().toISOString().split('T')[0] });
      setUploadFile(null); fetchDocs();
    } catch (err) { toast('შეცდომა: ' + (err.response?.data?.error || err.message), 'danger'); }
    finally { setUploading(false); }
  };
  const handleDelete = async (id) => {
    if (!(await confirmDialog('ნამდვილად გსურთ წაშლა?'))) return;
    try { await axios.delete(`/api/company-docs/${id}`); fetchDocs(); }
    catch { toast('წაშლა ვერ მოხერხდა', 'danger'); }
  };
  const catVariant = cat => ({ 'წესდება': 'primary', 'PO გადაწყვეტილება': 'success', 'სადამფ. შეთანხმება': 'info', 'სხვა': 'secondary' }[cat] || 'secondary');

  // ── Charter form ──────────────────────────────────────────────────────────
  const [charterDate, setCharterDate] = useState('09 მარტი, 2026 წელი');

  // ── Partner decision form ─────────────────────────────────────────────────
  const [decisionNum, setDecisionNum] = useState('PO-01');
  const [decisionDate, setDecisionDate] = useState('09 მარტი, 2026 წელი');
  const [decisionPreset, setDecisionPreset] = useState('foundation');
  const [customDecisions, setCustomDecisions] = useState([{ title: '', body: '' }]);
  const [agendaNote, setAgendaNote] = useState('');

  const decisionData = decisionPreset === 'foundation'
    ? buildFoundationDecisions(partners, config)
    : decisionPreset === 'director'
    ? [{ title: 'საზოგადოების დირექტორის დანიშვნა', body: `საზოგადოების დირექტორად (ხელმძღვანელობაზე და წარმომადგენლობაზე უფლებამოსილ პირად) განუსაზღვრელი ვადით დაინიშნოს: ${config.director} (პირადი № ${config.directorId}).` }]
    : decisionPreset === 'transfer'
    ? [{ title: 'წილის გასხვისებაზე თანხმობის მიცემა', body: `საზოგადოების წესდების 6.4 მუხლისა და „მეწარმეთა შესახებ" საქართველოს კანონის შესაბამისად, ${partners.map(p => `${p.name}`).join(', ')} ადასტურებ${partners.length === 1 ? 'ს' : 'ენ'} უპირატეს შესყიდვის უფლებაზე წერილობით თავის არდამტკიცებას ან/და თანხმობას გასხვისების განხორციელებაზე.` }]
    : customDecisions;

  const addCustomDecision = () => setCustomDecisions([...customDecisions, { title: '', body: '' }]);
  const updateCustomDecision = (i, field, val) => {
    const updated = [...customDecisions];
    updated[i][field] = val;
    setCustomDecisions(updated);
  };
  const removeCustomDecision = (i) => setCustomDecisions(customDecisions.filter((_, idx) => idx !== i));

  // ── Share transfer form ───────────────────────────────────────────────────
  const [transferType, setTransferType] = useState('gift');
  const [transferForm, setTransferForm] = useState({
    transferorName: partners[0]?.name || 'ლევან საჩიშვილი',
    transferorId: partners[0]?.personalId || '20001017959',
    transferorAddress: partners[0]?.address || 'ქ. თელავი, ლიონიძის ქ. №22',
    transferorCurrentShare: String(partners[0]?.share || 100),
    transferees: [{ name: '', id: '', address: '', sharePercent: '', salePrice: '' }],
    shareValue: '',
    paymentTerms: 'ხელშეკრულების გაფორმებიდან 5 სამუშაო დღის ვადაში',
    contractDate: new Date().toLocaleDateString('ka-GE'),
    contractNumber: '', city: 'ქ. თელავი', notaryName: '',
  });

  const addTransferee = () => setTransferForm(f => ({ ...f, transferees: [...f.transferees, { name: '', id: '', address: '', sharePercent: '', salePrice: '' }] }));
  const removeTransferee = i => setTransferForm(f => ({ ...f, transferees: f.transferees.filter((_, idx) => idx !== i) }));
  const updateTransferee = (i, field, val) => setTransferForm(f => { const t = [...f.transferees]; t[i] = { ...t[i], [field]: val }; return { ...f, transferees: t }; });

  const totalTransferred = transferForm.transferees.reduce((s, t) => s + (parseInt(t.sharePercent) || 0), 0);
  const remainingShare = (parseInt(transferForm.transferorCurrentShare) || 0) - totalTransferred;

  // When partners change, auto-update transferor defaults
  useEffect(() => {
    if (partners.length > 0) {
      const p0 = partners[0];
      setTransferForm(f => ({
        ...f,
        transferorName: p0.name,
        transferorId: p0.personalId,
        transferorAddress: p0.address,
        transferorCurrentShare: String(p0.share),
      }));
    }
  }, [partners]);

  // ── Founding agreement form ───────────────────────────────────────────────
  const [foundingDate, setFoundingDate] = useState('09 მარტი, 2026 წელი');

  // ── Service contract form ─────────────────────────────────────────────────
  const [svcForm, setSvcForm] = useState({
    contractNumber: '',
    contractDate: new Date().toLocaleDateString('ka-GE'),
    city: 'ქ. თელავი',
    clientType: 'physical',
    clientName: '',
    clientId: '',
    clientAddress: '',
    clientRepName: '',
    clientRepId: '',
    serviceType: 'BE-PR-01',
    serviceScope: '',
    objectAddress: '',
    serviceFee: '',
    paymentTerms: 'ანგარიშ-ფაქტურის გამოწერიდან 5 (ხუთი) სამუშაო დღის ვადაში',
    contractStart: '',
    contractEnd: '',
    vatIncluded: true,
  });

  // ── Build PDF data objects ────────────────────────────────────────────────
  const charterPdfData = { partners, director: config.director, directorId: config.directorId, address: config.addressShort, email: config.email, charterDate };
  const decisionPdfData = { decisionNumber: decisionNum, decisionDate, city: config.city, partners, decisions: decisionData, agendaNote };
  const foundingPdfData = { partners, director: config.director, directorId: config.directorId, directorAddress: config.directorAddress, address: config.address, email: config.email, phone: config.phone, foundingDate, totalShares: config.totalShares, representation: config.representation };
  const transferPdfData = { transferType, ...transferForm, transferees: transferForm.transferees, partners };

  return (
    <Container className="mt-4 pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark">🏢 კომპანიის რეგისტრაციის დოკუმენტაცია</h3>
          <span className="text-muted small">შპს „ბილდექს ექსპერტიზა" — ს/კ 431188010</span>
        </div>
        <div className="d-flex gap-2">
          <Button as={Link} to="/" variant="secondary">← მთავარი</Button>
          {role === 'admin' && <Button variant="primary" onClick={() => setShowUpload(true)}>+ ატვირთვა</Button>}
        </div>
      </div>

      {/* Company info */}
      <Card className="shadow-sm border-0 rounded-4 mb-4" style={{ borderLeft: '5px solid #003366', borderLeftWidth: 5 }}>
        <Card.Body>
          <Row className="g-2 align-items-center">
            <Col md={4}><strong>კომპანია:</strong> შპს „ბილდექს ექსპერტიზა"</Col>
            <Col md={4}><strong>ს/კ:</strong> 431188010</Col>
            <Col md={4}><strong>ელ. ფოსტა:</strong> {config.email}</Col>
            <Col md={4} className="mt-1"><strong>მისამართი:</strong> {config.addressShort}</Col>
            <Col md={4} className="mt-1"><strong>დაფუძნება:</strong> 09 მარტი 2026</Col>
            <Col md={4} className="mt-1"><strong>ტელეფონი:</strong> {config.phone}</Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ── Partners management ── */}
      <Card className="shadow-sm border-0 rounded-4 mb-4">
        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center fw-bold">
          👥 პარტნიორები (ყველა დოკუმენტი გამოიყენებს ამ ინფორმაციას)
          <Button size="sm" variant="outline-success" onClick={openAddPartner}>+ პარტნიორის დამატება</Button>
        </Card.Header>
        {shareError && (
          <Alert variant="warning" className="m-3 mb-0 py-2">
            ⚠️ წილების ჯამი = <strong>{totalSharePct}%</strong> (უნდა იყოს 100%)
          </Alert>
        )}
        <Table hover responsive className="mb-0 align-middle">
          <thead className="bg-dark text-white">
            <tr>
              <th className="p-3" style={{ width: 30 }}>№</th>
              <th>სახელი, გვარი</th>
              <th>პ/ნ</th>
              <th>მისამართი</th>
              <th className="text-center" style={{ width: 80 }}>წილი</th>
              <th className="text-center" style={{ width: 90 }}>ქმედება</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p, i) => (
              <PartnerRow key={p._id || i} p={p} idx={i}
                onEdit={openEditPartner} onRemove={removePartner}
                canRemove={partners.length > 1} />
            ))}
          </tbody>
        </Table>
      </Card>

      {/* ── Uploaded docs ── */}
      <Card className="shadow-sm border-0 rounded-4 mb-4">
        <Card.Header className="bg-white py-3 fw-bold">📁 ატვირთული კომპანიის დოკუმენტები</Card.Header>
        <Table hover responsive className="mb-0 align-middle">
          <thead className="bg-dark text-white">
            <tr>
              <th className="p-3">სათაური</th>
              <th>კატეგორია</th>
              <th>თარიღი</th>
              <th>აღწერა</th>
              <th className="text-center">ქმედება</th>
            </tr>
          </thead>
          <tbody>
            {docs.length > 0 ? docs.map(doc => (
              <tr key={doc._id}>
                <td className="p-3 fw-bold">{doc.title}</td>
                <td><Badge bg={catVariant(doc.category)}>{doc.category}</Badge></td>
                <td className="small">{doc.docDate ? new Date(doc.docDate).toLocaleDateString('ka-GE') : '-'}</td>
                <td className="small text-muted">{doc.description || '-'}</td>
                <td className="text-center">
                  <div className="d-flex gap-1 justify-content-center">
                    {doc.fileUrl && <a href={`/${doc.fileUrl}?token=${localStorage.getItem('token')}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">👁 ნახვა</a>}
                    {role === 'admin' && <Button size="sm" variant="outline-danger" onClick={() => handleDelete(doc._id)}>🗑️</Button>}
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="text-center py-4 text-muted">დოკუმენტები არ არის ატვირთული</td></tr>
            )}
          </tbody>
        </Table>
      </Card>

      {/* ── Document generators ── */}
      <Card className="shadow-sm border-0 rounded-4">
        <Card.Header className="bg-white py-3 fw-bold">📝 დოკუმენტების გენერაცია</Card.Header>
        <Card.Body>
          <Accordion flush>

            {/* 1. Charter */}
            <Accordion.Item eventKey="charter">
              <Accordion.Header>📋 წესდება</Accordion.Header>
              <Accordion.Body>
                <Row className="g-3 align-items-end">
                  <Col md={4}>
                    <Form.Label className="small fw-bold">წესდების თარიღი</Form.Label>
                    <Form.Control value={charterDate} onChange={e => setCharterDate(e.target.value)} />
                  </Col>
                  <Col md={8}>
                    <Form.Label className="small fw-bold">კომპანიის მისამართი (მოკლე)</Form.Label>
                    <Form.Control value={config.addressShort} onChange={e => setConfig({ ...config, addressShort: e.target.value })} />
                  </Col>
                  <Col md={4}>
                    <Form.Label className="small fw-bold">დირექტორი</Form.Label>
                    <Form.Control value={config.director} onChange={e => setConfig({ ...config, director: e.target.value })} />
                  </Col>
                  <Col md={4}>
                    <Form.Label className="small fw-bold">დირექტორის პ/ნ</Form.Label>
                    <Form.Control value={config.directorId} onChange={e => setConfig({ ...config, directorId: e.target.value })} />
                  </Col>
                  <Col md={4}>
                    <Form.Label className="small fw-bold">ელ. ფოსტა</Form.Label>
                    <Form.Control value={config.email} onChange={e => setConfig({ ...config, email: e.target.value })} />
                  </Col>
                  <Col md={12}>
                    <Alert variant="info" className="py-2 small mb-2">
                      პარტნიორების სია ავტომატურად გადაიტანება ზემოდან — ცვლილება მხოლოდ „პარტნიორები" სექციაში გააკეთეთ.
                    </Alert>
                    <DocBtns
                      makeDoc={(ws) => <CharterPdf data={{ ...charterPdfData, withSignature: ws }} />}
                      fileName={`wesadeba-buildex-${charterDate.replace(/,?\s+/g, '-')}.pdf`}
                      label="წესდების გენერაცია"
                      variant="dark"
                    />
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            {/* 2. Partner Decision */}
            <Accordion.Item eventKey="decision">
              <Accordion.Header>🗂️ პარტნიორის / კრების გადაწყვეტილება (ოქმი)</Accordion.Header>
              <Accordion.Body>
                <Row className="g-3">
                  <Col md={3}>
                    <Form.Label className="small fw-bold">გადაწყვ. ნომერი</Form.Label>
                    <Form.Control value={decisionNum} onChange={e => setDecisionNum(e.target.value)} placeholder="PO-01" />
                  </Col>
                  <Col md={4}>
                    <Form.Label className="small fw-bold">თარიღი</Form.Label>
                    <Form.Control value={decisionDate} onChange={e => setDecisionDate(e.target.value)} />
                  </Col>
                  <Col md={5}>
                    <Form.Label className="small fw-bold">ქალაქი</Form.Label>
                    <Form.Control value={config.city} onChange={e => setConfig({ ...config, city: e.target.value })} />
                  </Col>
                  <Col md={12}>
                    <Form.Label className="small fw-bold">გადაწყვეტილების შაბლონი</Form.Label>
                    <Form.Select value={decisionPreset} onChange={e => setDecisionPreset(e.target.value)}>
                      <option value="foundation">PO-01 — საზოგადოების დაფუძნება (სრული)</option>
                      <option value="director">დირექტორის დანიშვნა</option>
                      <option value="transfer">წილის გასხვისებაზე თანხმობა</option>
                      <option value="custom">ინდივიდუალური გადაწყვეტილება</option>
                    </Form.Select>
                  </Col>

                  {partners.length > 1 && (
                    <Col md={12}>
                      <Form.Label className="small fw-bold">დღის წესრიგი (კრების ოქმისთვის)</Form.Label>
                      <Form.Control as="textarea" rows={2} value={agendaNote} onChange={e => setAgendaNote(e.target.value)} />
                    </Col>
                  )}

                  {decisionPreset === 'custom' && (
                    <Col md={12}>
                      <Form.Label className="small fw-bold">გადაწყვეტილების პუნქტები</Form.Label>
                      {customDecisions.map((d, i) => (
                        <Card key={i} className="mb-2 border-0 bg-light">
                          <Card.Body className="p-2">
                            <Row className="g-2">
                              <Col md={4}>
                                <Form.Control size="sm" placeholder={`${i + 1}. სათაური`} value={d.title} onChange={e => updateCustomDecision(i, 'title', e.target.value)} />
                              </Col>
                              <Col md={7}>
                                <Form.Control size="sm" as="textarea" rows={2} placeholder="გადაწყვეტილების ტექსტი" value={d.body} onChange={e => updateCustomDecision(i, 'body', e.target.value)} />
                              </Col>
                              <Col md={1} className="d-flex align-items-center">
                                {customDecisions.length > 1 && (
                                  <Button size="sm" variant="outline-danger" onClick={() => removeCustomDecision(i)}>✕</Button>
                                )}
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      ))}
                      <Button size="sm" variant="outline-secondary" onClick={addCustomDecision}>+ პუნქტის დამატება</Button>
                    </Col>
                  )}

                  <Col md={12}>
                    <Alert variant="info" className="py-2 small mb-2">
                      პარტნიორები ავტომატურად გადაიტანება ზემოდან — ერთი პარტნიორის დროს გენერირდება ერთპიროვნული გადაწყვეტილება, მრავლის დროს — კრების ოქმი.
                    </Alert>
                    <DocBtns
                      makeDoc={(ws) => <PartnerDecisionPdf data={{ ...decisionPdfData, withSignature: ws }} />}
                      fileName={`gadawyvetileba-${decisionNum}.pdf`}
                      label={partners.length === 1 ? 'გადაწყვეტილების გენერაცია' : 'კრების ოქმის გენერაცია'}
                      variant="success"
                    />
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            {/* 3. Founding agreement */}
            <Accordion.Item eventKey="founding">
              <Accordion.Header>📜 სადამფუძნებლო შეთანხმება (პარტნიორთა შეთანხმება)</Accordion.Header>
              <Accordion.Body>
                <Row className="g-3 align-items-end">
                  <Col md={4}>
                    <Form.Label className="small fw-bold">ხელმოწერის თარიღი</Form.Label>
                    <Form.Control value={foundingDate} onChange={e => setFoundingDate(e.target.value)} />
                  </Col>
                  <Col md={4}>
                    <Form.Label className="small fw-bold">იურიდიული მისამართი (სრული)</Form.Label>
                    <Form.Control value={config.address} onChange={e => setConfig({ ...config, address: e.target.value })} />
                  </Col>
                  <Col md={4}>
                    <Form.Label className="small fw-bold">წარმომადგენლობის ფარგლები</Form.Label>
                    <Form.Select value={config.representation} onChange={e => setConfig({ ...config, representation: e.target.value })}>
                      <option>ერთპიროვნული</option>
                      <option>ერთობლივი</option>
                    </Form.Select>
                  </Col>
                  <Col md={4}>
                    <Form.Label className="small fw-bold">ტელეფონი</Form.Label>
                    <Form.Control value={config.phone} onChange={e => setConfig({ ...config, phone: e.target.value })} />
                  </Col>
                  <Col md={4}>
                    <Form.Label className="small fw-bold">წილების ჯამური რაოდენობა (ერთ.)</Form.Label>
                    <Form.Control value={config.totalShares} onChange={e => setConfig({ ...config, totalShares: e.target.value })} />
                  </Col>
                  <Col md={12}>
                    <Alert variant="info" className="py-2 small mb-2">
                      პარტნიორების სია ავტომატურად გადაიტანება ზემოდან.
                    </Alert>
                    <DocBtns
                      makeDoc={(ws) => <FoundingAgreementPdf data={{ ...foundingPdfData, withSignature: ws }} />}
                      fileName={`sadadamfudzneblo-shetankhmeba-buildex.pdf`}
                      label="სადამფუძნებლო შეთანხმების გენერაცია"
                      variant="info"
                    />
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            {/* 4. Share transfer */}
            <Accordion.Item eventKey="transfer">
              <Accordion.Header>🔄 წილის გასხვისება (ჩუქება ან ნასყიდობა)</Accordion.Header>
              <Accordion.Body>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Label className="fw-bold">ხელშეკრულების ტიპი</Form.Label>
                    <div className="d-flex gap-4">
                      <Form.Check type="radio" label="🎁 ჩუქება (უსასყიდლო, სამოქ. კოდ. 524)" name="ttype"
                        checked={transferType === 'gift'} onChange={() => setTransferType('gift')} />
                      <Form.Check type="radio" label="💰 ნასყიდობა (სამოქ. კოდ. 477)" name="ttype"
                        checked={transferType === 'sale'} onChange={() => setTransferType('sale')} />
                    </div>
                  </Col>

                  <Col md={12}><hr className="my-1" /><strong className="small text-muted">წილის დამთმობი</strong></Col>
                  <Col md={3}>
                    <Form.Label className="small fw-bold">სახელი, გვარი</Form.Label>
                    <Form.Control value={transferForm.transferorName} onChange={e => setTransferForm({ ...transferForm, transferorName: e.target.value })} />
                  </Col>
                  <Col md={3}>
                    <Form.Label className="small fw-bold">პ/ნ</Form.Label>
                    <Form.Control value={transferForm.transferorId} onChange={e => setTransferForm({ ...transferForm, transferorId: e.target.value })} />
                  </Col>
                  <Col md={4}>
                    <Form.Label className="small fw-bold">მისამართი</Form.Label>
                    <Form.Control value={transferForm.transferorAddress} onChange={e => setTransferForm({ ...transferForm, transferorAddress: e.target.value })} />
                  </Col>
                  <Col md={2}>
                    <Form.Label className="small fw-bold">ამჟამინდელი წილი (%)</Form.Label>
                    <Form.Control value={transferForm.transferorCurrentShare} onChange={e => setTransferForm({ ...transferForm, transferorCurrentShare: e.target.value })} />
                  </Col>

                  <Col md={12}><hr className="my-1" /><strong className="small text-muted">წილის შემძენი / შემძენები</strong></Col>
                  <Col md={12}>
                    {transferForm.transferees.map((t, i) => (
                      <Card key={i} className="mb-2 border bg-light">
                        <Card.Body className="p-2">
                          <div className="d-flex justify-content-between mb-2">
                            <strong className="small">{i + 1}. წილის შემძენი</strong>
                            {transferForm.transferees.length > 1 && <Button size="sm" variant="outline-danger" onClick={() => removeTransferee(i)}>✕</Button>}
                          </div>
                          <Row className="g-2">
                            <Col md={4}><Form.Label className="small fw-bold">სახელი, გვარი *</Form.Label><Form.Control value={t.name} onChange={e => updateTransferee(i, 'name', e.target.value)} /></Col>
                            <Col md={3}><Form.Label className="small fw-bold">პ/ნ</Form.Label><Form.Control value={t.id} onChange={e => updateTransferee(i, 'id', e.target.value)} /></Col>
                            <Col md={5}><Form.Label className="small fw-bold">მისამართი</Form.Label><Form.Control value={t.address} onChange={e => updateTransferee(i, 'address', e.target.value)} /></Col>
                            <Col md={3}><Form.Label className="small fw-bold">გასხვის. წილი (%)</Form.Label><Form.Control value={t.sharePercent} onChange={e => updateTransferee(i, 'sharePercent', e.target.value)} /></Col>
                            {transferType === 'sale' && <Col md={3}><Form.Label className="small fw-bold">ფასი (₾)</Form.Label><Form.Control value={t.salePrice} onChange={e => updateTransferee(i, 'salePrice', e.target.value)} /></Col>}
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}
                    <Button size="sm" variant="outline-success" onClick={addTransferee}>+ შემძენის დამატება</Button>
                    <Form.Text className={remainingShare < 0 ? 'text-danger d-block mt-1' : 'text-muted d-block mt-1'}>
                      სულ გადაიცემა: {totalTransferred}% | დარჩება: {remainingShare}%
                    </Form.Text>
                  </Col>

                  <Col md={12}><hr className="my-1" /><strong className="small text-muted">გასხვისებული წილი</strong></Col>
                  <Col md={3}>
                    <Form.Label className="small fw-bold">ბალანსური ღირებულება (₾)</Form.Label>
                    <Form.Control placeholder="0" value={transferForm.shareValue} onChange={e => setTransferForm({ ...transferForm, shareValue: e.target.value })} />
                  </Col>
                  {transferType === 'sale' && (
                    <Col md={9}>
                      <Form.Label className="small fw-bold">ანგარიშსწორების პირობები</Form.Label>
                      <Form.Control value={transferForm.paymentTerms} onChange={e => setTransferForm({ ...transferForm, paymentTerms: e.target.value })} />
                    </Col>
                  )}

                  <Col md={12}><hr className="my-1" /><strong className="small text-muted">ხელშეკრულების დეტალები</strong></Col>
                  <Col md={3}>
                    <Form.Label className="small fw-bold">ხელშეკრ. ნომერი</Form.Label>
                    <Form.Control placeholder="01/26" value={transferForm.contractNumber} onChange={e => setTransferForm({ ...transferForm, contractNumber: e.target.value })} />
                  </Col>
                  <Col md={3}>
                    <Form.Label className="small fw-bold">გაფ. თარიღი</Form.Label>
                    <Form.Control value={transferForm.contractDate} onChange={e => setTransferForm({ ...transferForm, contractDate: e.target.value })} />
                  </Col>
                  <Col md={3}>
                    <Form.Label className="small fw-bold">ქალაქი</Form.Label>
                    <Form.Control value={transferForm.city} onChange={e => setTransferForm({ ...transferForm, city: e.target.value })} />
                  </Col>
                  <Col md={3}>
                    <Form.Label className="small fw-bold">ნოტარიუსი (სურ.)</Form.Label>
                    <Form.Control placeholder="სახელი გვარი" value={transferForm.notaryName} onChange={e => setTransferForm({ ...transferForm, notaryName: e.target.value })} />
                  </Col>

                  <Col md={12} className="mt-2">
                    <DocBtns
                      makeDoc={(ws) => <ShareTransferPdf data={{ ...transferPdfData, withSignature: ws }} />}
                      fileName={`share-transfer-${transferType}-${transferForm.contractNumber || 'draft'}.pdf`}
                      label={transferType === 'gift' ? 'ჩუქების ხელშეკრ. გენერაცია' : 'ნასყიდობის ხელშეკრ. გენერაცია'}
                      variant={transferType === 'gift' ? 'success' : 'primary'}
                    />
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

            {/* 5. Service contract */}
            <Accordion.Item eventKey="service-contract">
              <Accordion.Header>📑 მომსახურების ხელშეკრულება (ინსპექტირება)</Accordion.Header>
              <Accordion.Body>
                <Row className="g-3">
                  <Col md={3}>
                    <Form.Label className="small fw-bold">ხელშეკრ. ნომერი</Form.Label>
                    <Form.Control placeholder="01/26" value={svcForm.contractNumber} onChange={e => setSvcForm({ ...svcForm, contractNumber: e.target.value })} />
                  </Col>
                  <Col md={3}>
                    <Form.Label className="small fw-bold">გაფ. თარიღი</Form.Label>
                    <Form.Control value={svcForm.contractDate} onChange={e => setSvcForm({ ...svcForm, contractDate: e.target.value })} />
                  </Col>
                  <Col md={3}>
                    <Form.Label className="small fw-bold">ქალაქი</Form.Label>
                    <Form.Control value={svcForm.city} onChange={e => setSvcForm({ ...svcForm, city: e.target.value })} />
                  </Col>
                  <Col md={3}>
                    <Form.Label className="small fw-bold">დამკვეთის ტიპი</Form.Label>
                    <Form.Select value={svcForm.clientType} onChange={e => setSvcForm({ ...svcForm, clientType: e.target.value })}>
                      <option value="physical">ფიზიკური პირი</option>
                      <option value="legal">იურიდიული პირი</option>
                    </Form.Select>
                  </Col>

                  <Col md={12}><hr className="my-1" /><strong className="small text-muted">დამკვეთი</strong></Col>
                  <Col md={4}>
                    <Form.Label className="small fw-bold">
                      {svcForm.clientType === 'legal' ? 'ორგანიზაციის სახელწოდება *' : 'სახელი, გვარი *'}
                    </Form.Label>
                    <Form.Control placeholder={svcForm.clientType === 'legal' ? 'შპს ...' : 'სახელი გვარი'} value={svcForm.clientName} onChange={e => setSvcForm({ ...svcForm, clientName: e.target.value })} />
                  </Col>
                  <Col md={3}>
                    <Form.Label className="small fw-bold">{svcForm.clientType === 'legal' ? 'ს/კ' : 'პ/ნ'}</Form.Label>
                    <Form.Control placeholder={svcForm.clientType === 'legal' ? 'საიდ. კოდი' : 'პირადი ნომერი'} value={svcForm.clientId} onChange={e => setSvcForm({ ...svcForm, clientId: e.target.value })} />
                  </Col>
                  <Col md={5}>
                    <Form.Label className="small fw-bold">{svcForm.clientType === 'legal' ? 'იურ. მისამართი' : 'მისამართი'}</Form.Label>
                    <Form.Control placeholder="მისამართი" value={svcForm.clientAddress} onChange={e => setSvcForm({ ...svcForm, clientAddress: e.target.value })} />
                  </Col>
                  {svcForm.clientType === 'legal' && (
                    <>
                      <Col md={4}>
                        <Form.Label className="small fw-bold">წარმომადგენელი (სახ. გვ.)</Form.Label>
                        <Form.Control placeholder="სახელი გვარი" value={svcForm.clientRepName} onChange={e => setSvcForm({ ...svcForm, clientRepName: e.target.value })} />
                      </Col>
                      <Col md={3}>
                        <Form.Label className="small fw-bold">წარმომადგ. პ/ნ</Form.Label>
                        <Form.Control placeholder="პირადი ნომერი" value={svcForm.clientRepId} onChange={e => setSvcForm({ ...svcForm, clientRepId: e.target.value })} />
                      </Col>
                    </>
                  )}

                  <Col md={12}><hr className="my-1" /><strong className="small text-muted">მომსახურება</strong></Col>
                  <Col md={5}>
                    <Form.Label className="small fw-bold">მომსახურების სახე</Form.Label>
                    <Form.Select value={svcForm.serviceType} onChange={e => setSvcForm({ ...svcForm, serviceType: e.target.value })}>
                      <option value="BE-PR-01">BE-PR-01 — ხარჯთაღრიცხვის საპროექტო დოკ.-თან შესაბამისობა</option>
                      <option value="BE-PR-02">BE-PR-02 — შესრულებული სამ. / ფორმა №2 ვერიფიკაცია</option>
                      <option value="BE-PR-03">BE-PR-03 — ფასწარმოქმნის ადეკვატურობის ინსპექტირება</option>
                    </Form.Select>
                  </Col>
                  <Col md={7}>
                    <Form.Label className="small fw-bold">ობიექტის მისამართი</Form.Label>
                    <Form.Control placeholder="ობიექტის სრული მისამართი" value={svcForm.objectAddress} onChange={e => setSvcForm({ ...svcForm, objectAddress: e.target.value })} />
                  </Col>
                  <Col md={12}>
                    <Form.Label className="small fw-bold">მომსახურების მოცულობა / სამუშაოს აღწერა</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="ინსპექტირების ფარგლები, შემოწმების ეტაპები და ა.შ." value={svcForm.serviceScope} onChange={e => setSvcForm({ ...svcForm, serviceScope: e.target.value })} />
                  </Col>

                  <Col md={12}><hr className="my-1" /><strong className="small text-muted">ანაზღაურება და ვადები</strong></Col>
                  <Col md={3}>
                    <Form.Label className="small fw-bold">საფასური (₾)</Form.Label>
                    <Form.Control placeholder="0.00" value={svcForm.serviceFee} onChange={e => setSvcForm({ ...svcForm, serviceFee: e.target.value })} />
                  </Col>
                  <Col md={3} className="d-flex align-items-end pb-1">
                    <Form.Check type="checkbox" label="დღგ-ს ჩათვლით" checked={svcForm.vatIncluded} onChange={e => setSvcForm({ ...svcForm, vatIncluded: e.target.checked })} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="small fw-bold">გადახდის პირობები</Form.Label>
                    <Form.Control value={svcForm.paymentTerms} onChange={e => setSvcForm({ ...svcForm, paymentTerms: e.target.value })} />
                  </Col>
                  <Col md={3}>
                    <Form.Label className="small fw-bold">ხელშ. დაწყება</Form.Label>
                    <Form.Control placeholder="09 მარტი, 2026 წელი" value={svcForm.contractStart} onChange={e => setSvcForm({ ...svcForm, contractStart: e.target.value })} />
                  </Col>
                  <Col md={3}>
                    <Form.Label className="small fw-bold">ხელშ. დასრულება</Form.Label>
                    <Form.Control placeholder="09 ივნისი, 2026 წელი" value={svcForm.contractEnd} onChange={e => setSvcForm({ ...svcForm, contractEnd: e.target.value })} />
                  </Col>

                  <Col md={12} className="mt-2">
                    <DocBtns
                      makeDoc={(ws) => <ServiceContractPdf data={{ ...svcForm, withSignature: ws }} />}
                      fileName={`service-contract-${svcForm.contractNumber || 'draft'}.pdf`}
                      label="მომსახურების ხელშეკრ. გენერაცია"
                      variant="warning"
                    />
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>

          </Accordion>
        </Card.Body>
      </Card>

      {/* Partner Modal */}
      <Modal show={showPartnerModal} onHide={() => setShowPartnerModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{editingPartnerIdx !== null ? '✏️ პარტნიორის რედაქტირება' : '+ ახალი პარტნიორი'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">სახელი, გვარი *</Form.Label>
            <Form.Control value={partnerForm.name} onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">პირადი ნომერი *</Form.Label>
            <Form.Control value={partnerForm.personalId} onChange={e => setPartnerForm({ ...partnerForm, personalId: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">მისამართი</Form.Label>
            <Form.Control value={partnerForm.address} onChange={e => setPartnerForm({ ...partnerForm, address: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">წილი (%) *</Form.Label>
            <Form.Control type="number" min="1" max="100" value={partnerForm.share} onChange={e => setPartnerForm({ ...partnerForm, share: e.target.value })} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPartnerModal(false)}>გაუქმება</Button>
          <Button variant="primary" onClick={savePartner} disabled={!partnerForm.name || !partnerForm.personalId}>შენახვა</Button>
        </Modal.Footer>
      </Modal>

      {/* Upload Modal */}
      <Modal show={showUpload} onHide={() => setShowUpload(false)} backdrop="static">
        <Modal.Header closeButton><Modal.Title>📁 დოკუმენტის ატვირთვა</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpload}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="fld-title" className="fw-bold small">სათაური *</Form.Label>
              <Form.Control id="fld-title" required value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })} placeholder="მაგ: წესდება v.1" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="fld-category" className="fw-bold small">კატეგორია</Form.Label>
              <Form.Select id="fld-category" value={uploadForm.category} onChange={e => setUploadForm({ ...uploadForm, category: e.target.value })}>
                <option>წესდება</option>
                <option>PO გადაწყვეტილება</option>
                <option>სადამფ. შეთანხმება</option>
                <option>სახელმწიფო რეგისტრაცია</option>
                <option>სხვა</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="fld-docDate" className="fw-bold small">თარიღი</Form.Label>
              <Form.Control id="fld-docDate" type="date" value={uploadForm.docDate} onChange={e => setUploadForm({ ...uploadForm, docDate: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="fld-description" className="fw-bold small">აღწერა</Form.Label>
              <Form.Control id="fld-description" as="textarea" rows={2} value={uploadForm.description} onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">ფაილი</Form.Label>
              <Form.Control type="file" onChange={e => setUploadFile(e.target.files[0])} />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowUpload(false)}>გაუქმება</Button>
              <Button variant="primary" type="submit" disabled={uploading}>{uploading ? '...' : 'ატვირთვა'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CompanyDocsPage;
