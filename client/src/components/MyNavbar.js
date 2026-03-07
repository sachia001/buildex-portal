import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/ლოგო.png'; // დარწმუნდით რომ სახელი ემთხვევა

const MyNavbar = () => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Navbar bg="white" expand="lg" className="shadow-sm border-bottom py-2">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-3">
                    <img src={logo} alt="Buildex" width="50" />
                    <div className="border-start ps-3" style={{ color: '#003366' }}>
                        <h6 className="mb-0 fw-bold">ბილდექს ექსპერტიზა</h6>
                        <small style={{ fontSize: '10px' }}>ISO/IEC 17020:2012</small>
                    </div>
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto fw-bold align-items-center">
                        <Nav.Link as={Link} to="/inspections">📋 რეესტრი</Nav.Link>
                        <Nav.Link as={Link} to="/add-inspection">➕ ახალი ობიექტი</Nav.Link>
                        <Nav.Link as={Link} to="/admin" className="text-danger">⚙️ პერსონალი</Nav.Link>
                        <Button variant="outline-dark" size="sm" className="ms-3" onClick={logout}>გასვლა</Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default MyNavbar;