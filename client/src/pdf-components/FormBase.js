// FormBase.js — Common styles and components for all FM-XX forms
import React from 'react';
import { Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf';

Font.register({ family: 'BPG Arial', src: fontPath });

export const s = StyleSheet.create({
  // ── Page ──────────────────────────────────────────────────
  page:       { fontFamily: 'BPG Arial', paddingTop: 18, paddingBottom: 28, paddingHorizontal: 34, fontSize: 9, lineHeight: 1.25 },
  wm:         { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
  wmImg:      { width: 300, opacity: 0.06 },
  // ── Header ────────────────────────────────────────────────
  header:     { alignItems: 'center', marginBottom: 3 },
  logo:       { height: 38, marginBottom: 2 },
  co:         { fontSize: 11, fontWeight: 'bold', color: '#003366', textAlign: 'center' },
  coSub:      { fontSize: 7, color: '#555', textAlign: 'center', marginTop: 1 },
  metaBar:    { backgroundColor: '#003366', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 7, paddingVertical: 2, marginTop: 3, marginBottom: 4 },
  metaTxt:    { color: '#fff', fontSize: 7 },
  divider:    { borderTopWidth: 1, borderTopColor: '#003366', marginBottom: 5 },
  title:      { fontSize: 11, fontWeight: 'bold', textAlign: 'center', marginBottom: 1, color: '#003366' },
  code:       { fontSize: 7.5, textAlign: 'center', color: '#777', marginBottom: 6 },
  // ── Section heading ───────────────────────────────────────
  secH:       { fontSize: 8.5, fontWeight: 'bold', backgroundColor: '#e8f0f7', paddingHorizontal: 5, paddingVertical: 2, color: '#003366', marginTop: 5, marginBottom: 3 },
  // ── Field row ─────────────────────────────────────────────
  fRow:       { flexDirection: 'row', marginBottom: 3, alignItems: 'flex-end' },
  fLabel:     { marginRight: 3, flexShrink: 0, fontWeight: 'bold', fontSize: 8 },
  uline:      { borderBottomWidth: 0.5, borderBottomColor: '#000', flexGrow: 1, minHeight: 11, paddingBottom: 1, paddingLeft: 2 },
  // ── Textarea ──────────────────────────────────────────────
  textarea:   { borderWidth: 0.5, borderColor: '#000', minHeight: 24, padding: 3, marginBottom: 4, fontSize: 8.5 },
  // ── Table ─────────────────────────────────────────────────
  tHeader:    { flexDirection: 'row', backgroundColor: '#003366' },
  tRow:       { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ccc' },
  tRowAlt:    { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ccc', backgroundColor: '#f5f8fc' },
  tCell:      { padding: 3, fontSize: 8, borderRightWidth: 0.5, borderRightColor: '#ccc', justifyContent: 'center' },
  tHead:      { padding: 3, fontSize: 7.5, color: '#fff', borderRightWidth: 0.5, borderRightColor: 'rgba(255,255,255,0.3)', fontWeight: 'bold', justifyContent: 'center' },
  tBorder:    { borderWidth: 0.5, borderColor: '#ccc', marginBottom: 4 },
  // ── Checkbox ──────────────────────────────────────────────
  chkRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  box:        { width: 10, height: 10, borderWidth: 0.5, borderColor: '#333', marginRight: 5, flexShrink: 0 },
  boxChecked: { width: 10, height: 10, borderWidth: 0.5, borderColor: '#003366', marginRight: 5, flexShrink: 0, backgroundColor: '#003366', alignItems: 'center', justifyContent: 'center' },
  yn:         { flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 5 },
  ynLabel:    { fontSize: 8, marginRight: 2 },
  // ── Signature ─────────────────────────────────────────────
  sigRow:     { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  sigBlock:   { width: '30%' },
  sigTitle:   { fontSize: 8.5, fontWeight: 'bold', marginBottom: 1 },
  sigLine:    { borderTopWidth: 0.5, borderTopColor: '#000', marginTop: 20, paddingTop: 2, textAlign: 'center', fontSize: 7 },
  sigImg:     { width: 82, height: 28, objectFit: 'contain', marginBottom: -3 },
  sig2Row:    { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  sig2Block:  { width: '46%' },
  // ── Footer ────────────────────────────────────────────────
  footer:     { position: 'absolute', bottom: 14, left: 34, right: 34, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: '#ccc', paddingTop: 2 },
  footerTxt:  { fontSize: 6.5, color: '#888' },
});

// ── Watermark ──────────────────────────────────────────────
export const WM = () => (
  <View style={s.wm} fixed>
    <Image src="/logo.png" style={s.wmImg} />
  </View>
);

// ── Form header ────────────────────────────────────────────
export const FormHeader = ({ code, isoRef, title, subtitle }) => (
  <>
    <View style={s.header}>
      <Image src="/logo.png" style={s.logo} />
      <Text style={s.co}>შპს „ბილდექს ექსპერტიზა"</Text>
      <Text style={s.coSub}>ს/კ 431188010  |  ქ. თელავი, ლიონიძის ქ. 22  |  info@buildexpertise.com</Text>
    </View>
    <View style={s.metaBar}>
      <Text style={s.metaTxt}>{code}  |  ვ. 2.0  |  28.04.2026  |  მოქმედი</Text>
      <Text style={s.metaTxt}>{isoRef}  |  A-ტ.  |  GAC</Text>
    </View>
    <Text style={s.title}>{title}</Text>
    {subtitle && <Text style={s.code}>{subtitle}</Text>}
  </>
);

// ── Signature block helpers ────────────────────────────────
const OneSigBlock = ({ label, sig }) => (
  <View style={s.sigBlock}>
    <Text style={s.sigTitle}>{label}:</Text>
    {sig?.name ? <Text style={{ fontSize: 7.5, marginBottom: 1 }}>{sig.name}</Text> : null}
    {sig?.dataURL
      ? <Image src={sig.dataURL} style={s.sigImg} />
      : <View style={{ height: 28 }} />
    }
    <View style={{ borderTopWidth: 0.5, borderTopColor: '#000', paddingTop: 2 }}>
      <Text style={{ fontSize: 7, textAlign: 'center' }}>
        {sig?.date || 'ხელმოწერა / თარიღი'}
      </Text>
    </View>
  </View>
);

// 3-column signature block
export const SigBlock3 = ({ labels = ['შემავსებელი', 'შემოწმებული', 'დამტკიცებული'], sigs = [] }) => (
  <View style={s.sigRow}>
    {labels.map((lbl, i) => <OneSigBlock key={lbl} label={lbl} sig={sigs[i]} />)}
  </View>
);

// 2-column signature block
export const SigBlock2 = ({ left, right, sigs = [] }) => (
  <View style={s.sig2Row}>
    <View style={s.sig2Block}><OneSigBlock label={left} sig={sigs[0]} /></View>
    <View style={s.sig2Block}><OneSigBlock label={right} sig={sigs[1]} /></View>
  </View>
);

// ── Footer ─────────────────────────────────────────────────
export const FormFooter = ({ code }) => (
  <View style={s.footer} fixed>
    <Text style={s.footerTxt}>კონფ. — შიდა გამოყ.</Text>
    <Text style={s.footerTxt}>{code}</Text>
    <Text style={s.footerTxt} render={({ pageNumber, totalPages }) => `გვ. ${pageNumber}/${totalPages}`} />
  </View>
);

// ── Field helpers (data-aware) ─────────────────────────────
export const FieldRow = ({ label, value, flex = 1 }) => (
  <View style={s.fRow}>
    <Text style={s.fLabel}>{label}</Text>
    <View style={[s.uline, { flex }]}>
      {value ? <Text style={{ fontSize: 8.5 }}>{value}</Text> : null}
    </View>
  </View>
);

export const FieldRow2 = ({ label1, value1, label2, value2 }) => (
  <View style={[s.fRow, { gap: 10 }]}>
    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end' }}>
      <Text style={s.fLabel}>{label1}</Text>
      <View style={s.uline}>
        {value1 ? <Text style={{ fontSize: 8.5 }}>{value1}</Text> : null}
      </View>
    </View>
    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end' }}>
      <Text style={s.fLabel}>{label2}</Text>
      <View style={s.uline}>
        {value2 ? <Text style={{ fontSize: 8.5 }}>{value2}</Text> : null}
      </View>
    </View>
  </View>
);

export const YesNoRow = ({ label, yesNo }) => (
  <View style={[s.fRow, { alignItems: 'center' }]}>
    <Text style={[s.fLabel, { flex: 1 }]}>{label}</Text>
    <View style={s.yn}>
      <View style={yesNo === 'yes' ? s.boxChecked : s.box}>
        {yesNo === 'yes' && <Text style={{ color: '#fff', fontSize: 6.5, fontWeight: 'bold' }}>✓</Text>}
      </View>
      <Text style={s.ynLabel}>კი</Text>
      <View style={yesNo === 'no' ? s.boxChecked : s.box}>
        {yesNo === 'no' && <Text style={{ color: '#fff', fontSize: 6.5, fontWeight: 'bold' }}>✓</Text>}
      </View>
      <Text style={s.ynLabel}>არა</Text>
    </View>
  </View>
);

export const ChkRow = ({ label, checked }) => (
  <View style={s.chkRow}>
    <View style={checked ? s.boxChecked : s.box}>
      {checked && <Text style={{ color: '#fff', fontSize: 6.5, fontWeight: 'bold' }}>✓</Text>}
    </View>
    <Text style={{ fontSize: 8.5 }}>{label}</Text>
  </View>
);

export const TextArea = ({ value, placeholder, minHeight = 24 }) => (
  <View style={[s.textarea, { minHeight }]}>
    {value
      ? <Text style={{ fontSize: 8.5, lineHeight: 1.4 }}>{value}</Text>
      : placeholder
        ? <Text style={{ fontSize: 8, color: '#bbb' }}>{placeholder}</Text>
        : null
    }
  </View>
);

// Empty table rows helper
export const EmptyRows = ({ count = 5, cols, minH = 18 }) => (
  <>
    {[...Array(count)].map((_, i) => (
      <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
        {cols.map((w, j) => (
          <View key={j} style={[s.tCell, { width: w, minHeight: minH }]} />
        ))}
      </View>
    ))}
  </>
);
