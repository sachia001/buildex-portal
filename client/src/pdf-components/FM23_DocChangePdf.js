import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2, TextArea } from './FormBase';

const FM23_DocChangePdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  return (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader code="FM-23" isoRef="სსტ ISO/IEC 17020 §8.3 (PR-01)" title="დოკუმენტის ცვლილების წინადადება" subtitle="Document Change Proposal" />

      <Text style={s.secH}>A. ინიციატორი</Text>
      <FieldRow2 label1="სახელი / გვარი:"     value1={data.initiatorName} label2="თანამდებობა:"          value2={data.position} />
      <FieldRow2 label1="წარდგენის თარიღი:"   value1={data.submissionDate} label2="№ (BE-DCR-YYYY-____):" value2={data.dcrNumber} />

      <Text style={s.secH}>B. დოკუმენტის მონაცემები</Text>
      <FieldRow  label="დოკუმენტის სახელი:"  value={data.documentName} />
      <FieldRow2 label1="კოდი:"              value1={data.documentCode} label2="მიმდინარე ვერსია:" value2={data.currentVersion} />

      <Text style={s.secH}>C. შემოთავაზებული ცვლილება</Text>
      <View style={{marginBottom:3}}>
        <Text style={{fontWeight:'bold',fontSize:8,marginBottom:2}}>მიმდინარე ტექსტი:</Text>
        <TextArea value={data.currentText} placeholder="(მიმდინარე ტექსტი)" minHeight={30} />
      </View>
      <View style={{marginBottom:3}}>
        <Text style={{fontWeight:'bold',fontSize:8,marginBottom:2}}>შემოთავაზებული ახალი ტექსტი:</Text>
        <TextArea value={data.proposedText} placeholder="(შემოთავაზებული ახალი ტექსტი)" minHeight={30} />
      </View>
      <Text style={{fontWeight:'bold',fontSize:8,marginBottom:2}}>მიზეზი / დასაბუთება:</Text>
      <TextArea value={data.reason} placeholder="(მიზეზი / დასაბუთება)" minHeight={24} />

      <Text style={s.secH}>D. ხარისხის მენეჯერის შეფასება</Text>
      <Text style={[s.fLabel,{marginBottom:4}]}>გადაწყვეტილება:</Text>
      <View style={{flexDirection:'row',gap:24,marginBottom:8,marginLeft:6}}>
        {['მოწონება','უარყოფა','განხილვა'].map(t => (
          <View key={t} style={{flexDirection:'row',alignItems:'center',gap:5}}>
            <View style={data.decision===t?s.boxChecked:s.box}>{data.decision===t&&<Text style={{color:'#fff',fontSize:7,fontWeight:'bold'}}>✓</Text>}</View>
            <Text style={{fontSize:9}}>{t}</Text>
          </View>
        ))}
      </View>
      <FieldRow2 label1="ახალი ვერსიის №:"          value1={data.newVersion} label2="ძალაში შესვლის თარიღი:" value2={data.effectiveDate} />

      <SigBlock3 labels={['ინიციატორი','ხარისხის მენეჯერი','დამტკიცება / დირექტორი']} sigs={sigs} />
      <FormFooter code="FM-23 v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM23_DocChangePdf;
