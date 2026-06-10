// GenericFormPdf.js — data-driven renderer for BE-FM-* forms (BE-PR workflow set)
// Consumes a form definition object (see newFormDefinitions.json) and renders
// a layout identical to the desktop "ფორმები" generator.
import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { s, WM, FormHeader, FormFooter, SigBlock3 } from './FormBase';

// ── local styles supplementing FormBase ────────────────────────
const area = (minHeight = 40) => ({ borderWidth: 0.5, borderColor: '#000', padding: 4, marginBottom: 5, minHeight });
const noteStyle = { fontSize: 8.5, marginBottom: 5, textAlign: 'justify', lineHeight: 1.45 };

// ── row renderers ──────────────────────────────────────────────
const FieldRowG = ({ label }) => (
  <View style={s.fRow}>
    <Text style={s.fLabel}>{label}</Text>
    <View style={[s.uline, { flex: 1 }]} />
  </View>
);

const Field2RowG = ({ l1, l2 }) => (
  <View style={[s.fRow, { gap: 12 }]}>
    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end' }}>
      <Text style={s.fLabel}>{l1}</Text>
      <View style={s.uline} />
    </View>
    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end' }}>
      <Text style={s.fLabel}>{l2}</Text>
      <View style={s.uline} />
    </View>
  </View>
);

const AreaRowG = ({ label, minHeight }) => (
  <View>
    <Text style={[s.fLabel, { marginBottom: 2 }]}>{label}</Text>
    <View style={area(minHeight)} />
  </View>
);

const YesNoRowG = ({ label }) => (
  <View style={[s.fRow, { alignItems: 'center' }]}>
    <Text style={[s.fLabel, { flex: 1 }]}>{label}</Text>
    {['კი', 'არა', 'არ ეხება'].map((t) => (
      <View key={t} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 6 }}>
        <View style={{ width: 10, height: 10, borderWidth: 0.5, borderColor: '#333', marginRight: 3 }} />
        <Text style={{ fontSize: 8 }}>{t}</Text>
      </View>
    ))}
  </View>
);

const CheckRowG = ({ label }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
    <View style={{ width: 10, height: 10, borderWidth: 0.5, borderColor: '#333', marginRight: 4 }} />
    <Text style={{ fontSize: 8.5 }}>{label}</Text>
  </View>
);

const BulletRowG = ({ text }) => (
  <View style={{ flexDirection: 'row', marginBottom: 2, marginLeft: 6 }}>
    <Text style={{ fontSize: 8.5, marginRight: 4 }}>•</Text>
    <Text style={{ fontSize: 8.5, flex: 1 }}>{text}</Text>
  </View>
);

const TableG = ({ cols, widths, rows = [], empty = 0, minH = 16 }) => {
  const dataRows = rows.map((r, ri) => (
    <View key={`r${ri}`} style={ri % 2 === 0 ? s.tRow : s.tRowAlt}>
      {r.map((cell, ci) => (
        <View key={ci} style={[s.tCell, { width: widths[ci], minHeight: minH }]}>
          <Text>{String(cell == null ? '' : cell)}</Text>
        </View>
      ))}
    </View>
  ));
  const emptyRows = [];
  for (let e = 0; e < empty; e++) {
    emptyRows.push(
      <View key={`e${e}`} style={(rows.length + e) % 2 === 0 ? s.tRow : s.tRowAlt}>
        {widths.map((w, ci) => (
          <View key={ci} style={[s.tCell, { width: w, minHeight: minH }]} />
        ))}
      </View>
    );
  }
  return (
    <View style={s.tBorder}>
      <View style={s.tHeader}>
        {cols.map((c, i) => (
          <View key={i} style={[s.tHead, { width: widths[i] }]}><Text>{c}</Text></View>
        ))}
      </View>
      {dataRows}
      {emptyRows}
    </View>
  );
};

const renderRow = (r, idx) => {
  if (typeof r === 'string') return <Text key={idx} style={noteStyle}>{r}</Text>;
  const [type, a, b] = r;
  switch (type) {
    case 'field':   return <FieldRowG  key={idx} label={a} />;
    case 'field2':  return <Field2RowG key={idx} l1={a} l2={b} />;
    case 'area':    return <AreaRowG   key={idx} label={a} minHeight={b || 40} />;
    case 'yesno':   return <YesNoRowG  key={idx} label={a} />;
    case 'check':   return <CheckRowG  key={idx} label={a} />;
    case 'bullet':  return <BulletRowG key={idx} text={a} />;
    case 'note':    return <Text key={idx} style={noteStyle}>{a}</Text>;
    case 'table':   return <TableG key={idx} {...a} />;
    default:        return null;
  }
};

const GenericFormPdf = ({ form }) => {
  if (!form) return null;
  const {
    code, title, subtitle, isoRef = 'სსტ ISO/IEC 17020:2012',
    signers = ['შემავსებელი', 'შემოწმებული', 'დამტკიცებული'],
    sections = [], retention = '5 წელი',
  } = form;

  return (
    <Document>
      <Page size="A4" style={[s.page, { paddingTop: 16, paddingBottom: 28, paddingHorizontal: 30 }]}>
        <WM />
        <FormHeader code={code} isoRef={isoRef} title={title} subtitle={subtitle} />

        {sections.map((sec, si) => (
          <View key={si}>
            {sec.h ? <Text style={s.secH}>{sec.h}</Text> : null}
            {(sec.rows || []).map((r, ri) => renderRow(r, `${si}-${ri}`))}
          </View>
        ))}

        {signers && signers.length ? <SigBlock3 labels={signers} sigs={[]} /> : null}

        <Text style={{ fontSize: 6.5, color: '#888', textAlign: 'center', marginTop: 8 }}>
          {`${code}  |  ვერსია 1.0  |  2026  |  ${isoRef}  |  შენახვის ვადა: ${retention}`}
        </Text>
        <FormFooter code={`${code} v1.0 | 2026 | ${isoRef}`} />
      </Page>
    </Document>
  );
};

export default GenericFormPdf;
