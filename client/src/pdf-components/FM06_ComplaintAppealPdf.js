import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2, YesNoRow } from './FormBase';

const FM06_ComplaintAppealPdf = () => (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader
        code="FM-06"
        isoRef="სსტ ISO/IEC 17020 §7.5 / §7.7 / §7.8"
        title="საჩივრის / აპელაციის ფორმა"
        subtitle="Complaint & Appeal Form"
      />

      {/* A — ტიპი */}
      <Text style={s.secH}>A. მომართვის ტიპი</Text>
      <View style={{ flexDirection: 'row', gap: 30, marginBottom: 8, marginLeft: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View style={s.box} /><Text style={{ fontSize: 9 }}>☐  საჩივარი (Complaint)  — BE-COMP-{new Date().getFullYear()}-____</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 30, marginBottom: 8, marginLeft: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View style={s.box} /><Text style={{ fontSize: 9 }}>☐  აპელაცია (Appeal)  — BE-APP-{new Date().getFullYear()}-____</Text>
        </View>
      </View>

      {/* B — მომჩივანი */}
      <Text style={s.secH}>B. მომართვის ძირითადი მონაცემები</Text>
      <FieldRow2 label1="რეგ. №:" label2="მომართვის თარიღი:" />
      <FieldRow label="მომჩივანის სახელი / ორგანიზაცია:" />
      <FieldRow2 label1="ტელეფონი:" label2="ელ-ფოსტა:" />
      <FieldRow label="კავშირის ფორმა:" />
      <View style={{ flexDirection: 'row', gap: 20, marginBottom: 6, marginLeft: 6 }}>
        {['ფიზიკური წერილი','ელ-ფოსტა','ვებგვერდი','ტელეფონი'].map(t => (
          <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={s.box} /><Text style={{ fontSize: 9 }}>{t}</Text>
          </View>
        ))}
      </View>
      <FieldRow label="დაკავშირებული საქმის №:" />

      {/* C — შინაარსი */}
      <Text style={s.secH}>C. მომართვის შინაარსი</Text>
      <View style={[s.textarea, { minHeight: 65 }]} />

      {/* D — ვადები */}
      <Text style={s.secH}>D. განხილვის ვადები (ISO §7.8.4)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { flex: 1 }]}><Text>ეტაპი</Text></View>
          <View style={[s.tHead, { width: '25%' }]}><Text>ვადა</Text></View>
          <View style={[s.tHead, { width: '30%' }]}><Text>ფაქტ. თარიღი</Text></View>
        </View>
        {[
          ['მიღების დადასტურება', '5 სამ. დღე'],
          ['შუალედური პასუხი', '30 კალ. დღე'],
          ['საბოლოო გადაწყვეტა', '60 კალ. დღე (90 — რთ.)'],
        ].map(([s1, s2], i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { flex: 1 }]}><Text>{s1}</Text></View>
            <View style={[s.tCell, { width: '25%' }]}><Text>{s2}</Text></View>
            <View style={[s.tCell, { width: '30%' }]} />
          </View>
        ))}
      </View>

      {/* E — გადაწყვეტა */}
      <Text style={s.secH}>E. გადაწყვეტა</Text>
      <FieldRow label="გადაწყვეტის შემსრულებელი (დამოუკ. პირი):" />
      <View style={[s.textarea, { minHeight: 50 }]}>
        <Text style={{ fontSize: 8.5, color: '#aaa' }}>(გადაწყვეტის შინაარსი)</Text>
      </View>
      <YesNoRow label="CAPA (FM-10) ინიცირება:" />
      <FieldRow label="FM-10 №:" />
      <FieldRow label="მომჩივანისთვის პასუხის გაგზავნის თარიღი:" />

      <SigBlock3 labels={['შემავსებელი', 'ხარ. მენეჯერი', 'დირექტორი']} />
      <FormFooter code="FM-06 v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);

export default FM06_ComplaintAppealPdf;
