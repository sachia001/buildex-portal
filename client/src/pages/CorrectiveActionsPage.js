import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Card, Modal, Row, Col, Badge } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const statusVariant = s => ({ 'ღია': 'danger', 'მიმდინარე': 'warning', 'დახურული': 'success' }[s] || 'secondary');
const statusText = s => ({ 'ღია': undefined, 'მიმდინარე': 'dark', 'დახურული': undefined }[s]);

const CorrectiveActionsPage = ({ role }) => {
    const [items, setItems] = useState([]);
    const [show, setShow] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({
        sourceType: 'შიდა აუდიტი', sourceRef: '', description: '',
        rootCause: '', actionPlan: '', responsiblePerson: '',
        deadline: '', completedDate: '', effectiveness: '', status: 'ღია'
    });

    const fetch = async () => {
        try {
            const res = await axios.get('/api/corrective-actions');
            setItems(Array.isArray(res.data) ? res.data : []);
        } catch { setItems([]); }
    };

    useEffect(() => { fetch(); }, []);

    const openAdd = () => {
        setEditItem(null);
        setFormData({ sourceType: 'შიდა აუდიტი', sourceRef: '', description: '', rootCause: '', actionPlan: '', responsiblePerson: '', deadline: '', completedDate: '', effectiveness: '', status: 'ღია' });
        setShow(true);
    };

    const openEdit = item => {
        setEditItem(item);
        setFormData({
            ...item,
            deadline: item.deadline ? item.deadline.split('T')[0] : '',
            completedDate: item.completedDate ? item.completedDate.split('T')[0] : ''
        });
        setShow(true);
    };

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            if (!payload.deadline) delete payload.deadline;
            if (!payload.completedDate) delete payload.completedDate;
            if (editItem) {
                await axios.put(`/api/corrective-actions/${editItem._id}`, payload);
            } else {
                await axios.post('/api/corrective-actions', payload);
            }
            setShow(false);
            fetch();
        } catch (err) { alert('შეცდომა: ' + (err.response?.data?.error || err.message)); }
    };

    const handleDelete = async id => {
        if (!window.confirm('ნამდვილად გსურთ ჩანაწერის წაშლა?')) return;
        try { await axios.delete(`/api/corrective-actions/${id}`); fetch(); }
        catch { alert('წაშლა ვერ მოხერხდა'); }
    };

    const isOverdue = item => item.status !== 'დახურული' && item.deadline && new Date(item.deadline) < new Date();

    return (
        <Container className="mt-4 font-georgian pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-dark">⚙️ კორექტირებადი ქმედებების რეესტრი</h3>
                    <span className="text-muted small">ISO/IEC 17020:2012 — მუხლი 8.7</span>
                </div>
                <div className="d-flex gap-2">
                    <Button as={Link} to="/" variant="secondary">← მთავარი</Button>
                    {['admin', 'quality_manager'].includes(role) && (
                        <Button variant="primary" onClick={openAdd}>+ ახალი CAR</Button>
                    )}
                </div>
            </div>

            <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="bg-dark text-white">
                        <tr>
                            <th className="p-3">CAR №</th>
                            <th>წყარო</th>
                            <th>აღწერა</th>
                            <th>პასუხისმგებელი</th>
                            <th>ვადა</th>
                            <th>სტატუსი</th>
                            <th className="text-center">მართვა</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? items.map(item => (
                            <tr key={item._id} className={isOverdue(item) ? 'table-danger' : ''}>
                                <td className="p-3 fw-bold font-monospace">{item.carNumber}</td>
                                <td>
                                    <div className="small">{item.sourceType}</div>
                                    <small className="text-muted">{item.sourceRef}</small>
                                </td>
                                <td className="small" style={{ maxWidth: 200 }}>
                                    {item.description && item.description.length > 60 ? item.description.substring(0, 60) + '...' : item.description}
                                </td>
                                <td className="small">{item.responsiblePerson || '-'}</td>
                                <td className="small fw-bold">
                                    {item.deadline ? new Date(item.deadline).toLocaleDateString('ka-GE') : '-'}
                                    {isOverdue(item) && <div><Badge bg="danger" className="mt-1">ვადაგასული</Badge></div>}
                                </td>
                                <td><Badge bg={statusVariant(item.status)} text={statusText(item.status)}>{item.status}</Badge></td>
                                <td className="text-center">
                                    <div className="d-flex gap-1 justify-content-center">
                                        <Button size="sm" variant="outline-primary" onClick={() => openEdit(item)}>✏️</Button>
                                        {['admin', 'quality_manager'].includes(role) && (
                                            <Button size="sm" variant="outline-danger" onClick={() => handleDelete(item._id)}>🗑️</Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="7" className="text-center py-5 text-muted">ჩანაწერები ჯერ არ არის</td></tr>
                        )}
                    </tbody>
                </Table>
            </Card>

            <Modal show={show} onHide={() => setShow(false)} size="lg" backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{editItem ? 'CAR-ის რედაქტირება' : 'ახალი კორექტირებადი ქმედება'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Label className="fw-bold small">წყარო</Form.Label>
                                <Form.Select name="sourceType" value={formData.sourceType} onChange={handleChange}>
                                    <option>შიდა აუდიტი</option>
                                    <option>საჩივარი</option>
                                    <option>გარე აუდიტი</option>
                                    <option>პერსონალის შეფასება</option>
                                    <option>სხვა</option>
                                </Form.Select>
                            </Col>
                            <Col md={4}>
                                <Form.Label className="fw-bold small">წყაროს რეფ. ნომერი</Form.Label>
                                <Form.Control name="sourceRef" value={formData.sourceRef} onChange={handleChange} placeholder="AUD-1/26 ან COMP-1/26" />
                            </Col>
                            <Col md={4}>
                                <Form.Label className="fw-bold small">სტატუსი</Form.Label>
                                <Form.Select name="status" value={formData.status} onChange={handleChange}>
                                    <option>ღია</option>
                                    <option>მიმდინარე</option>
                                    <option>დახურული</option>
                                </Form.Select>
                            </Col>
                            <Col md={12}>
                                <Form.Label className="fw-bold small">შეუსაბამობის აღწერა *</Form.Label>
                                <Form.Control as="textarea" rows={2} name="description" required value={formData.description} onChange={handleChange} />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="fw-bold small">ძირეული მიზეზი</Form.Label>
                                <Form.Control as="textarea" rows={2} name="rootCause" value={formData.rootCause} onChange={handleChange} />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="fw-bold small">ქმედებათა გეგმა</Form.Label>
                                <Form.Control as="textarea" rows={2} name="actionPlan" value={formData.actionPlan} onChange={handleChange} />
                            </Col>
                            <Col md={4}>
                                <Form.Label className="fw-bold small">პასუხისმგებელი პირი</Form.Label>
                                <Form.Control name="responsiblePerson" value={formData.responsiblePerson} onChange={handleChange} />
                            </Col>
                            <Col md={4}>
                                <Form.Label className="fw-bold small">შესრულების ვადა</Form.Label>
                                <Form.Control type="date" name="deadline" value={formData.deadline} onChange={handleChange} />
                            </Col>
                            <Col md={4}>
                                <Form.Label className="fw-bold small">შესრულების თარიღი</Form.Label>
                                <Form.Control type="date" name="completedDate" value={formData.completedDate} onChange={handleChange} />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="fw-bold small">ეფექტიანობის შეფასება</Form.Label>
                                <Form.Control as="textarea" rows={2} name="effectiveness" value={formData.effectiveness} onChange={handleChange} />
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-end mt-4 gap-2">
                            <Button variant="secondary" onClick={() => setShow(false)}>გაუქმება</Button>
                            <Button variant="success" type="submit" className="fw-bold px-4">შენახვა</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default CorrectiveActionsPage;
