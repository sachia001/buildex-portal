// მიუკერძოებლობის დაცვის კომიტეტის სხდომების ჟურნალი — ISO §4.1 / BE-FM-IMP-COMMITTEE (OBS-02)
import React from 'react';
import RegistryPage from '../components/RegistryPage';

const ImpartialityCommitteePage = ({ role }) => (
    <RegistryPage
        title="🏛️ მიუკერძოებლობის კომიტეტი"
        isoRef="ISO/IEC 17020:2012 — §4.1 / BE-POL-01 / BE-FM-IMP-COMMITTEE — სხდომების ოქმები"
        api="/api/impartiality-meetings"
        canWrite={['admin', 'quality_manager'].includes(role)}
        addLabel="+ ახალი სხდომის ოქმი"
        emptyForm={{ meetingDate: '', participants: '', agenda: '', risksReviewed: '', decisions: '', nextMeeting: '' }}
        fields={[
            { name: 'meetingDate', label: 'სხდომის თარიღი', type: 'date', required: true },
            { name: 'nextMeeting', label: 'შემდეგი სხდომა (გეგმური)', type: 'date' },
            { name: 'participants', label: 'მონაწილეები', required: true, md: 12, placeholder: 'სახელი, გვარი (როლი); ...' },
            { name: 'agenda', label: 'დღის წესრიგი', type: 'textarea', md: 12 },
            { name: 'risksReviewed', label: 'განხილული მიუკერძოებლობის რისკები / დეკლარაციები', type: 'textarea', md: 12 },
            { name: 'decisions', label: 'გადაწყვეტილებები', type: 'textarea', md: 12 },
        ]}
        columns={[
            { label: '№', render: i => <span className="fw-bold font-monospace">{i.meetingNumber}</span> },
            { label: 'თარიღი', render: i => i.meetingDate ? new Date(i.meetingDate).toLocaleDateString('ka-GE') : '—' },
            { label: 'მონაწილეები', render: i => i.participants },
            { label: 'გადაწყვეტილებები', render: i => (i.decisions || '—').slice(0, 80) + ((i.decisions || '').length > 80 ? '…' : '') },
        ]}
    />
);

export default ImpartialityCommitteePage;
