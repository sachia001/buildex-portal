import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Form, Badge, Spinner, Table } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';

// PDF კომპონენტები (დარწმუნდით რომ ფაილები არსებობს)
import PdfDocument from '../pdf-components/PdfDocument'; 
import ReportCoverPdf from '../pdf-components/ReportCoverPdf'; 

const InspectionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // რედაქტირება
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    // ატვირთვა
    const [file, setFile] = useState(null);
    const [docType, setDocType] = useState('განცხადება');
    const [uploading, setUploading] = useState(false);

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

                    <PDFDownloadLink document={<ReportCoverPdf data={data} />} fileName={`Report-${data.inspectionNumber}.pdf`}>
                        {({ loading }) => <Button variant="outline-success" size="sm" disabled={loading}>📗 თავფურცელი</Button>}
                    </PDFDownloadLink>

                    <Button variant="secondary" size="sm" onClick={() => navigate('/inspections')}>უკან</Button>
                </div>
            </div>

            <Row className="g-4">
                {/* მარცხენა: დეტალები */}
                <Col lg={8}>
                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
                            <h6 className="m-0 fw-bold text-primary">🔧 საქმის დეტალები</h6>
                            <Button variant={editMode ? "success" : "warning"} size="sm" onClick={() => editMode ? handleSave() : setEditMode(true)}>
                                {editMode ? "💾 შენახვა" : "✏️ რედაქტირება"}
                            </Button>
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
                                        <Form.Control value={formData.objectAddress} onChange={e => setFormData({...formData, objectAddress: e.target.value})} />
                                    ) : <div>{data.objectAddress || '-'}</div>}
                                </Col>
                                <Col md={12}><hr/></Col>
                                <Col md={4}>
                                    <div className="small text-muted">ექსპერტი</div>
                                    <div className="fw-bold">{data.expert ? `${data.expert.firstName} ${data.expert.lastName}` : "დაუნიშვნელია"}</div>
                                </Col>
                                <Col md={4}>
                                    <div className="small text-muted">ტექ. მენეჯერი</div>
                                    <div className="fw-bold">{data.technicalManager ? `${data.technicalManager.firstName} ${data.technicalManager.lastName}` : "-"}</div>
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
                            <div className="d-flex gap-2 mb-3 bg-light p-3 rounded">
                                <Form.Select size="sm" value={docType} onChange={e => setDocType(e.target.value)}>
                                    {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </Form.Select>
                                <Form.Control type="file" size="sm" onChange={e => setFile(e.target.files[0])} />
                                <Button size="sm" variant="success" onClick={handleUpload} disabled={uploading}>
                                    {uploading ? '...' : 'ატვირთვა'}
                                </Button>
                            </div>
                            
                            <Table hover size="sm" className="align-middle">
                                <thead><tr><th>დოკუმენტი</th><th>მოქმედება</th></tr></thead>
                                <tbody>
                                    {data.documents && Object.entries(data.documents).map(([key, path]) => (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            <td>
                                                <a href={`/${path}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-link">ნახვა</a>
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
    );
};

export default InspectionDetails;