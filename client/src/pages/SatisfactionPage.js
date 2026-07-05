// მომხმარებლის კმაყოფილების ჟურნალი — BE-FM-SATISF
import React from 'react';
import { Badge } from 'react-bootstrap';
import RegistryPage from '../components/RegistryPage';

const avg = (i) => {
    const s = [i.scoreQuality, i.scoreTimeliness, i.scoreCommunication].map(Number).filter(x => x > 0);
    return s.length ? (s.reduce((a, b) => a + b, 0) / s.length).toFixed(1) : '—';
};

const SatisfactionPage = ({ role }) => (
    <RegistryPage
        title="😊 მომხმარებლის კმაყოფილება"
        isoRef="BE-FM-SATISF — კმაყოფილების კვლევის ჩანაწერები (1–5 შკალა)"
        api="/api/satisfaction"
        canWrite={['admin', 'quality_manager', 'chancellor'].includes(role)}
        addLabel="+ ახალი გამოკითხვა"
        emptyForm={{ clientName: '', caseNumber: '', surveyDate: '', scoreQuality: 5, scoreTimeliness: 5, scoreCommunication: 5, comments: '', followUp: '' }}
        fields={[
            { name: 'clientName', label: 'დამკვეთი', required: true },
            { name: 'caseNumber', label: 'საქმის № (BX-INS-...)' },
            { name: 'surveyDate', label: 'გამოკითხვის თარიღი', type: 'date' },
            { name: 'scoreQuality', label: 'ხარისხი (1–5)', type: 'number', md: 3 },
            { name: 'scoreTimeliness', label: 'ვადები (1–5)', type: 'number', md: 3 },
            { name: 'scoreCommunication', label: 'კომუნიკაცია (1–5)', type: 'number', md: 3 },
            { name: 'comments', label: 'კომენტარი', type: 'textarea', md: 12 },
            { name: 'followUp', label: 'რეაგირება (საჭიროებისას)', type: 'textarea', md: 12 },
        ]}
        columns={[
            { label: 'დამკვეთი', render: i => <><div className="fw-bold">{i.clientName}</div><small className="text-muted">{i.caseNumber}</small></> },
            { label: 'თარიღი', render: i => i.surveyDate ? new Date(i.surveyDate).toLocaleDateString('ka-GE') : '—' },
            { label: 'საშ. ქულა', render: i => <Badge bg={avg(i) >= 4 ? 'success' : avg(i) >= 3 ? 'warning' : 'danger'} text={avg(i) >= 3 && avg(i) < 4 ? 'dark' : undefined}>{avg(i)}</Badge> },
            { label: 'კომენტარი', render: i => (i.comments || '—').slice(0, 70) },
        ]}
    />
);

export default SatisfactionPage;
