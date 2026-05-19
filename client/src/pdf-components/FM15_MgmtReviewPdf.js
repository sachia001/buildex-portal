import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter } from './FormBase';

const cc = { padding: 2, minHeight: 11 };

const FM15_MgmtReviewPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  const pairs = [
    ['სხდომის №:',data.meetingNumber,'თარიღი:',data.date],
    ['ადგილმდებარეობა:',data.location,'თავმჯდომარე:',data.chairman],
    ['მდივანი:',data.secretary,'',''],
  ];
  return (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader code="FM-15" isoRef="სსტ ISO/IEC 17020 §8.5" title="მართვის ანალიზი — სხდომის ოქმი" subtitle="Management Review Record" />

      <Text style={s.secH}>1. სხდომის რეკვიზიტები</Text>
      <View style={[s.tBorder,{marginBottom:4}]}>
        {pairs.map(([l1,v1,l2,v2],i) => (
          <View key={i} style={{flexDirection:'row',borderBottomWidth:0.5,borderBottomColor:'#ccc'}}>
            <View style={{flex:1,padding:3,borderRightWidth:0.5,borderRightColor:'#ccc'}}>
              <Text style={{fontWeight:'bold',fontSize:7.5}}>{l1}</Text>
              {l1 && <View style={{borderBottomWidth:0.5,borderBottomColor:'#000',minHeight:11,marginTop:2}}>
                {v1?<Text style={{fontSize:8}}>{v1}</Text>:null}
              </View>}
            </View>
            <View style={{flex:1,padding:3}}>
              {l2 && <>
                <Text style={{fontWeight:'bold',fontSize:7.5}}>{l2}</Text>
                <View style={{borderBottomWidth:0.5,borderBottomColor:'#000',minHeight:11,marginTop:2}}>
                  {v2?<Text style={{fontSize:8}}>{v2}</Text>:null}
                </View>
              </>}
            </View>
          </View>
        ))}
        <View style={{padding:3}}>
          <Text style={{fontWeight:'bold',fontSize:7.5}}>მონაწილეები:</Text>
          <View style={{borderBottomWidth:0.5,borderBottomColor:'#000',minHeight:13,marginTop:2}}>
            {data.participants?<Text style={{fontSize:8}}>{data.participants}</Text>:null}
          </View>
        </View>
      </View>

      <Text style={s.secH}>2. დღის წესრიგი (ISO §8.5.2)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'5%',...cc}]}><Text>#</Text></View>
          <View style={[s.tHead,{flex:1,...cc}]}><Text>საკითხი</Text></View>
          <View style={[s.tHead,{width:'11%',...cc}]}><Text>ფორმა</Text></View>
          <View style={[s.tHead,{width:'12%',...cc}]}><Text>სტატუსი</Text></View>
          <View style={[s.tHead,{width:'26%',...cc}]}><Text>შენიშვნა / გადაწყვეტილება</Text></View>
        </View>
        {[['1','წინა სხდომის გადაწყვეტილებები','FM-15'],['2','ხარისხის პოლიტიკა და მიზნები','POL-01'],['3','შიდა აუდიტი','FM-04'],['4','გარე შემოწმება',''],['5','საჩივარი','FM-06'],['6','შეუსაბამო სამუშაო','FM-14'],['7','CAPA','FM-10'],['8','პერსონალის კომპეტენცია','FM-08/13'],['9','კალიბრაცია / ვერიფიკაცია','FM-07'],['10','მომხმარებელთა ცვლილება',''],['11','რესურსები',''],['12','მართვის საფუძვლები','RM-01'],['13','ქვეკონტრაქტირება','FM-12'],['14','ხარისხის მენეჯმენტის მიმოხილვა','']].map(([n,item,form],i) => (
          <View key={n} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'5%',...cc}]}><Text>{n}</Text></View>
            <View style={[s.tCell,{flex:1,...cc}]}><Text>{item}</Text></View>
            <View style={[s.tCell,{width:'11%',...cc}]}><Text>{form}</Text></View>
            <View style={[s.tCell,{width:'12%',...cc}]}/>
            <View style={[s.tCell,{width:'26%',...cc}]}/>
          </View>
        ))}
      </View>

      <Text style={s.secH}>3. მიღებული გადაწყვეტილებები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'5%',...cc}]}><Text>#</Text></View>
          <View style={[s.tHead,{flex:1,...cc}]}><Text>ქმედება</Text></View>
          <View style={[s.tHead,{width:'20%',...cc}]}><Text>პასუხისმგებელი</Text></View>
          <View style={[s.tHead,{width:'16%',...cc}]}><Text>ვადა</Text></View>
          <View style={[s.tHead,{width:'14%',...cc}]}><Text>სტატუსი</Text></View>
        </View>
        {[1,2,3,4].map(i => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'5%',...cc}]}><Text>{i}</Text></View>
            <View style={[s.tCell,{flex:1,...cc}]}>{data[`dec${i}_action`]?<Text style={{fontSize:8}}>{data[`dec${i}_action`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'20%',...cc}]}>{data[`dec${i}_responsible`]?<Text style={{fontSize:8}}>{data[`dec${i}_responsible`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'16%',...cc}]}>{data[`dec${i}_deadline`]?<Text style={{fontSize:8}}>{data[`dec${i}_deadline`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'14%',...cc}]}>{data[`dec${i}_status`]?<Text style={{fontSize:8}}>{data[`dec${i}_status`]}</Text>:null}</View>
          </View>
        ))}
      </View>

      <Text style={s.secH}>4. ხარისხის მართვის სისტემის ეფექტურობა</Text>
      <View style={{flexDirection:'row',gap:20,marginBottom:5,marginLeft:5}}>
        {['ეფექტური','არაეფექტური','CAPA საჭიროა'].map(t => (
          <View key={t} style={{flexDirection:'row',alignItems:'center',gap:4}}>
            <View style={data.effectiveness===t?s.boxChecked:s.box}>{data.effectiveness===t&&<Text style={{color:'#fff',fontSize:6,fontWeight:'bold'}}>✓</Text>}</View>
            <Text style={{fontSize:8}}>{t}</Text>
          </View>
        ))}
      </View>

      <SigBlock3 labels={['სხდომის თავმჯდომარე','ხარისხის მენეჯერი','დირექტორი']} sigs={sigs} />
      <FormFooter code="FM-15 v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM15_MgmtReviewPdf;
