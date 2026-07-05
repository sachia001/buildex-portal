import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, confirmDialog } from '../components/Feedback';

// წაშლილი ჩანაწერების არქივი (soft-delete / ISO §8.4 retention) — მხოლოდ ადმინი.
// ფიზიკური წაშლა მხოლოდ retention-ვადის ამოწურვის შემდეგ (purge-expired).
const RESOURCE_LABELS = {
    inspection:        '📂 ინსპექტირების საქმეები',
    user:              '👥 პერსონალი',
    equipment:         '🔧 აღჭურვილობა',
    management_review: '📈 მართვის ანალიზი',
    complaint:         '📨 საჩივრები',
    internal_audit:    '🔍 შიდა აუდიტები',
    corrective_action: '⚙️ მაკორექტირებელი ქმედებები',
    insurance:         '🛡️ დაზღვევა',
    company_doc:       '🏢 კომპანიის დოკუმენტები',
    procedure:         '📑 პროცედურები',
    checklist:         '✅ ჩეკლისტები',
    price_adequacy:    '📊 ფას-ადეკვატურობა',
    filled_form:       '📋 შევსებული ფორმები',
    auth_user:         '🔑 მომხმარებლის ანგარიშები',
};

const TrashPage = () => {
    const [trash, setTrash] = useState({});
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState('');

    const fetchTrash = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/trash');
            setTrash(res.data || {});
        } catch (err) {
            toast(err.response?.data?.error || 'არქივის ჩატვირთვა ვერ მოხერხდა', 'danger');
        }
        setLoading(false);
    };

    useEffect(() => { fetchTrash(); }, []);

    const restore = async (resource, id, name) => {
        if (!(await confirmDialog(`აღდგეს „${name}"?`))) return;
        setBusy(id);
        try {
            await axios.post(`/api/admin/restore/${resource}/${id}`);
            toast('✅ ჩანაწერი აღდგა', 'success');
            fetchTrash();
        } catch (err) { toast(err.response?.data?.error || 'აღდგენა ვერ მოხერხდა', 'danger'); }
        setBusy('');
    };

    const purge = async () => {
        if (!(await confirmDialog('ფიზიკურად წაიშალოს ყველა ჩანაწერი, რომლის შენახვის ვადაც (6–10 წელი) ამოიწურა? ეს მოქმედება შეუქცევადია!'))) return;
        setBusy('purge');
        try {
            const res = await axios.post('/api/admin/purge-expired');
            toast(`✅ წაიშალა ${res.data.purged} ვადაგასული ჩანაწერი`, 'success');
            fetchTrash();
        } catch (err) { toast(err.response?.data?.error || 'შეცდომა', 'danger'); }
        setBusy('');
    };

    const resources = Object.keys(trash).filter(k => trash[k]?.length);
    const total = resources.reduce((s, k) => s + trash[k].length, 0);

    return (
        <Container className="mt-4 font-georgian pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-dark">🗄️ არქივი — წაშლილი ჩანაწერები</h3>
                    <span className="text-muted small">ISO/IEC 17020 §8.4 — ჩანაწერები ინახება retention-ვადით (6–10 წ.); წაშლა = მონიშვნა, აღდგენა ნებისმიერ დროს</span>
                </div>
                <div className="d-flex gap-2">
                    <Button as={Link} to="/" variant="secondary">← მთავარი</Button>
                    <Button variant="outline-danger" disabled={busy === 'purge'} onClick={purge}>
                        {busy === 'purge' ? '⏳' : '🧹 ვადაგასულების წმენდა'}
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5"><Spinner animation="border" /></div>
            ) : total === 0 ? (
                <Card className="shadow-sm border-0 text-center py-5 text-muted">არქივი ცარიელია — წაშლილი ჩანაწერები არ არის</Card>
            ) : resources.map(resource => (
                <Card key={resource} className="shadow-sm border-0 mb-3">
                    <Card.Header className="bg-white py-2 d-flex justify-content-between">
                        <strong>{RESOURCE_LABELS[resource] || resource}</strong>
                        <Badge bg="secondary">{trash[resource].length}</Badge>
                    </Card.Header>
                    <Table hover size="sm" className="mb-0 align-middle">
                        <tbody>
                            {trash[resource].map(item => (
                                <tr key={item._id}>
                                    <td className="ps-3">{item.name || item._id}</td>
                                    <td className="small text-muted">
                                        წაიშალა: {item.deletedAt ? new Date(item.deletedAt).toLocaleString('ka-GE') : '—'}
                                        {item.deletedBy ? ` · ${item.deletedBy}` : ''}
                                    </td>
                                    <td className="text-end pe-3" style={{ width: 130 }}>
                                        <Button size="sm" variant="outline-success" disabled={busy === item._id}
                                            onClick={() => restore(resource, item._id, item.name)}>
                                            ♻️ აღდგენა
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            ))}
        </Container>
    );
};

export default TrashPage;
