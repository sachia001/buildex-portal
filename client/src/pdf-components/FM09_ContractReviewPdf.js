import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2, YesNoRow } from './FormBase';

const FM09_ContractReviewPdf = () => (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader
        code="FM-09"
        isoRef="სსტ ISO/IEC 17020 §7.1"
        title="ხელშეკრულების განხილვა"
        subtitle="Contract / Tender Review"
      />

      {/* A — საიდ. */}
      <Text style={s.secH}>A. საიდენტიფიკაციო მონაცემები</Text>
      <FieldRow2 label1="საქმის № (BE-CASE):" label2="განხილვის თარიღი:" />
      <FieldRow label="დამკვეთი / ორგანიზაცია:" />
      <FieldRow label="ინსპექტირების სფერო:" />
      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 8, marginLeft: 6 }}>
        {['BE-PR-01','BE-PR-02','BE-PR-03','BE-PR-04','სხვა'].map(c => (
          <View key={c} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={s.box} /><Text style={{ fontSize: 9 }}>{c}</Text>
          </View>
        ))}
      </View>
      <FieldRow label="ხელშეკ. / განაცხ. №:" />

      {/* B — ISO §7.1 კრიტერიუმები */}
      <Text style={s.secH}>B. ISO §7.1.1 — განხილვის კრიტერიუმები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '8%' }]}><Text>§</Text></View>
          <View style={[s.tHead, { flex: 1 }]}><Text>მოთხოვნა</Text></View>
          <View style={[s.tHead, { width: '16%' }]}><Text>კი / არა</Text></View>
          <View style={[s.tHead, { width: '30%' }]}><Text>კომენტარი</Text></View>
        </View>
        {[
          ['§7.1.1.a','ინსპ. ობიექტი იდენტიფიცირებული და განსაზღვრულია'],
          ['§7.1.1.b','ინსპ. ორგანოს შესაძლებლობა დადასტურებულია (კომპ. + კალ.)'],
          ['§7.1.1.c','შესაფერისი ინსპ. მეთოდი შერჩეულია (BE-WI-XX)'],
          ['§7.1.1.d','კლიენტის სპეციფ. მოთხოვნები ფიქსირებულია'],
          ['§7.1','შეთანხმებული ვადა და ღირებულება'],
          ['FM-02','მიუკერძოებლობის შემოწმება ჩატარდა'],
        ].map(([cl, req], i) => (
          <View key={cl} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '8%' }]}><Text>{cl}</Text></View>
            <View style={[s.tCell, { flex: 1 }]}><Text>{req}</Text></View>
            <View style={[s.tCell, { width: '16%' }]}>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                <View style={s.box} /><Text style={{ fontSize: 8 }}>კი</Text>
                <View style={s.box} /><Text style={{ fontSize: 8 }}>არა</Text>
              </View>
            </View>
            <View style={[s.tCell, { width: '30%', minHeight: 22 }]} />
          </View>
        ))}
      </View>

      {/* C — მოთხოვნები */}
      <Text style={s.secH}>C. დამკვეთის სპეციფიკური მოთხოვნები</Text>
      <View style={[s.textarea, { minHeight: 45 }]} />

      {/* D — ვადა / ღირებ. */}
      <Text style={s.secH}>D. ვადა და ღირებულება</Text>
      <FieldRow2 label1="შესრულების ვადა:" label2="სავარ. ღირებ. (₾):" />
      <FieldRow label="FM-02 მიუკ. დეკლ. №:" />

      {/* E — განსხვავებები */}
      <Text style={s.secH}>E. განსხვავება / შენიშვნა განაცხადიდან</Text>
      <View style={[s.textarea, { minHeight: 35 }]} />

      <YesNoRow label="ხელშეკრულება/განაცხადი დამტკიცებულია განხილვის შედეგად:" />

      <SigBlock3 labels={['შემავსებელი', 'ტექ. მენეჯერი', 'დირექტორი']} />
      <FormFooter code="FM-09 v2.0 | 28.04.2026 | შენახვა: 10 წელი" />
    </Page>
  </Document>
);

export default FM09_ContractReviewPdf;
