import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2, YesNoRow } from './FormBase';

const cc = { padding: 2, minHeight: 13 };

const FM25_LiquidationActPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  return (
  <Document>
    <Page size="A4" style={[s.page, { paddingTop: 10, paddingBottom: 16, paddingHorizontal: 28 }]}>
      <WM />
      <FormHeader code="BE-FM-DESTROY-ACT" isoRef="PR-02 §6" title="ლიკვიდაციის (განადგურების) აქტი" subtitle="Document Liquidation / Destruction Act" />

      <Text style={s.secH}>A. საიდენტიფიკაციო მონაცემები</Text>
      <FieldRow2 label1="A № (BE-DEST-YYYY-____):" value1={data.actNumber} label2="შედგენის თარიღი:" value2={data.date} />
      <FieldRow  label="პასუხისმგებელი / შემდგენი:" value={data.responsible} />
      <FieldRow  label="მოწმე:"                       value={data.witness} />

      <Text style={s.secH}>B. გასანადგურებელი დოკუმენტების სია</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'5%',...cc}]}><Text>#</Text></View>
          <View style={[s.tHead,{flex:1,...cc}]}><Text>დოკუმენტის სახელი / კოდი</Text></View>
          <View style={[s.tHead,{width:'12%',...cc}]}><Text>ვერსია</Text></View>
          <View style={[s.tHead,{width:'18%',...cc}]}><Text>შენახვის ვადის გასვლის თარიღი</Text></View>
          <View style={[s.tHead,{width:'15%',...cc}]}><Text>ასლების რაოდენობა</Text></View>
          <View style={[s.tHead,{width:'20%',...cc}]}><Text>შედეგი / ცნობა</Text></View>
        </View>
        {(data.docList && data.docList.length > 0 ? data.docList : [...Array(10)].map(()=>({}))).map((row,i) => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'5%',...cc}]}><Text style={{fontSize:8}}>{i+1}</Text></View>
            <View style={[s.tCell,{flex:1,...cc}]}>{row.name?<Text style={{fontSize:8}}>{row.name}</Text>:null}</View>
            <View style={[s.tCell,{width:'12%',...cc}]}>{row.version?<Text style={{fontSize:8}}>{row.version}</Text>:null}</View>
            <View style={[s.tCell,{width:'18%',...cc}]}>{row.expiry?<Text style={{fontSize:8}}>{row.expiry}</Text>:null}</View>
            <View style={[s.tCell,{width:'15%',...cc}]}>{row.copies?<Text style={{fontSize:8}}>{row.copies}</Text>:null}</View>
            <View style={[s.tCell,{width:'20%',...cc}]}>{row.result?<Text style={{fontSize:8}}>{row.result}</Text>:null}</View>
          </View>
        ))}
      </View>
      <Text style={{fontSize:7,color:'#555',marginBottom:4}}>შეუსაბამობა / ციფრული: ფ — ფიზიკური შეუსაბამობა | ც — ციფრული წაშლა | ასლების რაოდენობა: სულ ფიზიკური / ციფრული ასლების რაოდენობა</Text>

      <Text style={s.secH}>C. განადგურების მეთოდი</Text>
      <View style={{flexDirection:'row',gap:30,marginBottom:5,marginLeft:6}}>
        {['შეშლა (ფიზიკური)','ციფრული წაშლა','სხვა'].map(t => (
          <View key={t} style={{flexDirection:'row',alignItems:'center',gap:5}}>
            <View style={data.method===t?s.boxChecked:s.box}>{data.method===t&&<Text style={{color:'#fff',fontSize:7,fontWeight:'bold'}}>✓</Text>}</View>
            <Text style={{fontSize:8}}>{t}</Text>
          </View>
        ))}
      </View>

      <Text style={s.secH}>D. შესრულების შედეგი</Text>
      <YesNoRow label="ყველა ასლი (ფიზიკური + ციფრული) განადგურებულია:" yesNo={data.allCopiesDestroyed} />
      <YesNoRow label="BE-FM-CHANGE-REG განახლებულია:"                                yesNo={data.fm24Updated} />
      <FieldRow  label="ხარისხის მენეჯერის ვიზა:"                          value={data.qualityMgrVerif} />

      <Text style={s.secH}>E. განცხადება / ანგარიში</Text>
      <View style={{borderWidth:0.5,borderColor:'#ccc',padding:5,marginBottom:5,backgroundColor:'#f5f8fc'}}>
        <Text style={{fontSize:8,textAlign:'justify',lineHeight:1.4}}>
          ქვემოთ პასუხისმგებელი ვადასტურებ, რომ ჩამოთვლილი დოკუმენტები სრულად და შეუქცევადად განადგურდა. რაიმე ასლი ან ასახვა არ შემორჩა. PR-02 §6-ის სრული დაცვით.
        </Text>
      </View>

      <SigBlock3 labels={['შემდგენი / პასუხისმგებელი','მოწმე','ხარისხის მენეჯერი']} sigs={sigs} />
      <FormFooter code="BE-FM-DESTROY-ACT v1.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM25_LiquidationActPdf;
