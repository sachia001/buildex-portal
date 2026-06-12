import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, FieldRow, FieldRow2, YesNoRow, TextArea, SigBlock3, ChkRow } from './FormBase';

const FM01_ApplicationRegistrationPdf = ({ data = {} }) => {
  const {
    caseId, regDate, receiptMethod, caseType,
    clientName, clientId, clientPhone, clientEmail, clientAddress, representative,
    objectName, objectAddress, objectCategory, contractNum, description,
    completenessCheck, scopeCheck, impartialityCheck, tmNote,
    sigs = [],
  } = data;

  return (
    <Document>
      <Page size="A4" style={[s.page, { paddingTop: 12, paddingBottom: 22, paddingHorizontal: 28 }]}>
        <WM />
        <FormHeader
          code="BE-FM-REG"
          isoRef="სსტ ISO/IEC 17020 §7.1"
          title="მოთხოვნის სარეგისტრაციო ფორმა"
          subtitle="Application Registration Form"
        />

        {/* A. საქმის საიდენტიფიკაციო მონაცემები */}
        <Text style={s.secH}>A. საქმის საიდენტიფიკაციო მონაცემები</Text>
        <FieldRow2
          label1="BE-CASE №:"   value1={caseId}
          label2="რეგისტრაციის თარიღი:" value2={regDate}
        />
        {/* მიღების ფორმა */}
        <View style={[s.fRow, { alignItems: 'center', flexWrap: 'wrap' }]}>
          <Text style={s.fLabel}>მიღების ფორმა:</Text>
          {['ელ.ფოსტა', 'ფოსტა', 'პირადად', 'ტელ.'].map(opt => (
            <View key={opt} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
              <View style={receiptMethod === opt ? s.boxChecked : s.box}>
                {receiptMethod === opt && <Text style={{ color: '#fff', fontSize: 6.5, fontWeight: 'bold' }}>✓</Text>}
              </View>
              <Text style={{ fontSize: 8, marginLeft: 2 }}>{opt}</Text>
            </View>
          ))}
        </View>
        {/* სამუშაოს სახე */}
        <View style={[s.fRow, { alignItems: 'center', flexWrap: 'wrap' }]}>
          <Text style={s.fLabel}>სამუშაოს სახე:</Text>
          {['BE-PR-01', 'BE-PR-02', 'BE-PR-03', 'სხვა'].map(opt => (
            <View key={opt} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
              <View style={caseType === opt ? s.boxChecked : s.box}>
                {caseType === opt && <Text style={{ color: '#fff', fontSize: 6.5, fontWeight: 'bold' }}>✓</Text>}
              </View>
              <Text style={{ fontSize: 8, marginLeft: 2 }}>{opt}</Text>
            </View>
          ))}
        </View>

        {/* B. დამკვეთის მონაცემები */}
        <Text style={s.secH}>B. დამკვეთის მონაცემები</Text>
        <FieldRow label="ორგანიზაცია / სახელი, გვარი:" value={clientName} />
        <FieldRow2
          label1="საიდ. კოდი / პ.ნ.:" value1={clientId}
          label2="ტელეფონი:"            value2={clientPhone}
        />
        <FieldRow label="ელ-ფოსტა:"    value={clientEmail} />
        <FieldRow label="მისამართი:"   value={clientAddress} />
        <FieldRow label="წარმომადგენელი / პირი:" value={representative} />

        {/* C. ინსპექტირების ობიექტი */}
        <Text style={s.secH}>C. ინსპექტირების ობიექტი</Text>
        <FieldRow label="ობიექტის დასახელება:" value={objectName} />
        <FieldRow label="ობიექტის მისამართი:"  value={objectAddress} />
        <FieldRow2
          label1="ობიექტის კატეგ.:" value1={objectCategory}
          label2="ხელშ./შეთ. №:"    value2={contractNum}
        />
        <TextArea value={description} placeholder="ინსპექტირების ობიექტის მოკლე აღწერა" minHeight={36} />

        {/* D. წარდგენილი დოკუმენტაცია */}
        <Text style={s.secH}>D. წარდგენილი დოკუმენტაცია</Text>
        <View style={[s.tBorder, { padding: 5, marginBottom: 4 }]}>
          {(() => { const sel = Array.isArray(data.submittedDocs) ? data.submittedDocs : [];
            const opts = ['საპროექტო დოკუმენტაცია','ხარჯთაღრიცხვა','ტექნიკური დავალება','სახელშეკრულებო დოკ.','ნახაზები / სქემები','ნებართვა / ლიცენზია','სხვა'];
            return opts.map((o) => <ChkRow key={o} label={o} checked={sel.includes(o)} />);
          })()}
        </View>
        <TextArea value={data.otherDocs} placeholder="სხვა დოკუმენტები" minHeight={24} />

        {/* E. წინასწარი შეფასება */}
        <Text style={s.secH}>E. წინასწარი შეფასება (ტექნიკური მენეჯერი)</Text>
        <YesNoRow label="დოკ. სისრულე დადასტ.:"        yesNo={completenessCheck} />
        <YesNoRow label="ინსპ. სფეო განსაზღვრ.:"       yesNo={scopeCheck} />
        <YesNoRow label="მიუკ. შ. ინიც. (BE-FM-IMP-DECL):"      yesNo={impartialityCheck} />
        <TextArea value={tmNote} placeholder="შენიშვნები / მოთხოვნები" minHeight={28} />

        <SigBlock3 labels={['ადმინისტრატორი', 'ტექნიკური მენეჯერი', 'ხარისხის მენეჯერი']} sigs={sigs} />
        <FormFooter code="BE-FM-REG v1.0 | 2026 | ISO §7.1 | შენახვა: 10 წელი" />
      </Page>
    </Document>
  );
};

export default FM01_ApplicationRegistrationPdf;
