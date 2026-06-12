import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2 } from './FormBase';

const p = { padding: 2 };

const FM28_AuditReportPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  return (
  <Document>
    <Page size="A4" style={[s.page, { paddingTop: 12, paddingBottom: 22, paddingHorizontal: 28 }]}>
      <WM />
      <FormHeader code="BE-FM-AUDIT-REPORT" isoRef="სსტ ISO/IEC 17020 §8.6" title="შიდა აუდიტის ანგარიში" subtitle="Internal Audit Report" />

      <Text style={s.secH}>A. ანგარიშის მონაცემები</Text>
      <FieldRow2 label1="BE-FM-AUDIT-PLAN №:" value1={data.auditNumber} label2="აუდიტის თარიღი:" value2={data.auditDate} />
      <FieldRow label="აუდიტირებული ISO §§ (BE-FM-AUDIT-CHECK):" value={data.auditedSections} />

      <Text style={s.secH}>B. ძირითადი მიგნებები</Text>
      <View style={[s.textarea, { minHeight: 32 }]}>
        <Text style={{ fontSize: 8.5, lineHeight: 1.4 }}>{data.keyFindings || ''}</Text>
      </View>

      <Text style={s.secH}>C. გამოვლენილი შეუსაბამობები (NC-ები)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '14%', ...p }]}><Text>NC №</Text></View>
          <View style={[s.tHead, { width: '10%', ...p }]}><Text>ISO §</Text></View>
          <View style={[s.tHead, { width: '16%', ...p }]}><Text>კატეგორია</Text></View>
          <View style={[s.tHead, { flex: 1, ...p }]}><Text>აღწერა</Text></View>
          <View style={[s.tHead, { width: '18%', ...p }]}><Text>BE-FM-CAPA CAPA №</Text></View>
        </View>
        {(() => { const rows = Array.isArray(data.findRows) ? data.findRows : []; const W=[{"width":"14%","minHeight":12},{"width":"10%"},{"width":"16%"},{"flex":1},{"width":"18%"}]; return [...Array(Math.max(5, rows.length))].map((_,i)=>{const r=rows[i]||{}; return (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            {W.map((st,ci)=>(<View key={ci} style={[s.tCell,{...st,...p}]}><Text style={{ fontSize: 7.5 }}>{r['c'+ci]||''}</Text></View>))}
          </View>
        );}); })()}
      </View>

      <Text style={s.secH}>D. ინიცირებული ქმედებები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { flex: 1, ...p }]}><Text>ქმედება</Text></View>
          <View style={[s.tHead, { width: '22%', ...p }]}><Text>პასუხისმგებელი</Text></View>
          <View style={[s.tHead, { width: '18%', ...p }]}><Text>ვადა</Text></View>
          <View style={[s.tHead, { width: '14%', ...p }]}><Text>სტატუსი</Text></View>
        </View>
        {(() => { const rows = Array.isArray(data.actionRows) ? data.actionRows : []; const W=[{"flex":1,"minHeight":12},{"width":"22%"},{"width":"18%"},{"width":"14%"}]; return [...Array(Math.max(3, rows.length))].map((_,i)=>{const r=rows[i]||{}; return (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            {W.map((st,ci)=>(<View key={ci} style={[s.tCell,{...st,...p}]}><Text style={{ fontSize: 7.5 }}>{r['c'+ci]||''}</Text></View>))}
          </View>
        );}); })()}
      </View>

      <FieldRow2 label1="აუდიტის საბოლოო შეფასება:" value1={data.auditConclusion} label2="" value2="" />

      <SigBlock3 labels={['აუდიტორი', 'შემმოწმებელი (ხარისხის მენეჯერი)', 'დამტკიცება (დირექტორი)']} sigs={sigs} />
      <FormFooter code="BE-FM-AUDIT-REPORT v1.0 | 28.04.2026 | ISO §8.6 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM28_AuditReportPdf;
