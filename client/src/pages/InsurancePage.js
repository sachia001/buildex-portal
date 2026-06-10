import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Badge, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { toast, confirmDialog } from '../components/Feedback';

const InsurancePage = ({ role }) => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [file, setFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        insurerName: '',
        policyNumber: '',
        insuranceType: 'პროფესიული პასუხისმგებლობა',
        startDate: '',
        endDate: '',
        insuredAmount: '',
        notes: ''
    });

    const insuranceTypes = [
        'პროფესიული პასუხისმგებლობა',
        'ქონების დაზღვევა',
        'სამოქალაქო პასუხისმგებლობა',
        'სხვა'
    ];

    const fetchPolicies = async () => {
        try {
            const res = await axios.get('/api/insurance');
            setPolicies(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchPolicies(); }, []);

    const getDaysLeft = (endDate) => {
        return Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    };

    const getStatusBadge = (endDate) => {
        const days = getDaysLeft(endDate);
        if (days < 0) return <Badge bg="danger">ვადაგასული</Badge>;
        if (days <= 30) return <Badge bg="warning" text="dark">იწურება ({days} დღე)</Badge>;
        return <Badge bg="success">მოქმედი ({days} დღე)</Badge>;
    };

    const openAdd = () => {
        setEditItem(null);
        setForm({ insurerName: '', policyNumber: '', insuranceType: 'პროფესიული პასუხისმგებლობა', startDate: '', endDate: '', insuredAmount: '', notes: '' });
        setFile(null);
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditItem(item);
        setForm({
            insurerName: item.insurerName || '',
            policyNumber: item.policyNumber || '',
            insuranceType: item.insuranceType || 'პროფესიული პასუხისმგებლობა',
            startDate: item.startDate ? item.startDate.split('T')[0] : '',
            endDate: item.endDate ? item.endDate.split('T')[0] : '',
            insuredAmount: item.insuredAmount || '',
            notes: item.notes || ''
        });
        setFile(null);
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.insurerName || !form.policyNumber || !form.startDate || !form.endDate) {
            return toast('შეავსეთ სავალდებულო ველები', 'warning');
        }
        setSaving(true);
        try {
            if (editItem) {
                await axios.put(`/api/insurance/${editItem._id}`, form);
                if (file) {
                    const fd = new FormData();
                    fd.append('file', file);
                    fd.append('data', JSON.stringify({}));
                    // upload separately if needed
                }
            } else {
                const fd = new FormData();
                fd.append('data', JSON.stringify(form));
                if (file) fd.append('file', file);
                await axios.post('/api/insurance', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            setShowModal(false);
            fetchPolicies();
        } catch (err) { toast('შეცდომა: ' + (err.response?.data?.error || err.message), 'danger'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!(await confirmDialog('წავშალოთ პოლისი?'))) return;
        try {
            await axios.delete(`/api/insurance/${id}`);
            fetchPolicies();
        } catch (err) { toast('ვერ წაიშალა', 'danger'); }
    };

    const expiredCount = policies.filter(p => getDaysLeft(p.endDate) < 0).length;
    const expiringSoonCount = policies.filter(p => { const d = getDaysLeft(p.endDate); return d >= 0 && d <= 30; }).length;

    return (
        <Container className="mt-4 pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1">🛡️ სადაზღვევო პოლისები</h4>
                    <span className="text-muted small">ISO/IEC 17020:2012/2013 — სადაზღვევო კონტროლი</span>
                </div>
                {['admin', 'quality_manager'].includes(role) && (
                    <Button variant="primary" onClick={openAdd}>+ ახალი პოლისი</Button>
                )}
            </div>

            {expiredCount > 0 && (
                <Alert variant="danger" className="mb-3">
                    ⚠️ <strong>{expiredCount}</strong> პოლისის ვადა გასულია! დაუყოვნებლივ განაახლეთ.
                </Alert>
            )}
            {expiringSoonCount > 0 && (
                <Alert variant="warning" className="mb-3">
                    🔔 <strong>{expiringSoonCount}</strong> პოლისი ვადასრულდება 30 დღეში.
                </Alert>
            )}

            <Card className="border-0 shadow-sm">
                <Table hover responsive className="align-middle mb-0">
                    <thead className="table-dark">
                        <tr>
                            <th>სადაზღვევო კომპანია</th>
                            <th>პოლისის №</th>
                            <th>სახეობა</th>
                            <th>მოქმ. ვადა</th>
                            <th>დამთ. თარიღი</th>
                            <th>სტატუსი</th>
                            <th>ფაილი</th>
                            <th>ქმედება</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="8" className="text-center py-4">იტვირთება...</td></tr>
                        ) : policies.length === 0 ? (
                            <tr><td colSpan="8" className="text-center py-5 text-muted">პოლისები არ არის დამატებული</td></tr>
                        ) : policies.map(p => (
                            <tr key={p._id} className={getDaysLeft(p.endDate) < 0 ? 'table-danger' : getDaysLeft(p.endDate) <= 30 ? 'table-warning' : ''}>
                                <td className="fw-bold">{p.insurerName}</td>
                                <td><code>{p.policyNumber}</code></td>
                                <td><Badge bg="secondary">{p.insuranceType}</Badge></td>
                                <td className="small">{p.startDate ? new Date(p.startDate).toLocaleDateString('ka-GE') : '-'}</td>
                                <td className="small fw-bold">{p.endDate ? new Date(p.endDate).toLocaleDateString('ka-GE') : '-'}</td>
                                <td>{getStatusBadge(p.endDate)}</td>
                                <td>
                                    {p.fileUrl
                                        ? <a href={`/${p.fileUrl}?token=${localStorage.getItem('token')}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-link p-0">📄 ნახვა</a>
                                        : <span className="text-muted small">—</span>}
                                </td>
                                <td>
                                    {['admin', 'quality_manager'].includes(role) && (
                                        <>
                                            <Button size="sm" variant="outline-secondary" className="me-1" onClick={() => openEdit(p)}>✏️</Button>
                                            <Button size="sm" variant="outline-danger" onClick={() => handleDelete(p._id)}>🗑️</Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editItem ? 'პოლისის რედაქტირება' : 'ახალი სადაზღვევო პოლისი'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Label htmlFor="fld-insurerName" className="fw-bold small">სადაზღვევო კომპანია *</Form.Label>
                            <Form.Control id="fld-insurerName" value={form.insurerName} onChange={e => setForm(p => ({...p, insurerName: e.target.value}))} placeholder="კომპანიის დასახელება" />
                        </Col>
                        <Col md={6}>
                            <Form.Label htmlFor="fld-policyNumber" className="fw-bold small">პოლისის ნომერი *</Form.Label>
                            <Form.Control id="fld-policyNumber" value={form.policyNumber} onChange={e => setForm(p => ({...p, policyNumber: e.target.value}))} placeholder="პოლისის №" />
                        </Col>
                        <Col md={12}>
                            <Form.Label htmlFor="fld-insuranceType" className="fw-bold small">დაზღვევის სახეობა</Form.Label>
                            <Form.Select id="fld-insuranceType" value={form.insuranceType} onChange={e => setForm(p => ({...p, insuranceType: e.target.value}))}>
                                {insuranceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </Form.Select>
                        </Col>
                        <Col md={6}>
                            <Form.Label htmlFor="fld-startDate" className="fw-bold small">დაწყების თარიღი *</Form.Label>
                            <Form.Control id="fld-startDate" type="date" value={form.startDate} onChange={e => setForm(p => ({...p, startDate: e.target.value}))} />
                        </Col>
                        <Col md={6}>
                            <Form.Label htmlFor="fld-endDate" className="fw-bold small">დამთავრების თარიღი *</Form.Label>
                            <Form.Control id="fld-endDate" type="date" value={form.endDate} onChange={e => setForm(p => ({...p, endDate: e.target.value}))} />
                        </Col>
                        <Col md={6}>
                            <Form.Label htmlFor="fld-insuredAmount" className="fw-bold small">დაზღვეული თანხა</Form.Label>
                            <Form.Control id="fld-insuredAmount" value={form.insuredAmount} onChange={e => setForm(p => ({...p, insuredAmount: e.target.value}))} placeholder="მაგ: 50,000 ₾" />
                        </Col>
                        <Col md={6}>
                            <Form.Label className="fw-bold small">პოლისის ფაილი (PDF)</Form.Label>
                            <Form.Control type="file" accept=".pdf,.jpg,.png" onChange={e => setFile(e.target.files[0])} />
                        </Col>
                        <Col md={12}>
                            <Form.Label htmlFor="fld-notes" className="fw-bold small">შენიშვნა</Form.Label>
                            <Form.Control id="fld-notes" as="textarea" rows={2} value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} placeholder="დამატებითი ინფორმაცია..." />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>გაუქმება</Button>
                    <Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? 'ინახება...' : 'შენახვა'}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default InsurancePage;
