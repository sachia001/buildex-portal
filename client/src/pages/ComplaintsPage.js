import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Card, Modal, Row, Col, Badge } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, confirmDialog } from '../components/Feedback';

const statusVariant = s => ({ 'განხილვაში': 'warning', 'დასრულებული': 'success', 'უარყოფილი': 'secondary' }[s] || 'secondary');

const ComplaintsPage = ({ role }) => {
    const [items, setItems] = useState([]);
    const [show, setShow] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({
        dateReceived: new Date().toISOString().split('T')[0],
        complainant: '', complainantContact: '', inspectionRef: '',
        description: '', category: 'საჩივარი', status: 'განხილვაში',
        reviewedBy: '', resolution: '', preventiveAction: ''
    });

    // საქმეების სია — inspectionRef-ის ამრჩევისთვის და ბმულებისთვის
    const [inspections, setInspections] = useState([]);

    const fetch = async () => {
        try {
            const res = await axios.get('/api/complaints');
            setItems(Array.isArray(res.data) ? res.data : []);
        } catch { setItems([]); }
        try {
            const insp = await axios.get('/api/inspections');
            setInspections(Array.isArray(insp.data) ? insp.data : []);
        } catch { setInspections([]); }
    };

    useEffect(() => { fetch(); }, []);

    // საქმის ნომერი → _id (ცხრილში ბმულისთვის)
    const inspIdByNumber = (num) => inspections.find(i => i.inspectionNumber === num)?._id;

    const openAdd = () => {
        setEditItem(null);
        setFormData({ dateReceived: new Date().toISOString().split('T')[0], complainant: '', complainantContact: '', inspectionRef: '', description: '', category: 'საჩივარი', status: 'განხილვაში', reviewedBy: '', resolution: '', preventiveAction: '' });
        setShow(true);
    };

    const openEdit = (item) => {
        setEditItem(item);
        setFormData({ ...item, dateReceived: item.dateReceived ? item.dateReceived.split('T')[0] : '' });
        setShow(true);
    };

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (editItem) {
                await axios.put(`/api/complaints/${editItem._id}`, formData);
            } else {
                await axios.post('/api/complaints', formData);
            }
            setShow(false);
            fetch();
        } catch (err) { toast('შეცდომა: ' + (err.response?.data?.error || err.message), 'danger'); }
    };

    const handleDelete = async id => {
        if (!(await confirmDialog('ნამდვილად გსურთ ჩანაწერის წაშლა?'))) return;
        try { await axios.delete(`/api/complaints/${id}`); fetch(); }
        catch { toast('წაშლა ვერ მოხერხდა', 'danger'); }
    };

    const canEdit = ['admin', 'quality_manager'].includes(role);

    return (
        <Container className="mt-4 font-georgian pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-dark">📨 საჩივრებისა და აპელაციების რეესტრი</h3>
                    <span className="text-muted small">ISO/IEC 17020:2012 — მუხლი 7.5 / 7.6</span>
                </div>
                <div className="d-flex gap-2">
                    <Button as={Link} to="/" variant="secondary">← მთავარი</Button>
                    {canEdit && <Button variant="primary" onClick={openAdd}>+ ახალი ჩანაწერი</Button>}
                </div>
            </div>

            <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="bg-dark text-white">
                        <tr>
                            <th className="p-3">ნომერი</th>
                            <th>თარიღი</th>
                            <th>განმცხადებელი</th>
                            <th>კატეგორია</th>
                            <th>საქმე</th>
                            <th>სტატუსი</th>
                            <th className="text-center">მართვა</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? items.map(item => (
                            <tr key={item._id}>
                                <td className="p-3 fw-bold font-monospace">{item.complaintNumber}</td>
                                <td>{item.dateReceived ? new Date(item.dateReceived).toLocaleDateString('ka-GE') : '-'}</td>
                                <td>
                                    <div className="fw-bold">{item.complainant}</div>
                                    <small className="text-muted">{item.complainantContact}</small>
                                </td>
                                <td><Badge bg={item.category === 'აპელაცია' ? 'info' : 'warning'} text="dark">{item.category}</Badge></td>
                                <td className="small">
                                    {item.inspectionRef
                                        ? (inspIdByNumber(item.inspectionRef)
                                            ? <Link to={`/inspections/${inspIdByNumber(item.inspectionRef)}`}>{item.inspectionRef}</Link>
                                            : item.inspectionRef)
                                        : '-'}
                                </td>
                                <td><Badge bg={statusVariant(item.status)}>{item.status}</Badge></td>
                                <td className="text-center">
                                    <div className="d-flex gap-1 justify-content-center">
                                        <Button size="sm" variant="outline-primary" onClick={() => openEdit(item)}>✏️</Button>
                                        {canEdit && (
                                            <Button size="sm" variant="outline-danger" title="მაკორექტირებელი ქმედების შექმნა ამ საჩივრიდან"
                                                as={Link} to={`/corrective-actions?sourceType=${encodeURIComponent('საჩივარი')}&sourceRef=${encodeURIComponent(item.complaintNumber || '')}&description=${encodeURIComponent(item.description || '')}`}>
                                                ⚙️ CAR
                                            </Button>
                                        )}
                                        {canEdit && <Button size="sm" variant="outline-danger" onClick={() => handleDelete(item._id)}>🗑️</Button>}
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
                    <Modal.Title>{editItem ? 'ჩანაწერის რედაქტირება' : 'ახალი საჩივარი / აპელაცია'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Label htmlFor="cmp-dateReceived" className="fw-bold small">შეტანის თარიღი <span aria-hidden="true">*</span></Form.Label>
                                <Form.Control id="cmp-dateReceived" type="date" name="dateReceived" required aria-required="true" value={formData.dateReceived} onChange={handleChange} />
                            </Col>
                            <Col md={4}>
                                <Form.Label htmlFor="cmp-category" className="fw-bold small">კატეგორია</Form.Label>
                                <Form.Select id="cmp-category" name="category" value={formData.category} onChange={handleChange}>
                                    <option>საჩივარი</option>
                                    <option>აპელაცია</option>
                                </Form.Select>
                            </Col>
                            <Col md={4}>
                                <Form.Label htmlFor="cmp-status" className="fw-bold small">სტატუსი</Form.Label>
                                <Form.Select id="cmp-status" name="status" value={formData.status} onChange={handleChange}>
                                    <option>განხილვაში</option>
                                    <option>დასრულებული</option>
                                    <option>უარყოფილი</option>
                                </Form.Select>
                            </Col>
                            <Col md={6}>
                                <Form.Label htmlFor="cmp-complainant" className="fw-bold small">განმცხადებელი <span aria-hidden="true">*</span></Form.Label>
                                <Form.Control id="cmp-complainant" name="complainant" required aria-required="true" value={formData.complainant} onChange={handleChange} />
                            </Col>
                            <Col md={6}>
                                <Form.Label htmlFor="cmp-complainantContact" className="fw-bold small">საკონტაქტო</Form.Label>
                                <Form.Control id="cmp-complainantContact" name="complainantContact" value={formData.complainantContact} onChange={handleChange} />
                            </Col>
                            <Col md={6}>
                                <Form.Label htmlFor="cmp-inspectionRef" className="fw-bold small">დაკავშირებული საქმე</Form.Label>
                                <Form.Select id="cmp-inspectionRef" name="inspectionRef" value={formData.inspectionRef} onChange={handleChange}>
                                    <option value="">— არ უკავშირდება საქმეს —</option>
                                    {inspections.map(i => (
                                        <option key={i._id} value={i.inspectionNumber}>{i.inspectionNumber} — {i.objectName}</option>
                                    ))}
                                    {formData.inspectionRef && !inspections.some(i => i.inspectionNumber === formData.inspectionRef) &&
                                        <option value={formData.inspectionRef}>{formData.inspectionRef}</option>}
                                </Form.Select>
                            </Col>
                            <Col md={6}>
                                <Form.Label htmlFor="cmp-reviewedBy" className="fw-bold small">განმხილველი</Form.Label>
                                <Form.Control id="cmp-reviewedBy" name="reviewedBy" value={formData.reviewedBy} onChange={handleChange} />
                            </Col>
                            <Col md={12}>
                                <Form.Label htmlFor="cmp-description" className="fw-bold small">აღწერა / შინაარსი <span aria-hidden="true">*</span></Form.Label>
                                <Form.Control id="cmp-description" as="textarea" rows={3} name="description" required aria-required="true" value={formData.description} onChange={handleChange} />
                            </Col>
                            <Col md={12}>
                                <Form.Label htmlFor="cmp-resolution" className="fw-bold small">გადაწყვეტა / პასუხი</Form.Label>
                                <Form.Control id="cmp-resolution" as="textarea" rows={2} name="resolution" value={formData.resolution} onChange={handleChange} />
                            </Col>
                            <Col md={12}>
                                <Form.Label htmlFor="cmp-preventiveAction" className="fw-bold small">პრევენციული ღონისძიება</Form.Label>
                                <Form.Control id="cmp-preventiveAction" as="textarea" rows={2} name="preventiveAction" value={formData.preventiveAction} onChange={handleChange} />
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

export default ComplaintsPage;
