import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, FieldRow, FieldRow2, YesNoRow, TextArea, SigBlock3, EmptyRows } from './FormBase';

const FM33_ImpartialityRiskPdf = ({ data = {} }) => {
  const {
    assessmentId, assessmentDate, caseId, inspector, clientName, objectName,
    overallRiskLevel, controlMeasures,
    sigs = [],
  } = data;

  const decision = data.decision || '';
  const riskCols = [1000, 3400, 700, 700, 700, 700, 2160];

  return (
    <Document>
      <Page size="A4" style={[s.page, { paddingTop: 12, paddingBottom: 22, paddingHorizontal: 28 }]}>
        <WM />
        <FormHeader
          code="BE-FM-IMP-RISK"
          isoRef="სსტ ISO/IEC 17020 §4.1 (BE-PR-06)"
          title="მიუკერძოებლობის რისკების შეფასება"
          subtitle="Impartiality Risk Assessment Form"
        />

        {/* A. ზოგადი ინფ. */}
        <Text style={s.secH}>A. ზოგადი ინფორმაცია</Text>
        <FieldRow2
          label1="შეფ. №:"   value1={assessmentId}
          label2="თ-ღი:"     value2={assessmentDate}
        />
        <FieldRow2
          label1="BE-CASE №:" value1={caseId}
          label2="ინსპ.:"     value2={inspector}
        />
        <FieldRow2
          label1="დამკ.:"  value1={clientName}
          label2="ობ.:"    value2={objectName}
        />

        {/* B. რისკების შეფასების ცხრილი */}
        <Text style={s.secH}>B. რისკების შეფასების ცხრილი (Risk Matrix 4×5)</Text>
        <View style={s.tBorder}>
          <View style={s.tHeader}>
            {['რ-ის კ.', 'რ-ის სახე / გარ.', 'G (1-5)', 'A (1-5)', 'G×A', 'დ.', 'კ-ბი'].map((h, i) => (
              <View key={i} style={[s.tHead, { width: riskCols[i] }]}>
                <Text>{h}</Text>
              </View>
            ))}
          </View>
          <EmptyRows count={5} cols={riskCols} minH={20} />
        </View>

        {/* Risk scale legend */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 5 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <View style={{ width: 8, height: 8, backgroundColor: '#28a745' }} />
            <Text style={{ fontSize: 7 }}>1–4: დ-ბ. (Acceptable)</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <View style={{ width: 8, height: 8, backgroundColor: '#ffc107' }} />
            <Text style={{ fontSize: 7 }}>5–9: საშ. (Review)</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <View style={{ width: 8, height: 8, backgroundColor: '#dc3545' }} />
            <Text style={{ fontSize: 7 }}>10–25: მ-ლი (Mitigation/Restriction)</Text>
          </View>
        </View>

        {/* C. გადაწყვეტილება */}
        <Text style={s.secH}>C. გადაწყვეტილება</Text>

        {/* საერ. რ-ის დ. */}
        <View style={[s.fRow, { alignItems: 'center', marginBottom: 6 }]}>
          <Text style={s.fLabel}>საერ. რ-ის დ.:</Text>
          {[['დ.', 'acceptable'], ['საშ.', 'review'], ['მ-ლი', 'mitigate']].map(([label, val]) => (
            <View key={val} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 14 }}>
              <View style={overallRiskLevel === val ? s.boxChecked : s.box}>
                {overallRiskLevel === val && <Text style={{ color: '#fff', fontSize: 6.5, fontWeight: 'bold' }}>✓</Text>}
              </View>
              <Text style={{ fontSize: 8, marginLeft: 2 }}>{label}</Text>
            </View>
          ))}
        </View>

        <TextArea value={controlMeasures} placeholder="კ-ბი / რ-ბ. შ-ები" minHeight={36} />

        {/* გ-ა */}
        <View style={[s.fRow, { alignItems: 'center', marginBottom: 6 }]}>
          <Text style={s.fLabel}>გ-ა:</Text>
          {[['მიღ.', 'accept'], ['შეზ. მ.', 'restricted'], ['ჩამ.', 'rejected']].map(([label, val]) => (
            <View key={val} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 14 }}>
              <View style={decision === val ? s.boxChecked : s.box}>
                {decision === val && <Text style={{ color: '#fff', fontSize: 6.5, fontWeight: 'bold' }}>✓</Text>}
              </View>
              <Text style={{ fontSize: 8, marginLeft: 2 }}>{label}</Text>
            </View>
          ))}
        </View>

        <SigBlock3 labels={['ინსპექტორი', 'ხარისხის მენეჯერი', 'დირექტორი']} sigs={sigs} />
        <FormFooter code="BE-FM-IMP-RISK v1.0 | 2026 | ISO §4.1 | შენახვა: 5 წელი" />
      </Page>
    </Document>
  );
};

export default FM33_ImpartialityRiskPdf;
