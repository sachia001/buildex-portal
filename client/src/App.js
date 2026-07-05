import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

import Login from './components/Login';
import ErrorBoundary from './components/ErrorBoundary';
import { FeedbackProvider } from './components/Feedback';

/* ── Lazy-loaded routes (PERF-001 / PERF-002 code splitting) ───────────── */
const Dashboard            = lazy(() => import('./pages/Dashboard'));
const InspectionList       = lazy(() => import('./pages/InspectionList'));
const AddInspection        = lazy(() => import('./pages/AddInspection'));
const InspectionDetails    = lazy(() => import('./pages/InspectionDetails'));
const AdminRegister        = lazy(() => import('./pages/AdminRegister'));
const StaffDetails         = lazy(() => import('./pages/StaffDetails'));
const DocumentsPage        = lazy(() => import('./pages/DocumentsPage'));
const OrderGenerator       = lazy(() => import('./pages/OrderGenerator'));
const ContractGenerator    = lazy(() => import('./pages/ContractGenerator'));
const EquipmentManager     = lazy(() => import('./pages/EquipmentManager'));
const ManagementReview     = lazy(() => import('./pages/ManagementReview'));
const InsurancePage        = lazy(() => import('./pages/InsurancePage'));
const CompanyDocsPage      = lazy(() => import('./pages/CompanyDocsPage'));
const ComplaintsPage       = lazy(() => import('./pages/ComplaintsPage'));
const InternalAuditPage    = lazy(() => import('./pages/InternalAuditPage'));
const CorrectiveActionsPage = lazy(() => import('./pages/CorrectiveActionsPage'));
const ChangePassword       = lazy(() => import('./components/ChangePassword'));
const PriceAdequacyPage    = lazy(() => import('./pages/PriceAdequacyPage'));
const NormsAdminPage       = lazy(() => import('./pages/NormsAdminPage'));
const ChecklistPage        = lazy(() => import('./pages/ChecklistPage'));
const ProceduresPage       = lazy(() => import('./pages/ProceduresPage'));
const AuditLogPage         = lazy(() => import('./pages/AuditLogPage'));
const TrashPage            = lazy(() => import('./pages/TrashPage'));
const ProcurementPricePage = lazy(() => import('./pages/ProcurementPricePage'));

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

/* ── Route-level loading fallback (Suspense) ───────────────────────────── */
const RouteFallback = () => (
    <div className="loading-state" role="status" aria-live="polite">
        <Spinner animation="border" variant="primary" />
        <span>იტვირთება…</span>
    </div>
);

/* ── Nav link that highlights when active ─────────────────────── */
const NavLink = ({ to, children, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
    return (
        <Link
            className={`nav-link-item${isActive ? ' active' : ''}`}
            to={to}
            onClick={onClick}
            aria-current={isActive ? 'page' : undefined}
        >
            {children}
        </Link>
    );
};

/* ── Grouped dropdown menu ─────────────────────────────────────── */
const NavDropdown = ({ label, icon, items, openKey, currentOpen, onToggle, onAnyClick }) => {
    const location = useLocation();
    const isOpen = currentOpen === openKey;
    const menuRef = useRef(null);
    const toggleRef = useRef(null);
    const visibleItems = items.filter(i => i.show !== false);

    // Focus first item when opening via keyboard
    useEffect(() => {
        if (isOpen && menuRef.current) {
            const first = menuRef.current.querySelector('a, button');
            if (first) first.focus();
        }
    }, [isOpen]);

    if (visibleItems.length === 0) return null;
    const anyActive = visibleItems.some(i => location.pathname === i.to || (i.to !== '/' && location.pathname.startsWith(i.to)));

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onToggle(null);
            if (toggleRef.current) toggleRef.current.focus();
        }
    };

    const menuId = `nav-menu-${openKey}`;

    return (
        <div className="nav-dropdown" onKeyDown={handleKeyDown}>
            <button
                ref={toggleRef}
                type="button"
                className={`nav-dropdown-toggle${isOpen || anyActive ? ' active' : ''}`}
                onClick={(e) => { e.stopPropagation(); onToggle(isOpen ? null : openKey); }}
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-controls={menuId}
            >
                {icon} {label} <span className="caret" aria-hidden="true">▾</span>
            </button>
            {isOpen && (
                <div className="nav-dropdown-menu" id={menuId} role="menu" ref={menuRef}>
                    {visibleItems.map(item => {
                        const itemActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                role="menuitem"
                                className={itemActive ? 'active' : ''}
                                aria-current={itemActive ? 'page' : undefined}
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
    const [mobileOpen, setMobileOpen] = useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setOpenDropdown(null);
                setMobileOpen(false);
            }
        };
        const escHandler = (e) => {
            if (e.key === 'Escape') { setOpenDropdown(null); setMobileOpen(false); }
        };
        document.addEventListener('mousedown', handler);
        document.addEventListener('keydown', escHandler);
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('keydown', escHandler);
        };
    }, []);

    const closeAll = () => { setOpenDropdown(null); setMobileOpen(false); };

    const show = {
        inspections:   ['admin', 'chancellor', 'tech_manager', 'inspector', 'quality_manager'].includes(role),
        addInspection: ['admin', 'chancellor'].includes(role),
        documents:     ['admin', 'quality_manager'].includes(role),
        equipment:     ['admin', 'quality_manager', 'tech_manager'].includes(role),
        management:    ['admin', 'quality_manager'].includes(role),
        staff:         ['admin', 'hr'].includes(role),
        insurance:     ['admin', 'quality_manager', 'chancellor'].includes(role),
        complaints:    ['admin', 'quality_manager', 'chancellor'].includes(role),
        audits:        ['admin', 'quality_manager'].includes(role),
        corrections:   ['admin', 'quality_manager'].includes(role),
        companyDocs:   ['admin', 'chancellor'].includes(role),
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
        { to: '/admin-trash',         label: '🗄️ არქივი',            show: role === 'admin' },
    ];
    const resourcesItems = [
        { to: '/admin',          label: '👥 პერსონალი',      show: show.staff },
        { to: '/equipment',      label: '🛠️ აპარატურა',       show: show.equipment },
        { to: '/insurance',      label: '🛡️ დაზღვევა',        show: show.insurance },
        { to: '/price-adequacy', label: '💰 ფასადეკვატ.',     show: show.priceAdequacy },
        { to: '/procurement',    label: '🏗️ სამშ. ფასები',    show: show.procurement },
    ];

    return (
        <nav className="app-navbar" ref={navRef} aria-label="მთავარი ნავიგაცია">
            <div className="app-navbar navbar-inner">
                {/* Brand */}
                <Link className="brand-logo" to="/" onClick={closeAll}>
                    <img src="/logo.png" alt="ბილდექს ექსპერტიზა — ლოგო" style={{ height: '44px', flexShrink: 0 }} />
                    <div>
                        <div className="brand-name">ბილდექს ექსპერტიზა</div>
                        <div className="brand-sub">ISO/IEC 17020:2012</div>
                    </div>
                </Link>

                {/* Mobile hamburger toggle (UX-005) */}
                <button
                    type="button"
                    className="navbar-burger d-lg-none ms-auto"
                    onClick={() => { setMobileOpen(o => !o); setOpenDropdown(null); }}
                    aria-expanded={mobileOpen}
                    aria-controls="primary-nav"
                    aria-label="ნავიგაციის მენიუ"
                >
                    <span aria-hidden="true">{mobileOpen ? '✕' : '☰'}</span>
                </button>

                {/* Collapsible nav region */}
                <div id="primary-nav" className={`nav-collapse${mobileOpen ? ' open' : ''}`}>
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
                    <div className="nav-dropdown ms-lg-auto flex-shrink-0">
                        <button
                            type="button"
                            className="user-pill"
                            onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'user' ? null : 'user'); }}
                            aria-haspopup="true"
                            aria-expanded={openDropdown === 'user'}
                            aria-controls="user-menu"
                        >
                            👤 <span style={{ fontWeight: 600 }}>{username}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{ROLE_LABELS[role] || role}</span>
                            <span style={{ color: 'var(--text-muted)' }} aria-hidden="true">▾</span>
                        </button>

                        {openDropdown === 'user' && (
                            <div className="user-dropdown" id="user-menu" role="menu">
                                <div className="role-label">{ROLE_LABELS[role] || role}</div>
                                <div className="drop-divider" />
                                <Link
                                    className="drop-item"
                                    to="/change-password"
                                    role="menuitem"
                                    onClick={closeAll}
                                >
                                    🔑 პაროლის შეცვლა
                                </Link>
                                <div className="drop-divider" />
                                <button
                                    type="button"
                                    className="drop-item danger"
                                    role="menuitem"
                                    onClick={() => { closeAll(); onLogout(); }}
                                >
                                    🚪 გასვლა
                                </button>
                            </div>
                        )}
                    </div>
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
                <ErrorBoundary>
                    <Suspense fallback={<RouteFallback />}>
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
                            <Route path="/admin-trash" element={<TrashPage />} />
                            <Route path="/procurement" element={<ProcurementPricePage />} />
                            <Route path="*" element={
                                <div className="text-center mt-5">
                                    <h1 className="display-1 fw-bold text-muted">404</h1>
                                    <p className="lead">გვერდი არ მოიძებნა</p>
                                    <Link to="/" className="btn btn-primary">მთავარზე დაბრუნება</Link>
                                </div>
                            } />
                        </Routes>
                    </Suspense>
                </ErrorBoundary>
            </div>
        </>
    );
}

function App() {
    return (
        <Router>
            <FeedbackProvider>
                <AppContent />
            </FeedbackProvider>
        </Router>
    );
}

export default App;
