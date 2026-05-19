import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Link } from 'react-router-dom';

// ── არსებული PDF კომპონენტები ──────────────────────────────
import BlankLetterhead          from '../pdf-components/BlankLetterhead';
import BlankApplicationForm     from '../pdf-components/BlankApplicationForm';
import ImpartialityDeclarationPdf from '../pdf-components/ImpartialityDeclarationPdf';
import ConfidentialityAgreementPdf from '../pdf-components/ConfidentialityAgreementPdf';

// ── ახალი FM ფორმები ───────────────────────────────────────
import FM04_InternalAuditPdf    from '../pdf-components/FM04_InternalAuditPdf';
import FM06_ComplaintAppealPdf  from '../pdf-components/FM06_ComplaintAppealPdf';
import FM07_EquipmentVerificationPdf from '../pdf-components/FM07_EquipmentVerificationPdf';
import FM08_CompetencyAssessmentPdf  from '../pdf-components/FM08_CompetencyAssessmentPdf';
import FM09_ContractReviewPdf   from '../pdf-components/FM09_ContractReviewPdf';
import FM10_CAPAFormPdf         from '../pdf-components/FM10_CAPAFormPdf';
import FM11_InspectionPlanPdf   from '../pdf-components/FM11_InspectionPlanPdf';
import FM12_SubcontractorPdf    from '../pdf-components/FM12_SubcontractorPdf';
import FM13_TrainingRecordNewPdf from '../pdf-components/FM13_TrainingRecordNewPdf';
import FM14_NonConformingPdf    from '../pdf-components/FM14_NonConformingPdf';
import FM15_MgmtReviewPdf       from '../pdf-components/FM15_MgmtReviewPdf';
import FM16_VisitRecordPdf      from '../pdf-components/FM16_VisitRecordPdf';
import FM21_InspectionRegisterPdf from '../pdf-components/FM21_InspectionRegisterPdf';
import FM22_FamiliarizationPdf  from '../pdf-components/FM22_FamiliarizationPdf';
import FM23_DocChangePdf        from '../pdf-components/FM23_DocChangePdf';
import FM24_ChangeRegisterPdf   from '../pdf-components/FM24_ChangeRegisterPdf';
import FM25_LiquidationActPdf   from '../pdf-components/FM25_LiquidationActPdf';

// ── ერთი ბარათი ────────────────────────────────────────────
const DocCard = ({ icon, code, title, desc, pdf, fileName, linkTo, color = 'primary' }) => (
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
          <PDFDownloadLink document={pdf} fileName={fileName} style={{ textDecoration: 'none' }}>
            {({ loading }) => (
              <Button variant={`outline-${color}`} size="sm" className="w-100 fw-bold" style={{ fontSize: '0.68rem', padding: '3px 5px' }}>
                {loading ? '⏳' : '📥 ჩ/ტვ.'}
              </Button>
            )}
          </PDFDownloadLink>
        )}
      </Card.Body>
    </Card>
  </Col>
);

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
    <p className="text-muted mb-2 small">სსტ ISO/IEC 17020:2012 — A ტიპის ინსპექტირების ორგანო | ყველა ფორმა v2.0 | 2026</p>

    {/* ── 1. ბლანკები / გენერატორები ── */}
    <SectionTitle icon="🏢" title="ბლანკები და გენერატორები" color="#003366" />
    <Row className="g-2">
      <DocCard icon="📄" code="ბლანკი" title="ოფიციალური ბლანკი" desc="ლოგო და რეკვიზიტები" pdf={<BlankLetterhead />} fileName="ბილდექს_ბლანკი.pdf" color="primary" />
      <DocCard icon="⚖️" code="ბრძ." title="ბრძ. გენერატ." desc="დანიშვნა / შვებ. / მივ." linkTo="/order-generator" color="primary" />
      <DocCard icon="🤝" code="შრ.ხ." title="შრ. ხელშეკრ." desc="+ 2 დანართი" linkTo="/contract-generator" color="primary" />
      <DocCard icon="📑" code="SC" title="მომს. ხელშეკრ." desc="BE-PR-01..04 სფ." linkTo="/company-docs" color="primary" />
    </Row>

    {/* ── 2. ინსპექტირება ── */}
    <SectionTitle icon="🔍" title="ინსპექტირების ფორმები" color="#0d6efd" />
    <Row className="g-2">
      <DocCard icon="📝" code="FM-18" title="განცხადების ფორმა" desc="ინსპ. მოთხოვნა" pdf={<BlankApplicationForm />} fileName="FM-18_განცხადება.pdf" color="info" />
      <DocCard icon="📋" code="FM-09" title="ხელშ. განხილვა" desc="ISO §7.1 — შეფ. გახ." pdf={<FM09_ContractReviewPdf />} fileName="FM-09_ხელშ_განხილვა.pdf" color="info" />
      <DocCard icon="🗺️" code="FM-11" title="ინსპ. გეგმა" desc="ISO §7.1 — ეტაპ. გ." pdf={<FM11_InspectionPlanPdf />} fileName="FM-11_ინსპ_გეგმა.pdf" color="info" />
      <DocCard icon="📍" code="FM-16" title="ვიზიტის ჩანაწ." desc="ISO §7.3 — საველე" pdf={<FM16_VisitRecordPdf />} fileName="FM-16_ვიზიტის_ჩ.pdf" color="info" />
      <DocCard icon="📊" code="FM-21" title="ინსპ. რეგისტრი" desc="ISO §7.3 — ჟ. (ლ/ი)" pdf={<FM21_InspectionRegisterPdf />} fileName="FM-21_ინსპ_რეგ.pdf" color="info" />
    </Row>

    {/* ── 3. პერსონალი ── */}
    <SectionTitle icon="👥" title="პერსონალი და კომპეტენცია" color="#198754" />
    <Row className="g-2">
      <DocCard icon="⚖️" code="FM-02" title="მიუკ. დეკლარ." desc="ISO §4 — ყ. საქმეზე" pdf={<ImpartialityDeclarationPdf data={{}} />} fileName="FM-02_მიუკ_დეკლ.pdf" color="success" />
      <DocCard icon="🤐" code="FM-03" title="კონფ. შეთანხ." desc="ISO §5 — 5 წ. ვ." pdf={<ConfidentialityAgreementPdf data={{}} />} fileName="FM-03_კონფ_შეთ.pdf" color="success" />
      <DocCard icon="🎯" code="FM-08" title="კომპ. შეფასება" desc="ISO §6.1 — წ/წლ." pdf={<FM08_CompetencyAssessmentPdf />} fileName="FM-08_კომპ_შეფ.pdf" color="success" />
      <DocCard icon="📚" code="FM-13" title="ტრენინგის ჩ." desc="ISO §6.1 — შ. 5 წ." pdf={<FM13_TrainingRecordNewPdf />} fileName="FM-13_ტრენ_ჩ.pdf" color="success" />
    </Row>

    {/* ── 4. ხარისხი / შეუსაბ. ── */}
    <SectionTitle icon="🛡️" title="ხარისხის მართვა" color="#dc3545" />
    <Row className="g-2">
      <DocCard icon="📣" code="FM-06" title="საჩ. / აპ. ფ." desc="ISO §7.5/7.7/7.8" pdf={<FM06_ComplaintAppealPdf />} fileName="FM-06_საჩ_აპ.pdf" color="danger" />
      <DocCard icon="⚠️" code="FM-10" title="CAPA" desc="ISO §8.5 — ყ. ნ/კ" pdf={<FM10_CAPAFormPdf />} fileName="FM-10_CAPA.pdf" color="danger" />
      <DocCard icon="🚫" code="FM-14" title="შეუსაბ. სამ." desc="ISO §8.7 — ნ/კ კ." pdf={<FM14_NonConformingPdf />} fileName="FM-14_შეუსაბ.pdf" color="danger" />
      <DocCard icon="🔎" code="FM-04" title="შ/აუდ. გ&ა" desc="ISO §8.6 — ½/წელ." pdf={<FM04_InternalAuditPdf />} fileName="FM-04_შ_აუდ.pdf" color="danger" />
      <DocCard icon="📈" code="FM-15" title="მენ. ანალიზი" desc="ISO §8.5 — სხდ/ოქ" pdf={<FM15_MgmtReviewPdf />} fileName="FM-15_მენ_ანალ.pdf" color="danger" />
    </Row>

    {/* ── 5. მოწყ. / ქვეკ. ── */}
    <SectionTitle icon="🔧" title="მოწყობილობა და ქვეკონტრაქტორი" color="#fd7e14" />
    <Row className="g-2">
      <DocCard icon="🔩" code="FM-07" title="მოწყ. ვერ." desc="ISO §6.2 — გამ/წ" pdf={<FM07_EquipmentVerificationPdf />} fileName="FM-07_მოწყ_ვერ.pdf" color="warning" />
      <DocCard icon="🏗️" code="FM-12" title="ქვეკ. შეფ." desc="ISO §6.6 — დ/გ" pdf={<FM12_SubcontractorPdf />} fileName="FM-12_ქვეკ_შეფ.pdf" color="warning" />
    </Row>

    {/* ── 6. დოკ. მართვა ── */}
    <SectionTitle icon="🗂️" title="დოკუმენტაციის მართვა" color="#6f42c1" />
    <Row className="g-2">
      <DocCard icon="👁️" code="FM-22" title="გაცნობ. ფ." desc="ISO §6.1 — 5 დ. ვ." pdf={<FM22_FamiliarizationPdf />} fileName="FM-22_გაცნ_ფ.pdf" color="secondary" />
      <DocCard icon="✍️" code="FM-23" title="ცვლ. წ." desc="PR-01 — ნ/ც წ." pdf={<FM23_DocChangePdf />} fileName="FM-23_ცვლ_წ.pdf" color="secondary" />
      <DocCard icon="📒" code="FM-24" title="ცვლ. რეგ." desc="PR-01 — ჟ. (ლ/ი)" pdf={<FM24_ChangeRegisterPdf />} fileName="FM-24_ცვლ_რეგ.pdf" color="secondary" />
      <DocCard icon="🗑️" code="FM-25" title="ლიკვ. აქტი" desc="PR-02 §6 — ნ/ც" pdf={<FM25_LiquidationActPdf />} fileName="FM-25_ლიკვ.pdf" color="secondary" />
    </Row>

  </Container>
);

export default DocumentsPage;
