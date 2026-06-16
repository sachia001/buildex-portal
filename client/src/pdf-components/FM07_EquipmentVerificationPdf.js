import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock2, FormFooter, FieldRow, FieldRow2, YesNoRow } from './FormBase';

const FM07_EquipmentVerificationPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  return (
  <Document>
    <Page size="A4" style={[s.page, { paddingTop: 10, paddingBottom: 16, paddingHorizontal: 28 }]}>
      <WM />
      <FormHeader code="BE-FM-EQ-CHECK" isoRef="სსტ ISO/IEC 17020 §6.2" title="მოწყობილობის ვერიფიკაცია" subtitle="Equipment Verification Record" />

      <Text style={s.secH}>A. მოწყობილობის იდენტიფიკაცია</Text>
      <FieldRow2 label1="დასახელება:"        value1={data.equipmentName}  label2="საინვენტარო №:"               value2={data.inventoryNumber} />
      <FieldRow2 label1="მწარმოებელი:"       value1={data.manufacturer}   label2="მოდელი / სერია:"              value2={data.model} />
      <FieldRow2 label1="შეძენის თარიღი:"    value1={data.purchaseDate}   label2="მდებარეობა:"                  value2={data.location} />

      <Text style={s.secH}>B. კალიბრაციის ინფორმაცია</Text>
      <FieldRow  label="კალიბრების ცენტრი:"             value={data.calibrationCenter} />
      <FieldRow2 label1="კალიბრაციის თარიღი:"           value1={data.calibrationDate}  label2="მომდევნო კალიბრაციის თარიღი:" value2={data.nextCalibDate} />
      <FieldRow2 label1="სერტიფიკატის №:"               value1={data.certNumber}        label2="ინტერვალი (თვე):"             value2={data.interval} />

      <Text style={s.secH}>C. შიდა ვერიფიკაცია</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'5%'}]}><Text>#</Text></View>
          <View style={[s.tHead,{flex:1}]}><Text>კრიტერიუმი</Text></View>
          <View style={[s.tHead,{width:'20%'}]}><Text>კი / არა</Text></View>
          <View style={[s.tHead,{width:'26%'}]}><Text>შენიშვნა</Text></View>
        </View>
        {['გარეგნული დათვალიერება','ჩვენების ნული (zero)','სერტიფიკატის ვადა','ნიშანდობლივი ვიზუალური შემოწმება','SI ერთეულების შესაბამისობა (§6.2.7)'].map((it,i) => {
          const vcKey = `vc${i+1}`;
          const v = data[vcKey];
          return (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'5%'}]}><Text>{i+1}</Text></View>
            <View style={[s.tCell,{flex:1}]}><Text>{it}</Text></View>
            <View style={[s.tCell,{width:'20%'}]}>
              {v
                ? <Text style={{fontSize:8,fontWeight:'bold'}}>{v==='yes'?'კი ✓':'არა ✗'}</Text>
                : <View style={{flexDirection:'row',gap:4}}><View style={s.box}/><Text style={{fontSize:7.5}}>კი</Text><View style={s.box}/><Text style={{fontSize:7.5}}>არა</Text></View>}
            </View>
            <View style={[s.tCell,{width:'26%',minHeight:16}]}/>
          </View>
        )})}
      </View>

      <Text style={s.secH}>D. გამოყენების ისტორია / ვიზიტები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'5%'}]}><Text>#</Text></View>
          <View style={[s.tHead,{width:'28%'}]}><Text>BE-CASE / ვიზიტი</Text></View>
          <View style={[s.tHead,{width:'20%'}]}><Text>თარიღი</Text></View>
          <View style={[s.tHead,{width:'22%'}]}><Text>ინსპექტორი</Text></View>
          <View style={[s.tHead,{flex:1}]}><Text>შენიშვნა</Text></View>
        </View>
        {[1,2,3,4,5].map(i => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'5%',minHeight:16}]}><Text>{i}</Text></View>
            <View style={[s.tCell,{width:'28%'}]}>{data[`h${i}_case`]?<Text style={{fontSize:8}}>{data[`h${i}_case`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'20%'}]}>{data[`h${i}_date`]?<Text style={{fontSize:8}}>{data[`h${i}_date`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'22%'}]}>{data[`h${i}_inspector`]?<Text style={{fontSize:8}}>{data[`h${i}_inspector`]}</Text>:null}</View>
            <View style={[s.tCell,{flex:1}]}>{data[`h${i}_note`]?<Text style={{fontSize:8}}>{data[`h${i}_note`]}</Text>:null}</View>
          </View>
        ))}
      </View>

      <Text style={s.secH}>E. შეუსაბამობა და შედეგები</Text>
      <YesNoRow label="შეუსაბამობა ნაპოვნია:" yesNo={data.nonConformityFound} />

      <SigBlock2 left="ვერიფიკატორი" right="დირექტორი" sigs={sigs} />
      <FormFooter code="BE-FM-EQ-CHECK v1.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM07_EquipmentVerificationPdf;
