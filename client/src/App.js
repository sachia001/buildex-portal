import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// --- გვერდების იმპორტი (ყურადღება მიაქციეთ გზებს!) ---
import Dashboard from './pages/Dashboard';
import InspectionList from './pages/InspectionList';
import AddInspection from './pages/AddInspection';
import InspectionDetails from './pages/InspectionDetails';
import AdminRegister from './pages/AdminRegister'; // 👈 გასწორდა (pages-დან)
import StaffDetails from './pages/StaffDetails';
import DocumentsPage from './pages/DocumentsPage';
import OrderGenerator from './pages/OrderGenerator';
import ContractGenerator from './pages/ContractGenerator';
import EquipmentManager from './pages/EquipmentManager';
import ManagementReview from './pages/ManagementReview'; // 👈 გასწორდა (pages-დან)

function App() {
  return (
    <Router>
      {/* 🖼️ ფონის ლოგო (Watermark) - უცვლელი */}
      <div style={{
        position: 'fixed',
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        backgroundImage: 'url("/logo.png")', 
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '40%', 
        opacity: 0.05, // ოდნავ დავუწიე გამჭვირვალობას, რომ ტექსტი კარგად ჩანდეს
        zIndex: -1,
        pointerEvents: 'none'
      }}></div>

      {/* --- ზედა მენიუ (Navbar) --- */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4 py-3 sticky-top">
        <div className="container-fluid px-4">
          
          {/* ლოგო და წარწერა */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{ height: '50px', marginRight: '15px' }} 
            />
            <div style={{ lineHeight: '1.2' }}>
              <div className="fw-bold text-dark" style={{ fontSize: '1.25rem', letterSpacing: '0.5px' }}>
                ბილდექს ექსპერტიზა
              </div>
              <div className="text-muted" style={{ fontSize: '0.75rem', fontWeight: '500' }}>
                ISO/IEC 17020:2012
              </div>
            </div>
          </Link>
          
          {/* მენიუს ღილაკები */}
          <div className="d-flex gap-2 flex-wrap">
            <Link className="btn btn-light fw-bold text-secondary border-0" to="/">
              📊 მთავარი
            </Link>
            <Link className="btn btn-light fw-bold text-secondary border-0" to="/inspections">
              📂 რეესტრი
            </Link>
            <Link className="btn btn-light fw-bold text-secondary border-0" to="/documents">
              📄 დოკუმენტები
            </Link>
            <Link className="btn btn-light fw-bold text-secondary border-0" to="/equipment">
              🛠️ აპარატურა
            </Link>
            
            {/* 👇 მენეჯმენტის გადახედვის ღილაკი */}
            <Link className="btn btn-light fw-bold text-secondary border-0" to="/management-review">
              📋 გადახედვა
            </Link>
            
            <Link className="btn btn-primary fw-bold px-4 shadow-sm rounded-pill" to="/admin">
              👥 პერსონალი
            </Link>
          </div>
        </div>
      </nav>

      {/* --- გვერდების მარშრუტები (Routes) --- */}
      <div className="container-fluid px-4 pb-5">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inspections" element={<InspectionList />} />
          <Route path="/add-inspection" element={<AddInspection />} />
          <Route path="/inspections/:id" element={<InspectionDetails />} />
          
          {/* 👥 პერსონალის გვერდები */}
          <Route path="/admin" element={<AdminRegister />} />
          <Route path="/staff/:id" element={<StaffDetails />} />
          
          {/* 📋 მენეჯმენტის გადახედვა */}
          <Route path="/management-review" element={<ManagementReview />} />
          
          {/* 🛠️ სხვა გვერდები */}
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/equipment" element={<EquipmentManager />} />
          
          {/* PDF გენერატორები (თუ იყენებთ) */}
          <Route path="/order-generator" element={<OrderGenerator />} />
          <Route path="/contract-generator" element={<ContractGenerator />} />
          
          {/* 404 გვერდი */}
          <Route path="*" element={
            <div className="text-center mt-5">
              <h1 className="display-1 fw-bold text-muted">404</h1>
              <p className="lead">გვერდი არ მოიძებნა</p>
              <Link to="/" className="btn btn-primary">მთავარზე დაბრუნება</Link>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;