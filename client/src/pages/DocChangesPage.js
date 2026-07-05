// დოკუმენტების ცვლილებების რეესტრი (DCR) — ISO §8.3 / BE-PR-04 / BE-FM-CHANGE-INIT + CHANGE-REG
import React from 'react';
import RegistryPage, { StatusBadge } from '../components/RegistryPage';

const STATUS_MAP = { 'წარდგენილი': 'info', 'დამტკიცებული': 'primary', 'უარყოფილი': 'secondary', 'დანერგილი': 'success' };

const DocChangesPage = ({ role }) => (
    <RegistryPage
        title="✍️ დოკუმენტების ცვლილებები (DCR)"
        isoRef="ISO/IEC 17020:2012 — §8.3 დოკუმენტების კონტროლი | ინიცირება → დამტკიცება → დანერგვა"
        api="/api/doc-changes"
        canWrite={['admin', 'quality_manager'].includes(role)}
        addLabel="+ ცვლილების ინიცირება"
        emptyForm={{ docCode: '', initiator: '', description: '', reason: '', status: 'წარდგენილი', approvedBy: '', approvedDate: '', implementedDate: '' }}
        fields={[
            { name: 'docCode', label: 'დოკუმენტის კოდი', required: true, placeholder: 'მაგ: BE-PR-04, HR-JD-002, QM-01' },
            { name: 'initiator', label: 'ინიციატორი' },
            { name: 'description', label: 'რა იცვლება (ზუსტი ადგილი და ტექსტი)', type: 'textarea', required: true, md: 12, rows: 3 },
            { name: 'reason', label: 'ცვლილების საფუძველი', type: 'textarea', md: 12 },
            { name: 'status', label: 'სტატუსი', type: 'select', options: ['წარდგენილი', 'დამტკიცებული', 'უარყოფილი', 'დანერგილი'] },
            { name: 'approvedBy', label: 'დამამტკიცებელი' },
            { name: 'approvedDate', label: 'დამტკიცების თარიღი', type: 'date', md: 3 },
            { name: 'implementedDate', label: 'დანერგვის თარიღი', type: 'date', md: 3 },
        ]}
        columns={[
            { label: 'DCR №', render: i => <span className="fw-bold font-monospace">{i.dcrNumber}</span> },
            { label: 'დოკუმენტი', render: i => <span className="fw-bold">{i.docCode}</span> },
            { label: 'აღწერა', render: i => (i.description || '').slice(0, 80) + ((i.description || '').length > 80 ? '…' : '') },
            { label: 'ინიციატორი', render: i => i.initiator || '—' },
            { label: 'სტატუსი', render: i => <StatusBadge value={i.status} map={STATUS_MAP} /> },
        ]}
    />
);

export default DocChangesPage;
