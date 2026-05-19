import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, SigBlock3, FormFooter, FieldRow, FieldRow2 } from './FormBase';

const fmtN = n => n != null ? Number(n).toLocaleString('ka-GE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';
const fmtD = d => d != null ? (d > 0 ? `+${d}%` : `${d}%`) : '—';

const STATUS_COLOR = {
  'შესაბამისი':  '#dcfce7',
  'გაფრთხილება': '#fef9c3',
  'დარღვევა':    '#fee2e2',
  'ვერ შემოწმდა': '#f3f4f6',
};

const cc = { padding: 2 };

const PriceAdequacyReportPdf = ({ data = {} }) => {
  const sigs = data.sigs || [];
  const items = data.lineItems || [];
  const normLabel = [data.normType || 'NER', data.normYear, data.normQuarter ? `კვ.${data.normQuarter}` : null].filter(Boolean).join(' ');

  return (
    <Document>
      <Page size="A4" style={[s.page, { paddingHorizontal: 22 }]}>
        <WM />
        <FormHeader
          code="PA"
          isoRef="SNIP / NER"
          title="ფასწარმოქმნის ადეკვატურობის ანგარიში"
          subtitle="Price Formation Adequacy Report"
        />

        <Text style={s.secH}>1. ზოგადი ინფორმაცია</Text>
        <FieldRow2 label1="შემოწმების №:" value1={data.checkNumber} label2="თარიღი:" value2={data.checkDate ? new Date(data.checkDate).toLocaleDateString('ka-GE') : ''} />
        <FieldRow2 label1="BE-CASE №:"  value1={data.caseNumber}  label2="ობიექტი:" value2={data.objectName} />
        <FieldRow2 label1="შემმოწმებელი:" value1={data.checkedBy} label2="ნორმ. ბაზა:" value2={normLabel} />
        <FieldRow  label="ხარჯთაღრ. ფაილი:" value={data.estimateFileName} />

        <Text style={s.secH}>2. სტატისტიკური შეჯამება</Text>
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 5 }}>
          {[
            ['სულ პოზ.', data.totalLines, '#003366', '#e8f0f7'],
            ['შემოწმდა', data.matchedLines, '#1d4ed8', '#dbeafe'],
            ['შესაბამ.', data.okCount, '#15803d', '#dcfce7'],
            ['გაფრთხ.', data.warningCount, '#b45309', '#fef9c3'],
            ['დარღვევა', data.violationCount, '#b91c1c', '#fee2e2'],
            ['ვერ შემ.', data.unmatchedCount, '#6b7280', '#f3f4f6'],
          ].map(([label, val, textColor, bg]) => (
            <View key={label} style={{ flex: 1, backgroundColor: bg, borderRadius: 3, padding: 5, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: textColor }}>{val ?? 0}</Text>
              <Text style={{ fontSize: 7, color: textColor, marginTop: 2 }}>{label}</Text>
            </View>
          ))}
        </View>

        <Text style={s.secH}>3. დასკვნა</Text>
        <View style={{ borderWidth: 0.5, borderColor: '#003366', backgroundColor: '#e8f0f7', padding: 5, marginBottom: 4 }}>
          <Text style={{ fontSize: 8.5 }}>{data.conclusion || '—'}</Text>
        </View>

        <Text style={s.secH}>4. ხარჯთაღრიცხვის ანალიზი</Text>
        <View style={[s.tBorder, { marginBottom: 4 }]}>
          <View style={s.tHeader}>
            <View style={[s.tHead, { width: '5%', ...cc }]}><Text>#</Text></View>
            <View style={[s.tHead, { width: '9%', ...cc }]}><Text>კოდი</Text></View>
            <View style={[s.tHead, { flex: 1, ...cc }]}><Text>დასახელება</Text></View>
            <View style={[s.tHead, { width: '6%', ...cc }]}><Text>ერთ.</Text></View>
            <View style={[s.tHead, { width: '7%', ...cc }]}><Text>რაოდ.</Text></View>
            <View style={[s.tHead, { width: '10%', ...cc }]}><Text>ხარჯთ.ფ.</Text></View>
            <View style={[s.tHead, { width: '10%', ...cc }]}><Text>ნორმ.ფ.</Text></View>
            <View style={[s.tHead, { width: '7%', ...cc }]}><Text>გადახ.%</Text></View>
            <View style={[s.tHead, { width: '12%', ...cc }]}><Text>სტატუსი</Text></View>
          </View>
          {items.map((it, i) => {
            const bg = STATUS_COLOR[it.lineStatus] || '#fff';
            return (
              <View key={i} style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ccc', backgroundColor: bg }}>
                <View style={[s.tCell, { width: '5%', ...cc }]}><Text style={{ fontSize: 7 }}>{it.lineNum}</Text></View>
                <View style={[s.tCell, { width: '9%', ...cc }]}><Text style={{ fontSize: 7 }}>{it.code || ''}</Text></View>
                <View style={[s.tCell, { flex: 1, ...cc }]}><Text style={{ fontSize: 7 }}>{it.description || ''}</Text></View>
                <View style={[s.tCell, { width: '6%', ...cc }]}><Text style={{ fontSize: 7 }}>{it.unit || ''}</Text></View>
                <View style={[s.tCell, { width: '7%', ...cc }]}><Text style={{ fontSize: 7 }}>{it.quantity || ''}</Text></View>
                <View style={[s.tCell, { width: '10%', ...cc }]}><Text style={{ fontSize: 7 }}>{fmtN(it.unitPrice)}</Text></View>
                <View style={[s.tCell, { width: '10%', ...cc }]}><Text style={{ fontSize: 7 }}>{fmtN(it.normUnitPrice)}</Text></View>
                <View style={[s.tCell, { width: '7%', ...cc }]}><Text style={{ fontSize: 7, fontWeight: it.deviation != null && Math.abs(it.deviation) > 5 ? 'bold' : 'normal' }}>{fmtD(it.deviation)}</Text></View>
                <View style={[s.tCell, { width: '12%', ...cc }]}><Text style={{ fontSize: 7, fontWeight: 'bold' }}>{it.lineStatus}</Text></View>
              </View>
            );
          })}
        </View>

        <Text style={{ fontSize: 7, color: '#555', marginBottom: 4 }}>
          შენიშვნა: გადახრა გამოიანგარიშება ნებადართულ ელემენტარულ ფასდებთან (NER) შედარებით. ≤5% — შესაბამისი; 5–15% — გაფრთხილება; &gt;15% — დარღვევა.
        </Text>

        <SigBlock3 labels={['შემმოწმებელი', 'ტექნიკური მენეჯერი', 'ხარისხის მენეჯერი']} sigs={sigs} />
        <FormFooter code={`${data.checkNumber || 'PA'} | ${data.checkDate ? new Date(data.checkDate).toLocaleDateString('ka-GE') : ''} | შენახვა: 5 წელი`} />
      </Page>
    </Document>
  );
};

export default PriceAdequacyReportPdf;
