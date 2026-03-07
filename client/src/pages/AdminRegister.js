import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner, Modal, Table, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
    const navigate = useNavigate();

    // სტაფის სია
    const [staff, setStaff] = useState([]);
    const [loadingStaff, setLoadingStaff] = useState(true);

    // მოდალი
    const [showModal, setShowModal] = useState(false);

    // ფორმის მონაცემები
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', personalId: '', position: 'ექსპერტი', email: '', phone: '',
        authExpiry: '',
    });
    const [competencies, setCompetencies] = useState([]);
    const competencyList = ["ფორმა №2", "ხარჯთაღრიცხვა", "ფარული სამუშაოები", "ლაბორატორიული კვლევა", "პროექტის ექსპერტიზა"];
    const [photoFile, setPhotoFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchStaff = async () => {
        try {
            const res = await axios.get('/api/users/staff');
            setStaff(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingStaff(false);
        }
    };

    useEffect(() => { fetchStaff(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleCompetencyChange = (e) => {
        const { value, checked } = e.target;
        if (checked) setCompetencies([...competencies, value]);
        else setCompetencies(competencies.filter(c => c !== value));
    };

    const resetForm = () => {
        setFormData({ firstName: '', lastName: '', personalId: '', position: 'ექსპერტი', email: '', phone: '', authExpiry: '' });
        setCompetencies([]);
        setPhotoFile(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.firstName || !formData.personalId) {
            setError("შეავსეთ სავალდებულო ველები!");
            setLoading(false);
            return;
        }

        const dataToSend = new FormData();
        const fullData = { ...formData, competencies };
        dataToSend.append('userData', JSON.stringify(fullData));
        if (photoFile) dataToSend.append('photo', photoFile);

        try {
            await axios.post('/api/users/register', dataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowModal(false);
            resetForm();
            fetchStaff();
            alert("✅ თანამშრომელი დარეგისტრირდა!");
        } catch (err) {
            setError(err.response?.data?.error || "შეცდომა რეგისტრაციისას");
        } finally {
            setLoading(false);
        }
    };

    const getAuthStatus = (authExpiry) => {
        if (!authExpiry) return <Badge bg="secondary">არ არის</Badge>;
        const days = Math.ceil((new Date(authExpiry) - new Date()) / (1000 * 60 * 60 * 24));
        if (days < 0) return <Badge bg="danger">ვადაგასული</Badge>;
        if (days <= 60) return <Badge bg="warning" text="dark">{days} დღე</Badge>;
        return <Badge bg="success">მოქმედი</Badge>;
    };

    return (
        <Container className="mt-4 font-georgian pb-5">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold m-0 text-dark">👥 პერსონალის მართვა</h4>
                    <span className="text-muted small">ISO 17020 — სტაფის რეესტრი</span>
                </div>
                <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    + ახალი თანამშრომელი
                </Button>
            </div>

            {/* Staff Table */}
            <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
                {loadingStaff ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted">იტვირთება...</p>
                    </div>
                ) : (
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th className="p-3">სახელი / გვარი</th>
                                <th>პირადი №</th>
                                <th>პოზიცია</th>
                                <th>კომპეტენციები</th>
                                <th>ავტ. ვადა</th>
                                <th>სტატუსი</th>
                                <th className="text-center">მართვა</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.length > 0 ? staff.map(s => (
                                <tr key={s._id}>
                                    <td className="p-3">
                                        <div className="fw-bold">{s.firstName} {s.lastName}</div>
                                        <small className="text-muted">{s.email || ''}</small>
                                    </td>
                                    <td className="font-monospace small">{s.personalId}</td>
                                    <td>{s.position}</td>
                                    <td>
                                        <div className="d-flex flex-wrap gap-1">
                                            {s.competencies && s.competencies.length > 0
                                                ? s.competencies.map(c => <Badge key={c} bg="light" text="dark" className="border">{c}</Badge>)
                                                : <span className="text-muted small">—</span>
                                            }
                                        </div>
                                    </td>
                                    <td>
                                        {s.authExpiry ? new Date(s.authExpiry).toLocaleDateString('ka-GE') : '—'}
                                    </td>
                                    <td>{getAuthStatus(s.authExpiry)}</td>
                                    <td className="text-center">
                                        <Button size="sm" variant="outline-primary" onClick={() => navigate(`/staff/${s._id}`)}>
                                            პირადი საქმე
                                        </Button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        თანამშრომლები ჯერ არ არიან რეგისტრირებული
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </Card>

            {/* Registration Modal */}
            <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg" backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">👥 ახალი თანამშრომლის რეგისტრაცია</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <h6 className="text-muted border-bottom pb-2 mb-3">პირადი ინფორმაცია</h6>
                        <Row className="g-3 mb-4">
                            <Col md={4}><Form.Control name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="სახელი *" /></Col>
                            <Col md={4}><Form.Control name="lastName" value={formData.lastName} onChange={handleChange} placeholder="გვარი" /></Col>
                            <Col md={4}><Form.Control name="personalId" value={formData.personalId} onChange={handleChange} required placeholder="პირადი ნომერი *" /></Col>
                            <Col md={4}>
                                <Form.Select name="position" value={formData.position} onChange={handleChange}>
                                    <option>ექსპერტი</option>
                                    <option>ტექ. მენეჯერი</option>
                                    <option>ხარ. მენეჯერი</option>
                                    <option>დირექტორი</option>
                                </Form.Select>
                            </Col>
                            <Col md={4}><Form.Control name="email" type="email" value={formData.email} onChange={handleChange} placeholder="ელ-ფოსტა" /></Col>
                            <Col md={4}><Form.Control name="phone" value={formData.phone} onChange={handleChange} placeholder="ტელეფონი" /></Col>
                        </Row>

                        <h6 className="text-muted border-bottom pb-2 mb-3">კომპეტენციები და ავტორიზაცია</h6>
                        <Row className="g-3 mb-4">
                            <Col md={6}>
                                <Form.Label className="small fw-bold">ავტორიზაციის ვადა</Form.Label>
                                <Form.Control type="date" name="authExpiry" value={formData.authExpiry} onChange={handleChange} />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold">ფოტოსურათი</Form.Label>
                                <Form.Control type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="small fw-bold d-block">აკრედიტაციის სფეროები:</Form.Label>
                                <div className="d-flex flex-wrap gap-3">
                                    {competencyList.map(comp => (
                                        <Form.Check key={comp} type="checkbox" label={comp} value={comp}
                                            checked={competencies.includes(comp)}
                                            onChange={handleCompetencyChange} />
                                    ))}
                                </div>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>გაუქმება</Button>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? <Spinner size="sm" animation="border" /> : 'რეგისტრაცია'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminRegister;
