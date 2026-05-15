import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Card, Modal, Row, Col, Badge } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const InternalAuditPage = ({ role }) => {
    const [items, setItems] = useState([]);
    const [show, setShow] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({
        auditDate: new Date().toISOString().split('T')[0],
        auditor: '', scope: '', nonConformities: '', positiveFindings: '',
        conclusion: '', correctiveActionRequired: false, status: 'დასრულებული'
    });

    const fetch = async () => {
        try {
            const res = await axios.get('/api/internal-audits');
            setItems(Array.isArray(res.data) ? res.data : []);
        } catch { setItems([]); }
    };

    useEffect(() => { fetch(); }, []);

    const openAdd = () => {
        setEditItem(null);
        setFormData({ auditDate: new Date().toISOString().split('T')[0], auditor: '', scope: '', nonConformities: '', positiveFindings: '', conclusion: '', correctiveActionRequired: false, status: 'დასრულებული' });
        setShow(true);
    };

    const openEdit = item => {
        setEditItem(item);
        setFormData({ ...item, auditDate: item.auditDate ? item.auditDate.split('T')[0] : '' });
        setShow(true);
    };

    const handleChange = e => {
        const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: val });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (editItem) {
                await axios.put(`/api/internal-audits/${editItem._id}`, formData);
            } else {
                await axios.post('/api/internal-audits', formData);
            }
            setShow(false);
            fetch();
        } catch (err) { alert('შეცდომა: ' + (err.response?.data?.error || err.message)); }
    };

    const handleDelete = async id => {
        if (!window.confirm('ნამდვილად გსურთ ჩანაწერის წაშლა?')) return;
        try { await axios.delete(`/api/internal-audits/${id}`); fetch(); }
        catch { alert('წაშლა ვერ მოხერხდა'); }
    };

    return (
        <Container className="mt-4 font-georgian pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-dark">🔍 შიდა აუდიტის რეესტრი</h3>
                    <span className="text-muted small">ISO/IEC 17020:2012 — მუხლი 8.6</span>
                </div>
                <div className="d-flex gap-2">
                    <Button as={Link} to="/" variant="secondary">← მთავარი</Button>
                    {['admin', 'quality_manager'].includes(role) && (
                        <Button variant="primary" onClick={openAdd}>+ ახალი აუდიტი</Button>
                    )}
                </div>
            </div>

            <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="bg-dark text-white">
                        <tr>
                            <th className="p-3">ნომერი</th>
                            <th>თარიღი</th>
                            <th>აუდიტორი</th>
                            <th>სფერო</th>
                            <th>CAR საჭირო</th>
                            <th>სტატუსი</th>
                            <th className="text-center">მართვა</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? items.map(item => (
                            <tr key={item._id}>
                                <td className="p-3 fw-bold font-monospace">{item.auditNumber}</td>
                                <td>{item.auditDate ? new Date(item.auditDate).toLocaleDateString('ka-GE') : '-'}</td>
                                <td>{item.auditor}</td>
                                <td className="small text-muted" style={{ maxWidth: 200 }}>{item.scope}</td>
                                <td>{item.correctiveActionRequired ? <Badge bg="danger">დიახ</Badge> : <Badge bg="success">არა</Badge>}</td>
                                <td><Badge bg={item.status === 'დასრულებული' ? 'success' : 'warning'} text={item.status === 'დასრულებული' ? undefined : 'dark'}>{item.status}</Badge></td>
                                <td className="text-center">
                                    <div className="d-flex gap-1 justify-content-center">
                                        <Button size="sm" variant="outline-primary" onClick={() => openEdit(item)}>✏️</Button>
                                        {role === 'admin' && <Button size="sm" variant="outline-danger" onClick={() => handleDelete(item._id)}>🗑️</Button>}
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
                    <Modal.Title>{editItem ? 'აუდიტის რედაქტირება' : 'ახალი შიდა აუდიტი'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Label className="fw-bold small">აუდიტის თარიღი *</Form.Label>
                                <Form.Control type="date" name="auditDate" required value={formData.auditDate} onChange={handleChange} />
                            </Col>
                            <Col md={4}>
                                <Form.Label className="fw-bold small">აუდიტორი *</Form.Label>
                                <Form.Control name="auditor" required value={formData.auditor} onChange={handleChange} />
                            </Col>
                            <Col md={4}>
                                <Form.Label className="fw-bold small">სტატუსი</Form.Label>
                                <Form.Select name="status" value={formData.status} onChange={handleChange}>
                                    <option>მიმდინარე</option>
                                    <option>დასრულებული</option>
                                </Form.Select>
                            </Col>
                            <Col md={12}>
                                <Form.Label className="fw-bold small">სფერო / სამიზნე პროცესი</Form.Label>
                                <Form.Control name="scope" value={formData.scope} onChange={handleChange} placeholder="მაგ: ინსპექტირების პროცედურა, BE-PR-01" />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="fw-bold small">შეუსაბამობები</Form.Label>
                                <Form.Control as="textarea" rows={3} name="nonConformities" value={formData.nonConformities} onChange={handleChange} />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="fw-bold small">პოზიტიური მიგნებები</Form.Label>
                                <Form.Control as="textarea" rows={3} name="positiveFindings" value={formData.positiveFindings} onChange={handleChange} />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="fw-bold small">დასკვნა</Form.Label>
                                <Form.Control as="textarea" rows={2} name="conclusion" value={formData.conclusion} onChange={handleChange} />
                            </Col>
                            <Col md={12}>
                                <Form.Check type="checkbox" name="correctiveActionRequired" label="კორექტირებადი ქმედება საჭიროა (CAR)" checked={formData.correctiveActionRequired} onChange={handleChange} />
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

export default InternalAuditPage;
