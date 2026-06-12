import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2 } from './FormBase';

const FM29_AuditNCFormPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  return (
  <Document>
    <Page size="A4" style={[s.page, { paddingTop: 12, paddingBottom: 22, paddingHorizontal: 28 }]}>
      <WM />
      <FormHeader code="BE-FM-AUDIT-NC" isoRef="სსტ ISO/IEC 17020 §8.6/§8.7" title="აუდიტის შეუსაბამობის ფორმა" subtitle="Audit Non-Conformity Form" />

      <Text style={s.secH}>A. შეუსაბამობის საიდენტიფიკაციო მონაცემები</Text>
      <FieldRow2 label1="BE-FM-AUDIT-PLAN აუდიტის №:" value1={data.auditNumber} label2="NC №:" value2={data.ncNumber} />
      <FieldRow2 label1="ISO §:" value1={data.isoClause} label2="კატეგორია:" value2={data.severity} />
      <FieldRow label="შეუსაბამობის მოკლე აღწერა:" value={data.description} />
      <View style={[s.textarea, { minHeight: 28 }]}>
        {data.descriptionDetail
          ? <Text style={{ fontSize: 8.5, lineHeight: 1.4 }}>{data.descriptionDetail}</Text>
          : <Text style={{ fontSize: 8, color: '#bbb' }}>შეუსაბამობის დეტალური აღწერა...</Text>}
      </View>

      <Text style={s.secH}>B. ფესვური მიზეზი და მაკორექტირებელი ქმედება (CAPA)</Text>
      <FieldRow label="ფესვური მიზეზი (5-Why ანალიზი):" value={data.rootCause} />
      <View style={[s.textarea, { minHeight: 26 }]}>
        {data.rootCauseDetail
          ? <Text style={{ fontSize: 8.5, lineHeight: 1.4 }}>{data.rootCauseDetail}</Text>
          : <Text style={{ fontSize: 8, color: '#bbb' }}>ფესვური მიზეზის დეტალური ანალიზი...</Text>}
      </View>
      <FieldRow label="მაკორექტირებელი ქმედება:" value={data.correctiveAction} />
      <View style={[s.textarea, { minHeight: 26 }]}>
        {data.correctiveActionDetail
          ? <Text style={{ fontSize: 8.5, lineHeight: 1.4 }}>{data.correctiveActionDetail}</Text>
          : <Text style={{ fontSize: 8, color: '#bbb' }}>მაკ. ქმედების დეტალური გეგმა...</Text>}
      </View>
      <FieldRow2 label1="BE-FM-CAPA CAPA №:" value1={data.capaNumber} label2="ვადა:" value2={data.deadline} />

      <Text style={s.secH}>C. ეფექტურობის შემოწმება</Text>
      <FieldRow2 label1="შემოწმების თარიღი:" value1={data.checkDate} label2="ეფექტურია (კი/არა):" value2={data.effective} />
      <FieldRow label="შემოწმების შედეგი:" value={data.checkResult} />

      <SigBlock3 labels={['აუდიტორი', 'შემმოწმებელი (ხარისხის მენეჯერი)', 'დამტკიცება (დირექტორი)']} sigs={sigs} />
      <FormFooter code="BE-FM-AUDIT-NC v2.0 | 28.04.2026 | ISO §8.6/8.7 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM29_AuditNCFormPdf;
