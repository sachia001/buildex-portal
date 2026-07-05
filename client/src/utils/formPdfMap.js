// formPdfMap — BE-FM კოდი → PDF-რენდერერის ცენტრალური რუკა.
// პრიორიტეტი: newFormDefinitions (GenericFormPdf — ეტალონის სქემით) → ლეგასი კომპონენტი.
// გამოიყენება getFormPdf(code)-ით FormFillModal-ისთვის pdfComponent-ის მისაწოდებლად.
import React from 'react';
import GenericFormPdf from '../pdf-components/GenericFormPdf';
import { getFormConfig } from './getFormConfig';

import BlankApplicationForm          from '../pdf-components/BlankApplicationForm';
import ImpartialityDeclarationPdf    from '../pdf-components/ImpartialityDeclarationPdf';
import ConfidentialityAgreementPdf   from '../pdf-components/ConfidentialityAgreementPdf';
import ReportCoverPdf                from '../pdf-components/ReportCoverPdf';
import FM01_ApplicationRegistrationPdf from '../pdf-components/FM01_ApplicationRegistrationPdf';
import FM04_InternalAuditPdf         from '../pdf-components/FM04_InternalAuditPdf';
import FM05_ContractAcceptancePdf    from '../pdf-components/FM05_ContractAcceptancePdf';
import FM06_ComplaintAppealPdf       from '../pdf-components/FM06_ComplaintAppealPdf';
import FM07_EquipmentVerificationPdf from '../pdf-components/FM07_EquipmentVerificationPdf';
import FM08_CompetencyAssessmentPdf  from '../pdf-components/FM08_CompetencyAssessmentPdf';
import FM09_ContractReviewPdf        from '../pdf-components/FM09_ContractReviewPdf';
import FM10_CAPAFormPdf              from '../pdf-components/FM10_CAPAFormPdf';
import FM11_InspectionPlanPdf        from '../pdf-components/FM11_InspectionPlanPdf';
import FM13_TrainingRecordNewPdf     from '../pdf-components/FM13_TrainingRecordNewPdf';
import FM14_NonConformingPdf         from '../pdf-components/FM14_NonConformingPdf';
import FM15_MgmtReviewPdf            from '../pdf-components/FM15_MgmtReviewPdf';
import FM16_VisitRecordPdf           from '../pdf-components/FM16_VisitRecordPdf';
import FM19_CustomerSatisfactionPdf  from '../pdf-components/FM19_CustomerSatisfactionPdf';
import FM20_ReportVerificationPdf    from '../pdf-components/FM20_ReportVerificationPdf';
import FM21_InspectionRegisterPdf    from '../pdf-components/FM21_InspectionRegisterPdf';
import FM22_FamiliarizationPdf       from '../pdf-components/FM22_FamiliarizationPdf';
import FM23_DocChangePdf             from '../pdf-components/FM23_DocChangePdf';
import FM24_ChangeRegisterPdf        from '../pdf-components/FM24_ChangeRegisterPdf';
import FM25_LiquidationActPdf        from '../pdf-components/FM25_LiquidationActPdf';
import FM27_AuditChecklistPdf        from '../pdf-components/FM27_AuditChecklistPdf';
import FM28_AuditReportPdf           from '../pdf-components/FM28_AuditReportPdf';
import FM29_AuditNCFormPdf           from '../pdf-components/FM29_AuditNCFormPdf';
import FM30_AuditMeetingPdf          from '../pdf-components/FM30_AuditMeetingPdf';
import FM31_AuditProgramPdf          from '../pdf-components/FM31_AuditProgramPdf';
import FM33_ImpartialityRiskPdf      from '../pdf-components/FM33_ImpartialityRiskPdf';
import FM34_EquipmentCardPdf         from '../pdf-components/FM34_EquipmentCardPdf';
import FM35_SubcontractorMonitoringPdf from '../pdf-components/FM35_SubcontractorMonitoringPdf';

const LEGACY_PDF = {
  'BE-FM-APP':             BlankApplicationForm,
  'BE-FM-REG':             FM01_ApplicationRegistrationPdf,
  'BE-FM-SCREEN':          FM05_ContractAcceptancePdf,
  'BE-FM-CONTRACT-REVIEW': FM09_ContractReviewPdf,
  'BE-FM-PLAN':            FM11_InspectionPlanPdf,
  'BE-FM-VISIT':           FM16_VisitRecordPdf,
  'BE-FM-INSP-REG':        FM21_InspectionRegisterPdf,
  'BE-FM-IR':              ReportCoverPdf,
  'BE-FM-TECH-REVIEW':     FM20_ReportVerificationPdf,
  'BE-FM-IMP-DECL':        ImpartialityDeclarationPdf,
  'BE-FM-IMP-RISK':        FM33_ImpartialityRiskPdf,
  'BE-FM-CONF':            ConfidentialityAgreementPdf,
  'BE-FM-COMP-CHECK':      FM08_CompetencyAssessmentPdf,
  'BE-FM-TRAIN':           FM13_TrainingRecordNewPdf,
  'BE-FM-COMPLAINT':       FM06_ComplaintAppealPdf,
  'BE-FM-CAPA':            FM10_CAPAFormPdf,
  'BE-FM-NONCONF':         FM14_NonConformingPdf,
  'BE-FM-MGMT-REVIEW':     FM15_MgmtReviewPdf,
  'BE-FM-SATISF':          FM19_CustomerSatisfactionPdf,
  'BE-FM-EQ-CHECK':        FM07_EquipmentVerificationPdf,
  'BE-FM-EQ-CARD':         FM34_EquipmentCardPdf,
  'BE-FM-SUB-MONITOR':     FM35_SubcontractorMonitoringPdf,
  'BE-FM-FAMIL':           FM22_FamiliarizationPdf,
  'BE-FM-CHANGE-INIT':     FM23_DocChangePdf,
  'BE-FM-CHANGE-REG':      FM24_ChangeRegisterPdf,
  'BE-FM-DESTROY-ACT':     FM25_LiquidationActPdf,
  'BE-FM-AUDIT-PROGRAM':   FM31_AuditProgramPdf,
  'BE-FM-AUDIT-PLAN':      FM04_InternalAuditPdf,
  'BE-FM-AUDIT-CHECK':     FM27_AuditChecklistPdf,
  'BE-FM-AUDIT-REPORT':    FM28_AuditReportPdf,
  'BE-FM-AUDIT-NC':        FM29_AuditNCFormPdf,
  'BE-FM-AUDIT-MEETING':   FM30_AuditMeetingPdf,
};

// კოდი → PDF ელემენტი FormFillModal-ისთვის (null = ჩამოტვირთვა მიუწვდომელია)
export function getFormPdf(code) {
  const r = getFormConfig(code);
  if (r && r.form) return <GenericFormPdf form={r.form} />;
  const Comp = LEGACY_PDF[code];
  return Comp ? <Comp data={{}} /> : null;
}
