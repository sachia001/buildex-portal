// GenericFormPdf.js — data-driven renderer for BE-FM-* forms (BE-PR workflow set).
// ცარიელიც და შევსებულიც: `data` prop-ით (keyed r{si}_{ri}[a|b]) ხატავს მნიშვნელობებს.
import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, SigBlock3 } from './FormBase';

const area = (minHeight = 40) => ({ borderWidth: 0.5, borderColor: '#000', padding: 4, marginBottom: 5, minHeight });
const noteStyle = { fontSize: 8.5, marginBottom: 5, textAlign: 'justify', lineHeight: 1.45 };
const valStyle = { fontSize: 8.5 };

const FieldRowG = ({ label, value }) => (
  <View style={s.fRow}>
    <Text style={s.fLabel}>{label}</Text>
    <View style={[s.uline, { flex: 1 }]}><Text style={valStyle}>{value || ''}</Text></View>
  </View>
);

const Field2RowG = ({ l1, v1, l2, v2 }) => (
  <View style={[s.fRow, { gap: 12 }]}>
    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end' }}>
      <Text style={s.fLabel}>{l1}</Text>
      <View style={s.uline}><Text style={valStyle}>{v1 || ''}</Text></View>
    </View>
    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end' }}>
      <Text style={s.fLabel}>{l2}</Text>
      <View style={s.uline}><Text style={valStyle}>{v2 || ''}</Text></View>
    </View>
  </View>
);

const AreaRowG = ({ label, value, minHeight }) => (
  <View>
    <Text style={[s.fLabel, { marginBottom: 2 }]}>{label}</Text>
    <View style={area(minHeight)}><Text style={valStyle}>{value || ''}</Text></View>
  </View>
);

const Box = ({ on }) => (
  <View style={{ width: 10, height: 10, borderWidth: 0.5, borderColor: '#333', marginRight: 3, alignItems: 'center', justifyContent: 'center' }}>
    {on ? <Text style={{ fontSize: 8, lineHeight: 1 }}>✓</Text> : null}
  </View>
);

// value: 'yes' | 'no' | 'na'
const YesNoRowG = ({ label, value }) => (
  <View style={[s.fRow, { alignItems: 'center' }]}>
    <Text style={[s.fLabel, { flex: 1 }]}>{label}</Text>
    {[['კი', 'yes'], ['არა', 'no'], ['არ ეხება', 'na']].map(([t, v]) => (
      <View key={v} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 6 }}>
        <Box on={value === v} />
        <Text style={{ fontSize: 8 }}>{t}</Text>
      </View>
    ))}
  </View>
);

const CheckRowG = ({ label, value }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
    <Box on={value === 'yes' || value === true} />
    <Text style={{ fontSize: 8.5 }}>{label}</Text>
  </View>
);

const BulletRowG = ({ text }) => (
  <View style={{ flexDirection: 'row', marginBottom: 2, marginLeft: 6 }}>
    <Text style={{ fontSize: 8.5, marginRight: 4 }}>•</Text>
    <Text style={{ fontSize: 8.5, flex: 1 }}>{text}</Text>
  </View>
);

const TableG = ({ cols = [], widths = [], rows = [], dataRows, empty = 3, minH = 16 }) => {
  const w = (ci) => widths[ci] || `${Math.floor(100 / Math.max(cols.length, 1))}%`;
  const body = (dataRows && dataRows.length)
    ? dataRows.map((o) => cols.map((_, ci) => (o['c' + ci] != null ? o['c' + ci] : '')))
    : rows;
  const dataEls = body.map((r, ri) => (
    <View key={`r${ri}`} style={ri % 2 === 0 ? s.tRow : s.tRowAlt}>
      {cols.map((_, ci) => (
        <View key={ci} style={[s.tCell, { width: w(ci), minHeight: minH }]}>
          <Text>{String(r[ci] == null ? '' : r[ci])}</Text>
        </View>
      ))}
    </View>
  ));
  const emptyEls = [];
  const need = (dataRows && dataRows.length) ? 0 : empty;
  for (let e = 0; e < need; e++) {
    emptyEls.push(
      <View key={`e${e}`} style={(body.length + e) % 2 === 0 ? s.tRow : s.tRowAlt}>
        {cols.map((_, ci) => <View key={ci} style={[s.tCell, { width: w(ci), minHeight: minH }]}><Text> </Text></View>)}
      </View>
    );
  }
  return (
    <View style={[s.tBorder, { marginTop: 2 }]}>
      <View style={s.tHeader}>
        {cols.map((c, ci) => <View key={ci} style={[s.tHead, { width: w(ci) }]}><Text>{c}</Text></View>)}
      </View>
      {dataEls}{emptyEls}
    </View>
  );
};

const renderRow = (r, si, ri, data) => {
  const key = `${si}-${ri}`;
  const id = `r${si}_${ri}`;
  if (typeof r === 'string') return <Text key={key} style={noteStyle}>{r}</Text>;
  const [type, a, b] = r;
  switch (type) {
    case 'field':   return <FieldRowG  key={key} label={a} value={data[id]} />;
    case 'field2':  return <Field2RowG key={key} l1={a} v1={data[id + 'a']} l2={b} v2={data[id + 'b']} />;
    case 'area':    return <AreaRowG   key={key} label={a} minHeight={b || 40} value={data[id]} />;
    case 'yesno':   return <YesNoRowG  key={key} label={a} value={data[id]} />;
    case 'check':   return <CheckRowG  key={key} label={a} value={data[id]} />;
    case 'bullet':  return <BulletRowG key={key} text={a} />;
    case 'note':    return <Text key={key} style={noteStyle}>{a}</Text>;
    case 'table':   return <TableG key={key} {...a} dataRows={data[id]} />;
    default:        return null;
  }
};

const GenericFormPdf = ({ form, data = {} }) => {
  if (!form) return null;
  const {
    code, title, subtitle, isoRef = 'სსტ ISO/IEC 17020:2012',
    signers = ['შემავსებელი', 'შემოწმებული', 'დამტკიცებული'],
    sections = [], retention = '5 წელი',
  } = form;
  const sigs = data.sigs || [];

  return (
    <Document>
      <Page size="A4" style={[s.page, { paddingTop: 16, paddingBottom: 28, paddingHorizontal: 30 }]}>
        <WM />
        <FormHeader code={code} isoRef={isoRef} title={title} subtitle={subtitle} />

        {sections.map((sec, si) => (
          <View key={si}>
            {sec.h ? <Text style={s.secH}>{sec.h}</Text> : null}
            {(sec.rows || []).map((r, ri) => renderRow(r, si, ri, data))}
          </View>
        ))}

        {signers && signers.length ? <SigBlock3 labels={signers} sigs={sigs} /> : null}

        <Text style={{ fontSize: 6.5, color: '#888', textAlign: 'center', marginTop: 8 }}>
          {`${code}  |  ვერსია 1.0  |  2026  |  ${isoRef}  |  შენახვის ვადა: ${retention}`}
        </Text>
        <FormFooter code={`${code} v1.0 | 2026 | ${isoRef}`} />
      </Page>
    </Document>
  );
};

export default GenericFormPdf;
