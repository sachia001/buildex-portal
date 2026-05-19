import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2, YesNoRow, TextArea } from './FormBase';

const FM10_CAPAFormPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  return (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader code="FM-10" isoRef="სსტ ISO/IEC 17020 §8.5" title="CAPA" subtitle="Corrective & Preventive Action Form" />

      <Text style={s.secH}>A. რეგისტრაცია</Text>
      <FieldRow2 label1="CAPA №:" value1={data.capaNumber} label2="ინიცირების თარიღი:" value2={data.initDate} />
      <FieldRow  label="ინიციატორი:" value={data.initiator} />
      <View style={{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:4,marginLeft:4}}>
        {['შიდა აუდიტი','გარე შემოწმება','საჩივარი','შეუსაბამო სამუშაო','ინციდენტი','სხვა'].map(t => (
          <View key={t} style={{flexDirection:'row',alignItems:'center',gap:3}}>
            <View style={data.source===t?s.boxChecked:s.box}>{data.source===t&&<Text style={{color:'#fff',fontSize:6,fontWeight:'bold'}}>✓</Text>}</View>
            <Text style={{fontSize:8}}>{t}</Text>
          </View>
        ))}
      </View>

      <Text style={s.secH}>B. შეუსაბამობის აღწერა</Text>
      <FieldRow  label="ISO §:" value={data.isoClause} />
      <TextArea  value={data.description} placeholder="(კონკრეტული შეუსაბამობა)" minHeight={28} />
      <View style={{flexDirection:'row',gap:16,marginBottom:3,marginLeft:4}}>
        {['კრიტიკული','საშუალო','მცირე'].map(t => (
          <View key={t} style={{flexDirection:'row',alignItems:'center',gap:3}}>
            <View style={data.impact===t?s.boxChecked:s.box}>{data.impact===t&&<Text style={{color:'#fff',fontSize:6,fontWeight:'bold'}}>✓</Text>}</View>
            <Text style={{fontSize:8}}>{t}</Text>
          </View>
        ))}
      </View>

      <Text style={s.secH}>C. გავრცელება (§8.5.3)</Text>
      <YesNoRow label="სხვა საქმეები ზეგავლენის ქვეშ:" yesNo={data.otherCasesAffected} />
      <FieldRow  label="ზეგავლენის ქვეშ №:"             value={data.affectedCases} />
      <FieldRow  label="გადაუდებელი კორექცია:"           value={data.immediateCorrection} />

      <Text style={s.secH}>D. ფესვური მიზეზი (5-Why)</Text>
      <TextArea value={data.rootCause} placeholder="(5-Why ანალიზი)" minHeight={28} />

      <Text style={s.secH}>E. მაკორექტირებელი ქმედება</Text>
      <TextArea value={data.corrAction} placeholder="(მაკორექტირებელი ქმედება)" minHeight={26} />
      <FieldRow2 label1="შემსრულებელი:" value1={data.responsible} label2="ვადა:" value2={data.deadline} />

      <Text style={s.secH}>F. ეფექტურობის შემოწმება (§8.5.5.b)</Text>
      <FieldRow  label="შემოწმების თარიღი:"        value={data.checkDate} />
      <YesNoRow  label="ეფექტურია:"                yesNo={data.effectiveCheck} />
      <FieldRow2 label1="დახურვის თარიღი:" value1={data.closingDate} label2="ხარისხის მენეჯერის ვიზა:" value2={data.qualityMgrVerif} />

      <SigBlock3 labels={['შემდგენი','ხარისხის მენეჯერი','დირექტორი']} sigs={sigs} />
      <FormFooter code="FM-10 v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM10_CAPAFormPdf;
