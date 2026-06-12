import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, FieldRow, FieldRow2 } from './FormBase';

const RatingRow = ({ label, value }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#ccc', paddingVertical: 3 }}>
    <Text style={{ flex: 1, fontSize: 8 }}>{label}</Text>
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {[1,2,3,4,5].map(n => (
        <View key={n} style={{ alignItems: 'center', width: 22 }}>
          <View style={Number(value)===n ? s.boxChecked : s.box}>
            {Number(value)===n && <Text style={{ color: '#fff', fontSize: 6, fontWeight: 'bold' }}>✓</Text>}
          </View>
        </View>
      ))}
    </View>
  </View>
);

const FM19_CustomerSatisfactionPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  return (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader code="BE-FM-SATISF" isoRef="სსტ ISO/IEC 17020 §8.5" title="მომხმარებლის კმაყოფილების კვლევა" subtitle="Customer Satisfaction Survey" />

      <Text style={s.secH}>A. საიდენტიფიკაციო მონაცემები</Text>
      <FieldRow2 label1="BE-CASE №:" value1={data.caseNumber} label2="კვლევის თარიღი:" value2={data.surveyDate} />
      <FieldRow label="კლიენტი / ორგანიზაცია:" value={data.clientName} />
      <FieldRow2 label1="წარმომადგენელი:" value1={data.clientRep} label2="საკონტაქტო ელ.ფოსტა:" value2={data.email} />
      <FieldRow label="ინსპექტირების სფერო:" value={data.inspScope} />

      <Text style={s.secH}>B. კმაყოფილების შეფასება (1 — ძალიან ცუდი → 5 — შესანიშნავი)</Text>
      <View style={[s.tBorder, { marginBottom: 4 }]}>
        <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#003366', backgroundColor: '#003366', paddingVertical: 3, paddingHorizontal: 3 }}>
          <Text style={{ flex: 1, fontSize: 7.5, color: '#fff', fontWeight: 'bold' }}>შეფასების კრიტერიუმი</Text>
          {[1,2,3,4,5].map(n => (
            <Text key={n} style={{ width: 22, textAlign: 'center', fontSize: 7.5, color: '#fff', fontWeight: 'bold' }}>{n}</Text>
          ))}
        </View>
        <RatingRow label="1. მომსახურების ზოგადი ხარისხი" value={data.q1} />
        <RatingRow label="2. ინსპექტირების პროფესიონალიზმი" value={data.q2} />
        <RatingRow label="3. ანგარიშის სიზუსტე და სრულყოფილება" value={data.q3} />
        <RatingRow label="4. მომსახურების ვადების დაცვა" value={data.q4} />
        <RatingRow label="5. კომუნიკაცია და ინფორმირებულობა" value={data.q5} />
        <RatingRow label="6. პერსონალის კომპეტენტურობა" value={data.q6} />
        <RatingRow label="7. ფასი / მომსახურების თანაფარდობა" value={data.q7} />
        <RatingRow label="8. ზოგადი კმაყოფილება" value={data.q8} />
      </View>

      <Text style={s.secH}>C. დამატებითი კითხვები</Text>
      <View style={[s.tBorder, { marginBottom: 4 }]}>
        {[
          ['კვლავ ისარგებლებდით ჩვენი მომსახურებით?', data.wouldReturn],
          ['გვირჩევდით სხვა კლიენტებს?', data.wouldRecommend],
          ['გამოვლინდა კონფლიქტი ინტერესებთან?', data.conflictFound],
        ].map(([lbl, val], i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#ccc', paddingVertical: 3, paddingHorizontal: 3 }}>
            <Text style={{ flex: 1, fontSize: 8 }}>{lbl}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <View style={val==='yes' ? s.boxChecked : s.box}>{val==='yes' && <Text style={{ color: '#fff', fontSize: 6, fontWeight: 'bold' }}>✓</Text>}</View>
                <Text style={{ fontSize: 8 }}>კი</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <View style={val==='no' ? s.boxChecked : s.box}>{val==='no' && <Text style={{ color: '#fff', fontSize: 6, fontWeight: 'bold' }}>✓</Text>}</View>
                <Text style={{ fontSize: 8 }}>არა</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <Text style={s.secH}>D. შენიშვნები და წინადადებები</Text>
      <View style={[s.textarea, { minHeight: 40 }]}>
        {data.comments
          ? <Text style={{ fontSize: 8.5, lineHeight: 1.4 }}>{data.comments}</Text>
          : <Text style={{ fontSize: 8, color: '#bbb' }}>შენიშვნები, საჩივარი, წინადადება გაუმჯობესებისათვის...</Text>}
      </View>

      <Text style={s.secH}>E. საშუალო ქულა</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <Text style={{ fontSize: 9, fontWeight: 'bold', marginRight: 8 }}>საერთო საშუალო ქულა:</Text>
        <View style={{ borderWidth: 0.5, borderColor: '#003366', padding: 4, minWidth: 40, alignItems: 'center' }}>
          {data.avgScore
            ? <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#003366' }}>{data.avgScore}</Text>
            : <Text style={{ fontSize: 9, color: '#bbb' }}>___ / 5</Text>}
        </View>
        <Text style={{ fontSize: 7.5, color: '#555', marginLeft: 10 }}>
          (ავტომ. გამოთვლა: ჯამი ÷ 8 | ≥4.0 = კმაყ. | 3.0–3.9 = შუალედური | &lt;3.0 = CAPA)
        </Text>
      </View>

      <Text style={s.secH}>F. ხელმოწერა</Text>
      <View style={s.sig2Row}>
        <View style={s.sig2Block}>
          <Text style={s.sigTitle}>კლიენტის წარმომადგენელი:</Text>
          {sigs[0]?.name ? <Text style={{ fontSize: 7.5, marginBottom: 1 }}>{sigs[0].name}</Text> : null}
          <View style={{ height: 26 }} />
          <View style={{ borderTopWidth: 0.5, borderTopColor: '#000', paddingTop: 2 }}>
            <Text style={{ fontSize: 7, textAlign: 'center' }}>{sigs[0]?.date || 'ხელმოწერა / თარიღი'}</Text>
          </View>
        </View>
        <View style={s.sig2Block}>
          <Text style={s.sigTitle}>ხარისხის მენეჯერი (მიღება):</Text>
          {sigs[1]?.name ? <Text style={{ fontSize: 7.5, marginBottom: 1 }}>{sigs[1].name}</Text> : null}
          <View style={{ height: 26 }} />
          <View style={{ borderTopWidth: 0.5, borderTopColor: '#000', paddingTop: 2 }}>
            <Text style={{ fontSize: 7, textAlign: 'center' }}>{sigs[1]?.date || 'ხელმოწერა / თარიღი'}</Text>
          </View>
        </View>
      </View>

      <FormFooter code="BE-FM-SATISF v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM19_CustomerSatisfactionPdf;
