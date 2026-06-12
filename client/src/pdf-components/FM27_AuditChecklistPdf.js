import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow2 } from './FormBase';

const p = { padding: 2 };

const FM27_AuditChecklistPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  const isoSections = [
    { ref: '§4',   label: 'მიუკერძოებლობა და დამოუკიდებლობა' },
    { ref: '§5',   label: 'კონფიდენციალობა' },
    { ref: '§6.1', label: 'პერსონალი და კომპეტენცია' },
    { ref: '§6.2', label: 'მოწყობილობა და კალიბრაცია' },
    { ref: '§6.3', label: 'ქვეკონტრაქტირება' },
    { ref: '§7.1', label: 'ხელშეკრულების განხილვა' },
    { ref: '§7.2', label: 'ინსპექტირების მეთოდები' },
    { ref: '§7.3', label: 'ინსპექტირების პროცესი' },
    { ref: '§7.4', label: 'ველის ჩანაწერები და ანგარიში' },
    { ref: '§7.5', label: 'ინსპექტირების აპელაცია' },
    { ref: '§8.3', label: 'დოკუმენტების მართვა' },
    { ref: '§8.6', label: 'შიდა აუდიტი' },
    { ref: '§8.7', label: 'შეუსაბამო სამუშაო' },
    { ref: '§8.9', label: 'მართვის ანალიზი' },
  ];
  return (
  <Document>
    <Page size="A4" style={[s.page, { paddingTop: 12, paddingBottom: 22, paddingHorizontal: 28 }]}>
      <WM />
      <FormHeader code="BE-FM-AUDIT-CHECK" isoRef="სსტ ISO/IEC 17020 §8.6" title="შიდა აუდიტის ჩეკლისტი" subtitle="Internal Audit Checklist" />

      <FieldRow2 label1="BE-FM-AUDIT-PLAN აუდიტის №:" value1={data.auditNumber} label2="აუდიტის თარიღი:" value2={data.auditDate} />

      <Text style={s.secH}>ISO §§ შეფასება</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '10%', ...p }]}><Text>ISO §</Text></View>
          <View style={[s.tHead, { width: '32%', ...p }]}><Text>სფერო</Text></View>
          <View style={[s.tHead, { width: '14%', ...p }]}><Text>შ / არ შ / NC</Text></View>
          <View style={[s.tHead, { flex: 1, ...p }]}><Text>შენიშვნა / აღწერა</Text></View>
        </View>
        {isoSections.map((r, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '10%', ...p }]}><Text style={{ fontSize: 7.5 }}>{r.ref}</Text></View>
            <View style={[s.tCell, { width: '32%', ...p, minHeight: 13 }]}><Text style={{ fontSize: 7.5 }}>{r.label}</Text></View>
            <View style={[s.tCell, { width: '14%', ...p }]} />
            <View style={[s.tCell, { flex: 1, ...p }]} />
          </View>
        ))}
      </View>

      <Text style={[s.secH, { marginTop: 3 }]}>გამოვლენილი შეუსაბამობები (NC-ები)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '14%', ...p }]}><Text>NC №</Text></View>
          <View style={[s.tHead, { width: '12%', ...p }]}><Text>ISO §</Text></View>
          <View style={[s.tHead, { width: '18%', ...p }]}><Text>კატეგორია</Text></View>
          <View style={[s.tHead, { flex: 1, ...p }]}><Text>აღწერა</Text></View>
        </View>
        {[...Array(4)].map((_, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '14%', ...p, minHeight: 12 }]} />
            <View style={[s.tCell, { width: '12%', ...p }]} />
            <View style={[s.tCell, { width: '18%', ...p }]} />
            <View style={[s.tCell, { flex: 1, ...p }]} />
          </View>
        ))}
      </View>

      <FieldRow2 label1="ISO მოთხოვნები შესრულებულია (კი/არა):" value1={data.conforming}
                 label2="საერთო შეფასება:" value2={data.overallResult} />

      <SigBlock3 labels={['აუდიტორი', 'შემმოწმებელი (ხარისხის მენეჯერი)', 'დამტკიცება (დირექტორი)']} sigs={sigs} />
      <FormFooter code="BE-FM-AUDIT-CHECK v1.0 | 28.04.2026 | ISO §8.6 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM27_AuditChecklistPdf;
