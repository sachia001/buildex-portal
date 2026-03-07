import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Table, Badge, Spinner, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        if(!window.confirm("წავშალოთ დოკუმენტი?")) return;
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

    if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;
    if (!user) return <Container className="mt-5 text-center">თანამშრომელი ვერ მოიძებნა</Container>;

    const photoUrl = user.photo ? `/${user.photo}` : null;

    return (
        <Container className="mt-4 font-georgian pb-5">
            <Button variant="outline-secondary" className="mb-3" onClick={() => navigate('/admin')}>← უკან სიაში</Button>
            
            <Row>
                <Col md={4}>
                    <Card className="border-0 shadow-lg rounded-4 overflow-hidden text-center mb-4">
                        <div className="bg-primary p-4 d-flex justify-content-center align-items-center" style={{minHeight: '150px'}}>
                            {photoUrl ? (
                                <img src={photoUrl} alt="Profile" className="rounded-circle shadow" style={{width: 120, height: 120, objectFit: 'cover', border: '4px solid white'}} />
                            ) : (
                                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{width:120, height:120, fontSize:'3rem', border: '4px solid white'}}>👤</div>
                            )}
                        </div>
                        <Card.Body className="pt-3">
                            <h4 className="fw-bold">{user.firstName} {user.lastName}</h4>
                            <p className="text-muted mb-2">{user.position}</p>
                            <Badge bg={user.status === 'აქტიური' ? 'success' : 'secondary'} className="mb-3 px-3 py-2 fs-6">{user.status}</Badge>
                            <br/>
                            <Button variant="outline-primary" size="sm" onClick={() => setShowStatusModal(true)}>🔄 სტატუსის შეცვლა</Button>
                            
                            <div className="text-start bg-light p-3 rounded small mt-4">
                                <p className="mb-1"><strong>🆔 პ/ნ:</strong> {user.personalId}</p>
                                <p className="mb-1"><strong>📞 ტელ:</strong> {user.phone || '-'}</p>
                                <p className="mb-0"><strong>📅 ვადა:</strong> {user.authExpiry ? new Date(user.authExpiry).toLocaleDateString() : '-'}</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card className="border-0 shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold mb-4 text-primary">📂 პირადი საქმე (დოკუმენტაცია)</h5>
                        <div className="d-flex gap-2 p-3 bg-light rounded mb-3 align-items-end flex-wrap">
                            <div className="flex-grow-1" style={{minWidth: '150px'}}>
                                <Form.Label className="small fw-bold">დოკუმენტის ტიპი</Form.Label>
                                <Form.Select size="sm" value={docType} onChange={e => setDocType(e.target.value)}>
                                    {docOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                </Form.Select>
                            </div>
                            <div className="flex-grow-1" style={{minWidth: '200px'}}>
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