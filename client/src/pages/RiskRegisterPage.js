// რისკების რეესტრი — RM-01 (მიუკერძოებლობის და საოპერაციო რისკები, 5×5 მატრიცა)
import React from 'react';
import { Badge } from 'react-bootstrap';
import RegistryPage, { StatusBadge } from '../components/RegistryPage';

const STATUS_MAP = { 'ღია': 'danger', 'კონტროლდება': 'warning', 'დახურული': 'success' };

const ScoreBadge = ({ l, i }) => {
    const score = (Number(l) || 0) * (Number(i) || 0);
    const bg = score >= 15 ? 'danger' : score >= 8 ? 'warning' : 'success';
    return <Badge bg={bg} text={bg === 'warning' ? 'dark' : undefined}>{score}</Badge>;
};

const RiskRegisterPage = ({ role }) => (
    <RegistryPage
        title="⚠️ რისკების რეესტრი (RM-01)"
        isoRef="ISO/IEC 17020:2012 — §4.1.3/§4.1.4 მიუკერძოებლობის რისკები + საოპერაციო რისკები | ქულა = ალბათობა × გავლენა"
        api="/api/risks"
        canWrite={['admin', 'quality_manager'].includes(role)}
        addLabel="+ ახალი რისკი"
        emptyForm={{ category: 'მიუკერძოებლობა', description: '', likelihood: 3, impact: 3, mitigation: '', owner: '', reviewDate: '', status: 'ღია' }}
        fields={[
            { name: 'category', label: 'კატეგორია', type: 'select', options: ['მიუკერძოებლობა', 'საოპერაციო', 'IT/მონაცემები', 'ფინანსური', 'პერსონალი'] },
            { name: 'status', label: 'სტატუსი', type: 'select', options: ['ღია', 'კონტროლდება', 'დახურული'] },
            { name: 'description', label: 'რისკის აღწერა', type: 'textarea', required: true, md: 12 },
            { name: 'likelihood', label: 'ალბათობა (1–5)', type: 'number', md: 3 },
            { name: 'impact', label: 'გავლენა (1–5)', type: 'number', md: 3 },
            { name: 'owner', label: 'პასუხისმგებელი', md: 6 },
            { name: 'mitigation', label: 'შემარბილებელი ღონისძიებები', type: 'textarea', md: 12 },
            { name: 'reviewDate', label: 'გადახედვის თარიღი', type: 'date' },
        ]}
        columns={[
            { label: 'კატეგორია', render: i => <Badge bg="secondary">{i.category}</Badge> },
            { label: 'აღწერა', render: i => (i.description || '').slice(0, 90) + ((i.description || '').length > 90 ? '…' : '') },
            { label: 'ქულა', render: i => <ScoreBadge l={i.likelihood} i={i.impact} /> },
            { label: 'პასუხისმგებელი', render: i => i.owner || '—' },
            { label: 'სტატუსი', render: i => <StatusBadge value={i.status} map={STATUS_MAP} /> },
        ]}
    />
);

export default RiskRegisterPage;
