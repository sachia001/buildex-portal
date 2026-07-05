// RegistryPage — გენერიკული ჟურნალ-გვერდი D-მოდულებისთვის (ცხრილი + მოდალ-ფორმა + CRUD).
// კონფიგით განისაზღვრება ველები და სვეტები — 5 ISO-მოდული ერთ კომპონენტს იზიარებს.
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Card, Modal, Row, Col, Badge } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, confirmDialog } from '../components/Feedback';

// field: { name, label, type: 'text'|'textarea'|'date'|'select'|'number', options, md, required, placeholder }
// column: { label, render: (item) => node }
const RegistryPage = ({ title, isoRef, api, fields, columns, canWrite, emptyForm, addLabel = '+ ახალი ჩანაწერი' }) => {
    const [items, setItems] = useState([]);
    const [show, setShow] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const fetchItems = async () => {
        try {
            const res = await axios.get(api);
            setItems(Array.isArray(res.data) ? res.data : []);
        } catch { setItems([]); }
    };
    useEffect(() => { fetchItems(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const openAdd = () => { setEditItem(null); setFormData(emptyForm); setShow(true); };
    const openEdit = (item) => {
        const f = { ...emptyForm };
        for (const k of Object.keys(emptyForm)) {
            const v = item[k];
            f[k] = v == null ? '' : (fields.find(x => x.name === k)?.type === 'date' && v ? String(v).split('T')[0] : v);
        }
        setEditItem(item); setFormData(f); setShow(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            for (const f of fields) if (f.type === 'date' && !payload[f.name]) delete payload[f.name];
            if (editItem) await axios.put(`${api}/${editItem._id}`, payload);
            else await axios.post(api, payload);
            setShow(false);
            fetchItems();
            toast('✅ შენახულია', 'success');
        } catch (err) { toast('შეცდომა: ' + (err.response?.data?.error || err.message), 'danger'); }
    };

    const handleDelete = async (id) => {
        if (!(await confirmDialog('ნამდვილად გსურთ ჩანაწერის წაშლა? (არქივში გადავა)'))) return;
        try { await axios.delete(`${api}/${id}`); fetchItems(); }
        catch (err) { toast(err.response?.data?.error || 'წაშლა ვერ მოხერხდა', 'danger'); }
    };

    return (
        <Container className="mt-4 font-georgian pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-dark">{title}</h3>
                    <span className="text-muted small">{isoRef}</span>
                </div>
                <div className="d-flex gap-2">
                    <Button as={Link} to="/" variant="secondary">← მთავარი</Button>
                    {canWrite && <Button variant="primary" onClick={openAdd}>{addLabel}</Button>}
                </div>
            </div>

            <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="bg-dark text-white">
                        <tr>
                            {columns.map(c => <th key={c.label} className="p-3">{c.label}</th>)}
                            <th className="text-center">მართვა</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? items.map(item => (
                            <tr key={item._id}>
                                {columns.map(c => <td key={c.label} className="small">{c.render(item)}</td>)}
                                <td className="text-center">
                                    <div className="d-flex gap-1 justify-content-center">
                                        {canWrite && <Button size="sm" variant="outline-primary" onClick={() => openEdit(item)}>✏️</Button>}
                                        {canWrite && <Button size="sm" variant="outline-danger" onClick={() => handleDelete(item._id)}>🗑️</Button>}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={columns.length + 1} className="text-center py-5 text-muted">ჩანაწერები ჯერ არ არის</td></tr>
                        )}
                    </tbody>
                </Table>
            </Card>

            <Modal show={show} onHide={() => setShow(false)} size="lg" backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{editItem ? 'ჩანაწერის რედაქტირება' : 'ახალი ჩანაწერი'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            {fields.map(f => (
                                <Col md={f.md || 6} key={f.name}>
                                    <Form.Label htmlFor={`fld-${f.name}`} className="fw-bold small">
                                        {f.label}{f.required ? ' *' : ''}
                                    </Form.Label>
                                    {f.type === 'textarea' ? (
                                        <Form.Control id={`fld-${f.name}`} as="textarea" rows={f.rows || 2} required={f.required}
                                            value={formData[f.name] ?? ''} placeholder={f.placeholder}
                                            onChange={e => setFormData({ ...formData, [f.name]: e.target.value })} />
                                    ) : f.type === 'select' ? (
                                        <Form.Select id={`fld-${f.name}`} required={f.required} value={formData[f.name] ?? ''}
                                            onChange={e => setFormData({ ...formData, [f.name]: e.target.value })}>
                                            {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                                        </Form.Select>
                                    ) : (
                                        <Form.Control id={`fld-${f.name}`} type={f.type || 'text'} required={f.required}
                                            min={f.type === 'number' ? 1 : undefined} max={f.type === 'number' ? 5 : undefined}
                                            value={formData[f.name] ?? ''} placeholder={f.placeholder}
                                            onChange={e => setFormData({ ...formData, [f.name]: e.target.value })} />
                                    )}
                                </Col>
                            ))}
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

export default RegistryPage;

// Badge-ჰელპერი კონფიგებისთვის
export const StatusBadge = ({ value, map }) => (
    <Badge bg={map[value] || 'secondary'} text={map[value] === 'warning' ? 'dark' : undefined}>{value}</Badge>
);
