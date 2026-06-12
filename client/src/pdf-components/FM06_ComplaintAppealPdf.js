import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2, YesNoRow, TextArea } from './FormBase';

const FM06_ComplaintAppealPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  const type = data.type || '';
  return (
  <Document>
    <Page size="A4" style={[s.page, { paddingTop: 10, paddingBottom: 16, paddingHorizontal: 28 }]}>
      <WM />
      <FormHeader code="BE-FM-COMPLAINT" isoRef="სსტ ISO/IEC 17020 §7.5/7.7/7.8" title="საჩივარი / აპელაცია" subtitle="Complaint & Appeal Form" />

      <Text style={s.secH}>A. ტიპი</Text>
      <View style={{flexDirection:'row',gap:25,marginBottom:5,marginLeft:5}}>
        {[['საჩივარი','complaint'],['აპელაცია','appeal']].map(([lbl,val]) => (
          <View key={lbl} style={{flexDirection:'row',alignItems:'center',gap:4}}>
            <View style={type===lbl?s.boxChecked:s.box}>{type===lbl&&<Text style={{color:'#fff',fontSize:6.5,fontWeight:'bold'}}>✓</Text>}</View>
            <Text style={{fontSize:8.5}}>{lbl}</Text>
          </View>
        ))}
      </View>

      <Text style={s.secH}>B. ძირითადი მონაცემები</Text>
      <FieldRow2 label1="რეგისტრაციის №:" value1={data.regNumber}       label2="თარიღი:"       value2={data.date} />
      <FieldRow  label="მომჩივნის სახელი / ორგანიზაცია:" value={data.complainantName} />
      <FieldRow2 label1="ტელეფონი:"  value1={data.phone}  label2="ელ. ფოსტა:" value2={data.email} />
      <FieldRow  label="კონტაქტის ფორმა:"  value={data.contactForm} />
      <FieldRow  label="BE-CASE №:"         value={data.caseNumber} />

      <Text style={s.secH}>C. შინაარსი</Text>
      <TextArea value={data.description} placeholder="(მოკლე შინაარსი)" minHeight={36} />

      <Text style={s.secH}>D. ვადები (ISO §7.8.4)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{flex:1}]}><Text>ეტაპი</Text></View>
          <View style={[s.tHead,{width:'24%'}]}><Text>ვადა</Text></View>
          <View style={[s.tHead,{width:'28%'}]}><Text>ფაქტობრივი თარიღი</Text></View>
        </View>
        {[['მიღება და დადასტურება','5 სამუშაო დღე'],['შეტყობინება / პასუხი','30 კალენდარული დღე'],['სრული გადაწყვეტა','60 კალენდარული დღე']].map(([s1,s2],i) => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{flex:1}]}><Text>{s1}</Text></View>
            <View style={[s.tCell,{width:'24%'}]}><Text>{s2}</Text></View>
            <View style={[s.tCell,{width:'28%',minHeight:15}]}/>
          </View>
        ))}
      </View>

      <Text style={s.secH}>E. გადაწყვეტა</Text>
      <TextArea value={data.resolution} placeholder="(გადაწყვეტის აღწერა)" minHeight={28} />
      <YesNoRow label="BE-FM-CAPA CAPA ინიცირებულია:" yesNo={data.capaInitiated} />
      <FieldRow2 label1="BE-FM-CAPA №:" value1={data.capaNumber} label2="პასუხის გაგზავნის თარიღი:" value2={data.responseSentDate} />

      <SigBlock3 labels={['შემდგენი','ხარისხის მენეჯერი','დირექტორი']} sigs={sigs} />
      <FormFooter code="BE-FM-COMPLAINT v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM06_ComplaintAppealPdf;
