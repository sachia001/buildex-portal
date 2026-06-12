import React from 'react';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, FieldRow2 } from './FormBase';

const cc = { padding: 2, minHeight: 11 };

const FM21_InspectionRegisterPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  return (
  <Document>
    <Page size="A4" orientation="landscape" style={[s.page,{paddingHorizontal:28}]}>
      <WM />
      <FormHeader code="BE-FM-INSP-REG" isoRef="სსტ ISO/IEC 17020 §7.3" title="ინსპექციების რეგისტრი (ჟურნალი)" subtitle="Inspection Register / Journal" />

      <Text style={s.secH}>A. ჟურნალის მონაცემები</Text>
      <FieldRow2 label1="ჟურნალის №:" value1={data.journalNumber} label2="პერიოდი (წელი):" value2={data.period} />
      <FieldRow2 label1="პასუხისმგებელი (ხარისხის მენეჯერი):" value1={data.qualityManager} label2="გახსნის თარიღი:" value2={data.openDate} />

      <Text style={s.secH}>B. ინსპექციების სია</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'4%',...cc}]}><Text>#</Text></View>
          <View style={[s.tHead,{width:'13%',...cc}]}><Text>საქმის №</Text></View>
          <View style={[s.tHead,{width:'17%',...cc}]}><Text>დამკვეთი</Text></View>
          <View style={[s.tHead,{width:'19%',...cc}]}><Text>ობიექტი / მისამართი</Text></View>
          <View style={[s.tHead,{width:'10%',...cc}]}><Text>სახეობა</Text></View>
          <View style={[s.tHead,{width:'11%',...cc}]}><Text>ინსპექტორი</Text></View>
          <View style={[s.tHead,{width:'7%',...cc}]}><Text>დასრულება</Text></View>
          <View style={[s.tHead,{width:'7%',...cc}]}><Text>ოქმის თარიღი</Text></View>
          <View style={[s.tHead,{width:'12%',...cc}]}><Text>სტატუსი</Text></View>
        </View>
        {[...Array(18)].map((_,i) => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'4%',...cc}]}><Text style={{fontSize:7}}>{i+1}</Text></View>
            <View style={[s.tCell,{width:'13%',...cc}]}/><View style={[s.tCell,{width:'17%',...cc}]}/><View style={[s.tCell,{width:'19%',...cc}]}/><View style={[s.tCell,{width:'10%',...cc}]}/><View style={[s.tCell,{width:'11%',...cc}]}/><View style={[s.tCell,{width:'7%',...cc}]}/><View style={[s.tCell,{width:'7%',...cc}]}/><View style={[s.tCell,{width:'12%',...cc}]}/>
          </View>
        ))}
      </View>
      <Text style={{fontSize:7,color:'#555',marginBottom:5}}>
        სახეობა: PR-01=ხიდი/გზა | PR-02=ფუნდამენტი | PR-03=ფასადი/ასაწყობი | PR-04=ზარდახში/ინფ. | სტ.: R=რეგისტრირებული | A=მიმდინარე | C=დასრულებული | S=შეჩერებული
      </Text>

      <Text style={s.secH}>C. კვარტალური სტატისტიკა</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{flex:1,...cc}]}><Text>მაჩვენებელი</Text></View>
          <View style={[s.tHead,{width:'11%',...cc}]}><Text>I</Text></View>
          <View style={[s.tHead,{width:'11%',...cc}]}><Text>II</Text></View>
          <View style={[s.tHead,{width:'11%',...cc}]}><Text>III</Text></View>
          <View style={[s.tHead,{width:'11%',...cc}]}><Text>IV</Text></View>
          <View style={[s.tHead,{width:'11%',...cc}]}><Text>სულ</Text></View>
        </View>
        {['სულ','ჩატარებული','უარყოფილი','შეჩერებული','გაუქმებული','საჩივარი'].map((item,i) => (
          <View key={item} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{flex:1,...cc}]}><Text>{item}</Text></View>
            {[...Array(5)].map((_,j) => <View key={j} style={[s.tCell,{width:'11%',...cc}]}/>)}
          </View>
        ))}
      </View>

      <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:6}}>
        <View style={{width:'32%'}}>
          <Text style={{fontWeight:'bold',fontSize:8}}>ხარისხის მენეჯერი:</Text>
          {sigs[0]?.name?<Text style={{fontSize:7.5,marginBottom:1}}>{sigs[0].name}</Text>:null}
          {sigs[0]?.dataURL?<Image src={sigs[0].dataURL} style={s.sigImg}/>:<View style={{height:24}}/>}
          <View style={{borderTopWidth:0.5,borderTopColor:'#000',paddingTop:2}}>
            <Text style={{fontSize:7,textAlign:'center'}}>{sigs[0]?.date||'ხელმოწერა / თარიღი'}</Text>
          </View>
        </View>
      </View>

      <FormFooter code="BE-FM-INSP-REG v1.0 | 28.04.2026 | შენახვა: 10 წელი" />
    </Page>
  </Document>
);};

export default FM21_InspectionRegisterPdf;
