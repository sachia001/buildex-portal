import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PdfDownloadButton from '../components/PdfDownloadButton';

// ── PDF კომპონენტები ─────────────────────────────────────────
import BlankLetterhead               from '../pdf-components/BlankLetterhead';
import BlankApplicationForm          from '../pdf-components/BlankApplicationForm';
import ImpartialityDeclarationPdf    from '../pdf-components/ImpartialityDeclarationPdf';
import ImpartialityGeneralPdf        from '../pdf-components/ImpartialityGeneralPdf';
import ImpartialityPerCasePdf        from '../pdf-components/ImpartialityPerCasePdf';
import ConfidentialityAgreementPdf   from '../pdf-components/ConfidentialityAgreementPdf';
import FM04_InternalAuditPdf         from '../pdf-components/FM04_InternalAuditPdf';
import FM06_ComplaintAppealPdf       from '../pdf-components/FM06_ComplaintAppealPdf';
import FM07_EquipmentVerificationPdf from '../pdf-components/FM07_EquipmentVerificationPdf';
import FM08_CompetencyAssessmentPdf  from '../pdf-components/FM08_CompetencyAssessmentPdf';
import FM09_ContractReviewPdf        from '../pdf-components/FM09_ContractReviewPdf';
import FM10_CAPAFormPdf              from '../pdf-components/FM10_CAPAFormPdf';
import FM11_InspectionPlanPdf        from '../pdf-components/FM11_InspectionPlanPdf';
import FM12_SubcontractorPdf         from '../pdf-components/FM12_SubcontractorPdf';
import FM13_TrainingRecordNewPdf     from '../pdf-components/FM13_TrainingRecordNewPdf';
import FM14_NonConformingPdf         from '../pdf-components/FM14_NonConformingPdf';
import FM15_MgmtReviewPdf            from '../pdf-components/FM15_MgmtReviewPdf';
import FM16_VisitRecordPdf           from '../pdf-components/FM16_VisitRecordPdf';
import FM17_InspectionReportPdf      from '../pdf-components/FM17_InspectionReportPdf';
import FM19_CustomerSatisfactionPdf  from '../pdf-components/FM19_CustomerSatisfactionPdf';
import FM20_ReportVerificationPdf    from '../pdf-components/FM20_ReportVerificationPdf';
import FM21_InspectionRegisterPdf    from '../pdf-components/FM21_InspectionRegisterPdf';
import FM22_FamiliarizationPdf       from '../pdf-components/FM22_FamiliarizationPdf';
import FM23_DocChangePdf             from '../pdf-components/FM23_DocChangePdf';
import FM24_ChangeRegisterPdf        from '../pdf-components/FM24_ChangeRegisterPdf';
import FM25_LiquidationActPdf        from '../pdf-components/FM25_LiquidationActPdf';
import FM26_AuditPlanPdf             from '../pdf-components/FM26_AuditPlanPdf';
import FM27_AuditChecklistPdf        from '../pdf-components/FM27_AuditChecklistPdf';
import FM28_AuditReportPdf           from '../pdf-components/FM28_AuditReportPdf';
import FM29_AuditNCFormPdf           from '../pdf-components/FM29_AuditNCFormPdf';
import FM30_AuditMeetingPdf          from '../pdf-components/FM30_AuditMeetingPdf';
import FM31_AuditProgramPdf          from '../pdf-components/FM31_AuditProgramPdf';
import FM01_ApplicationRegistrationPdf from '../pdf-components/FM01_ApplicationRegistrationPdf';
import FM05_ContractAcceptancePdf      from '../pdf-components/FM05_ContractAcceptancePdf';
import FM33_ImpartialityRiskPdf        from '../pdf-components/FM33_ImpartialityRiskPdf';
import FM34_EquipmentCardPdf           from '../pdf-components/FM34_EquipmentCardPdf';
import FM35_SubcontractorMonitoringPdf from '../pdf-components/FM35_SubcontractorMonitoringPdf';

// ── Fill modal + configs ───────────────────────────────────────
import FormFillModal from '../components/FormFillModal';
import { FORM_CONFIGS } from '../components/formConfigs';

// ── Instruction modal ──────────────────────────────────────────
import InstructionModal from '../components/InstructionModal';

// ── Word doc generator ─────────────────────────────────────────
import { downloadWordDoc } from '../utils/wordDocGenerator';
import { WORD_LAYOUTS }    from '../utils/wordLayouts';

// ── ახალი ფორმები (BE-PR სამუშაო ნაკადი) ───────────────────────
import GenericFormPdf from '../pdf-components/GenericFormPdf';
import ReportCoverPdf from '../pdf-components/ReportCoverPdf';
import NEW_FORMS      from '../components/newFormDefinitions.json';
import { newFormToConfig } from '../utils/newFormToConfig';

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

// ახალი ფორმების ბარათი — ონლაინ შევსება (FormFillModal + GenericFormPdf) + PDF/Word ჩამოტვირთვა
const NewFormCard = ({ form, color = 'info' }) => {
  const [showFill, setShowFill] = useState(false);
  const fileName = `${form.code} — ${form.title}`;
  const fillCfg = newFormToConfig(form);
  const hasFill = fillCfg && fillCfg.sections.length > 0;
  const handleWord = () => downloadWordDoc({
    title: form.title,
    code: form.code,
    fileName,
    sections: formToWordSections(form),
    signers: form.signers,
    isoRef: form.isoRef,
  });
  return (
    <Col xl={2} lg={3} md={4} sm={6}>
      <Card className="h-100 shadow-sm border-0" style={{ borderTop: `3px solid var(--bs-${color})` }}>
        <Card.Body className="d-flex flex-column p-2 text-center">
          <div className="fs-3 mb-1">📋</div>
          <Badge bg={color} className="mb-1" style={{ fontSize: '0.6rem' }}>{form.code}</Badge>
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
              label="📄 PDF ჩამოტვ." />
            <Button variant="outline-secondary" size="sm" className="w-100 fw-bold"
              style={{ fontSize: '0.68rem', padding: '3px 5px' }} onClick={handleWord}>
              📝 Word ჩამოტვ.
            </Button>
          </div>
        </Card.Body>
      </Card>
      {hasFill && (
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

const findForm = (code) => NEW_FORMS.find((f) => f.code === code);

// დამატებითი სამუშაო-ნაკადის ფორმები, განაწილებული ძირითად სექციებში შესაბამისი ჯგუფის მიხედვით
const EXTRA_INSPECTION = [
  'BE-FM-ACK','BE-FM-EST','BE-FM-DECLINE','BE-FM-DOC-REQ','BE-FM-DOC-CHECK',
  'BE-FM-NORM-PROFILE','BE-FM-OFFER','BE-FM-CONTRACT','BE-FM-CONTRACT-REGISTRY','BE-FM-ORD','BE-FM-NOTIFY',
  'BE-FM-FIELD-LOG','BE-FM-MEASURE','BE-FM-OBSERVATION','BE-FM-PHOTO-LOG','BE-FM-COMPARE','BE-FM-CALC','BE-FM-NORM-CHECK','BE-FM-FINDING',
  'BE-FM-QM-CHECK','BE-FM-IR-REGISTRY','BE-FM-DELIVERY-LETTER','BE-FM-ACCEPT-ACT',
];
const EXTRA_PERSONNEL = ['BE-FM-COMP','BE-FM-IMP-GEN','BE-FM-IMP-CHECK','BE-FM-IMP-COMMITTEE'];
const EXTRA_QUALITY   = ['BE-FM-APPEAL'];

const renderExtras = (codes, color) =>
  codes.map((code) => { const f = findForm(code); return f ? <NewFormCard key={code} form={f} color={color} /> : null; });

// ── ბარათის კომპონენტი ────────────────────────────────────────
const DocCard = ({ icon, code, title, desc, pdf, fileName, linkTo, color = 'primary', fillConfig, instrKey, wordIsoRef }) => {
  const [showFill,  setShowFill]  = useState(false);
  const [showInstr, setShowInstr] = useState(false);

  const handleWordDownload = () => {
    const layout = WORD_LAYOUTS[code] || {};
    downloadWordDoc({
      title,
      code,
      fileName,
      sections: layout.sections  || fillConfig?.sections || [],
      signers:  layout.signers   || fillConfig?.signers,
      isoRef:   layout.isoRef    || wordIsoRef || 'სსტ ISO/IEC 17020',
    });
  };

  return (
    <>
      <Col xl={2} lg={3} md={4} sm={6}>
        <Card className="h-100 shadow-sm border-0" style={{ borderTop: `3px solid var(--bs-${color})` }}>
          <Card.Body className="d-flex flex-column p-2 text-center">
            <div className="fs-3 mb-1">{icon}</div>
            <Badge bg={color} className="mb-1" style={{ fontSize: '0.6rem' }}>{code}</Badge>
            <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.78rem', lineHeight: 1.3 }}>{title}</div>
            <p className="text-muted mb-2 flex-grow-1" style={{ fontSize: '0.62rem' }}>{desc}</p>

            {/* ── ინსტრუქციის ღილაკი ── */}
            {instrKey && (
              <Button
                variant={`outline-${color}`}
                size="sm"
                className="w-100 fw-bold mb-1"
                style={{ fontSize: '0.66rem', padding: '2px 5px' }}
                onClick={() => setShowInstr(true)}
              >
                📖 ინსტრუქცია
              </Button>
            )}

            {linkTo ? (
              <Button as={Link} to={linkTo} variant={color} size="sm" className="w-100 fw-bold" style={{ fontSize: '0.68rem', padding: '3px 5px' }}>
                ⚙️ შექმნა
              </Button>
            ) : (
              <div className="d-flex flex-column gap-1">
                {fillConfig && (
                  <Button
                    variant={color}
                    size="sm"
                    className="w-100 fw-bold"
                    style={{ fontSize: '0.68rem', padding: '3px 5px' }}
                    onClick={() => setShowFill(true)}
                  >
                    📝 შევსება
                  </Button>
                )}
                <PdfDownloadButton
                  document={pdf}
                  fileName={`${fileName}_ცარიელი`}
                  className={`btn btn-outline-${color} btn-sm w-100 fw-bold`}
                  style={{ fontSize: '0.68rem', padding: '3px 5px', textDecoration: 'none' }}
                  label="📄 PDF ჩამოტვ." />
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="w-100 fw-bold"
                  style={{ fontSize: '0.68rem', padding: '3px 5px' }}
                  onClick={handleWordDownload}
                >
                  📝 Word ჩამოტვ.
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>

      {fillConfig && (
        <FormFillModal
          show={showFill}
          onHide={() => setShowFill(false)}
          config={fillConfig}
          pdfComponent={pdf}
          pdfFileName={fileName}
          formCode={code}
        />
      )}

      {instrKey && (
        <InstructionModal
          show={showInstr}
          onHide={() => setShowInstr(false)}
          instrKey={instrKey}
          color={color}
        />
      )}
    </>
  );
};

// ── სექციის სათაური ─────────────────────────────────────────
const SectionTitle = ({ icon, title, color = '#003366' }) => (
  <div className="d-flex align-items-center mb-3 mt-4">
    <div style={{ fontSize: '1.3rem', marginRight: 8 }}>{icon}</div>
    <h6 className="fw-bold m-0" style={{ color }}>{title}</h6>
    <div style={{ flex: 1, height: 1, backgroundColor: color, opacity: 0.2, marginLeft: 10 }} />
  </div>
);

// ════════════════════════════════════════════════════════════
const DocumentsPage = () => (
  <Container className="mt-4 pb-5 font-georgian">
    <h4 className="fw-bold mb-1 text-dark">📂 დოკუმენტების შაბლონები</h4>
    <p className="text-muted mb-2 small">სსტ ISO/IEC 17020:2012 — A ტიპის საინსპექციო ორგანო | ყველა ფორმა v1.0 | 2026 &nbsp;|&nbsp;
      <span className="text-primary">📝 შევსება</span> — ონლაინ შევსება + ხელმოწერა &nbsp;|&nbsp;
      <span className="text-secondary">📄 ცარიელი ჩამოტვირთვა</span> — ცარიელი PDF
    </p>

    {/* ── 1. ბლანკები / გენერატორები ── */}
    <SectionTitle icon="🏢" title="ბლანკები და გენერატორები" color="#003366" />
    <Row className="g-2">
      <DocCard icon="📄" code="ბლანკი" title="ოფიციალური ბლანკი"
        desc="ადრესატი, სათაური, ტექსტი — გამოიყენება გამავალი წერილებისა და შიდა ბრძანებებისთვის"
        pdf={<BlankLetterhead />} fileName="ბილდექს_ბლანკი" color="primary"
        fillConfig={FORM_CONFIGS['BLANK']} instrKey="BLANK" />
      <DocCard icon="⚖️" code="ბრძანება" title="ბრძანების გენერატორი"
        desc="ავტომატური ბრძანება — დანიშვნა, შვებულება, მივლინება; ავტომატური ნომრაცია და თარიღი"
        linkTo="/order-generator" color="primary" />
      <DocCard icon="🤝" code="შრომის ხელშეკრულება" title="შრომის ხელშეკრულება"
        desc="შრომის ხელშეკრულება + 2 სავალდებულო დანართი — ავტომატური ნომრაცია და გვერდები"
        linkTo="/contract-generator" color="primary" />
      <DocCard icon="📑" code="მომსახურების ხელშეკრულება" title="მომსახურების ხელშეკრულება"
        desc="კლიენტთან მომსახურების ხელშეკრულება — BE-PR-01..04 სფეროების ჩამატება, ფასი, ვადები"
        linkTo="/company-docs" color="primary" />
    </Row>

    {/* ── 2. ინსპექტირების ფორმები ── */}
    <SectionTitle icon="🔍" title="ინსპექტირების ფორმები" color="#0d6efd" />
    <Row className="g-2">
      <DocCard icon="📝" code="BE-FM-APP" title="განცხადების ფორმა"
        desc="ISO §7.1 — კლიენტი ავსებს: ორგანიზაცია, წარმომადგენელი, ობიექტი, სფეროს შერჩევა (BE-PR-01..04), თანდართული დოკუმენტაცია"
        pdf={<BlankApplicationForm />} fileName="BE-FM-18_განცხადება" color="info"
        fillConfig={FORM_CONFIGS['BE-FM-APP']} instrKey="BE-FM-APP" />
      <DocCard icon="📋" code="BE-FM-REG" title="მოთხოვნის სარეგისტრაციო ფორმა"
        desc="ISO §7.1 — BE-CASE №, თარიღი, კლიენტის მონაცემები, ობიექტი, წარდგენილი დოკუმენტაცია, ტექნიკური მენეჯერის წინასწარი შეფასება; ყველა საქმის გახსნის ეტაპი"
        pdf={<FM01_ApplicationRegistrationPdf data={{}} />} fileName="BE-FM-01_მოთ_სარ" color="info"
        fillConfig={FORM_CONFIGS['BE-FM-REG']} instrKey="BE-FM-REG" />
      <DocCard icon="✅" code="BE-FM-SCREEN" title="ხელშეკრულების განხილვა და სამუშაოს მიღება"
        desc="ISO §7.1 — Decision Gate: ISO §7.1.1 კრიტერიუმები, იურიდიული ბაზის შემოწმება, შესაძლებლობის კონტროლი, გადაწყვეტილება (მიღება/უარყოფა/გადადება); ყველა საქმეზე"
        pdf={<FM05_ContractAcceptancePdf data={{}} />} fileName="BE-FM-05_ხელ_გად" color="info"
        fillConfig={FORM_CONFIGS['BE-FM-SCREEN']} instrKey="BE-FM-SCREEN" />
      <DocCard icon="📋" code="BE-FM-CONTRACT-REVIEW" title="ხელშეკრულების განხილვა"
        desc="ISO §7.1 — კლიენტის მოთხოვნები, ინსპექციის სფერო, ვადები, კონფლიქტის შემოწმება, ხარისხის მენეჯერის ვიზა"
        pdf={<FM09_ContractReviewPdf />} fileName="BE-FM-09_ხელშ_განხ" color="info"
        fillConfig={FORM_CONFIGS['BE-FM-CONTRACT-REVIEW']} instrKey="BE-FM-CONTRACT-REVIEW" />
      <DocCard icon="🗺️" code="BE-FM-PLAN" title="ინსპექციის გეგმა"
        desc="ISO §7.1 — ვიზიტის თარიღი, ინსპექტორი, ეტაპები, მოქმედი სტანდარტები, მოთხოვნილი საბუთები, ხელშეკრულების №"
        pdf={<FM11_InspectionPlanPdf />} fileName="BE-FM-11_ინსპ_გეგმა" color="info"
        fillConfig={FORM_CONFIGS['BE-FM-PLAN']} instrKey="BE-FM-PLAN" />
      <DocCard icon="📍" code="BE-FM-VISIT" title="ვიზიტის ჩანაწერი"
        desc="ISO §7.3 — ვიზიტის ნომერი, ობიექტი, ინსპექტორი, 3 შემოწმება, 5 დეფექტი, ფოტო-დოკუმენტაცია, შეუსაბამობები"
        pdf={<FM16_VisitRecordPdf />} fileName="BE-FM-16_ვიზ_ჩანაწ" color="info"
        fillConfig={FORM_CONFIGS['BE-FM-VISIT']} instrKey="BE-FM-VISIT" />
      <DocCard icon="📊" code="BE-FM-IR" title="ინსპექტირების ანგარიში"
        desc="ISO §7.4 — BE-CASE, ობიექტი, გამოყენებული სტანდარტები, 6 შემოწმებული ელემენტი, მიგნებები, დასკვნა, ხელმოწერები"
        pdf={<ReportCoverPdf data={{}} />} fileName="BE-FM-IR_ინსპ_ანგარიში" color="info"
        fillConfig={FORM_CONFIGS['BE-FM-IR']} instrKey="BE-FM-IR" />
      <DocCard icon="📒" code="BE-FM-INSP-REG" title="ინსპექციების რეგისტრი"
        desc="ISO §7.3 ჟურნალი — ყველა საქმე ერთ ადგილას, პერიოდი, ხარისხის მენეჯერის ვიზა; ყოველწლიური გახსნა"
        pdf={<FM21_InspectionRegisterPdf />} fileName="BE-FM-21_ინსპ_რეგ" color="info"
        fillConfig={FORM_CONFIGS['BE-FM-INSP-REG']} instrKey="BE-FM-INSP-REG" />
      {renderExtras(EXTRA_INSPECTION, 'info')}
    </Row>

    {/* ── 3. პერსონალი და კომპეტენცია ── */}
    <SectionTitle icon="👥" title="პერსონალი და კომპეტენცია" color="#198754" />
    <Row className="g-2">
      <DocCard icon="⚖️" code="BE-FM-IMP-DECL" title="მიუკერძოებლობის დეკლარაცია"
        desc="ISO §4 — პირადი მონაცემები, 4 ავტორიზებული სფერო (BE-PR-01..04), 5 კონფლიქტის კატეგორია კი/არა, ხელმოწერა"
        pdf={<ImpartialityDeclarationPdf data={{}} />} fileName="BE-FM-02_მიუკ_დეკლ" color="success"
        fillConfig={FORM_CONFIGS['BE-FM-IMP-DECL']} instrKey="BE-FM-IMP-DECL" />
      <DocCard icon="🤐" code="BE-FM-CONF" title="კონფიდენციალობის შეთანხმება"
        desc="ISO §5 — სახელი/გვარი, თანამდებობა, თარიღი; 5 წლიანი შენახვის ვადა; ორივე მხარის ხელმოწერა"
        pdf={<ConfidentialityAgreementPdf data={{}} />} fileName="BE-FM-03_კონფ_შეთ" color="success"
        fillConfig={FORM_CONFIGS['BE-FM-CONF']} instrKey="BE-FM-CONF" />
      <DocCard icon="🎯" code="BE-FM-COMP-CHECK" title="კომპეტენციის შეფასება"
        desc="ISO §6.1 — 6 შეფასების კრიტერიუმი (კი/არა), 4 ინსპ. სფერო × ქულა 1–5, სტატუსი და გადაწყვეტილება"
        pdf={<FM08_CompetencyAssessmentPdf />} fileName="BE-FM-08_კომპ_შეფ" color="success"
        fillConfig={FORM_CONFIGS['BE-FM-COMP-CHECK']} instrKey="BE-FM-COMP-CHECK" />
      <DocCard icon="⚖️" code="BE-FM-IMP-RISK" title="მიუკერძოებლობის რისკების შეფასება"
        desc="ISO §4.1 — Risk Matrix G×A, 5 რისკის ჩანაწერი, საერთო დონე (დაბალი/საშუალო/მაღალი), კონტროლის ზომები; BE-FM-IMP-DECL-ის გამოყენების ინსტრუქცია"
        pdf={<FM33_ImpartialityRiskPdf data={{}} />} fileName="BE-FM-33_მიუკ_რ" color="success"
        fillConfig={FORM_CONFIGS['BE-FM-IMP-RISK']} instrKey="BE-FM-IMP-RISK" />
      <DocCard icon="📚" code="BE-FM-TRAIN" title="ტრენინგის ჩანაწერი"
        desc="ISO §6.1 — სახელი, ტრენინგის სახეობა, ხანგრძლივობა, ორგანიზატორი, კომპეტენციის მეთოდი, სტატუსი, მომდევნო ვადა"
        pdf={<FM13_TrainingRecordNewPdf />} fileName="BE-FM-13_ტრენ_ჩანაწ" color="success"
        fillConfig={FORM_CONFIGS['BE-FM-TRAIN']} instrKey="BE-FM-TRAIN" />
      <DocCard icon="📋" code="HR ბრძანება" title="HR ბრძანების გენერატორი"
        desc="დასაქმების, შვებულების, მივლინების ბრძანებები — ავტომატური ნომრაცია, თარიღი, დირექტორის ხელმოწ."
        linkTo="/order-generator" color="success" />
      <DocCard icon="🤝" code="HR ხელშეკრულება" title="შრომის ხელშეკრულება"
        desc="სრული HR პაკეტი — შრომითი ხელშეკრულება + ინსტრუქცია + მატერიალური პასუხისმგებლობა; ყველა ახალ თანამშრომელზე"
        linkTo="/contract-generator" color="success" />
      {renderExtras(EXTRA_PERSONNEL, 'success')}
    </Row>

    {/* ── 4. ხარისხის მართვა ── */}
    <SectionTitle icon="🛡️" title="ხარისხის მართვა" color="#dc3545" />
    <Row className="g-2">
      <DocCard icon="📣" code="BE-FM-COMPLAINT" title="საჩივარი / აპელაცია"
        desc="ISO §7.5/7.7 — შეტანის ინფორმაცია, ტიპი, ფაქტობრივი მდგომარეობის აღწერა, CAPA ნომერი, 3 ეტაპი, საბოლოო გადაწყვეტილება"
        pdf={<FM06_ComplaintAppealPdf />} fileName="BE-FM-06_საჩ_აპ" color="danger"
        fillConfig={FORM_CONFIGS['BE-FM-COMPLAINT']} instrKey="BE-FM-COMPLAINT" />
      <DocCard icon="⚠️" code="BE-FM-CAPA" title="CAPA — მაკორექტირებელი ქმედება"
        desc="ISO §8.5 — NC/HA ნომერი, ტიპი, ფაქტობრივი მდგომარეობის აღწერა, მაკორექტირებელი ქმედება + ვადა, ეფექტურობის შემოწმება, ვიზა"
        pdf={<FM10_CAPAFormPdf />} fileName="BE-FM-10_CAPA" color="danger"
        fillConfig={FORM_CONFIGS['BE-FM-CAPA']} instrKey="BE-FM-CAPA" />
      <DocCard icon="🚫" code="BE-FM-NONCONF" title="შეუსაბამო სამუშაოს მართვა"
        desc="ISO §8.7 — NC ნომერი, გამოვლენის თარიღი, გადაუდებელი ქმედება, ფაქტობრივი მდგომარეობა, CAPA ნომერი, დახურვის ვადა"
        pdf={<FM14_NonConformingPdf />} fileName="BE-FM-14_შეუსაბ" color="danger"
        fillConfig={FORM_CONFIGS['BE-FM-NONCONF']} instrKey="BE-FM-NONCONF" />
      <DocCard icon="📈" code="BE-FM-MGMT-REVIEW" title="მართვის ანალიზი — სხდომის ოქმი"
        desc="ISO §8.9 — სხდომის ნომერი, მონაწილეები, შეყვანის 7 პუნქტი, 4 გადაწყვეტილება + ვადა, ეფექტურობის შეფასება"
        pdf={<FM15_MgmtReviewPdf />} fileName="BE-FM-15_მენ_ანალ" color="danger"
        fillConfig={FORM_CONFIGS['BE-FM-MGMT-REVIEW']} instrKey="BE-FM-MGMT-REVIEW" />
      <DocCard icon="😊" code="BE-FM-SATISF" title="მომხმარებლის კმაყოფილება"
        desc="ISO §8.5 — 8 შეფასების კრიტერიუმი (1–5), 3 დამატებითი კითხვა, შენიშვნები; საშუალო ქულა ≥4.0 ნიშნავს კმაყოფილებას"
        pdf={<FM19_CustomerSatisfactionPdf />} fileName="BE-FM-19_კმაყ_კვლ" color="danger"
        fillConfig={FORM_CONFIGS['BE-FM-SATISF']} instrKey="BE-FM-SATISF" />
      <DocCard icon="✅" code="BE-FM-TECH-REVIEW" title="ანგარიშის ტექნიკური გადამოწმება"
        desc="ISO §7.4 — 10 შემოწმების კრიტერიუმი (კი/არა/N/A), გადამოწმების შედეგი, შენიშვნები; ტექნიკური მენეჯერი ვიზირებს"
        pdf={<FM20_ReportVerificationPdf />} fileName="BE-FM-20_ანგ_გადამ" color="danger"
        fillConfig={FORM_CONFIGS['BE-FM-TECH-REVIEW']} instrKey="BE-FM-TECH-REVIEW" />
      {renderExtras(EXTRA_QUALITY, 'danger')}
    </Row>

    {/* ── 5. მოწყობილობა და ქვეკონტრაქტირება ── */}
    <SectionTitle icon="🔧" title="მოწყობილობა და ქვეკონტრაქტირება" color="#fd7e14" />
    <Row className="g-2">
      <DocCard icon="🔩" code="BE-FM-EQ-CHECK" title="მოწყობილობის ვერიფიკაცია"
        desc="ISO §6.2 — დასახელება, სერიული ნომერი, კალიბრაციის ვადა, შემდეგი კალიბრაციის ვადა, ინტერვალი, კლასი, სტატუსი, ვიზა"
        pdf={<FM07_EquipmentVerificationPdf />} fileName="BE-FM-07_მოწყ_ვერ" color="warning"
        fillConfig={FORM_CONFIGS['BE-FM-EQ-CHECK']} instrKey="BE-FM-EQ-CHECK" />
      <DocCard icon="🏗️" code="BE-FM-SUB-MONITOR" title="ქვეკონტრაქტორის შეფასება"
        desc="ISO §6.6 — დასახელება, 6 შეფასების კრიტერიუმი (კი/არა), ჯამური ქულა (0–6), სტატუსი, ვიზა"
        pdf={<FM12_SubcontractorPdf />} fileName="BE-FM-12_ქვეკ_შეფ" color="warning"
        fillConfig={FORM_CONFIGS['BE-FM-SUB-MONITOR']} instrKey="BE-FM-SUB-MONITOR" />
      <DocCard icon="🗂️" code="BE-FM-EQ-CARD" title="აღჭურვილობის სარეგისტრაციო ბარათი"
        desc="ISO §6.2 — საიდენტიფიკაციო კოდი №, სტატუსი, მოდელი, სერიული №, კალიბრაციის ინფორმაცია, სერტიფიკატის №, კალიბრაციის ისტორიის ცხრილი, გამოყენების ჩანაწერი; მუდმივი ბარათი"
        pdf={<FM34_EquipmentCardPdf data={{}} />} fileName="BE-FM-34_აღჭ_ბ" color="warning"
        fillConfig={FORM_CONFIGS['BE-FM-EQ-CARD']} instrKey="BE-FM-EQ-CARD" />
    </Row>

    {/* ── 6. დოკუმენტაციის მართვა ── */}
    <SectionTitle icon="🗂️" title="დოკუმენტაციის მართვა" color="#6f42c1" />
    <Row className="g-2">
      <DocCard icon="👁️" code="BE-FM-FAMIL" title="გაცნობის ფურცელი"
        desc="BE-PR-05 — დოკუმენტის სახელი, ძველი → ახალი ვერსია, ცვლილების აღწერა, 5 სამუშაო დღის ვადა, ყველა პერსონალის ხელმოწერა"
        pdf={<FM22_FamiliarizationPdf />} fileName="BE-FM-22_გაცნ_ფ" color="secondary"
        fillConfig={FORM_CONFIGS['BE-FM-FAMIL']} instrKey="BE-FM-FAMIL" />
      <DocCard icon="✍️" code="BE-FM-CHANGE-INIT" title="ცვლილების წინადადება"
        desc="BE-PR-05 — ინიციატორი, DCR ნომერი, ძველი/ახალი ტექსტი, მიზეზი, მოწონება/უარყოფა გადაწყვეტილება, ძალაში შესვლის ვადა"
        pdf={<FM23_DocChangePdf />} fileName="BE-FM-23_ცვლ_წინ" color="secondary"
        fillConfig={FORM_CONFIGS['BE-FM-CHANGE-INIT']} instrKey="BE-FM-CHANGE-INIT" />
      <DocCard icon="📒" code="BE-FM-CHANGE-REG" title="ცვლილებების რეგისტრი"
        desc="BE-PR-05 ჟურნალი — ყველა ცვლილება ერთ ადგილას, პერიოდი, ხარისხის მენეჯერის ვიზა; ათწლიანი შენახვის ვადა"
        pdf={<FM24_ChangeRegisterPdf />} fileName="BE-FM-24_ცვლ_რეგ" color="secondary"
        fillConfig={FORM_CONFIGS['BE-FM-CHANGE-REG']} instrKey="BE-FM-CHANGE-REG" />
      <DocCard icon="🗑️" code="BE-FM-DESTROY-ACT" title="ლიკვიდაციის (განადგ.) აქტი"
        desc="BE-PR-06 §6 — დოკუმენტების სია, განადგურების მეთოდი, ყველა ასლის განადგ. დადასტ., BE-FM-CHANGE-REG განახლება, ვიზა"
        pdf={<FM25_LiquidationActPdf />} fileName="BE-FM-25_ლიკვ" color="secondary"
        fillConfig={FORM_CONFIGS['BE-FM-DESTROY-ACT']} instrKey="BE-FM-DESTROY-ACT" />
    </Row>

    {/* ── 7. შიდა აუდიტი (BE-FM-AUDIT-PLAN – BE-FM-AUDIT-PROGRAM) ── */}
    <SectionTitle icon="🔬" title="შიდა აუდიტი — ISO §8.6" color="#6610f2" />
    <Row className="g-2">
      <DocCard icon="📅" code="BE-FM-AUDIT-PLAN" title="შიდა აუდიტის გეგმა"
        desc="ISO §8.6 — აუდიტის ნომერი, პერიოდი, აუდიტორი, აუდიტირებული პირი, ISO პარაგრაფები (×10), სტატუსი; ხელმოწ. სავალდებულო"
        pdf={<FM26_AuditPlanPdf />} fileName="BE-FM-26_შ_აუდ_გ" color="info"
        fillConfig={FORM_CONFIGS['BE-FM-AUDIT-PLAN']} instrKey="BE-FM-AUDIT-PLAN" />
      <DocCard icon="☑️" code="BE-FM-AUDIT-CHECK" title="შიდა აუდიტის ჩეკლისტი"
        desc="ISO §8.6 — §4 → §9 ყოველი პუნქტი შეყვანილია/არ შეყვანილია/NC; NC-ების სია; საერთო შეფასება"
        pdf={<FM27_AuditChecklistPdf />} fileName="BE-FM-27_შ_აუდ_ჩ" color="info"
        fillConfig={FORM_CONFIGS['BE-FM-AUDIT-CHECK']} instrKey="BE-FM-AUDIT-CHECK" />
      <DocCard icon="📋" code="BE-FM-AUDIT-REPORT" title="შიდა აუდიტის ანგარიში"
        desc="ISO §8.6 — ძირითადი მიგნებები, NC-ების სია + BE-FM-CAPA ბმა, ISO §§, საბოლოო შეფასება; ატვირთვა 5 სამუშაო დღეში"
        pdf={<FM28_AuditReportPdf />} fileName="BE-FM-28_შ_აუდ_ა" color="info"
        fillConfig={FORM_CONFIGS['BE-FM-AUDIT-REPORT']} instrKey="BE-FM-AUDIT-REPORT" />
      <DocCard icon="⛔" code="BE-FM-AUDIT-NC" title="აუდიტის შეუსაბამობის ფორმა"
        desc="ISO §8.6/8.7 — NC ნომერი, ISO პარაგრაფი, კატეგორია, აღწერა; 5-Why ანალიზი; CAPA BE-FM-CAPA; ეფექტურობის შემოწმება"
        pdf={<FM29_AuditNCFormPdf />} fileName="BE-FM-29_ა_შ_ო_ფ" color="danger"
        fillConfig={FORM_CONFIGS['BE-FM-AUDIT-NC']} instrKey="BE-FM-AUDIT-NC" />
      <DocCard icon="🤝" code="BE-FM-AUDIT-MEETING" title="აუდიტის შეხვედრის ოქმი"
        desc="ISO §8.6 — გახსნის/დახურვის შეხვედრა, NC სტატუსი (closing), შეხვედრის მონაწილეები; შემმოწ. საბოლოო ვიზა"
        pdf={<FM30_AuditMeetingPdf />} fileName="BE-FM-30_ა_შ_ო" color="warning"
        fillConfig={FORM_CONFIGS['BE-FM-AUDIT-MEETING']} instrKey="BE-FM-AUDIT-MEETING" />
      <DocCard icon="📆" code="BE-FM-AUDIT-PROGRAM" title="შიდა აუდიტის პროგრამა (წლიური)"
        desc="ISO §8.6 — წლიური გეგმა, 10 აუდიტი × (ობიექტი + აუდიტირება + კვარტალი + სტატუსი); ISO §8.6 კონფორმულობა"
        pdf={<FM31_AuditProgramPdf />} fileName="BE-FM-31_ა_პ_წ_გ" color="warning"
        fillConfig={FORM_CONFIGS['BE-FM-AUDIT-PROGRAM']} instrKey="BE-FM-AUDIT-PROGRAM" />
    </Row>

  </Container>
);

export default DocumentsPage;
