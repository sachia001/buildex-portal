import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddInspection = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [staff, setStaff] = useState([]);

    const [formData, setFormData] = useState({
        objectName: '', objectAddress: '',
        clientName: '', clientID: '', clientPhone: '', clientEmail: '',

        // 👇 აღდგენილი ველები
        inspectionScope: 'ობიექტის ხარჯთაღრიცხვის ინსპექტირება',
        tenderNumber: '',
        tenderLink: '',

        applicationContent: 'გთხოვთ, ჩაატაროთ ინსპექტირება და გასცეთ შესაბამისი დასკვნა.',
        deadline: '', startDate: new Date().toISOString().split('T')[0],
        expert: [], technicalManager: [], qualityManager: ''
    });

    const scopes = [
        "ობიექტის ხარჯთაღრიცხვის ინსპექტირება",
        "შესრულებული სამუშაოების (ფორმა #2) ინსპექტირება",
        "ობიექტის ტექნიკური მდგომარეობის ინსპექტირება",
        "პროექტის ინსპექტირება",
        "სხვა"
    ];

    const THEME = { primary: '#2c3e50', border: '#dfe6e9', bg: '#f8f9fa' };

    useEffect(() => {
        axios.get('/api/users/staff').then(res => setStaff(res.data));
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleMultiToggle = (field, id) => {
        const current = formData[field];
        setFormData({ ...formData, [field]: current.includes(id) ? current.filter(x => x !== id) : [...current, id] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(!formData.objectName || !formData.clientName) {
            alert("შეავსეთ ობიექტი და დამკვეთი!"); setLoading(false); return;
        }
        try {
            await axios.post('/api/inspections', formData);
            alert("✅ საქმე და განცხადება დარეგისტრირდა!");
            navigate('/inspections');
        } catch (err) { alert("შეცდომა: " + err.message); } 
        finally { setLoading(false); }
    };

    return (
        <div style={{ backgroundColor: THEME.bg, minHeight: '100vh', paddingBottom: '50px', fontFamily: '"Segoe UI", sans-serif' }}>
            <Container className="pt-4 col-lg-9">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold m-0" style={{color: THEME.primary}}>📝 ახალი საქმის რეგისტრაცია</h4>
                    <Button variant="outline-secondary" onClick={() => navigate('/')}>გაუქმება</Button>
                </div>

                <Form onSubmit={handleSubmit}>
                    {/* 1. ობიექტი და დამკვეთი */}
                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Header className="bg-white py-3 border-bottom"><h6 className="m-0 fw-bold text-primary">1. ობიექტის და დამკვეთის ინფორმაცია</h6></Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                <Col md={6}><Form.Label className="small fw-bold">ობიექტი *</Form.Label><Form.Control name="objectName" required onChange={handleChange} /></Col>
                                <Col md={6}><Form.Label className="small fw-bold">მისამართი</Form.Label><Form.Control name="objectAddress" onChange={handleChange} /></Col>
                                
                                {/* 👇 ტენდერის ველები (არასავალდებულო) */}
                                <Col md={4}><Form.Label className="small fw-bold text-muted">ტენდერის ნომერი (SPA...)</Form.Label><Form.Control name="tenderNumber" onChange={handleChange} /></Col>
                                <Col md={8}><Form.Label className="small fw-bold text-muted">ტენდერის ბმული</Form.Label><Form.Control name="tenderLink" onChange={handleChange} placeholder="https://..." /></Col>

                                <Col md={12}><hr/></Col>
                                <Col md={4}><Form.Label className="small fw-bold">დამკვეთი *</Form.Label><Form.Control name="clientName" required onChange={handleChange} /></Col>
                                <Col md={4}><Form.Label className="small fw-bold">ს/კ</Form.Label><Form.Control name="clientID" onChange={handleChange} /></Col>
                                <Col md={4}><Form.Label className="small fw-bold">ტელეფონი</Form.Label><Form.Control name="clientPhone" onChange={handleChange} /></Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* 2. ინსპექტირების დეტალები */}
                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Header className="bg-white py-3 border-bottom"><h6 className="m-0 fw-bold text-primary">2. ინსპექტირების დეტალები</h6></Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                {/* 👇 სფეროს არჩევა */}
                                <Col md={12}>
                                    <Form.Label className="small fw-bold">ინსპექტირების სფერო</Form.Label>
                                    <Form.Select name="inspectionScope" onChange={handleChange}>
                                        {scopes.map(s => <option key={s} value={s}>{s}</option>)}
                                    </Form.Select>
                                </Col>
                                <Col md={12}>
                                    <Form.Label className="small fw-bold">განცხადების შინაარსი</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="applicationContent" value={formData.applicationContent} onChange={handleChange} />
                                </Col>
                                <Col md={6}><Form.Label className="small fw-bold">დაწყება</Form.Label><Form.Control type="date" name="startDate" value={formData.startDate} onChange={handleChange} /></Col>
                                <Col md={6}><Form.Label className="small fw-bold">დასრულების ვადა</Form.Label><Form.Control type="date" name="deadline" onChange={handleChange} /></Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* 3. პერსონალი */}
                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Header className="bg-white py-3 border-bottom"><h6 className="m-0 fw-bold text-primary">3. პასუხისმგებელი პირები</h6></Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                <Col md={4}>
                                    <Form.Label className="small fw-bold">ექსპერტი <span className="text-muted fw-normal">(შეიძლება რამდენიმე)</span></Form.Label>
                                    <div className="border rounded p-2" style={{maxHeight: '140px', overflowY: 'auto', background: '#fff'}}>
                                        {staff.filter(s => s.position === 'ექსპერტი').length === 0
                                            ? <span className="text-muted small">ექსპერტი ვერ მოიძებნა</span>
                                            : staff.filter(s => s.position === 'ექსპერტი').map(s => (
                                                <Form.Check key={s._id} type="checkbox"
                                                    label={`${s.firstName} ${s.lastName}`}
                                                    checked={formData.expert.includes(s._id)}
                                                    onChange={() => handleMultiToggle('expert', s._id)}
                                                />
                                            ))
                                        }
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <Form.Label className="small fw-bold">ტექ. მენეჯერი <span className="text-muted fw-normal">(შეიძლება რამდენიმე)</span></Form.Label>
                                    <div className="border rounded p-2" style={{maxHeight: '140px', overflowY: 'auto', background: '#fff'}}>
                                        {staff.filter(s => s.position === 'ტექ. მენეჯერი').length === 0
                                            ? <span className="text-muted small">ტექ. მენეჯერი ვერ მოიძებნა</span>
                                            : staff.filter(s => s.position === 'ტექ. მენეჯერი').map(s => (
                                                <Form.Check key={s._id} type="checkbox"
                                                    label={`${s.firstName} ${s.lastName}`}
                                                    checked={formData.technicalManager.includes(s._id)}
                                                    onChange={() => handleMultiToggle('technicalManager', s._id)}
                                                />
                                            ))
                                        }
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <Form.Label className="small fw-bold">ხარისხის მენეჯერი</Form.Label>
                                    <Form.Select name="qualityManager" onChange={handleChange}>
                                        <option value="">-- აირჩიეთ --</option>
                                        {staff.filter(s => s.position === 'ხარ. მენეჯერი').map(s => (
                                            <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <div className="d-flex justify-content-end mb-5">
                        <Button type="submit" variant="success" size="lg" disabled={loading}>{loading ? <Spinner size="sm"/> : 'რეგისტრაცია'}</Button>
                    </div>
                </Form>
            </Container>
        </div>
    );
};
export default AddInspection;