import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2 } from './FormBase';

const FM23_DocChangePdf = () => (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader
        code="FM-23"
        isoRef="სსტ ISO/IEC 17020 §8.3 (PR-01)"
        title="დოკუმენტში ცვლილების წინადადება"
        subtitle="Document Change Proposal"
      />

      {/* A */}
      <Text style={s.secH}>A. ინიციატორი</Text>
      <FieldRow2 label1="სახელი / გვარი:" label2="თანამდ.:" />
      <FieldRow2 label1="წარდგ. თარიღი:" label2="№ (BE-DCR-YYYY-____):" />

      {/* B */}
      <Text style={s.secH}>B. დოკუმენტის მონაცემები</Text>
      <FieldRow label="დოკუმენტის სახელი:" />
      <FieldRow2 label1="კოდი:" label2="მიმდ. ვერსია:" />

      {/* C */}
      <Text style={s.secH}>C. შემოთავაზებული ცვლილება</Text>
      <View style={{ marginBottom: 4 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 9, marginBottom: 3 }}>მიმდინარე ტექსტი (კლაუზი / გვ.):</Text>
        <View style={[s.textarea, { minHeight: 45, backgroundColor: '#fff8f8' }]} />
      </View>
      <View style={{ marginBottom: 4 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 9, marginBottom: 3 }}>შემოთავ. ახალი ტექსტი:</Text>
        <View style={[s.textarea, { minHeight: 45, backgroundColor: '#f0fff4' }]} />
      </View>
      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 9, marginBottom: 3 }}>მიზეზი / დასაბუთება:</Text>
        <View style={[s.textarea, { minHeight: 35 }]} />
      </View>

      {/* D */}
      <Text style={s.secH}>D. ხარ. მენეჯ. შეფასება</Text>
      <View style={[s.textarea, { minHeight: 35 }]}>
        <Text style={{ fontSize: 8.5, color: '#aaa' }}>(ხარ. მენეჯ. კომ. / გადაწ.)</Text>
      </View>
      <Text style={[s.fLabel, { marginBottom: 4 }]}>გადაწყვეტილება:</Text>
      <View style={{ flexDirection: 'row', gap: 24, marginBottom: 8, marginLeft: 6 }}>
        {['✅ მიღებული','❌ უარყოფილი','⏸ გადადება'].map(t => (
          <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={s.box} /><Text style={{ fontSize: 9 }}>{t}</Text>
          </View>
        ))}
      </View>
      <FieldRow2 label1="ახ. ვ. №:" label2="ძ. შ. თ.:" />
      <FieldRow label="FM-22 გაცნობ. ინიც.:" />

      <SigBlock3 labels={['ინიციატ.', 'ხარ. მენ.', 'დირ. / დამტ.']} />
      <FormFooter code="FM-23 v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);

export default FM23_DocChangePdf;
