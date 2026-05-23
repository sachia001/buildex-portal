import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Row, Col, Button, Modal, Form, Badge } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Link } from 'react-router-dom';

// ── All existing PDF form components ─────────────────────────────────────────
import BlankLetterhead             from '../pdf-components/BlankLetterhead';
import BlankApplicationForm        from '../pdf-components/BlankApplicationForm';
import ImpartialityDeclarationPdf  from '../pdf-components/ImpartialityDeclarationPdf';
import ConfidentialityAgreementPdf from '../pdf-components/ConfidentialityAgreementPdf';
import FM04_InternalAuditPdf       from '../pdf-components/FM04_InternalAuditPdf';
import FM06_ComplaintAppealPdf     from '../pdf-components/FM06_ComplaintAppealPdf';
import FM07_EquipmentVerificationPdf from '../pdf-components/FM07_EquipmentVerificationPdf';
import FM08_CompetencyAssessmentPdf  from '../pdf-components/FM08_CompetencyAssessmentPdf';
import FM09_ContractReviewPdf      from '../pdf-components/FM09_ContractReviewPdf';
import FM10_CAPAFormPdf            from '../pdf-components/FM10_CAPAFormPdf';
import FM11_InspectionPlanPdf      from '../pdf-components/FM11_InspectionPlanPdf';
import FM12_SubcontractorPdf       from '../pdf-components/FM12_SubcontractorPdf';
import FM13_TrainingRecordNewPdf   from '../pdf-components/FM13_TrainingRecordNewPdf';
import FM14_NonConformingPdf       from '../pdf-components/FM14_NonConformingPdf';
import FM15_MgmtReviewPdf          from '../pdf-components/FM15_MgmtReviewPdf';
import FM16_VisitRecordPdf         from '../pdf-components/FM16_VisitRecordPdf';
import FM21_InspectionRegisterPdf  from '../pdf-components/FM21_InspectionRegisterPdf';
import FM22_FamiliarizationPdf     from '../pdf-components/FM22_FamiliarizationPdf';
import FM23_DocChangePdf           from '../pdf-components/FM23_DocChangePdf';
import FM24_ChangeRegisterPdf      from '../pdf-components/FM24_ChangeRegisterPdf';
import FM25_LiquidationActPdf      from '../pdf-components/FM25_LiquidationActPdf';
import FormFillModal               from '../components/FormFillModal';
import { FORM_CONFIGS }            from '../components/formConfigs';

// ═══════════════════════════════════════════════════════════════════
// FULL DOCUMENT CATALOG — 9 categories, all codes
// ═══════════════════════════════════════════════════════════════════
const CATEGORIES = [
  {
    key: 'all',
    label: '📚 ყველა',
    color: '#003366',
    bg: '#e8f0f7',
  },
  {
    key: 'manual',
    label: '📖 ხარისხის სახელმძღვანელო',
    shortLabel: '📖 სახ.',
    color: '#003366',
    bg: '#e8f0f7',
    folderLetter: 'A',
  },
  {
    key: 'procedure',
    label: '📋 პროცედურები',
    shortLabel: '📋 პროც.',
    color: '#0d6efd',
    bg: '#e7f0ff',
    folderLetter: 'B',
  },
  {
    key: 'instruction',
    label: '🔧 სამუშაო ინსტრუქციები',
    shortLabel: '🔧 ინსტ.',
    color: '#0891b2',
    bg: '#e0f7fa',
    folderLetter: 'C',
  },
  {
    key: 'job_description',
    label: '👤 სამუშაო აღწერილობები',
    shortLabel: '👤 აღწ.',
    color: '#7c3aed',
    bg: '#ede9fe',
    folderLetter: 'D',
  },
  {
    key: 'form',
    label: '📝 ფორმები და შაბლონები',
    shortLabel: '📝 ფორმ.',
    color: '#0369a1',
    bg: '#e0f2fe',
    folderLetter: 'E',
  },
  {
    key: 'policy',
    label: '🛡️ პოლიტიკები',
    shortLabel: '🛡️ პოლ.',
    color: '#b45309',
    bg: '#fef3c7',
    folderLetter: 'F',
  },
  {
    key: 'risk',
    label: '⚠️ რისკების მართვა',
    shortLabel: '⚠️ რისკ.',
    color: '#dc2626',
    bg: '#fee2e2',
    folderLetter: 'G',
  },
  {
    key: 'order',
    label: '📜 ბრძანებები',
    shortLabel: '📜 ბრძ.',
    color: '#15803d',
    bg: '#dcfce7',
    folderLetter: 'H',
  },
];

const ALL_DOCS_META = [
  // A — ხარისხის სახელმძღვანელო
  { code: 'QM-01',       category: 'manual',          title: 'ხარისხის სახელმძღვანელო',                               icon: '📖' },

  // B — პროცედურები
  { code: 'BE-PR-SET',   category: 'procedure',        title: 'პროცედურების სარჩევი (ინდექსი)',                        icon: '📑' },
  { code: 'BE-PR-MAIN',  category: 'procedure',        title: 'ინსპექტირების სრული პროცესი',                          icon: '📋' },
  { code: 'BE-PR-01',    category: 'procedure',        title: 'განაცხადების მიღება და კლიენტებთან ხელშეკრულება',     icon: '📋' },
  { code: 'BE-PR-02',    category: 'procedure',        title: 'სახელშეკრულებო მოთხოვნათა შეთანხმება',                icon: '🤝' },
  { code: 'BE-PR-03',    category: 'procedure',        title: 'ინსპექტირების დაგეგმვა',                               icon: '🗺️' },
  { code: 'BE-PR-04',    category: 'procedure',        title: 'ინსპექტირების ჩატარება',                               icon: '🔍' },
  { code: 'BE-PR-05',    category: 'procedure',        title: 'შედეგების გაფორმება',                                  icon: '📊' },
  { code: 'BE-PR-06',    category: 'procedure',        title: 'ინსპექციის ანგარიშის გაცემა',                          icon: '📤' },
  { code: 'BE-PR-07',    category: 'procedure',        title: 'საჩივრებისა და აპელაციების განხილვა',                  icon: '📣' },
  { code: 'BE-PR-08',    category: 'procedure',        title: 'შეუსაბამო სამუშაოს მართვა',                           icon: '🚫' },
  { code: 'BE-PR-09',    category: 'procedure',        title: 'კორექტირებითი ქმედებები (CAPA)',                       icon: '⚙️' },
  { code: 'BE-PR-10',    category: 'procedure',        title: 'შიდა აუდიტი',                                         icon: '🔎' },
  { code: 'BE-PR-11',    category: 'procedure',        title: 'მენეჯმენტის მიმოხილვა',                               icon: '📈' },
  { code: 'BE-PR-12',    category: 'procedure',        title: 'დოკუმენტების მართვა',                                  icon: '🗂️' },
  { code: 'BE-PR-13',    category: 'procedure',        title: 'ჩანაწერების მართვა',                                   icon: '📁' },
  { code: 'BE-PR-14',    category: 'procedure',        title: 'პერსონალის კვალიფიკაცია და ტრენინგი',                 icon: '👥' },
  { code: 'BE-PR-15',    category: 'procedure',        title: 'მოწყობილობის მართვა და კალიბრაცია',                   icon: '🔧' },

  // C — სამუშაო ინსტრუქციები
  { code: 'BE-WI-01',    category: 'instruction',      title: 'ხარჯთაღრიცხვის შესაბამისობის შემოწმება',             icon: '📐' },
  { code: 'BE-WI-02',    category: 'instruction',      title: 'შესრულებული სამუშაოს ფორმა 2',                        icon: '📝' },
  { code: 'BE-WI-03',    category: 'instruction',      title: 'ფასწარმოქმნის ადეკვატურობის შემოწმება',              icon: '💰' },
  { code: 'BE-WI-04',    category: 'instruction',      title: 'ტექნიკური ზედამხედველობა',                           icon: '👷' },

  // D — სამუშაო აღწერილობები
  { code: 'HR-JD-001',   category: 'job_description',  title: 'აღმასრულებელი დირექტორის სამუშაო აღწერილობა',       icon: '👔' },
  { code: 'HR-JD-002',   category: 'job_description',  title: 'ხარისხის მენეჯერის სამუშაო აღწერილობა',              icon: '✅' },
  { code: 'HR-JD-003',   category: 'job_description',  title: 'ტექნიკური მენეჯერის სამუშაო აღწერილობა',             icon: '🔧' },
  { code: 'HR-JD-004',   category: 'job_description',  title: 'ინსპექტორის სამუშაო აღწერილობა',                     icon: '🔍' },
  { code: 'HR-JD-005',   category: 'job_description',  title: 'ადმინისტრატორის სამუშაო აღწერილობა',                 icon: '🗂️' },

  // E — ფორმები და შაბლონები
  { code: 'FM-01',       category: 'form',             title: 'ინსპექტირების ანგარიში',                              icon: '📄' },
  { code: 'FM-02',       category: 'form',             title: 'მიუკერძოებლობის დეკლარაცია',                          icon: '⚖️' },
  { code: 'FM-03',       category: 'form',             title: 'კონფიდენციალობის შეთანხმება',                          icon: '🤐' },
  { code: 'FM-04',       category: 'form',             title: 'შიდა აუდიტის გეგმა და ანგარიში',                      icon: '🔎' },
  { code: 'FM-05',       category: 'form',             title: 'მომსახურების ხელშეკრულება',                           icon: '📃' },
  { code: 'FM-06',       category: 'form',             title: 'საჩივრის / აპელაციის ფორმა',                          icon: '📣' },
  { code: 'FM-07',       category: 'form',             title: 'მოწყობილობის ვერიფიკაცია',                            icon: '🔩' },
  { code: 'FM-08',       category: 'form',             title: 'კომპეტენციის შეფასება',                               icon: '🎯' },
  { code: 'FM-09',       category: 'form',             title: 'ხელშეკრულების განხილვა',                              icon: '📋' },
  { code: 'FM-10',       category: 'form',             title: 'CAPA — კორექტირებითი ქმედების ფორმა',                 icon: '⚠️' },
  { code: 'FM-11',       category: 'form',             title: 'ინსპექტირების გეგმა',                                 icon: '🗺️' },
  { code: 'FM-12',       category: 'form',             title: 'ქვეკონტრაქტორის შეფასება',                           icon: '🏗️' },
  { code: 'FM-13',       category: 'form',             title: 'ტრენინგის ჩანაწერი',                                  icon: '📚' },
  { code: 'FM-14',       category: 'form',             title: 'შეუსაბამო სამუშაო',                                   icon: '🚫' },
  { code: 'FM-15',       category: 'form',             title: 'მენეჯმენტის ანალიზი',                                 icon: '📈' },
  { code: 'FM-16',       category: 'form',             title: 'ვიზიტის ჩანაწერი',                                    icon: '📍' },
  { code: 'FM-18',       category: 'form',             title: 'განაცხადის ფორმა',                                    icon: '📝' },
  { code: 'FM-21',       category: 'form',             title: 'ინსპექტირების რეგისტრი',                              icon: '📊' },
  { code: 'FM-22',       category: 'form',             title: 'გაცნობის ფურცელი',                                    icon: '👁️' },
  { code: 'FM-23',       category: 'form',             title: 'დოკუმენტში ცვლილების წინადადება',                     icon: '✍️' },
  { code: 'FM-24',       category: 'form',             title: 'ცვლილებების რეგისტრაცია',                             icon: '📒' },
  { code: 'FM-25',       category: 'form',             title: 'ლიკვიდაციის აქტი',                                   icon: '🗑️' },

  // F — პოლიტიკები
  { code: 'POL-01',      category: 'policy',           title: 'მიუკერძოებლობის პოლიტიკა',                           icon: '⚖️' },
  { code: 'POL-02',      category: 'policy',           title: 'კონფიდენციალობის პოლიტიკა',                           icon: '🔒' },
  { code: 'POL-03',      category: 'policy',           title: 'ხარისხის პოლიტიკა',                                   icon: '✅' },
  { code: 'POL-04',      category: 'policy',           title: 'IT და მონაცემთა უსაფრთხოების პოლიტიკა',              icon: '💻' },

  // G — რისკების მართვა
  { code: 'RM-01',       category: 'risk',             title: 'რისკების რეესტრი',                                    icon: '⚠️' },

  // H — ბრძანებები
  { code: 'ORD-01',      category: 'order',            title: 'ბრძანება №01',                                        icon: '📜' },
  { code: 'ORD-02',      category: 'order',            title: 'ბრძანება №02',                                        icon: '📜' },
  { code: 'ORD-03',      category: 'order',            title: 'ბრძანება №03',                                        icon: '📜' },
  { code: 'ORD-04',      category: 'order',            title: 'ბრძანება №04',                                        icon: '📜' },
  { code: 'ORD-05',      category: 'order',            title: 'ბრძანება №05',                                        icon: '📜' },
];

// ═══════════════════════════════════════════════════════════════════
// PDF FORMS DATA (Tab 2)
// ═══════════════════════════════════════════════════════════════════
const FORMS_DATA = [
  { section: '🏢 ბლანკები და გენერატორები', items: [
    { icon: '📄', code: 'ბლანკი',     title: 'ოფიციალური ბლანკი',          desc: 'ლოგო და რეკვიზიტები',              pdf: <BlankLetterhead />,             fileName: 'ბილდექს_ბლანკი',    color: 'primary' },
    { icon: '⚖️', code: 'ბრძანება',   title: 'ბრძანების გენერატორი',        desc: 'დანიშვნა / შვებულება / მივლინება', linkTo: '/order-generator',           color: 'primary' },
    { icon: '🤝', code: 'შრ.ხელშ.',  title: 'შრომის ხელშეკრულება',          desc: '+ 2 დანართი',                      linkTo: '/contract-generator',        color: 'primary' },
    { icon: '📑', code: 'მომ.ხელშ.', title: 'მომსახურების ხელშეკრულება',   desc: 'BE-PR-01..04',                     linkTo: '/company-docs',              color: 'primary' },
  ]},
  { section: '🔍 ინსპექტირების ფორმები', items: [
    { icon: '📝', code: 'FM-18', title: 'განაცხადის ფორმა',         desc: 'ინსპექციის მოთხოვნა',           pdf: <BlankApplicationForm />,          fileName: 'FM-18_განაცხადება',  color: 'info' },
    { icon: '📋', code: 'FM-09', title: 'ხელშეკრულების განხილვა',   desc: 'ISO §7.1',                      pdf: <FM09_ContractReviewPdf />,        fileName: 'FM-09_ხელშ_განხ',    color: 'info', fill: 'FM-09' },
    { icon: '🗺️', code: 'FM-11', title: 'ინსპექტირების გეგმა',      desc: 'ISO §7.1',                      pdf: <FM11_InspectionPlanPdf />,        fileName: 'FM-11_ინსპ_გეგმა',  color: 'info', fill: 'FM-11' },
    { icon: '📍', code: 'FM-16', title: 'ვიზიტის ჩანაწერი',         desc: 'ISO §7.3',                      pdf: <FM16_VisitRecordPdf />,           fileName: 'FM-16_ვიზ_ჩანაწ',   color: 'info', fill: 'FM-16' },
    { icon: '📊', code: 'FM-21', title: 'ინსპექტირების რეგისტრი',   desc: 'ISO §7.3',                      pdf: <FM21_InspectionRegisterPdf />,   fileName: 'FM-21_ინსპ_რეგ',    color: 'info', fill: 'FM-21' },
  ]},
  { section: '👥 პერსონალი და კომპეტენცია', items: [
    { icon: '⚖️', code: 'FM-02', title: 'მიუკერძოებლობის დეკლარაცია', desc: 'ISO §4',                     pdf: <ImpartialityDeclarationPdf data={{}} />,  fileName: 'FM-02_მიუკ_დეკლ', color: 'success', fill: 'FM-02' },
    { icon: '🤐', code: 'FM-03', title: 'კონფიდენციალობის შეთანხმება',  desc: 'ISO §5 — 5 წელი',           pdf: <ConfidentialityAgreementPdf data={{}} />, fileName: 'FM-03_კონფ_შეთ',  color: 'success', fill: 'FM-03' },
    { icon: '🎯', code: 'FM-08', title: 'კომპეტენციის შეფასება',        desc: 'ISO §6.1',                  pdf: <FM08_CompetencyAssessmentPdf />,          fileName: 'FM-08_კომპ_შეფ',  color: 'success', fill: 'FM-08' },
    { icon: '📚', code: 'FM-13', title: 'ტრენინგის ჩანაწერი',           desc: 'ISO §6.1 — 5 წელი',         pdf: <FM13_TrainingRecordNewPdf />,             fileName: 'FM-13_ტრენ_ჩანაწ', color: 'success', fill: 'FM-13' },
  ]},
  { section: '🛡️ ხარისხის მართვა', items: [
    { icon: '📣', code: 'FM-06', title: 'საჩივარი / აპელაცია',         desc: 'ISO §7.5/7.7/7.8',            pdf: <FM06_ComplaintAppealPdf />,       fileName: 'FM-06_საჩ_აპ',     color: 'danger', fill: 'FM-06' },
    { icon: '⚠️', code: 'FM-10', title: 'CAPA — კორექტირებითი ქმედება',desc: 'ISO §8.5',                   pdf: <FM10_CAPAFormPdf />,              fileName: 'FM-10_CAPA',        color: 'danger', fill: 'FM-10' },
    { icon: '🚫', code: 'FM-14', title: 'შეუსაბამო სამუშაოს მართვა',   desc: 'ISO §8.7',                   pdf: <FM14_NonConformingPdf />,         fileName: 'FM-14_შეუსაბ',      color: 'danger', fill: 'FM-14' },
    { icon: '🔎', code: 'FM-04', title: 'შიდა აუდიტი',                  desc: 'ISO §8.6 — 2-ჯერ/წელ.',     pdf: <FM04_InternalAuditPdf />,         fileName: 'FM-04_შ_აუდ',       color: 'danger', fill: 'FM-04' },
    { icon: '📈', code: 'FM-15', title: 'მენეჯმენტის ანალიზი',          desc: 'ISO §8.5',                   pdf: <FM15_MgmtReviewPdf />,            fileName: 'FM-15_მენ_ანალ',    color: 'danger', fill: 'FM-15' },
  ]},
  { section: '🔧 მოწყობილობა და ქვეკონტრაქტორები', items: [
    { icon: '🔩', code: 'FM-07', title: 'მოწყობილობის ვერიფიკაცია',    desc: 'ISO §6.2',                   pdf: <FM07_EquipmentVerificationPdf />, fileName: 'FM-07_მოწყ_ვერ',   color: 'warning', fill: 'FM-07' },
    { icon: '🏗️', code: 'FM-12', title: 'ქვეკონტრაქტორის შეფასება',    desc: 'ISO §6.6',                   pdf: <FM12_SubcontractorPdf />,         fileName: 'FM-12_ქვეკ_შეფ',   color: 'warning', fill: 'FM-12' },
  ]},
  { section: '🗂️ დოკუმენტაციის მართვა', items: [
    { icon: '👁️', code: 'FM-22', title: 'გაცნობის ფურცელი',             desc: 'ISO §6.1 — 5 სამ. დღე',      pdf: <FM22_FamiliarizationPdf />,       fileName: 'FM-22_გაცნ_ფ',      color: 'secondary', fill: 'FM-22' },
    { icon: '✍️', code: 'FM-23', title: 'ცვლილების წინადადება',         desc: 'BE-PR-12',                   pdf: <FM23_DocChangePdf />,             fileName: 'FM-23_ცვლ_წინ',     color: 'secondary', fill: 'FM-23' },
    { icon: '📒', code: 'FM-24', title: 'ცვლილებების რეგისტრი',         desc: 'BE-PR-12 (ჟურნალი)',         pdf: <FM24_ChangeRegisterPdf />,        fileName: 'FM-24_ცვლ_რეგ',     color: 'secondary', fill: 'FM-24' },
    { icon: '🗑️', code: 'FM-25', title: 'ლიკვიდაციის აქტი',            desc: 'BE-PR-12 §6',                pdf: <FM25_LiquidationActPdf />,        fileName: 'FM-25_ლიკვ',         color: 'secondary', fill: 'FM-25' },
  ]},
];

// ═══════════════════════════════════════════════════════════════════
// FormCard — single PDF form card
// ═══════════════════════════════════════════════════════════════════
function FormCard({ icon, code, title, desc, pdf, fileName, linkTo, color, fill }) {
  const [showFill, setShowFill] = useState(false);
  return (
    <>
      <Col xl={2} lg={3} md={4} sm={6}>
        <div className="h-100 shadow-sm" style={{
          border: 'none', borderRadius: 8, background: '#fff',
          borderTop: `3px solid var(--bs-${color})`, overflow: 'hidden',
        }}>
          <div className="d-flex flex-column p-2 text-center h-100">
            <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
            <Badge bg={color} className="mb-1" style={{ fontSize: '0.6rem' }}>{code}</Badge>
            <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.73rem', lineHeight: 1.3 }}>{title}</div>
            <p className="text-muted mb-2 flex-grow-1" style={{ fontSize: '0.62rem' }}>{desc}</p>
            {linkTo ? (
              <Button as={Link} to={linkTo} variant={color} size="sm" className="w-100 fw-bold" style={{ fontSize: '0.68rem' }}>⚙️ შექმნა</Button>
            ) : (
              <div className="d-flex flex-column gap-1">
                {fill && FORM_CONFIGS[fill] && (
                  <Button variant={color} size="sm" className="w-100 fw-bold" style={{ fontSize: '0.68rem' }} onClick={() => setShowFill(true)}>📝 შევსება</Button>
                )}
                <PDFDownloadLink document={pdf} fileName={`${fileName}_ცარიელი.pdf`} style={{ textDecoration: 'none' }}>
                  {({ loading }) => (
                    <Button variant={`outline-${color}`} size="sm" className="w-100 fw-bold" style={{ fontSize: '0.68rem' }}>
                      {loading ? '⏳' : '📄 ჩამოტვირთვა'}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            )}
          </div>
        </div>
      </Col>
      {fill && FORM_CONFIGS[fill] && (
        <FormFillModal show={showFill} onHide={() => setShowFill(false)}
          config={FORM_CONFIGS[fill]} pdfComponent={pdf} pdfFileName={fileName} formCode={code} />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Upload / Edit Modal
// prefill  — catalog meta for new upload  { code, title, category }
// existing — full DB doc for editing      { _id, code, title, ... }
// ═══════════════════════════════════════════════════════════════════
function ProcUploadModal({ show, onHide, onSaved, existing, prefill, defaultCategory }) {
  const isEdit = !!(existing?._id);

  const [code, setCode]         = useState('');
  const [title, setTitle]       = useState('');
  const [category, setCategory] = useState(defaultCategory || 'procedure');
  const [version, setVersion]   = useState('2.0');
  const [notes, setNotes]       = useState('');
  const [file, setFile]         = useState(null);
  const [saving, setSaving]     = useState(false);
  const [err, setErr]           = useState('');
  const fileRef                 = useRef();
  const token = localStorage.getItem('token');

  // Re-populate every time the modal opens or target changes
  useEffect(() => {
    if (!show) return;
    const src = existing || prefill || {};
    setCode(src.code     || '');
    setTitle(src.title   || '');
    setCategory(src.category || defaultCategory || 'procedure');
    setVersion(src.version   || '2.0');
    setNotes(src.notes       || '');
    setFile(null);
    setErr('');
  }, [show, existing, prefill, defaultCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!title.trim()) { setErr('სათაური სავალდებულოა'); return; }
    if (!isEdit && !file)  { setErr('ფაილი სავალდებულოა'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('code',     code);
      fd.append('title',    title);
      fd.append('category', category);
      fd.append('version',  version);
      fd.append('notes',    notes);
      if (file) fd.append('file', file);
      const headers = { Authorization: `Bearer ${token}` };
      if (isEdit) {
        await axios.put(`/api/procedures/${existing._id}`, fd, { headers });
      } else {
        await axios.post('/api/procedures', fd, { headers });
      }
      onSaved();
    } catch (e) { setErr(e.response?.data?.error || e.message); }
    setSaving(false);
  };

  const catOptions = CATEGORIES.filter(c => c.key !== 'all');

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ background: '#003366', color: '#fff' }}>
        <Modal.Title style={{ fontSize: '1rem' }}>
          {isEdit ? '✏️ დოკუმენტის განახლება' : '📤 დოკუმენტის ატვირთვა'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {err && <div className="alert alert-danger py-1 small">{err}</div>}

        {/* Code + Category on one line */}
        <div className="d-flex gap-2 mb-2">
          <Form.Group style={{ flex: '0 0 140px' }}>
            <Form.Label className="small fw-bold mb-1">კოდი</Form.Label>
            <Form.Control size="sm" value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="BE-PR-01"
              readOnly={!!(prefill?.code && !isEdit)}
              style={prefill?.code && !isEdit ? { background: '#f0f4f8', fontWeight: 600 } : {}} />
          </Form.Group>
          <Form.Group style={{ flex: 1 }}>
            <Form.Label className="small fw-bold mb-1">კატეგორია</Form.Label>
            <Form.Select size="sm" value={category} onChange={e => setCategory(e.target.value)}>
              {catOptions.map(c => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>

        <Form.Group className="mb-2">
          <Form.Label className="small fw-bold mb-1">სრული სახელი *</Form.Label>
          <Form.Control size="sm" value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="დოკუმენტის სრული სახელი"
            readOnly={!!(prefill?.title && !isEdit)}
            style={prefill?.title && !isEdit ? { background: '#f0f4f8', fontWeight: 500 } : {}} />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label className="small fw-bold mb-1">ვერსია</Form.Label>
          <Form.Control size="sm" value={version}
            onChange={e => setVersion(e.target.value)} placeholder="2.0" />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label className="small fw-bold mb-1">
            ფაილი (.docx / .pdf / .xlsx)
            {isEdit && <span className="text-muted fw-normal"> — სურვილისამებრ (ჩაანაცვლებს)</span>}
          </Form.Label>
          <input ref={fileRef} type="file" className="form-control form-control-sm"
            accept=".docx,.doc,.pdf,.xlsx"
            onChange={e => setFile(e.target.files[0])} />
        </Form.Group>

        {/* Notes — always visible, highlighted when has content */}
        <Form.Group className="mb-1">
          <Form.Label className="small fw-bold mb-1">შენიშვნა / კომენტარი</Form.Label>
          <Form.Control as="textarea" size="sm" rows={2} value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="მაგ. ვერსია 2.0, განახლდა 2026-05..."
            style={notes ? { background: '#fffbeb', borderColor: '#d97706' } : {}} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="sm" onClick={onHide}>გაუქმება</Button>
        <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
          {saving ? '⏳ ...' : isEdit ? '💾 განახლება' : '📤 ატვირთვა'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Code normaliser — "QM-1" → "QM-01", "FM-9" → "FM-09", etc.
// ═══════════════════════════════════════════════════════════════════
function normalizeCode(code) {
  if (!code) return '';
  return code
    .toUpperCase()
    .trim()
    // Pad every numeric segment to at least 2 digits: PR-1 → PR-01, JD-1 → JD-001 handled below
    .replace(/-(\d+)/g, (_, n) => '-' + n.padStart(2, '0'))
    // HR-JD needs 3 digits
    .replace(/(HR-JD-)(\d{2})$/, (_, p, n) => p + '0' + n);
}

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════
export default function ProceduresPage({ role }) {
  const [tab, setTab]               = useState('procedures'); // 'procedures' | 'forms'
  const [activeCat, setActiveCat]   = useState('all');
  const [docs, setDocs]             = useState([]);
  const [loading, setLoading]       = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState(null);  // full DB doc (has _id) — for editing
  const [prefill, setPrefill]       = useState(null);  // catalog meta — pre-fills new upload
  const [msg, setMsg]               = useState(null);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const canEdit = ['admin', 'quality_manager'].includes(role);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const r = await axios.get('/api/procedures', { headers });
      setDocs(r.data);
    } catch {}
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleDelete = async (doc) => {
    if (!window.confirm(`წაიშალოს "${doc.title}"?`)) return;
    try {
      await axios.delete(`/api/procedures/${doc._id}`, { headers });
      setMsg({ type: 'success', text: '✅ დოკუმენტი წაიშალა' });
      fetchDocs();
    } catch (e) { setMsg({ type: 'danger', text: e.message }); }
  };

  const downloadDoc = async (doc) => {
    try {
      // Server returns a 60-second signed redirect URL — open in same tab triggers download
      const res = await axios.get(`/api/procedures/${doc._id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        maxRedirects: 0,          // capture the redirect URL ourselves
        validateStatus: s => s === 302 || s === 200 || s < 400,
      });
      // If server redirected → open that signed URL directly
      const redirectUrl = res.headers?.location || res.request?.responseURL;
      if (redirectUrl) {
        const a = document.createElement('a');
        a.href = redirectUrl;
        a.download = doc.originalName || doc.code;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }
      // Fallback: blob download (local file)
      const blob = await axios.get(`/api/procedures/${doc._id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([blob.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.originalName || doc.code;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('ჩამოტვირთვა ვერ მოხდა: ' + (e.response?.status === 401 ? 'ავტორიზაცია საჭიროა' : e.message));
    }
  };

  // Merge catalog with uploaded docs — normalised code matching
  const filteredMeta = activeCat === 'all'
    ? ALL_DOCS_META
    : ALL_DOCS_META.filter(m => m.category === activeCat);

  const mergedList = filteredMeta.map(meta => ({
    ...meta,
    uploaded: docs.find(d => normalizeCode(d.code) === normalizeCode(meta.code)),
  }));

  // Extra uploaded docs: only those that don't match ANY catalog entry
  const extraDocs = docs.filter(d =>
    !ALL_DOCS_META.find(m => normalizeCode(m.code) === normalizeCode(d.code))
  );

  // Stats
  const uploadedCount = docs.length;
  const totalCount = ALL_DOCS_META.length;
  const pct = totalCount > 0 ? Math.round((uploadedCount / totalCount) * 100) : 0;

  // Category color/info lookup
  const catInfo = (key) => CATEGORIES.find(c => c.key === key) || { color: '#555', bg: '#eee', label: key };

  // ── Tab styles ──────────────────────────────────────────────────
  const tabStyle = (active) => ({
    padding: '8px 20px', borderRadius: '8px 8px 0 0', border: 'none',
    background: active ? '#003366' : '#e8f0f7',
    color: active ? '#fff' : '#003366', fontWeight: 600,
    fontSize: '0.85rem', cursor: 'pointer',
  });

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', padding: '20px 0 60px' }}>
      {/* Header */}
      <div className="d-flex align-items-start justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-0" style={{ color: '#003366' }}>📂 პროცედურები და ფორმები</h3>
          <p className="text-muted small mb-0">ISO/IEC 17020:2012 — ხარისხის დოკუმენტაციის მართვა</p>
        </div>
        {/* Progress */}
        <div style={{ minWidth: 200 }}>
          <div className="d-flex justify-content-between small mb-1">
            <span className="text-muted">ატვირთული</span>
            <span className="fw-bold" style={{ color: '#003366' }}>{uploadedCount} / {totalCount}</span>
          </div>
          <div style={{ height: 8, background: '#e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: pct >= 80 ? '#15803d' : pct >= 50 ? '#b45309' : '#dc2626', borderRadius: 8, transition: 'width 0.5s' }} />
          </div>
          <div className="text-muted" style={{ fontSize: '0.72rem' }}>{pct}% სრული</div>
        </div>
      </div>

      {msg && (
        <div className={`alert alert-${msg.type} py-2 small d-flex justify-content-between`}>
          <span>{msg.text}</span>
          <span style={{ cursor: 'pointer' }} onClick={() => setMsg(null)}>✕</span>
        </div>
      )}

      {/* Main tabs */}
      <div className="d-flex gap-1 mb-0" style={{ borderBottom: '2px solid #003366' }}>
        <button style={tabStyle(tab === 'procedures')} onClick={() => setTab('procedures')}>
          📄 პროცედურები და დოკუმენტები
        </button>
        <button style={tabStyle(tab === 'forms')} onClick={() => setTab('forms')}>
          📋 PDF ფორმები და შაბლონები
        </button>
      </div>

      {/* ═══ PROCEDURES TAB ══════════════════════════════════════════════ */}
      {tab === 'procedures' && (
        <div style={{ background: '#fff', border: '1px solid #003366', borderTop: 'none', borderRadius: '0 8px 8px 8px', padding: '16px 20px' }}>

          {/* Category filter bar */}
          <div className="d-flex flex-wrap gap-1 mb-3">
            {CATEGORIES.map(cat => {
              const isActive = activeCat === cat.key;
              const catDocs = cat.key === 'all'
                ? docs.length
                : docs.filter(d => d.category === cat.key).length;
              const catTotal = cat.key === 'all'
                ? ALL_DOCS_META.length
                : ALL_DOCS_META.filter(m => m.category === cat.key).length;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCat(cat.key)}
                  style={{
                    padding: '4px 10px', borderRadius: 6, border: `1.5px solid ${cat.color}`,
                    background: isActive ? cat.color : '#fff',
                    color: isActive ? '#fff' : cat.color,
                    fontWeight: isActive ? 700 : 500, fontSize: '0.75rem', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {cat.shortLabel || cat.label}
                  <span style={{
                    marginLeft: 5, fontSize: '0.65rem',
                    background: isActive ? 'rgba(255,255,255,0.25)' : cat.bg,
                    padding: '1px 5px', borderRadius: 10,
                    color: isActive ? '#fff' : cat.color,
                  }}>
                    {catDocs}/{catTotal}
                  </span>
                </button>
              );
            })}
            {canEdit && (
              <button
                className="ms-auto"
                onClick={() => { setEditing(null); setPrefill(null); setShowModal(true); }}
                style={{
                  padding: '4px 14px', borderRadius: 6, border: '1.5px solid #0d6efd',
                  background: '#0d6efd', color: '#fff', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                }}
              >
                + ატვირთვა
              </button>
            )}
          </div>

          {/* Document table */}
          {loading ? (
            <div className="text-center py-5 text-muted">⏳ იტვირთება...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table table-hover table-sm mb-0" style={{ fontSize: '0.82rem' }}>
                <thead style={{ background: '#003366', color: '#fff', position: 'sticky', top: 0 }}>
                  <tr>
                    <th className="py-2 px-2" style={{ width: 28 }}></th>
                    <th className="py-2 px-2" style={{ width: 110 }}>კოდი</th>
                    <th className="py-2 px-2">სახელი</th>
                    <th className="py-2 px-2" style={{ width: 110 }}>კატეგორია</th>
                    <th className="py-2 px-2" style={{ width: 65 }}>ვერ.</th>
                    <th className="py-2 px-2" style={{ width: 110 }}>განახლება</th>
                    <th className="py-2 px-2" style={{ width: 80 }}>სტატუსი</th>
                    <th className="py-2 px-2" style={{ width: 140 }}>მოქმედება</th>
                  </tr>
                </thead>
                <tbody>
                  {mergedList.map((item) => {
                    const up = item.uploaded;
                    const ci = catInfo(item.category);
                    return (
                      <tr key={item.code} style={{ background: up ? '#f0fdf4' : '#fffbeb' }}>
                        <td className="px-2 text-center" style={{ fontSize: 15 }}>{item.icon}</td>
                        <td className="px-2">
                          <span className="fw-bold" style={{ color: ci.color, fontSize: '0.78rem' }}>{item.code}</span>
                        </td>
                        <td className="px-2">
                          <div style={{ fontWeight: 500, color: '#1a1a2e' }}>{up ? up.title : item.title}</div>
                          {up?.notes && (
                            <div style={{
                              marginTop: 2, fontSize: '0.68rem', color: '#92400e',
                              background: '#fef3c7', borderRadius: 3,
                              padding: '1px 6px', display: 'inline-block',
                            }}>
                              💬 {up.notes}
                            </div>
                          )}
                        </td>
                        <td className="px-2">
                          <span style={{
                            fontSize: '0.68rem', padding: '2px 7px', borderRadius: 4,
                            background: ci.bg, color: ci.color, fontWeight: 600,
                          }}>
                            {ci.folderLetter && <span style={{ opacity: 0.7, marginRight: 2 }}>{ci.folderLetter}·</span>}
                            {ci.shortLabel ? ci.shortLabel.replace(/^.+?\s/, '') : (ci.label || item.category)}
                          </span>
                        </td>
                        <td className="px-2 text-muted" style={{ fontSize: '0.75rem' }}>{up?.version || '—'}</td>
                        <td className="px-2 text-muted" style={{ fontSize: '0.72rem' }}>
                          {up ? new Date(up.updatedAt).toLocaleDateString('ka-GE') : '—'}
                          {up?.fileSize > 0 && (
                            <div style={{ fontSize: '0.65rem', color: '#aaa' }}>
                              {up.fileSize > 1048576
                                ? (up.fileSize / 1048576).toFixed(1) + ' MB'
                                : Math.round(up.fileSize / 1024) + ' KB'}
                            </div>
                          )}
                        </td>
                        <td className="px-2 text-center">
                          {up
                            ? <span style={{ color: '#15803d', fontWeight: 700, fontSize: '0.72rem' }}>✅ ☁️ ატვირთ.</span>
                            : <span style={{ color: '#b45309', fontWeight: 700, fontSize: '0.72rem' }}>⚠️ ცარიელი</span>
                          }
                        </td>
                        <td className="px-2">
                          <div className="d-flex gap-1 align-items-center">
                            {up && (
                              <button
                                className="btn btn-sm btn-outline-primary py-0 px-2"
                                style={{ fontSize: '0.7rem' }}
                                onClick={() => downloadDoc(up)}
                                title="გადმოტვირთვა"
                              >
                                ⬇️ გადმოტვ.
                              </button>
                            )}
                            {canEdit && !up && (
                              // New upload — pre-fill code+title from catalog
                              <button
                                className="btn btn-sm btn-primary py-0 px-2"
                                style={{ fontSize: '0.7rem' }}
                                title="ატვირთვა"
                                onClick={() => {
                                  setEditing(null);
                                  setPrefill({ code: item.code, title: item.title, category: item.category });
                                  setShowModal(true);
                                }}
                              >
                                📤 ატვირთვა
                              </button>
                            )}
                            {canEdit && up && (
                              <button
                                className="btn btn-sm btn-outline-secondary py-0 px-2"
                                style={{ fontSize: '0.7rem' }}
                                title="განახლება / ჩანაცვლება"
                                onClick={() => {
                                  setEditing(up);
                                  setPrefill(null);
                                  setShowModal(true);
                                }}
                              >
                                ✏️
                              </button>
                            )}
                            {canEdit && up && (
                              <button
                                className="btn btn-sm btn-outline-danger py-0 px-2"
                                style={{ fontSize: '0.7rem' }}
                                title="წაშლა"
                                onClick={() => handleDelete(up)}
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {/* Extra uploaded docs not in standard catalog */}
                  {extraDocs.map(doc => {
                    const ci = catInfo(doc.category);
                    return (
                      <tr key={doc._id} style={{ background: '#f0fdf4' }}>
                        <td className="px-2 text-center">📄</td>
                        <td className="px-2 fw-bold" style={{ fontSize: '0.78rem', color: ci.color }}>{doc.code}</td>
                        <td className="px-2">{doc.title}</td>
                        <td className="px-2">
                          <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: 4, background: ci.bg, color: ci.color, fontWeight: 600 }}>
                            {ci.shortLabel || ci.label}
                          </span>
                        </td>
                        <td className="px-2 text-muted" style={{ fontSize: '0.75rem' }}>{doc.version}</td>
                        <td className="px-2 text-muted" style={{ fontSize: '0.72rem' }}>
                          {new Date(doc.updatedAt).toLocaleDateString('ka-GE')}
                        </td>
                        <td className="px-2 text-center">
                          <span style={{ color: '#15803d', fontWeight: 700, fontSize: '0.72rem' }}>✅</span>
                        </td>
                        <td className="px-2">
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-outline-primary py-0 px-2" style={{ fontSize: '0.7rem' }} onClick={() => downloadDoc(doc)}>⬇️ გადმოტვ.</button>
                            {canEdit && (
                              <>
                                <button className="btn btn-sm btn-outline-secondary py-0 px-2" style={{ fontSize: '0.7rem' }} onClick={() => { setEditing(doc); setPrefill(null); setShowModal(true); }}>✏️</button>
                                <button className="btn btn-sm btn-outline-danger py-0 px-2" style={{ fontSize: '0.7rem' }} onClick={() => handleDelete(doc)}>🗑️</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {mergedList.length === 0 && extraDocs.length === 0 && (
                <div className="text-center py-5 text-muted">ამ კატეგორიაში დოკუმენტი არ მოიძებნა</div>
              )}
            </div>
          )}

          {/* Category legend */}
          {activeCat === 'all' && (
            <div className="mt-3 d-flex flex-wrap gap-2">
              {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
                <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: cat.color }} />
                  <span style={{ color: '#555' }}><strong>{cat.folderLetter}</strong> — {cat.label.replace(/^.+?\s/, '')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ FORMS TAB ═══════════════════════════════════════════════════ */}
      {tab === 'forms' && (
        <div style={{ background: '#fff', border: '1px solid #003366', borderTop: 'none', borderRadius: '0 8px 8px 8px', padding: 20 }}>
          <p className="text-muted small mb-3">
            📝 <strong>შევსება</strong> — ონლაინ შევსება + PDF გენერაცია &nbsp;|&nbsp;
            📄 <strong>ჩამოტვირთვა</strong> — ცარიელი შაბლონი
          </p>
          {FORMS_DATA.map(sec => (
            <div key={sec.section} className="mb-4">
              <div className="d-flex align-items-center mb-2 mt-3">
                <h6 className="fw-bold m-0" style={{ color: '#003366' }}>{sec.section}</h6>
                <div style={{ flex: 1, height: 1, background: '#003366', opacity: 0.15, marginLeft: 10 }} />
              </div>
              <Row className="g-2">
                {sec.items.map(item => (
                  <FormCard key={item.code} {...item} />
                ))}
              </Row>
            </div>
          ))}
        </div>
      )}

      {/* Upload / Edit Modal */}
      <ProcUploadModal
        show={showModal}
        onHide={() => { setShowModal(false); setEditing(null); setPrefill(null); }}
        existing={editing}
        prefill={prefill}
        defaultCategory={
          activeCat !== 'all' ? activeCat
          : prefill?.category || editing?.category || 'procedure'
        }
        onSaved={() => {
          setShowModal(false);
          setEditing(null);
          setPrefill(null);
          fetchDocs();
          setMsg({ type: 'success', text: '✅ დოკუმენტი შენახულია' });
        }}
      />
    </div>
  );
}
