import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Card, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ManagementReview = () => {
    const [reviews, setReviews] = useState([]);
    const [show, setShow] = useState(false);
    
    // ISO 17020-ის შესაბამისი ფორმის მონაცემები
    const [formData, setFormData] = useState({
        reviewDate: '', 
        participants: '',
        inputs: { prevActions: '', internalAudits: '', complaints: '', resources: '' },
        outputs: { improvements: '', trainingNeeds: '', decisions: '' }
    });

    // მონაცემების წამოღება
    const fetchReviews = async () => {
        try {
            const res = await axios.get('/api/management-reviews');
            // უსაფრთხოების ფილტრი, რომ გვერდი არ გათეთრდეს
            setReviews(Array.isArray(res.data) ? res.data : []);
        } catch (err) { 
            console.error("ვერ ჩაიტვირთა ჟურნალი:", err);
            setReviews([]); 
        }
    };

    useEffect(() => { fetchReviews(); }, []);

    // ველების შევსების ლოგიკა (Nested Objects)
    const handleChange = (section, field, value) => {
        if (section) {
            setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    // გაგზავნა სერვერზე
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/management-reviews', formData);
            setShow(false);
            fetchReviews();
            alert("✅ ოქმი წარმატებით შეინახა!");
            // ფორმის გასუფთავება
            setFormData({
                reviewDate: '', participants: '',
                inputs: { prevActions: '', internalAudits: '', complaints: '', resources: '' },
                outputs: { improvements: '', trainingNeeds: '', decisions: '' }
            });
        } catch (err) { alert("შეცდომა შენახვისას: " + err.message); }
    };

    // წაშლა
    const handleDelete = async (id) => {
        if(!window.confirm("ნამდვილად გსურთ ოქმის წაშლა?")) return;
        try {
            await axios.delete(`/api/management-reviews/${id}`);
            fetchReviews();
        } catch (err) { alert("ვერ წაიშალა"); }
    };

    return (
        <Container className="mt-4 font-georgian pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-dark">📋 მენეჯმენტის გადახედვა</h3>
                    <span className="text-muted small">ISO/IEC 17020:2012 სტანდარტის მოთხოვნა (მუხლი 8.5)</span>
                </div>
                <div className="d-flex gap-2">
                    <Button as={Link} to="/" variant="secondary">← მთავარი</Button>
                    <Button variant="primary" onClick={() => setShow(true)}>+ ახალი ოქმი</Button>
                </div>
            </div>

            <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="bg-dark text-white">
                        <tr>
                            <th className="p-3">თარიღი</th>
                            <th>მონაწილეები</th>
                            <th>მიღებული გადაწყვეტილებები</th>
                            <th className="text-center">მართვა</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.length > 0 ? reviews.map(r => (
                            <tr key={r._id}>
                                <td className="p-3 fw-bold text-primary">
                                    {new Date(r.reviewDate).toLocaleDateString('ka-GE')}
                                </td>
                                <td>{r.participants}</td>
                                <td className="small text-muted" style={{maxWidth: '400px'}}>
                                    {r.outputs?.decisions ? (r.outputs.decisions.length > 80 ? r.outputs.decisions.substring(0, 80) + '...' : r.outputs.decisions) : '-'}
                                </td>
                                <td className="text-center">
                                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(r._id)}>
                                        🗑️ წაშლა
                                    </Button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="text-center py-5 text-muted">
                                    ჩანაწერები ჯერ არ არის
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card>

            {/* --- ახალი ოქმის დამატების მოდალი (ISO ველებით) --- */}
            <Modal show={show} onHide={() => setShow(false)} size="xl" backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">ახალი გადახედვის ოქმი</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* ზოგადი ინფორმაცია */}
                        <div className="bg-light p-3 rounded mb-3">
                            <Row>
                                <Col md={4}>
                                    <Form.Label className="fw-bold">ჩატარების თარიღი</Form.Label>
                                    <Form.Control type="date" required value={formData.reviewDate} onChange={e => handleChange(null, 'reviewDate', e.target.value)} />
                                </Col>
                                <Col md={8}>
                                    <Form.Label className="fw-bold">მონაწილეები (სახელი, გვარი, პოზიცია)</Form.Label>
                                    <Form.Control required placeholder="მაგ: გ.გიორგაძე (დირექტორი), ნ.ნინიძე (ხარისხის მენეჯერი)..." value={formData.participants} onChange={e => handleChange(null, 'participants', e.target.value)} />
                                </Col>
                            </Row>
                        </div>
                        
                        {/* INPUTS - განსახილველი საკითხები */}
                        <h6 className="text-primary fw-bold mt-3 border-bottom pb-2">1. განსახილველი საკითხები (Inputs)</h6>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Label className="small fw-bold">წინა ოქმების შესრულების სტატუსი</Form.Label>
                                <Form.Control as="textarea" rows={2} value={formData.inputs.prevActions} onChange={e => handleChange('inputs', 'prevActions', e.target.value)} />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold">შიდა აუდიტის შედეგები</Form.Label>
                                <Form.Control as="textarea" rows={2} value={formData.inputs.internalAudits} onChange={e => handleChange('inputs', 'internalAudits', e.target.value)} />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold">საჩივრები და აპელაციები</Form.Label>
                                <Form.Control as="textarea" rows={2} value={formData.inputs.complaints} onChange={e => handleChange('inputs', 'complaints', e.target.value)} />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold">რესურსების ადეკვატურობა (პერსონალი, ტექნიკა)</Form.Label>
                                <Form.Control as="textarea" rows={2} value={formData.inputs.resources} onChange={e => handleChange('inputs', 'resources', e.target.value)} />
                            </Col>
                        </Row>

                        {/* OUTPUTS - შედეგები */}
                        <h6 className="text-success fw-bold mt-4 border-bottom pb-2">2. შედეგები და გადაწყვეტილებები (Outputs)</h6>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Label className="small fw-bold">გაუმჯობესების გეგმა / ეფექტურობა</Form.Label>
                                <Form.Control as="textarea" rows={2} value={formData.outputs.improvements} onChange={e => handleChange('outputs', 'improvements', e.target.value)} />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold">პერსონალის ტრენინგები / საჭიროებები</Form.Label>
                                <Form.Control as="textarea" rows={2} value={formData.outputs.trainingNeeds} onChange={e => handleChange('outputs', 'trainingNeeds', e.target.value)} />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold">მიღებული გადაწყვეტილებები</Form.Label>
                                <Form.Control as="textarea" rows={2} value={formData.outputs.decisions} onChange={e => handleChange('outputs', 'decisions', e.target.value)} />
                            </Col>
                        </Row>
                        
                        <div className="d-flex justify-content-end mt-4 gap-2">
                            <Button variant="secondary" onClick={() => setShow(false)}>გაუქმება</Button>
                            <Button variant="success" type="submit" className="fw-bold px-4">ოქმის დადასტურება</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default ManagementReview;