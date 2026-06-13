import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2 } from './FormBase';

// მცირე მოსანიშნი უჯრა ცხრილში — ✓ თუ მონიშნულია
const Tick = ({ on }) => (
  <View style={{ width: 9, height: 9, borderWidth: 0.5, borderColor: on ? '#003366' : '#333',
    backgroundColor: on ? '#003366' : 'transparent', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
    {on && <Text style={{ color: '#fff', fontSize: 6, fontWeight: 'bold' }}>✓</Text>}
  </View>
);

const FM13_TrainingRecordNewPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  const rows = Array.isArray(data.participants) ? data.participants : [];
  const total = Math.max(5, rows.length);

  return (
  <Document>
    <Page size="A4" style={[s.page, { paddingTop: 14, paddingBottom: 16, paddingHorizontal: 30 }]}>
      <WM />
      <FormHeader code="BE-FM-TRAIN" isoRef="სსტ ISO/IEC 17020 §6.1" title="ტრენინგის ჩანაწერი" subtitle="Training Record" />

      <Text style={s.secH}>A. მონაწილე პერსონალი</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'6%',padding:2}]}><Text>#</Text></View>
          <View style={[s.tHead,{flex:1,padding:2}]}><Text>სახელი, გვარი</Text></View>
          <View style={[s.tHead,{width:'24%',padding:2}]}><Text>პირადი ნომერი</Text></View>
          <View style={[s.tHead,{width:'24%',padding:2}]}><Text>თანამდებობა</Text></View>
          <View style={[s.tHead,{width:'22%',padding:2}]}><Text>ხელმოწერა</Text></View>
        </View>
        {[...Array(total)].map((_, i) => {
          const r = rows[i] || {};
          return (
            <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
              <View style={[s.tCell,{width:'6%',padding:2}]}><Text style={{fontSize:7.5}}>{i+1}</Text></View>
              <View style={[s.tCell,{flex:1,padding:2}]}><Text style={{fontSize:7.5}}>{r.name||''}</Text></View>
              <View style={[s.tCell,{width:'24%',padding:2}]}><Text style={{fontSize:7.5}}>{r.personalId||''}</Text></View>
              <View style={[s.tCell,{width:'24%',padding:2}]}><Text style={{fontSize:7.5}}>{r.position||''}</Text></View>
              <View style={[s.tCell,{width:'22%',padding:2,minHeight:14}]}/>
            </View>
          );
        })}
      </View>
      <FieldRow2 label1="ტრენინგის თარიღი:" value1={data.trainingDate} label2="ხანგრძლივობა (საათი):" value2={data.duration} />
      <FieldRow  label="ადგილმდებარეობა:"  value={data.location} />

      <Text style={s.secH}>B. ტრენინგის სახეობა</Text>
      <View style={{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:3,marginLeft:4}}>
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
          <View style={[s.tCell,{flex:1,minHeight:18}]}>{data.title?<Text style={{fontSize:8}}>{data.title}</Text>:null}</View>
          <View style={[s.tCell,{width:'26%'}]}>{data.organizer?<Text style={{fontSize:8}}>{data.organizer}</Text>:null}</View>
          <View style={[s.tCell,{width:'20%'}]}/>
        </View>
        {[2,3].map(i => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{flex:1,minHeight:18}]}>{data[`t${i}_title`]?<Text style={{fontSize:8}}>{data[`t${i}_title`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'26%'}]}>{data[`t${i}_organizer`]?<Text style={{fontSize:8}}>{data[`t${i}_organizer`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'20%'}]}>{data[`t${i}_comment`]?<Text style={{fontSize:8}}>{data[`t${i}_comment`]}</Text>:null}</View>
          </View>
        ))}
      </View>

      <Text style={s.secH}>D. კომპეტენციის შეფასების მეთოდი (საერთო ყველა მონაწილისთვის)</Text>
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

      <Text style={s.secH}>E. კომპეტენციის შეფასების შედეგი (თითო მონაწილეზე)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'6%',padding:2}]}><Text>#</Text></View>
          <View style={[s.tHead,{flex:1,padding:2}]}><Text>სახელი, გვარი</Text></View>
          <View style={[s.tHead,{width:'18%',padding:2,textAlign:'center'}]}><Text>სრულად კომპეტენტური</Text></View>
          <View style={[s.tHead,{width:'18%',padding:2,textAlign:'center'}]}><Text>ნაწილობრივ კომპეტენტური</Text></View>
          <View style={[s.tHead,{width:'18%',padding:2,textAlign:'center'}]}><Text>არ არის კომპეტენტური</Text></View>
        </View>
        {[...Array(total)].map((_, i) => {
          const r = rows[i] || {};
          const c = r.competency || '';
          return (
            <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
              <View style={[s.tCell,{width:'6%',padding:2}]}><Text style={{fontSize:7.5}}>{i+1}</Text></View>
              <View style={[s.tCell,{flex:1,padding:2}]}><Text style={{fontSize:7.5}}>{r.name||''}</Text></View>
              <View style={[s.tCell,{width:'18%',padding:2}]}><Tick on={c==='სრულად'} /></View>
              <View style={[s.tCell,{width:'18%',padding:2}]}><Tick on={c==='ნაწილობრივ'} /></View>
              <View style={[s.tCell,{width:'18%',padding:2}]}><Tick on={c==='არა'} /></View>
            </View>
          );
        })}
      </View>
      <FieldRow label="მომდევნო ტრენინგის თარიღი:" value={data.nextTraining} />

      <SigBlock3 labels={['ტექნიკური მენეჯერი','ხარისხის მენეჯერი','დირექტორი']} sigs={sigs} />
      <FormFooter code="BE-FM-TRAIN v1.0 | 2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM13_TrainingRecordNewPdf;
