import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow2 } from './FormBase';

const FM24_ChangeRegisterPdf = () => (
  <Document>
    <Page size="A4" orientation="landscape" style={[s.page, { paddingHorizontal: 30 }]}>
      <WM />
      <FormHeader
        code="FM-24"
        isoRef="სსტ ISO/IEC 17020 §8.3 (PR-01)"
        title="ცვლილებების რეგისტრი"
        subtitle="Document Change Register"
      />

      <FieldRow2 label1="პასუხ. (ხარ. მ.):" label2="პერიოდი (წელი):" />

      <Text style={s.secH}>ცვლილებების ჟურნალი</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '4%' }]}><Text>#</Text></View>
          <View style={[s.tHead, { width: '14%' }]}><Text>FM-23 №</Text></View>
          <View style={[s.tHead, { flex: 1 }]}><Text>დოკ. სახელი</Text></View>
          <View style={[s.tHead, { width: '8%' }]}><Text>ძვ. ვ.</Text></View>
          <View style={[s.tHead, { width: '8%' }]}><Text>ახ. ვ.</Text></View>
          <View style={[s.tHead, { width: '11%' }]}><Text>ძ. შ. თ.</Text></View>
          <View style={[s.tHead, { width: '18%' }]}><Text>ცვლ. ხასიათი</Text></View>
          <View style={[s.tHead, { width: '10%' }]}><Text>FM-22</Text></View>
        </View>
        {[...Array(22)].map((_, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '4%' }]}><Text style={{ fontSize: 7.5 }}>{i+1}</Text></View>
            <View style={[s.tCell, { width: '14%', minHeight: 16 }]} />
            <View style={[s.tCell, { flex: 1 }]} />
            <View style={[s.tCell, { width: '8%' }]} />
            <View style={[s.tCell, { width: '8%' }]} />
            <View style={[s.tCell, { width: '11%' }]} />
            <View style={[s.tCell, { width: '18%' }]} />
            <View style={[s.tCell, { width: '10%' }]} />
          </View>
        ))}
      </View>
      <Text style={{ fontSize: 7.5, color: '#555', marginBottom: 6 }}>
        ცვლ. ხ.: რ — რედ. | ა — ახალი | ა/ა — ამ. / ალ. | შ — შ. მმ.  |  FM-22: ✓ — ჩ. | — — ზ.
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 6 }}>
        <View style={{ width: '35%' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 9 }}>ხარისხის მენეჯერი:</Text>
          <View style={s.sigLine}><Text>ხელმ. / თარიღი</Text></View>
        </View>
      </View>

      <FormFooter code="FM-24 v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);

export default FM24_ChangeRegisterPdf;
