import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2 } from './FormBase';

const FM13_TrainingRecordNewPdf = () => (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader
        code="FM-13"
        isoRef="სსტ ISO/IEC 17020 §6.1"
        title="ტრენინგის ჩანაწერი"
        subtitle="Training Record"
      />

      {/* A */}
      <Text style={s.secH}>A. თანამშრომლის მონაცემები</Text>
      <FieldRow2 label1="სახელი / გვარი:" label2="პირადი №:" />
      <FieldRow2 label1="თანამდებობა:" label2="ტრენინგის თარიღი:" />
      <FieldRow2 label1="ხანგრძლივობა (სთ):" label2="ადგილი:" />

      {/* B — ტიპი */}
      <Text style={s.secH}>B. ტრენინგის სახე</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 6, marginLeft: 6 }}>
        {['შიდა ტრენინგი','გარე ტრენინგი','Witnessing (ადგ. დაკვ.)','ახ. ინსპ. ზედამხ.','ნორმ. დოკ. სწავლება','IT / პოგრ.','სხვა'].map(t => (
          <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={s.box} /><Text style={{ fontSize: 9 }}>{t}</Text>
          </View>
        ))}
      </View>

      {/* C — შინაარსი */}
      <Text style={s.secH}>C. ტრენინგის შინაარსი</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { flex: 1 }]}><Text>ტრენინგის სათაური / თემა</Text></View>
          <View style={[s.tHead, { width: '28%' }]}><Text>ორგ. / ტრენერი</Text></View>
          <View style={[s.tHead, { width: '22%' }]}><Text>კატეგორია</Text></View>
        </View>
        {[...Array(3)].map((_, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { flex: 1, minHeight: 22 }]} />
            <View style={[s.tCell, { width: '28%' }]} />
            <View style={[s.tCell, { width: '22%' }]} />
          </View>
        ))}
      </View>

      {/* D — შეფ. */}
      <Text style={s.secH}>D. კომპეტენციის შეფასების მეთოდი</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 4, marginLeft: 6 }}>
        {['წერილობ. ტესტი','ადგ. დაკვ. (witnessing)','ზეპ. გამოკ.','პრაქტ. სავ.','ტექ. მენ. შეფ.'].map(m => (
          <View key={m} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={s.box} /><Text style={{ fontSize: 9 }}>{m}</Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 20, marginBottom: 8, marginLeft: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={s.box} /><Text style={{ fontSize: 9 }}>✅ კომპეტენტური</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={s.box} /><Text style={{ fontSize: 9 }}>🔄 ტრ. გრძელდება</Text>
        </View>
      </View>

      {/* E — სტატუსი */}
      <Text style={s.secH}>E. კომპეტენციის სტატუსი</Text>
      <View style={{ flexDirection: 'row', gap: 20, marginBottom: 6, marginLeft: 6 }}>
        {['სრულად კომპეტ.','ნაწ. კომპეტ.','კომპ. არ დადასტ.'].map(t => (
          <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={s.box} /><Text style={{ fontSize: 9 }}>{t}</Text>
          </View>
        ))}
      </View>
      <FieldRow label="მომდ. ტრენინგის / შეფ. თარიღი:" />
      <FieldRow label="შენიშვნა / კომენტარი:" />

      <SigBlock3 labels={['თანამშრომელი', 'ტექ. მენეჯერი', 'ხარ. მენეჯერი']} />
      <FormFooter code="FM-13 v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);

export default FM13_TrainingRecordNewPdf;
