import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2, YesNoRow, TextArea } from './FormBase';

const FM14_NonConformingPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  return (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader code="BE-FM-NONCONF" isoRef="სსტ ISO/IEC 17020 §8.7" title="შეუსაბამო სამუშაოს მართვა" subtitle="Non-Conforming Work Control" />

      <Text style={s.secH}>1. იდენტიფიკაცია (§8.7.1)</Text>
      <FieldRow2 label1="NC № (BE-NC-YYYY-____):" value1={data.ncNumber} label2="გამოვლენის თარიღი:" value2={data.detectionDate} />
      <FieldRow2 label1="BE-CASE №:"               value1={data.caseNumber} label2="ობიექტი / ინსპექცია:" value2={data.object} />
      <FieldRow  label="გამომვლენი პირი:"          value={data.detector} />
      <View style={{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:4,marginLeft:4}}>
        {['სამუშაოს შეჩერება','ტექნიკური გადახედვა','კლიენტის შეტყობინება','გარე შემოწმება'].map(t => (
          <View key={t} style={{flexDirection:'row',alignItems:'center',gap:3}}>
            <View style={(data.immediateActions||[]).includes(t)?s.boxChecked:s.box}>
              {(data.immediateActions||[]).includes(t)&&<Text style={{color:'#fff',fontSize:6,fontWeight:'bold'}}>✓</Text>}
            </View>
            <Text style={{fontSize:8}}>{t}</Text>
          </View>
        ))}
      </View>

      <Text style={s.secH}>2. შეუსაბამობის აღწერა</Text>
      <FieldRow  label="ISO §:" value={data.isoClause} />
      <TextArea  value={data.description} placeholder="(კონკრეტული შეუსაბამობის აღწერა)" minHeight={26} />

      <Text style={s.secH}>3. გადაუდებელი შეჩერება (§8.7.2)</Text>
      <View style={{gap:3,marginBottom:4,marginLeft:4}}>
        {[['კლიენტი — სამუშაო შეჩერება','კლიენტი — სამუშაო შეჩერება'],['ობიექტი — კორექცია','ობიექტი — კორექცია'],['სხვა საქმეების გადახედვა','სხვა საქმეების გადახედვა'],['კლიენტთან გარკვევა საჭ. არ არის','კლიენტთან გარკვევა საჭ. არ არის']].map(([key,lbl],i) => (
          <View key={i} style={{flexDirection:'row',alignItems:'center',gap:4}}>
            <View style={(data.suspensionActions||[]).includes(key)?s.boxChecked:s.box}>
              {(data.suspensionActions||[]).includes(key)&&<Text style={{color:'#fff',fontSize:6,fontWeight:'bold'}}>✓</Text>}
            </View>
            <Text style={{fontSize:8}}>{lbl}</Text>
          </View>
        ))}
      </View>

      <Text style={s.secH}>4. მართვის მეთოდი (§8.7.3)</Text>
      <TextArea value={data.immediateAction} placeholder="(მიღებული ქმედება)" minHeight={24} />
      <FieldRow2 label1="პასუხისმგებელი:" value1={data.responsible} label2="ვადა:" value2={data.deadline} />

      <Text style={s.secH}>5. ფესვური მიზეზი</Text>
      <TextArea value={data.rootCause} placeholder="(ფესვური მიზეზის ანალიზი)" minHeight={22} />

      <Text style={s.secH}>6. CAPA (BE-FM-CAPA)</Text>
      <FieldRow2 label1="CAPA №:" value1={data.capaNumber} label2="ვადა:" value2={data.capaDeadline} />

      <Text style={s.secH}>7. დახურვა / ვიზა</Text>
      <YesNoRow label="დახურულია:" yesNo={data.closed} />
      <FieldRow2 label1="დახურვის თარიღი:" value1={data.closingDate} label2="ხარისხის მენეჯერის ვიზა:" value2={data.qualityMgrVerif} />

      <SigBlock3 labels={['ხარისხის მენეჯერი','ტექნიკური მენეჯერი','დირექტორი']} sigs={sigs} />
      <FormFooter code="BE-FM-NONCONF v1.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM14_NonConformingPdf;
