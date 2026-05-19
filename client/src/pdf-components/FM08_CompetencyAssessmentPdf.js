import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2, YesNoRow } from './FormBase';

const FM08_CompetencyAssessmentPdf = () => (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader
        code="FM-08"
        isoRef="სსტ ISO/IEC 17020 §6.1"
        title="კომპეტენციის შეფასება"
        subtitle="Competency Assessment Form"
      />

      {/* A — ინსპექტორი */}
      <Text style={s.secH}>A. ინსპექტორის მონაცემები</Text>
      <FieldRow2 label1="სახელი / გვარი:" label2="პირადი №:" />
      <FieldRow2 label1="თანამდებობა:" label2="შეფასების თარიღი:" />
      <FieldRow label="შემფასებელი (ტექ./ხარ. მენეჯერი):" />

      {/* B — ტიპი და სფერო */}
      <Text style={s.secH}>B. შეფასების ტიპი და სფერო</Text>
      <View style={{ flexDirection: 'row', gap: 20, marginBottom: 6, marginLeft: 6 }}>
        {['საწყისი', 'პერიოდული', 'ადგილზე დაკვირვება (witnessing)'].map(t => (
          <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={s.box} /><Text style={{ fontSize: 9 }}>{t}</Text>
          </View>
        ))}
      </View>
      <FieldRow label="აკრედიტაციის სფერო (BE-PR-XX):" />
      <YesNoRow label="განათლება შეესაბამება სფეროს მოთხოვნებს:" />
      <FieldRow label="გამოცდილება სფეროში (წელი):" />

      {/* C — ქულები */}
      <Text style={s.secH}>C. შეფასების კრიტერიუმები (1–5 ქულა)</Text>
      <Text style={{ fontSize: 7.5, color: '#555', marginBottom: 4 }}>
        1 — არ შეესაბამება  |  2 — ნაწილობრივ  |  3 — საკმარისი  |  4 — კარგი  |  5 — შესანიშნავი
      </Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '5%' }]}><Text>#</Text></View>
          <View style={[s.tHead, { flex: 1 }]}><Text>კრიტერიუმი</Text></View>
          <View style={[s.tHead, { width: '18%' }]}><Text>ქულა (1–5)</Text></View>
          <View style={[s.tHead, { width: '30%' }]}><Text>კომენტარი</Text></View>
        </View>
        {[
          'სამშენებლო ნორმებისა და СНиП-ების ცოდნა',
          'სსტ ISO/IEC 17020:2012 მოთხოვნების ცოდნა',
          'გაზომვების პრაქტიკული უნარი',
          'ანგარიშის შედგენისა და დოკუმენტირების უნარი',
          'ადგილზე დაკვირვება (witnessing) — შედეგი',
        ].map((item, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '5%' }]}><Text>{i+1}</Text></View>
            <View style={[s.tCell, { flex: 1 }]}><Text>{item}</Text></View>
            <View style={[s.tCell, { width: '18%', minHeight: 22 }]} />
            <View style={[s.tCell, { width: '30%' }]} />
          </View>
        ))}
        <View style={[s.tRow, { backgroundColor: '#e8f0f7' }]}>
          <View style={[s.tCell, { width: '5%' }]} />
          <View style={[s.tCell, { flex: 1 }]}><Text style={{ fontWeight: 'bold' }}>ჯამი</Text></View>
          <View style={[s.tCell, { width: '18%' }]}><Text style={{ fontWeight: 'bold' }}>____ / 25</Text></View>
          <View style={[s.tCell, { width: '30%' }]} />
        </View>
      </View>

      {/* D — გადაწყვეტა */}
      <Text style={s.secH}>D. გადაწყვეტილება</Text>
      <View style={{ flexDirection: 'row', gap: 18, marginBottom: 8, marginLeft: 6 }}>
        {['✅ ავტორიზაცია', '🔄 გაგრძელება', '📚 ტრენინგი საჭირო', '🚫 სფეროდან ჩამოშორება'].map(t => (
          <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={s.box} /><Text style={{ fontSize: 9 }}>{t}</Text>
          </View>
        ))}
      </View>
      <FieldRow label="ტრენინგის საჭიროება (კონკრეტული):" />
      <FieldRow label="ავტორიზაციის ვადა / მომდ. შეფასება:" />

      <SigBlock3 labels={['ინსპექტორი', 'ტექ. მენეჯერი', 'ხარ. მენეჯერი']} />
      <FormFooter code="FM-08 v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);

export default FM08_CompetencyAssessmentPdf;
