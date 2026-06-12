import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2, YesNoRow } from './FormBase';

const FM13_TrainingRecordNewPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  return (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader code="BE-FM-TRAIN" isoRef="სსტ ISO/IEC 17020 §6.1" title="ტრენინგის ჩანაწერი" subtitle="Training Record" />

      <Text style={s.secH}>A. თანამშრომლის მონაცემები</Text>
      <FieldRow2 label1="სახელი / გვარი:"       value1={data.name}       label2="პირადი №:"                    value2={data.personalId} />
      <FieldRow2 label1="თანამდებობა:"           value1={data.position}   label2="ტრენინგის თარიღი:"            value2={data.trainingDate} />
      <FieldRow2 label1="ხანგრძლივობა (საათი):" value1={data.duration}   label2="ადგილმდებარეობა:"             value2={data.location} />

      <Text style={s.secH}>B. ტრენინგის სახეობა</Text>
      <View style={{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:4,marginLeft:4}}>
        {['შიდა ანალიზი','გარე ტრენინგი','witnessing','ახალი ინსტრუმენტის ზედამხედველობა','ნორმატიული დოკუმენტი','IT','სხვა'].map(t => (
          <View key={t} style={{flexDirection:'row',alignItems:'center',gap:3}}>
            <View style={data.type===t?s.boxChecked:s.box}>{data.type===t&&<Text style={{color:'#fff',fontSize:6,fontWeight:'bold'}}>✓</Text>}</View>
            <Text style={{fontSize:8}}>{t}</Text>
          </View>
        ))}
      </View>

      <Text style={s.secH}>C. შინაარსი</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{flex:1}]}><Text>სათაური / თემა</Text></View>
          <View style={[s.tHead,{width:'26%'}]}><Text>ორგანიზატორი / ინსტიტუტი</Text></View>
          <View style={[s.tHead,{width:'20%'}]}><Text>კომენტარი</Text></View>
        </View>
        <View style={s.tRow}>
          <View style={[s.tCell,{flex:1,minHeight:20}]}>{data.title?<Text style={{fontSize:8}}>{data.title}</Text>:null}</View>
          <View style={[s.tCell,{width:'26%'}]}>{data.organizer?<Text style={{fontSize:8}}>{data.organizer}</Text>:null}</View>
          <View style={[s.tCell,{width:'20%'}]}/>
        </View>
        {[2,3].map(i => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{flex:1,minHeight:20}]}>{data[`t${i}_title`]?<Text style={{fontSize:8}}>{data[`t${i}_title`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'26%'}]}>{data[`t${i}_organizer`]?<Text style={{fontSize:8}}>{data[`t${i}_organizer`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'20%'}]}>{data[`t${i}_comment`]?<Text style={{fontSize:8}}>{data[`t${i}_comment`]}</Text>:null}</View>
          </View>
        ))}
      </View>

      <Text style={s.secH}>D. კომპეტენციის მეთოდი</Text>
      <View style={{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:3,marginLeft:4}}>
        {['წერილობითი ტესტი','witnessing','ზედამხედველობა გამოყენებაზე','პრაქტიკული სავარჯიშო','ტექნიკური მენეჯერის შეფასება'].map(m => (
          <View key={m} style={{flexDirection:'row',alignItems:'center',gap:3}}>
            <View style={(data.competencyMethods||[]).includes(m)?s.boxChecked:s.box}>
              {(data.competencyMethods||[]).includes(m)&&<Text style={{color:'#fff',fontSize:6,fontWeight:'bold'}}>✓</Text>}
            </View>
            <Text style={{fontSize:8}}>{m}</Text>
          </View>
        ))}
      </View>
      <YesNoRow label="კომპეტენტურია:" yesNo={data.competent} />

      <Text style={s.secH}>E. სტატუსი</Text>
      <View style={{flexDirection:'row',gap:16,marginBottom:4,marginLeft:4}}>
        {['სრულად კომპეტენტური','ნაწილობრივ კომპეტენტური','კომპეტენტური არ არის'].map(t => (
          <View key={t} style={{flexDirection:'row',alignItems:'center',gap:3}}>
            <View style={data.statusResult===t?s.boxChecked:s.box}>
              {data.statusResult===t&&<Text style={{color:'#fff',fontSize:6,fontWeight:'bold'}}>✓</Text>}
            </View>
            <Text style={{fontSize:8}}>{t}</Text>
          </View>
        ))}
      </View>
      <FieldRow label="მომდევნო ტრენინგის თარიღი:" value={data.nextTraining} />

      <SigBlock3 labels={['თანამშრომელი','ტექნიკური მენეჯერი','ხარისხის მენეჯერი']} sigs={sigs} />
      <FormFooter code="BE-FM-TRAIN v1.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM13_TrainingRecordNewPdf;
