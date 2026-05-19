import React from 'react';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, TextArea } from './FormBase';

const cc = { padding: 2, minHeight: 12 };

const FM11_InspectionPlanPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  const pairs = [
    ['BE-CASE №:',data.caseNumber,'ინსპექციის თარიღი:',data.inspDate],
    ['ობიექტის მისამართი:',data.address,'დამკვეთი:',data.client],
    ['ხელშეკრულების №:',data.contractNumber,'FM-09 №:',data.fm09Number],
    ['ინსპექტორი:',data.inspector,'ტექნიკური მენეჯერი:',data.techManager],
  ];
  return (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader code="FM-11" isoRef="სსტ ISO/IEC 17020 §7.1" title="ინსპექციის გეგმა" subtitle="Inspection Plan" />

      <Text style={s.secH}>A. საიდენტიფიკაციო მონაცემები</Text>
      <View style={[s.tBorder,{marginBottom:4}]}>
        {pairs.map(([l1,v1,l2,v2],i) => (
          <View key={i} style={{flexDirection:'row',borderBottomWidth:0.5,borderBottomColor:'#ccc'}}>
            <View style={{flex:1,padding:3,borderRightWidth:0.5,borderRightColor:'#ccc'}}>
              <Text style={{fontWeight:'bold',fontSize:7.5}}>{l1}</Text>
              <View style={{borderBottomWidth:0.5,borderBottomColor:'#000',minHeight:11,marginTop:1}}>
                {v1?<Text style={{fontSize:8}}>{v1}</Text>:null}
              </View>
            </View>
            <View style={{flex:1,padding:3}}>
              <Text style={{fontWeight:'bold',fontSize:7.5}}>{l2}</Text>
              <View style={{borderBottomWidth:0.5,borderBottomColor:'#000',minHeight:11,marginTop:1}}>
                {v2?<Text style={{fontSize:8}}>{v2}</Text>:null}
              </View>
            </View>
          </View>
        ))}
      </View>

      <Text style={s.secH}>B. ინსპექციის სფერო და კრიტერიუმები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{flex:1,...cc}]}><Text>სფეროს დასახელება</Text></View>
          <View style={[s.tHead,{width:'30%',...cc}]}><Text>გამოსაყენებელი კრიტერიუმები</Text></View>
          <View style={[s.tHead,{width:'16%',...cc}]}><Text>კომენტარი</Text></View>
        </View>
        {[...Array(3)].map((_,i) => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{flex:1,minHeight:18,...cc}]}/><View style={[s.tCell,{width:'30%',...cc}]}/><View style={[s.tCell,{width:'16%',...cc}]}/>
          </View>
        ))}
      </View>

      <Text style={s.secH}>C. მოწყობილობა</Text>
      <View style={{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:4,marginLeft:4}}>
        {['კამერა','სასაზომი ვერნიერი','სასაზომი ინსტრუმენტი','ფოტოაპარატი','ქვეკონტრაქტორი'].map(m => (
          <View key={m} style={{flexDirection:'row',alignItems:'center',gap:3}}><View style={s.box}/><Text style={{fontSize:8}}>{m}</Text></View>
        ))}
      </View>

      <Text style={s.secH}>D. ვადები / ეტაპები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'5%',...cc}]}><Text>#</Text></View>
          <View style={[s.tHead,{flex:1,...cc}]}><Text>ეტაპი</Text></View>
          <View style={[s.tHead,{width:'20%',...cc}]}><Text>დაგეგმილი თარიღი</Text></View>
          <View style={[s.tHead,{width:'20%',...cc}]}><Text>პასუხისმგებელი</Text></View>
          <View style={[s.tHead,{width:'15%',...cc}]}><Text>სტატუსი</Text></View>
        </View>
        {[['დოკუმენტაციის მომზადება / განხილვა',1],['კლიენტთან შეხვედრა',2],['საიტის ვიზიტი',3],['ანგარიშის პროექტი',4],['ტექნიკური განხილვა',5],['ანგარიშის გაგზავნა',6]].map(([stage,i]) => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'5%',...cc}]}><Text>{i}</Text></View>
            <View style={[s.tCell,{flex:1,...cc}]}><Text>{stage}</Text></View>
            <View style={[s.tCell,{width:'20%',...cc}]}>{data[`stage${i}_date`]?<Text style={{fontSize:8}}>{data[`stage${i}_date`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'20%',...cc}]}>{data[`stage${i}_responsible`]?<Text style={{fontSize:8}}>{data[`stage${i}_responsible`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'15%',...cc}]}>{data[`stage${i}_status`]?<Text style={{fontSize:8}}>{data[`stage${i}_status`]}</Text>:null}</View>
          </View>
        ))}
      </View>

      <Text style={s.secH}>E. განსაკუთრებული მოთხოვნები / რისკები</Text>
      <TextArea value={data.specialNotes} placeholder="(განსაკუთრებული მოთხოვნები)" minHeight={22} />

      <Text style={s.secH}>F. FM-02 ინსპექტორის შეთანხმება</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{flex:1,...cc}]}><Text>ინსპექტორი</Text></View>
          <View style={[s.tHead,{width:'26%',...cc}]}><Text>FM-02 №</Text></View>
          <View style={[s.tHead,{width:'26%',...cc}]}><Text>ხელმოწერა / თარიღი</Text></View>
        </View>
        {[...Array(3)].map((_,i) => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{flex:1,minHeight:15}]}/><View style={[s.tCell,{width:'26%'}]}/><View style={[s.tCell,{width:'26%'}]}/>
          </View>
        ))}
      </View>

      <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:6}}>
        <View style={{width:'44%'}}>
          <Text style={{fontWeight:'bold',fontSize:8}}>ტექნიკური მენეჯერი (დამტკიცება):</Text>
          {sigs[0]?.dataURL?<Image src={sigs[0].dataURL} style={s.sigImg}/>:<View style={{height:26}}/>}
          <View style={{borderTopWidth:0.5,borderTopColor:'#000',paddingTop:2}}>
            <Text style={{fontSize:7,textAlign:'center'}}>{sigs[0]?.date||'ხელმოწერა / თარიღი'}</Text>
          </View>
        </View>
      </View>

      <FormFooter code="FM-11 v2.0 | 28.04.2026 | შენახვა: 10 წელი" />
    </Page>
  </Document>
);};

export default FM11_InspectionPlanPdf;
