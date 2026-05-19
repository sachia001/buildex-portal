import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2, YesNoRow } from './FormBase';

const FM07_EquipmentVerificationPdf = () => (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader
        code="FM-07"
        isoRef="სსტ ISO/IEC 17020 §6.2"
        title="მოწყობილობის ვერიფიკაცია"
        subtitle="Equipment Verification Record"
      />

      {/* A — იდენტიფიკაცია */}
      <Text style={s.secH}>A. მოწყობილობის იდენტიფიკაცია</Text>
      <FieldRow2 label1="მოწყობ. დასახელება:" label2="ინვენტ. №:" />
      <FieldRow2 label1="მწარმოებელი:" label2="მოდელი / სერია:" />
      <FieldRow2 label1="შეძენის თარიღი:" label2="მდებარეობა:" />

      {/* B — კალიბრება */}
      <Text style={s.secH}>B. კალიბრების ინფორმაცია</Text>
      <FieldRow label="კალიბრების ცენტრი:" />
      <FieldRow2 label1="კალიბრების თარიღი:" label2="მომდ. კალიბ. თარიღი:" />
      <FieldRow label="კალიბრების სერტიფიკატის №:" />
      <FieldRow label="კალიბ. ინტერვალი (თვე):" />

      {/* C — ვერიფიკაცია */}
      <Text style={s.secH}>C. შუალედური ვერიფიკაცია (გამოყენებამდე)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '5%' }]}><Text>#</Text></View>
          <View style={[s.tHead, { flex: 1 }]}><Text>შემოწმების კრიტერიუმი</Text></View>
          <View style={[s.tHead, { width: '18%' }]}><Text>კი / არა</Text></View>
          <View style={[s.tHead, { width: '28%' }]}><Text>შენიშვნა</Text></View>
        </View>
        {[
          'გარეგანი დაზიანება არ არის',
          'ჩვენება ნულდება (zero point)',
          'სერტ. ვადა ჯერ კიდევ მოქმედია',
          'ნებართვის ნიშანი ვიზუალურად ნათელია',
          'SI-სთან მეტროლ. ტრასირება (ISO §6.2.7)',
        ].map((item, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '5%' }]}><Text>{i+1}</Text></View>
            <View style={[s.tCell, { flex: 1 }]}><Text>{item}</Text></View>
            <View style={[s.tCell, { width: '18%' }]}>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                <View style={s.box} /><Text style={{ fontSize: 8 }}>კი</Text>
                <View style={s.box} /><Text style={{ fontSize: 8 }}>არა</Text>
              </View>
            </View>
            <View style={[s.tCell, { width: '28%' }]} />
          </View>
        ))}
      </View>

      {/* D — გამოყენება */}
      <Text style={s.secH}>D. გამოყენება / ვიზიტი</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '5%' }]}><Text>#</Text></View>
          <View style={[s.tHead, { width: '30%' }]}><Text>საქმის № / ვიზიტი</Text></View>
          <View style={[s.tHead, { width: '22%' }]}><Text>თარიღი</Text></View>
          <View style={[s.tHead, { width: '25%' }]}><Text>ინსპექტორი</Text></View>
          <View style={[s.tHead, { flex: 1 }]}><Text>შენიშვნა</Text></View>
        </View>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '5%', minHeight: 18 }]}><Text>{i+1}</Text></View>
            <View style={[s.tCell, { width: '30%' }]} />
            <View style={[s.tCell, { width: '22%' }]} />
            <View style={[s.tCell, { width: '25%' }]} />
            <View style={[s.tCell, { flex: 1 }]} />
          </View>
        ))}
      </View>

      {/* E — შეუსაბამობა */}
      <Text style={s.secH}>E. შეუსაბამობის შემთხვევაში</Text>
      <YesNoRow label="შეუსაბამობა გამოვლინდა:" />
      <FieldRow label={'მოქმედება: სეპარაცია / „დეფექტური" ნიშანდება:'} />
      <YesNoRow label="FM-14 (შეუსაბამო სამ.) ინიცირება:" />
      <FieldRow label="FM-14 №:" />

      <FieldRow label="ვერიფიკატორი:" />

      <SigBlock3 labels={['ვერიფიკატორი', 'შემოწმებული', 'დამტკიცებული']} />
      <FormFooter code="FM-07 v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);

export default FM07_EquipmentVerificationPdf;
