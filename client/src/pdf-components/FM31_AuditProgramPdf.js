import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2 } from './FormBase';

const p = { padding: 2 };

const FM31_AuditProgramPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  const quarters = ['I კვ.', 'II კვ.', 'III კვ.', 'IV კვ.'];
  return (
  <Document>
    <Page size="A4" style={[s.page, { paddingTop: 12, paddingBottom: 22, paddingHorizontal: 28 }]}>
      <WM />
      <FormHeader code="BE-FM-AUDIT-PROGRAM" isoRef="სსტ ISO/IEC 17020 §8.6" title="შიდა აუდიტის პროგრამა (წლიური გეგმა)" subtitle="Internal Audit Programme (Annual Plan)" />

      <Text style={s.secH}>A. გეგმის მონაცემები</Text>
      <FieldRow2 label1="გეგმის №:" value1={data.programNumber} label2="წელი:" value2={data.year} />
      <FieldRow2 label1="ხარისხის მენეჯერი:" value1={data.qualityManager} label2="დამტკიცების კალენდ. თარიღი:" value2={data.approvalDate} />

      <Text style={s.secH}>B. აუდიტირებული ობიექტები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '5%', ...p }]}><Text>#</Text></View>
          <View style={[s.tHead, { flex: 1, ...p }]}><Text>აუდიტირებული ობიექტი (PR / FM / POL)</Text></View>
          <View style={[s.tHead, { width: '16%', ...p }]}><Text>აუდიტორი</Text></View>
          {quarters.map(q => (
            <View key={q} style={[s.tHead, { width: '8%', ...p, textAlign: 'center' }]}>
              <Text style={{ fontSize: 6.5 }}>{q}</Text>
            </View>
          ))}
          <View style={[s.tHead, { width: '11%', ...p }]}><Text>სტატუსი</Text></View>
        </View>
        {[...Array(10)].map((_, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '5%', ...p }]}><Text style={{ fontSize: 7 }}>{i + 1}</Text></View>
            <View style={[s.tCell, { flex: 1, ...p, minHeight: 13 }]} />
            <View style={[s.tCell, { width: '16%', ...p }]} />
            {quarters.map(q => (
              <View key={q} style={[s.tCell, { width: '8%', ...p }]} />
            ))}
            <View style={[s.tCell, { width: '11%', ...p }]} />
          </View>
        ))}
      </View>

      <Text style={s.secH}>C. წლიური შეჯამება</Text>
      <FieldRow2 label1="შესრულებული / გეგმური (რაოდენობა):" value1={data.completedVsPlanned}
                 label2="ISO §8.6 კონფორმულია (კი/არა):" value2={data.isoConforming} />
      <FieldRow label="შეჯამება / შენიშვნები:" value={data.remarks} />

      <SigBlock3 labels={['შემდგენი (ხარისხის მენეჯერი)', 'შემმოწმებელი (აუდიტორი)', 'დამტკიცება (დირექტორი)']} sigs={sigs} />
      <FormFooter code="BE-FM-AUDIT-PROGRAM v2.0 | 28.04.2026 | ISO §8.6 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM31_AuditProgramPdf;
