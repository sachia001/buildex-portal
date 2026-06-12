import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, FieldRow2, SigBlock2 } from './FormBase';

const CheckItem = ({ num, label, value, note }) => (
  <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ccc', paddingVertical: 3, paddingHorizontal: 3 }}>
    <Text style={{ width: '6%', fontSize: 8, fontWeight: 'bold' }}>{num}.</Text>
    <Text style={{ flex: 1, fontSize: 8 }}>{label}</Text>
    <View style={{ flexDirection: 'row', gap: 6, width: '20%', justifyContent: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <View style={value==='yes' ? s.boxChecked : s.box}>{value==='yes' && <Text style={{ color: '#fff', fontSize: 6, fontWeight: 'bold' }}>✓</Text>}</View>
        <Text style={{ fontSize: 7 }}>კი</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <View style={value==='no' ? s.boxChecked : s.box}>{value==='no' && <Text style={{ color: '#fff', fontSize: 6, fontWeight: 'bold' }}>✓</Text>}</View>
        <Text style={{ fontSize: 7 }}>არა</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <View style={value==='na' ? s.boxChecked : s.box}>{value==='na' && <Text style={{ color: '#fff', fontSize: 6, fontWeight: 'bold' }}>✓</Text>}</View>
        <Text style={{ fontSize: 7 }}>N/A</Text>
      </View>
    </View>
    <View style={{ width: '28%', paddingLeft: 4 }}>
      {note ? <Text style={{ fontSize: 7.5 }}>{note}</Text> : <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#999', marginTop: 8 }} />}
    </View>
  </View>
);

const FM20_ReportVerificationPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  const chk = (k) => data[k];
  return (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader code="BE-FM-TECH-REVIEW" isoRef="სსტ ISO/IEC 17020 §7.4" title="ანგარიშის ტექნიკური გადამოწმება" subtitle="Technical Report Verification Checklist" />

      <Text style={s.secH}>A. საიდენტიფიკაციო მონაცემები</Text>
      <FieldRow2 label1="BE-CASE №:" value1={data.caseNumber} label2="BE-FM-IR ანგარიშის №:" value2={data.reportNumber} />
      <FieldRow2 label1="გადამოწმების თარიღი:" value1={data.verificationDate} label2="ვერიფიკატორი:" value2={data.verifier} />
      <FieldRow2 label1="ინსპექტორი:" value1={data.inspector} label2="ინსპექციის სფერო:" value2={data.inspScope} />

      <Text style={s.secH}>B. ტექნიკური შემოწმების ჩამონათვალი (კი / არა / N/A + კომენტარი)</Text>
      <View style={[s.tBorder, { marginBottom: 4 }]}>
        <View style={{ flexDirection: 'row', backgroundColor: '#003366', paddingVertical: 3, paddingHorizontal: 3 }}>
          <Text style={{ width: '6%', fontSize: 7.5, color: '#fff', fontWeight: 'bold' }}>№</Text>
          <Text style={{ flex: 1, fontSize: 7.5, color: '#fff', fontWeight: 'bold' }}>შემოწმების კრიტერიუმი</Text>
          <Text style={{ width: '20%', fontSize: 7.5, color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>კი / არა / N/A</Text>
          <Text style={{ width: '28%', fontSize: 7.5, color: '#fff', fontWeight: 'bold', paddingLeft: 4 }}>კომენტარი</Text>
        </View>
        <CheckItem num="1"  label="ანგარიში შეიცავს BE-CASE ნომერს და ობიექტის სრულ მისამართს" value={chk('ck1')} note={data.ck1_note} />
        <CheckItem num="2"  label="ინსპექტირების სფერო მკაფიოდ განსაზღვრულია (BE-PR-01..04)" value={chk('ck2')} note={data.ck2_note} />
        <CheckItem num="3"  label="გამოყენებული სტანდარტები და კრიტერიუმები მითითებულია" value={chk('ck3')} note={data.ck3_note} />
        <CheckItem num="4"  label="ინსპექტირების მეთოდები და გამოყენებული მოწყობილობა ჩამოთვლილია" value={chk('ck4')} note={data.ck4_note} />
        <CheckItem num="5"  label="ყველა შედეგი მკაფიოდ და ერთმნიშვნელოვნად ჩამოყალიბებულია" value={chk('ck5')} note={data.ck5_note} />
        <CheckItem num="6"  label="გამოვლენილი შეუსაბამობები კატეგორიზებულია (კრიტ./არსებ./ფორმ.)" value={chk('ck6')} note={data.ck6_note} />
        <CheckItem num="7"  label="ფოტო-დოკუმენტაცია (ასეთის არსებობისას) მითითებულია" value={chk('ck7')} note={data.ck7_note} />
        <CheckItem num="8"  label="დასკვნა ასახავს მთელი ინსპექტირების შედეგს" value={chk('ck8')} note={data.ck8_note} />
        <CheckItem num="9"  label="ანგარიში ხელმოწერილია ინსპექტორის მიერ" value={chk('ck9')} note={data.ck9_note} />
        <CheckItem num="10" label="ანგარიში შეესაბამება ISO/IEC 17020 §7.4 მოთხოვნებს" value={chk('ck10')} note={data.ck10_note} />
      </View>

      <Text style={s.secH}>C. გადამოწმების შედეგი</Text>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 4, marginLeft: 4 }}>
        {['ანგარიში დამტკიცებულია', 'ანგარიში საჭიროებს გადასწორებას', 'ანგარიში ხელახლა გადამოწმებას საჭიროებს'].map(opt => (
          <View key={opt} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <View style={data.verificationResult===opt ? s.boxChecked : s.box}>
              {data.verificationResult===opt && <Text style={{ color: '#fff', fontSize: 6, fontWeight: 'bold' }}>✓</Text>}
            </View>
            <Text style={{ fontSize: 8 }}>{opt}</Text>
          </View>
        ))}
      </View>

      <Text style={s.secH}>D. შენიშვნები და გადასასწორებელი საკითხები</Text>
      <View style={[s.textarea, { minHeight: 35 }]}>
        {data.remarks
          ? <Text style={{ fontSize: 8.5, lineHeight: 1.4 }}>{data.remarks}</Text>
          : <Text style={{ fontSize: 8, color: '#bbb' }}>ჩამოთვალეთ გადასასწორებელი/შესავსები საკითხები, ვადა...</Text>}
      </View>

      <Text style={s.secH}>E. ხელმოწერები</Text>
      <SigBlock2 left="ვერიფიკატორი (ტექ. მენეჯერი)" right="ხარისხის მენეჯერი" sigs={sigs} />

      <FormFooter code="BE-FM-TECH-REVIEW v2.0 | 28.04.2026 | შენახვა: 10 წელი" />
    </Page>
  </Document>
);};

export default FM20_ReportVerificationPdf;
