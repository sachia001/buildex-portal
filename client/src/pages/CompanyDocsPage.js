import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Form, Table, Badge, Modal, Accordion } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ShareTransferPdf from '../pdf-components/ShareTransferPdf';

const CompanyDocsPage = ({ role }) => {
    const [docs, setDocs] = useState([]);
    const [showUpload, setShowUpload] = useState(false);
    const [uploadForm, setUploadForm] = useState({ title: '', category: 'სხვა', description: '', docDate: new Date().toISOString().split('T')[0] });
    const [uploadFile, setUploadFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Share transfer form state
    const [transferType, setTransferType] = useState('gift');
    const [transferForm, setTransferForm] = useState({
        transferorName: 'ლევან საჩიშვილი',
        transferorId: '20001017959',
        transferorAddress: 'ქ. თელავი, ლეონიძის ქ. №22',
        transfereeName: '',
        transfereeId: '',
        transfereeAddress: '',
        sharePercent: '100',
        shareValue: '',
        salePrice: '',
        paymentTerms: 'ხელშეკრულების გაფორმებიდან 5 სამუშაო დღის ვადაში',
        contractDate: new Date().toLocaleDateString('ka-GE'),
        contractNumber: '',
        city: 'ქ. თელავი',
        notaryName: '',
    });

    const fetchDocs = async () => {
        try {
            const res = await axios.get('/api/company-docs');
            setDocs(Array.isArray(res.data) ? res.data : []);
        } catch { setDocs([]); }
    };

    useEffect(() => { fetchDocs(); }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('data', JSON.stringify(uploadForm));
            if (uploadFile) fd.append('file', uploadFile);
            await axios.post('/api/company-docs', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setShowUpload(false);
            setUploadForm({ title: '', category: 'სხვა', description: '', docDate: new Date().toISOString().split('T')[0] });
            setUploadFile(null);
            fetchDocs();
        } catch (err) { alert('შეცდომა: ' + (err.response?.data?.error || err.message)); }
        finally { setUploading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('ნამდვილად გსურთ წაშლა?')) return;
        try { await axios.delete(`/api/company-docs/${id}`); fetchDocs(); }
        catch { alert('წაშლა ვერ მოხერხდა'); }
    };

    const catVariant = cat => ({ 'წესდება': 'primary', 'PO გადაწყვეტილება': 'success', 'სხვა': 'secondary' }[cat] || 'secondary');

    const pdfData = { transferType, ...transferForm };

    return (
        <Container className="mt-4 font-georgian pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-dark">🏢 კომპანიის რეგისტრაციის დოკუმენტაცია</h3>
                    <span className="text-muted small">შპს „ბილდექს ექსპერტიზა" — ს/კ 431188010</span>
                </div>
                <div className="d-flex gap-2">
                    <Button as={Link} to="/" variant="secondary">← მთავარი</Button>
                    {['admin'].includes(role) && (
                        <Button variant="primary" onClick={() => setShowUpload(true)}>+ ატვირთვა</Button>
                    )}
                </div>
            </div>

            {/* Company info card */}
            <Card className="shadow-sm border-0 rounded-4 mb-4 border-start border-5 border-primary">
                <Card.Body>
                    <Row>
                        <Col md={4}><strong>კომპანია:</strong> შპს „ბილდექს ექსპერტიზა"</Col>
                        <Col md={4}><strong>ს/კ:</strong> 431188010</Col>
                        <Col md={4}><strong>დირექტორი / პარტნიორი:</strong> ლევან საჩიშვილი (100%)</Col>
                        <Col md={4} className="mt-2"><strong>მისამართი:</strong> ქ. თელავი, ლეონიძის ქ. №22</Col>
                        <Col md={4} className="mt-2"><strong>დაფუძნება:</strong> 09 მარტი 2026</Col>
                        <Col md={4} className="mt-2"><strong>ელ.ფოსტა:</strong> buildexpertiza@gmail.com</Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Uploaded documents */}
            <Card className="shadow-sm border-0 rounded-4 mb-4">
                <Card.Header className="bg-white py-3 fw-bold">📁 კომპანიის დოკუმენტები</Card.Header>
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
                                        {doc.fileUrl && (
                                            <a href={`/${doc.fileUrl}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">👁 ნახვა</a>
                                        )}
                                        {role === 'admin' && (
                                            <Button size="sm" variant="outline-danger" onClick={() => handleDelete(doc._id)}>🗑️</Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center py-5 text-muted">დოკუმენტები არ არის ატვირთული</td></tr>
                        )}
                    </tbody>
                </Table>
            </Card>

            {/* Share transfer generator */}
            <Card className="shadow-sm border-0 rounded-4">
                <Card.Header className="bg-white py-3 fw-bold">📝 წილის გასხვისების ხელშეკრულების გენერაცია</Card.Header>
                <Card.Body>
                    <Accordion defaultActiveKey={null} flush>
                        <Accordion.Item eventKey="transfer">
                            <Accordion.Header>🔄 წილის გასხვისება (ჩუქება ან ნასყიდობა)</Accordion.Header>
                            <Accordion.Body>
                                <Row className="g-3">
                                    <Col md={12}>
                                        <Form.Label className="fw-bold">ხელშეკრულების ტიპი</Form.Label>
                                        <div className="d-flex gap-4">
                                            <Form.Check type="radio" label="🎁 ჩუქება (უსასყიდლო გადაცემა)" name="transferType"
                                                checked={transferType === 'gift'} onChange={() => setTransferType('gift')} />
                                            <Form.Check type="radio" label="💰 ნასყიდობა (გაყიდვა)" name="transferType"
                                                checked={transferType === 'sale'} onChange={() => setTransferType('sale')} />
                                        </div>
                                    </Col>

                                    <Col md={12}><hr className="my-1" /><strong className="small text-muted">გადამცემი</strong></Col>
                                    <Col md={4}>
                                        <Form.Label className="small fw-bold">{transferType === 'gift' ? 'ჩამჩუქებელი' : 'გამყიდველი'}</Form.Label>
                                        <Form.Control value={transferForm.transferorName} onChange={e => setTransferForm({...transferForm, transferorName: e.target.value})} />
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label className="small fw-bold">პ/ნ</Form.Label>
                                        <Form.Control value={transferForm.transferorId} onChange={e => setTransferForm({...transferForm, transferorId: e.target.value})} />
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label className="small fw-bold">მისამართი</Form.Label>
                                        <Form.Control value={transferForm.transferorAddress} onChange={e => setTransferForm({...transferForm, transferorAddress: e.target.value})} />
                                    </Col>

                                    <Col md={12}><hr className="my-1" /><strong className="small text-muted">მიმღები</strong></Col>
                                    <Col md={4}>
                                        <Form.Label className="small fw-bold">{transferType === 'gift' ? 'დასაჩუქრებული' : 'მყიდველი'} *</Form.Label>
                                        <Form.Control placeholder="სახელი გვარი" value={transferForm.transfereeName} onChange={e => setTransferForm({...transferForm, transfereeName: e.target.value})} />
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label className="small fw-bold">პ/ნ</Form.Label>
                                        <Form.Control placeholder="პირადი ნომერი" value={transferForm.transfereeId} onChange={e => setTransferForm({...transferForm, transfereeId: e.target.value})} />
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label className="small fw-bold">მისამართი</Form.Label>
                                        <Form.Control placeholder="მისამართი" value={transferForm.transfereeAddress} onChange={e => setTransferForm({...transferForm, transfereeAddress: e.target.value})} />
                                    </Col>

                                    <Col md={12}><hr className="my-1" /><strong className="small text-muted">წილი</strong></Col>
                                    <Col md={4}>
                                        <Form.Label className="small fw-bold">წილის პროცენტი (%)</Form.Label>
                                        <Form.Control value={transferForm.sharePercent} onChange={e => setTransferForm({...transferForm, sharePercent: e.target.value})} />
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label className="small fw-bold">ბალანსური ღირებულება (ლარი)</Form.Label>
                                        <Form.Control placeholder="0" value={transferForm.shareValue} onChange={e => setTransferForm({...transferForm, shareValue: e.target.value})} />
                                    </Col>
                                    {transferType === 'sale' && (
                                        <>
                                            <Col md={4}>
                                                <Form.Label className="small fw-bold">ნასყიდობის ფასი (ლარი) *</Form.Label>
                                                <Form.Control placeholder="0" value={transferForm.salePrice} onChange={e => setTransferForm({...transferForm, salePrice: e.target.value})} />
                                            </Col>
                                            <Col md={8}>
                                                <Form.Label className="small fw-bold">ანგარიშსწორების პირობები</Form.Label>
                                                <Form.Control value={transferForm.paymentTerms} onChange={e => setTransferForm({...transferForm, paymentTerms: e.target.value})} />
                                            </Col>
                                        </>
                                    )}

                                    <Col md={12}><hr className="my-1" /><strong className="small text-muted">ხელშეკრულება</strong></Col>
                                    <Col md={3}>
                                        <Form.Label className="small fw-bold">ხელშეკრ. ნომერი</Form.Label>
                                        <Form.Control placeholder="01/26" value={transferForm.contractNumber} onChange={e => setTransferForm({...transferForm, contractNumber: e.target.value})} />
                                    </Col>
                                    <Col md={3}>
                                        <Form.Label className="small fw-bold">გაფ. თარიღი</Form.Label>
                                        <Form.Control value={transferForm.contractDate} onChange={e => setTransferForm({...transferForm, contractDate: e.target.value})} />
                                    </Col>
                                    <Col md={3}>
                                        <Form.Label className="small fw-bold">ქალაქი</Form.Label>
                                        <Form.Control value={transferForm.city} onChange={e => setTransferForm({...transferForm, city: e.target.value})} />
                                    </Col>
                                    <Col md={3}>
                                        <Form.Label className="small fw-bold">ნოტარიუსი (სურვ.)</Form.Label>
                                        <Form.Control placeholder="სახელი გვარი" value={transferForm.notaryName} onChange={e => setTransferForm({...transferForm, notaryName: e.target.value})} />
                                    </Col>

                                    <Col md={12} className="mt-2">
                                        <PDFDownloadLink
                                            document={<ShareTransferPdf data={pdfData} />}
                                            fileName={`share-transfer-${transferType}-${transferForm.contractNumber || 'draft'}.pdf`}
                                        >
                                            {({ loading }) => (
                                                <Button variant={transferType === 'gift' ? 'success' : 'primary'} disabled={loading}>
                                                    {loading ? '⏳ მზადდება...' : (transferType === 'gift' ? '📄 ჩუქების ხელშეკრ. გენერაცია' : '📄 ნასყიდობის ხელშეკრ. გენერაცია')}
                                                </Button>
                                            )}
                                        </PDFDownloadLink>
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Card.Body>
            </Card>

            {/* Upload Modal */}
            <Modal show={showUpload} onHide={() => setShowUpload(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>📁 დოკუმენტის ატვირთვა</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpload}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small">სათაური *</Form.Label>
                            <Form.Control required value={uploadForm.title} onChange={e => setUploadForm({...uploadForm, title: e.target.value})} placeholder="მაგ: წესდება v.1" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small">კატეგორია</Form.Label>
                            <Form.Select value={uploadForm.category} onChange={e => setUploadForm({...uploadForm, category: e.target.value})}>
                                <option>წესდება</option>
                                <option>PO გადაწყვეტილება</option>
                                <option>სახელმწიფო რეგისტრაცია</option>
                                <option>სხვა</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small">თარიღი</Form.Label>
                            <Form.Control type="date" value={uploadForm.docDate} onChange={e => setUploadForm({...uploadForm, docDate: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small">აღწერა</Form.Label>
                            <Form.Control as="textarea" rows={2} value={uploadForm.description} onChange={e => setUploadForm({...uploadForm, description: e.target.value})} />
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
