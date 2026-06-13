import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, FieldRow, FieldRow2, YesNoRow, TextArea, SigBlock3 } from './FormBase';

const FM05_ContractAcceptancePdf = ({ data = {} }) => {
  const {
    caseId, reviewDate, clientName, inspScope, contractNum, deadline, fee, fm01Num,
    r_scope, r_capability, r_content, r_clientReqs, r_deadline, r_fm02, r_conflict,
    staffAvailable, equipAvailable, timeAvailable,
    scopeLimitations,
    decisionDate, decisionNote,
    sigs = [],
  } = data;

  const decision = data.decision || '';

  return (
    <Document>
      <Page size="A4" style={[s.page, { paddingTop: 12, paddingBottom: 22, paddingHorizontal: 28 }]}>
        <WM />
        <FormHeader
          code="BE-FM-SCREEN"
          isoRef="სსტ ISO/IEC 17020 §7.1 (BE-PR-08)"
          title="ხელშეკრულების განხილვა და სამუშაოს მიღება"
          subtitle="Contract Review & Work Acceptance Form"
        />

        {/* A. საიდ. მ-ბი */}
        <Text style={s.secH}>A. საიდენტიფიკაციო მონაცემები</Text>
        <FieldRow2
          label1="BE-CASE №:"      value1={caseId}
          label2="განხილვის თარიღი:"   value2={reviewDate}
        />
        <FieldRow label="დამკვეთი:"             value={clientName} />
        <FieldRow label="ინსპექტირების სფერო (BE-PR):"  value={inspScope} />
        <FieldRow2
          label1="ხელშეკრულების №:"  value1={contractNum}
          label2="ვადა:"      value2={deadline}
        />
        <FieldRow2
          label1="გასამრჯელო (₾):" value1={fee}
          label2="BE-FM-REG №:"     value2={fm01Num}
        />

        {/* B. ტექნიკური გადახედვის კრიტერიუმები */}
        <Text style={s.secH}>B. ტექნიკური გადახედვის კრიტერიუმები (ISO §7.1.1)</Text>
        <YesNoRow label="§7.1.1a — ობიექტი ნათლად იდენტიფიცირებულია"  yesNo={r_scope} />
        <YesNoRow label="§7.1.1b — ორგანიზაციის შესაძლებლობა და კომპეტენცია დადასტურებულია"              yesNo={r_capability} />
        <YesNoRow label="§7.1.1c — მომსახურების შინაარსი ზუსტად განსაზღვრულია"           yesNo={r_content} />
        <YesNoRow label="§7.1.1d — კლიენტის სპეციალური მოთხოვნები ჩართულია"               yesNo={r_clientReqs} />
        <YesNoRow label="§7.1 — ვადა და გასამრჯელო დამტკიცებულია"                    yesNo={r_deadline} />
        <YesNoRow label="BE-FM-IMP-DECL — მიუკერძოებლობის შემოწმება ჩართულია"                         yesNo={r_fm02} />
        <YesNoRow label="ინტერესთა კონფლიქტი — გამოვლენილია"                           yesNo={r_conflict} />

        {/* C. შესაძლებლობის დადასტურება */}
        <Text style={s.secH}>C. შესაძლებლობის დადასტურება</Text>
        <YesNoRow label="საჭირო პერსონალი ხელმისაწვდომია:"    yesNo={staffAvailable} />
        <YesNoRow label="საჭირო აღჭურვილობა ხელმისაწვდომია:"          yesNo={equipAvailable} />
        <YesNoRow label="ვადა რეალური:"                       yesNo={timeAvailable} />

        {/* D. სფეროს შეზღუდვები / შენიშვნები */}
        <Text style={s.secH}>D. სფეროს შეზღუდვები / სპეციალური პირობები / შენიშვნები</Text>
        <TextArea value={scopeLimitations} placeholder="სფეროს შეზღუდვები / სპეციალური პირობები / შენიშვნები" minHeight={36} />

        {/* E. გადაწყვეტილება (Decision Gate) */}
        <Text style={s.secH}>E. გადაწყვეტილება (Decision Gate)</Text>
        <View style={[s.fRow, { alignItems: 'center', marginBottom: 6 }]}>
          {[['მიღება', 'accept'], ['უარყოფა', 'reject'], ['გადადება', 'defer']].map(([label, val]) => (
            <View key={val} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 18 }}>
              <View style={decision === val ? s.boxChecked : s.box}>
                {decision === val && <Text style={{ color: '#fff', fontSize: 6.5, fontWeight: 'bold' }}>✓</Text>}
              </View>
              <Text style={{ fontSize: 9, marginLeft: 3, fontWeight: 'bold' }}>{label}</Text>
            </View>
          ))}
        </View>
        <FieldRow label="გადაწყვეტილების თარიღი:"    value={decisionDate} />
        <TextArea value={decisionNote} placeholder="გადაწყვეტილების დასაბუთება / შენიშვნა" minHeight={28} />

        <SigBlock3 labels={['ტექნიკური მენეჯერი', 'ხარისხის მენეჯერი', 'დირექტორი']} sigs={sigs} />
        <FormFooter code="BE-FM-SCREEN v1.0 | 2026 | ISO §7.1 | შენახვა: 10 წელი" />
      </Page>
    </Document>
  );
};

export default FM05_ContractAcceptancePdf;
