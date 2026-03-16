import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, Row, Col, Badge, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InspectionList = ({ role }) => {
    const navigate = useNavigate();
    const isAdmin = role === 'admin';
    const [inspections, setInspections] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);

    // ფილტრების სთეითი
    const [filter, setFilter] = useState({
        search: '',
        expert: '',
        status: '',
        dateFrom: '',
        dateTo: ''
    });

    // დიზაინის თემა (დაშბორდის შესაბამისი)
    const THEME = {
        primary: '#2c3e50',
        secondary: '#95a5a6',
        success: '#27ae60',
        warning: '#f39c12',
        danger: '#c0392b',
        border: '#dfe6e9',
        bg: '#f8f9fa'
    };

    useEffect(() => {
        fetchInspections();
    }, []);

    // ფილტრაციის ლოგიკა
    useEffect(() => {
        let result = inspections;

        if (filter.search) {
            const term = filter.search.toLowerCase();
            result = result.filter(i => 
                (i.inspectionNumber && i.inspectionNumber.toLowerCase().includes(term)) || 
                (i.objectName && i.objectName.toLowerCase().includes(term))
            );
        }
        if (filter.expert) {
            result = result.filter(i => i.expert && i.expert._id === filter.expert);
        }
        if (filter.status) {
            result = result.filter(i => i.status === filter.status);
        }
        if (filter.dateFrom) {
            result = result.filter(i => new Date(i.createdAt) >= new Date(filter.dateFrom));
        }
        if (filter.dateTo) {
            result = result.filter(i => new Date(i.createdAt) <= new Date(filter.dateTo));
        }

        setFiltered(result);
    }, [filter, inspections]);

    const fetchInspections = async () => {
        try {
            const res = await axios.get('/api/inspections');
            setInspections(res.data);
            setFiltered(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    // უნიკალური ექსპერტების სია ფილტრისთვის
    const expertsList = [...new Set(inspections.map(i => i.expert).filter(Boolean).map(e => JSON.stringify({id: e._id, name: `${e.firstName} ${e.lastName}`})))].map(e => JSON.parse(e));

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const clearFilters = () => {
        setFilter({ search: '', expert: '', status: '', dateFrom: '', dateTo: '' });
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`წაიშალოს "${name}"? ეს ქმედება შეუქცევადია.`)) return;
        try {
            await axios.delete(`/api/inspections/${id}`);
            fetchInspections();
        } catch (err) {
            alert(err.response?.data?.error || 'წაშლა ვერ მოხერხდა');
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'დასრულებული': return <Badge bg="success" style={{backgroundColor: THEME.success}}>დასრულებული</Badge>;
            case 'მიმდინარე': return <Badge bg="warning" text="dark" style={{backgroundColor: THEME.warning, color: '#fff'}}>მიმდინარე</Badge>;
            default: return <Badge bg="primary" style={{backgroundColor: '#3498db'}}>ახალი</Badge>;
        }
    };

    if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" style={{color: THEME.primary}} /></Container>;

    // სტილები
    const cardStyle = {
        backgroundColor: '#ffffff',
        border: `1px solid ${THEME.border}`,
        borderRadius: '6px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
    };

    return (
        <div style={{ backgroundColor: THEME.bg, minHeight: '100vh', paddingBottom: '40px', fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
            <Container fluid className="px-4 pt-4">
                
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                    <div>
                        <h4 className="fw-bold m-0" style={{color: THEME.primary}}>📂 ინსპექტირების რეესტრი</h4>
                        <span className="text-muted small">სულ: {filtered.length} ჩანაწერი</span>
                    </div>
                    <Button 
                        style={{backgroundColor: THEME.primary, border: 'none'}} 
                        onClick={() => navigate('/add-inspection')}
                    >
                        + ახალი საქმე
                    </Button>
                </div>

                {/* Filters Panel */}
                <Card style={cardStyle} className="mb-4">
                    <Card.Body className="p-3 bg-light">
                        <Row className="g-3 align-items-end">
                            <Col md={3}>
                                <Form.Label className="small fw-bold text-muted">ძებნა (ნომერი / ობიექტი)</Form.Label>
                                <Form.Control 
                                    size="sm"
                                    type="text" 
                                    placeholder="🔍 ჩაწერეთ..." 
                                    name="search" 
                                    value={filter.search} 
                                    onChange={handleFilterChange}
                                    style={{borderColor: THEME.border}}
                                />
                            </Col>
                            <Col md={2}>
                                <Form.Label className="small fw-bold text-muted">ექსპერტი</Form.Label>
                                <Form.Select size="sm" name="expert" value={filter.expert} onChange={handleFilterChange} style={{borderColor: THEME.border}}>
                                    <option value="">ყველა</option>
                                    {expertsList.map(ex => (
                                        <option key={ex.id} value={ex.id}>{ex.name}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Form.Label className="small fw-bold text-muted">სტატუსი</Form.Label>
                                <Form.Select size="sm" name="status" value={filter.status} onChange={handleFilterChange} style={{borderColor: THEME.border}}>
                                    <option value="">ყველა</option>
                                    <option value="რეგისტრირებული">რეგისტრირებული</option>
                                    <option value="მიმდინარე">მიმდინარე</option>
                                    <option value="დასრულებული">დასრულებული</option>
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Form.Label className="small fw-bold text-muted">თარიღი (-დან)</Form.Label>
                                <Form.Control size="sm" type="date" name="dateFrom" value={filter.dateFrom} onChange={handleFilterChange} style={{borderColor: THEME.border}} />
                            </Col>
                            <Col md={2}>
                                <Form.Label className="small fw-bold text-muted">თარიღი (-მდე)</Form.Label>
                                <Form.Control size="sm" type="date" name="dateTo" value={filter.dateTo} onChange={handleFilterChange} style={{borderColor: THEME.border}} />
                            </Col>
                            <Col md={1}>
                                <Button variant="outline-secondary" size="sm" className="w-100" onClick={clearFilters} title="ფილტრის გასუფთავება">
                                    X
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Table */}
                <Card style={cardStyle}>
                    <Table hover responsive striped size="sm" className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr style={{fontSize: '0.85rem', color: THEME.primary, borderBottom: '2px solid #dfe6e9'}}>
                                <th className="ps-3 py-3"># ნომერი</th>
                                <th className="py-3">ობიექტის დასახელება</th>
                                <th className="py-3">დამკვეთი</th>
                                <th className="py-3">ექსპერტი</th>
                                <th className="py-3">რეგისტრაციის თარიღი</th>
                                <th className="py-3 text-center">სტატუსი</th>
                                <th className="py-3 text-end pe-4">მოქმედება</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? (
                                filtered.map((item) => (
                                    <tr key={item._id} style={{fontSize: '0.9rem'}}>
                                        <td className="ps-3 fw-bold" style={{color: THEME.primary}}>{item.inspectionNumber}</td>
                                        <td className="text-truncate" style={{maxWidth: '250px'}} title={item.objectName}>{item.objectName}</td>
                                        <td className="text-muted small">{item.clientName || '-'}</td>
                                        <td className="fw-bold text-dark">
                                            {item.expert ? `${item.expert.firstName} ${item.expert.lastName}` : '-'}
                                        </td>
                                        <td className="text-muted">
                                            {new Date(item.createdAt).toLocaleDateString('ka-GE')}
                                        </td>
                                        <td className="text-center">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="text-end pe-3">
                                            <Button
                                                size="sm"
                                                variant="outline-primary"
                                                className="py-0 px-2 me-1"
                                                style={{fontSize: '0.8rem', borderRadius: '4px'}}
                                                onClick={() => navigate(`/inspections/${item._id}`)}
                                            >
                                                დეტალები
                                            </Button>
                                            {isAdmin && (
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    className="py-0 px-2"
                                                    style={{fontSize: '0.8rem', borderRadius: '4px'}}
                                                    onClick={() => handleDelete(item._id, item.inspectionNumber)}
                                                >
                                                    🗑️
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        ჩანაწერი ვერ მოიძებნა
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card>

            </Container>
        </div>
    );
};

export default InspectionList;