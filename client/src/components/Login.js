import React, { useState } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('role', res.data.role);
            onLogin(res.data.token, res.data.username, res.data.role);
        } catch (err) {
            setError(err.response?.data?.message || 'შეცდომა შესვლისას');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%)'
        }}>
            <div style={{ width: '100%', maxWidth: '420px', padding: '20px' }}>
                {/* Logo & Title */}
                <div className="text-center mb-4">
                    <img src="/logo.png" alt="Logo" style={{ height: 80, marginBottom: 16 }} />
                    <h3 className="text-white fw-bold mb-1">ბილდექს ექსპერტიზა</h3>
                    <p className="text-white-50 small">ISO/IEC 17020:2012 — მართვის სისტემა</p>
                </div>

                <Card className="border-0 shadow-lg rounded-4">
                    <Card.Body className="p-4">
                        <h5 className="fw-bold mb-4 text-center text-dark">🔐 სისტემაში შესვლა</h5>

                        {error && <Alert variant="danger" className="py-2">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">მომხმარებლის სახელი</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="admin"
                                    required
                                    autoFocus
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label className="small fw-bold">პაროლი</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </Form.Group>
                            <div className="d-grid">
                                <Button variant="primary" type="submit" size="lg" disabled={loading}>
                                    {loading ? <Spinner size="sm" animation="border" /> : 'შესვლა'}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

                <p className="text-center text-white-50 small mt-3">
                    ქ. თელავი · buildexexpertise.com
                </p>
            </div>
        </div>
    );
};

export default Login;
