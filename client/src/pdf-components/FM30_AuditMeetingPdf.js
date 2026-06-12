import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2 } from './FormBase';

const p = { padding: 2 };

const FM30_AuditMeetingPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  return (
  <Document>
    <Page size="A4" style={[s.page, { paddingTop: 12, paddingBottom: 22, paddingHorizontal: 28 }]}>
      <WM />
      <FormHeader code="BE-FM-AUDIT-MEETING" isoRef="სსტ ISO/IEC 17020 §8.6" title="აუდიტის შეხვედრის ოქმი" subtitle="Audit Meeting Minutes" />

      <Text style={s.secH}>A. შეხვედრის მონაცემები</Text>
      <FieldRow2 label1="BE-FM-AUDIT-PLAN აუდიტის №:" value1={data.auditNumber} label2="შეხვედრის ტიპი:" value2={data.meetingType} />
      <FieldRow2 label1="შეხვედრის თარიღი:" value1={data.meetingDate} label2="აუდიტორი:" value2={data.auditor} />
      <FieldRow label="აუდიტირებული პირ(ებ)ი:" value={data.auditees} />
      <FieldRow label="სხვა მონაწილეები:" value={data.participants} />

      <Text style={s.secH}>B. გეგმა და სფეროები</Text>
      <FieldRow label="ინსპექტირებული სფერო / განყოფილება:" value={data.auditedScope} />
      <View style={[s.textarea, { minHeight: 26 }]}>
        {data.scopeDetail
          ? <Text style={{ fontSize: 8.5, lineHeight: 1.4 }}>{data.scopeDetail}</Text>
          : <Text style={{ fontSize: 8, color: '#bbb' }}>სფეროს დეტალური აღწერა, გეგმური ქმედებები...</Text>}
      </View>

      <Text style={s.secH}>C. NC-ების სტატუსი (დახურვის შეხვედრისთვის)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '18%', ...p }]}><Text>NC №</Text></View>
          <View style={[s.tHead, { flex: 1, ...p }]}><Text>სტატუსი</Text></View>
          <View style={[s.tHead, { width: '22%', ...p }]}><Text>BE-FM-CAPA CAPA №</Text></View>
        </View>
        {(() => { const rows = Array.isArray(data.ncRows) ? data.ncRows : []; const W=[{"width":"18%","minHeight":12},{"flex":1},{"width":"22%"}]; return [...Array(Math.max(5, rows.length))].map((_,i)=>{const r=rows[i]||{}; return (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            {W.map((st,ci)=>(<View key={ci} style={[s.tCell,{...st,...p}]}><Text style={{ fontSize: 7.5 }}>{r['c'+ci]||''}</Text></View>))}
          </View>
        );}); })()}
      </View>

      <Text style={s.secH}>D. შეთანხმებული ქმედებები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { flex: 1, ...p }]}><Text>ქმედება</Text></View>
          <View style={[s.tHead, { width: '24%', ...p }]}><Text>პასუხისმგებელი</Text></View>
          <View style={[s.tHead, { width: '18%', ...p }]}><Text>ვადა</Text></View>
        </View>
        {(() => { const rows = Array.isArray(data.actRows) ? data.actRows : []; const W=[{"flex":1,"minHeight":12},{"width":"24%"},{"width":"18%"}]; return [...Array(Math.max(3, rows.length))].map((_,i)=>{const r=rows[i]||{}; return (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            {W.map((st,ci)=>(<View key={ci} style={[s.tCell,{...st,...p}]}><Text style={{ fontSize: 7.5 }}>{r['c'+ci]||''}</Text></View>))}
          </View>
        );}); })()}
      </View>

      <SigBlock3 labels={['აუდიტორი', 'აუდიტირებული', 'ხარისხის მენეჯერი']} sigs={sigs} />
      <FormFooter code="BE-FM-AUDIT-MEETING v1.0 | 28.04.2026 | ISO §8.6 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM30_AuditMeetingPdf;
