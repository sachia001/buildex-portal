import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, FieldRow, FieldRow2, YesNoRow, SigBlock2 } from './FormBase';

const FM34_EquipmentCardPdf = ({ data = {} }) => {
  const {
    equipId, status, name, model, serialNum, manufacturer, country,
    purchaseDate, location, accuracy,
    calibCenter, lastCalibDate, nextCalibDate, calibInterval, certNum, calibResult,
    calibHistRows = [], usageRows = [],
    sigs = [],
  } = data;

  const calibHistCols  = [1500, 2200, 1500, 1800, 1200, 1160];
  const usageHistCols  = [1400, 1500, 1800, 1500, 3160];

  return (
    <Document>
      <Page size="A4" style={[s.page, { paddingTop: 12, paddingBottom: 22, paddingHorizontal: 28 }]}>
        <WM />
        <FormHeader
          code="BE-FM-EQ-CARD"
          isoRef="სსტ ISO/IEC 17020 §6.2 (BE-PR-13)"
          title="აღჭურვილობის სარეგისტრაციო ბარათი"
          subtitle="Equipment Registration & Calibration Card"
        />

        {/* A. ა-ბ. საიდ. */}
        <Text style={s.secH}>A. აღჭურვილობის საიდენტიფიკაციო მონაცემები</Text>
        <FieldRow2
          label1="სარეგისტრაციო №:"  value1={equipId}
          label2="სტატუსი:"      value2={status}
        />
        <FieldRow label="დასახელება:" value={name} />
        <FieldRow2
          label1="მოდელი:"   value1={model}
          label2="სერიული №:" value2={serialNum}
        />
        <FieldRow2
          label1="მწარმოებელი:"  value1={manufacturer}
          label2="ქვეყანა:"      value2={country}
        />
        <FieldRow2
          label1="შეძენის თარიღი:"  value1={purchaseDate}
          label2="მდებარეობა:"       value2={location}
        />
        <FieldRow label="სიზუსტე:" value={accuracy} />

        {/* B. კ-ბ. ი-ა */}
        <Text style={s.secH}>B. კალიბრაციის ინფორმაცია</Text>
        <FieldRow label="კალიბრაციის ლაბორატორია / ორგანო:"    value={calibCenter} />
        <FieldRow2
          label1="ბოლო კალიბრაცია:"   value1={lastCalibDate}
          label2="შემდეგი კალიბრაცია:"  value2={nextCalibDate}
        />
        <FieldRow2
          label1="ინტერვალი (თვე):"  value1={calibInterval}
          label2="სერტიფიკატის №:"       value2={certNum}
        />
        <YesNoRow label="კალიბრაცია ვარგისია:" yesNo={calibResult} />

        {/* C. კ-ბ. ისტ. ცხ. */}
        <Text style={s.secH}>C. კალიბრაციის ისტორია</Text>
        <View style={s.tBorder}>
          <View style={s.tHeader}>
            {['თარიღი', 'ორგანო', 'სერტიფიკატის №', 'შედეგი', 'ვარგისია', 'ხელმოწერა'].map((h, i) => (
              <View key={i} style={[s.tHead, { width: calibHistCols[i] }]}>
                <Text>{h}</Text>
              </View>
            ))}
          </View>
          {[...Array(Math.max(5, calibHistRows.length))].map((_, i) => {
            const r = calibHistRows[i] || {};
            return (
              <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
                {calibHistCols.map((w, j) => (
                  <View key={j} style={[s.tCell, { width: w, minHeight: 18 }]}>
                    <Text style={{ fontSize: 7.5 }}>{r['c' + j] || ''}</Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>

        {/* D. გ-ბ. ჩ. */}
        <Text style={s.secH}>D. გამოყენების ჩანაწერები</Text>
        <View style={s.tBorder}>
          <View style={s.tHeader}>
            {['თარიღი', 'BE-CASE', 'ინსპექტორი', 'მაჩვენებელი', 'შენიშვნა'].map((h, i) => (
              <View key={i} style={[s.tHead, { width: usageHistCols[i] }]}>
                <Text>{h}</Text>
              </View>
            ))}
          </View>
          {[...Array(Math.max(5, usageRows.length))].map((_, i) => {
            const r = usageRows[i] || {};
            return (
              <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
                {usageHistCols.map((w, j) => (
                  <View key={j} style={[s.tCell, { width: w, minHeight: 18 }]}>
                    <Text style={{ fontSize: 7.5 }}>{r['c' + j] || ''}</Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>

        <SigBlock2 left="ხარისხის მენეჯერი" right="დირექტორი" sigs={sigs} />
        <FormFooter code="BE-FM-EQ-CARD v1.0 | 2026 | ISO §6.2 | შენახვა: 10 წელი" />
      </Page>
    </Document>
  );
};

export default FM34_EquipmentCardPdf;
