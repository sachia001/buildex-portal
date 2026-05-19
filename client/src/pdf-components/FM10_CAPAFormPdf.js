import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2, YesNoRow } from './FormBase';

const FM10_CAPAFormPdf = () => (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader
        code="FM-10"
        isoRef="სსტ ISO/IEC 17020 §8.5"
        title="მაკორექტირებელი და პრევენციული ქმედება (CAPA)"
        subtitle="Corrective & Preventive Action Form"
      />

      {/* A — რეგ. */}
      <Text style={s.secH}>A. რეგისტრაცია</Text>
      <FieldRow2 label1="CAPA № (BE-CAPA-YYYY-____):" label2="ინიცირების თარიღი:" />
      <FieldRow label="ინიციატორი:" />
      <Text style={[s.fLabel, { marginBottom: 3 }]}>შეუსაბამობის წყარო:</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 8, marginLeft: 6 }}>
        {['შიდა აუდიტი','გარე შეფასება (GAC)','საჩივარი / აპ.','შეუსაბამო სამ.','ინციდენტი','პერიოდული ანალიზი'].map(t => (
          <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={s.box} /><Text style={{ fontSize: 9 }}>{t}</Text>
          </View>
        ))}
      </View>

      {/* B — შეუსაბამობა */}
      <Text style={s.secH}>B. შეუსაბამობის აღწერა</Text>
      <FieldRow label="ISO / სტანდარტის კლაუზი:" />
      <View style={[s.textarea, { minHeight: 45 }]}>
        <Text style={{ fontSize: 8.5, color: '#aaa' }}>(შეუსაბამობის კონკრეტული აღწერა)</Text>
      </View>
      <Text style={[s.fLabel, { marginBottom: 3 }]}>გავლენა:</Text>
      <View style={{ flexDirection: 'row', gap: 20, marginBottom: 6, marginLeft: 6 }}>
        {['🔴 კრიტიკული','🟡 საშუალო','🟢 მცირე'].map(t => (
          <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={s.box} /><Text style={{ fontSize: 9 }}>{t}</Text>
          </View>
        ))}
      </View>

      {/* C — საქმეებზე გავლენა */}
      <Text style={s.secH}>C. გავლენა სხვა საქმეებზე (ISO §8.5.3)</Text>
      <YesNoRow label="გავლენა სხვა ინსპ. საქმეებზე:" />
      <FieldRow label="ზემოქმედებული საქმეები (BE-CASE №):" />
      <FieldRow label="გადაუდებელი კორექცია:" />

      {/* D — ფესვის მიზეზი */}
      <Text style={s.secH}>D. ფესვის მიზეზი (5-Why Analysis)</Text>
      {['რატომ #1:','რატომ #2:','რატომ #3:','რატომ #4:','ფესვის მიზეზი:'].map(q => (
        <FieldRow key={q} label={q} />
      ))}

      {/* E — მაკ. ქმედება */}
      <Text style={s.secH}>E. მაკორექტირებელი ქმედება</Text>
      <View style={[s.textarea, { minHeight: 40 }]} />
      <FieldRow2 label1="შემსრულებელი:" label2="ვადა:" />

      {/* F — ეფექტიანობა */}
      <Text style={s.secH}>F. ეფექტიანობის შემოწმება (ISO §8.5.5.b)</Text>
      <FieldRow label="შემოწმების თარიღი:" />
      <YesNoRow label="ქმედება ეფექტიანია:" />
      <YesNoRow label="RM-01 რისკ. რეესტრი განახლდა:" />
      <FieldRow label="RM-01 №:" />
      <FieldRow2 label1="დახურვის თარიღი:" label2="ხარ. მენეჯ. ვერიფ.:" />

      <SigBlock3 labels={['შემავსებელი', 'ხარ. მენეჯერი', 'დირექტორი']} />
      <FormFooter code="FM-10 v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);

export default FM10_CAPAFormPdf;
