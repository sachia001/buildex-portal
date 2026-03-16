import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Row, Col, Form, Button, Table, Badge, Spinner, Modal, Nav, Tab } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';
import DirectorsOrderPdf from '../pdf-components/DirectorsOrderPdf';
import LaborContractPdf from '../pdf-components/LaborContractPdf';
import { generateDocNumber } from '../utils/docCategories';

const StaffDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    // Upload State
    const [docType, setDocType] = useState('პირადობა');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const docOptions = ["პირადობა", "CV", "დიპლომი", "სერთიფიკატი", "ბრძანება", "ხელშეკრულება"];

    // PDF Generation State
    const [salary, setSalary] = useState('');
    const [address, setAddress] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [contractNumber, setContractNumber] = useState('LC-2026-001');
    const [signatureImage, setSignatureImage] = useState(null);
    const sigPadRef = useRef({});

    const clearSignature = () => { sigPadRef.current.clear(); setSignatureImage(null); };
    const saveSignature = () => {
        if (sigPadRef.current.isEmpty()) return alert("ჯერ დახატეთ ხელმოწერა!");
        setSignatureImage(sigPadRef.current.getCanvas().toDataURL('image/png'));
    };

    const fetchUser = async () => {
        try {
            const res = await axios.get(`/api/users/${id}`);
            setUser(res.data);
            setNewStatus(res.data.status);
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchUser(); }, [id]);

    const handleUpload = async () => {
        if (!file) return alert("აირჩიეთ ფაილი!");
        const formData = new FormData();
        formData.append('file', file);
        formData.append('docType', docType);
        setUploading(true);
        try {
            await axios.post(`/api/users/${id}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("✅ ფაილი აიტვირთა!");
            setFile(null);
            fetchUser();
        } catch (err) { alert("ატვირთვა ვერ მოხერხდა!"); }
        finally { setUploading(false); }
    };

    const deleteDoc = async (key) => {
        if (!window.confirm("წავშალოთ დოკუმენტი?")) return;
        const newDocs = { ...user.documents };
        delete newDocs[key];
        try {
            await axios.put(`/api/users/${id}`, { documents: newDocs });
            fetchUser();
        } catch (err) { alert("ვერ წაიშალა"); }
    };

    const handleStatusChange = async () => {
        try {
            await axios.put(`/api/users/${id}`, { status: newStatus });
            setShowStatusModal(false);
            fetchUser();
            alert("✅ სტატუსი შეიცვალა");
        } catch (error) { alert("შეცდომა"); }
    };

    // Build PDF data objects from staff profile
    const buildOrderData = (withSig) => {
        const fullName = `${user.firstName} ${user.lastName}`;
        return {
            number: generateDocNumber('DIRECTOR_HR', 1),
            date: new Date().toLocaleDateString('ka-GE'),
            subject: `${fullName}-ს ${user.position} პოზიციაზე დანიშვნის შესახებ`,
            preamble: `საქართველოს ორგანული კანონის „საქართველოს შრომის კოდექსის" მე-6 და მე-9 მუხლების, კომპანიის წესდებისა და საშტატო ნუსხის საფუძველზე, ასევე კანდიდატის კვალიფიკაციის SST ISO/IEC 17020:2012 სტანდარტის მოთხოვნებთან შესაბამისობის დადასტურების გათვალისწინებით,`,
            clauses: [
                { title: "დანიშვნა", text: `${fullName} (პ/ნ ${user.personalId}) დაინიშნოს შპს „ბილდექს ექსპერტიზა"-ში ${user.position} პოზიციაზე, ${startDate}-დან.` },
                { title: "ანაზღაურება", text: `შრომის ანაზღაურება განისაზღვროს თვეში ${salary || '___'} ლარის ოდენობით (დარიცხული), შრომითი ხელშეკრულების პირობების შესაბამისად.` },
                { title: "ფუნქცია-მოვალეობები", text: `დასაქმებულის უფლება-მოვალეობები განისაზღვროს თანამდებობრივი ინსტრუქციით, რომელიც წარმოადგენს შრომითი ხელშეკრულების განუყოფელ ნაწილს.` },
                { title: "ISO 17020 ვალდებულება", text: `დანიშვნისთანავე დასაქმებულმა ხელი მოაწეროს „დამოუკიდებლობისა და მიუკერძოებლობის დეკლარაციას" და გაეცნოს ხარისხის სახელმძღვანელოს.` },
                { title: "საფუძველი", text: `მხარეთა შორის გაფორმებული შრომითი ხელშეკრულება; ${fullName}-ს განცხადება/CV.` },
                { title: "", text: "ბრძანება ძალაშია ხელმოწერისთანავე." }
            ],
            directorName: "ლევან საჩიშვილი",
            signature: withSig ? signatureImage : null
        };
    };

    const buildContractData = (withSig) => ({
        employeeName: `${user.firstName} ${user.lastName}`,
        personalId: user.personalId,
        address: address || '___',
        phone: user.phone || '___',
        position: user.position,
        salary: salary || '___',
        startDate,
        contractNumber,
        date: new Date().toLocaleDateString('ka-GE'),
        directorSignature: withSig ? signatureImage : null
    });

    const orderValid = !!startDate;
    const contractValid = !!(startDate && contractNumber);

    if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;
    if (!user) return <Container className="mt-5 text-center">თანამშრომელი ვერ მოიძებნა</Container>;

    const photoUrl = user.photo ? `/${user.photo}` : null;

    return (
        <Container className="mt-4 font-georgian pb-5">
            <Button variant="outline-secondary" className="mb-3" onClick={() => navigate('/admin')}>← უკან სიაში</Button>

            <Row>
                {/* Left: Profile card */}
                <Col md={4}>
                    <Card className="border-0 shadow-lg rounded-4 overflow-hidden text-center mb-4">
                        <div className="bg-primary p-4 d-flex justify-content-center align-items-center" style={{ minHeight: '150px' }}>
                            {photoUrl ? (
                                <img src={photoUrl} alt="Profile" className="rounded-circle shadow" style={{ width: 120, height: 120, objectFit: 'cover', border: '4px solid white' }} />
                            ) : (
                                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: 120, height: 120, fontSize: '3rem', border: '4px solid white' }}>👤</div>
                            )}
                        </div>
                        <Card.Body className="pt-3">
                            <h4 className="fw-bold">{user.firstName} {user.lastName}</h4>
                            <p className="text-muted mb-2">{user.position}</p>
                            <Badge bg={user.status === 'აქტიური' ? 'success' : 'secondary'} className="mb-3 px-3 py-2 fs-6">{user.status}</Badge>
                            <br />
                            <Button variant="outline-primary" size="sm" onClick={() => setShowStatusModal(true)}>🔄 სტატუსის შეცვლა</Button>
                            <div className="text-start bg-light p-3 rounded small mt-4">
                                <p className="mb-1"><strong>🆔 პ/ნ:</strong> {user.personalId}</p>
                                <p className="mb-1"><strong>📞 ტელ:</strong> {user.phone || '-'}</p>
                                <p className="mb-0"><strong>📅 ვადა:</strong> {user.authExpiry ? new Date(user.authExpiry).toLocaleDateString() : '-'}</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right: Tabs */}
                <Col md={8}>
                    <Tab.Container defaultActiveKey="docs">
                        <Nav variant="tabs" className="mb-3">
                            <Nav.Item><Nav.Link eventKey="docs">📂 პირადი საქმე</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="generate">📄 დოკუმენტების გენერაცია</Nav.Link></Nav.Item>
                        </Nav>

                        <Tab.Content>
                            {/* TAB 1: Document upload/view */}
                            <Tab.Pane eventKey="docs">
                                <Card className="border-0 shadow-sm rounded-4 p-4">
                                    <div className="d-flex gap-2 p-3 bg-light rounded mb-3 align-items-end flex-wrap">
                                        <div className="flex-grow-1" style={{ minWidth: '150px' }}>
                                            <Form.Label className="small fw-bold">დოკუმენტის ტიპი</Form.Label>
                                            <Form.Select size="sm" value={docType} onChange={e => setDocType(e.target.value)}>
                                                {docOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                            </Form.Select>
                                        </div>
                                        <div className="flex-grow-1" style={{ minWidth: '200px' }}>
                                            <Form.Label className="small fw-bold">ფაილის არჩევა</Form.Label>
                                            <Form.Control type="file" size="sm" onChange={e => setFile(e.target.files[0])} />
                                        </div>
                                        <Button size="sm" variant="success" onClick={handleUpload} disabled={uploading}>
                                            {uploading ? '...' : 'ატვირთვა'}
                                        </Button>
                                    </div>
                                    <Table hover responsive className="align-middle">
                                        <thead className="table-light"><tr><th>დასახელება</th><th>ქმედება</th></tr></thead>
                                        <tbody>
                                            {user.documents && Object.keys(user.documents).length > 0 ? (
                                                Object.entries(user.documents).map(([key, path]) => (
                                                    <tr key={key}>
                                                        <td className="fw-bold text-dark">{key}</td>
                                                        <td>
                                                            <a href={`/${path}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-link text-decoration-none">👁️ ნახვა</a>
                                                            <Button size="sm" variant="outline-danger" className="ms-2" onClick={() => deleteDoc(key)}>🗑️</Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan="2" className="text-center text-muted py-4">დოკუმენტები არ არის ატვირთული</td></tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Card>
                            </Tab.Pane>

                            {/* TAB 2: PDF generation */}
                            <Tab.Pane eventKey="generate">
                                <Card className="border-0 shadow-sm rounded-4 p-4">
                                    <h6 className="fw-bold text-primary mb-3">📋 დოკუმენტების პარამეტრები</h6>
                                    <Row className="g-3 mb-3">
                                        <Col md={6}>
                                            <Form.Label className="small fw-bold">დაწყების თარიღი</Form.Label>
                                            <Form.Control type="date" size="sm" value={startDate} onChange={e => setStartDate(e.target.value)} />
                                        </Col>
                                        <Col md={6}>
                                            <Form.Label className="small fw-bold">ხელფასი (ლარი)</Form.Label>
                                            <Form.Control type="number" size="sm" value={salary} onChange={e => setSalary(e.target.value)} placeholder="მაგ: 1500" />
                                        </Col>
                                        <Col md={6}>
                                            <Form.Label className="small fw-bold">ხელშეკრულების №</Form.Label>
                                            <Form.Control size="sm" value={contractNumber} onChange={e => setContractNumber(e.target.value)} />
                                        </Col>
                                        <Col md={6}>
                                            <Form.Label className="small fw-bold">მისამართი (ხელშეკრ.)</Form.Label>
                                            <Form.Control size="sm" value={address} onChange={e => setAddress(e.target.value)} placeholder="ფაქტობრივი მისამართი" />
                                        </Col>
                                    </Row>

                                    <hr />
                                    <h6 className="fw-bold text-primary mb-2">
                                        ✍️ დირექტორის ხელმოწერა <small className="text-muted fw-normal">(არასავალდებულო)</small>
                                    </h6>
                                    <div className="border rounded mb-2" style={{ backgroundColor: '#f8f9fa', display: 'inline-block' }}>
                                        <SignatureCanvas
                                            ref={sigPadRef}
                                            penColor="black"
                                            canvasProps={{ width: 380, height: 120, className: 'sigCanvas' }}
                                        />
                                    </div>
                                    <div className="d-flex gap-2 mb-2">
                                        <Button variant="outline-secondary" size="sm" onClick={clearSignature}>გასუფთავება</Button>
                                        <Button variant="outline-primary" size="sm" onClick={saveSignature}>✅ ხელმოწერის დადასტურება</Button>
                                    </div>
                                    {signatureImage
                                        ? <p className="text-success small mb-3">✔ ხელმოწერა შენახულია — PDF-ში ჩაიდება</p>
                                        : <p className="text-muted small mb-3">ხელმოწერის გარეშეც გენერირება შეიძლება — ველი ცარიელი დარჩება</p>
                                    }

                                    <hr />
                                    <h6 className="fw-bold text-primary mb-3">⬇️ PDF გენერაცია</h6>
                                    <div className="d-flex flex-wrap gap-3">
                                        {orderValid ? (
                                            <>
                                                <PDFDownloadLink
                                                    document={<DirectorsOrderPdf data={buildOrderData(!!signatureImage)} />}
                                                    fileName={`დანიშვნის_ბრძანება_${user.firstName}_${user.lastName}.pdf`}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    {({ loading: pdfLoading }) => (
                                                        <Button variant={signatureImage ? 'success' : 'outline-success'} size="sm" disabled={pdfLoading}>
                                                            {pdfLoading ? '...' : `📥 დანიშვნის ბრძანება${signatureImage ? ' (ხელმოწ. ✓)' : ''}`}
                                                        </Button>
                                                    )}
                                                </PDFDownloadLink>

                                                {signatureImage && (
                                                    <PDFDownloadLink
                                                        document={<DirectorsOrderPdf data={buildOrderData(false)} />}
                                                        fileName={`დანიშვნის_ბრძანება_${user.firstName}_${user.lastName}_blank.pdf`}
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        {({ loading: pdfLoading }) => (
                                                            <Button variant="outline-secondary" size="sm" disabled={pdfLoading}>
                                                                {pdfLoading ? '...' : '📄 ბრძანება (ხელმოწ. გარეშე)'}
                                                            </Button>
                                                        )}
                                                    </PDFDownloadLink>
                                                )}
                                            </>
                                        ) : null}

                                        {contractValid ? (
                                            <>
                                                <PDFDownloadLink
                                                    document={<LaborContractPdf data={buildContractData(!!signatureImage)} />}
                                                    fileName={`ხელშეკრულება_${user.firstName}_${user.lastName}.pdf`}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    {({ loading: pdfLoading }) => (
                                                        <Button variant={signatureImage ? 'primary' : 'outline-primary'} size="sm" disabled={pdfLoading}>
                                                            {pdfLoading ? '...' : `📥 შრომ. ხელშეკრ.${signatureImage ? ' (ხელმოწ. ✓)' : ''}`}
                                                        </Button>
                                                    )}
                                                </PDFDownloadLink>

                                                {signatureImage && (
                                                    <PDFDownloadLink
                                                        document={<LaborContractPdf data={buildContractData(false)} />}
                                                        fileName={`ხელშეკრულება_${user.firstName}_${user.lastName}_blank.pdf`}
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        {({ loading: pdfLoading }) => (
                                                            <Button variant="outline-secondary" size="sm" disabled={pdfLoading}>
                                                                {pdfLoading ? '...' : '📄 ხელშეკრ. (ხელმოწ. გარეშე)'}
                                                            </Button>
                                                        )}
                                                    </PDFDownloadLink>
                                                )}
                                            </>
                                        ) : null}

                                        {!orderValid && (
                                            <p className="text-muted small mt-1">შეავსეთ „დაწყების თარიღი" PDF-ის გენერაციისთვის</p>
                                        )}
                                    </div>
                                </Card>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Col>
            </Row>

            {/* Status Change Modal */}
            <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>სტატუსის შეცვლა</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                        <option value="აქტიური">აქტიური</option>
                        <option value="შვებულებაში">შვებულებაში</option>
                        <option value="გათავისუფლებული">გათავისუფლებული</option>
                    </Form.Select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowStatusModal(false)}>დახურვა</Button>
                    <Button variant="primary" onClick={handleStatusChange}>შენახვა</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default StaffDetails;
