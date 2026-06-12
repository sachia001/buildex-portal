import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2, YesNoRow, TextArea } from './FormBase';

const FM09_ContractReviewPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  return (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader code="BE-FM-CONTRACT-REVIEW" isoRef="სსტ ISO/IEC 17020 §7.1" title="ხელშეკრულების განხილვა" subtitle="Contract / Tender Review" />

      <Text style={s.secH}>A. საიდენტიფიკაციო მონაცემები</Text>
      <FieldRow2 label1="BE-CASE №:" value1={data.caseNumber}    label2="თარიღი:"    value2={data.reviewDate} />
      <FieldRow  label="დამკვეთი:"   value={data.clientName} />
      <View style={{flexDirection:'row',gap:12,marginBottom:3,marginLeft:4}}>
        {['BE-PR-01','BE-PR-02','BE-PR-03','BE-PR-04','სხვა'].map(c => (
          <View key={c} style={{flexDirection:'row',alignItems:'center',gap:3}}>
            <View style={data.inspScope===c?s.boxChecked:s.box}>{data.inspScope===c&&<Text style={{color:'#fff',fontSize:6,fontWeight:'bold'}}>✓</Text>}</View>
            <Text style={{fontSize:8}}>{c}</Text>
          </View>
        ))}
      </View>
      <FieldRow2 label1="ხელშეკრულების №:" value1={data.contractNumber} label2="ვადა:"     value2={data.deadline} />
      <FieldRow2 label1="გასამრჯელო (₾):"   value1={data.fee}           label2="BE-FM-IMP-DECL №:" value2={data.fm02Number} />

      <Text style={s.secH}>B. ISO §7.1.1 — კრიტერიუმები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'10%'}]}><Text>§</Text></View>
          <View style={[s.tHead,{flex:1}]}><Text>მოთხოვნა</Text></View>
          <View style={[s.tHead,{width:'17%'}]}><Text>კი / არა</Text></View>
          <View style={[s.tHead,{width:'28%'}]}><Text>კომენტარი</Text></View>
        </View>
        {[['§7.1.1a','ობიექტის იდენტიფიკაცია','r_7_1_1a','r_7_1_1a_note'],['§7.1.1b','შესაძლებლობის დადასტურება','r_7_1_1b','r_7_1_1b_note'],['§7.1.1c','მომსახურების შინაარსი','r_7_1_1c','r_7_1_1c_note'],['§7.1.1d','კლიენტის მოთხოვნები','r_7_1_1d','r_7_1_1d_note'],['§7.1','ვადა და გასამრჯელო','r_7_1','r_7_1_note'],['BE-FM-IMP-DECL','მიუკერძოებლობის შეფასება','r_fm02','r_fm02_note']].map(([cl,req,yesnoKey,noteKey],i) => (
          <View key={cl} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'10%'}]}><Text>{cl}</Text></View>
            <View style={[s.tCell,{flex:1}]}><Text>{req}</Text></View>
            <View style={[s.tCell,{width:'17%'}]}>
              {data[yesnoKey]
                ? <Text style={{fontSize:8,fontWeight:'bold'}}>{data[yesnoKey]==='yes'?'კი':'არა'}</Text>
                : <View style={{flexDirection:'row',gap:4}}><View style={s.box}/><Text style={{fontSize:7.5}}>კი</Text><View style={s.box}/><Text style={{fontSize:7.5}}>არა</Text></View>
              }
            </View>
            <View style={[s.tCell,{width:'28%',minHeight:17}]}>{data[noteKey]?<Text style={{fontSize:8}}>{data[noteKey]}</Text>:null}</View>
          </View>
        ))}
      </View>

      <Text style={s.secH}>C. კლიენტის სპეციალური მოთხოვნები</Text>
      <TextArea value={data.clientReqs} placeholder="(სპეციალური მოთხოვნები)" minHeight={32} />

      <Text style={s.secH}>D. გადახრები / შენიშვნები</Text>
      <TextArea value={data.deviations} placeholder="(გადახრები / შენიშვნები)" minHeight={26} />
      <YesNoRow label="დამტკიცებულია:" yesNo={data.approved} />

      <SigBlock3 labels={['შემდგენი','ტექნიკური მენეჯერი','დირექტორი']} sigs={sigs} />
      <FormFooter code="BE-FM-CONTRACT-REVIEW v2.0 | 28.04.2026 | შენახვა: 10 წელი" />
    </Page>
  </Document>
);};

export default FM09_ContractReviewPdf;
