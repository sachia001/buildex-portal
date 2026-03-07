import React, { useState, useRef } from 'react';
import { Container, Card, Form, Row, Col, Button } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import LaborContractPdf from '../pdf-components/LaborContractPdf';
import SignatureCanvas from 'react-signature-canvas';

const ContractGenerator = () => {
    // ველები
    const [employeeName, setEmployeeName] = useState('');
    const [personalId, setPersonalId] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState(''); // ტელეფონის ნომერი
    const [position, setPosition] = useState(''); // მაგ: ექსპერტ-ინსპექტორი
    const [salary, setSalary] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [contractNumber, setContractNumber] = useState('LC-2026-001'); 

    // ხელმოწერა
    const sigPadRef = useRef({});
    const [signatureImage, setSignatureImage] = useState(null);

    const clearSignature = () => {
        sigPadRef.current.clear();
        setSignatureImage(null);
    };

    const saveSignature = () => {
        if (sigPadRef.current.isEmpty()) return alert("ჯერ დახატეთ ხელმოწერა!");
        setSignatureImage(sigPadRef.current.getCanvas().toDataURL('image/png'));
    };

    const pdfData = {
        employeeName,
        personalId,
        address,
        phone,
        position,
        salary,
        startDate,
        contractNumber,
        date: new Date().toLocaleDateString('ka-GE'),
        directorSignature: signatureImage
    };

    const isFormValid = employeeName && personalId && position && salary && signatureImage;

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

                        <hr className="my-4"/>
                        <h6 className="mb-2 text-primary fw-bold">დირექტორის ხელმოწერა</h6>
                        <div className="border rounded mb-2" style={{ backgroundColor: '#f8f9fa' }}>
                            <SignatureCanvas ref={sigPadRef} penColor='black' canvasProps={{width: 450, height: 150, className: 'sigCanvas'}} />
                        </div>
                        <div className="d-flex gap-2">
                             <Button variant="outline-secondary" size="sm" onClick={clearSignature}>გასუფთავება</Button>
                             <Button variant="outline-primary" size="sm" onClick={saveSignature}>დადასტურება</Button>
                        </div>
                        {signatureImage && <p className="text-success small fw-bold mt-1">ხელმოწერა შენახულია</p>}
                    </Card>
                </Col>

                <Col md={7}>
                    <Card className="shadow-sm p-5 text-center h-100 d-flex flex-column justify-content-center align-items-center bg-light">
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🤝</div>
                        <h4>ხელშეკრულების პაკეტი</h4>
                        <p className="text-muted">გენერირდება: მთავარი ხელშეკრულება + ინსტრუქცია + მატერიალური პასუხისმგებლობა</p>
                        
                        {isFormValid ? (
                            <PDFDownloadLink document={<LaborContractPdf data={pdfData} />} fileName={`ხელშეკრულება_${employeeName}.pdf`} style={{ textDecoration: 'none' }}>
                                {({ loading }) => (
                                    <Button variant="success" size="lg" className="fw-bold px-5 shadow">
                                        {loading ? '...' : '📥 სრული პაკეტის ჩამოტვირთვა'}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        ) : (
                            <Button variant="secondary" disabled>შეავსეთ ყველა ველი და დაადასტურეთ ხელმოწერა</Button>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ContractGenerator;