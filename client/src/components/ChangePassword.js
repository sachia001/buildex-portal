import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const ChangePassword = () => {
    const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            return setMessage({ type: 'danger', text: 'ახალი პაროლები არ ემთხვევა!' });
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/auth/change-password',
                { oldPassword: formData.oldPassword, newPassword: formData.newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: '✅ პაროლი წარმატებით შეიცვალა!' });
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data?.message || 'შეცდომა პაროლის შეცვლისას' });
        }
    };

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card style={{ width: '500px' }} className="p-4 shadow border-0 rounded-4">
                <h4 className="text-center fw-bold mb-4">🔑 პაროლის შეცვლა</h4>
                {message && <Alert variant={message.type}>{message.text}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>ძველი პაროლი</Form.Label>
                        <Form.Control type="password" value={formData.oldPassword}
                            onChange={e => setFormData({ ...formData, oldPassword: e.target.value })} required />
                    </Form.Group>
                    <hr />
                    <Form.Group className="mb-3">
                        <Form.Label>ახალი პაროლი</Form.Label>
                        <Form.Control type="password" value={formData.newPassword}
                            onChange={e => setFormData({ ...formData, newPassword: e.target.value })} required />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>გაიმეორეთ ახალი პაროლი</Form.Label>
                        <Form.Control type="password" value={formData.confirmPassword}
                            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                    </Form.Group>
                    <div className="d-grid">
                        <Button variant="warning" type="submit">შეცვლა</Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default ChangePassword;
