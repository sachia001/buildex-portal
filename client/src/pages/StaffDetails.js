import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Table, Badge, Spinner, Modal, Nav, Tab, Accordion } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import axios from 'axios';
import { toast, confirmDialog } from '../components/Feedback';
import DirectorsOrderPdf from '../pdf-components/DirectorsOrderPdf';
import LaborContractPdf from '../pdf-components/LaborContractPdf';
import ImpartialityDeclarationPdf from '../pdf-components/ImpartialityDeclarationPdf';
import ImpartialityGeneralPdf from '../pdf-components/ImpartialityGeneralPdf';
import ImpartialityPerCasePdf from '../pdf-components/ImpartialityPerCasePdf';
import ConfidentialityAgreementPdf from '../pdf-components/ConfidentialityAgreementPdf';
import TrainingRecordPdf from '../pdf-components/TrainingRecordPdf';
import { generateDocNumber } from '../utils/docCategories';

const today = new Date().toISOString().split('T')[0];
const todayGe = new Date().toLocaleDateString('ka-GE');

const StaffDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    // Upload
    const [docType, setDocType] = useState('პირადობა');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const docOptions = ['პირადობა', 'CV', 'დიპლომი', 'სერთიფიკატი', 'ბრძანება', 'ხელშეკრულება'];

    // ბრძანება / ხელშეკრულება
    const [salary, setSalary] = useState('');
    const [address, setAddress] = useState('');
    const [startDate, setStartDate] = useState(today);
    const [contractNumber, setContractNumber] = useState('LC-2026-001');

    // BE-FM-IMP-DECL — ზოგადი სფეროები + კონფლიქტი
    const [genScopes, setGenScopes] = useState([]);
    const [genConflicts, setGenConflicts] = useState({ ownership: false, family: false, employment: false, financial: false, contract: false });

    // BE-FM-IMP-CHECK — საქმეზე მიბმული
    const [caseSearchNum, setCaseSearchNum] = useState('');
    const [caseSearching, setCaseSearching] = useState(false);
    const [foundCase, setFoundCase] = useState(null);
    const [caseNotFound, setCaseNotFound] = useState(false);
    const [caseConflicts, setCaseConflicts] = useState({ acquainted: false, employed: false, financial: false, participated: false, other: false });
    const [caseConclusion, setCaseConclusion] = useState('clear');

    // BE-FM-TRAIN — ტრენინგის ჩანაწერი
    const [trainingDate, setTrainingDate] = useState(today);
    const [duration, setDuration] = useState('');
    const [trainingType, setTrainingType] = useState('შიდა');
    const [topic, setTopic] = useState('');
    const [trainer, setTrainer] = useState('');
    const [trainingLocation, setTrainingLocation] = useState('ქ. თელავი');
    const [assessmentMethods, setAssessmentMethods] = useState([]);
    const [assessmentResult, setAssessmentResult] = useState('კომპეტენტური');
    const [authorized, setAuthorized] = useState(true);
    const [nextTrainingDate, setNextTrainingDate] = useState('');


    const toggleAssessmentMethod = (key) => setAssessmentMethods(prev =>
        prev.includes(key) ? prev.filter(m => m !== key) : [...prev, key]
    );

    const fetchUser = async () => {
        try {
            const res = await axios.get(`/api/users/${id}`);
            setUser(res.data);
            setNewStatus(res.data.status);
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchUser(); }, [id]);

    const handleUpload = async () => {
        if (!file) return toast('აირჩიეთ ფაილი!', 'warning');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('docType', docType);
        setUploading(true);
        try {
            await axios.post(`/api/users/${id}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast('✅ ფაილი აიტვირთა!', 'success');
            setFile(null);
            fetchUser();
        } catch { toast('ატვირთვა ვერ მოხერხდა!', 'danger'); }
        finally { setUploading(false); }
    };

    const deleteDoc = async (key) => {
        if (!(await confirmDialog('წავშალოთ დოკუმენტი?'))) return;
        const newDocs = { ...user.documents };
        delete newDocs[key];
        try {
            await axios.put(`/api/users/${id}`, { documents: newDocs });
            fetchUser();
        } catch { toast('ვერ წაიშალა', 'danger'); }
    };

    const handleStatusChange = async () => {
        try {
            await axios.put(`/api/users/${id}`, { status: newStatus });
            setShowStatusModal(false);
            fetchUser();
            toast('✅ სტატუსი შეიცვალა', 'success');
        } catch { toast('შეცდომა', 'danger'); }
    };

    const searchInspection = async () => {
        if (!caseSearchNum.trim()) return;
        setCaseSearching(true);
        setCaseNotFound(false);
        setFoundCase(null);
        try {
            const res = await axios.get('/api/inspections');
            const match = res.data.find(i =>
                i.inspectionNumber === caseSearchNum.trim() ||
                i.applicationNumber === caseSearchNum.trim()
            );
            if (match) setFoundCase(match);
            else setCaseNotFound(true);
        } catch { setCaseNotFound(true); }
        finally { setCaseSearching(false); }
    };

    // PDF data builders
    const buildOrderData = () => ({
        number: generateDocNumber('DIRECTOR_HR', 1),
        date: todayGe,
        subject: `${user.firstName} ${user.lastName}-ს ${user.position} პოზიციაზე დანიშვნის შესახებ`,
        preamble: `საქართველოს ორგანული კანონის „საქართველოს შრომის კოდექსის" მე-6 და მე-9 მუხლების, კომპანიის წესდებისა და საშტატო ნუსხის საფუძველზე, ასევე კანდიდატის კვალიფიკაციის SST ISO/IEC 17020:2012 სტანდარტის მოთხოვნებთან შესაბამისობის დადასტურების გათვალისწინებით,`,
        clauses: [
            { title: 'დანიშვნა', text: `${user.firstName} ${user.lastName} (პ/ნ ${user.personalId}) დაინიშნოს შპს „ბილდექს ექსპერტიზა"-ში ${user.position} პოზიციაზე, ${startDate}-დან.` },
            { title: 'ანაზღაურება', text: `შრომის ანაზღაურება განისაზღვროს თვეში ${salary || '___'} ლარის ოდენობით (დარიცხული), შრომითი ხელშეკრულების პირობების შესაბამისად.` },
            { title: 'ფუნქცია-მოვალეობები', text: `დასაქმებულის უფლება-მოვალეობები განისაზღვროს თანამდებობრივი ინსტრუქციით, რომელიც წარმოადგენს შრომითი ხელშეკრულების განუყოფელ ნაწილს.` },
            { title: 'ISO 17020 ვალდებულება', text: `დანიშვნისთანავე დასაქმებულმა ხელი მოაწეროს „დამოუკიდებლობისა და მიუკერძოებლობის დეკლარაციას" და გაეცნოს ხარისხის სახელმძღვანელოს.` },
            { title: 'საფუძველი', text: `მხარეთა შორის გაფორმებული შრომითი ხელშეკრულება; ${user.firstName} ${user.lastName}-ს განცხადება/CV.` },
            { title: '', text: 'ბრძანება ძალაშია ხელმოწერისთანავე.' },
        ],
        directorName: 'ლევან საჩიშვილი',
        withSignature: false,
    });

    const buildContractData = () => ({
        employeeName: `${user.firstName} ${user.lastName}`,
        personalId: user.personalId,
        address: address || '___',
        phone: user.phone || '___',
        position: user.position,
        salary: salary || '___',
        startDate,
        contractNumber,
        date: todayGe,
        withSignature: false,
    });

    const buildImpartialityDeclarationData = () => ({
        name: `${user.firstName} ${user.lastName}`,
        position: user.position,
        personalId: user.personalId,
        date: todayGe,
        scopes: genScopes,
        conflicts: genConflicts,
    });

    const buildImpartialityGeneralData = () => ({
        name: `${user.firstName} ${user.lastName}`,
        position: user.position,
        personalId: user.personalId,
        date: todayGe,
    });

    const buildImpartialityPerCaseData = () => ({
        name: `${user.firstName} ${user.lastName}`,
        position: user.position,
        personalId: user.personalId,
        date: todayGe,
        inspectionNumber: foundCase?.inspectionNumber || '',
        applicationNumber: foundCase?.applicationNumber || '',
        clientName: foundCase?.clientName || '',
        objectName: foundCase?.objectName || '',
        objectAddress: foundCase?.objectAddress || '',
        caseDate: foundCase ? new Date(foundCase.createdAt).toLocaleDateString('ka-GE') : '',
        caseConflicts,
        conclusion: caseConclusion,
    });

    const buildConfidentialityData = () => ({
        name: `${user.firstName} ${user.lastName}`,
        position: user.position,
        date: todayGe,
    });

    const buildTrainingData = () => ({
        name: `${user.firstName} ${user.lastName}`,
        position: user.position,
        personalId: user.personalId,
        date: todayGe,
        trainingDate,
        duration,
        trainingType,
        topic,
        trainer,
        location: trainingLocation,
        assessmentMethods,
        assessmentResult,
        authorized,
        nextTrainingDate,
    });

    const fname = user ? `${user.firstName}_${user.lastName}` : '';

    if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;
    if (!user) return <Container className="mt-5 text-center">თანამშრომელი ვერ მოიძებნა</Container>;

    const photoUrl = user.photo
        ? (user.photo.startsWith('data:') ? user.photo : `/${user.photo}`)
        : null;

    const trainingTypeOptions = [
        ['შიდა', 'შიდა ტრენინგი'],
        ['გარე', 'გარე ტრენინგი / სემინარი'],
        ['witnessing', 'ადგილზე დაკვირვება'],
        ['ახალი_ინსპ', 'ახ. ინსპ. ზედამხ. ტრ.'],
        ['ნორმატიული', 'ნორმ. დოკ. სწავლება'],
        ['IT', 'IT / პროგ. უზრ. ტრენინგი'],
        ['სხვა', 'სხვა'],
    ];
    const methodOptions = [
        ['test', 'წერ. ტესტი'],
        ['witnessing', 'ადგ. დაკვ.'],
        ['oral', 'ზეპირი'],
        ['practical', 'პრაქტ. სავ.'],
        ['manager', 'ტექნ. მენ. შეფ.'],
    ];

    return (
        <Container className="mt-4 font-georgian pb-5">
            <Button variant="outline-secondary" className="mb-3" onClick={() => navigate('/admin')}>← უკან სიაში</Button>

            <Row>
                {/* Left: Profile */}
                <Col md={4}>
                    <Card className="border-0 shadow-lg rounded-4 overflow-hidden text-center mb-4">
                        <div className="bg-primary p-4 d-flex justify-content-center align-items-center" style={{ minHeight: 150 }}>
                            {photoUrl
                                ? <img src={photoUrl} alt="Profile" className="rounded-circle shadow" style={{ width: 120, height: 120, objectFit: 'cover', border: '4px solid white' }} />
                                : <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: 120, height: 120, fontSize: '3rem', border: '4px solid white' }}>👤</div>
                            }
                        </div>
                        <Card.Body className="pt-3">
                            <h4 className="fw-bold">{user.firstName} {user.lastName}</h4>
                            <p className="text-muted mb-2">{user.position}</p>
                            <Badge bg={user.status === 'აქტიური' ? 'success' : 'secondary'} className="mb-3 px-3 py-2 fs-6">{user.status}</Badge>
                            <br />
                            <Button variant="outline-primary" size="sm" onClick={() => setShowStatusModal(true)}>🔄 სტატუსის შეცვლა</Button>
                            <div className="text-start bg-light p-3 rounded small mt-4">
                                <p className="mb-1"><strong>🆔 პ/ნ:</strong> {user.personalId}</p>
                                <p className="mb-1"><strong>📞 ტელ:</strong> {user.phone || '-'}</p>
                                <p className="mb-0"><strong>📅 ვადა:</strong> {user.authExpiry ? new Date(user.authExpiry).toLocaleDateString() : '-'}</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right: Tabs */}
                <Col md={8}>
                    <Tab.Container defaultActiveKey="docs">
                        <Nav variant="tabs" className="mb-3">
                            <Nav.Item><Nav.Link eventKey="docs">📂 პირადი საქმე</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="generate">📄 დოკუმენტების გენერაცია</Nav.Link></Nav.Item>
                        </Nav>

                        <Tab.Content>
                            {/* TAB 1: Upload/view docs */}
                            <Tab.Pane eventKey="docs">
                                <Card className="border-0 shadow-sm rounded-4 p-4">
                                    <div className="d-flex gap-2 p-3 bg-light rounded mb-3 align-items-end flex-wrap">
                                        <div className="flex-grow-1" style={{ minWidth: 150 }}>
                                            <Form.Label className="small fw-bold">დოკუმენტის ტიპი</Form.Label>
                                            <Form.Select size="sm" value={docType} onChange={e => setDocType(e.target.value)}>
                                                {docOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                            </Form.Select>
                                        </div>
                                        <div className="flex-grow-1" style={{ minWidth: 200 }}>
                                            <Form.Label className="small fw-bold">ფაილის არჩევა</Form.Label>
                                            <Form.Control type="file" size="sm" onChange={e => setFile(e.target.files[0])} />
                                        </div>
                                        <Button size="sm" variant="success" onClick={handleUpload} disabled={uploading}>
                                            {uploading ? '...' : 'ატვირთვა'}
                                        </Button>
                                    </div>
                                    <Table hover responsive className="align-middle">
                                        <thead className="table-light"><tr><th>დასახელება</th><th>ქმედება</th></tr></thead>
                                        <tbody>
                                            {user.documents && Object.keys(user.documents).length > 0
                                                ? Object.entries(user.documents).map(([key, path]) => (
                                                    <tr key={key}>
                                                        <td className="fw-bold text-dark">{key}</td>
                                                        <td>
                                                            <a href={`/${path}?token=${localStorage.getItem('token')}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-link text-decoration-none">👁️ ნახვა</a>
                                                            <Button size="sm" variant="outline-danger" className="ms-2" onClick={() => deleteDoc(key)}>🗑️</Button>
                                                        </td>
                                                    </tr>
                                                ))
                                                : <tr><td colSpan="2" className="text-center text-muted py-4">დოკუმენტები არ არის ატვირთული</td></tr>
                                            }
                                        </tbody>
                                    </Table>
                                </Card>
                            </Tab.Pane>

                            {/* TAB 2: PDF Generation */}
                            <Tab.Pane eventKey="generate">
                                <Card className="border-0 shadow-sm rounded-4 p-3">


                                    <Accordion defaultActiveKey="iso" flush>

                                        {/* === ISO 17020 ფორმები === */}
                                        <Accordion.Item eventKey="iso">
                                            <Accordion.Header>📋 ISO 17020 სავალდებულო ფორმები</Accordion.Header>
                                            <Accordion.Body>

                                                {/* BE-FM-IMP-DECL — მიუკ. დეკლარაცია (სფეროები + კონფლიქტი) */}
                                                <div className="mb-4 border-bottom pb-4">
                                                    <h6 className="fw-bold text-primary mb-2">BE-FM-IMP-DECL — მიუკერძოებლობის დეკლარაცია <small className="text-muted fw-normal">(ინსპექტორის სფეროები)</small></h6>
                                                    <p className="small text-muted mb-2">ინსპექტორი ამოწმებს ავტ. სფეროებს და ადასტურებს ინტ. კონფ. არარსებობას.</p>

                                                    <Form.Label className="small fw-bold">ავტ. სფეროები (მონიშნეთ):</Form.Label>
                                                    <div className="mb-2">
                                                    {[
                                                        ['BE-PR-01', 'ხარჯთაღრ. შესაბამისობა'],
                                                        ['BE-PR-02', 'ფ.№2 ინსპექტირება'],
                                                        ['BE-PR-03', 'ფასწარმოქმნის ადეკვ.'],
                                                        ['BE-PR-04', 'ტექ. ზედამხედველობა'],
                                                    ].map(([code, label]) => (
                                                        <Form.Check key={code} type="checkbox"
                                                            label={`${code} — ${label}`}
                                                            checked={genScopes.includes(code)}
                                                            onChange={e => setGenScopes(s => e.target.checked ? [...s, code] : s.filter(x => x !== code))} />
                                                    ))}
                                                    </div>

                                                    <Form.Label className="small fw-bold">ინტ. კონფლიქტი:</Form.Label>
                                                    {[
                                                        ['ownership', 'მფლობელობითი ინტ. კლიენტის კომპ.'],
                                                        ['family',    'ნათ./ოჯახური კავშირი კლიენტთან'],
                                                        ['employment','ადრ. დასაქმება კლიენტთან (2 წ.)'],
                                                        ['financial', 'ფინ. დამოკ. ან ინტ. კლიენტთან'],
                                                        ['contract',  'სხვა მოქმ. ხელშ. ან ვალდ. კლიენტ.'],
                                                    ].map(([key, label]) => (
                                                        <div key={key} className="d-flex align-items-center gap-3 mb-1">
                                                            <span className="small flex-grow-1">{label}</span>
                                                            <Form.Check inline type="radio" label="კი" name={`gconf-${key}`}
                                                                checked={genConflicts[key] === true}
                                                                onChange={() => setGenConflicts(p => ({ ...p, [key]: true }))} />
                                                            <Form.Check inline type="radio" label="არა" name={`gconf-${key}`}
                                                                checked={genConflicts[key] !== true}
                                                                onChange={() => setGenConflicts(p => ({ ...p, [key]: false }))} />
                                                        </div>
                                                    ))}

                                                    <PDFDownloadLink document={<ImpartialityDeclarationPdf data={buildImpartialityDeclarationData()} />}
                                                        fileName={`FM-02_მიუკ_დეკ_${fname}.pdf`} className="btn btn-outline-primary btn-sm mt-2" style={{ textDecoration: 'none' }}>
                                                        {({ loading: l }) => l ? '...' : '📥 BE-FM-IMP-DECL — მიუკ. დეკლარაცია'}
                                                    </PDFDownloadLink>
                                                </div>

                                                {/* BE-FM-IMP-GEN — ზოგადი */}
                                                <div className="mb-4 border-bottom pb-4">
                                                    <h6 className="fw-bold text-primary mb-3">BE-FM-IMP-GEN — ზოგადი მიუკერძოებლობის დეკლარაცია <small className="text-muted fw-normal">(ახალი თანამშრომელი)</small></h6>
                                                    <p className="small text-muted mb-3">
                                                        თანამშრომელი ადასტურებს ინტერესთა კონფლიქტის არარსებობას და ვალდებულებას,
                                                        შეატყობინოს ნებისმიერი კონფლიქტის შემთხვევაში.
                                                    </p>

                                                    <PDFDownloadLink document={<ImpartialityGeneralPdf data={buildImpartialityGeneralData()} />}
                                                        fileName={`FM-02a_ზოგ_მიუკ_${fname}.pdf`} className="btn btn-outline-primary btn-sm mt-2" style={{ textDecoration: 'none' }}>
                                                        {({ loading: l }) => l ? '...' : '📥 BE-FM-IMP-GEN — ზოგადი მიუკერძოებლობის დეკლარაცია'}
                                                    </PDFDownloadLink>
                                                </div>

                                                {/* BE-FM-IMP-CHECK — საქმეზე მიბმული */}
                                                <div className="mb-4 border-bottom pb-4">
                                                    <h6 className="fw-bold text-primary mb-3">BE-FM-IMP-CHECK — მიუკერძოებლობის შეფასება <small className="text-muted fw-normal">(კონკრეტული საქმე)</small></h6>

                                                    <div className="d-flex gap-2 mb-3">
                                                        <Form.Control size="sm" placeholder="საქმის ნომერი (BX-INS-... ან IN-...)"
                                                            value={caseSearchNum} onChange={e => setCaseSearchNum(e.target.value)}
                                                            onKeyDown={e => e.key === 'Enter' && searchInspection()} />
                                                        <Button size="sm" variant="outline-secondary" onClick={searchInspection} disabled={caseSearching}>
                                                            {caseSearching ? '...' : '🔍 ძებნა'}
                                                        </Button>
                                                    </div>

                                                    {caseNotFound && <div className="alert alert-warning py-2 small">საქმე ვერ მოიძებნა</div>}

                                                    {foundCase && (
                                                        <div className="bg-light rounded p-3 mb-3 small">
                                                            <div className="fw-bold text-success mb-2">✅ საქმე მოიძებნა</div>
                                                            <div><strong>ინსპ. №:</strong> {foundCase.inspectionNumber}</div>
                                                            <div><strong>კლიენტი:</strong> {foundCase.clientName}</div>
                                                            <div><strong>ობიექტი:</strong> {foundCase.objectName}</div>
                                                            {foundCase.inspectionScope && <div><strong>სფერო:</strong> {foundCase.inspectionScope}</div>}
                                                        </div>
                                                    )}

                                                    <Form.Label className="small fw-bold">საქმე-სპეციფიური კონფლიქტის შეფასება:</Form.Label>
                                                    {[
                                                        ['acquainted', 'პირადად იცნობ კლიენტს/წარმომადგენელს?'],
                                                        ['employed', 'ნამსახურები ხარ კლიენტთან ბოლო 2 წელში?'],
                                                        ['financial', 'გაქვს ფინანსური ინტერესი ინსპ. შედეგში?'],
                                                        ['participated', 'მონაწილეობდი ობიექტის პროექტირებაში/მშენებლობაში?'],
                                                        ['other', 'სხვა ინტერესთა კონფლიქტი?'],
                                                    ].map(([key, label]) => (
                                                        <div key={key} className="d-flex align-items-center gap-3 mb-1">
                                                            <span className="small flex-grow-1">{label}</span>
                                                            <Form.Check inline type="radio" label="კი" name={`case-${key}`}
                                                                checked={caseConflicts[key] === true}
                                                                onChange={() => setCaseConflicts(p => ({ ...p, [key]: true }))} />
                                                            <Form.Check inline type="radio" label="არა" name={`case-${key}`}
                                                                checked={caseConflicts[key] === false}
                                                                onChange={() => setCaseConflicts(p => ({ ...p, [key]: false }))} />
                                                        </div>
                                                    ))}

                                                    <Form.Label className="small fw-bold mt-3">დასკვნა:</Form.Label>
                                                    <div className="d-flex gap-4 mb-3">
                                                        <Form.Check type="radio" name="conclusion" id="conc-clear"
                                                            label="კონფლიქტი არ არის — ინსპ. შეიძლება"
                                                            checked={caseConclusion === 'clear'} onChange={() => setCaseConclusion('clear')} />
                                                        <Form.Check type="radio" name="conclusion" id="conc-conflict"
                                                            label="კონფლიქტი გამოვლინდა — ვერ ჩავატარებ"
                                                            checked={caseConclusion === 'conflict'} onChange={() => setCaseConclusion('conflict')} />
                                                    </div>

                                                    {!foundCase ? (
                                                        <Button variant="outline-danger" size="sm" disabled>🔍 ჯერ მიუთითეთ საქმის ნომერი</Button>
                                                    ) : (
                                                        <PDFDownloadLink document={<ImpartialityPerCasePdf data={buildImpartialityPerCaseData()} />}
                                                            fileName={`FM-02b_${foundCase.inspectionNumber}_${fname}.pdf`} className="btn btn-outline-danger btn-sm" style={{ textDecoration: 'none' }}>
                                                            {({ loading: l }) => l ? '...' : '📥 BE-FM-IMP-CHECK — საქმის მიუკერძოებლობის შეფასება'}
                                                        </PDFDownloadLink>
                                                    )}
                                                </div>

                                                {/* BE-FM-CONF */}
                                                <div>
                                                    <h6 className="fw-bold text-primary border-bottom pb-1 mb-3">BE-FM-CONF — კონფიდენციალურობის შეთანხმება</h6>
                                                    <p className="text-muted small mb-3">ავტომატურად ივსება პირადი საქმის მონაცემებით. ხელმოწერის შეყვანის შემდეგ PDF-ში ჩაიდება.</p>
                                                    <PDFDownloadLink
                                                        document={<ConfidentialityAgreementPdf data={buildConfidentialityData()} />}
                                                        fileName={`FM-03_კონფ_შეთ_${fname}.pdf`}
                                                        className="btn btn-outline-primary btn-sm"
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        {({ loading: l }) => l ? '...' : '📥 BE-FM-CONF — კონფიდენციალურობის შეთანხმება'}
                                                    </PDFDownloadLink>
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>

                                        {/* === ბრძანება / ხელშეკრულება === */}
                                        <Accordion.Item eventKey="hr">
                                            <Accordion.Header>📑 HR დოკუმენტები (ბრძანება / ხელშეკრულება)</Accordion.Header>
                                            <Accordion.Body>
                                                <Row className="g-3 mb-3">
                                                    <Col md={6}>
                                                        <Form.Label className="small fw-bold">დაწყების თარიღი</Form.Label>
                                                        <Form.Control type="date" size="sm" value={startDate} onChange={e => setStartDate(e.target.value)} />
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Label className="small fw-bold">ხელფასი (ლარი)</Form.Label>
                                                        <Form.Control type="number" size="sm" value={salary} onChange={e => setSalary(e.target.value)} placeholder="მაგ: 1500" />
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Label className="small fw-bold">ხელშეკრ. №</Form.Label>
                                                        <Form.Control size="sm" value={contractNumber} onChange={e => setContractNumber(e.target.value)} />
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Label className="small fw-bold">მისამართი</Form.Label>
                                                        <Form.Control size="sm" value={address} onChange={e => setAddress(e.target.value)} placeholder="ფაქტობრივი მისამართი" />
                                                    </Col>
                                                </Row>
                                                <div className="d-flex flex-wrap gap-3">
                                                    {startDate && (
                                                        <div className="d-flex gap-2 flex-wrap">
                                                            <PDFDownloadLink document={<DirectorsOrderPdf data={{ ...buildOrderData(), withSignature: false }} />} fileName={`დანიშვნ_ბრძ_${fname}.pdf`} className="btn btn-outline-success btn-sm" style={{ textDecoration: 'none' }}>
                                                                {({ loading: l }) => l ? '...' : '📥 დანიშვნის ბრძანება'}
                                                            </PDFDownloadLink>
                                                            <PDFDownloadLink document={<DirectorsOrderPdf data={{ ...buildOrderData(), withSignature: true }} />} fileName={`signed-დანიშვნ_ბრძ_${fname}.pdf`} className="btn btn-outline-secondary btn-sm" style={{ textDecoration: 'none' }}>
                                                                {({ loading: l }) => l ? '...' : '✍️ ხელმოწ.'}
                                                            </PDFDownloadLink>
                                                        </div>
                                                    )}
                                                    {startDate && contractNumber && (
                                                        <div className="d-flex gap-2 flex-wrap">
                                                            <PDFDownloadLink document={<LaborContractPdf data={{ ...buildContractData(), withSignature: false }} />} fileName={`ხელშეკრ_${fname}.pdf`} className="btn btn-outline-primary btn-sm" style={{ textDecoration: 'none' }}>
                                                                {({ loading: l }) => l ? '...' : '📥 შრომითი ხელშეკრულება'}
                                                            </PDFDownloadLink>
                                                            <PDFDownloadLink document={<LaborContractPdf data={{ ...buildContractData(), withSignature: true }} />} fileName={`signed-ხელშეკრ_${fname}.pdf`} className="btn btn-outline-secondary btn-sm" style={{ textDecoration: 'none' }}>
                                                                {({ loading: l }) => l ? '...' : '✍️ ხელმოწ.'}
                                                            </PDFDownloadLink>
                                                        </div>
                                                    )}
                                                    {!startDate && <p className="text-muted small">შეავსეთ „დაწყების თარიღი"</p>}
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>

                                        {/* === ტრენინგის ჩანაწერი === */}
                                        <Accordion.Item eventKey="training">
                                            <Accordion.Header>🎓 BE-FM-TRAIN — ტრენინგის ჩანაწერი</Accordion.Header>
                                            <Accordion.Body>
                                                <Row className="g-3 mb-3">
                                                    <Col md={6}>
                                                        <Form.Label className="small fw-bold">ტრენინგის თარიღი</Form.Label>
                                                        <Form.Control type="date" size="sm" value={trainingDate} onChange={e => setTrainingDate(e.target.value)} />
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Label className="small fw-bold">ხანგრძლივობა (სთ)</Form.Label>
                                                        <Form.Control type="number" size="sm" value={duration} onChange={e => setDuration(e.target.value)} placeholder="მაგ: 4" />
                                                    </Col>
                                                    <Col md={12}>
                                                        <Form.Label className="small fw-bold">ტრენინგის ტიპი</Form.Label>
                                                        <div className="d-flex flex-wrap gap-3">
                                                            {trainingTypeOptions.map(([key, label]) => (
                                                                <Form.Check key={key} type="radio" name="trainingType"
                                                                    id={`tt-${key}`} label={label}
                                                                    checked={trainingType === key}
                                                                    onChange={() => setTrainingType(key)} />
                                                            ))}
                                                        </div>
                                                    </Col>
                                                    <Col md={12}>
                                                        <Form.Label className="small fw-bold">თემა / სათაური</Form.Label>
                                                        <Form.Control size="sm" value={topic} onChange={e => setTopic(e.target.value)} placeholder="ტრენინგის თემა" />
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Label className="small fw-bold">ტრენერი / ორგანიზატორი</Form.Label>
                                                        <Form.Control size="sm" value={trainer} onChange={e => setTrainer(e.target.value)} placeholder="სახელი / ორგ. დასახელება" />
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Label className="small fw-bold">ადგილი</Form.Label>
                                                        <Form.Control size="sm" value={trainingLocation} onChange={e => setTrainingLocation(e.target.value)} />
                                                    </Col>
                                                    <Col md={12}>
                                                        <Form.Label className="small fw-bold">შეფასების მეთოდი (შეიძლება რამდენიმე)</Form.Label>
                                                        <div className="d-flex flex-wrap gap-3">
                                                            {methodOptions.map(([key, label]) => (
                                                                <Form.Check key={key} type="checkbox" id={`am-${key}`} label={label}
                                                                    checked={assessmentMethods.includes(key)}
                                                                    onChange={() => toggleAssessmentMethod(key)} />
                                                            ))}
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Label className="small fw-bold">შეფასების შედეგი</Form.Label>
                                                        <div className="d-flex gap-4">
                                                            <Form.Check type="radio" name="aresult" id="ar-comp" label="კომპეტენტური"
                                                                checked={assessmentResult === 'კომპეტენტური'} onChange={() => setAssessmentResult('კომპეტენტური')} />
                                                            <Form.Check type="radio" name="aresult" id="ar-cont" label="ტრენინგი გრძელდება"
                                                                checked={assessmentResult === 'გრძელდება'} onChange={() => setAssessmentResult('გრძელდება')} />
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Label className="small fw-bold">ავტორიზებულია</Form.Label>
                                                        <div className="d-flex gap-4">
                                                            <Form.Check type="radio" name="auth" id="auth-yes" label="კი"
                                                                checked={authorized === true} onChange={() => setAuthorized(true)} />
                                                            <Form.Check type="radio" name="auth" id="auth-no" label="არა"
                                                                checked={authorized === false} onChange={() => setAuthorized(false)} />
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Label className="small fw-bold">შემდეგი ტრენინგის თარიღი</Form.Label>
                                                        <Form.Control type="date" size="sm" value={nextTrainingDate} onChange={e => setNextTrainingDate(e.target.value)} />
                                                    </Col>
                                                </Row>
                                                <PDFDownloadLink
                                                    document={<TrainingRecordPdf data={buildTrainingData()} />}
                                                    fileName={`FM-13_ტრენ_ჩანაწ_${fname}.pdf`}
                                                    className="btn btn-outline-success btn-sm"
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    {({ loading: l }) => l ? '...' : '📥 BE-FM-TRAIN — ტრენინგის ჩანაწერი'}
                                                </PDFDownloadLink>
                                            </Accordion.Body>
                                        </Accordion.Item>

                                    </Accordion>
                                </Card>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Col>
            </Row>

            {/* Status Modal */}
            <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>სტატუსის შეცვლა</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                        <option value="აქტიური">აქტიური</option>
                        <option value="შვებულებაში">შვებულებაში</option>
                        <option value="გათავისუფლებული">გათავისუფლებული</option>
                    </Form.Select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowStatusModal(false)}>დახურვა</Button>
                    <Button variant="primary" onClick={handleStatusChange}>შენახვა</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default StaffDetails;
