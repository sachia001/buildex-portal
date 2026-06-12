import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2 } from './FormBase';

const p = { padding: 2 };

const FM26_AuditPlanPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  return (
  <Document>
    <Page size="A4" style={[s.page, { paddingTop: 12, paddingBottom: 22, paddingHorizontal: 28 }]}>
      <WM />
      <FormHeader code="BE-FM-AUDIT-PLAN" isoRef="სსტ ISO/IEC 17020 §8.6" title="შიდა აუდიტის გეგმა" subtitle="Internal Audit Plan" />

      <Text style={s.secH}>A. აუდიტის საიდენტიფიკაციო მონაცემები</Text>
      <FieldRow2 label1="აუდიტის №:" value1={data.auditNumber} label2="პერიოდი:" value2={data.period} />
      <FieldRow2 label1="აუდიტორი:" value1={data.auditor} label2="აუდიტის თარიღი:" value2={data.auditDate} />
      <FieldRow2 label1="აუდიტირებული პირი:" value1={data.auditedStaff} label2="გეგმის დამტკიცების თარიღი:" value2={data.approvalDate} />

      <Text style={s.secH}>B. შემოსამოწმებელი სფეროები (ISO §§ 4 – 9)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '6%', ...p }]}><Text>#</Text></View>
          <View style={[s.tHead, { flex: 1, ...p }]}><Text>შემოსამოწმებელი ობიექტი (PR / FM / POL)</Text></View>
          <View style={[s.tHead, { width: '13%', ...p }]}><Text>ISO §</Text></View>
          <View style={[s.tHead, { width: '17%', ...p }]}><Text>გეგმური თარიღი</Text></View>
          <View style={[s.tHead, { width: '13%', ...p }]}><Text>სტატუსი</Text></View>
        </View>
        {[...Array(10)].map((_, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '6%', ...p }]}><Text style={{ fontSize: 7 }}>{i + 1}</Text></View>
            <View style={[s.tCell, { flex: 1, ...p, minHeight: 12 }]} />
            <View style={[s.tCell, { width: '13%', ...p }]} />
            <View style={[s.tCell, { width: '17%', ...p }]} />
            <View style={[s.tCell, { width: '13%', ...p }]} />
          </View>
        ))}
      </View>

      <Text style={s.secH}>C. შედეგი</Text>
      <FieldRow2 label1="ყველა მოთხოვნა შესრულებულია (კი/არა):" value1={data.allRequirementsMet}
                 label2="ხელახალი აუდიტი საჭიროა (კი/არა):" value2={data.reauditNeeded} />
      <FieldRow label="შენიშვნა / NC-ები:" value={data.notes} />

      <SigBlock3 labels={['შემდგენი (აუდიტორი)', 'შემმოწმებელი (ხარისხის მენეჯერი)', 'დამტკიცება (დირექტორი)']} sigs={sigs} />
      <FormFooter code="BE-FM-AUDIT-PLAN v2.0 | 28.04.2026 | ISO §8.6 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM26_AuditPlanPdf;
