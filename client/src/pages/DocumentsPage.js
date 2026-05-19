import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Link } from 'react-router-dom';

// ── PDF კომპონენტები ─────────────────────────────────────────
import BlankLetterhead            from '../pdf-components/BlankLetterhead';
import BlankApplicationForm       from '../pdf-components/BlankApplicationForm';
import ImpartialityDeclarationPdf from '../pdf-components/ImpartialityDeclarationPdf';
import ConfidentialityAgreementPdf from '../pdf-components/ConfidentialityAgreementPdf';
import FM04_InternalAuditPdf      from '../pdf-components/FM04_InternalAuditPdf';
import FM06_ComplaintAppealPdf    from '../pdf-components/FM06_ComplaintAppealPdf';
import FM07_EquipmentVerificationPdf from '../pdf-components/FM07_EquipmentVerificationPdf';
import FM08_CompetencyAssessmentPdf  from '../pdf-components/FM08_CompetencyAssessmentPdf';
import FM09_ContractReviewPdf     from '../pdf-components/FM09_ContractReviewPdf';
import FM10_CAPAFormPdf           from '../pdf-components/FM10_CAPAFormPdf';
import FM11_InspectionPlanPdf     from '../pdf-components/FM11_InspectionPlanPdf';
import FM12_SubcontractorPdf      from '../pdf-components/FM12_SubcontractorPdf';
import FM13_TrainingRecordNewPdf  from '../pdf-components/FM13_TrainingRecordNewPdf';
import FM14_NonConformingPdf      from '../pdf-components/FM14_NonConformingPdf';
import FM15_MgmtReviewPdf         from '../pdf-components/FM15_MgmtReviewPdf';
import FM16_VisitRecordPdf        from '../pdf-components/FM16_VisitRecordPdf';
import FM21_InspectionRegisterPdf from '../pdf-components/FM21_InspectionRegisterPdf';
import FM22_FamiliarizationPdf    from '../pdf-components/FM22_FamiliarizationPdf';
import FM23_DocChangePdf          from '../pdf-components/FM23_DocChangePdf';
import FM24_ChangeRegisterPdf     from '../pdf-components/FM24_ChangeRegisterPdf';
import FM25_LiquidationActPdf     from '../pdf-components/FM25_LiquidationActPdf';

// ── Fill modal + configs ───────────────────────────────────────
import FormFillModal from '../components/FormFillModal';
import { FORM_CONFIGS } from '../components/formConfigs';

// ── ბარათის კომპონენტი ────────────────────────────────────────
const DocCard = ({ icon, code, title, desc, pdf, fileName, linkTo, color = 'primary', fillConfig }) => {
  const [showFill, setShowFill] = useState(false);

  return (
    <>
      <Col xl={2} lg={3} md={4} sm={6}>
        <Card className="h-100 shadow-sm border-0" style={{ borderTop: `3px solid var(--bs-${color})` }}>
          <Card.Body className="d-flex flex-column p-2 text-center">
            <div className="fs-3 mb-1">{icon}</div>
            <Badge bg={color} className="mb-1" style={{ fontSize: '0.6rem' }}>{code}</Badge>
            <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.78rem', lineHeight: 1.3 }}>{title}</div>
            <p className="text-muted mb-2 flex-grow-1" style={{ fontSize: '0.62rem' }}>{desc}</p>

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
                <PDFDownloadLink document={pdf} fileName={`${fileName}_ცარიელი.pdf`} style={{ textDecoration: 'none' }}>
                  {({ loading }) => (
                    <Button variant={`outline-${color}`} size="sm" className="w-100 fw-bold" style={{ fontSize: '0.68rem', padding: '3px 5px' }}>
                      {loading ? '⏳' : '📄 ცარიელი ჩამოტვირთვა'}
                    </Button>
                  )}
                </PDFDownloadLink>
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
    <p className="text-muted mb-2 small">სსტ ISO/IEC 17020:2012 — A ტიპის საინსპექციო ორგანო | ყველა ფორმა v2.0 | 2026 &nbsp;|&nbsp;
      <span className="text-primary">📝 შევსება</span> — ონლაინ შევსება + ხელმოწერა &nbsp;|&nbsp;
      <span className="text-secondary">📄 ცარიელი ჩამოტვირთვა</span> — ცარიელი PDF
    </p>

    {/* ── 1. ბლანკები / გენერატორები ── */}
    <SectionTitle icon="🏢" title="ბლანკები და გენერატორები" color="#003366" />
    <Row className="g-2">
      <DocCard icon="📄" code="ბლანკი" title="ოფიციალური ბლანკი"    desc="ლოგო და რეკვიზიტები"           pdf={<BlankLetterhead />} fileName="ბილდექს_ბლანკი" color="primary" />
      <DocCard icon="⚖️" code="ბრძანება" title="ბრძანების გენერატორი" desc="დანიშვნა / შვებულება / მივლინება" linkTo="/order-generator" color="primary" />
      <DocCard icon="🤝" code="შრ. ხელშ." title="შრომის ხელშეკრულება"  desc="+ 2 დანართი"                   linkTo="/contract-generator" color="primary" />
      <DocCard icon="📑" code="მომს. ხელშ." title="მომსახურების ხელშეკრულება" desc="BE-PR-01..04"            linkTo="/company-docs" color="primary" />
    </Row>

    {/* ── 2. ინსპექტირების ფორმები ── */}
    <SectionTitle icon="🔍" title="ინსპექტირების ფორმები" color="#0d6efd" />
    <Row className="g-2">
      <DocCard icon="📝" code="FM-18" title="განცხადების ფორმა"       desc="ინსპექციის მოთხოვნა"
        pdf={<BlankApplicationForm />} fileName="FM-18_განცხადება" color="info" />
      <DocCard icon="📋" code="FM-09" title="ხელშეკრულების განხილვა"  desc="ISO §7.1"
        pdf={<FM09_ContractReviewPdf />} fileName="FM-09_ხელშ_განხ" color="info"
        fillConfig={FORM_CONFIGS['FM-09']} />
      <DocCard icon="🗺️" code="FM-11" title="ინსპექციის გეგმა"        desc="ISO §7.1"
        pdf={<FM11_InspectionPlanPdf />} fileName="FM-11_ინსპ_გეგმა" color="info"
        fillConfig={FORM_CONFIGS['FM-11']} />
      <DocCard icon="📍" code="FM-16" title="ვიზიტის ჩანაწერი"        desc="ISO §7.3"
        pdf={<FM16_VisitRecordPdf />} fileName="FM-16_ვიზ_ჩანაწ" color="info"
        fillConfig={FORM_CONFIGS['FM-16']} />
      <DocCard icon="📊" code="FM-21" title="ინსპექციების რეგისტრი"   desc="ISO §7.3 (ჟურნალი)"
        pdf={<FM21_InspectionRegisterPdf />} fileName="FM-21_ინსპ_რეგ" color="info"
        fillConfig={FORM_CONFIGS['FM-21']} />
    </Row>

    {/* ── 3. პერსონალი და კომპეტენცია ── */}
    <SectionTitle icon="👥" title="პერსონალი და კომპეტენცია" color="#198754" />
    <Row className="g-2">
      <DocCard icon="⚖️" code="FM-02" title="მიუკერძოებლობის დეკლარაცია" desc="ISO §4"
        pdf={<ImpartialityDeclarationPdf data={{}} />} fileName="FM-02_მიუკ_დეკლ" color="success"
        fillConfig={FORM_CONFIGS['FM-02']} />
      <DocCard icon="🤐" code="FM-03" title="კონფიდენციალობის შეთანხმება" desc="ISO §5 — 5 წელი"
        pdf={<ConfidentialityAgreementPdf data={{}} />} fileName="FM-03_კონფ_შეთ" color="success"
        fillConfig={FORM_CONFIGS['FM-03']} />
      <DocCard icon="🎯" code="FM-08" title="კომპეტენციის შეფასება"       desc="ISO §6.1"
        pdf={<FM08_CompetencyAssessmentPdf />} fileName="FM-08_კომპ_შეფ" color="success"
        fillConfig={FORM_CONFIGS['FM-08']} />
      <DocCard icon="📚" code="FM-13" title="ტრენინგის ჩანაწერი"          desc="ISO §6.1 — 5 წელი"
        pdf={<FM13_TrainingRecordNewPdf />} fileName="FM-13_ტრენ_ჩანაწ" color="success"
        fillConfig={FORM_CONFIGS['FM-13']} />
    </Row>

    {/* ── 4. ხარისხის მართვა ── */}
    <SectionTitle icon="🛡️" title="ხარისხის მართვა" color="#dc3545" />
    <Row className="g-2">
      <DocCard icon="📣" code="FM-06" title="საჩივარი / აპელაცია"           desc="ISO §7.5/7.7/7.8"
        pdf={<FM06_ComplaintAppealPdf />} fileName="FM-06_საჩ_აპ" color="danger"
        fillConfig={FORM_CONFIGS['FM-06']} />
      <DocCard icon="⚠️" code="FM-10" title="CAPA — მაკორექტირებელი ქმ."   desc="ISO §8.5"
        pdf={<FM10_CAPAFormPdf />} fileName="FM-10_CAPA" color="danger"
        fillConfig={FORM_CONFIGS['FM-10']} />
      <DocCard icon="🚫" code="FM-14" title="შეუსაბამო სამუშაოს მართვა"    desc="ISO §8.7"
        pdf={<FM14_NonConformingPdf />} fileName="FM-14_შეუსაბ" color="danger"
        fillConfig={FORM_CONFIGS['FM-14']} />
      <DocCard icon="🔎" code="FM-04" title="შიდა აუდიტი — გეგმა & ანგარ." desc="ISO §8.6 — წელიწადში 2-ჯერ"
        pdf={<FM04_InternalAuditPdf />} fileName="FM-04_შ_აუდ" color="danger"
        fillConfig={FORM_CONFIGS['FM-04']} />
      <DocCard icon="📈" code="FM-15" title="მართვის ანალიზი — სხდ. ოქმი"  desc="ISO §8.5"
        pdf={<FM15_MgmtReviewPdf />} fileName="FM-15_მენ_ანალ" color="danger"
        fillConfig={FORM_CONFIGS['FM-15']} />
    </Row>

    {/* ── 5. მოწყობილობა და ქვეკონტრაქტირება ── */}
    <SectionTitle icon="🔧" title="მოწყობილობა და ქვეკონტრაქტირება" color="#fd7e14" />
    <Row className="g-2">
      <DocCard icon="🔩" code="FM-07" title="მოწყობილობის ვერიფიკაცია"   desc="ISO §6.2"
        pdf={<FM07_EquipmentVerificationPdf />} fileName="FM-07_მოწყ_ვერ" color="warning"
        fillConfig={FORM_CONFIGS['FM-07']} />
      <DocCard icon="🏗️" code="FM-12" title="ქვეკონტრაქტორის შეფასება"   desc="ISO §6.6"
        pdf={<FM12_SubcontractorPdf />} fileName="FM-12_ქვეკ_შეფ" color="warning"
        fillConfig={FORM_CONFIGS['FM-12']} />
    </Row>

    {/* ── 6. დოკუმენტაციის მართვა ── */}
    <SectionTitle icon="🗂️" title="დოკუმენტაციის მართვა" color="#6f42c1" />
    <Row className="g-2">
      <DocCard icon="👁️" code="FM-22" title="გაცნობის ფურცელი"             desc="ISO §6.1 — 5 სამ. დღე"
        pdf={<FM22_FamiliarizationPdf />} fileName="FM-22_გაცნ_ფ" color="secondary"
        fillConfig={FORM_CONFIGS['FM-22']} />
      <DocCard icon="✍️" code="FM-23" title="ცვლილების წინადადება"         desc="PR-01"
        pdf={<FM23_DocChangePdf />} fileName="FM-23_ცვლ_წინ" color="secondary"
        fillConfig={FORM_CONFIGS['FM-23']} />
      <DocCard icon="📒" code="FM-24" title="ცვლილებების რეგისტრი"         desc="PR-01 (ჟურნალი)"
        pdf={<FM24_ChangeRegisterPdf />} fileName="FM-24_ცვლ_რეგ" color="secondary"
        fillConfig={FORM_CONFIGS['FM-24']} />
      <DocCard icon="🗑️" code="FM-25" title="ლიკვიდაციის (განადგ.) აქტი"  desc="PR-02 §6"
        pdf={<FM25_LiquidationActPdf />} fileName="FM-25_ლიკვ" color="secondary"
        fillConfig={FORM_CONFIGS['FM-25']} />
    </Row>

  </Container>
);

export default DocumentsPage;
