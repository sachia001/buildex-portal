import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Button, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = ({ role }) => {
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
    const ins = stats?.insurance || { expiringSoon: [], expired: [] };
    const alerts = stats?.alerts || { openComplaints: 0, overdueActions: 0 };

    // პერსონალის ვალიდაცია (ვის გასდის ვადა)
    const expiringStaff = staff.filter(s => {
        if(!s.authExpiry) return false;
        const days = Math.ceil((new Date(s.authExpiry) - new Date()) / (1000 * 60 * 60 * 24));
        return days > 0 && days <= 60; // 60 დღეზე ნაკლები
    });

    // სტილები
    const cardHeaderStyle = { fontWeight: '600', padding: '0.75rem 1.25rem', fontSize: '0.9rem' };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '40px' }}>
            <Container fluid className="px-0 pt-0">

                {/* 1. Header Area */}
                <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm"
                     style={{ borderLeft: '4px solid var(--primary)' }}>
                    <div>
                        <h4 className="page-title mb-0">ბილდექს მართვის პანელი</h4>
                        <span className="page-subtitle">ISO/IEC 17020:2012 · სისტემური სტატუსი: ონლაინ</span>
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={() => navigate('/inspections')}>📜 რეესტრი</Button>
                        <Button variant="primary" size="sm" onClick={() => navigate('/add-inspection')}>+ ახალი საქმე</Button>
                    </div>
                </div>

                {/* 2. KPI Cards */}
                <Row className="g-3 mb-4">
                    <Col md={3}>
                        <div className="stat-card" style={{ borderLeftColor: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate('/inspections')}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="stat-label">სულ საქმეები</div>
                                    <div className="stat-value" style={{ color: 'var(--primary)' }}>{stats?.counts?.total}</div>
                                </div>
                                <div className="fs-1 opacity-15">📁</div>
                            </div>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="stat-card" style={{ borderLeftColor: 'var(--warning)', cursor: 'pointer' }} onClick={() => navigate('/inspections')}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="stat-label">მიმდინარე</div>
                                    <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats?.counts?.active}</div>
                                </div>
                                <div className="fs-1 opacity-15">⚡</div>
                            </div>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="stat-card" style={{ borderLeftColor: 'var(--success)', cursor: 'pointer' }} onClick={() => navigate('/inspections')}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="stat-label">დასრულებული</div>
                                    <div className="stat-value" style={{ color: 'var(--success)' }}>{stats?.counts?.completed}</div>
                                </div>
                                <div className="fs-1 opacity-15">✅</div>
                            </div>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="stat-card" style={{ borderLeftColor: 'var(--info)', cursor: 'pointer' }} onClick={() => navigate('/admin')}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="stat-label">პერსონალი</div>
                                    <div className="stat-value" style={{ color: 'var(--info)' }}>{stats?.counts?.staffCount}</div>
                                </div>
                                <div className="fs-1 opacity-15">👥</div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Quick Actions */}
                <div className="d-flex gap-2 flex-wrap mb-4">
                    <Button variant="outline-secondary" size="sm" onClick={() => navigate('/complaints')}>📨 საჩივრები</Button>
                    <Button variant="outline-secondary" size="sm" onClick={() => navigate('/internal-audits')}>🔍 შიდა აუდიტი</Button>
                    <Button variant="outline-secondary" size="sm" onClick={() => navigate('/corrective-actions')}>⚙️ CAR</Button>
                    <Button variant="outline-secondary" size="sm" onClick={() => navigate('/equipment')}>🛠️ აპარატურა</Button>
                    <Button variant="outline-secondary" size="sm" onClick={() => navigate('/insurance')}>🛡️ დაზღვევა</Button>
                </div>

                {/* 3. Main Content Grid (3 Columns for Density) */}
                <Row className="g-3">
                    
                    {/* COL 1: Deadlines & Recent Activity */}
                    <Col lg={5}>
                        {/* ვადების ცხრილი */}
                        <Card className="mb-3 h-100">
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
                                            <td className="small fw-bold">{Array.isArray(item.expert) && item.expert.length > 0 ? item.expert.map(e => `${e.firstName} ${e.lastName}`).join(', ') : (item.expert ? `${item.expert.firstName} ${item.expert.lastName}` : '-')}</td>
                                        </tr>
                                    )) : <tr><td colSpan="4" className="text-center py-4 text-muted small">ვადები დაცულია</td></tr>}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>

                    {/* COL 2: Equipment & Staff Alerts (Middle Column) */}
                    <Col lg={3}>
                        {/* აპარატურა (Compact List) */}
                        <Card className="mb-3">
                            <Card.Header style={cardHeaderStyle}>🛠️ აპარატურა</Card.Header>
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
                        <Card className="mb-3">
                            <Card.Header style={cardHeaderStyle}>🆔 პერსონალის ავტორიზაცია</Card.Header>
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

                        {/* ISO შესაბამისობის მაჩვენებლები */}
                        {(ins.expired.length > 0 || ins.expiringSoon.length > 0 || alerts.openComplaints > 0 || alerts.overdueActions > 0) && (
                            <Card className="">
                                <Card.Header style={cardHeaderStyle}>⚠️ ISO გაფრთხილებები</Card.Header>
                                <ListGroup variant="flush">
                                    {ins.expired.length > 0 && (
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <span className="small text-danger fw-bold">🛡️ ვადაგასული პოლისი</span>
                                            <Badge bg="danger" pill>{ins.expired.length}</Badge>
                                        </ListGroup.Item>
                                    )}
                                    {ins.expiringSoon.length > 0 && (
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <span className="small text-warning fw-bold">🛡️ პოლისი იწურება</span>
                                            <Badge bg="warning" text="dark" pill>{ins.expiringSoon.length}</Badge>
                                        </ListGroup.Item>
                                    )}
                                    {alerts.openComplaints > 0 && (
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center" style={{cursor:'pointer'}} onClick={() => navigate('/complaints')}>
                                            <span className="small fw-bold">📨 ღია საჩივრები</span>
                                            <Badge bg="warning" text="dark" pill>{alerts.openComplaints}</Badge>
                                        </ListGroup.Item>
                                    )}
                                    {alerts.overdueActions > 0 && (
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center" style={{cursor:'pointer'}} onClick={() => navigate('/corrective-actions')}>
                                            <span className="small text-danger fw-bold">⚙️ ვადაგასული CAR</span>
                                            <Badge bg="danger" pill>{alerts.overdueActions}</Badge>
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            </Card>
                        )}
                    </Col>

                    {/* COL 3: Analytics & Activity */}
                    <Col lg={4}>
                        <Card className="h-100">
                            <Card.Header style={cardHeaderStyle}>📊 დატვირთვის სტატისტიკა</Card.Header>
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

                {/* Recent / Urgent Inspections */}
                <Row className="mt-3">
                    <Col>
                        <Card className="">
                            <Card.Header style={cardHeaderStyle}>📋 გადაუდებელი ვადების მქონე საქმეები</Card.Header>
                            <Table hover size="sm" responsive className="mb-0 align-middle">
                                <thead className="bg-light">
                                    <tr style={{fontSize: '0.85rem'}}>
                                        <th className="p-2">საქმე №</th>
                                        <th>ობიექტი</th>
                                        <th>დამკვეთი</th>
                                        <th>სტატუსი</th>
                                        <th>ვადა</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.urgentList && stats.urgentList.length > 0 ? stats.urgentList.map(item => (
                                        <tr key={item._id} style={{cursor:'pointer', fontSize:'0.85rem'}} onClick={() => navigate(`/inspections/${item._id}`)}>
                                            <td className="p-2 fw-bold text-primary font-monospace">{item.inspectionNumber}</td>
                                            <td className="text-truncate" style={{maxWidth:180}}>{item.objectName}</td>
                                            <td className="text-muted text-truncate" style={{maxWidth:150}}>{item.clientName}</td>
                                            <td><Badge bg={item.status==='დასრულებული'?'success':item.status==='მიმდინარე'?'warning':'secondary'} text={item.status==='მიმდინარე'?'dark':undefined}>{item.status}</Badge></td>
                                            <td className="small">{item.deadline ? new Date(item.deadline).toLocaleDateString('ka-GE') : '—'}</td>
                                        </tr>
                                    )) : <tr><td colSpan="5" className="text-center py-3 text-muted small">გადაუდებელი ვადები არ არის</td></tr>}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>

            </Container>
        </div>
    );
};


export default Dashboard;