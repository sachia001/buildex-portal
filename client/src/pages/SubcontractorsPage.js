// ქვეკონტრაქტორების რეესტრი — ISO/IEC 17020 §6.3 / BE-PR-14 / BE-FM-SUB-MONITOR
import React from 'react';
import RegistryPage, { StatusBadge } from '../components/RegistryPage';

const STATUS_MAP = { 'მოწონებული': 'success', 'შეჩერებული': 'warning', 'ამოღებული': 'secondary' };

const SubcontractorsPage = ({ role }) => (
    <RegistryPage
        title="🔗 ქვეკონტრაქტორების რეესტრი"
        isoRef="ISO/IEC 17020:2012 — §6.3 / BE-PR-14 ქვეკონტრაქტირების მართვა"
        api="/api/subcontractors"
        canWrite={['admin', 'quality_manager', 'tech_manager'].includes(role)}
        emptyForm={{ name: '', identification: '', scope: '', competenceEvidence: '', contractRef: '', evaluationDate: '', evaluationResult: '', status: 'მოწონებული', notes: '' }}
        fields={[
            { name: 'name', label: 'დასახელება', required: true },
            { name: 'identification', label: 'ს/კ' },
            { name: 'scope', label: 'დაშვებული სამუშაოს სფერო', md: 12 },
            { name: 'competenceEvidence', label: 'კომპეტენციის დადასტურება (აკრედიტაცია/სერტიფიკატი)', type: 'textarea', md: 12 },
            { name: 'contractRef', label: 'ხელშეკრულების №' },
            { name: 'evaluationDate', label: 'შეფასების თარიღი (BE-FM-SUB-MONITOR)', type: 'date' },
            { name: 'evaluationResult', label: 'შეფასების შედეგი', type: 'textarea', md: 12 },
            { name: 'status', label: 'სტატუსი', type: 'select', options: ['მოწონებული', 'შეჩერებული', 'ამოღებული'] },
            { name: 'notes', label: 'შენიშვნა' },
        ]}
        columns={[
            { label: 'დასახელება', render: i => <><div className="fw-bold">{i.name}</div><small className="text-muted">{i.identification}</small></> },
            { label: 'სფერო', render: i => <span style={{ maxWidth: 250, display: 'inline-block' }}>{i.scope}</span> },
            { label: 'შეფასება', render: i => i.evaluationDate ? new Date(i.evaluationDate).toLocaleDateString('ka-GE') : '—' },
            { label: 'სტატუსი', render: i => <StatusBadge value={i.status} map={STATUS_MAP} /> },
        ]}
    />
);

export default SubcontractorsPage;
