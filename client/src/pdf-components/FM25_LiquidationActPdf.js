import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2, YesNoRow } from './FormBase';

const FM25_LiquidationActPdf = () => (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader
        code="FM-25"
        isoRef="PR-02 §6"
        title="ლიკვიდაციის (განადგ.) აქტი"
        subtitle="Document Liquidation / Destruction Act"
      />

      {/* A */}
      <Text style={s.secH}>A. საიდენტიფიკაციო მონაცემები</Text>
      <FieldRow2 label1="აქტის № (BE-DEST-YYYY-____):" label2="შედ. თარიღი:" />
      <FieldRow label="პასუხ. / შემ.:" />
      <FieldRow label="მოწმე:" />

      {/* B */}
      <Text style={s.secH}>B. ლიკვიდ. დოკუმენტების სია</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '5%' }]}><Text>#</Text></View>
          <View style={[s.tHead, { flex: 1 }]}><Text>დოკ. სახელი / კოდი</Text></View>
          <View style={[s.tHead, { width: '12%' }]}><Text>ვ.</Text></View>
          <View style={[s.tHead, { width: '18%' }]}><Text>შ. ვ. გასვ. თ.</Text></View>
          <View style={[s.tHead, { width: '15%' }]}><Text>ასლ. რ.</Text></View>
          <View style={[s.tHead, { width: '20%' }]}><Text>შ. / ციფ.</Text></View>
        </View>
        {[...Array(10)].map((_, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '5%' }]}><Text style={{ fontSize: 8 }}>{i+1}</Text></View>
            <View style={[s.tCell, { flex: 1, minHeight: 20 }]} />
            <View style={[s.tCell, { width: '12%' }]} />
            <View style={[s.tCell, { width: '18%' }]} />
            <View style={[s.tCell, { width: '15%' }]} />
            <View style={[s.tCell, { width: '20%' }]} />
          </View>
        ))}
      </View>
      <Text style={{ fontSize: 7.5, color: '#555', marginBottom: 6 }}>
        შ./ციფ.: ფ — ფიზ. შრ. | ც — ც. წაშ.  |  ასლ.რ.: სულ ფიზ./ციფ. ასლ. რ.
      </Text>

      {/* C */}
      <Text style={s.secH}>C. ლიკვიდაციის მეთოდი</Text>
      <View style={{ flexDirection: 'row', gap: 30, marginBottom: 8, marginLeft: 6 }}>
        {['📄 შრედ. (ფიზ.)','💻 უსაფ. წ. (ციფ.)','📦 სხვა (მ. ა.)'].map(t => (
          <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={s.box} /><Text style={{ fontSize: 9 }}>{t}</Text>
          </View>
        ))}
      </View>
      <FieldRow label="სხვა მეთ. აღ.:" />

      {/* D */}
      <Text style={s.secH}>D. შეუსაბამობის შემოწმება</Text>
      <YesNoRow label="ყველა ასლი (ფიზ. + ციფ.) განადგ.:" />
      <YesNoRow label="FM-24 ჟ. განახლ.:" />
      <FieldRow label="ხარ. მ. ვერ.:" />

      {/* E */}
      <Text style={s.secH}>E. განცხადება</Text>
      <View style={[{ borderWidth: 0.5, borderColor: '#ccc', padding: 8, marginBottom: 8, backgroundColor: '#f5f8fc' }]}>
        <Text style={{ fontSize: 9, textAlign: 'justify', lineHeight: 1.6 }}>
          ქვემოხელმოწერილ პირები ვადასტურებთ, რომ ზემოჩამოთვლილი დოკუმენტები მთლიანად და
          შეუქცევადად განადგურდა. არცერთი ასლი ან ასახვა არ შენარჩუნებულა. ლიკვიდაცია
          განხორციელდა PR-02 §6-ის სრული დაცვით.
        </Text>
      </View>

      <SigBlock3 labels={['შემავს. / პასუხ.', 'მოწმე', 'ხარ. მ. ვ.']} />
      <FormFooter code="FM-25 v2.0 | 28.04.2026 | შენახ.: 5 წ. (აქტი)" />
    </Page>
  </Document>
);

export default FM25_LiquidationActPdf;
