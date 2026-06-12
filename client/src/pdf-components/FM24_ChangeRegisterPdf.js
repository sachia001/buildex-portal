import React from 'react';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, FieldRow2 } from './FormBase';

const cc = { padding: 2, minHeight: 10 };

const FM24_ChangeRegisterPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  return (
  <Document>
    <Page size="A4" orientation="landscape" style={[s.page,{paddingHorizontal:28}]}>
      <WM />
      <FormHeader code="BE-FM-CHANGE-REG" isoRef="სსტ ISO/IEC 17020 §8.3 (PR-01)" title="ცვლილებების რეგისტრი" subtitle="Document Change Register" />

      <FieldRow2 label1="პასუხისმგებელი (ხარისხის მენეჯერი):" value1={data.qualityManager} label2="პერიოდი (წელი):" value2={data.period} />

      <Text style={s.secH}>ცვლილებების ჟურნალი</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'4%',...cc}]}><Text>#</Text></View>
          <View style={[s.tHead,{width:'12%',...cc}]}><Text>BE-FM-CHANGE-INIT №</Text></View>
          <View style={[s.tHead,{flex:1,...cc}]}><Text>დოკუმენტის სახელი</Text></View>
          <View style={[s.tHead,{width:'9%',...cc}]}><Text>ძველი ვერსია</Text></View>
          <View style={[s.tHead,{width:'9%',...cc}]}><Text>ახალი ვერსია</Text></View>
          <View style={[s.tHead,{width:'11%',...cc}]}><Text>ძალაში შესვლის თარიღი</Text></View>
          <View style={[s.tHead,{width:'18%',...cc}]}><Text>ცვლილების ხასიათი</Text></View>
          <View style={[s.tHead,{width:'10%',...cc}]}><Text>BE-FM-FAMIL</Text></View>
        </View>
        {(() => { const rows = Array.isArray(data.changeRows) ? data.changeRows : []; const W=[{width:'12%'},{flex:1},{width:'9%'},{width:'9%'},{width:'11%'},{width:'18%'},{width:'10%'}]; return [...Array(Math.max(22, rows.length))].map((_,i)=>{const r=rows[i]||{}; return (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'4%',...cc}]}><Text style={{fontSize:7}}>{i+1}</Text></View>
            {W.map((st,ci)=>(<View key={ci} style={[s.tCell,{...st,...cc}]}><Text style={{fontSize:7}}>{r['c'+ci]||''}</Text></View>))}
          </View>
        );}); })()}
      </View>
      <Text style={{fontSize:7,color:'#555',marginBottom:6}}>ცვლ.ხ.: რ — რედაქცია | ა — ახალი | ა/ა — ამოღება/არქივი | შ — შინაარსი | BE-FM-FAMIL: ✓ — ჩატარებული | — — ზ. (ზედმეტი)</Text>

      <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:6}}>
        <View style={{width:'35%'}}>
          <Text style={{fontWeight:'bold',fontSize:9}}>ხარისხის მენეჯერი:</Text>
          {sigs[0]?.name?<Text style={{fontSize:7.5,marginBottom:1}}>{sigs[0].name}</Text>:null}
          {sigs[0]?.dataURL?<Image src={sigs[0].dataURL} style={s.sigImg}/>:<View style={{height:32}}/>}
          <View style={{borderTopWidth:0.5,borderTopColor:'#000',paddingTop:2}}>
            <Text style={{fontSize:7.5,textAlign:'center'}}>{sigs[0]?.date||'ხელმოწერა / თარიღი'}</Text>
          </View>
        </View>
      </View>

      <FormFooter code="BE-FM-CHANGE-REG v1.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM24_ChangeRegisterPdf;
