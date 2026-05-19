import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, FieldRow, FieldRow2 } from './FormBase';

const FM16_VisitRecordPdf = () => (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader
        code="FM-16"
        isoRef="სსტ ISO/IEC 17020 §7.3"
        title="ვიზიტის ჩანაწერი"
        subtitle="Site Visit Record"
      />

      {/* A */}
      <Text style={s.secH}>A. საიდენტიფიკაციო მონაცემები</Text>
      <View style={s.tBorder}>
        {[
          ['საქმის №:','ვიზიტის # (სულ:__-დან):'],
          ['ვიზიტის თარიღი:','დრო (დაწ.–დამ.):'],
          ['ობიექტის მისამართი:','ინსპექტორი:'],
          ['დამკვ. წარმომ.:','კონტრ. წარმომ.:'],
        ].map(([l1,l2],i) => (
          <View key={i} style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ccc' }}>
            <View style={{ flex: 1, padding: 4, borderRightWidth: 0.5, borderRightColor: '#ccc' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 8.5 }}>{l1}</Text>
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#000', minHeight: 12, marginTop: 2 }} />
            </View>
            <View style={{ flex: 1, padding: 4 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 8.5 }}>{l2}</Text>
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#000', minHeight: 12, marginTop: 2 }} />
            </View>
          </View>
        ))}
      </View>

      {/* B */}
      <Text style={s.secH}>B. ვიზიტის სახე</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 6, marginLeft: 6 }}>
        {['დაგეგმილი','სპონტ. / შეუსათ.','ფარ. სამ. შემ.','საკ. ეტ. შ.','გაზომვის','მიღ.-ჩაბ.'].map(t => (
          <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={s.box} /><Text style={{ fontSize: 9 }}>{t}</Text>
          </View>
        ))}
      </View>

      {/* C */}
      <Text style={s.secH}>C. გამოყენებული ინსტრუმენტები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { flex: 1 }]}><Text>ინსტ. დასახ.</Text></View>
          <View style={[s.tHead, { width: '20%' }]}><Text>სარ. №</Text></View>
          <View style={[s.tHead, { width: '22%' }]}><Text>კალ. ვ.</Text></View>
          <View style={[s.tHead, { width: '28%' }]}><Text>ჩვ. / შედ.</Text></View>
        </View>
        {[...Array(4)].map((_, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { flex: 1, minHeight: 18 }]} />
            <View style={[s.tCell, { width: '20%' }]} />
            <View style={[s.tCell, { width: '22%' }]} />
            <View style={[s.tCell, { width: '28%' }]} />
          </View>
        ))}
      </View>

      {/* D */}
      <Text style={s.secH}>D. დაკვირვებები და გაზომვები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '4%' }]}><Text>#</Text></View>
          <View style={[s.tHead, { flex: 1 }]}><Text>სამ./ელ. დასახ.</Text></View>
          <View style={[s.tHead, { width: '18%' }]}><Text>ფაქტ. გაზ.</Text></View>
          <View style={[s.tHead, { width: '18%' }]}><Text>სახ. გაზ.</Text></View>
          <View style={[s.tHead, { width: '15%' }]}><Text>გადახ.</Text></View>
          <View style={[s.tHead, { width: '22%' }]}><Text>შენ.</Text></View>
        </View>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '4%' }]}><Text>{i+1}</Text></View>
            <View style={[s.tCell, { flex: 1, minHeight: 18 }]} />
            <View style={[s.tCell, { width: '18%' }]} />
            <View style={[s.tCell, { width: '18%' }]} />
            <View style={[s.tCell, { width: '15%' }]} />
            <View style={[s.tCell, { width: '22%' }]} />
          </View>
        ))}
      </View>

      {/* E */}
      <Text style={s.secH}>E. ფოტოდოკუმენტაცია</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '15%' }]}><Text>ფოტო №</Text></View>
          <View style={[s.tHead, { flex: 1 }]}><Text>აღწერა</Text></View>
          <View style={[s.tHead, { width: '30%' }]}><Text>GPS კოორ.</Text></View>
        </View>
        {[...Array(4)].map((_, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '15%', minHeight: 16 }]} />
            <View style={[s.tCell, { flex: 1 }]} />
            <View style={[s.tCell, { width: '30%' }]} />
          </View>
        ))}
      </View>

      {/* F */}
      <Text style={s.secH}>F. გამოვლენილი შეუსაბამობები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '4%' }]}><Text>#</Text></View>
          <View style={[s.tHead, { flex: 1 }]}><Text>შეუსაბ. აღწ.</Text></View>
          <View style={[s.tHead, { width: '20%' }]}><Text>კატ.</Text></View>
          <View style={[s.tHead, { width: '28%' }]}><Text>მოთ. / ვ.</Text></View>
        </View>
        {[...Array(3)].map((_, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '4%' }]}><Text>{i+1}</Text></View>
            <View style={[s.tCell, { flex: 1, minHeight: 18 }]} />
            <View style={[s.tCell, { width: '20%' }]} />
            <View style={[s.tCell, { width: '28%' }]} />
          </View>
        ))}
      </View>
      <Text style={{ fontSize: 7.5, color: '#555', marginBottom: 6 }}>კატ.: კ — კრიტიკული | ა — არსებითი | ფ — ფორმალური</Text>

      {/* G */}
      <Text style={s.secH}>G. ადგილზე ხელმოწერები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { flex: 1 }]}><Text>მხარე</Text></View>
          <View style={[s.tHead, { width: '28%' }]}><Text>სახელი/გვარი</Text></View>
          <View style={[s.tHead, { width: '28%' }]}><Text>ხელმ. / დრო</Text></View>
        </View>
        {['ინსპექტორი','დამ. წარმომ.','კონტ. წარმომ.'].map((r, i) => (
          <View key={r} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { flex: 1 }]}><Text>{r}</Text></View>
            <View style={[s.tCell, { width: '28%', minHeight: 22 }]} />
            <View style={[s.tCell, { width: '28%' }]} />
          </View>
        ))}
      </View>

      <FormFooter code="FM-16 v2.0 | 28.04.2026 | შენახვა: 10 წელი" />
    </Page>
  </Document>
);

export default FM16_VisitRecordPdf;
