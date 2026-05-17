import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Form, Badge, Spinner, Table, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';

// PDF კომპონენტები
import PdfDocument from '../pdf-components/PdfDocument';
import ReportCoverPdf from '../pdf-components/ReportCoverPdf';
import ServiceContractPdf from '../pdf-components/ServiceContractPdf';

const InspectionDetails = ({ role }) => {
    const isReadOnly = role === 'quality_manager';
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // რედაქტირება
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    // ინსპექტირების ანგარიში
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportForm, setReportForm] = useState({});

    const SCOPE_NORMS = {
        'BE-PR-01': [
            'SST ISO/IEC 17020:2012 — შესაბამისობის შეფასება; ინსპექტირების ორგანოების მოთხოვნები',
            'ILAC G28:07/2018 — სახელმძღვანელო ინსპექტირების სფეროების ფორმულირებისთვის',
            'ხარჯთაღრიცხვის საპროექტო დოკუმენტაცია (წარდგენილი)',
            'მოქმედი ტექნიკური რეგლამენტები და სტანდარტები',
            'ორგანიზაციის ხარისხის სახელმძღვანელო (BE-QM)',
        ].join('\n'),
        'BE-PR-02': [
            'SST ISO/IEC 17020:2012 — შესაბამისობის შეფასება; ინსპექტირების ორგანოების მოთხოვნები',
            'ILAC G28:07/2018 — სახელმძღვანელო ინსპექტირების სფეროების ფორმულირებისთვის',
            'შესრულებული სამუშაოების აქტი — ფორმა №2 (KS-2)',
            'СНиП — სამშენებლო ნორმები და წესები (მოქმედი)',
            'მოქმედი ტექნიკური რეგლამენტები',
            'ორგანიზაციის ხარისხის სახელმძღვანელო (BE-QM)',
        ].join('\n'),
        'BE-PR-03': [
            'SST ISO/IEC 17020:2012 — შესაბამისობის შეფასება; ინსპექტირების ორგანოების მოთხოვნები',
            'ILAC G28:07/2018 — სახელმძღვანელო ინსპექტირების სფეროების ფორმულირებისთვის',
            'СНиП — სამშენებლო ნორმები და წესები (მოქმედი)',
            'ЕНиР — ნორმატიული სახელმძღვანელო სამუშაოთა ნორმებისათვის',
            'მოქმედი ბაზრის ფასები — ხარჯთაღრიცხვის ნორმატიული ბაზა',
            'ორგანიზაციის ხარისხის სახელმძღვანელო (BE-QM)',
        ].join('\n'),
        'BE-PR-04': [
            'SST ISO/IEC 17020:2012 — შესაბამისობის შეფასება; ინსპექტირების ორგანოების მოთხოვნები',
            'ILAC G28:07/2018 — სახელმძღვანელო ინსპექტირების სფეროების ფორმულირებისთვის',
            'СНиП 3.03.01-87 — სამშ. ნ&წ; სამშენებლო კონსტრუქციები',
            'მოქმედი ტექნიკური რეგლამენტები სამშ. სფეროში',
            'სამუშაო პროექტი და ხელშეკრულება (წარდგენილი)',
            'ორგანიზაციის ხარისხის სახელმძღვანელო (BE-QM)',
        ].join('\n'),
    };

    const openReportModal = () => {
        const fmtDate = d => d ? d.split('T')[0] : '';
        const scopeCode = ['BE-PR-01','BE-PR-02','BE-PR-03','BE-PR-04'].find(c => (data.inspectionScope||'').includes(c)) || '';
        const autoNorms = SCOPE_NORMS[scopeCode] || '';
        const autoSubmitted = Array.isArray(data.submittedDocs) && data.submittedDocs.length > 0
            ? data.submittedDocs.join('\n')
            : (data.applicationContent || '');
        const expertNames = Array.isArray(data.expert) && data.expert.length > 0
            ? data.expert.map(e => `${e.firstName||''} ${e.lastName||''}`.trim()).join(', ')
            : (data.expert ? `${data.expert.firstName||''} ${data.expert.lastName||''}`.trim() : '');
        const techMgrNames = Array.isArray(data.technicalManager) && data.technicalManager.length > 0
            ? data.technicalManager.map(e => `${e.firstName||''} ${e.lastName||''}`.trim()).join(', ')
            : (data.technicalManager ? `${data.technicalManager.firstName||''} ${data.technicalManager.lastName||''}`.trim() : '');
        setReportForm({
            inspectionNumber: data.inspectionNumber || '',
            issueDate: new Date().toISOString().split('T')[0],
            startDate: fmtDate(data.startDate),
            deadline: fmtDate(data.deadline),
            objectName: data.objectName || '',
            objectAddress: data.objectAddress || '',
            clientName: data.clientName || '',
            clientID: data.clientID || '',
            contactPerson: data.contactPerson || '',
            accreditationScope: data.inspectionScope || '',
            inspectionTask: data.applicationContent || '',
            expert: data.expert || [],
            expertNames,
            technicalManager: data.technicalManager || [],
            technicalManagerNames: techMgrNames,
            qualityManager: data.qualityManager || null,
            tenderNumber: data.tenderNumber || '',
            reportBasis: data.tenderNumber ? `განაცხადი / ხელშეკრულება № ${data.tenderNumber}` : '',
            submittedMaterials: autoSubmitted,
            normativeDocs: autoNorms,
            tools: '',
            conclusion: '',
            researchContent: '',
        });
        setShowReportModal(true);
    };

    // მომსახურების ხელშეკრულება
    const [showSvcModal, setShowSvcModal] = useState(false);
    const [svcForm, setSvcForm] = useState({});

    const openSvcModal = () => {
        const fmtDate = d => d ? new Date(d).toLocaleDateString('ka-GE', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
        setSvcForm({
            contractNumber: `SC-${data.inspectionNumber || ''}`,
            contractDate: new Date().toLocaleDateString('ka-GE'),
            city: 'ქ. თელავი',
            clientType: 'legal',
            clientName: data.clientName || '',
            clientId: data.clientID || '',
            clientAddress: '',
            clientRepName: data.contactPerson || '',
            clientRepId: '',
            serviceType: ['BE-PR-01','BE-PR-02','BE-PR-03','BE-PR-04'].find(c => (data.inspectionScope||'').includes(c)) || 'BE-PR-01',
            serviceScope: data.applicationContent || '',
            objectAddress: data.objectAddress || '',
            serviceFee: '',
            paymentTerms: 'ანგარიშ-ფაქტურის გამოწერიდან 5 (ხუთი) სამუშაო დღის ვადაში',
            contractStart: fmtDate(data.startDate),
            contractEnd: fmtDate(data.deadline),
            vatIncluded: true,
        });
        setShowSvcModal(true);
    };

    // ატვირთვა
    const [file, setFile] = useState(null);
    const [docType, setDocType] = useState('განცხადება');
    const [uploading, setUploading] = useState(false);

    // ინსპექტირების სფეროები (AddInspection-ის იდენტური)
    const inspectionScopes = [
        "ხარჯთაღრიცხვის პროექტთან შესაბამისობის ინსპექტირება (BE-PR-01)",
        "შესრულებული სამუშაოების და ფორმა №2-ის ინსპექტირება (BE-PR-02)",
        "ხარჯთაღრიცხვის ფასწარმოქმნის ადეკვატურობის ინსპექტირება (BE-PR-03)",
        "ტექნიკური ზედამხედველობა–ინსპექტირება (BE-PR-04)",
        "სხვა",
    ];

    // დოკუმენტების ტიპები რეგლამენტის მიხედვით
    const docTypes = [
        "განცხადება", "ხელშეკრულება (SC)", "ბრძანება",
        "ინსპექტირების ანგარიში (BX-INS)", "ფოტო მასალა", "სხვა"
    ];

    const fetchData = async () => {
        try {
            const res = await axios.get(`/api/inspections/${id}`);
            setData(res.data);
            setFormData(res.data); // ფორმისთვის
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
    };

    useEffect(() => { fetchData(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    // სტატუსის და ინფოს განახლება
    const handleSave = async () => {
        try {
            await axios.put(`/api/inspections/${id}`, formData);
            alert("✅ მონაცემები განახლდა!");
            setEditMode(false);
            fetchData();
        } catch (err) {
            alert("შეცდომა შენახვისას: " + err.message);
        }
    };

    // ატვირთვა
    const handleUpload = async () => {
        if (!file) return alert("აირჩიეთ ფაილი");
        setUploading(true);

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('docType', docType);

        try {
            await axios.post(`/api/inspections/${id}/upload`, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("✅ დოკუმენტი აიტვირთა");
            setFile(null);
            fetchData();
        } catch (err) {
            alert("შეცდომა ატვირთვისას");
        } finally { setUploading(false); }
    };

    if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;
    if (!data) return <Container className="mt-5">საქმე ვერ მოიძებნა</Container>;

    return (
        <>
        <Container className="pt-4 pb-5 font-georgian">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-4 rounded shadow-sm border-start border-5 border-primary">
                <div>
                    <Badge bg="primary" className="mb-2">საქმე № {data.inspectionNumber}</Badge>
                    <h4 className="fw-bold m-0">{data.objectName}</h4>
                    <span className="text-muted small">{data.clientName}</span>
                </div>
                <div className="d-flex gap-2">
                     {/* PDF ღილაკები - მონაცემებს ვაწვდით data prop-ით */}
                    <PDFDownloadLink document={<PdfDocument data={data} />} fileName={`Application-${data.inspectionNumber}.pdf`}>
                        {({ loading }) => <Button variant="outline-danger" size="sm" disabled={loading}>📄 განცხადება</Button>}
                    </PDFDownloadLink>

                    <Button variant="outline-success" size="sm" onClick={openReportModal}>📗 ინსპ. ანგარიში</Button>

                    <Button variant="outline-warning" size="sm" onClick={openSvcModal}>📑 ხელშეკრულება</Button>

                    <Button variant="secondary" size="sm" onClick={() => navigate('/inspections')}>უკან</Button>
                </div>
            </div>

            <Row className="g-4">
                {/* მარცხენა: დეტალები */}
                <Col lg={8}>
                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
                            <h6 className="m-0 fw-bold text-primary">🔧 საქმის დეტალები</h6>
                            {!isReadOnly && (
                                <Button variant={editMode ? "success" : "warning"} size="sm" onClick={() => editMode ? handleSave() : setEditMode(true)}>
                                    {editMode ? "💾 შენახვა" : "✏️ რედაქტირება"}
                                </Button>
                            )}
                        </Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                <Col md={6}>
                                    <Form.Label className="small fw-bold text-muted">სტატუსი</Form.Label>
                                    {editMode ? (
                                        <Form.Select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                            <option>რეგისტრირებული</option>
                                            <option>მიმდინარე</option>
                                            <option>დასრულებული</option>
                                        </Form.Select>
                                    ) : <div className="fw-bold"><Badge bg="info">{data.status}</Badge></div>}
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="small fw-bold text-muted">მისამართი</Form.Label>
                                    {editMode ? (
                                        <Form.Control value={formData.objectAddress || ''} onChange={e => setFormData({...formData, objectAddress: e.target.value})} />
                                    ) : <div>{data.objectAddress || '-'}</div>}
                                </Col>
                                <Col md={12}>
                                    <Form.Label className="small fw-bold text-muted">ინსპექტირების სფერო</Form.Label>
                                    {editMode ? (
                                        <Form.Select value={formData.inspectionScope || ''} onChange={e => setFormData({...formData, inspectionScope: e.target.value})}>
                                            {inspectionScopes.map(s => <option key={s}>{s}</option>)}
                                        </Form.Select>
                                    ) : <div>{data.inspectionScope || '-'}</div>}
                                </Col>
                                <Col md={4}>
                                    <Form.Label className="small fw-bold text-muted">ტენდერის ნომერი</Form.Label>
                                    {editMode ? (
                                        <Form.Control value={formData.tenderNumber || ''} onChange={e => setFormData({...formData, tenderNumber: e.target.value})} />
                                    ) : <div>{data.tenderNumber || '-'}</div>}
                                </Col>
                                <Col md={4}>
                                    <Form.Label className="small fw-bold text-muted">დაწყება</Form.Label>
                                    {editMode ? (
                                        <Form.Control type="date" value={formData.startDate ? formData.startDate.split('T')[0] : ''} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                                    ) : <div>{data.startDate ? new Date(data.startDate).toLocaleDateString('ka-GE') : '-'}</div>}
                                </Col>
                                <Col md={4}>
                                    <Form.Label className="small fw-bold text-muted">ვადა</Form.Label>
                                    {editMode ? (
                                        <Form.Control type="date" value={formData.deadline ? formData.deadline.split('T')[0] : ''} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                                    ) : <div>{data.deadline ? new Date(data.deadline).toLocaleDateString('ka-GE') : '-'}</div>}
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="small fw-bold text-muted">ელ.ფოსტა</Form.Label>
                                    {editMode ? (
                                        <Form.Control value={formData.clientEmail || ''} onChange={e => setFormData({...formData, clientEmail: e.target.value})} />
                                    ) : <div>{data.clientEmail || '-'}</div>}
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="small fw-bold text-muted">წარმომადგენელი</Form.Label>
                                    {editMode ? (
                                        <Form.Control value={formData.contactPerson || ''} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
                                    ) : <div>{data.contactPerson || '-'}</div>}
                                </Col>
                                {/* წარმოდგენილი დოკუმენტები */}
                                {(data.submittedDocs && data.submittedDocs.length > 0) && (
                                    <Col md={12}>
                                        <Form.Label className="small fw-bold text-muted">წარმოდგენილი დოკუმენტები</Form.Label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {data.submittedDocs.map(d => (
                                                <span key={d} className="badge bg-light text-dark border">{d}</span>
                                            ))}
                                        </div>
                                    </Col>
                                )}
                                <Col md={12}><hr/></Col>
                                <Col md={4}>
                                    <div className="small text-muted">ექსპერტი</div>
                                    <div className="fw-bold">
                                        {Array.isArray(data.expert) && data.expert.length > 0
                                            ? data.expert.map(e => `${e.firstName} ${e.lastName}`).join(', ')
                                            : (data.expert ? `${data.expert.firstName} ${data.expert.lastName}` : "დაუნიშვნელია")}
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="small text-muted">ტექ. მენეჯერი</div>
                                    <div className="fw-bold">
                                        {Array.isArray(data.technicalManager) && data.technicalManager.length > 0
                                            ? data.technicalManager.map(e => `${e.firstName} ${e.lastName}`).join(', ')
                                            : (data.technicalManager ? `${data.technicalManager.firstName} ${data.technicalManager.lastName}` : "-")}
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="small text-muted">ხარისხის მენეჯერი</div>
                                    <div className="fw-bold">{data.qualityManager ? `${data.qualityManager.firstName} ${data.qualityManager.lastName}` : "-"}</div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* დოკუმენტები */}
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white py-3"><h6 className="m-0 fw-bold text-primary">📂 დოკუმენტაცია</h6></Card.Header>
                        <Card.Body>
                            {!isReadOnly && (
                                <div className="d-flex gap-2 mb-3 bg-light p-3 rounded">
                                    <Form.Select size="sm" value={docType} onChange={e => setDocType(e.target.value)}>
                                        {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                    </Form.Select>
                                    <Form.Control type="file" size="sm" onChange={e => setFile(e.target.files[0])} />
                                    <Button size="sm" variant="success" onClick={handleUpload} disabled={uploading}>
                                        {uploading ? '...' : 'ატვირთვა'}
                                    </Button>
                                </div>
                            )}
                            
                            <Table hover size="sm" className="align-middle">
                                <thead><tr><th>დოკუმენტი</th><th>მოქმედება</th></tr></thead>
                                <tbody>
                                    {data.documents && Object.entries(data.documents).map(([key, path]) => (
                                        <tr key={key}>
                                            <td><Badge bg="secondary" className="me-2">{key}</Badge></td>
                                            <td>
                                                <div className="d-flex gap-2 align-items-center">
                                                    <a href={`/${path}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">👁 ნახვა</a>
                                                    {!isReadOnly && (
                                                        <Button size="sm" variant="outline-danger" onClick={async () => {
                                                            if (!window.confirm(`წაიშალოს "${key}"?`)) return;
                                                            const newDocs = { ...data.documents };
                                                            delete newDocs[key];
                                                            try {
                                                                await axios.put(`/api/inspections/${id}`, { documents: newDocs });
                                                                fetchData();
                                                            } catch { alert('შეცდომა'); }
                                                        }}>🗑️</Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!data.documents || Object.keys(data.documents).length === 0) && <tr><td colSpan="2" className="text-center text-muted">დოკუმენტები არ არის</td></tr>}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                {/* მარჯვენა: დამკვეთი */}
                <Col lg={4}>
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Header className="bg-light py-3"><h6 className="m-0 fw-bold">დამკვეთის ინფო</h6></Card.Header>
                        <Card.Body>
                            <p className="mb-2"><strong>ორგანიზაცია:</strong> <br/> {data.clientName}</p>
                            <p className="mb-2"><strong>ს/კ:</strong> <br/> {data.clientID}</p>
                            <p className="mb-2"><strong>ტელეფონი:</strong> <br/> {data.clientPhone || '-'}</p>
                            <hr/>
                            <div className="small text-muted fst-italic">
                                "{data.applicationContent}"
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

        {/* მომსახურების ხელშეკრულების გენერატორი */}
        <Modal show={showSvcModal} onHide={() => setShowSvcModal(false)} size="lg" backdrop="static">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">📑 მომსახურების ხელშეკრულება — საქმე № {data.inspectionNumber}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="g-3">
                    <Col md={4}>
                        <Form.Label className="small fw-bold">ხელშეკრ. ნომერი</Form.Label>
                        <Form.Control value={svcForm.contractNumber || ''} onChange={e => setSvcForm({ ...svcForm, contractNumber: e.target.value })} />
                    </Col>
                    <Col md={4}>
                        <Form.Label className="small fw-bold">გაფ. თარიღი</Form.Label>
                        <Form.Control value={svcForm.contractDate || ''} onChange={e => setSvcForm({ ...svcForm, contractDate: e.target.value })} />
                    </Col>
                    <Col md={4}>
                        <Form.Label className="small fw-bold">დამკვეთის ტიპი</Form.Label>
                        <Form.Select value={svcForm.clientType || 'legal'} onChange={e => setSvcForm({ ...svcForm, clientType: e.target.value })}>
                            <option value="legal">იურიდიული პირი</option>
                            <option value="physical">ფიზიკური პირი</option>
                        </Form.Select>
                    </Col>

                    <Col md={12}><hr className="my-1" /><small className="text-muted fw-bold">დამკვეთი (ავტომატურად შეავსო)</small></Col>
                    <Col md={5}>
                        <Form.Label className="small fw-bold">{svcForm.clientType === 'legal' ? 'ორგანიზაცია' : 'სახელი, გვარი'}</Form.Label>
                        <Form.Control value={svcForm.clientName || ''} onChange={e => setSvcForm({ ...svcForm, clientName: e.target.value })} />
                    </Col>
                    <Col md={3}>
                        <Form.Label className="small fw-bold">{svcForm.clientType === 'legal' ? 'ს/კ' : 'პ/ნ'}</Form.Label>
                        <Form.Control value={svcForm.clientId || ''} onChange={e => setSvcForm({ ...svcForm, clientId: e.target.value })} />
                    </Col>
                    <Col md={4}>
                        <Form.Label className="small fw-bold">იურ. / ფაქტ. მისამართი</Form.Label>
                        <Form.Control placeholder="მისამართი" value={svcForm.clientAddress || ''} onChange={e => setSvcForm({ ...svcForm, clientAddress: e.target.value })} />
                    </Col>
                    {svcForm.clientType === 'legal' && (
                        <>
                            <Col md={5}>
                                <Form.Label className="small fw-bold">წარმომადგენელი</Form.Label>
                                <Form.Control value={svcForm.clientRepName || ''} onChange={e => setSvcForm({ ...svcForm, clientRepName: e.target.value })} />
                            </Col>
                            <Col md={3}>
                                <Form.Label className="small fw-bold">წარმომადგ. პ/ნ</Form.Label>
                                <Form.Control placeholder="პირადი ნომერი" value={svcForm.clientRepId || ''} onChange={e => setSvcForm({ ...svcForm, clientRepId: e.target.value })} />
                            </Col>
                        </>
                    )}

                    <Col md={12}><hr className="my-1" /><small className="text-muted fw-bold">მომსახურება (ავტომატურად შეავსო)</small></Col>
                    <Col md={5}>
                        <Form.Label className="small fw-bold">მომსახურების სახე</Form.Label>
                        <Form.Control value={svcForm.serviceType || ''} onChange={e => setSvcForm({ ...svcForm, serviceType: e.target.value })} />
                    </Col>
                    <Col md={7}>
                        <Form.Label className="small fw-bold">ობიექტის მისამართი</Form.Label>
                        <Form.Control value={svcForm.objectAddress || ''} onChange={e => setSvcForm({ ...svcForm, objectAddress: e.target.value })} />
                    </Col>
                    <Col md={12}>
                        <Form.Label className="small fw-bold">მომსახურების მოცულობა / განაცხადის შინაარსი</Form.Label>
                        <Form.Control as="textarea" rows={3} value={svcForm.serviceScope || ''} onChange={e => setSvcForm({ ...svcForm, serviceScope: e.target.value })} />
                    </Col>

                    <Col md={12}><hr className="my-1" /><small className="text-muted fw-bold">ანაზღაურება და ვადები</small></Col>
                    <Col md={3}>
                        <Form.Label className="small fw-bold">საფასური (₾) *</Form.Label>
                        <Form.Control placeholder="0.00" value={svcForm.serviceFee || ''} onChange={e => setSvcForm({ ...svcForm, serviceFee: e.target.value })} />
                    </Col>
                    <Col md={3} className="d-flex align-items-end pb-2">
                        <Form.Check type="checkbox" label="დღგ-ს ჩათვლით" checked={!!svcForm.vatIncluded} onChange={e => setSvcForm({ ...svcForm, vatIncluded: e.target.checked })} />
                    </Col>
                    <Col md={6}>
                        <Form.Label className="small fw-bold">გადახდის პირობები</Form.Label>
                        <Form.Control value={svcForm.paymentTerms || ''} onChange={e => setSvcForm({ ...svcForm, paymentTerms: e.target.value })} />
                    </Col>
                    <Col md={4}>
                        <Form.Label className="small fw-bold">ხელშ. დაწყება</Form.Label>
                        <Form.Control value={svcForm.contractStart || ''} onChange={e => setSvcForm({ ...svcForm, contractStart: e.target.value })} />
                    </Col>
                    <Col md={4}>
                        <Form.Label className="small fw-bold">ხელშ. დასრულება</Form.Label>
                        <Form.Control value={svcForm.contractEnd || ''} onChange={e => setSvcForm({ ...svcForm, contractEnd: e.target.value })} />
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="secondary" onClick={() => setShowSvcModal(false)}>დახურვა</Button>
                <PDFDownloadLink
                    document={<ServiceContractPdf data={svcForm} />}
                    fileName={`service-contract-${svcForm.contractNumber || data.inspectionNumber}.pdf`}
                >
                    {({ loading }) => (
                        <Button variant="warning" disabled={loading}>
                            {loading ? '⏳ მზადდება...' : '📄 ხელშეკრულების გადმოწერა'}
                        </Button>
                    )}
                </PDFDownloadLink>
            </Modal.Footer>
        </Modal>

        {/* ინსპექტირების ანგარიშის გენერატორი */}
        <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="xl" backdrop="static">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">📗 ინსპექტირების ანგარიში — № {data.inspectionNumber}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '78vh', overflowY: 'auto' }}>
                <Row className="g-3">
                    {/* ── ძირითადი ინფო ── */}
                    <Col md={12}><small className="fw-bold text-muted">📋 ძირითადი ინფო</small></Col>

                    <Col md={3}>
                        <Form.Label className="small fw-bold">ანგარიშის N</Form.Label>
                        <Form.Control size="sm" value={reportForm.inspectionNumber || ''} onChange={e => setReportForm({...reportForm, inspectionNumber: e.target.value})} />
                    </Col>
                    <Col md={3}>
                        <Form.Label className="small fw-bold">გაცემის თარიღი</Form.Label>
                        <Form.Control size="sm" type="date" value={reportForm.issueDate || ''} onChange={e => setReportForm({...reportForm, issueDate: e.target.value})} />
                    </Col>
                    <Col md={3}>
                        <Form.Label className="small fw-bold">ინსპ. დაწყება</Form.Label>
                        <Form.Control size="sm" type="date" value={reportForm.startDate || ''} onChange={e => setReportForm({...reportForm, startDate: e.target.value})} />
                    </Col>
                    <Col md={3}>
                        <Form.Label className="small fw-bold">ინსპ. დასრულება</Form.Label>
                        <Form.Control size="sm" type="date" value={reportForm.deadline || ''} onChange={e => setReportForm({...reportForm, deadline: e.target.value})} />
                    </Col>

                    <Col md={6}>
                        <Form.Label className="small fw-bold">ობიექტის დასახელება</Form.Label>
                        <Form.Control size="sm" value={reportForm.objectName || ''} onChange={e => setReportForm({...reportForm, objectName: e.target.value})} />
                    </Col>
                    <Col md={6}>
                        <Form.Label className="small fw-bold">ობიექტის მისამართი</Form.Label>
                        <Form.Control size="sm" value={reportForm.objectAddress || ''} onChange={e => setReportForm({...reportForm, objectAddress: e.target.value})} />
                    </Col>
                    <Col md={5}>
                        <Form.Label className="small fw-bold">დამკვეთი</Form.Label>
                        <Form.Control size="sm" value={reportForm.clientName || ''} onChange={e => setReportForm({...reportForm, clientName: e.target.value})} />
                    </Col>
                    <Col md={3}>
                        <Form.Label className="small fw-bold">ს/კ</Form.Label>
                        <Form.Control size="sm" value={reportForm.clientID || ''} onChange={e => setReportForm({...reportForm, clientID: e.target.value})} />
                    </Col>
                    <Col md={4}>
                        <Form.Label className="small fw-bold">წარმომადგენელი</Form.Label>
                        <Form.Control size="sm" value={reportForm.contactPerson || ''} onChange={e => setReportForm({...reportForm, contactPerson: e.target.value})} />
                    </Col>
                    <Col md={12}>
                        <Form.Label className="small fw-bold">აკრედიტაციის სფერო / ინსპ. სახე</Form.Label>
                        <Form.Control size="sm" value={reportForm.accreditationScope || ''} onChange={e => setReportForm({...reportForm, accreditationScope: e.target.value})} />
                    </Col>
                    <Col md={12}>
                        <Form.Label className="small fw-bold">ინსპექტირების ამოცანა / განაცხადის შინაარსი</Form.Label>
                        <Form.Control size="sm" as="textarea" rows={2} value={reportForm.inspectionTask || ''} onChange={e => setReportForm({...reportForm, inspectionTask: e.target.value})} />
                    </Col>

                    {/* ── ანგარიშის შინაარსი ── */}
                    <Col md={12}><hr className="my-1" /><small className="fw-bold text-muted">📝 ანგარიშის შინაარსი</small></Col>

                    <Col md={12}>
                        <Form.Label className="small fw-bold">ანგარიშის შედგენის საფუძველი</Form.Label>
                        <Form.Control size="sm" as="textarea" rows={2} placeholder="მაგ: ხელშ. N SC-001, განაცხადი №..." value={reportForm.reportBasis || ''} onChange={e => setReportForm({...reportForm, reportBasis: e.target.value})} />
                    </Col>
                    <Col md={6}>
                        <Form.Label className="small fw-bold">წარმოდგენილი მასალები</Form.Label>
                        <Form.Control size="sm" as="textarea" rows={4} placeholder="თითო ჩანაწერი ახალ ხაზზე&#10;მაგ: პროექტი, ნახაზები&#10;ხარჯთაღრიცხვა" value={reportForm.submittedMaterials || ''} onChange={e => setReportForm({...reportForm, submittedMaterials: e.target.value})} />
                    </Col>
                    <Col md={6}>
                        <Form.Label className="small fw-bold">ნორმ. დოკუმენტაცია</Form.Label>
                        <Form.Control size="sm" as="textarea" rows={4} placeholder="მაგ: ISO/IEC 17020:2012&#10;СНиП 3.03.01-87&#10;სამშენ. ნებართვა" value={reportForm.normativeDocs || ''} onChange={e => setReportForm({...reportForm, normativeDocs: e.target.value})} />
                    </Col>
                    <Col md={12}>
                        <Form.Label className="small fw-bold">გამოყენებული ხელსაწყოები / მოწყობილობები</Form.Label>
                        <Form.Control size="sm" as="textarea" rows={2} placeholder="მაგ: მეტრი, ლაზერული ანაზომი, ფოტოაპარატი..." value={reportForm.tools || ''} onChange={e => setReportForm({...reportForm, tools: e.target.value})} />
                    </Col>

                    {/* ── ძირითადი ველები ── */}
                    <Col md={12}><hr className="my-1" /><small className="fw-bold text-success">★ ძირითადი შედეგები</small></Col>

                    <Col md={12}>
                        <Form.Label className="small fw-bold text-success">დასკვნა</Form.Label>
                        <Form.Control as="textarea" rows={6} placeholder="ინსპექტირების საბოლოო დასკვნა — შეუსაბამობები, შედეგი, რეკომენდაციები..." value={reportForm.conclusion || ''} onChange={e => setReportForm({...reportForm, conclusion: e.target.value})} />
                    </Col>
                    <Col md={12}>
                        <Form.Label className="small fw-bold text-primary">კვლევითი ნაწილი</Form.Label>
                        <Form.Control as="textarea" rows={8} placeholder="კვლევის მეთოდოლოგია, შემოწმებული ელემენტები, გამოვლენილი ფაქტები, გაზომვების შედეგები..." value={reportForm.researchContent || ''} onChange={e => setReportForm({...reportForm, researchContent: e.target.value})} />
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="secondary" onClick={() => setShowReportModal(false)}>დახურვა</Button>
                <PDFDownloadLink
                    document={<ReportCoverPdf data={reportForm} />}
                    fileName={`inspection-report-${reportForm.inspectionNumber || 'draft'}.pdf`}
                >
                    {({ loading }) => (
                        <Button variant="success" disabled={loading}>
                            {loading ? '⏳ მზადდება...' : '📗 ანგარიშის გადმოწერა'}
                        </Button>
                    )}
                </PDFDownloadLink>
            </Modal.Footer>
        </Modal>
        </>
    );
};

export default InspectionDetails;