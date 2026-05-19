import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock2, FormFooter, FieldRow, FieldRow2, YesNoRow } from './FormBase';

const FM12_SubcontractorPdf = () => (
  <Document>
    <Page size="A4" style={s.page}>
      <WM />
      <FormHeader
        code="FM-12"
        isoRef="სსტ ISO/IEC 17020 §6.6"
        title="ქვეკონტრაქტორის შეფასება"
        subtitle="Subcontractor Assessment"
      />

      {/* 1 — იდ. */}
      <Text style={s.secH}>1. იდენტიფიკაცია</Text>
      <View style={s.tBorder}>
        {[
          ['შეფასების №:','შეფასების თარიღი:'],
          ['ქვეკონტ. სახელი / ორგ.:','მომსახ. სახე:'],
          ['ლიცენზია / აკრედ. №:','ვადა:'],
          ['შემმოწმებელი:','საქმის № (BE-CASE):'],
        ].map(([l1,l2],i) => (
          <View key={i} style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ccc' }}>
            <View style={{ flex: 1, padding: 5, borderRightWidth: 0.5, borderRightColor: '#ccc' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 8.5 }}>{l1}</Text>
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#000', minHeight: 13, marginTop: 3 }} />
            </View>
            <View style={{ flex: 1, padding: 5 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 8.5 }}>{l2}</Text>
              <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#000', minHeight: 13, marginTop: 3 }} />
            </View>
          </View>
        ))}
      </View>

      {/* 2 — ISO §6.6 */}
      <Text style={s.secH}>2. ISO §6.6 კრიტერიუმების შემოწმება</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '8%' }]}><Text>§</Text></View>
          <View style={[s.tHead, { flex: 1 }]}><Text>კრიტერიუმი</Text></View>
          <View style={[s.tHead, { width: '20%' }]}><Text>კი / არა</Text></View>
          <View style={[s.tHead, { width: '28%' }]}><Text>კომენტარი</Text></View>
        </View>
        {[
          ['6.6.1','ქვეკონტ. ინსპ. ორგ. მოთხოვნები გაეგებინა'],
          ['6.6.2','კომპეტენტური და (სათ.) აკრედიტებული'],
          ['6.6.3','კლიენტი ინფორმირებულია ჩართვის შესახებ'],
          ['6.6.4','ISO 17020 / QMS-ის შესაბამისობა'],
          ['FM-01','ანგარიში შეესაბამება FM-01 მოთხოვნებს'],
          ['PR-02','ჩანაწერი ინახება ≥ 5 წელი'],
        ].map(([cl, req], i) => (
          <View key={cl} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '8%' }]}><Text>{cl}</Text></View>
            <View style={[s.tCell, { flex: 1 }]}><Text>{req}</Text></View>
            <View style={[s.tCell, { width: '20%' }]}>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                <View style={s.box} /><Text style={{ fontSize: 8 }}>კი</Text>
                <View style={s.box} /><Text style={{ fontSize: 8 }}>არა</Text>
              </View>
            </View>
            <View style={[s.tCell, { width: '28%', minHeight: 22 }]} />
          </View>
        ))}
      </View>

      {/* 3 — კომპეტ. */}
      <Text style={s.secH}>3. კომპეტენციის შეფასება (1–5 ქულა)</Text>
      <View style={s.tBorder}>
        <View style={s.tHeader}>
          <View style={[s.tHead, { width: '5%' }]}><Text>#</Text></View>
          <View style={[s.tHead, { flex: 1 }]}><Text>ინსპ. სფერო</Text></View>
          <View style={[s.tHead, { width: '18%' }]}><Text>ქულა (1–5)</Text></View>
          <View style={[s.tHead, { width: '35%' }]}><Text>კომენტარი</Text></View>
        </View>
        {[...Array(4)].map((_, i) => (
          <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
            <View style={[s.tCell, { width: '5%' }]}><Text>{i+1}</Text></View>
            <View style={[s.tCell, { flex: 1, minHeight: 22 }]} />
            <View style={[s.tCell, { width: '18%' }]} />
            <View style={[s.tCell, { width: '35%' }]} />
          </View>
        ))}
      </View>

      {/* 4 — გადაწ. */}
      <Text style={s.secH}>4. საერთო გადაწყვეტილება</Text>
      <View style={{ flexDirection: 'row', gap: 24, marginBottom: 8, marginLeft: 6 }}>
        {['✅ დამტკიცებული','⚠️ პირობით დამტკიცებული','❌ უარყოფილი'].map(t => (
          <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={s.box} /><Text style={{ fontSize: 9 }}>{t}</Text>
          </View>
        ))}
      </View>
      <FieldRow label="პირობა (პირობ. დამტკ. შემთხვ.):" />
      <FieldRow label="ვალიდობის ვადა:" />

      <SigBlock2 left="ტექნიკური მენეჯერი" right="ხარისხის მენეჯერი" />
      <FormFooter code="FM-12 v2.0 | 28.04.2026 | შენახვა: 5 წელი" />
    </Page>
  </Document>
);

export default FM12_SubcontractorPdf;
