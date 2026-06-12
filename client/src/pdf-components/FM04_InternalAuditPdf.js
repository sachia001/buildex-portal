import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2, YesNoRow, TextArea } from './FormBase';

const cc = { padding: 2, minHeight: 12 };

const FM04_InternalAuditPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  return (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader code="BE-FM-AUDIT-PLAN" isoRef="სსტ ISO/IEC 17020 §8.6" title="შიდა აუდიტის გეგმა და ანგარიში" subtitle="Internal Audit Plan & Report" />

      <Text style={s.secH}>A. საიდენტიფიკაციო მონაცემები</Text>
      <FieldRow2 label1="აუდიტის №:" value1={data.auditNumber}  label2="პერიოდი (წელი):"     value2={data.period} />
      <FieldRow2 label1="აუდიტორი:"  value1={data.auditor}      label2="თარიღი:"              value2={data.auditDate} />
      <FieldRow  label="შემოწმებული პერსონალი:"  value={data.auditedStaff} />
      <FieldRow  label="შემოწმებული დოკუმენტები:" value={data.documents} />
      <FieldRow  label="შემოწმებული საქმეები:"    value={data.cases} />

      <Text style={s.secH}>B. შემოწმების ფარგლები (ISO §§)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'9%',...cc}]}><Text>§</Text></View>
          <View style={[s.tHead,{flex:1,...cc}]}><Text>მოთხოვნა</Text></View>
          <View style={[s.tHead,{width:'16%',...cc}]}><Text>შეფასება (✓)</Text></View>
        </View>
        {[['§4','მიუკერძოებლობა'],['§5','კონფიდენციალობა'],['§6.1','პერსონალი — კომპეტენცია'],['§6.2','მოწყობილობა და კალიბრაცია'],['§7.1','ხელშეკრულების გაფორმება'],['§7.3','ინსპექციის მეთოდები'],['§7.4','სამუშაოს გაფორმება'],['§8.1','საჩივარი'],['§8.5','მართვის ანალიზი'],['§8.6','შიდა აუდიტი'],['§8.7','შეუსაბამო სამუშაო']].map(([cl,req],i) => (
          <View key={cl} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'9%',...cc}]}><Text>{cl}</Text></View>
            <View style={[s.tCell,{flex:1,...cc}]}><Text>{req}</Text></View>
            <View style={[s.tCell,{width:'16%',...cc,alignItems:'center'}]}>
              {(data.auditScopes||[]).includes(cl)
                ? <Text style={{fontSize:10,color:'#003366',fontWeight:'bold'}}>✓</Text>
                : <View style={s.box}/>}
            </View>
          </View>
        ))}
      </View>

      <Text style={s.secH}>C. მოვლენები (შეუსაბამობები)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'5%',...cc}]}><Text>#</Text></View>
          <View style={[s.tHead,{flex:1,...cc}]}><Text>მოვლენის / შეუსაბამობის აღწერა</Text></View>
          <View style={[s.tHead,{width:'14%',...cc}]}><Text>ISO §</Text></View>
          <View style={[s.tHead,{width:'18%',...cc}]}><Text>კატეგორია</Text></View>
        </View>
        {[1,2,3,4].map(i => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'5%',...cc}]}><Text>{i}</Text></View>
            <View style={[s.tCell,{flex:1,...cc,minHeight:14}]}>{data[`nc${i}_desc`]?<Text style={{fontSize:8}}>{data[`nc${i}_desc`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'14%',...cc}]}>{data[`nc${i}_clause`]?<Text style={{fontSize:8}}>{data[`nc${i}_clause`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'18%',...cc}]}>{data[`nc${i}_category`]?<Text style={{fontSize:8}}>{data[`nc${i}_category`]}</Text>:null}</View>
          </View>
        ))}
      </View>
      <Text style={{fontSize:7,color:'#555',marginBottom:3}}>კატეგ.: კ — კრიტიკული | მ — მცირე | გ — გამოსწორებული</Text>

      <Text style={s.secH}>D. CAPA (BE-FM-CAPA)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead,{width:'5%',...cc}]}><Text>#</Text></View>
          <View style={[s.tHead,{flex:1,...cc}]}><Text>CAPA №</Text></View>
          <View style={[s.tHead,{width:'33%',...cc}]}><Text>ქმედება</Text></View>
          <View style={[s.tHead,{width:'18%',...cc}]}><Text>ვადა / სტატუსი</Text></View>
        </View>
        {[1,2].map(i => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'5%',...cc}]}><Text>{i}</Text></View>
            <View style={[s.tCell,{flex:1,...cc,minHeight:14}]}>{data[`capa${i}_num`]?<Text style={{fontSize:8}}>{data[`capa${i}_num`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'33%',...cc}]}>{data[`capa${i}_action`]?<Text style={{fontSize:8}}>{data[`capa${i}_action`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'18%',...cc}]}>{data[`capa${i}_deadline`]?<Text style={{fontSize:8}}>{data[`capa${i}_deadline`]}</Text>:null}</View>
          </View>
        ))}
      </View>

      <Text style={s.secH}>E. შეჯამება</Text>
      <YesNoRow label="ყველა ISO §8.6 მოთხოვნა დაკმაყოფილებულია:" yesNo={data.allRequirementsMet} />
      <YesNoRow label="ხელმეორე შემოწმება საჭიროა:"                 yesNo={data.reauditNeeded} />
      <FieldRow  label="ხელმეორე შემოწმების თარიღი:"                value={data.reauditDate} />
      <TextArea  value={data.generalComment} placeholder="კომენტარი / შენიშვნა" minHeight={22} />

      <SigBlock3 sigs={sigs} />
      <FormFooter code="BE-FM-AUDIT-PLAN v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);};

export default FM04_InternalAuditPdf;
