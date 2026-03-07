import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      // ტოკენს ვინახავთ მეხსიერებაში
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      
      setToken(res.data.token); // სისტემას ვატყობინებთ რომ შევიდა
      navigate('/'); // გადავდივართ მთავარ გვერდზე
    } catch (err) {
      setError(err.response?.data?.message || 'შეცდომა შესვლისას');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <Card style={{ width: '400px' }} className="p-4 shadow">
        <h3 className="text-center mb-4">ავტორიზაცია</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>მომხმარებელი</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Username"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>პაროლი</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Password"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </Form.Group>
          <div className="d-grid">
            <Button variant="primary" type="submit">შესვლა</Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;