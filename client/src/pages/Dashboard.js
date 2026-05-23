import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge, Spinner, ProgressBar } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const fmt = d => d ? new Date(d).toLocaleDateString('ka-GE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
const daysLeft = d => Math.ceil((new Date(d) - new Date()) / 86400000);

const KpiCard = ({ label, value, icon, color, sub, onClick }) => (
    <div className="stat-card" style={{ borderLeftColor: color, cursor: onClick ? 'pointer' : 'default', height: '100%' }} onClick={onClick}>
        <div className="d-flex justify-content-between align-items-start">
            <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, color }}>{value ?? '—'}</div>
                {sub && <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>{sub}</div>}
            </div>
            <div style={{ fontSize: '2rem', opacity: 0.12 }}>{icon}</div>
        </div>
    </div>
);

const SectionTitle = ({ children }) => (
    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid #e2e8f0' }}>
        {children}
    </div>
);

const AlertRow = ({ icon, label, count, color, onClick }) => (
    <div className="d-flex justify-content-between align-items-center py-2"
         style={{ borderBottom: '1px solid #f1f5f9', cursor: onClick ? 'pointer' : 'default' }}
         onClick={onClick}>
        <span style={{ fontSize: '0.82rem', color: color || '#1e293b' }}>{icon} {label}</span>
        <span style={{ background: color, color: 'white', borderRadius: 12, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700 }}>{count}</span>
    </div>
);

const actionLabels = {
    შექმნა: { bg: '#dcfce7', color: '#166534' },
    განახლება: { bg: '#dbeafe', color: '#1e40af' },
    ატვირთვა: { bg: '#ede9fe', color: '#5b21b6' },
    წაშლა: { bg: '#fee2e2', color: '#991b1b' },
};

const resourceLabels = {
    inspection: 'ინსპ.', user: 'პერს.', procedure: 'დოკ.',
    equipment: 'მოწყ.', complaint: 'საჩ.', corrective_action: 'CAR',
    internal_audit: 'აუდ.',
};

const Dashboard = ({ role }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/dashboard/stats')
            .then(r => { setStats(r.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
                <Spinner animation="border" style={{ color: 'var(--primary)' }} />
                <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 12 }}>იტვირთება...</div>
            </div>
        </div>
    );

    const c = stats?.counts || {};
    const eq = stats?.equipment || { expired: 0, warning: 0, valid: 0, list: [] };
    const ins = stats?.insurance || { expiringSoon: [], expired: [] };
    const comp = stats?.complaints || { open: 0, inProgress: 0, closed: 0 };
    const car = stats?.correctiveActions || { open: 0, overdue: 0, closed: 0 };
    const aud = stats?.audits || { planned: 0, completed: 0 };
    const proc = stats?.procedures || { total: 0, uploaded: 0 };
    const logs = stats?.recentLogs || [];
    const expStaff = stats?.expiringStaff || [];
    const urgent = stats?.urgentList || [];

    const pieData = [
        { name: 'დასრულებული', value: c.completed || 0, color: '#059669' },
        { name: 'მიმდინარე',   value: c.active     || 0, color: '#d97706' },
        { name: 'ახალი',       value: c.registered || 0, color: '#2563eb' },
    ];

    const qualityData = [
        { name: 'საჩივ.', open: comp.open, closed: comp.closed },
        { name: 'CAR',    open: car.open,  closed: car.closed },
        { name: 'აუდ.',   open: aud.planned, closed: aud.completed },
    ];

    // ISO compliance score (simple heuristic)
    let score = 100;
    if (eq.expired > 0)            score -= 15;
    if (eq.warning > 0)            score -= 5;
    if (ins.expired.length > 0)    score -= 10;
    if (car.overdue > 0)           score -= car.overdue * 5;
    if (comp.open > 0)             score -= comp.open * 3;
    if (expStaff.filter(s => s.daysLeft < 0).length > 0) score -= 10;
    score = Math.max(0, Math.min(100, score));
    const scoreColor = score >= 85 ? '#059669' : score >= 65 ? '#d97706' : '#dc2626';
    const scoreLabel = score >= 85 ? 'კარგი' : score >= 65 ? 'საშუალო' : 'სასწრაფო';

    const totalAlerts = (eq.expired > 0 ? 1 : 0) + (ins.expired.length > 0 ? 1 : 0) +
        (car.overdue > 0 ? 1 : 0) + (comp.open > 0 ? 1 : 0) +
        expStaff.filter(s => s.daysLeft < 0).length;

    return (
        <div style={{ minHeight: '100vh', paddingBottom: 40, background: 'var(--bg)' }}>

            {/* ══════════════ HEADER ══════════════ */}
            <div className="bg-white mb-4" style={{ borderBottom: '1px solid #e2e8f0', padding: '16px 24px' }}>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h4 style={{ margin: 0, fontWeight: 700, color: 'var(--primary)', fontSize: '1.25rem' }}>
                            ბილდექს ექსპერტიზა — მართვის პანელი
                        </h4>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
                            ISO/IEC 17020:2012 · {new Date().toLocaleDateString('ka-GE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        {totalAlerts > 0 && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '6px 14px', fontSize: '0.8rem', color: '#dc2626', fontWeight: 600 }}>
                                ⚠️ {totalAlerts} გაფრთხილება
                            </div>
                        )}
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ISO შესაბამისობა</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: scoreColor, lineHeight: 1 }}>{score}% <span style={{ fontSize: '0.75rem' }}>{scoreLabel}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ padding: '0 24px' }}>

                {/* ══════════════ ROW 1: KPI CARDS ══════════════ */}
                <Row className="g-3 mb-4">
                    <Col xs={6} md={4} lg={2}>
                        <KpiCard label="სულ საქმე" value={c.total} icon="📁" color="var(--primary)" sub={`+${c.monthlyInspections || 0} ამ თვეში`} onClick={() => navigate('/inspections')} />
                    </Col>
                    <Col xs={6} md={4} lg={2}>
                        <KpiCard label="მიმდინარე" value={c.active} icon="⚡" color="#d97706" onClick={() => navigate('/inspections')} />
                    </Col>
                    <Col xs={6} md={4} lg={2}>
                        <KpiCard label="დასრულებული" value={c.completed} icon="✅" color="#059669" onClick={() => navigate('/inspections')} />
                    </Col>
                    <Col xs={6} md={4} lg={2}>
                        <KpiCard label="პერსონალი" value={c.staffCount} icon="👥" color="#0284c7" onClick={() => navigate('/admin')} />
                    </Col>
                    <Col xs={6} md={4} lg={2}>
                        <KpiCard label="ღია CAR" value={car.open} icon="⚙️" color={car.overdue > 0 ? '#dc2626' : '#64748b'} sub={car.overdue > 0 ? `${car.overdue} ვადაგასული` : 'ვადაში'} onClick={() => navigate('/corrective-actions')} />
                    </Col>
                    <Col xs={6} md={4} lg={2}>
                        <KpiCard label="ღია საჩივარი" value={comp.open} icon="📨" color={comp.open > 0 ? '#dc2626' : '#64748b'} onClick={() => navigate('/complaints')} />
                    </Col>
                </Row>

                {/* ══════════════ ROW 2: MAIN CONTENT ══════════════ */}
                <Row className="g-3 mb-4">

                    {/* LEFT: Urgent deadlines */}
                    <Col lg={5}>
                        <Card style={{ height: '100%', border: '1px solid #e2e8f0' }}>
                            <Card.Header className="d-flex justify-content-between align-items-center" style={{ background: 'var(--primary)', color: 'white', padding: '10px 16px' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>📅 მომავალი ვადები (30 დღე)</span>
                                <Badge bg="warning" text="dark" style={{ fontSize: '0.7rem' }}>{urgent.length}</Badge>
                            </Card.Header>
                            <div style={{ overflowY: 'auto', maxHeight: 320 }}>
                                <Table size="sm" className="mb-0" style={{ fontSize: '0.8rem' }}>
                                    <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1 }}>
                                        <tr>
                                            <th style={{ padding: '8px 12px', fontWeight: 600, color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase' }}>№</th>
                                            <th style={{ padding: '8px 12px', fontWeight: 600, color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase' }}>ობიექტი</th>
                                            <th style={{ padding: '8px 12px', fontWeight: 600, color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase' }}>ვადა</th>
                                            <th style={{ padding: '8px 12px', fontWeight: 600, color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase' }}>დღე</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {urgent.length > 0 ? urgent.map(item => {
                                            const d = daysLeft(item.deadline);
                                            const urgColor = d <= 3 ? '#dc2626' : d <= 7 ? '#d97706' : '#059669';
                                            return (
                                                <tr key={item._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/inspections/${item._id}`)}>
                                                    <td style={{ padding: '8px 12px', fontWeight: 700, color: 'var(--primary-light)', fontFamily: 'monospace' }}>{item.inspectionNumber}</td>
                                                    <td style={{ padding: '8px 12px', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.objectName}>{item.objectName}</td>
                                                    <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>{fmt(item.deadline)}</td>
                                                    <td style={{ padding: '8px 12px' }}>
                                                        <span style={{ background: urgColor + '18', color: urgColor, borderRadius: 10, padding: '2px 8px', fontWeight: 700, fontSize: '0.75rem' }}>{d}დ</span>
                                                    </td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32, color: '#94a3b8', fontSize: '0.85rem' }}>✅ ვადაში პრობლემა არ არის</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card>
                    </Col>

                    {/* CENTER: Alerts & Status */}
                    <Col lg={3}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>

                            {/* ISO Alerts */}
                            <Card style={{ border: '1px solid #e2e8f0' }}>
                                <Card.Header style={{ background: 'var(--primary)', color: 'white', padding: '10px 16px' }}>
                                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>🚨 სასწრაფო გაფრთხილებები</span>
                                </Card.Header>
                                <Card.Body style={{ padding: '8px 14px' }}>
                                    {eq.expired > 0 && <AlertRow icon="🛠️" label={`${eq.expired} ვადაგასული მოწყობილობა`} count={eq.expired} color="#dc2626" onClick={() => navigate('/equipment')} />}
                                    {eq.warning > 0 && <AlertRow icon="🛠️" label={`${eq.warning} კალიბრაცია იწურება`} count={eq.warning} color="#d97706" onClick={() => navigate('/equipment')} />}
                                    {ins.expired.length > 0 && <AlertRow icon="🛡️" label="ვადაგასული პოლისი" count={ins.expired.length} color="#dc2626" onClick={() => navigate('/insurance')} />}
                                    {ins.expiringSoon.length > 0 && <AlertRow icon="🛡️" label="პოლისი იწურება" count={ins.expiringSoon.length} color="#d97706" onClick={() => navigate('/insurance')} />}
                                    {car.overdue > 0 && <AlertRow icon="⚙️" label="ვადაგასული CAR" count={car.overdue} color="#dc2626" onClick={() => navigate('/corrective-actions')} />}
                                    {comp.open > 0 && <AlertRow icon="📨" label="ღია საჩივარი" count={comp.open} color="#d97706" onClick={() => navigate('/complaints')} />}
                                    {expStaff.filter(s => s.daysLeft < 0).length > 0 && <AlertRow icon="🆔" label="ავტ. ვადა გასულია" count={expStaff.filter(s => s.daysLeft < 0).length} color="#dc2626" onClick={() => navigate('/admin')} />}
                                    {expStaff.filter(s => s.daysLeft >= 0 && s.daysLeft <= 30).length > 0 && <AlertRow icon="🆔" label="ავტ. იწურება (30დ)" count={expStaff.filter(s => s.daysLeft >= 0 && s.daysLeft <= 30).length} color="#d97706" onClick={() => navigate('/admin')} />}
                                    {totalAlerts === 0 && (
                                        <div style={{ textAlign: 'center', padding: '16px 0', color: '#059669', fontSize: '0.85rem' }}>
                                            ✅ გაფრთხილებები არ არის
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>

                            {/* Procedures upload progress */}
                            <Card style={{ border: '1px solid #e2e8f0' }}>
                                <Card.Header style={{ background: 'var(--primary)', color: 'white', padding: '10px 16px' }}>
                                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>📂 პროცედურების სტატუსი</span>
                                </Card.Header>
                                <Card.Body style={{ padding: '12px 14px' }}>
                                    <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.8rem' }}>
                                        <span style={{ color: '#64748b' }}>ატვირთული</span>
                                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{proc.uploaded} / {proc.total}</span>
                                    </div>
                                    <ProgressBar
                                        now={proc.total > 0 ? Math.round((proc.uploaded / proc.total) * 100) : 0}
                                        style={{ height: 8, borderRadius: 4 }}
                                        variant={proc.uploaded === proc.total ? 'success' : 'primary'}
                                    />
                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 6, textAlign: 'right' }}>
                                        {proc.total > 0 ? Math.round((proc.uploaded / proc.total) * 100) : 0}% დასრულებული
                                    </div>
                                    <div style={{ marginTop: 8, textAlign: 'right' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/procedures')}>
                                            სრული სია →
                                        </span>
                                    </div>
                                </Card.Body>
                            </Card>

                        </div>
                    </Col>

                    {/* RIGHT: Charts */}
                    <Col lg={4}>
                        <Card style={{ height: '100%', border: '1px solid #e2e8f0' }}>
                            <Card.Header style={{ background: 'var(--primary)', color: 'white', padding: '10px 16px' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>📊 სტატისტიკა</span>
                            </Card.Header>
                            <Card.Body style={{ padding: '12px' }}>
                                {/* Pie */}
                                <div style={{ height: 170 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={pieData} innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                                                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                            </Pie>
                                            <Tooltip formatter={(v, n) => [v, n]} />
                                            <Legend iconSize={8} wrapperStyle={{ fontSize: '0.75rem' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Quality bar chart */}
                                <div style={{ marginTop: 8 }}>
                                    <SectionTitle>ხარისხის ინდიკატორები</SectionTitle>
                                    <div style={{ height: 100 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={qualityData} barSize={12} barGap={4}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                                                <Tooltip />
                                                <Bar dataKey="open" name="ღია" fill="#fbbf24" radius={[2,2,0,0]} />
                                                <Bar dataKey="closed" name="დახ." fill="#34d399" radius={[2,2,0,0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* ══════════════ ROW 3: EQUIPMENT + STAFF + ACTIVITY ══════════════ */}
                <Row className="g-3">

                    {/* Equipment needing attention */}
                    <Col lg={4}>
                        <Card style={{ border: '1px solid #e2e8f0' }}>
                            <Card.Header style={{ background: 'var(--primary)', color: 'white', padding: '10px 16px' }} className="d-flex justify-content-between">
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>🛠️ კალიბრაციის სტატუსი</span>
                                <span style={{ fontSize: '0.75rem', cursor: 'pointer', opacity: 0.8 }} onClick={() => navigate('/equipment')}>სრული →</span>
                            </Card.Header>
                            <Card.Body style={{ padding: '8px 0' }}>
                                <div style={{ display: 'flex', padding: '8px 14px 12px', gap: 8, borderBottom: '1px solid #f1f5f9' }}>
                                    {[
                                        { label: 'ვალიდური', value: eq.valid, color: '#059669' },
                                        { label: 'იწურება', value: eq.warning, color: '#d97706' },
                                        { label: 'ვადაგასული', value: eq.expired, color: '#dc2626' },
                                    ].map(s => (
                                        <div key={s.label} style={{ flex: 1, textAlign: 'center', background: s.color + '12', borderRadius: 8, padding: '8px 4px' }}>
                                            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                                            <div style={{ fontSize: '0.65rem', color: s.color, fontWeight: 600 }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                                {eq.list.length > 0 ? (
                                    <div style={{ maxHeight: 140, overflowY: 'auto' }}>
                                        {eq.list.map((e, i) => (
                                            <div key={i} className="d-flex justify-content-between align-items-center" style={{ padding: '6px 14px', borderBottom: '1px solid #f8fafc', fontSize: '0.8rem' }}>
                                                <span>{e.name}</span>
                                                <span style={{ color: e.status === 'expired' ? '#dc2626' : '#d97706', fontWeight: 600, fontSize: '0.75rem' }}>
                                                    {e.status === 'expired' ? `${Math.abs(e.days)}დ ვადაგ.` : `${e.days}დ დარჩა`}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '16px 0', color: '#94a3b8', fontSize: '0.8rem' }}>ყველა მოწყობილობა ვალიდურია</div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Staff authorization */}
                    <Col lg={4}>
                        <Card style={{ border: '1px solid #e2e8f0' }}>
                            <Card.Header style={{ background: 'var(--primary)', color: 'white', padding: '10px 16px' }} className="d-flex justify-content-between">
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>🆔 პერსონალის ავტორიზაცია</span>
                                <span style={{ fontSize: '0.75rem', cursor: 'pointer', opacity: 0.8 }} onClick={() => navigate('/admin')}>სრული →</span>
                            </Card.Header>
                            <Card.Body style={{ padding: 0 }}>
                                {expStaff.length > 0 ? (
                                    <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                                        {expStaff.map(s => {
                                            const col = s.daysLeft < 0 ? '#dc2626' : s.daysLeft <= 14 ? '#d97706' : '#f59e0b';
                                            return (
                                                <div key={s._id} className="d-flex justify-content-between align-items-center" style={{ padding: '8px 14px', borderBottom: '1px solid #f8fafc', fontSize: '0.82rem' }}>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{s.firstName} {s.lastName}</div>
                                                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{s.position || 'პოზიცია არ მითითებია'}</div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ color: col, fontWeight: 700, fontSize: '0.78rem' }}>
                                                            {s.daysLeft < 0 ? `${Math.abs(s.daysLeft)}დ ვადაგ.` : `${s.daysLeft}დ დარჩა`}
                                                        </div>
                                                        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{fmt(s.authExpiry)}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: 32, color: '#059669', fontSize: '0.85rem' }}>
                                        ✅ ყველა თანამშრომლის ავტ. ვადაში
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Recent audit activity */}
                    <Col lg={4}>
                        <Card style={{ border: '1px solid #e2e8f0' }}>
                            <Card.Header style={{ background: 'var(--primary)', color: 'white', padding: '10px 16px' }} className="d-flex justify-content-between">
                                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>📋 ბოლო აქტივობა</span>
                                <span style={{ fontSize: '0.75rem', cursor: 'pointer', opacity: 0.8 }} onClick={() => navigate('/audit-log')}>სრული →</span>
                            </Card.Header>
                            <Card.Body style={{ padding: 0 }}>
                                {logs.length > 0 ? (
                                    <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                                        {logs.map((log, i) => {
                                            const style = actionLabels[log.action] || { bg: '#f1f5f9', color: '#475569' };
                                            const ts = new Date(log.timestamp);
                                            const timeStr = ts.toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' });
                                            const dateStr = ts.toLocaleDateString('ka-GE', { day: '2-digit', month: '2-digit' });
                                            return (
                                                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 14px', borderBottom: '1px solid #f8fafc', alignItems: 'flex-start' }}>
                                                    <span style={{ background: style.bg, color: style.color, borderRadius: 6, padding: '2px 7px', fontSize: '0.68rem', fontWeight: 700, whiteSpace: 'nowrap', marginTop: 2 }}>
                                                        {resourceLabels[log.resource] || log.resource}
                                                    </span>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {log.action} — {log.resourceName || '—'}
                                                        </div>
                                                        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{log.username} · {dateStr} {timeStr}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: 32, color: '#94a3b8', fontSize: '0.85rem' }}>
                                        აქტივობა ჯერ არ არის
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

            </div>
        </div>
    );
};

export default Dashboard;
