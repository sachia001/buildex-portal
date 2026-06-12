import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2 } from './FormBase';

const cc = { padding: 2, minHeight: 12 };

const FM22_FamiliarizationPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  return (
  <Document>
    <Page size="A4" style={[s.page, { paddingTop: 10, paddingBottom: 16, paddingHorizontal: 28 }]}>
      <WM />
      <FormHeader code="BE-FM-FAMIL" isoRef="სსტ ISO/IEC 17020 §6.1" title="გაცნობის ფურცელი" subtitle="Document Familiarization Sheet" />

      <Text style={s.secH}>A. დოკუმენტის მონაცემები</Text>
      <FieldRow  label="დოკუმენტის სახელი:"              value={data.documentName} />
      <FieldRow2 label1="კოდი:"                          value1={data.documentCode} label2="ვერსია:"                    value2={data.newVersion} />
      <FieldRow2 label1="ძველი ვერსია / ახალი ვერსია:"   value1={data.oldVersion}   label2="ძალაში შესვლის თარიღი:"     value2={data.effectiveDate} />
      <View style={{backgroundColor:'#fff3cd',borderWidth:0.5,borderColor:'#ffc107',padding:4,marginBottom:5}}>
        <Text style={{fontWeight:'bold',fontSize:8}}>ცვლილების მოკლე აღწერა:</Text>
        <View style={{minHeight:22,marginTop:3}}>
          {data.changeDesc?<Text style={{fontSize:8}}>{data.changeDesc}</Text>:null}
        </View>
      </View>
      <FieldRow label="გაცნობის ვადა: 5 სამუშაო დღე — არაუგვიანეს:" value={data.deadline} />

      <Text style={s.secH}>B. გაცნობის ოქმი</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'5%',...cc}]}><Text>#</Text></View>
          <View style={[s.tHead,{flex:1,...cc}]}><Text>სახელი / გვარი</Text></View>
          <View style={[s.tHead,{width:'22%',...cc}]}><Text>თანამდებობა</Text></View>
          <View style={[s.tHead,{width:'22%',...cc}]}><Text>ხელმოწერა</Text></View>
          <View style={[s.tHead,{width:'18%',...cc}]}><Text>თარიღი</Text></View>
        </View>
        {(() => {
          const rows = Array.isArray(data.acknowledgeRows) ? data.acknowledgeRows : [];
          const total = Math.max(14, rows.length);
          return [...Array(total)].map((_, i) => {
            const r = rows[i] || {};
            return (
              <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
                <View style={[s.tCell,{width:'5%',...cc}]}><Text style={{fontSize:7.5}}>{i+1}</Text></View>
                <View style={[s.tCell,{flex:1,...cc}]}><Text style={{fontSize:7.5}}>{r.name||''}</Text></View>
                <View style={[s.tCell,{width:'22%',...cc}]}><Text style={{fontSize:7.5}}>{r.position||''}</Text></View>
                <View style={[s.tCell,{width:'22%',...cc}]}/>
                <View style={[s.tCell,{width:'18%',...cc}]}><Text style={{fontSize:7.5}}>{r.date||''}</Text></View>
              </View>
            );
          });
        })()}
      </View>

      <SigBlock3 labels={['შემმოწმებელი (ხარისხის მენეჯერი)','დამტკიცება (დირექტორი)']} sigs={sigs} />
      <FormFooter code="BE-FM-FAMIL v1.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM22_FamiliarizationPdf;
