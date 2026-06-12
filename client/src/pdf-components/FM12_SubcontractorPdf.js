import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock2, FormFooter, FieldRow } from './FormBase';

const FM12_SubcontractorPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  const pairs = [
    ['შეფასების №:',data.assessmentNumber,'შეფასების თარიღი:',data.date],
    ['ქვეკონტრაქტორის სახელი:',data.subName,'მომსახურების სახეობა:',data.serviceType],
    ['ლიცენზიის №:',data.licenseNumber,'ვადა:',data.licenseExpiry],
    ['შემმოწმებელი:',data.validator,'BE-CASE №:',data.caseNumber],
  ];
  return (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader code="BE-FM-SUB-MONITOR" isoRef="სსტ ISO/IEC 17020 §6.6" title="ქვეკონტრაქტორის შეფასება" subtitle="Subcontractor Assessment" />

      <Text style={s.secH}>1. საიდენტიფიკაციო მონაცემები</Text>
      <View style={[s.tBorder,{marginBottom:4}]}>
        {pairs.map(([l1,v1,l2,v2],i) => (
          <View key={i} style={{flexDirection:'row',borderBottomWidth:0.5,borderBottomColor:'#ccc'}}>
            <View style={{flex:1,padding:3,borderRightWidth:0.5,borderRightColor:'#ccc'}}>
              <Text style={{fontWeight:'bold',fontSize:7.5}}>{l1}</Text>
              <View style={{borderBottomWidth:0.5,borderBottomColor:'#000',minHeight:11,marginTop:2}}>
                {v1?<Text style={{fontSize:8}}>{v1}</Text>:null}
              </View>
            </View>
            <View style={{flex:1,padding:3}}>
              <Text style={{fontWeight:'bold',fontSize:7.5}}>{l2}</Text>
              <View style={{borderBottomWidth:0.5,borderBottomColor:'#000',minHeight:11,marginTop:2}}>
                {v2?<Text style={{fontSize:8}}>{v2}</Text>:null}
              </View>
            </View>
          </View>
        ))}
      </View>

      <Text style={s.secH}>2. ISO §6.6 კრიტერიუმები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'8%'}]}><Text>§</Text></View>
          <View style={[s.tHead,{flex:1}]}><Text>კრიტერიუმი</Text></View>
          <View style={[s.tHead,{width:'19%'}]}><Text>კი / არა</Text></View>
          <View style={[s.tHead,{width:'26%'}]}><Text>კომენტარი</Text></View>
        </View>
        {[['6.6.1','ინსპექციის ობიექტის მუშაობის გამოცდილება','crit1'],['6.6.2','კვალიფიკაცია და აკრედიტაცია','crit2'],['6.6.3','კლიენტის ინსპექცია','crit3'],['6.6.4','ISO 17020','crit4'],['BE-FM-REG','ანგარიშის შეფასება','crit5'],['PR-02','გამოცდილება ≥5 წელი','crit6']].map(([cl,req,key],i) => {
          const v = data[key];
          return (
          <View key={cl} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'8%'}]}><Text>{cl}</Text></View>
            <View style={[s.tCell,{flex:1}]}><Text>{req}</Text></View>
            <View style={[s.tCell,{width:'19%'}]}>
              {v
                ? <Text style={{fontSize:8,fontWeight:'bold'}}>{v==='yes'?'კი ✓':'არა ✗'}</Text>
                : <View style={{flexDirection:'row',gap:4}}><View style={s.box}/><Text style={{fontSize:7.5}}>კი</Text><View style={s.box}/><Text style={{fontSize:7.5}}>არა</Text></View>}
            </View>
            <View style={[s.tCell,{width:'26%',minHeight:17}]}/>
          </View>
        )})}
      </View>

      <Text style={s.secH}>3. კომპეტენციის შეფასება (1–5)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'5%'}]}><Text>#</Text></View>
          <View style={[s.tHead,{flex:1}]}><Text>ინსპექციის სფერო</Text></View>
          <View style={[s.tHead,{width:'17%'}]}><Text>ქულა (1–5)</Text></View>
          <View style={[s.tHead,{width:'32%'}]}><Text>კომენტარი</Text></View>
        </View>
        {[1,2,3,4].map(i => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'5%'}]}><Text>{i}</Text></View>
            <View style={[s.tCell,{flex:1,minHeight:18}]}>{data[`comp${i}_scope`]?<Text style={{fontSize:8}}>{data[`comp${i}_scope`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'17%'}]}>{data[`comp${i}_score`]?<Text style={{fontSize:8}}>{data[`comp${i}_score`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'32%'}]}>{data[`comp${i}_comment`]?<Text style={{fontSize:8}}>{data[`comp${i}_comment`]}</Text>:null}</View>
          </View>
        ))}
      </View>

      <Text style={s.secH}>4. გადაწყვეტილება</Text>
      <View style={{flexDirection:'row',gap:20,marginBottom:5,marginLeft:4}}>
        {['დამტკიცებულია','პირობით დამტკიცება','უარყოფილია'].map(t => (
          <View key={t} style={{flexDirection:'row',alignItems:'center',gap:4}}>
            <View style={data.decision===t?s.boxChecked:s.box}>{data.decision===t&&<Text style={{color:'#fff',fontSize:6,fontWeight:'bold'}}>✓</Text>}</View>
            <Text style={{fontSize:8}}>{t}</Text>
          </View>
        ))}
      </View>
      <FieldRow label="პირობები:"       value={data.condition} />
      <FieldRow label="ვალიდური ვადა:" value={data.validUntil} />

      <SigBlock2 left="ტექნიკური მენეჯერი" right="ხარისხის მენეჯერი" sigs={sigs} />
      <FormFooter code="BE-FM-SUB-MONITOR v1.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM12_SubcontractorPdf;
