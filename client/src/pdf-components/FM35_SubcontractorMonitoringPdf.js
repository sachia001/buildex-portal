import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, FieldRow, FieldRow2, YesNoRow, TextArea, SigBlock3, EmptyRows } from './FormBase';

const FM35_SubcontractorMonitoringPdf = ({ data = {} }) => {
  const {
    companyName, legalForm, taxId, contact, phone, email, address, services, accreditation,
    q1, q2, q3, q4, q5, q6, totalScore,
    sigs = [],
  } = data;

  const decision = data.decision || '';
  const monitorCols = [1400, 2200, 2200, 1500, 1000, 1060];

  return (
    <Document>
      <Page size="A4" style={[s.page, { paddingTop: 12, paddingBottom: 22, paddingHorizontal: 28 }]}>
        <WM />
        <FormHeader
          code="BE-FM-SUB-MONITOR"
          isoRef="სსტ ISO/IEC 17020 §6.3 (BE-PR-14)"
          title="ქვეკონტრაქტორის შეფასება და მონიტ. ჩ."
          subtitle="Subcontractor Assessment & Monitoring Record"
        />

        {/* A. ქ-კ. საიდ. */}
        <Text style={s.secH}>A. ქვეკონტრაქტორის საიდენტიფიკაციო მონაცემები</Text>
        <FieldRow label="ორგანიზაციის დასახელება:" value={companyName} />
        <FieldRow2
          label1="იურიდიული ფორმა:"  value1={legalForm}
          label2="საიდენტიფიკაციო კოდი:"       value2={taxId}
        />
        <FieldRow2
          label1="საკონტაქტო პირი:"  value1={contact}
          label2="ტელეფონი:"      value2={phone}
        />
        <FieldRow2
          label1="ელ. ფოსტა:"  value1={email}
          label2="მისამართი:"    value2={address}
        />
        <TextArea value={services} placeholder="გ-ბ. მომს. სახ." minHeight={28} />
        <FieldRow label="აკრედიტაცია / ლიცენზია №:" value={accreditation} />

        {/* B. კ-ა შ-ა ც-ლი */}
        <Text style={s.secH}>B. კვალიფიკაციის შეფასების ცხრილი (6 კრ. — კი/არა)</Text>
        <YesNoRow label="1. იურიდიული სტატუსის დადასტურება (ISO §6.3.1):"          yesNo={q1} />
        <YesNoRow label="2. ინსპექტირების უნარი და კომპეტენცია (ISO §6.3.2):"         yesNo={q2} />
        <YesNoRow label="3. პერსონალის კომპეტენცია (ISO §6.3.3):"           yesNo={q3} />
        <YesNoRow label="4. აკრედიტაცია / იურიდიული საფუძველი (ISO §6.3.4):"     yesNo={q4} />
        <YesNoRow label="5. CAPA სისტემის დანერგვა (ISO §8.7):"             yesNo={q5} />
        <YesNoRow label="6. კალიბრაცია/დადასტურება (ISO §6.2):"       yesNo={q6} />
        <FieldRow label="ჯამური ქულა (0–6):" value={totalScore} />

        {/* decision */}
        <View style={[s.fRow, { alignItems: 'center', marginBottom: 6 }]}>
          <Text style={s.fLabel}>გ-ა:</Text>
          {[['დამტკიცებული', 'approved'], ['პირობითი', 'conditional'], ['უარყოფილი', 'rejected']].map(([label, val]) => (
            <View key={val} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 14 }}>
              <View style={decision === val ? s.boxChecked : s.box}>
                {decision === val && <Text style={{ color: '#fff', fontSize: 6.5, fontWeight: 'bold' }}>✓</Text>}
              </View>
              <Text style={{ fontSize: 8, marginLeft: 2 }}>{label}</Text>
            </View>
          ))}
        </View>

        {/* C. ხ-ბ. გ-ბ. ი-ა */}
        <Text style={s.secH}>C. ხელშეკრულებული გამოყენების ისტორია</Text>
        <View style={s.tBorder}>
          <View style={s.tHeader}>
            {['თ-ღი', 'ო-ბ. / BE-CASE', 'მ-ბ.', 'შ-ა', 'ს-ი', 'ხ.'].map((h, i) => (
              <View key={i} style={[s.tHead, { width: monitorCols[i] }]}>
                <Text>{h}</Text>
              </View>
            ))}
          </View>
          <EmptyRows count={5} cols={monitorCols} minH={18} />
        </View>

        <SigBlock3 labels={['ტექნიკური მენეჯერი', 'ხარისხის მენეჯერი', 'დირექტორი']} sigs={sigs} />
        <FormFooter code="BE-FM-SUB-MONITOR v1.0 | 2026 | ISO §6.3 | შენახვა: 5 წელი" />
      </Page>
    </Document>
  );
};

export default FM35_SubcontractorMonitoringPdf;
