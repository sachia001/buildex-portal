import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2, YesNoRow, EmptyRows } from './FormBase';

const FM04_InternalAuditPdf = () => (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader
        code="FM-04"
        isoRef="სსტ ISO/IEC 17020 §8.6"
        title="შიდა აუდიტის გეგმა და ანგარიში"
        subtitle="Internal Audit Plan & Report"
      />

      {/* A — საიდენტიფიკაციო */}
      <Text style={s.secH}>A. საიდენტიფიკაციო მონაცემები</Text>
      <FieldRow2 label1="აუდიტის №:" label2="პერიოდი (წელი):" />
      <FieldRow label="აუდიტორი (სახელი/გვარი):" />
      <FieldRow label="აუდიტის თარიღი:" />
      <FieldRow label="აუდიტირებული განყოფილება / პერსონალი:" />
      <FieldRow label="შემოწმებული დოკუმენტები:" />
      <FieldRow label="შემოწმებული საქმეები (BE-CASE №):" />

      {/* B — ფარგლები */}
      <Text style={s.secH}>B. აუდიტის ფარგლები (ISO კლაუზები)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '8%' }]}><Text>§</Text></View>
          <View style={[s.tHead, { flex: 1 }]}><Text>ISO/IEC 17020 მოთხოვნა</Text></View>
          <View style={[s.tHead, { width: '18%' }]}><Text>შემოწ. (✓)</Text></View>
        </View>
        {[
          ['§4','მიუკერძოებლობა და დამოუკიდებლობა'],
          ['§5','კონფიდენციალურობა'],
          ['§6.1','პერსონალი — კომპეტენცია'],
          ['§6.2','მოწყობილობა და კალიბრება'],
          ['§7.1','ხელშეკრულების განხილვა'],
          ['§7.3','ინსპექტირების მეთოდები'],
          ['§7.4','შედეგების გადამოწმება'],
          ['§8.1','მომჩივანები და აპელაციები'],
          ['§8.5','მენეჯმენტის ანალიზი'],
          ['§8.6','შიდა აუდიტი'],
          ['§8.7','შეუსაბამო სამუშაო'],
        ].map(([cl, req], i) => (
          <View key={cl} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '8%' }]}><Text>{cl}</Text></View>
            <View style={[s.tCell, { flex: 1 }]}><Text>{req}</Text></View>
            <View style={[s.tCell, { width: '18%' }]} />
          </View>
        ))}
      </View>

      {/* C — მიგნებები */}
      <Text style={s.secH}>C. აუდიტის მიგნებები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '5%' }]}><Text>#</Text></View>
          <View style={[s.tHead, { flex: 1 }]}><Text>მიგნების აღწერა</Text></View>
          <View style={[s.tHead, { width: '15%' }]}><Text>ISO §</Text></View>
          <View style={[s.tHead, { width: '20%' }]}><Text>კატეგორია</Text></View>
        </View>
        <EmptyRows count={7} cols={['5%', undefined, '15%', '20%']} />
      </View>
      <Text style={{ fontSize: 8, color: '#555', marginBottom: 6 }}>
        კატეგორია: კ — კრიტიკული შეუსაბამობა  |  მ — მცირე შეუსაბამობა  |  გ — გასაუმჯობესებელი
      </Text>

      {/* D — მაკორექტირებელი */}
      <Text style={s.secH}>D. მაკორექტირებელი ქმედებები (FM-10 — CAPA)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '5%' }]}><Text>#</Text></View>
          <View style={[s.tHead, { flex: 1 }]}><Text>CAPA №</Text></View>
          <View style={[s.tHead, { width: '35%' }]}><Text>მაკორ. ქმედება</Text></View>
          <View style={[s.tHead, { width: '20%' }]}><Text>ვადა / სტ.</Text></View>
        </View>
        <EmptyRows count={4} cols={['5%', undefined, '35%', '20%']} />
      </View>

      {/* E — შეჯამება */}
      <Text style={s.secH}>E. შეჯამება</Text>
      <YesNoRow label="ყველა ISO §8.6 მოთხოვნა დაცულია:" />
      <YesNoRow label="ხელახალი შემოწმება საჭიროა:" />
      <FieldRow label="ხელახალი შემოწმების თარიღი:" />
      <FieldRow label="ზოგადი შეფასება / კომენტარი:" />

      <SigBlock3 />
      <FormFooter code="FM-04 v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);

export default FM04_InternalAuditPdf;
