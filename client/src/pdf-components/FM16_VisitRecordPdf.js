import React from 'react';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter } from './FormBase';

const cc = { padding: 2, minHeight: 11 };
const ch = { padding: 2, minHeight: 13 };

const FM16_VisitRecordPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  const pairs = [
    ['BE-CASE №:',data.caseNumber,'ვიზიტის #:',data.visitNumber],
    ['ვიზიტის თარიღი:',data.visitDate,'დაწყება – დასრულება:',data.visitTime],
    ['ობიექტის მისამართი:',data.address,'ინსპექტორი:',data.inspector],
    ['დამკვეთის წარმომადგენელი:',data.clientRep,'კონტრაქტორის წარმომადგენელი:',data.contractorRep],
  ];
  return (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader code="BE-FM-VISIT" isoRef="სსტ ISO/IEC 17020 §7.3" title="ვიზიტის ჩანაწერი" subtitle="Site Visit Record" />

      <Text style={s.secH}>A. საიდენტიფიკაციო მონაცემები</Text>
      <View style={[s.tBorder,{marginBottom:4}]}>
        {pairs.map(([l1,v1,l2,v2],i) => (
          <View key={i} style={{flexDirection:'row',borderBottomWidth:0.5,borderBottomColor:'#ccc'}}>
            <View style={{flex:1,padding:3,borderRightWidth:0.5,borderRightColor:'#ccc'}}>
              <Text style={{fontWeight:'bold',fontSize:7.5}}>{l1}</Text>
              <View style={{borderBottomWidth:0.5,borderBottomColor:'#000',minHeight:10,marginTop:1}}>
                {v1?<Text style={{fontSize:8}}>{v1}</Text>:null}
              </View>
            </View>
            <View style={{flex:1,padding:3}}>
              <Text style={{fontWeight:'bold',fontSize:7.5}}>{l2}</Text>
              <View style={{borderBottomWidth:0.5,borderBottomColor:'#000',minHeight:10,marginTop:1}}>
                {v2?<Text style={{fontSize:8}}>{v2}</Text>:null}
              </View>
            </View>
          </View>
        ))}
      </View>

      <Text style={s.secH}>B. ვიზიტის სახეობა</Text>
      <View style={{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:4,marginLeft:4}}>
        {['დათვალიერება / გაზომვა','სინჯის აღება','ფოტო-სამუშაო','საკონტროლო ეტაპი','გარდამავალი ოქმი','მოულოდნელი შემოწმება'].map(t => (
          <View key={t} style={{flexDirection:'row',alignItems:'center',gap:3}}>
            <View style={data.visitType===t?s.boxChecked:s.box}>{data.visitType===t&&<Text style={{color:'#fff',fontSize:6,fontWeight:'bold'}}>✓</Text>}</View>
            <Text style={{fontSize:8}}>{t}</Text>
          </View>
        ))}
      </View>

      <Text style={s.secH}>C. ინსპექტირება</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{flex:1,...cc}]}><Text>ინსპექციის დასახელება</Text></View>
          <View style={[s.tHead,{width:'18%',...cc}]}><Text>სტანდარტის №</Text></View>
          <View style={[s.tHead,{width:'20%',...cc}]}><Text>კონტროლის ვითარება</Text></View>
          <View style={[s.tHead,{width:'26%',...cc}]}><Text>ჩვენება / შენიშვნა</Text></View>
        </View>
        {[1,2,3].map(i => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{flex:1,...ch}]}>{data[`c${i}_name`]?<Text style={{fontSize:8}}>{data[`c${i}_name`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'18%',...cc}]}>{data[`c${i}_standard`]?<Text style={{fontSize:8}}>{data[`c${i}_standard`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'20%',...cc}]}>{data[`c${i}_control`]?<Text style={{fontSize:8}}>{data[`c${i}_control`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'26%',...cc}]}>{data[`c${i}_note`]?<Text style={{fontSize:8}}>{data[`c${i}_note`]}</Text>:null}</View>
          </View>
        ))}
      </View>

      <Text style={s.secH}>D. დეფექტები და გადახრები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'4%',...cc}]}><Text>#</Text></View>
          <View style={[s.tHead,{flex:1,...cc}]}><Text>სამშენებლო ელემენტის დასახელება</Text></View>
          <View style={[s.tHead,{width:'15%',...cc}]}><Text>ფოტო გადაღება</Text></View>
          <View style={[s.tHead,{width:'15%',...cc}]}><Text>სტანდარტის გვერდი</Text></View>
          <View style={[s.tHead,{width:'13%',...cc}]}><Text>გადახრა</Text></View>
          <View style={[s.tHead,{width:'20%',...cc}]}><Text>შენიშვნა</Text></View>
        </View>
        {[1,2,3,4,5].map(i => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'4%',...cc}]}><Text>{i}</Text></View>
            <View style={[s.tCell,{flex:1,...ch}]}>{data[`d${i}_element`]?<Text style={{fontSize:8}}>{data[`d${i}_element`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'15%',...cc}]}>{data[`d${i}_photo`]?<Text style={{fontSize:8}}>{data[`d${i}_photo`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'15%',...cc}]}>{data[`d${i}_page`]?<Text style={{fontSize:8}}>{data[`d${i}_page`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'13%',...cc}]}>{data[`d${i}_deviation`]?<Text style={{fontSize:8}}>{data[`d${i}_deviation`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'20%',...cc}]}>{data[`d${i}_note`]?<Text style={{fontSize:8}}>{data[`d${i}_note`]}</Text>:null}</View>
          </View>
        ))}
      </View>

      <Text style={s.secH}>E. ფოტო-დოკუმენტაცია</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'13%',...cc}]}><Text>ფოტოს №</Text></View>
          <View style={[s.tHead,{flex:1,...cc}]}><Text>აღწერა</Text></View>
          <View style={[s.tHead,{width:'28%',...cc}]}><Text>GPS კოორდინატები</Text></View>
        </View>
        {[1,2,3].map(i => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'13%',...cc}]}>{data[`e${i}_num`]?<Text style={{fontSize:8}}>{data[`e${i}_num`]}</Text>:null}</View>
            <View style={[s.tCell,{flex:1,...ch}]}>{data[`e${i}_desc`]?<Text style={{fontSize:8}}>{data[`e${i}_desc`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'28%',...cc}]}>{data[`e${i}_gps`]?<Text style={{fontSize:8}}>{data[`e${i}_gps`]}</Text>:null}</View>
          </View>
        ))}
      </View>

      <Text style={s.secH}>F. გამოვლენილი შეუსაბამობები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'4%',...cc}]}><Text>#</Text></View>
          <View style={[s.tHead,{flex:1,...cc}]}><Text>შეუსაბამობის აღწერა</Text></View>
          <View style={[s.tHead,{width:'18%',...cc}]}><Text>კატეგორია</Text></View>
          <View style={[s.tHead,{width:'25%',...cc}]}><Text>მოქმედება / ვადა</Text></View>
        </View>
        {[1,2,3].map(i => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'4%',...cc}]}><Text>{i}</Text></View>
            <View style={[s.tCell,{flex:1,...ch}]}>{data[`f${i}_desc`]?<Text style={{fontSize:8}}>{data[`f${i}_desc`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'18%',...cc}]}>{data[`f${i}_category`]?<Text style={{fontSize:8}}>{data[`f${i}_category`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'25%',...cc}]}>{data[`f${i}_action`]?<Text style={{fontSize:8}}>{data[`f${i}_action`]}</Text>:null}</View>
          </View>
        ))}
      </View>
      <Text style={{fontSize:7,color:'#555',marginBottom:3}}>კატეგ.: კ — კრიტიკული | ა — არსებითი | ფ — ფორმალური / ობსერვაცია</Text>

      <Text style={s.secH}>G. ადგილზე ხელმოწერები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{flex:1,...cc}]}><Text>მხარე</Text></View>
          <View style={[s.tHead,{width:'27%',...cc}]}><Text>სახელი / გვარი</Text></View>
          <View style={[s.tHead,{width:'27%',...cc}]}><Text>ხელმოწერა / თარიღი</Text></View>
        </View>
        {['ინსპექტორი','დამკვეთის წარმომადგენელი','კონტრაქტორის წარმომადგენელი'].map((r,i) => (
          <View key={r} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{flex:1,...cc}]}><Text>{r}</Text></View>
            <View style={[s.tCell,{width:'27%',...ch}]}>
              {sigs[i]?.name ? <Text style={{fontSize:8}}>{sigs[i].name}</Text> : null}
            </View>
            <View style={[s.tCell,{width:'27%',...cc}]}>
              {sigs[i]?.dataURL
                ? <Image src={sigs[i].dataURL} style={{width:72,height:22,objectFit:'contain'}}/>
                : null}
              {sigs[i]?.date ? <Text style={{fontSize:7,marginTop:1}}>{sigs[i].date}</Text> : null}
            </View>
          </View>
        ))}
      </View>

      <FormFooter code="BE-FM-VISIT v2.0 | 28.04.2026 | შენახვა: 10 წელი" />
    </Page>
  </Document>
);};

export default FM16_VisitRecordPdf;
