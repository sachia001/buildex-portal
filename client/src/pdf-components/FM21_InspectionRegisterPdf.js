import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, FieldRow2 } from './FormBase';

const FM21_InspectionRegisterPdf = () => (
  <Document>
    <Page size="A4" orientation="landscape" style={[s.page, { paddingHorizontal: 30 }]}>
      <WM />
      <FormHeader
        code="FM-21"
        isoRef="სსტ ISO/IEC 17020 §7.3"
        title="ინსპექტირებების რეგისტრი (ჟურნალი)"
        subtitle="Inspection Register / Journal"
      />

      {/* A */}
      <Text style={s.secH}>A. ჟურნალის მონაცემები</Text>
      <FieldRow2 label1="ჟურნალის №:" label2="პერიოდი (წელი):" />
      <FieldRow2 label1="პასუხ. პირი (ხარ. მენ.):" label2="გახსნის თარიღი:" />

      {/* B — მთ. ცხრ. */}
      <Text style={s.secH}>B. ინსპექტირებების სია</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '4%' }]}><Text>#</Text></View>
          <View style={[s.tHead, { width: '14%' }]}><Text>საქმის №</Text></View>
          <View style={[s.tHead, { width: '18%' }]}><Text>დამკვეთი</Text></View>
          <View style={[s.tHead, { width: '20%' }]}><Text>ობიექტი / მისამ.</Text></View>
          <View style={[s.tHead, { width: '10%' }]}><Text>სახე</Text></View>
          <View style={[s.tHead, { width: '12%' }]}><Text>ინსპ-რი</Text></View>
          <View style={[s.tHead, { width: '8%' }]}><Text>დაწ.</Text></View>
          <View style={[s.tHead, { width: '8%' }]}><Text>დამ.</Text></View>
          <View style={[s.tHead, { width: '6%' }]}><Text>სტ.</Text></View>
        </View>
        {[...Array(18)].map((_, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '4%' }]}><Text style={{ fontSize: 7.5 }}>{i+1}</Text></View>
            <View style={[s.tCell, { width: '14%', minHeight: 16 }]} />
            <View style={[s.tCell, { width: '18%' }]} />
            <View style={[s.tCell, { width: '20%' }]} />
            <View style={[s.tCell, { width: '10%' }]} />
            <View style={[s.tCell, { width: '12%' }]} />
            <View style={[s.tCell, { width: '8%' }]} />
            <View style={[s.tCell, { width: '8%' }]} />
            <View style={[s.tCell, { width: '6%' }]} />
          </View>
        ))}
      </View>
      <Text style={{ fontSize: 7.5, color: '#555', marginBottom: 8 }}>
        სახე: PR-01=ხ/ა | PR-02=ფ2 | PR-03=ფ/ა | PR-04=ზ/ი  |  სტ.: R=რეგ. | A=მიმდ. | C=დამ. | S=შეჩ.
      </Text>

      {/* C — სტ. */}
      <Text style={s.secH}>C. კვარტალური სტატისტიკა</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { flex: 1 }]}><Text>მაჩვ.</Text></View>
          <View style={[s.tHead, { width: '12%' }]}><Text>I კვ.</Text></View>
          <View style={[s.tHead, { width: '12%' }]}><Text>II კვ.</Text></View>
          <View style={[s.tHead, { width: '12%' }]}><Text>III კვ.</Text></View>
          <View style={[s.tHead, { width: '12%' }]}><Text>IV კვ.</Text></View>
          <View style={[s.tHead, { width: '12%' }]}><Text>სულ</Text></View>
        </View>
        {['სულ მოთხ.','ჩატ.','უარ.','შეჩ.','გადატ.','საჩ.'].map((item,i) => (
          <View key={item} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { flex: 1 }]}><Text>{item}</Text></View>
            {[...Array(5)].map((_,j) => (
              <View key={j} style={[s.tCell, { width: '12%', minHeight: 16 }]} />
            ))}
          </View>
        ))}
      </View>

      {/* Sig */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
        <View style={{ width: '35%' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 9 }}>ხარისხის მენეჯერი:</Text>
          <View style={s.sigLine}><Text>ხელმ. / თარიღი</Text></View>
        </View>
      </View>

      <FormFooter code="FM-21 v2.0 | 28.04.2026 | შენახვა: 10 წელი" />
    </Page>
  </Document>
);

export default FM21_InspectionRegisterPdf;
