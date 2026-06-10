import React, { useState } from 'react';
import { Container, Card, Form, Row, Col, Button } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import LaborContractPdf from '../pdf-components/LaborContractPdf';

const ContractGenerator = () => {
    // ველები
    const [employeeName, setEmployeeName] = useState('');
    const [personalId, setPersonalId] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [contractNumber, setContractNumber] = useState('LC-2026-001');

    const makePdfData = (withSignature = false) => ({
        employeeName,
        personalId,
        address,
        phone,
        position,
        salary,
        startDate,
        contractNumber,
        date: new Date().toLocaleDateString('ka-GE'),
        withSignature,
    });

    const isFormValid = employeeName && personalId && position && salary;

    return (
        <Container className="mt-4 font-georgian pb-5">
            <h3 className="fw-bold mb-4">📝 შრომითი ხელშეკრულების გაფორმება</h3>

            <Row>
                <Col md={5}>
                    <Card className="shadow-sm p-3 mb-4" style={{maxHeight: '85vh', overflowY: 'auto'}}>
                        <h6 className="mb-3 text-primary fw-bold">კანდიდატის მონაცემები</h6>

                        <Form.Group className="mb-2"><Form.Label>სახელი, გვარი</Form.Label><Form.Control value={employeeName} onChange={(e)=>setEmployeeName(e.target.value)} /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>პირადი ნომერი</Form.Label><Form.Control value={personalId} onChange={(e)=>setPersonalId(e.target.value)} /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>მისამართი (ფაქტობრივი)</Form.Label><Form.Control value={address} onChange={(e)=>setAddress(e.target.value)} /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>ტელეფონი</Form.Label><Form.Control value={phone} onChange={(e)=>setPhone(e.target.value)} /></Form.Group>

                        <h6 className="mb-3 mt-4 text-primary fw-bold">პირობები</h6>
                        <Form.Group className="mb-2"><Form.Label>პოზიცია</Form.Label><Form.Control value={position} onChange={(e)=>setPosition(e.target.value)} placeholder="მაგ: ექსპერტ-ინსპექტორი" /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>ხელფასი (დარიცხული, ლარი)</Form.Label><Form.Control type="number" value={salary} onChange={(e)=>setSalary(e.target.value)} /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>დაწყების თარიღი</Form.Label><Form.Control type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>ხელშეკრულების №</Form.Label><Form.Control value={contractNumber} onChange={(e)=>setContractNumber(e.target.value)} /></Form.Group>
                    </Card>
                </Col>

                <Col md={7}>
                    <Card className="shadow-sm p-5 text-center h-100 d-flex flex-column justify-content-center align-items-center bg-light">
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🤝</div>
                        <h4>ხელშეკრულების პაკეტი</h4>
                        <p className="text-muted mb-4">გენერირდება: მთავარი ხელშეკრულება + ინსტრუქცია + მატერიალური პასუხისმგებლობა</p>

                        {isFormValid ? (
                            <div className="d-flex gap-2 flex-wrap justify-content-center">
                                <PDFDownloadLink document={<LaborContractPdf data={makePdfData(false)} />} fileName={`ხელშეკრულება_${employeeName}.pdf`} className="btn btn-success btn-lg fw-bold px-4 shadow" style={{ textDecoration: 'none' }}>
                                    {({ loading }) => loading ? '...' : '📥 სრული პაკეტის ჩამოტვირთვა'}
                                </PDFDownloadLink>
                                <PDFDownloadLink document={<LaborContractPdf data={makePdfData(true)} />} fileName={`signed-ხელშეკრულება_${employeeName}.pdf`} className="btn btn-outline-secondary btn-lg fw-bold px-4" style={{ textDecoration: 'none' }}>
                                    {({ loading }) => loading ? '...' : '✍️ ხელმოწერით'}
                                </PDFDownloadLink>
                            </div>
                        ) : (
                            <Button variant="secondary" disabled>შეავსეთ ყველა ველი</Button>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ContractGenerator;
