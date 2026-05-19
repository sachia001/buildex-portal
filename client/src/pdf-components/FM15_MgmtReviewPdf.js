import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, FieldRow, FieldRow2 } from './FormBase';

const FM15_MgmtReviewPdf = () => (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader
        code="FM-15"
        isoRef="სსტ ISO/IEC 17020 §8.5"
        title="მენეჯმენტის ანალიზი — სხდომის ოქმი"
        subtitle="Management Review Record"
      />

      {/* 1 */}
      <Text style={s.secH}>1. სხდომის რეკვიზიტები</Text>
      <View style={s.tBorder}>
        {[
          ['სხდომის №:','თარიღი:'],
          ['ადგილი:','თავმჯდომარე:'],
          ['მდივანი:',''],
        ].map(([l1,l2],i) => (
          <View key={i} style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ccc' }}>
            <View style={{ flex: 1, padding: 5, borderRightWidth: 0.5, borderRightColor: '#ccc' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 8.5 }}>{l1}</Text>
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#000', minHeight: 13, marginTop: 3 }} />
            </View>
            <View style={{ flex: 1, padding: 5 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 8.5 }}>{l2}</Text>
              {l2 && <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#000', minHeight: 13, marginTop: 3 }} />}
            </View>
          </View>
        ))}
        <View style={{ padding: 5 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 8.5 }}>მონაწილეები:</Text>
          <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#000', minHeight: 20, marginTop: 3 }} />
        </View>
      </View>

      {/* 2 — დღ. წ. */}
      <Text style={s.secH}>2. სავალდებულო დღის წესრიგი (ISO §8.5.2)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '5%' }]}><Text>#</Text></View>
          <View style={[s.tHead, { flex: 1 }]}><Text>საკითხი</Text></View>
          <View style={[s.tHead, { width: '12%' }]}><Text>ფორმა</Text></View>
          <View style={[s.tHead, { width: '14%' }]}><Text>სტ. (✓)</Text></View>
          <View style={[s.tHead, { width: '28%' }]}><Text>შენიშვნა / გადაწ.</Text></View>
        </View>
        {[
          ['1','წინა სხდ. გადაწ. შემოწმება','FM-15'],
          ['2','ხარ. პოლიტიკა და მიზნები','POL-01'],
          ['3','შიდა აუდიტის შედეგები','FM-04'],
          ['4','გარე შეფ. (GAC) შედეგები',''],
          ['5','საჩივრები და აპელ.','FM-06'],
          ['6','შეუსაბამო სამუშაო','FM-14'],
          ['7','CAPA სტატუსი','FM-10'],
          ['8','პერს. კომპ. და ტრ.','FM-08/13'],
          ['9','კალიბ. / ვერიფ. სტ.','FM-07'],
          ['10','მოსალ. ცვლილებები',''],
          ['11','რესურსები',''],
          ['12','მიუკ. საფრთხეები','RM-01'],
          ['13','ქვეკ. შეფ.','FM-12'],
          ['14','ხარ. მიზნების მიღ.',''],
        ].map(([n, item, form], i) => (
          <View key={n} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '5%' }]}><Text>{n}</Text></View>
            <View style={[s.tCell, { flex: 1 }]}><Text>{item}</Text></View>
            <View style={[s.tCell, { width: '12%' }]}><Text>{form}</Text></View>
            <View style={[s.tCell, { width: '14%', minHeight: 18 }]} />
            <View style={[s.tCell, { width: '28%' }]} />
          </View>
        ))}
      </View>

      {/* 3 — გამ. */}
      <Text style={s.secH}>3. მოქმედების გეგმა</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '5%' }]}><Text>#</Text></View>
          <View style={[s.tHead, { flex: 1 }]}><Text>ქმედება</Text></View>
          <View style={[s.tHead, { width: '22%' }]}><Text>პასუხ.</Text></View>
          <View style={[s.tHead, { width: '18%' }]}><Text>ვადა</Text></View>
          <View style={[s.tHead, { width: '15%' }]}><Text>სტ.</Text></View>
        </View>
        {[...Array(5)].map((_, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '5%' }]}><Text>{i+1}</Text></View>
            <View style={[s.tCell, { flex: 1, minHeight: 20 }]} />
            <View style={[s.tCell, { width: '22%' }]} />
            <View style={[s.tCell, { width: '18%' }]} />
            <View style={[s.tCell, { width: '15%' }]} />
          </View>
        ))}
      </View>

      {/* 4 — ეფ. */}
      <Text style={s.secH}>4. ხმს ეფექტიანობის შეფასება</Text>
      <View style={{ flexDirection: 'row', gap: 24, marginBottom: 8, marginLeft: 6 }}>
        {['✅ ეფექტიანი','⚠️ ნაწ. ეფ.','❌ არ ეფ. — CAPA'].map(t => (
          <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={s.box} /><Text style={{ fontSize: 9 }}>{t}</Text>
          </View>
        ))}
      </View>

      {/* Sig */}
      <View style={s.sigRow}>
        {['სხდ. თავმჯდ.','ხარ. მენეჯერი','დირექტორი'].map(lbl => (
          <View key={lbl} style={s.sigBlock}>
            <Text style={s.sigTitle}>{lbl}:</Text>
            <View style={s.sigLine}><Text>ხელმ. / თარიღი</Text></View>
          </View>
        ))}
      </View>

      <FormFooter code="FM-15 v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);

export default FM15_MgmtReviewPdf;
