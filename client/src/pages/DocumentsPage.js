import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PdfDownloadButton from '../components/PdfDownloadButton';

// ── ერთიანი ფორმა-სისტემა: newFormDefinitions → GenericFormPdf + FormFillModal ──
// (ლეგასი FM-xx ბარათები მოხსნილია — ყველა ფორმა ეტალონური განსაზღვრებიდან იგება)
import BlankLetterhead from '../pdf-components/BlankLetterhead';
import GenericFormPdf from '../pdf-components/GenericFormPdf';
import FormFillModal from '../components/FormFillModal';
import { FORM_CONFIGS } from '../components/formConfigs';
import NEW_FORMS from '../components/newFormDefinitions.json';
import { newFormToConfig } from '../utils/newFormToConfig';
import { downloadWordDoc } from '../utils/wordDocGenerator';

// row → wordGenerator field კონვერტერი
const rowToField = (r) => {
  if (typeof r === 'string') return { type: 'note', label: r };
  const [type, a, b] = r;
  switch (type) {
    case 'field':   return { type: 'text',     label: a };
    case 'field2':  return { type: 'field2',   label1: a, label2: b };
    case 'area':    return { type: 'textarea', label: a };
    case 'yesno':   return { type: 'yesno',    label: a };
    case 'check':   return { type: 'check',    label: a };
    case 'bullet':  return { type: 'bullet',   label: a };
    case 'note':    return { type: 'note',     label: a };
    case 'table':   return { type: 'table',    columns: a.cols, widths: a.widths, rows: a.rows || [] };
    default:        return { type: 'text',     label: String(a || '') };
  }
};

const formToWordSections = (form) =>
  (form.sections || []).map((sec) => ({
    label: sec.h || '',
    fields: (sec.rows || []).map(rowToField),
  }));

// ფორმის ბარათი — შევსება (შენახვით) + PDF + Word
const FormCard = ({ form, color = 'info' }) => {
  const [showFill, setShowFill] = useState(false);
  const fileName = `${form.code} — ${form.title}`;
  const fillCfg = newFormToConfig(form);
  const hasFill = fillCfg && fillCfg.sections.length > 0;
  const handleWord = () => downloadWordDoc({
    title: form.title, code: form.code, fileName,
    sections: formToWordSections(form), signers: form.signers, isoRef: form.isoRef,
  });
  return (
    <Col xl={2} lg={3} md={4} sm={6}>
      <Card className="h-100 shadow-sm border-0" style={{ borderTop: `3px solid var(--bs-${color})` }}>
        <Card.Body className="d-flex flex-column p-2 text-center">
          <Badge bg={color} className="mb-1 mx-auto" style={{ fontSize: '0.6rem' }}>{form.code}</Badge>
          <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.78rem', lineHeight: 1.3 }}>{form.title}</div>
          <p className="text-muted mb-2 flex-grow-1" style={{ fontSize: '0.62rem' }}>{form.isoRef}</p>
          <div className="d-flex flex-column gap-1">
            {hasFill && (
              <Button variant={color} size="sm" className="w-100 fw-bold"
                style={{ fontSize: '0.68rem', padding: '3px 5px' }} onClick={() => setShowFill(true)}>
                📝 შევსება
              </Button>
            )}
            <PdfDownloadButton
              document={<GenericFormPdf form={form} />}
              fileName={fileName}
              className={`btn btn-outline-${color} btn-sm w-100 fw-bold`}
              style={{ fontSize: '0.68rem', padding: '3px 5px', textDecoration: 'none' }}
              label="📄 PDF" />
            <Button variant="outline-secondary" size="sm" className="w-100 fw-bold"
              style={{ fontSize: '0.68rem', padding: '3px 5px' }} onClick={handleWord}>
              📝 Word
            </Button>
          </div>
        </Card.Body>
      </Card>
      {showFill && (
        <FormFillModal
          show={showFill}
          onHide={() => setShowFill(false)}
          config={fillCfg}
          pdfComponent={<GenericFormPdf form={form} />}
          pdfFileName={fileName}
          formCode={form.code}
        />
      )}
    </Col>
  );
};

// ბლანკის ბარათი (შიდა გენერატორი — არ არის BE-FM ფორმა)
const BlankCard = () => {
  const [showFill, setShowFill] = useState(false);
  const cfg = FORM_CONFIGS['BLANK'];
  return (
    <Col xl={2} lg={3} md={4} sm={6}>
      <Card className="h-100 shadow-sm border-0" style={{ borderTop: '3px solid var(--bs-primary)' }}>
        <Card.Body className="d-flex flex-column p-2 text-center">
          <div className="fs-3 mb-1">📄</div>
          <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.78rem' }}>ოფიციალური ბლანკი</div>
          <p className="text-muted mb-2 flex-grow-1" style={{ fontSize: '0.62rem' }}>გამავალი წერილები და შიდა ბრძანებები</p>
          <div className="d-flex flex-column gap-1">
            {cfg && (
              <Button variant="primary" size="sm" className="w-100 fw-bold"
                style={{ fontSize: '0.68rem', padding: '3px 5px' }} onClick={() => setShowFill(true)}>
                📝 შევსება
              </Button>
            )}
            <PdfDownloadButton document={<BlankLetterhead />} fileName="ბილდექს_ბლანკი"
              className="btn btn-outline-primary btn-sm w-100 fw-bold"
              style={{ fontSize: '0.68rem', padding: '3px 5px', textDecoration: 'none' }} label="📄 PDF" />
          </div>
        </Card.Body>
      </Card>
      {showFill && cfg && (
        <FormFillModal show={showFill} onHide={() => setShowFill(false)} config={cfg}
          pdfComponent={<BlankLetterhead />} pdfFileName="ბილდექს_ბლანკი" formCode="BLANK" />
      )}
    </Col>
  );
};

// გენერატორის ბმულ-ბარათი
const LinkCard = ({ icon, title, desc, to }) => (
  <Col xl={2} lg={3} md={4} sm={6}>
    <Card className="h-100 shadow-sm border-0" style={{ borderTop: '3px solid var(--bs-primary)' }}>
      <Card.Body className="d-flex flex-column p-2 text-center">
        <div className="fs-3 mb-1">{icon}</div>
        <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.78rem' }}>{title}</div>
        <p className="text-muted mb-2 flex-grow-1" style={{ fontSize: '0.62rem' }}>{desc}</p>
        <Button as={Link} to={to} variant="primary" size="sm" className="w-100 fw-bold" style={{ fontSize: '0.68rem' }}>
          ⚙️ შექმნა
        </Button>
      </Card.Body>
    </Card>
  </Col>
);

const SectionTitle = ({ icon, title, color = '#003366' }) => (
  <div className="d-flex align-items-center mb-3 mt-4">
    <div style={{ fontSize: '1.3rem', marginRight: 8 }}>{icon}</div>
    <h6 className="fw-bold m-0" style={{ color }}>{title}</h6>
    <div style={{ flex: 1, height: 1, backgroundColor: color, opacity: 0.2, marginLeft: 10 }} />
  </div>
);

// ── დაჯგუფება — ეტალონის 08-ფოლდერის სტრუქტურის იდენტური ──
const GROUPS = [
  { icon: '🔍', title: 'ინსპექტირების ფორმები', color: '#0d6efd', variant: 'info', codes: [
    'BE-FM-APP', 'BE-FM-REG', 'BE-FM-ACK', 'BE-FM-SCREEN', 'BE-FM-EST', 'BE-FM-OFFER',
    'BE-FM-CONTRACT-REVIEW', 'BE-FM-CONTRACT', 'BE-FM-CONTRACT-REGISTRY', 'BE-FM-DECLINE',
    'BE-FM-DOC-REQ', 'BE-FM-DOC-CHECK', 'BE-FM-NORM-PROFILE', 'BE-FM-ORD', 'BE-FM-NOTIFY',
    'BE-FM-PLAN', 'BE-FM-VISIT', 'BE-FM-FIELD-LOG', 'BE-FM-MEASURE', 'BE-FM-OBSERVATION',
    'BE-FM-PHOTO-LOG', 'BE-FM-COMPARE', 'BE-FM-CALC', 'BE-FM-NORM-CHECK', 'BE-FM-FINDING',
    'BE-FM-IR', 'BE-FM-TECH-REVIEW', 'BE-FM-QM-CHECK', 'BE-FM-DELIVERY-LETTER',
    'BE-FM-ACCEPT-ACT', 'BE-FM-IR-REGISTRY', 'BE-FM-INSP-REG',
  ]},
  { icon: '👥', title: 'პერსონალი და კომპეტენცია', color: '#7c3aed', variant: 'primary', codes: [
    'BE-FM-COMP', 'BE-FM-COMP-CHECK', 'BE-FM-CONF', 'BE-FM-TRAIN',
    'BE-FM-IMP-DECL', 'BE-FM-IMP-GEN', 'BE-FM-IMP-CHECK', 'BE-FM-IMP-RISK', 'BE-FM-IMP-COMMITTEE',
  ]},
  { icon: '🛠️', title: 'მოწყობილობა და ქვეკონტრაქტირება', color: '#0891b2', variant: 'success', codes: [
    'BE-FM-EQ-CARD', 'BE-FM-EQ-CHECK', 'BE-FM-SUB-MONITOR',
  ]},
  { icon: '🔎', title: 'შიდა აუდიტი', color: '#b45309', variant: 'warning', codes: [
    'BE-FM-AUDIT-PROGRAM', 'BE-FM-AUDIT-PLAN', 'BE-FM-AUDIT-CHECK',
    'BE-FM-AUDIT-REPORT', 'BE-FM-AUDIT-NC', 'BE-FM-AUDIT-MEETING',
  ]},
  { icon: '📈', title: 'ხარისხის მართვა', color: '#dc2626', variant: 'danger', codes: [
    'BE-FM-COMPLAINT', 'BE-FM-APPEAL', 'BE-FM-NONCONF', 'BE-FM-CAPA',
    'BE-FM-MGMT-REVIEW', 'BE-FM-SATISF', 'BE-FM-TECH-REVIEW',
  ]},
  { icon: '🗂️', title: 'დოკუმენტების მართვა', color: '#15803d', variant: 'secondary', codes: [
    'BE-FM-CHANGE-INIT', 'BE-FM-CHANGE-REG', 'BE-FM-FAMIL', 'BE-FM-DESTROY-ACT',
  ]},
];

const findForm = (code) => NEW_FORMS.find((f) => f.code === code);

// ════════════════════════════════════════════════════════════
const DocumentsPage = () => {
  const shown = new Set();
  return (
    <Container className="mt-4 pb-5 font-georgian">
      <h4 className="fw-bold mb-1 text-dark">📂 დოკუმენტების შაბლონები</h4>
      <p className="text-muted mb-2 small">
        სსტ ISO/IEC 17020:2012 — A ტიპის საინსპექციო ორგანო | ეტალონური ფორმები (BE-FM-რეესტრი) &nbsp;|&nbsp;
        <span className="text-primary">📝 შევსება</span> — ონლაინ შევსება, ხელმოწერა და შენახვა რეესტრში &nbsp;|&nbsp;
        <span className="text-secondary">📄 PDF / Word</span> — ცარიელი შაბლონი
      </p>

      <SectionTitle icon="🏢" title="ბლანკები და გენერატორები" />
      <Row className="g-2">
        <BlankCard />
        <LinkCard icon="⚖️" title="ბრძანების გენერატორი" desc="დანიშვნა / შვებულება / მივლინება — ავტო-ნუმერაციით" to="/order-generator" />
        <LinkCard icon="🤝" title="შრომის ხელშეკრულება" desc="ხელშეკრულება + 2 დანართი" to="/contract-generator" />
        <LinkCard icon="📑" title="მომსახურების ხელშეკრულება" desc="BE-PR-01..03 სფეროების ჩამატება, ფასი, ვადები" to="/company-docs" />
      </Row>

      {GROUPS.map((g) => (
        <React.Fragment key={g.title}>
          <SectionTitle icon={g.icon} title={g.title} color={g.color} />
          <Row className="g-2">
            {g.codes.map((code) => {
              if (shown.has(code)) return null;
              shown.add(code);
              const form = findForm(code);
              return form ? <FormCard key={code} form={form} color={g.variant} /> : null;
            })}
          </Row>
        </React.Fragment>
      ))}
    </Container>
  );
};

export default DocumentsPage;
