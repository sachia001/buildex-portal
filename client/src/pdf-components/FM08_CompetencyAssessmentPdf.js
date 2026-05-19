import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2, YesNoRow, TextArea } from './FormBase';

const FM08_CompetencyAssessmentPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  const total = [data.score1,data.score2,data.score3,data.score4,data.score5].reduce((a,v)=>a+(parseFloat(v)||0),0);
  return (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader code="FM-08" isoRef="სსტ ISO/IEC 17020 §6.1" title="კომპეტენციის შეფასება" subtitle="Competency Assessment Form" />

      <Text style={s.secH}>A. ინსპექტორის მონაცემები</Text>
      <FieldRow2 label1="სახელი / გვარი:"     value1={data.name}           label2="პირადი №:"           value2={data.personalId} />
      <FieldRow2 label1="თანამდებობა:"         value1={data.position}       label2="შეფასების თარიღი:"   value2={data.assessmentDate} />
      <FieldRow  label="შემფასებელი:"           value={data.assessor} />
      <FieldRow2 label1="შეფასების ტიპი:"       value1={data.assessmentType} label2="სპეციალობა:"        value2={data.scope} />
      <YesNoRow  label="განათლება შეესაბამება:" yesNo={data.eduMatch} />
      <FieldRow  label="გამოცდილება (წელი):"   value={data.experience} />

      <Text style={s.secH}>B. შეფასების კრიტერიუმები (1–5)</Text>
      <Text style={{fontSize:7,color:'#555',marginBottom:3}}>1 — არ შეესაბამება  2 — ნაწილობრივ  3 — საკმარისი  4 — კარგი  5 — შესანიშნავი</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'5%'}]}><Text>#</Text></View>
          <View style={[s.tHead,{flex:1}]}><Text>კრიტერიუმი</Text></View>
          <View style={[s.tHead,{width:'17%'}]}><Text>ქულა</Text></View>
          <View style={[s.tHead,{width:'28%'}]}><Text>კომენტარი</Text></View>
        </View>
        {[['სამუშაო ნიმუში / ნორმები',data.score1],['ISO 17020',data.score2],['გადაწყვეტილების მიღების პრაქტიკა',data.score3],['ანგარიშის შედგენა',data.score4],['witnessing',data.score5]].map(([cr,sc],i) => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'5%'}]}><Text>{i+1}</Text></View>
            <View style={[s.tCell,{flex:1}]}><Text>{cr}</Text></View>
            <View style={[s.tCell,{width:'17%',minHeight:18}]}>{sc?<Text style={{fontSize:8.5,fontWeight:'bold'}}>{sc}</Text>:null}</View>
            <View style={[s.tCell,{width:'28%'}]}/>
          </View>
        ))}
        <View style={[s.tRow,{backgroundColor:'#e8f0f7'}]}>
          <View style={[s.tCell,{width:'5%'}]}/><View style={[s.tCell,{flex:1}]}><Text style={{fontWeight:'bold'}}>ჯამი</Text></View>
          <View style={[s.tCell,{width:'17%'}]}><Text style={{fontWeight:'bold'}}>{total>0?`${total}/25`:'/25'}</Text></View>
          <View style={[s.tCell,{width:'28%'}]}/>
        </View>
      </View>

      <Text style={s.secH}>C. გადაწყვეტილება</Text>
      <FieldRow  label="გადაწყვეტილება:"            value={data.decision} />
      <TextArea  value={data.trainingNeeded} placeholder="ტრენინგის საჭიროება" minHeight={28} />
      <FieldRow  label="მომდევნო შეფასების თარიღი:" value={data.nextAssessment} />

      <SigBlock3 labels={['ინსპექტორი','ტექნიკური მენეჯერი','ხარისხის მენეჯერი']} sigs={sigs} />
      <FormFooter code="FM-08 v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM08_CompetencyAssessmentPdf;
