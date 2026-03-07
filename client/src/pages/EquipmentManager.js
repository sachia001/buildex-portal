import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Card, Row, Col, Badge, Spinner } from 'react-bootstrap';
import axios from 'axios';

const EquipmentManager = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true); // დავამატოთ Loading სტატუსი
    const [formData, setFormData] = useState({
        name: '', serialNumber: '', manufacturer: '',
        calibrationDate: '', calibrationInterval: 12
    });

    // ✅ მონაცემების წამოღება (შესწორებული სინტაქსით)
    const fetchEquipment = () => {
        setLoading(true);
        axios.get('/api/equipment')
            .then(res => {
                // უსაფრთხოების ფილტრი: თუ მონაცემი არ არის მასივი, ვიყენებთ ცარიელ მასივს
                setEquipment(Array.isArray(res.data) ? res.data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("ხელსაწყოების წამოღების შეცდომა:", err);
                setEquipment([]);
                setLoading(false);
            });
    };

    useEffect(() => { fetchEquipment(); }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/equipment', formData);
            alert("✅ ხელსაწყო დაემატა!");
            fetchEquipment(); // სიის განახლება
            setFormData({ name: '', serialNumber: '', manufacturer: '', calibrationDate: '', calibrationInterval: 12 });
        } catch (err) { 
            const errorMsg = err.response?.data?.error || "შეცდომა დამატებისას!";
            alert("❌ " + errorMsg); 
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("ნამდვილად გსურთ ხელსაწყოს წაშლა?")) {
            try {
                await axios.delete(`/api/equipment/${id}`);
                fetchEquipment();
            } catch (err) { alert("წაშლა ვერ მოხერხდა"); }
        }
    };

    // სტატუსის დათვლა (ISO სტანდარტის შესაბამისი ფერებით)
    const getStatus = (nextDate) => {
        if (!nextDate) return <Badge bg="secondary">მონაცემი არაა</Badge>;
        
        const today = new Date();
        const next = new Date(nextDate);
        const diffTime = next - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return <Badge bg="danger">ვადაგასული ({Math.abs(diffDays)} დღით)</Badge>;
        if (diffDays <= 30) return <Badge bg="warning" text="dark">იწურება ({diffDays} დღეში)</Badge>;
        return <Badge bg="success">აქტიური</Badge>;
    };

    return (
        <Container className="mt-4 font-georgian pb-5">
            <h3 className="fw-bold mb-4 text-dark">🛠️ აპარატურის და ხელსაწყოების მართვა</h3>
            
            <Row>
                {/* მარცხენა მხარე - რეგისტრაცია */}
                <Col md={4}>
                    <Card className="shadow-sm p-4 border-0 rounded-4">
                        <h5 className="text-primary fw-bold mb-4">ახალი ხელსაწყო</h5>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">დასახელება</Form.Label>
                                <Form.Control required name="name" value={formData.name} onChange={handleChange} placeholder="მაგ: ლაზერული მანძილმზომი" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">სერიული ნომერი</Form.Label>
                                <Form.Control required name="serialNumber" value={formData.serialNumber} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">მწარმოებელი</Form.Label>
                                <Form.Control name="manufacturer" value={formData.manufacturer} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">ბოლო კალიბრაცია</Form.Label>
                                <Form.Control required type="date" name="calibrationDate" value={formData.calibrationDate} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label className="small fw-bold">ინტერვალი (თვე)</Form.Label>
                                <Form.Control type="number" name="calibrationInterval" value={formData.calibrationInterval} onChange={handleChange} />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 fw-bold py-2">
                                + ბაზაში დამატება
                            </Button>
                        </Form>
                    </Card>
                </Col>

                {/* მარჯვენა მხარე - ცხრილი */}
                <Col md={8}>
                    <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2 text-muted">იტვირთება რეესტრი...</p>
                            </div>
                        ) : (
                            <Table hover responsive className="mb-0 align-middle">
                                <thead className="bg-dark text-white">
                                    <tr>
                                        <th className="p-3">ხელსაწყო / მოდელი</th>
                                        <th>სერიული №</th>
                                        <th>შემდეგი ვადა</th>
                                        <th>სტატუსი</th>
                                        <th className="text-center">მართვა</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipment.length > 0 ? equipment.map(item => (
                                        <tr key={item._id}>
                                            <td className="p-3">
                                                <div className="fw-bold">{item.name}</div>
                                                <small className="text-muted">{item.manufacturer || '---'}</small>
                                            </td>
                                            <td className="font-monospace">{item.serialNumber}</td>
                                            <td className="fw-bold">
                                                {item.nextCalibration ? new Date(item.nextCalibration).toLocaleDateString('ka-GE') : '---'}
                                            </td>
                                            <td>{getStatus(item.nextCalibration)}</td>
                                            <td className="text-center">
                                                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(item._id)}>
                                                    🗑️ წაშლა
                                                </Button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5 text-muted">
                                                აპარატურა არ არის რეგისტრირებული
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EquipmentManager;