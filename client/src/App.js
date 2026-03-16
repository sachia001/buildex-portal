import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
import Login from './components/Login';
import ChangePassword from './components/ChangePassword';

// Attach token to every axios request
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Role labels in Georgian
const ROLE_LABELS = {
    admin: '👑 ადმინი',
    chancellor: '🗂️ კანცელარია',
    tech_manager: '🔧 ტექ. მენეჯერი',
    quality_manager: '✅ ხარ. მენეჯერი',
    hr: '👥 HR',
    inspector: '🔍 ინსპექტორი',
};

const Navbar = ({ username, role, onLogout }) => {
    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Navigation visibility per role
    const show = {
        inspections: ['admin', 'chancellor', 'tech_manager', 'inspector', 'quality_manager'].includes(role),
        documents:   ['admin', 'quality_manager'].includes(role),
        equipment:   ['admin'].includes(role),
        management:  ['admin', 'quality_manager'].includes(role),
        staff:       ['admin', 'hr'].includes(role),
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4 py-3 sticky-top">
            <div className="container-fluid px-4">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src="/logo.png" alt="Logo" style={{ height: '50px', marginRight: '15px' }} />
                    <div style={{ lineHeight: '1.2' }}>
                        <div className="fw-bold text-dark" style={{ fontSize: '1.25rem' }}>ბილდექს ექსპერტიზა</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem', fontWeight: '500' }}>ISO/IEC 17020:2012</div>
                    </div>
                </Link>
                <div className="d-flex gap-2 flex-wrap align-items-center">
                    <Link className="btn btn-light fw-bold text-secondary border-0" to="/">📊 მთავარი</Link>
                    {show.inspections && (
                        <Link className="btn btn-light fw-bold text-secondary border-0" to="/inspections">📂 რეესტრი</Link>
                    )}
                    {show.documents && (
                        <Link className="btn btn-light fw-bold text-secondary border-0" to="/documents">📄 დოკუმენტები</Link>
                    )}
                    {show.equipment && (
                        <Link className="btn btn-light fw-bold text-secondary border-0" to="/equipment">🛠️ აპარატურა</Link>
                    )}
                    {show.management && (
                        <Link className="btn btn-light fw-bold text-secondary border-0" to="/management-review">📋 გადახედვა</Link>
                    )}
                    {show.staff && (
                        <Link className="btn btn-primary fw-bold px-4 shadow-sm rounded-pill" to="/admin">👥 პერსონალი</Link>
                    )}
                    {/* User dropdown — pure React state, no Bootstrap JS needed */}
                    <div className="position-relative ms-2" ref={dropRef}>
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => setDropOpen(o => !o)}
                        >
                            👤 {username} <small className="ms-1 text-muted">{ROLE_LABELS[role] || role}</small> ▾
                        </button>
                        {dropOpen && (
                            <ul className="dropdown-menu dropdown-menu-end show position-absolute" style={{ right: 0, top: '110%', minWidth: '200px', zIndex: 9999 }}>
                                <li>
                                    <Link className="dropdown-item" to="/change-password" onClick={() => setDropOpen(false)}>
                                        🔑 პაროლის შეცვლა
                                    </Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item text-danger" onClick={() => { setDropOpen(false); onLogout(); }}>
                                        🚪 გასვლა
                                    </button>
                                </li>
                            </ul>
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
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: 'url("/logo.png")', backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center', backgroundSize: '40%',
                opacity: 0.05, zIndex: -1, pointerEvents: 'none'
            }} />
            <Navbar username={username} role={role} onLogout={handleLogout} />
            <div className="container-fluid px-4 pb-5">
                <Routes>
                    <Route path="/" element={<Dashboard role={role} />} />
                    <Route path="/inspections" element={<InspectionList role={role} />} />
                    <Route path="/add-inspection" element={<AddInspection />} />
                    <Route path="/inspections/:id" element={<InspectionDetails role={role} />} />
                    <Route path="/admin" element={<AdminRegister role={role} />} />
                    <Route path="/staff/:id" element={<StaffDetails />} />
                    <Route path="/management-review" element={<ManagementReview role={role} />} />
                    <Route path="/documents" element={<DocumentsPage />} />
                    <Route path="/equipment" element={<EquipmentManager role={role} />} />
                    <Route path="/order-generator" element={<OrderGenerator />} />
                    <Route path="/contract-generator" element={<ContractGenerator />} />
                    <Route path="/change-password" element={<ChangePassword />} />
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
