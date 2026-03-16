import React, { useState, useRef } from 'react';
import { Container, Card, Form, Row, Col, Button } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DirectorsOrderPdf from '../pdf-components/DirectorsOrderPdf';
import { generateDocNumber } from '../utils/docCategories';
import SignatureCanvas from 'react-signature-canvas';

const OrderGenerator = () => {
    // --- ძირითადი ველები ---
    const [orderType, setOrderType] = useState('APPOINTMENT'); 
    const [employeeName, setEmployeeName] = useState('');
    const [position, setPosition] = useState(''); 
    const [startDate, setStartDate] = useState('');
    
    // --- დამატებითი ველები ---
    const [personalId, setPersonalId] = useState(''); 
    const [salary, setSalary] = useState(''); 
    const [endDate, setEndDate] = useState(''); 
    const [returnDate, setReturnDate] = useState(''); 
    const [substituteName, setSubstituteName] = useState(''); 
    const [location, setLocation] = useState(''); 
    const [purpose, setPurpose] = useState(''); 
    const [newPosition, setNewPosition] = useState(''); 
    const [dismissalReason, setDismissalReason] = useState('');

    // ხელმოწერის შტატები
    const sigPadRef = useRef({}); 
    const [signatureImage, setSignatureImage] = useState(null); 

    const currentSeq = 15; 

    const calculateDays = (start, end) => {
        if(!start || !end) return "...";
        const s = new Date(start);
        const e = new Date(end);
        const diffTime = Math.abs(e - s);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    };

    const clearSignature = () => {
        sigPadRef.current.clear();
        setSignatureImage(null);
    };

    // 🛑 შესწორებული ფუნქცია (trim-ის გარეშე)
    const saveSignature = () => {
        if (sigPadRef.current.isEmpty()) {
            alert("ჯერ დახატეთ ხელმოწერა!");
            return;
        }
        // ვიღებთ მთლიან კანვასს, რაც უსაფრთხოა და არ იწვევს ერორს
        setSignatureImage(sigPadRef.current.getCanvas().toDataURL('image/png'));
    };

    const generateOrderData = () => {
        let categoryCode = 'DIRECTOR_HR'; 
        let subject = "";
        let preamble = "";
        let clauses = [];

        // 1. დანიშვნა (02-HR)
        if (orderType === 'APPOINTMENT') {
            categoryCode = 'DIRECTOR_HR';
            subject = `${employeeName}-ს ${position} პოზიციაზე დანიშვნის შესახებ`;
            preamble = `საქართველოს ორგანული კანონის „საქართველოს შრომის კოდექსის“ მე-6 და მე-9 მუხლების, კომპანიის წესდებისა და საშტატო ნუსხის საფუძველზე, ასევე კანდიდატის კვალიფიკაციის SST ISO/IEC 17020:2012 სტანდარტის მოთხოვნებთან შესაბამისობის დადასტურების გათვალისწინებით,`;
            clauses = [
                { title: "დანიშვნა", text: `${employeeName} (პ/ნ ${personalId}) დაინიშნოს შპს „ბილდექს ექსპერტიზა“-ში ${position} პოზიციაზე, ${startDate}-დან.` },
                { title: "ანაზღაურება", text: `შრომის ანაზღაურება განისაზღვროს თვეში ${salary} ლარის ოდენობით (დარიცხული), შრომითი ხელშეკრულების პირობების შესაბამისად.` },
                { title: "ფუნქცია-მოვალეობები", text: `დასაქმებულის უფლება-მოვალეობები განისაზღვროს თანამდებობრივი ინსტრუქციით, რომელიც წარმოადგენს შრომითი ხელშეკრულების განუყოფელ ნაწილს.` },
                { title: "ISO 17020 ვალდებულება", text: `დანიშვნისთანავე დასაქმებულმა ხელი მოაწეროს „დამოუკიდებლობისა და მიუკერძოებლობის დეკლარაციას“ და გაეცნოს ხარისხის სახელმძღვანელოს.` },
                { title: "საფუძველი", text: `მხარეთა შორის გაფორმებული შრომითი ხელშეკრულება; ${employeeName}-ს განცხადება/CV.` },
                { title: "", text: "ბრძანება ძალაშია ხელმოწერისთანავე." }
            ];
        }
        // 2. შვებულება
        else if (orderType === 'LEAVE') {
             categoryCode = 'DIRECTOR_HR';
             const daysCount = calculateDays(startDate, endDate);
             subject = `${employeeName}-სთვის კუთვნილი ანაზღაურებადი შვებულების მიცემის შესახებ`;
             preamble = `საქართველოს ორგანული კანონის „საქართველოს შრომის კოდექსის“ 21-ე და 22-ე მუხლებისა და კომპანიის შრომის შინაგანაწესის შესაბამისად,`;
             clauses = [
                 { title: "შვებულება", text: `${position}, ${employeeName}-ს მიეცეს კუთვნილი ანაზღაურებადი შვებულება ${daysCount} სამუშაო დღით, ${startDate}-დან ${endDate}-ს ჩათვლით.` },
                 { title: "სამსახურში გამოსვლა", text: `სამსახურში გამოცხადების თარიღად განისაზღვროს ${returnDate}.` },
                 { title: "ჩანაცვლება", text: `საინსპექტირებო საქმიანობის უწყვეტობის მიზნით, შვებულების პერიოდში ${employeeName}-ს მოვალეობის დროებითი შესრულება დაევალოს ${substituteName}-ს.` },
                 { title: "ანაზღაურება", text: `ბუღალტერიამ უზრუნველყოს საშვებულებო ანაზღაურების ჩარიცხვა კანონმდებლობით დადგენილი წესით.` },
                 { title: "საფუძველი", text: `${employeeName}-ს განცხადება.` },
                 { title: "", text: "ბრძანება ძალაშია ხელმოწერისთანავე." }
             ];
        }
        // 3. მივლინება
        else if (orderType === 'TRIP') {
             categoryCode = 'DIRECTOR_TRIP';
             const daysCount = calculateDays(startDate, endDate);
             subject = `${employeeName}-ს სამსახურებრივი მივლინების შესახებ`;
             preamble = `საქართველოს საგადასახადო კოდექსის, კომპანიის „სამსახურებრივი მივლინების წესისა“ და დამკვეთთან გაფორმებული ხელშეკრულების საფუძველზე,`;
             clauses = [
                { title: "მივლინება", text: `${position} ${employeeName} მივლინებულ იქნეს ${location}-ში.` },
                { title: "ვადა", text: `მივლინების პერიოდი განისაზღვროს ${startDate}-დან ${endDate}-ს ჩათვლით (${daysCount} დღე).` },
                { title: "მიზანი", text: `${purpose}.` },
                { title: "ხარჯები", text: `ბუღალტერიამ უზრუნველყოს სადღეღამისო და სამგზავრო ხარჯების ანაზღაურება კომპანიის ბიუჯეტიდან, დადგენილი ნორმების ფარგლებში.` },
                { title: "ანგარიშგება", text: `მივლინებულმა პირმა დაბრუნებიდან 3 დღის ვადაში წარმოადგინოს ხარჯის დამადასტურებელი დოკუმენტაცია და ტექნიკური ანგარიში.` },
                { title: "", text: "ბრძანება ძალაშია ხელმოწერისთანავე." }
            ];
        }
         // 4. გადაყვანა
        else if (orderType === 'TRANSFER') {
             categoryCode = 'DIRECTOR_HR';
             subject = `${employeeName}-ს სხვა პოზიციაზე გადაყვანის შესახებ`;
             preamble = `საქართველოს ორგანული კანონის „საქართველოს შრომის კოდექსის“ მე-10 მუხლის (შრომითი ხელშეკრულების პირობების შეცვლა) და მხარეთა შორის მიღწეული შეთანხმების საფუძველზე,`;
             clauses = [
                { title: "გადაყვანა", text: `${position} ${employeeName} გადაყვანილ იქნეს ${newPosition}-ს პოზიციაზე, ${startDate}-დან.` },
                { title: "ახალი პირობები", text: `დასაქმებულის შრომის ანაზღაურება განისაზღვროს ${salary} ლარის ოდენობით. სამუშაო აღწერილობა დამტკიცდეს ახალი თანამდებობრივი ინსტრუქციის შესაბამისად.` },
                { title: "ცვლილება ხელშეკრულებაში", text: `დაევალოს იურისტს/კადრების მენეჯერს, უზრუნველყოს შრომით ხელშეკრულებაში შესაბამისი ცვლილების (შეთანხმების) გაფორმება.` },
                { title: "საფუძველი", text: `${employeeName}-ს განცხადება / დირექტორის წარდგინება დაწინაურების შესახებ.` },
                { title: "", text: "ბრძანება ძალაშია ხელმოწერისთანავე." }
            ];
        }
         // 5. გათავისუფლება
        else if (orderType === 'DISMISSAL') {
             categoryCode = 'DIRECTOR_HR';
             subject = `${employeeName}-თან შრომითი ურთიერთობის შეწყვეტის შესახებ`;
             preamble = `საქართველოს ორგანული კანონის „საქართველოს შრომის კოდექსის“ ${dismissalReason || 'შესაბამისი მუხლის'} შესაბამისად,`;
             clauses = [
                { title: "შეწყვეტა", text: `შეუწყდეს შრომითი ხელშეკრულება და გათავისუფლდეს დაკავებული თანამდებობიდან ${employeeName} (პ/ნ ${personalId}) ${startDate}-დან.` },
                { title: "ქონების დაბრუნება", text: `${employeeName}-მ გათავისუფლების თარიღამდე უზრუნველყოს კომპანიის კუთვნილი მატერიალური ფასეულობების (ლეპტოპი, საშვი, ავტომობილი, დოკუმენტაცია) ჩაბარება მიღება-ჩაბარების აქტით უშუალო ხელმძღვანელისთვის.` },
                { title: "საბოლოო ანგარიშსწორება", text: `ბუღალტერიამ უზრუნველყოს დასაქმებულთან საბოლოო ფინანსური ანგარიშსწორება (მათ შორის, გამოუყენებელი შვებულების კომპენსაცია, ასეთის არსებობის შემთხვევაში) შრომის კოდექსით დადგენილ ვადაში.` },
                { title: "ISO 17020", text: `გაუუქმდეს ${employeeName}-ს წვდომა კომპანიის ელექტრონულ ბაზებზე და არქივზე კონფიდენციალურობის დაცვის მიზნით.` },
                { title: "საფუძველი", text: `${employeeName}-ს განცხადება / დისციპლინური კომისიის ოქმი.` },
                { title: "", text: "ბრძანება ძალაშია ხელმოწერისთანავე." }
            ];
        }

        const finalNumber = generateDocNumber(categoryCode, currentSeq);

        return {
            number: finalNumber,
            date: new Date().toLocaleDateString('ka-GE'),
            subject,
            preamble,
            clauses,
            directorName: "ლევან საჩიშვილი",
            signature: signatureImage 
        };
    };

    const pdfData = generateOrderData();

    return (
        <Container className="mt-4 font-georgian pb-5">
            <h3 className="fw-bold mb-4">⚖️ ბრძანებების გენერატორი</h3>
            
            <Row>
                <Col md={5}>
                    <Card className="shadow-sm p-3 mb-4" style={{maxHeight: '85vh', overflowY: 'auto'}}>
                        <h6 className="mb-3 text-primary fw-bold">ბრძანების ტიპი</h6>
                        <Form.Select value={orderType} onChange={(e) => setOrderType(e.target.value)} size="lg" className="mb-4">
                                <option value="APPOINTMENT">1. დანიშვნა (02-HR)</option>
                                <option value="LEAVE">2. შვებულება (02-HR)</option>
                                <option value="TRIP">3. მივლინება (03-TR)</option>
                                <option value="TRANSFER">4. გადაყვანა (02-HR)</option>
                                <option value="DISMISSAL">5. გათავისუფლება (02-HR)</option>
                        </Form.Select>

                        {/* ფორმის ველები */}
                        <Form.Group className="mb-2"><Form.Label>თანამშრომელი</Form.Label><Form.Control type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} /></Form.Group>
                        {(orderType === 'APPOINTMENT' || orderType === 'DISMISSAL') && (<Form.Group className="mb-2"><Form.Label>პირადი ნომერი</Form.Label><Form.Control type="text" value={personalId} onChange={(e) => setPersonalId(e.target.value)} /></Form.Group>)}
                        <Form.Group className="mb-2"><Form.Label>{orderType === 'TRANSFER' ? 'ძველი თანამდებობა' : 'თანამდებობა'}</Form.Label><Form.Control type="text" value={position} onChange={(e) => setPosition(e.target.value)} /></Form.Group>
                        {(orderType === 'APPOINTMENT' || orderType === 'TRANSFER') && (<Form.Group className="mb-2"><Form.Label>ხელფასი (ლარი)</Form.Label><Form.Control type="number" value={salary} onChange={(e) => setSalary(e.target.value)} /></Form.Group>)}
                        {orderType === 'TRANSFER' && (<Form.Group className="mb-2"><Form.Label>ახალი თანამდებობა</Form.Label><Form.Control type="text" value={newPosition} onChange={(e) => setNewPosition(e.target.value)} /></Form.Group>)}
                        <Row><Col><Form.Group className="mb-2"><Form.Label>{orderType === 'DISMISSAL' ? 'გათავისუფლების თარიღი' : 'დაწყების თარიღი'}</Form.Label><Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></Form.Group></Col>{(orderType === 'LEAVE' || orderType === 'TRIP') && (<Col><Form.Group className="mb-2"><Form.Label>დასრულების თარიღი</Form.Label><Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></Form.Group></Col>)}</Row>
                        {orderType === 'LEAVE' && (<><Form.Group className="mb-2"><Form.Label>სამსახურში გამოსვლის თარიღი</Form.Label><Form.Control type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} /></Form.Group><Form.Group className="mb-2"><Form.Label>შემცვლელის სახელი/გვარი</Form.Label><Form.Control type="text" value={substituteName} onChange={(e) => setSubstituteName(e.target.value)} /></Form.Group></>)}
                        {orderType === 'TRIP' && (<><Form.Group className="mb-2"><Form.Label>მივლინების ადგილი</Form.Label><Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} /></Form.Group><Form.Group className="mb-2"><Form.Label>მიზანი (ობიექტი)</Form.Label><Form.Control as="textarea" rows={2} value={purpose} onChange={(e) => setPurpose(e.target.value)} /></Form.Group></>)}
                        {orderType === 'DISMISSAL' && (<Form.Group className="mb-2"><Form.Label>საფუძველი (მუხლი)</Form.Label><Form.Control type="text" value={dismissalReason} onChange={(e) => setDismissalReason(e.target.value)} /></Form.Group>)}
                        
                        <hr className="my-4"/>

                        <h6 className="mb-3 text-primary fw-bold">დირექტორის ხელმოწერა</h6>
                        <div className="border rounded mb-2" style={{ backgroundColor: '#f8f9fa' }}>
                            <SignatureCanvas 
                                ref={sigPadRef}
                                penColor='black'
                                canvasProps={{width: 450, height: 150, className: 'sigCanvas'}} 
                            />
                        </div>
                        <div className="d-flex gap-2 mb-3">
                            <Button variant="outline-secondary" size="sm" onClick={clearSignature}>გასუფთავება</Button>
                            <Button variant="outline-primary" size="sm" onClick={saveSignature}>✅ ხელმოწერის დადასტურება</Button>
                        </div>
                        {signatureImage && <p className="text-success small fw-bold">ხელმოწერა მიღებულია!</p>}

                    </Card>
                </Col>

                <Col md={7}>
                    <Card className="shadow-sm p-4 text-center h-100 d-flex flex-column justify-content-center align-items-center bg-light">
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📄</div>
                        <h4 className="fw-bold">დოკუმენტის გადახედვა</h4>
                        <p className="text-muted mb-4">შეავსეთ ველები და დაადასტურეთ ხელმოწერა PDF-ის გენერაციისთვის</p>
                        
                        <div className="border p-3 bg-white w-100 mb-4 text-start shadow-sm" style={{ minHeight: '200px', fontSize: '0.9rem' }}>
                            <p><strong>ნომერი:</strong> {pdfData.number}</p>
                            <p><strong>თემა:</strong> {pdfData.subject}</p>
                            <hr/>
                            <ul>{pdfData.clauses.map((c, i) => (<li key={i} className="mb-1">{c.title && <strong>{c.title}: </strong>}{c.text.length > 80 ? c.text.substring(0, 80) + '...' : c.text}</li>))}</ul>
                        </div>

                        {employeeName && startDate && signatureImage ? (
                            <PDFDownloadLink document={<DirectorsOrderPdf data={pdfData} />} fileName={`ბრძანება_${pdfData.number}.pdf`} style={{ textDecoration: 'none' }}>
                                {({ loading }) => (
                                    <Button variant="success" size="lg" className="fw-bold px-5 shadow">
                                        {loading ? 'მუშავდება...' : '📥 ბრძანების ჩამოტვირთვა'}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        ) : (
                            <Button variant="secondary" disabled>შეავსეთ ველები და დაადასტურეთ ხელმოწერა</Button>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default OrderGenerator;