import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, FieldRow, FieldRow2, YesNoRow, SigBlock3, EmptyRows } from './FormBase';

const FM34_EquipmentCardPdf = ({ data = {} }) => {
  const {
    equipId, status, name, model, serialNum, manufacturer, country,
    purchaseDate, location, measRange, accuracy,
    calibCenter, lastCalibDate, nextCalibDate, calibInterval, certNum, traceability, calibResult,
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
          label1="ს/კ. №:"  value1={equipId}
          label2="სტ.:"      value2={status}
        />
        <FieldRow label="დასახ.:" value={name} />
        <FieldRow2
          label1="მოდ.:"   value1={model}
          label2="სერ. №:" value2={serialNum}
        />
        <FieldRow2
          label1="მწარ.:"  value1={manufacturer}
          label2="ქ.:"      value2={country}
        />
        <FieldRow2
          label1="შ-ძ. თ-ღი:"  value1={purchaseDate}
          label2="მდ-ბ.:"       value2={location}
        />
        <FieldRow2
          label1="გ-ვ. დ-ი:"  value1={measRange}
          label2="ს-ე:"        value2={accuracy}
        />

        {/* B. კ-ბ. ი-ა */}
        <Text style={s.secH}>B. კალიბრაციის ინფორმაცია</Text>
        <FieldRow label="კ-ბ. ლ-ა / ო-ბ.:"    value={calibCenter} />
        <FieldRow2
          label1="ბ-ლი კ-ბ.:"   value1={lastCalibDate}
          label2="შ-მდ. კ-ბ.:"  value2={nextCalibDate}
        />
        <FieldRow2
          label1="ინ-ი (თვე):"  value1={calibInterval}
          label2="ს-ტ. №:"       value2={certNum}
        />
        <FieldRow label="ე-ბ. (ეროვ./საერ. ეტ.):" value={traceability} />
        <YesNoRow label="კ-ბ. სა-ე (ვ-ა):" yesNo={calibResult} />

        {/* C. კ-ბ. ისტ. ცხ. */}
        <Text style={s.secH}>C. კალიბრაციის ისტორია</Text>
        <View style={s.tBorder}>
          <View style={s.tHeader}>
            {['თ-ღი', 'ო-ბ.', 'ს-ტ. №', 'შ-დ.', 'ვ-ა', 'ხ.'].map((h, i) => (
              <View key={i} style={[s.tHead, { width: calibHistCols[i] }]}>
                <Text>{h}</Text>
              </View>
            ))}
          </View>
          <EmptyRows count={5} cols={calibHistCols} minH={18} />
        </View>

        {/* D. გ-ბ. ჩ. */}
        <Text style={s.secH}>D. გამოყენების ჩანაწერები</Text>
        <View style={s.tBorder}>
          <View style={s.tHeader}>
            {['თ-ღი', 'BE-CASE', 'ი-ი', 'მ-ბ.', 'შ-ბა'].map((h, i) => (
              <View key={i} style={[s.tHead, { width: usageHistCols[i] }]}>
                <Text>{h}</Text>
              </View>
            ))}
          </View>
          <EmptyRows count={5} cols={usageHistCols} minH={18} />
        </View>

        <SigBlock3 labels={['ტექნიკური მენეჯერი', 'ხარისხის მენეჯერი', 'დირექტორი']} sigs={sigs} />
        <FormFooter code="BE-FM-EQ-CARD v1.0 | 2026 | ISO §6.2 | შენახვა: 10 წელი" />
      </Page>
    </Document>
  );
};

export default FM34_EquipmentCardPdf;
