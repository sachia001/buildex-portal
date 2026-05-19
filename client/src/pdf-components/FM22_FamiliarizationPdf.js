import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2 } from './FormBase';

const FM22_FamiliarizationPdf = () => (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader
        code="FM-22"
        isoRef="სსტ ISO/IEC 17020 §6.1"
        title="გაცნობის ფურცელი"
        subtitle="Document Familiarization Sheet"
      />

      {/* A */}
      <Text style={s.secH}>A. დოკუმენტის მონაცემები</Text>
      <FieldRow label="დოკუმენტის სახელი:" />
      <FieldRow2 label1="დოკ. კოდი:" label2="ვერსია:" />
      <FieldRow2 label1="ძ. ვ. / ახ. ვ.:" label2="ძალაში შ. თ.:" />
      <View style={[{ backgroundColor: '#fff3cd', borderWidth: 0.5, borderColor: '#ffc107', padding: 6, marginBottom: 8 }]}>
        <Text style={{ fontWeight: 'bold', fontSize: 9 }}>ცვლილების მოკლე აღწერა:</Text>
        <View style={{ minHeight: 30, marginTop: 4 }} />
      </View>
      <FieldRow label="გაცნობის ვადა: 5 სამ. დღე — არაუგვიანეს:" />

      {/* B */}
      <Text style={s.secH}>B. გაცნობის ოქმი (ხელმოწ. სრულ. ადასტ.)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '5%' }]}><Text>#</Text></View>
          <View style={[s.tHead, { flex: 1 }]}><Text>სახელი / გვარი</Text></View>
          <View style={[s.tHead, { width: '22%' }]}><Text>თანამდ.</Text></View>
          <View style={[s.tHead, { width: '22%' }]}><Text>ხელმ.</Text></View>
          <View style={[s.tHead, { width: '18%' }]}><Text>თარ.</Text></View>
        </View>
        {[...Array(14)].map((_, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '5%' }]}><Text style={{ fontSize: 8 }}>{i+1}</Text></View>
            <View style={[s.tCell, { flex: 1, minHeight: 18 }]} />
            <View style={[s.tCell, { width: '22%' }]} />
            <View style={[s.tCell, { width: '22%' }]} />
            <View style={[s.tCell, { width: '18%' }]} />
          </View>
        ))}
      </View>

      <SigBlock3 labels={['შემადგ.', 'შემ. (ხარ. მ.)', 'დამტ. (დირ.)']} />
      <FormFooter code="FM-22 v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);

export default FM22_FamiliarizationPdf;
