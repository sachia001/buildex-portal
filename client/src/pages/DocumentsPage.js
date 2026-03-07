import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Link } from 'react-router-dom'; 

// PDF კომპონენტები
import BlankLetterhead from '../pdf-components/BlankLetterhead'; 
import BlankApplicationForm from '../pdf-components/BlankApplicationForm';
import ReportCoverPdf from '../pdf-components/ReportCoverPdf'; 

const DocumentsPage = () => {
    return (
        <Container className="mt-4 font-georgian">
            <h4 className="fw-bold mb-3 text-dark">📂 დოკუმენტების შაბლონები</h4>
            <p className="text-muted mb-4 small">აირჩიეთ და ჩამოტვირთეთ სასურველი შაბლონი ან შექმენით ახალი დოკუმენტი.</p>

            <Row className="g-2">
                
                {/* 1. ბლანკი */}
                <Col xl={2} lg={3} md={4} sm={6}>
                    <Card className="h-100 shadow-sm border-0">
                        <Card.Body className="text-center p-2">
                            <div className="fs-3 mb-1">📄</div>
                            <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.85rem' }}>
                                ოფიციალური ბლანკი
                            </div>
                            <p className="text-muted text-truncate mb-2" style={{ fontSize: '0.65rem' }}>
                                ლოგო და რეკვიზიტები.
                            </p>
                            <PDFDownloadLink document={<BlankLetterhead />} fileName="ბილდექს_ბლანკი.pdf" style={{ textDecoration: 'none' }}>
                                {({ loading }) => (
                                    <Button variant="outline-primary" size="sm" className="w-100 fw-bold" style={{ fontSize: '0.7rem', padding: '2px 5px' }}>
                                        {loading ? '...' : '📥 ჩამოტვირთვა'}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        </Card.Body>
                    </Card>
                </Col>

                {/* 2. განცხადება */}
                <Col xl={2} lg={3} md={4} sm={6}>
                    <Card className="h-100 shadow-sm border-0">
                        <Card.Body className="text-center p-2">
                            <div className="fs-3 mb-1">📝</div>
                            <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.85rem' }}>
                                განცხადების ფორმა
                            </div>
                            <p className="text-muted text-truncate mb-2" style={{ fontSize: '0.65rem' }}>
                                ინსპექტირების მოთხოვნა.
                            </p>
                            <PDFDownloadLink document={<BlankApplicationForm />} fileName="განცხადების_ფორმა.pdf" style={{ textDecoration: 'none' }}>
                                {({ loading }) => (
                                    <Button variant="outline-primary" size="sm" className="w-100 fw-bold" style={{ fontSize: '0.7rem', padding: '2px 5px' }}>
                                        {loading ? '...' : '📥 ჩამოტვირთვა'}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        </Card.Body>
                    </Card>
                </Col>

                {/* 3. დასკვნის ნიმუში */}
                <Col xl={2} lg={3} md={4} sm={6}>
                    <Card className="h-100 shadow-sm border-0">
                        <Card.Body className="text-center p-2">
                            <div className="fs-3 mb-1">📑</div>
                            <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.85rem' }}>
                                დასკვნის ნიმუში
                            </div>
                            <p className="text-muted text-truncate mb-2" style={{ fontSize: '0.65rem' }}>
                                სრული ანგარიშის ვიზუალი.
                            </p>
                            <PDFDownloadLink document={<ReportCoverPdf />} fileName="დასკვნის_ნიმუში.pdf" style={{ textDecoration: 'none' }}>
                                {({ loading }) => (
                                    <Button variant="outline-primary" size="sm" className="w-100 fw-bold" style={{ fontSize: '0.7rem', padding: '2px 5px' }}>
                                        {loading ? '...' : '📥 ჩამოტვირთვა'}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        </Card.Body>
                    </Card>
                </Col>

                {/* 4. ბრძანების გენერატორი */}
                <Col xl={2} lg={3} md={4} sm={6}>
                    <Card className="h-100 shadow-sm border-0 bg-light">
                        <Card.Body className="text-center p-2">
                            <div className="fs-3 mb-1">⚖️</div>
                            <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.85rem' }}>
                                ბრძანების გენერატორი
                            </div>
                            <p className="text-muted text-truncate mb-2" style={{ fontSize: '0.65rem' }}>
                                დანიშვნა, შვებულება, მივლინება.
                            </p>
                            <Button as={Link} to="/order-generator" variant="primary" size="sm" className="w-100 fw-bold" style={{ fontSize: '0.7rem', padding: '2px 5px' }}>
                                ⚙️ შექმნა
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                {/* 👇 5. ახალი: შრომითი ხელშეკრულება */}
                <Col xl={2} lg={3} md={4} sm={6}>
                    <Card className="h-100 shadow-sm border-0 bg-light">
                        <Card.Body className="text-center p-2">
                            <div className="fs-3 mb-1">🤝</div>
                            <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.85rem' }}>
                                შრომითი ხელშეკრულება
                            </div>
                            <p className="text-muted text-truncate mb-2" style={{ fontSize: '0.65rem' }}>
                                + 2 დანართი (ერთ ფაილში).
                            </p>
                            <Button as={Link} to="/contract-generator" variant="primary" size="sm" className="w-100 fw-bold" style={{ fontSize: '0.7rem', padding: '2px 5px' }}>
                                ⚙️ გაფორმება
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>
        </Container>
    );
};

export default DocumentsPage;