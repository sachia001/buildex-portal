import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, FieldRow, FieldRow2, SigBlock3 } from './FormBase';

const cc = { padding: 2, minHeight: 11 };
const ch = { padding: 3, minHeight: 14 };

const FM17_InspectionReportPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  return (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader code="BE-FM-IR" isoRef="სსტ ISO/IEC 17020 §7.4" title="ინსპექტირების ანგარიში" subtitle="Inspection Report" />

      <Text style={s.secH}>A. საიდენტიფიკაციო მონაცემები</Text>
      <FieldRow2 label1="BE-CASE №:" value1={data.caseNumber} label2="ანგარიშის №:" value2={data.reportNumber} />
      <FieldRow2 label1="ანგარიშის თარიღი:" value1={data.reportDate} label2="ხელშეკრულების №:" value2={data.contractNumber} />
      <FieldRow label="ობიექტის მისამართი:" value={data.objectAddress} />
      <FieldRow label="დამკვეთი / ორგანიზაცია:" value={data.client} />
      <FieldRow2 label1="ინსპექტორი:" value1={data.inspector} label2="ტექნიკური მენეჯერი:" value2={data.techManager} />
      <FieldRow label="ინსპექციის სფერო:" value={data.inspScope} />

      <Text style={s.secH}>B. გამოყენებული სტანდარტები და კრიტერიუმები</Text>
      <View style={[s.textarea, { minHeight: 30 }]}>
        {data.executedStandards
          ? <Text style={{ fontSize: 8.5, lineHeight: 1.4 }}>{data.executedStandards}</Text>
          : <Text style={{ fontSize: 8, color: '#bbb', }}>ჩამოთვალეთ გამოყენებული ნორმატიული დოკუმენტები, GOST-ები, EN-ები...</Text>}
      </View>

      <Text style={s.secH}>C. ინსპექტირების პროცესი და შედეგები</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '4%', ...cc }]}><Text>#</Text></View>
          <View style={[s.tHead, { flex: 1, ...cc }]}><Text>შემოწმებული ელემენტი / კომპონენტი</Text></View>
          <View style={[s.tHead, { width: '20%', ...cc }]}><Text>სტანდარტი / §</Text></View>
          <View style={[s.tHead, { width: '16%', ...cc }]}><Text>შეფასება</Text></View>
          <View style={[s.tHead, { width: '24%', ...cc }]}><Text>შენიშვნა / გადახრა</Text></View>
        </View>
        {[1,2,3,4,5,6].map(i => {
          const r = i%2===0 ? s.tRow : s.tRowAlt;
          return (
            <View key={i} style={r}>
              <View style={[s.tCell, { width: '4%', ...cc }]}><Text>{i}</Text></View>
              <View style={[s.tCell, { flex: 1, ...ch }]}>{data[`r${i}_element`]?<Text style={{fontSize:8}}>{data[`r${i}_element`]}</Text>:null}</View>
              <View style={[s.tCell, { width: '20%', ...cc }]}>{data[`r${i}_standard`]?<Text style={{fontSize:8}}>{data[`r${i}_standard`]}</Text>:null}</View>
              <View style={[s.tCell, { width: '16%', ...cc }]}>
                {data[`r${i}_result`]
                  ? <Text style={{ fontSize: 8, fontWeight: 'bold',
                      color: data[`r${i}_result`]==='შეესაბამება' ? '#198754' :
                             data[`r${i}_result`]==='არ შეესაბამება' ? '#dc3545' : '#555' }}>
                      {data[`r${i}_result`]}
                    </Text>
                  : null}
              </View>
              <View style={[s.tCell, { width: '24%', ...ch }]}>{data[`r${i}_note`]?<Text style={{fontSize:8}}>{data[`r${i}_note`]}</Text>:null}</View>
            </View>
          );
        })}
      </View>

      <Text style={s.secH}>D. ფოტო-დოკუმენტაცია</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '12%', ...cc }]}><Text>ფოტოს №</Text></View>
          <View style={[s.tHead, { flex: 1, ...cc }]}><Text>აღწერა</Text></View>
          <View style={[s.tHead, { width: '25%', ...cc }]}><Text>GPS / ადგილმდებარეობა</Text></View>
        </View>
        {[1,2,3].map(i => (
          <View key={i} style={i%2===0?s.tRow:s.tRowAlt}>
            <View style={[s.tCell,{width:'12%',...cc}]}>{data[`p${i}_num`]?<Text style={{fontSize:8}}>{data[`p${i}_num`]}</Text>:null}</View>
            <View style={[s.tCell,{flex:1,...ch}]}>{data[`p${i}_desc`]?<Text style={{fontSize:8}}>{data[`p${i}_desc`]}</Text>:null}</View>
            <View style={[s.tCell,{width:'25%',...cc}]}>{data[`p${i}_gps`]?<Text style={{fontSize:8}}>{data[`p${i}_gps`]}</Text>:null}</View>
          </View>
        ))}
      </View>

      <Text style={s.secH}>E. ძირითადი მიგნებები</Text>
      <View style={[s.textarea, { minHeight: 36 }]}>
        {data.findings
          ? <Text style={{ fontSize: 8.5, lineHeight: 1.4 }}>{data.findings}</Text>
          : <Text style={{ fontSize: 8, color: '#bbb', }}>ინსპექციის მიგნებები, გამოვლენილი ხარვეზები, გადახრები...</Text>}
      </View>

      <Text style={s.secH}>F. დასკვნა</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 4, marginLeft: 4 }}>
        {['შეესაბამება მოთხოვნებს', 'პირობით შეესაბამება', 'არ შეესაბამება მოთხოვნებს'].map(opt => (
          <View key={opt} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <View style={data.conclusion===opt ? s.boxChecked : s.box}>
              {data.conclusion===opt && <Text style={{ color: '#fff', fontSize: 6, fontWeight: 'bold' }}>✓</Text>}
            </View>
            <Text style={{ fontSize: 8 }}>{opt}</Text>
          </View>
        ))}
      </View>
      <View style={[s.textarea, { minHeight: 28 }]}>
        {data.conclusionText
          ? <Text style={{ fontSize: 8.5, lineHeight: 1.4 }}>{data.conclusionText}</Text>
          : <Text style={{ fontSize: 8, color: '#bbb', }}>დასკვნის ტექსტი...</Text>}
      </View>

      <Text style={s.secH}>G. ხელმოწერები</Text>
      <SigBlock3 labels={['ინსპექტორი', 'ტექნიკური მენეჯერი', 'ხარისხის მენეჯერი']} sigs={sigs} />

      <FormFooter code="BE-FM-IR v1.0 | 28.04.2026 | შენახვა: 10 წელი" />
    </Page>
  </Document>
);};

export default FM17_InspectionReportPdf;
