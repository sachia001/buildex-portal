import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, FieldRow, FieldRow2 } from './FormBase';

const FM11_InspectionPlanPdf = () => (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader
        code="FM-11"
        isoRef="სსტ ISO/IEC 17020 §7.1"
        title="ინსპექტირების გეგმა"
        subtitle="Inspection Plan"
      />

      {/* A — საიდ. */}
      <Text style={s.secH}>A. საიდენტიფიკაციო მონაცემები</Text>
      <View style={s.tBorder}>
        {[
          ['საქმის № (BE-CASE):','ინსპ. თარიღი:'],
          ['ობიექტის მისამართი:','დამკვეთი:'],
          ['ხელშეკ./განაცხ. №:','FM-09 №:'],
          ['ინსპექტორი:','ტექ. მენეჯერი:'],
        ].map(([l1,l2],i) => (
          <View key={i} style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ccc' }}>
            <View style={{ flex: 1, padding: 5, borderRightWidth: 0.5, borderRightColor: '#ccc' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 8.5 }}>{l1}</Text>
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#000', minHeight: 14, marginTop: 3 }} />
            </View>
            <View style={{ flex: 1, padding: 5 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 8.5 }}>{l2}</Text>
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#000', minHeight: 14, marginTop: 3 }} />
            </View>
          </View>
        ))}
      </View>

      {/* B — სფერო */}
      <Text style={s.secH}>B. ინსპექტირების სფერო და კრიტერიუმები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { flex: 1 }]}><Text>ინსპ. სფეროს დასახელება</Text></View>
          <View style={[s.tHead, { width: '32%' }]}><Text>გამოყენ. კრიტერიუმი (სტ. / ნ&წ)</Text></View>
          <View style={[s.tHead, { width: '18%' }]}><Text>სფეროს კოდი</Text></View>
        </View>
        {[...Array(3)].map((_, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { flex: 1, minHeight: 22 }]} />
            <View style={[s.tCell, { width: '32%' }]} />
            <View style={[s.tCell, { width: '18%' }]} />
          </View>
        ))}
      </View>

      {/* C — მეთოდი */}
      <Text style={s.secH}>C. ინსპექტირების მეთოდი</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 6, marginLeft: 6 }}>
        {['კამერალური (დოკ. ანალიზი)','საველე ვიზუალური','საველე ინსტრუმენტული','ფოტოფიქსაცია','ქვეკონტრ. ჩართვა'].map(m => (
          <View key={m} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={s.box} /><Text style={{ fontSize: 9 }}>{m}</Text>
          </View>
        ))}
      </View>

      {/* D — ვადები */}
      <Text style={s.secH}>D. გეგმური ვადები და ეტაპები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '5%' }]}><Text>#</Text></View>
          <View style={[s.tHead, { flex: 1 }]}><Text>ეტაპი</Text></View>
          <View style={[s.tHead, { width: '22%' }]}><Text>დაგეგმ. თარიღი</Text></View>
          <View style={[s.tHead, { width: '22%' }]}><Text>პასუხისმ.</Text></View>
          <View style={[s.tHead, { width: '18%' }]}><Text>სტატუსი</Text></View>
        </View>
        {[
          'დოკუმენტების მიღება / რეგისტრ.',
          'კამერალური ანალიზი',
          'საველე ვიზიტი',
          'ანგარიშის პროექტი',
          'ტექ. გადახედვა',
          'ანგარიშის გაცემა',
        ].map((stage, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '5%' }]}><Text>{i+1}</Text></View>
            <View style={[s.tCell, { flex: 1 }]}><Text>{stage}</Text></View>
            <View style={[s.tCell, { width: '22%', minHeight: 20 }]} />
            <View style={[s.tCell, { width: '22%' }]} />
            <View style={[s.tCell, { width: '18%' }]} />
          </View>
        ))}
      </View>

      {/* E — მოსაზ. */}
      <Text style={s.secH}>E. განსაკუთრებული მოსაზრებები / რისკები</Text>
      <View style={[s.textarea, { minHeight: 30 }]} />

      {/* F — FM-02 */}
      <Text style={s.secH}>F. მიუკერძოებლობის დეკლარაცია (FM-02)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { flex: 1 }]}><Text>ინსპექტორი</Text></View>
          <View style={[s.tHead, { width: '28%' }]}><Text>FM-02 №</Text></View>
          <View style={[s.tHead, { width: '28%' }]}><Text>ხელმოწ. / თარიღი</Text></View>
        </View>
        {[...Array(3)].map((_, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { flex: 1, minHeight: 20 }]} />
            <View style={[s.tCell, { width: '28%' }]} />
            <View style={[s.tCell, { width: '28%' }]} />
          </View>
        ))}
      </View>

      {/* Approval */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
        <View style={{ width: '46%' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 9 }}>ტექნიკური მენეჯერი (გეგმა დამტკიცდა):</Text>
          <View style={s.sigLine}><Text>ხელმ. / თარიღი</Text></View>
        </View>
      </View>

      <FormFooter code="FM-11 v2.0 | 28.04.2026 | შენახვა: 10 წელი" />
    </Page>
  </Document>
);

export default FM11_InspectionPlanPdf;
