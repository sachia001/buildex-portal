import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

import Dashboard from './pages/Dashboard';
import InspectionList from './pages/InspectionList';
import AddInspection from './pages/AddInspection';
import InspectionDetails from './pages/InspectionDetails';
import AdminRegister from './pages/AdminRegister';
import StaffDetails from './pages/StaffDetails';
import DocumentsPage from './pages/DocumentsPage';
import OrderGenerator from './pages/OrderGenerator';
import ContractGenerator from './pages/ContractGenerator';
import EquipmentManager from './pages/EquipmentManager';
import ManagementReview from './pages/ManagementReview';
import InsurancePage from './pages/InsurancePage';
import CompanyDocsPage from './pages/CompanyDocsPage';
import ComplaintsPage from './pages/ComplaintsPage';
import InternalAuditPage from './pages/InternalAuditPage';
import CorrectiveActionsPage from './pages/CorrectiveActionsPage';
import Login from './components/Login';
import ChangePassword from './components/ChangePassword';
import PriceAdequacyPage from './pages/PriceAdequacyPage';
import NormsAdminPage from './pages/NormsAdminPage';
import ChecklistPage from './pages/ChecklistPage';
import ProceduresPage from './pages/ProceduresPage';
import AuditLogPage from './pages/AuditLogPage';
import ProcurementPricePage from './pages/ProcurementPricePage';

// Attach token to every axios request
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Role labels in Georgian
const ROLE_LABELS = {
    admin:           '👑 ადმინი',
    chancellor:      '🗂️ კანცელარია',
    tech_manager:    '🔧 ტექ. მენეჯერი',
    quality_manager: '✅ ხარ. მენეჯერი',
    hr:              '👥 HR',
    inspector:       '🔍 ინსპექტორი',
};

/* ── Nav link that highlights when active ─────────────────────── */
const NavLink = ({ to, children, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
    return (
        <Link className={`nav-link-item${isActive ? ' active' : ''}`} to={to} onClick={onClick}>
            {children}
        </Link>
    );
};

/* ── Grouped dropdown menu ─────────────────────────────────────── */
const NavDropdown = ({ label, icon, items, openKey, currentOpen, onToggle, onAnyClick }) => {
    const location = useLocation();
    const isOpen = currentOpen === openKey;
    const visibleItems = items.filter(i => i.show !== false);
    if (visibleItems.length === 0) return null;
    const anyActive = visibleItems.some(i => location.pathname === i.to || (i.to !== '/' && location.pathname.startsWith(i.to)));

    return (
        <div className="nav-dropdown">
            <button
                className={`nav-dropdown-toggle${isOpen || anyActive ? ' active' : ''}`}
                onClick={(e) => { e.stopPropagation(); onToggle(isOpen ? null : openKey); }}
            >
                {icon} {label} <span className="caret">▾</span>
            </button>
            {isOpen && (
                <div className="nav-dropdown-menu">
                    {visibleItems.map(item => {
                        const itemActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={itemActive ? 'active' : ''}
                                onClick={onAnyClick}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const Navbar = ({ username, role, onLogout }) => {
    const [openDropdown, setOpenDropdown] = useState(null); // 'user' | 'ops' | 'docs' | ...
    const navRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) setOpenDropdown(null);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const closeAll = () => setOpenDropdown(null);

    const show = {
        inspections:   ['admin', 'chancellor', 'tech_manager', 'inspector', 'quality_manager'].includes(role),
        addInspection: ['admin', 'chancellor'].includes(role),
        documents:     ['admin', 'quality_manager'].includes(role),
        equipment:     ['admin', 'quality_manager'].includes(role),
        management:    ['admin', 'quality_manager'].includes(role),
        staff:         ['admin', 'hr'].includes(role),
        insurance:     ['admin', 'quality_manager'].includes(role),
        complaints:    ['admin', 'quality_manager'].includes(role),
        audits:        ['admin', 'quality_manager'].includes(role),
        corrections:   ['admin', 'quality_manager'].includes(role),
        companyDocs:   ['admin'].includes(role),
        priceAdequacy: ['admin', 'quality_manager', 'tech_manager'].includes(role),
        procurement:   ['admin', 'quality_manager', 'tech_manager', 'inspector'].includes(role),
        normsAdmin:    ['admin', 'quality_manager'].includes(role),
        checklist:     ['admin', 'quality_manager'].includes(role),
        procedures:    ['admin', 'quality_manager', 'tech_manager', 'inspector'].includes(role),
        auditLog:      ['admin', 'quality_manager'].includes(role),
    };

    const operationsItems = [
        { to: '/inspections',     label: '📂 რეესტრი',        show: show.inspections },
        { to: '/add-inspection',  label: '➕ ახალი საქმე',     show: show.addInspection },
    ];
    const docsItems = [
        { to: '/documents',    label: '📄 დოკუმენტები',  show: show.documents },
        { to: '/procedures',   label: '📑 პროცედურები',  show: show.procedures },
        { to: '/norms-admin',  label: '📊 ნორმ-ბაზა',     show: show.normsAdmin },
        { to: '/company-docs', label: '🏢 კომპანია',      show: show.companyDocs },
    ];
    const qualityItems = [
        { to: '/checklist',           label: '✅ ჩეკლისტი',          show: show.checklist },
        { to: '/management-review',   label: '📋 გადახედვა',         show: show.management },
        { to: '/internal-audits',     label: '🔍 შიდა აუდიტი',       show: show.audits },
        { to: '/corrective-actions',  label: '⚙️ CAR',               show: show.corrections },
        { to: '/complaints',          label: '📨 საჩივრები',         show: show.complaints },
        { to: '/audit-log',           label: '📋 აუდიტის ჟურნალი',  show: show.auditLog },
    ];
    const resourcesItems = [
        { to: '/admin',          label: '👥 პერსონალი',      show: show.staff },
        { to: '/equipment',      label: '🛠️ აპარატურა',       show: show.equipment },
        { to: '/insurance',      label: '🛡️ დაზღვევა',        show: show.insurance },
        { to: '/price-adequacy', label: '💰 ფასადეკვატ.',     show: show.priceAdequacy },
        { to: '/procurement',    label: '🏗️ სამშ. ფასები',    show: show.procurement },
    ];

    return (
        <nav className="app-navbar" ref={navRef}>
            <div className="app-navbar navbar-inner">
                {/* Brand */}
                <Link className="brand-logo" to="/" onClick={closeAll}>
                    <img src="/logo.png" alt="Logo" style={{ height: '44px', flexShrink: 0 }} />
                    <div>
                        <div className="brand-name">ბილდექს ექსპერტიზა</div>
                        <div className="brand-sub">ISO/IEC 17020:2012</div>
                    </div>
                </Link>

                {/* Home link */}
                <NavLink to="/" onClick={closeAll}>📊 მთავარი</NavLink>

                {/* Grouped dropdowns */}
                <NavDropdown
                    label="ოპერაციები" icon="📂" openKey="ops"
                    items={operationsItems}
                    currentOpen={openDropdown} onToggle={setOpenDropdown} onAnyClick={closeAll}
                />
                <NavDropdown
                    label="დოკუმენტაცია" icon="📄" openKey="docs"
                    items={docsItems}
                    currentOpen={openDropdown} onToggle={setOpenDropdown} onAnyClick={closeAll}
                />
                <NavDropdown
                    label="ხარისხი" icon="⚙️" openKey="quality"
                    items={qualityItems}
                    currentOpen={openDropdown} onToggle={setOpenDropdown} onAnyClick={closeAll}
                />
                <NavDropdown
                    label="რესურსები" icon="🏗️" openKey="resources"
                    items={resourcesItems}
                    currentOpen={openDropdown} onToggle={setOpenDropdown} onAnyClick={closeAll}
                />

                {/* User dropdown */}
                <div className="nav-dropdown ms-auto flex-shrink-0">
                    <button
                        className="user-pill"
                        onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'user' ? null : 'user'); }}
                    >
                        👤 <span style={{ fontWeight: 600 }}>{username}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{ROLE_LABELS[role] || role}</span>
                        <span style={{ color: 'var(--text-muted)' }}>▾</span>
                    </button>

                    {openDropdown === 'user' && (
                        <div className="user-dropdown">
                            <div className="role-label">{ROLE_LABELS[role] || role}</div>
                            <div className="drop-divider" />
                            <Link
                                className="drop-item"
                                to="/change-password"
                                onClick={closeAll}
                            >
                                🔑 პაროლის შეცვლა
                            </Link>
                            <div className="drop-divider" />
                            <button
                                className="drop-item danger"
                                onClick={() => { closeAll(); onLogout(); }}
                            >
                                🚪 გასვლა
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

function AppContent() {
    const [token, setToken]       = useState(() => localStorage.getItem('token'));
    const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
    const [role, setRole]         = useState(() => localStorage.getItem('role') || 'inspector');

    useEffect(() => {
        if (!token) return;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp * 1000 < Date.now()) handleLogout();
        } catch { handleLogout(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const id = axios.interceptors.response.use(
            r => r,
            err => { if (err.response?.status === 401) handleLogout(); return Promise.reject(err); }
        );
        return () => axios.interceptors.response.eject(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogin = (tok, user, userRole) => {
        setToken(tok);
        setUsername(user);
        setRole(userRole || 'inspector');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        setToken(null);
        setUsername('');
        setRole('inspector');
    };

    if (!token) return <Login onLogin={handleLogin} />;

    return (
        <>
            <div className="page-watermark" style={{
                backgroundImage: 'url("/logo.png")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: '40%',
            }} />
            <Navbar username={username} role={role} onLogout={handleLogout} />
            <div className="container-fluid px-4 pb-5 pt-3">
                <Routes>
                    <Route path="/" element={<Dashboard role={role} />} />
                    <Route path="/inspections" element={<InspectionList role={role} />} />
                    <Route path="/add-inspection" element={
                        ['admin', 'chancellor'].includes(role)
                            ? <AddInspection />
                            : <div className="text-center mt-5"><h4 className="text-danger">🚫 წვდომა აკრძალულია</h4><p className="text-muted">მხოლოდ ადმინი და კანცელარია ახდენენ საქმის რეგისტრაციას.</p><Link to="/inspections" className="btn btn-secondary mt-2">← უკან</Link></div>
                    } />
                    <Route path="/inspections/:id" element={<InspectionDetails role={role} />} />
                    <Route path="/admin" element={<AdminRegister role={role} />} />
                    <Route path="/staff/:id" element={<StaffDetails />} />
                    <Route path="/management-review" element={<ManagementReview role={role} />} />
                    <Route path="/documents" element={<DocumentsPage />} />
                    <Route path="/equipment" element={<EquipmentManager role={role} />} />
                    <Route path="/insurance" element={<InsurancePage role={role} />} />
                    <Route path="/complaints" element={<ComplaintsPage role={role} />} />
                    <Route path="/internal-audits" element={<InternalAuditPage role={role} />} />
                    <Route path="/corrective-actions" element={<CorrectiveActionsPage role={role} />} />
                    <Route path="/order-generator" element={<OrderGenerator />} />
                    <Route path="/contract-generator" element={<ContractGenerator />} />
                    <Route path="/company-docs" element={<CompanyDocsPage role={role} />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/price-adequacy" element={<PriceAdequacyPage role={role} />} />
                    <Route path="/norms-admin" element={<NormsAdminPage role={role} />} />
                    <Route path="/checklist" element={<ChecklistPage role={role} />} />
                    <Route path="/procedures" element={<ProceduresPage role={role} />} />
                    <Route path="/audit-log" element={<AuditLogPage role={role} />} />
                    <Route path="/procurement" element={<ProcurementPricePage />} />
                    <Route path="*" element={
                        <div className="text-center mt-5">
                            <h1 className="display-1 fw-bold text-muted">404</h1>
                            <p className="lead">გვერდი არ მოიძებნა</p>
                            <Link to="/" className="btn btn-primary">მთავარზე დაბრუნება</Link>
                        </div>
                    } />
                </Routes>
            </div>
        </>
    );
}

function App() {
    return <Router><AppContent /></Router>;
}

export default App;
