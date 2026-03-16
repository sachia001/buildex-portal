import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner, Modal, Table, Badge, Nav, Tab } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ROLE_OPTIONS = [
    { value: 'admin',           label: '👑 ადმინი (დონე 1)' },
    { value: 'chancellor',      label: '🗂️ კანცელარია (დონე 2)' },
    { value: 'tech_manager',    label: '🔧 ტექ. მენეჯერი (დონე 2)' },
    { value: 'quality_manager', label: '✅ ხარ. მენეჯერი (დონე 2)' },
    { value: 'hr',              label: '👥 HR (დონე 2)' },
    { value: 'inspector',       label: '🔍 ინსპექტორი (დონე 3)' },
];

const ROLE_BADGE = {
    admin:           { bg: 'danger',  label: 'ადმინი' },
    chancellor:      { bg: 'primary', label: 'კანცელარია' },
    tech_manager:    { bg: 'info',    label: 'ტექ. მენეჯერი' },
    quality_manager: { bg: 'success', label: 'ხარ. მენეჯერი' },
    hr:              { bg: 'warning', label: 'HR' },
    inspector:       { bg: 'secondary', label: 'ინსპექტორი' },
};

const AdminRegister = ({ role }) => {
    const navigate = useNavigate();
    const isAdmin = role === 'admin';
    const canManageUsers = isAdmin || role === 'hr';

    // ── Tab 1: Staff list ──────────────────────────────────────
    const [staff, setStaff] = useState([]);
    const [loadingStaff, setLoadingStaff] = useState(true);
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', personalId: '', position: 'ექსპერტი', email: '', phone: '', authExpiry: '',
    });
    const [competencies, setCompetencies] = useState([]);
    const competencyList = ["ფორმა №2", "ხარჯთაღრიცხვა", "ფარული სამუშაოები", "ლაბორატორიული კვლევა", "პროექტის ექსპერტიზა"];
    const [photoFile, setPhotoFile] = useState(null);
    const [staffError, setStaffError] = useState('');
    const [staffLoading, setStaffLoading] = useState(false);

    // ── Tab 2: Auth users ──────────────────────────────────────
    const [authUsers, setAuthUsers] = useState([]);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authForm, setAuthForm] = useState({ username: '', password: '', role: 'inspector', staffId: '' });
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    const fetchStaff = async () => {
        try {
            const res = await axios.get('/api/users/staff');
            setStaff(res.data);
        } catch (err) { console.error(err); }
        finally { setLoadingStaff(false); }
    };

    const fetchAuthUsers = async () => {
        if (!canManageUsers) return;
        setLoadingAuth(true);
        try {
            const res = await axios.get('/api/auth/users');
            setAuthUsers(res.data);
        } catch (err) { console.error(err); }
        finally { setLoadingAuth(false); }
    };

    useEffect(() => { fetchStaff(); fetchAuthUsers(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Staff handlers ─────────────────────────────────────────
    const handleDelete = async (id, name) => {
        if (!isAdmin) return alert('წაშლის უფლება არ გაქვთ');
        if (!window.confirm(`წაიშალოს ${name}? ეს ქმედება შეუქცევადია.`)) return;
        try { await axios.delete(`/api/users/${id}`); fetchStaff(); }
        catch { alert("წაშლა ვერ მოხერხდა"); }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleCompetencyChange = (e) => {
        const { value, checked } = e.target;
        if (checked) setCompetencies([...competencies, value]);
        else setCompetencies(competencies.filter(c => c !== value));
    };

    const resetStaffForm = () => {
        setFormData({ firstName: '', lastName: '', personalId: '', position: 'ექსპერტი', email: '', phone: '', authExpiry: '' });
        setCompetencies([]);
        setPhotoFile(null);
        setStaffError('');
    };

    const handleStaffSubmit = async (e) => {
        e.preventDefault();
        setStaffLoading(true); setStaffError('');
        if (!formData.firstName || !formData.personalId) { setStaffError("შეავსეთ სავალდებულო ველები!"); setStaffLoading(false); return; }
        const dataToSend = new FormData();
        dataToSend.append('userData', JSON.stringify({ ...formData, competencies }));
        if (photoFile) dataToSend.append('photo', photoFile);
        try {
            await axios.post('/api/users/register', dataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });
            setShowStaffModal(false); resetStaffForm(); fetchStaff();
            alert("✅ თანამშრომელი დარეგისტრირდა!");
        } catch (err) { setStaffError(err.response?.data?.error || "შეცდომა რეგისტრაციისას"); }
        finally { setStaffLoading(false); }
    };

    const getAuthStatus = (authExpiry) => {
        if (!authExpiry) return <Badge bg="secondary">არ არის</Badge>;
        const days = Math.ceil((new Date(authExpiry) - new Date()) / (1000 * 60 * 60 * 24));
        if (days < 0) return <Badge bg="danger">ვადაგასული</Badge>;
        if (days <= 60) return <Badge bg="warning" text="dark">{days} დღე</Badge>;
        return <Badge bg="success">მოქმედი</Badge>;
    };

    // ── Auth user handlers ─────────────────────────────────────
    const handleAuthDelete = async (id, uname) => {
        if (!isAdmin) return alert('მხოლოდ ადმინს შეუძლია წაშლა');
        if (!window.confirm(`წაიშალოს ${uname}?`)) return;
        try { await axios.delete(`/api/auth/users/${id}`); fetchAuthUsers(); }
        catch (err) { alert(err.response?.data?.message || "წაშლა ვერ მოხერხდა"); }
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthLoading(true); setAuthError('');
        if (!authForm.username || !authForm.password) { setAuthError("მომხმარებლის სახელი და პაროლი სავალდებულოა"); setAuthLoading(false); return; }
        try {
            await axios.post('/api/auth/users', authForm);
            setShowAuthModal(false);
            setAuthForm({ username: '', password: '', role: 'inspector', staffId: '' });
            fetchAuthUsers();
            alert("✅ მომხმარებელი შეიქმნა!");
        } catch (err) { setAuthError(err.response?.data?.message || "შეცდომა"); }
        finally { setAuthLoading(false); }
    };

    return (
        <Container className="mt-4 font-georgian pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold m-0 text-dark">👥 პერსონალის მართვა</h4>
                    <span className="text-muted small">ISO 17020 — სტაფის და სისტემის მომხმარებლები</span>
                </div>
            </div>

            <Tab.Container defaultActiveKey="staff">
                <Nav variant="tabs" className="mb-3">
                    <Nav.Item>
                        <Nav.Link eventKey="staff">👤 პერსონალის რეესტრი</Nav.Link>
                    </Nav.Item>
                    {canManageUsers && (
                        <Nav.Item>
                            <Nav.Link eventKey="users">🔐 სისტემის მომხმარებლები</Nav.Link>
                        </Nav.Item>
                    )}
                </Nav>

                <Tab.Content>
                    {/* ── TAB 1: Staff list ── */}
                    <Tab.Pane eventKey="staff">
                        <div className="d-flex justify-content-end mb-3">
                            <Button variant="primary" onClick={() => { resetStaffForm(); setShowStaffModal(true); }}>
                                + ახალი თანამშრომელი
                            </Button>
                        </div>
                        <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
                            {loadingStaff ? (
                                <div className="text-center py-5"><Spinner animation="border" variant="primary" /><p className="mt-2 text-muted">იტვირთება...</p></div>
                            ) : (
                                <Table hover responsive className="mb-0 align-middle">
                                    <thead className="bg-dark text-white">
                                        <tr>
                                            <th className="p-3">სახელი / გვარი</th>
                                            <th>პირადი №</th>
                                            <th>პოზიცია</th>
                                            <th>კომპეტენციები</th>
                                            <th>ავტ. ვადა</th>
                                            <th>სტატუსი</th>
                                            <th className="text-center">მართვა</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {staff.length > 0 ? staff.map(s => (
                                            <tr key={s._id}>
                                                <td className="p-3">
                                                    <div className="fw-bold">{s.firstName} {s.lastName}</div>
                                                    <small className="text-muted">{s.email || ''}</small>
                                                </td>
                                                <td className="font-monospace small">{s.personalId}</td>
                                                <td>{s.position}</td>
                                                <td>
                                                    <div className="d-flex flex-wrap gap-1">
                                                        {s.competencies && s.competencies.length > 0
                                                            ? s.competencies.map(c => <Badge key={c} bg="light" text="dark" className="border">{c}</Badge>)
                                                            : <span className="text-muted small">—</span>}
                                                    </div>
                                                </td>
                                                <td>{s.authExpiry ? new Date(s.authExpiry).toLocaleDateString('ka-GE') : '—'}</td>
                                                <td>{getAuthStatus(s.authExpiry)}</td>
                                                <td className="text-center">
                                                    <Button size="sm" variant="outline-primary" onClick={() => navigate(`/staff/${s._id}`)}>
                                                        პირადი საქმე
                                                    </Button>
                                                    {isAdmin && (
                                                        <Button size="sm" variant="outline-danger" className="ms-2"
                                                            onClick={() => handleDelete(s._id, `${s.firstName} ${s.lastName}`)}>
                                                            🗑️ წაშლა
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="7" className="text-center py-5 text-muted">თანამშრომლები ჯერ არ არიან რეგისტრირებული</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            )}
                        </Card>
                    </Tab.Pane>

                    {/* ── TAB 2: Auth users ── */}
                    {canManageUsers && (
                        <Tab.Pane eventKey="users">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <p className="text-muted mb-0 small">
                                    სისტემაში შესვლის მომხმარებლები — {isAdmin ? 'შეგიძლიათ შექმნათ ნებისმიერი დონე' : 'შეგიძლიათ შექმნათ დონე 2 და 3'}
                                </p>
                                <Button variant="success" onClick={() => { setAuthForm({ username: '', password: '', role: 'inspector', staffId: '' }); setAuthError(''); setShowAuthModal(true); }}>
                                    + ახალი მომხმარებელი
                                </Button>
                            </div>
                            <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
                                {loadingAuth ? (
                                    <div className="text-center py-4"><Spinner animation="border" variant="success" /></div>
                                ) : (
                                    <Table hover responsive className="mb-0 align-middle">
                                        <thead className="bg-dark text-white">
                                            <tr>
                                                <th className="p-3">მომხმარებელი</th>
                                                <th>როლი / დონე</th>
                                                <th>დაკავშირებული პერსონალი</th>
                                                <th>შეიქმნა</th>
                                                {isAdmin && <th className="text-center">მართვა</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {authUsers.length > 0 ? authUsers.map(u => {
                                                const rb = ROLE_BADGE[u.role] || { bg: 'secondary', label: u.role };
                                                return (
                                                    <tr key={u._id}>
                                                        <td className="p-3 fw-bold">{u.username}</td>
                                                        <td><Badge bg={rb.bg}>{rb.label}</Badge></td>
                                                        <td className="text-muted">
                                                            {u.staffId ? `${u.staffId.firstName} ${u.staffId.lastName}` : '—'}
                                                        </td>
                                                        <td className="text-muted small">
                                                            {new Date(u.createdAt).toLocaleDateString('ka-GE')}
                                                        </td>
                                                        {isAdmin && (
                                                            <td className="text-center">
                                                                <Button size="sm" variant="outline-danger"
                                                                    onClick={() => handleAuthDelete(u._id, u.username)}>
                                                                    🗑️ წაშლა
                                                                </Button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                );
                                            }) : (
                                                <tr><td colSpan="5" className="text-center py-5 text-muted">მომხმარებლები არ არის</td></tr>
                                            )}
                                        </tbody>
                                    </Table>
                                )}
                            </Card>
                        </Tab.Pane>
                    )}
                </Tab.Content>
            </Tab.Container>

            {/* ── Staff Registration Modal ── */}
            <Modal show={showStaffModal} onHide={() => { setShowStaffModal(false); resetStaffForm(); }} size="lg" backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">👥 ახალი თანამშრომლის რეგისტრაცია</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {staffError && <Alert variant="danger">{staffError}</Alert>}
                    <Form onSubmit={handleStaffSubmit}>
                        <h6 className="text-muted border-bottom pb-2 mb-3">პირადი ინფორმაცია</h6>
                        <Row className="g-3 mb-4">
                            <Col md={4}><Form.Control name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="სახელი *" /></Col>
                            <Col md={4}><Form.Control name="lastName" value={formData.lastName} onChange={handleChange} placeholder="გვარი" /></Col>
                            <Col md={4}><Form.Control name="personalId" value={formData.personalId} onChange={handleChange} required placeholder="პირადი ნომერი *" /></Col>
                            <Col md={4}>
                                <Form.Select name="position" value={formData.position} onChange={handleChange}>
                                    <option>ექსპერტი</option>
                                    <option>ტექ. მენეჯერი</option>
                                    <option>ხარ. მენეჯერი</option>
                                    <option>დირექტორი</option>
                                    <option>კანცელარია</option>
                                    <option>HR</option>
                                </Form.Select>
                            </Col>
                            <Col md={4}><Form.Control name="email" type="email" value={formData.email} onChange={handleChange} placeholder="ელ-ფოსტა" /></Col>
                            <Col md={4}><Form.Control name="phone" value={formData.phone} onChange={handleChange} placeholder="ტელეფონი" /></Col>
                        </Row>
                        <h6 className="text-muted border-bottom pb-2 mb-3">კომპეტენციები და ავტორიზაცია</h6>
                        <Row className="g-3 mb-4">
                            <Col md={6}>
                                <Form.Label className="small fw-bold">ავტორიზაციის ვადა</Form.Label>
                                <Form.Control type="date" name="authExpiry" value={formData.authExpiry} onChange={handleChange} />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold">ფოტოსურათი</Form.Label>
                                <Form.Control type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="small fw-bold d-block">აკრედიტაციის სფეროები:</Form.Label>
                                <div className="d-flex flex-wrap gap-3">
                                    {competencyList.map(comp => (
                                        <Form.Check key={comp} type="checkbox" label={comp} value={comp}
                                            checked={competencies.includes(comp)} onChange={handleCompetencyChange} />
                                    ))}
                                </div>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => { setShowStaffModal(false); resetStaffForm(); }}>გაუქმება</Button>
                            <Button variant="primary" type="submit" disabled={staffLoading}>
                                {staffLoading ? <Spinner size="sm" animation="border" /> : 'რეგისტრაცია'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* ── Auth User Creation Modal ── */}
            <Modal show={showAuthModal} onHide={() => setShowAuthModal(false)} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">🔐 ახალი სისტემის მომხმარებელი</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {authError && <Alert variant="danger">{authError}</Alert>}
                    <Form onSubmit={handleAuthSubmit}>
                        <Row className="g-3">
                            <Col md={12}>
                                <Form.Label className="fw-bold small">მომხმარებლის სახელი *</Form.Label>
                                <Form.Control
                                    value={authForm.username}
                                    onChange={e => setAuthForm({ ...authForm, username: e.target.value })}
                                    placeholder="username"
                                    required
                                />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="fw-bold small">პაროლი *</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={authForm.password}
                                    onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                                    placeholder="მინიმუმ 6 სიმბოლო"
                                    required
                                />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="fw-bold small">როლი / დონე *</Form.Label>
                                <Form.Select
                                    value={authForm.role}
                                    onChange={e => setAuthForm({ ...authForm, role: e.target.value })}
                                >
                                    {ROLE_OPTIONS.filter(r => isAdmin || r.value !== 'admin').map(r => (
                                        <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                            {authForm.role === 'inspector' && (
                                <Col md={12}>
                                    <Form.Label className="fw-bold small">დაუკავშირე პერსონალს (ინსპექტორი)</Form.Label>
                                    <Form.Select
                                        value={authForm.staffId}
                                        onChange={e => setAuthForm({ ...authForm, staffId: e.target.value })}
                                    >
                                        <option value="">— არ არის დაკავშირებული —</option>
                                        {staff.map(s => (
                                            <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.position})</option>
                                        ))}
                                    </Form.Select>
                                    <Form.Text className="text-muted">თუ დაუკავშირებ, ინსპექტორი მხოლოდ საკუთარ საქმეებს ნახავს</Form.Text>
                                </Col>
                            )}
                        </Row>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="secondary" onClick={() => setShowAuthModal(false)}>გაუქმება</Button>
                            <Button variant="success" type="submit" disabled={authLoading}>
                                {authLoading ? <Spinner size="sm" animation="border" /> : 'შექმნა'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminRegister;
