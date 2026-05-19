import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, FieldRow, FieldRow2, YesNoRow } from './FormBase';

const FM14_NonConformingPdf = () => (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader
        code="FM-14"
        isoRef="სსტ ISO/IEC 17020 §8.7"
        title="შეუსაბამო სამუშაოს მართვა"
        subtitle="Non-Conforming Work Control"
      />

      {/* 1 */}
      <Text style={s.secH}>1. შეუსაბამობის იდენტიფიკაცია (ISO §8.7.1)</Text>
      <FieldRow2 label1="№ (BE-NC-YYYY-____):" label2="გამოვლენის თარიღი:" />
      <FieldRow label="ინსპ. საქმე (BE-CASE):" />
      <FieldRow label="ობიექტი:" />
      <FieldRow label="გამომვლენი პირი / ფუნქცია:" />
      <Text style={[s.fLabel, { marginBottom: 3 }]}>შეუსაბამობის წყარო:</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 8, marginLeft: 6 }}>
        {['შიდა შემოწმება','ტექ. გადახედვა','კლიენტის შეტყობინება','გარე შეფ. (GAC)'].map(t => (
          <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={s.box} /><Text style={{ fontSize: 9 }}>{t}</Text>
          </View>
        ))}
      </View>

      {/* 2 */}
      <Text style={s.secH}>2. შეუსაბამობის აღწერა</Text>
      <FieldRow label="ISO / სტ. კლაუზი:" />
      <View style={[s.textarea, { minHeight: 45 }]}>
        <Text style={{ fontSize: 8.5, color: '#aaa' }}>(კონკრეტული შეუსაბამობის აღწერა)</Text>
      </View>

      {/* 3 */}
      <Text style={s.secH}>3. გავლენის შეფასება (ISO §8.7.2)</Text>
      <View style={{ gap: 5, marginBottom: 6, marginLeft: 6 }}>
        {[
          '⚠️ ანგარიში გაეგზავნა კლიენტს — ᲡᲐᲡᲬᲠᲐᲤᲝ შეჩერება / გამოთხოვა',
          '🔄 ანგარიში კვლავ ინსპ. ორგანოშია — გაუქმება / კორექცია',
          '📋 სხვა ინსპ. საქმეებზე გავლენა გამოვლინდა',
          '✅ ადრეულ ეტაპზე გამოვლინდა — კლიენტზე გავლენა არ არის',
        ].map((t, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={s.box} /><Text style={{ fontSize: 9 }}>{t}</Text>
          </View>
        ))}
      </View>

      {/* 4 */}
      <Text style={s.secH}>4. მყისიერი მოქმედება (ISO §8.7.3)</Text>
      <View style={[s.textarea, { minHeight: 35 }]} />
      <FieldRow2 label1="პასუხისმ.:" label2="ვადა:" />

      {/* 5 */}
      <Text style={s.secH}>5. მიზეზის ანალიზი (Root Cause)</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 6, marginLeft: 6 }}>
        {['ადამ. ფაქტ.','პრ. შეუსაბ.','მოწ. შეუსაბ.','კომპ. ნაკლ.','ინფ. ნაკლ.','სხვა'].map(t => (
          <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={s.box} /><Text style={{ fontSize: 9 }}>{t}</Text>
          </View>
        ))}
      </View>
      <FieldRow label="ფესვის მიზეზი (კონკრ.):" />

      {/* 6 */}
      <Text style={s.secH}>6. კორექციული ქმედება (FM-10 — CAPA)</Text>
      <FieldRow2 label1="FM-10 CAPA №:" label2="ვადა:" />
      <View style={[s.textarea, { minHeight: 30 }]} />

      {/* 7 */}
      <Text style={s.secH}>7. დახურვა</Text>
      <YesNoRow label="კორ. ქმედება შესრულდა და ეფ. დადასტ.:" />
      <FieldRow2 label1="დახ. თარიღი:" label2="ხარ. მენ. ვერ.:" />

      {/* 3-col sig */}
      <View style={s.sigRow}>
        {['ხარ. მენეჯერი','ტექ. მენეჯერი','დირექტორი'].map(lbl => (
          <View key={lbl} style={s.sigBlock}>
            <Text style={s.sigTitle}>{lbl}:</Text>
            <View style={s.sigLine}><Text>ხელმ. / თარიღი</Text></View>
          </View>
        ))}
      </View>

      <FormFooter code="FM-14 v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);

export default FM14_NonConformingPdf;
