import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Button, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [staff, setStaff] = useState([]); // პერსონალის მონიტორინგისთვის
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const COLORS = {
        primary: '#2c3e50',    // Navy Blue
        success: '#198754',    // Green
        warning: '#ffc107',    // Yellow
        danger: '#dc3545',     // Red
        info: '#0dcaf0',       // Cyan
        light: '#f8f9fa',
        dark: '#212529'
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resStats, resStaff] = await Promise.all([
                    axios.get('/api/dashboard/stats'),
                    axios.get('/api/users/staff') // პერსონალის ინფო
                ]);
                setStats(resStats.data);
                setStaff(resStaff.data);
                setLoading(false);
            } catch (err) { console.error(err); setLoading(false); }
        };
        fetchData();
    }, []);

    if (loading) return <Container className="vh-100 d-flex justify-content-center align-items-center"><Spinner animation="border" /></Container>;

    // მონაცემები
    const pieData = [
        { name: 'დასრულებული', value: stats?.counts?.completed || 0, color: COLORS.success },
        { name: 'მიმდინარე', value: stats?.counts?.active || 0, color: COLORS.warning },
        { name: 'ახალი', value: stats?.counts?.registered || 0, color: '#0d6efd' }
    ];

    const eq = stats?.equipment || { expired: 0, warning: 0, valid: 0 };

    // პერსონალის ვალიდაცია (ვის გასდის ვადა)
    const expiringStaff = staff.filter(s => {
        if(!s.authExpiry) return false;
        const days = Math.ceil((new Date(s.authExpiry) - new Date()) / (1000 * 60 * 60 * 24));
        return days > 0 && days <= 60; // 60 დღეზე ნაკლები
    });

    // სტილები
    const cardHeaderStyle = { backgroundColor: COLORS.primary, color: 'white', fontWeight: 'bold', padding: '10px 15px', fontSize: '0.9rem' };
    const smallCardStyle = { borderLeft: '4px solid', height: '100%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };

    return (
        <div style={{ backgroundColor: '#eef2f6', minHeight: '100vh', paddingBottom: '40px', fontFamily: 'Arial, sans-serif' }}>
            <Container fluid className="px-4 pt-4">
                
                {/* 1. Header Area */}
                <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm border-start border-5 border-primary">
                    <div>
                        <h4 className="fw-bold m-0 text-dark">Buildex მართვის პანელი</h4>
                        <span className="text-muted small">სისტემური სტატუსი: ონლაინ</span>
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="outline-dark" size="sm" onClick={() => navigate('/inspections')}>📜 რეესტრი</Button>
                        <Button variant="primary" size="sm" onClick={() => navigate('/add-inspection')}>+ ახალი საქმე</Button>
                    </div>
                </div>

                {/* 2. KPI Cards (Compact Row) */}
                <Row className="g-3 mb-4">
                    <Col md={3}>
                        <Card className="border-0" style={{...smallCardStyle, borderLeftColor: COLORS.primary}}>
                            <Card.Body className="p-3 d-flex justify-content-between align-items-center">
                                <div><div className="text-muted small fw-bold">სულ საქმეები</div><h3 className="m-0 fw-bold">{stats?.counts?.total}</h3></div>
                                <div className="fs-1 text-muted opacity-25">📁</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="border-0" style={{...smallCardStyle, borderLeftColor: COLORS.warning}}>
                            <Card.Body className="p-3 d-flex justify-content-between align-items-center">
                                <div><div className="text-muted small fw-bold">მიმდინარე</div><h3 className="m-0 fw-bold text-warning">{stats?.counts?.active}</h3></div>
                                <div className="fs-1 text-warning opacity-25">⚡</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="border-0" style={{...smallCardStyle, borderLeftColor: COLORS.success}}>
                            <Card.Body className="p-3 d-flex justify-content-between align-items-center">
                                <div><div className="text-muted small fw-bold">დასრულებული</div><h3 className="m-0 fw-bold text-success">{stats?.counts?.completed}</h3></div>
                                <div className="fs-1 text-success opacity-25">✅</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="border-0" style={{...smallCardStyle, borderLeftColor: COLORS.info}}>
                            <Card.Body className="p-3 d-flex justify-content-between align-items-center">
                                <div><div className="text-muted small fw-bold">პერსონალი</div><h3 className="m-0 fw-bold text-info">{stats?.counts?.staffCount}</h3></div>
                                <div className="fs-1 text-info opacity-25">👥</div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* 3. Main Content Grid (3 Columns for Density) */}
                <Row className="g-3">
                    
                    {/* COL 1: Deadlines & Recent Activity */}
                    <Col lg={5}>
                        {/* ვადების ცხრილი */}
                        <Card className="shadow-sm border-0 mb-3 h-100">
                            <Card.Header style={cardHeaderStyle}>⚠️ კრიტიკული ვადები (5 დღე)</Card.Header>
                            <Table hover responsive size="sm" className="mb-0 text-nowrap align-middle">
                                <thead className="bg-light">
                                    <tr style={{fontSize: '0.8rem'}}><th>საქმე</th><th>ობიექტი</th><th>ვადა</th><th>ექსპერტი</th></tr>
                                </thead>
                                <tbody>
                                    {stats?.urgentList?.length > 0 ? stats.urgentList.map(item => (
                                        <tr key={item._id} style={{cursor: 'pointer', fontSize: '0.9rem'}} onClick={() => navigate(`/inspections/${item._id}`)}>
                                            <td className="fw-bold text-primary">{item.inspectionNumber}</td>
                                            <td className="text-truncate" style={{maxWidth: '120px'}} title={item.objectName}>{item.objectName}</td>
                                            <td><Badge bg="danger">{new Date(item.deadline).toLocaleDateString()}</Badge></td>
                                            <td className="small fw-bold">{item.expert ? `${item.expert.firstName} ${item.expert.lastName}` : '-'}</td>
                                        </tr>
                                    )) : <tr><td colSpan="4" className="text-center py-4 text-muted small">ვადები დაცულია</td></tr>}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>

                    {/* COL 2: Equipment & Staff Alerts (Middle Column) */}
                    <Col lg={3}>
                        {/* აპარატურა (Compact List) */}
                        <Card className="shadow-sm border-0 mb-3">
                            <Card.Header style={{...cardHeaderStyle, backgroundColor: '#34495e'}}>🛠️ აპარატურა</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                    <span className="small text-danger fw-bold">● ვადაგასული</span>
                                    <Badge bg="danger" pill>{eq.expired}</Badge>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                    <span className="small text-warning fw-bold">● იწურება</span>
                                    <Badge bg="warning" text="dark" pill>{eq.warning}</Badge>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                    <span className="small text-success fw-bold">● ვალიდური</span>
                                    <Badge bg="success" pill>{eq.valid}</Badge>
                                </ListGroup.Item>
                                <ListGroup.Item className="p-2 text-center">
                                    <Button variant="link" size="sm" className="text-decoration-none p-0" onClick={() => navigate('/equipment')}>სრული სია &gt;</Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>

                        {/* პერსონალის მონიტორინგი (ახალი) */}
                        <Card className="shadow-sm border-0">
                            <Card.Header style={{...cardHeaderStyle, backgroundColor: '#d35400'}}>🆔 პერსონალის ავტორიზაცია</Card.Header>
                            <Card.Body className="p-0">
                                {expiringStaff.length > 0 ? (
                                    <ListGroup variant="flush">
                                        {expiringStaff.map(s => (
                                            <ListGroup.Item key={s._id} className="small d-flex justify-content-between">
                                                <span>{s.firstName} {s.lastName}</span>
                                                <span className="text-danger fw-bold">{new Date(s.authExpiry).toLocaleDateString()}</span>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <div className="p-3 text-center small text-muted">
                                        ყველა თანამშრომლის ავტორიზაცია წესრიგშია ✅
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* COL 3: Analytics & Activity */}
                    <Col lg={4}>
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Header style={{...cardHeaderStyle, backgroundColor: 'white', color: 'black', borderBottom: '1px solid #eee'}}>📊 დატვირთვის სტატისტიკა</Card.Header>
                            <Card.Body>
                                <div style={{ width: '100%', height: 200 }}>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} iconSize={10}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-3">
                                    <h6 className="small fw-bold text-muted border-bottom pb-2">ბოლო აქტივობა</h6>
                                    <div className="small text-muted">
                                        {/* აქ შეიძლება ბოლო 3 საქმის გამოტანა */}
                                        <div className="d-flex justify-content-between mb-1"><span>ბოლო რეგისტრაცია:</span> <strong>{new Date().toLocaleDateString()}</strong></div>
                                        <div className="d-flex justify-content-between"><span>სისტემის ვერსია:</span> <strong>v2.1 (ISO)</strong></div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

            </Container>
        </div>
    );
};

export default Dashboard;