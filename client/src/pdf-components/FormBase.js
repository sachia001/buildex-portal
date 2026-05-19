// FormBase.js — Common styles and components for all FM-XX forms
import React from 'react';
import { Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf';

Font.register({ family: 'BPG Arial', src: fontPath });

export const s = StyleSheet.create({
  page:       { fontFamily: 'BPG Arial', paddingTop: 30, paddingBottom: 45, paddingHorizontal: 38, fontSize: 9.5, lineHeight: 1.45 },
  wm:         { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
  wmImg:      { width: 320, opacity: 0.06 },
  // Header
  header:     { alignItems: 'center', marginBottom: 6 },
  logo:       { height: 50, marginBottom: 3 },
  co:         { fontSize: 12, fontWeight: 'bold', color: '#003366', textAlign: 'center' },
  coSub:      { fontSize: 7.5, color: '#555', textAlign: 'center', marginTop: 1 },
  metaBar:    { backgroundColor: '#003366', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 3, marginVertical: 6 },
  metaTxt:    { color: '#fff', fontSize: 7.5 },
  divider:    { borderTopWidth: 1, borderTopColor: '#003366', marginBottom: 8 },
  // Title
  title:      { fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginBottom: 2, color: '#003366' },
  code:       { fontSize: 8, textAlign: 'center', color: '#777', marginBottom: 10 },
  // Section heading
  secH:       { fontSize: 9.5, fontWeight: 'bold', backgroundColor: '#e8f0f7', paddingHorizontal: 6, paddingVertical: 3, color: '#003366', marginTop: 10, marginBottom: 5 },
  // Field row
  fRow:       { flexDirection: 'row', marginBottom: 6, alignItems: 'flex-end' },
  fLabel:     { marginRight: 4, flexShrink: 0, fontWeight: 'bold', fontSize: 9 },
  uline:      { borderBottomWidth: 0.5, borderBottomColor: '#000', flexGrow: 1, minHeight: 14, paddingBottom: 1 },
  // Text area mock
  textarea:   { borderWidth: 0.5, borderColor: '#000', minHeight: 40, padding: 4, marginBottom: 6, fontSize: 9 },
  // Table
  tHeader:    { flexDirection: 'row', backgroundColor: '#003366' },
  tRow:       { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ccc' },
  tRowAlt:    { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ccc', backgroundColor: '#f5f8fc' },
  tCell:      { padding: 4, fontSize: 8.5, borderRightWidth: 0.5, borderRightColor: '#ccc', justifyContent: 'center' },
  tHead:      { padding: 4, fontSize: 8.5, color: '#fff', borderRightWidth: 0.5, borderRightColor: 'rgba(255,255,255,0.3)', fontWeight: 'bold', justifyContent: 'center' },
  tBorder:    { borderWidth: 0.5, borderColor: '#ccc', marginBottom: 8 },
  // Checkbox
  chkRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  box:        { width: 11, height: 11, borderWidth: 0.5, borderColor: '#333', marginRight: 6, flexShrink: 0 },
  yn:         { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 6 },
  ynLabel:    { fontSize: 8.5, marginRight: 3 },
  // Signature
  sigRow:     { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22 },
  sigBlock:   { width: '30%' },
  sigTitle:   { fontSize: 9, fontWeight: 'bold', marginBottom: 2 },
  sigLine:    { borderTopWidth: 0.5, borderTopColor: '#000', marginTop: 28, paddingTop: 2, textAlign: 'center', fontSize: 7.5 },
  sig2Row:    { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22 },
  sig2Block:  { width: '46%' },
  sig3Row:    { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22 },
  sig3Block:  { width: '30%' },
  // Footer
  footer:     { position: 'absolute', bottom: 18, left: 38, right: 38, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: '#ccc', paddingTop: 3 },
  footerTxt:  { fontSize: 7, color: '#888' },
});

// Watermark
export const WM = () => (
  <View style={s.wm} fixed>
    <Image src="/logo.png" style={s.wmImg} />
  </View>
);

// Standard form header
export const FormHeader = ({ code, isoRef, title, subtitle }) => (
  <>
    <View style={s.header}>
      <Image src="/logo.png" style={s.logo} />
      <Text style={s.co}>შპს „ბილდექს ექსპერტიზა"</Text>
      <Text style={s.coSub}>ს/კ 431188010  |  ქ. თელავი, ლიონიძის ქ. 22  |  buildexpertiza@gmail.com</Text>
    </View>
    <View style={s.metaBar}>
      <Text style={s.metaTxt}>{code}  |  ვერსია 2.0  |  28.04.2026  |  სტატუსი: მოქმედი</Text>
      <Text style={s.metaTxt}>{isoRef}  |  A-ტიპი  |  GAC</Text>
    </View>
    <Text style={s.title}>{title}</Text>
    {subtitle && <Text style={s.code}>{subtitle}</Text>}
  </>
);

// Standard 3-column signature block
export const SigBlock3 = ({ labels = ['შემავსებელი', 'შემოწმებული', 'დამტკიცებული'] }) => (
  <View style={s.sigRow}>
    {labels.map(lbl => (
      <View key={lbl} style={s.sigBlock}>
        <Text style={s.sigTitle}>{lbl}:</Text>
        <View style={s.sigLine}><Text>ხელმ. / თარიღი</Text></View>
      </View>
    ))}
  </View>
);

// 2-column signature block
export const SigBlock2 = ({ left, right }) => (
  <View style={s.sig2Row}>
    <View style={s.sig2Block}>
      <Text style={s.sigTitle}>{left}:</Text>
      <View style={s.sigLine}><Text>ხელმ. / თარიღი</Text></View>
    </View>
    <View style={s.sig2Block}>
      <Text style={s.sigTitle}>{right}:</Text>
      <View style={s.sigLine}><Text>ხელმ. / თარიღი</Text></View>
    </View>
  </View>
);

// Footer
export const FormFooter = ({ code }) => (
  <View style={s.footer} fixed>
    <Text style={s.footerTxt}>კონფიდენციალური — მხოლოდ შიდა გამოყენებისთვის</Text>
    <Text style={s.footerTxt}>{code}</Text>
    <Text style={s.footerTxt} render={({ pageNumber, totalPages }) => `გვ. ${pageNumber} / ${totalPages}`} />
  </View>
);

// Checkbox row
export const ChkRow = ({ label }) => (
  <View style={s.chkRow}>
    <View style={s.box} />
    <Text style={{ fontSize: 9 }}>{label}</Text>
  </View>
);

// Field row: Label ____underline____
export const FieldRow = ({ label, flex = 1 }) => (
  <View style={s.fRow}>
    <Text style={s.fLabel}>{label}</Text>
    <View style={[s.uline, { flex }]} />
  </View>
);

// Two fields side by side
export const FieldRow2 = ({ label1, label2 }) => (
  <View style={[s.fRow, { gap: 12 }]}>
    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end' }}>
      <Text style={s.fLabel}>{label1}</Text>
      <View style={s.uline} />
    </View>
    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end' }}>
      <Text style={s.fLabel}>{label2}</Text>
      <View style={s.uline} />
    </View>
  </View>
);

// Yes/No row
export const YesNoRow = ({ label }) => (
  <View style={[s.fRow, { alignItems: 'center' }]}>
    <Text style={[s.fLabel, { flex: 1 }]}>{label}</Text>
    <View style={s.yn}>
      <View style={s.box} /><Text style={s.ynLabel}>კი</Text>
      <View style={s.box} /><Text style={s.ynLabel}>არა</Text>
    </View>
  </View>
);

// Empty rows for tables
export const EmptyRows = ({ count = 5, cols }) => (
  <>
    {[...Array(count)].map((_, i) => (
      <View key={i} style={i % 2 === 0 ? s.tRow : s.tRowAlt}>
        {cols.map((w, j) => (
          <View key={j} style={[s.tCell, { width: w, minHeight: 20 }]} />
        ))}
      </View>
    ))}
  </>
);
