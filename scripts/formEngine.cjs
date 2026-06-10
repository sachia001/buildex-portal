/* formEngine.cjs — shared PDF rendering engine for BE-FM-* forms
 * Uses @react-pdf/renderer Node build + React.createElement (no JSX).
 */
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

// @react-pdf/renderer v4 is ESM-only — load via dynamic import.
const RPKG = path.join(__dirname, '..', 'client', 'node_modules', '@react-pdf', 'renderer', 'lib', 'react-pdf.js');
const REACT = path.join(__dirname, '..', 'client', 'node_modules', 'react');

const FONT_PATH = path.join(__dirname, '..', 'client', 'src', 'fonts', 'bpg_arial.ttf');
const LOGO_PATH = path.join(__dirname, '..', 'client', 'public', 'logo.png');
const LOGO_SRC  = fs.existsSync(LOGO_PATH)
  ? 'data:image/png;base64,' + fs.readFileSync(LOGO_PATH).toString('base64')
  : null;

// These are populated by init()
let ReactPDF, React, h, Document, Page, Text, View, Image, StyleSheet, Font, s;

async function init() {
  if (ReactPDF) return;
  ReactPDF = await import(pathToFileURL(RPKG).href);
  if (ReactPDF.default && !ReactPDF.Document) ReactPDF = ReactPDF.default;
  React = (await import(pathToFileURL(path.join(REACT, 'index.js')).href)).default
       || require(REACT);
  ({ Document, Page, Text, View, Image, StyleSheet, Font } = ReactPDF);
  h = React.createElement;
  Font.register({ family: 'BPG Arial', src: FONT_PATH });
  s = buildStyles();
}

function buildStyles() {
  return StyleSheet.create(STYLE_DEF);
}

const COMPANY      = 'შპს „ბილდექს ექსპერტიზა"';
const COMPANY_INFO = 'ს/კ 431188010  |  ქ. თელავი, ლიონიძის ქუჩა 22  |  info@buildexexpertise.com';

const STYLE_DEF = {
  page:   { fontFamily: 'BPG Arial', paddingTop: 18, paddingBottom: 30, paddingHorizontal: 32, fontSize: 9, lineHeight: 1.3 },
  wm:     { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
  wmImg:  { width: 300, opacity: 0.06 },
  header: { alignItems: 'center', marginBottom: 3 },
  logo:   { height: 40, marginBottom: 3 },
  co:     { fontSize: 12, fontWeight: 'bold', color: '#003366', textAlign: 'center' },
  coSub:  { fontSize: 7.5, color: '#555', textAlign: 'center', marginTop: 1 },
  metaBar:{ backgroundColor: '#003366', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 7, paddingVertical: 3, marginTop: 4, marginBottom: 5 },
  metaTxt:{ color: '#fff', fontSize: 7 },
  title:  { fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 1, color: '#003366' },
  code:   { fontSize: 8, textAlign: 'center', color: '#777', marginBottom: 7 },
  secH:   { fontSize: 9, fontWeight: 'bold', backgroundColor: '#e8f0f7', paddingHorizontal: 6, paddingVertical: 3, color: '#003366', marginTop: 6, marginBottom: 4 },
  fRow:   { flexDirection: 'row', marginBottom: 4, alignItems: 'flex-end' },
  fLabel: { marginRight: 4, flexShrink: 0, fontWeight: 'bold', fontSize: 8.5 },
  uline:  { borderBottomWidth: 0.5, borderBottomColor: '#000', flexGrow: 1, minHeight: 12, paddingBottom: 1, paddingLeft: 2 },
  area:   { borderWidth: 0.5, borderColor: '#000', padding: 4, marginBottom: 5 },
  note:   { fontSize: 8.5, marginBottom: 5, textAlign: 'justify', lineHeight: 1.45 },
  bullet: { flexDirection: 'row', marginBottom: 2, marginLeft: 6 },
  tHeader:{ flexDirection: 'row', backgroundColor: '#003366' },
  tRow:   { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ccc' },
  tRowAlt:{ flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ccc', backgroundColor: '#f5f8fc' },
  tCell:  { padding: 3, fontSize: 7.5, borderRightWidth: 0.5, borderRightColor: '#ccc', justifyContent: 'center' },
  tHead:  { padding: 3, fontSize: 7.5, color: '#fff', borderRightWidth: 0.5, borderRightColor: 'rgba(255,255,255,0.3)', fontWeight: 'bold', justifyContent: 'center' },
  tBorder:{ borderWidth: 0.5, borderColor: '#ccc', marginBottom: 5 },
  box:    { width: 10, height: 10, borderWidth: 0.5, borderColor: '#333', marginRight: 4 },
  yn:     { flexDirection: 'row', alignItems: 'center', marginLeft: 6 },
  ynBox:  { width: 10, height: 10, borderWidth: 0.5, borderColor: '#333', marginRight: 3 },
  sigRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  sigBlk: { width: '30%' },
  sigTtl: { fontSize: 8.5, fontWeight: 'bold', marginBottom: 22 },
  sigLn:  { borderTopWidth: 0.5, borderTopColor: '#000', paddingTop: 2, fontSize: 7, textAlign: 'center' },
  footer: { position: 'absolute', bottom: 14, left: 32, right: 32, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: '#ccc', paddingTop: 2 },
  footTxt:{ fontSize: 6.5, color: '#888' },
};

// ── header / footer ───────────────────────────────────────────
const Header = (code, isoRef, title, subtitle) => [
  h(View, { style: s.header, key: 'h' }, [
    LOGO_SRC ? h(Image, { src: LOGO_SRC, style: s.logo, key: 'l' }) : null,
    h(Text, { style: s.co, key: 'c' }, COMPANY),
    h(Text, { style: s.coSub, key: 'i' }, COMPANY_INFO),
  ].filter(Boolean)),
  h(View, { style: s.metaBar, key: 'm' }, [
    h(Text, { style: s.metaTxt, key: 'a' }, `${code}  |  ვერსია 1.0  |  2026  |  მოქმედი`),
    h(Text, { style: s.metaTxt, key: 'b' }, `${isoRef}  |  A-ტიპი  |  GAC`),
  ]),
  h(Text, { style: s.title, key: 't' }, title),
  h(Text, { style: s.code, key: 'sc' }, subtitle ? `${code} — ${subtitle}` : code),
];

const Footer = (code) =>
  h(View, { style: s.footer, fixed: true, key: 'ft' }, [
    h(Text, { style: s.footTxt, key: 'a' }, 'კონფიდენციალური — შიდა გამოყენებისთვის'),
    h(Text, { style: s.footTxt, key: 'b' }, code),
    h(Text, { style: s.footTxt, key: 'c', render: ({ pageNumber, totalPages }) => `გვერდი ${pageNumber} / ${totalPages}` }),
  ]);

// ── row builders ──────────────────────────────────────────────
let _k = 0;
const key = () => `k${_k++}`;

const fieldRow = (label, flex = 1) =>
  h(View, { style: s.fRow, key: key() }, [
    h(Text, { style: s.fLabel, key: 'l' }, label),
    h(View, { style: [s.uline, { flex }], key: 'u' }),
  ]);

const field2Row = (l1, l2) =>
  h(View, { style: [s.fRow, { gap: 12 }], key: key() }, [
    h(View, { style: { flexDirection: 'row', flex: 1, alignItems: 'flex-end' }, key: 'a' }, [
      h(Text, { style: s.fLabel, key: 'l' }, l1),
      h(View, { style: s.uline, key: 'u' }),
    ]),
    h(View, { style: { flexDirection: 'row', flex: 1, alignItems: 'flex-end' }, key: 'b' }, [
      h(Text, { style: s.fLabel, key: 'l' }, l2),
      h(View, { style: s.uline, key: 'u' }),
    ]),
  ]);

const areaRow = (label, minHeight = 40) => [
  h(Text, { style: [s.fLabel, { marginBottom: 2 }], key: key() }, label),
  h(View, { style: [s.area, { minHeight }], key: key() }),
];

const yesNoRow = (label) =>
  h(View, { style: [s.fRow, { alignItems: 'center' }], key: key() }, [
    h(Text, { style: [s.fLabel, { flex: 1 }], key: 'l' }, label),
    h(View, { style: s.yn, key: 'y' }, [
      h(View, { style: s.ynBox, key: 'yb' }),
      h(Text, { style: { fontSize: 8 }, key: 'yt' }, 'კი'),
    ]),
    h(View, { style: s.yn, key: 'n' }, [
      h(View, { style: s.ynBox, key: 'nb' }),
      h(Text, { style: { fontSize: 8 }, key: 'nt' }, 'არა'),
    ]),
    h(View, { style: s.yn, key: 'na' }, [
      h(View, { style: s.ynBox, key: 'ab' }),
      h(Text, { style: { fontSize: 8 }, key: 'at' }, 'არ ეხება'),
    ]),
  ]);

const checkRow = (label) =>
  h(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 }, key: key() }, [
    h(View, { style: s.box, key: 'b' }),
    h(Text, { style: { fontSize: 8.5 }, key: 't' }, label),
  ]);

const noteRow = (txt) => h(Text, { style: s.note, key: key() }, txt);

const bulletRow = (txt) =>
  h(View, { style: s.bullet, key: key() }, [
    h(Text, { style: { fontSize: 8.5, marginRight: 4 }, key: 'd' }, '•'),
    h(Text, { style: { fontSize: 8.5, flex: 1 }, key: 't' }, txt),
  ]);

const tableRow = ({ cols, widths, rows = [], empty = 0, minH = 16 }) => {
  const head = h(View, { style: s.tHeader, key: 'th' },
    cols.map((c, i) => h(View, { style: [s.tHead, { width: widths[i] }], key: i }, h(Text, {}, c))));
  const dataRows = rows.map((r, ri) =>
    h(View, { style: ri % 2 === 0 ? s.tRow : s.tRowAlt, key: `r${ri}` },
      r.map((cell, ci) => h(View, { style: [s.tCell, { width: widths[ci], minHeight: minH }], key: ci },
        h(Text, {}, String(cell == null ? '' : cell))))));
  const emptyRows = [];
  for (let e = 0; e < empty; e++) {
    emptyRows.push(h(View, { style: (rows.length + e) % 2 === 0 ? s.tRow : s.tRowAlt, key: `e${e}` },
      widths.map((w, ci) => h(View, { style: [s.tCell, { width: w, minHeight: minH }], key: ci }))));
  }
  return h(View, { style: s.tBorder, key: key() }, [head, ...dataRows, ...emptyRows]);
};

const sigBlock = (signers) =>
  h(View, { style: s.sigRow, key: key() },
    signers.map((sg, i) => h(View, { style: s.sigBlk, key: i }, [
      h(Text, { style: s.sigTtl, key: 't' }, `${sg}:`),
      h(View, { style: s.sigLn, key: 'l' }, h(Text, {}, 'ხელმოწერა / თარიღი')),
    ])));

// ── row dispatcher ────────────────────────────────────────────
function renderRow(r) {
  if (typeof r === 'string') return noteRow(r);
  const [type, ...args] = r;
  switch (type) {
    case 'field':   return fieldRow(args[0], args[1] || 1);
    case 'field2':  return field2Row(args[0], args[1]);
    case 'area':    return areaRow(args[0], args[1] || 40);
    case 'yesno':   return yesNoRow(args[0]);
    case 'check':   return checkRow(args[0]);
    case 'note':    return noteRow(args[0]);
    case 'bullet':  return bulletRow(args[0]);
    case 'table':   return tableRow(args[0]);
    default:        return noteRow(String(args[0] || ''));
  }
}

function buildSection(sec) {
  const out = [];
  if (sec.h) out.push(h(Text, { style: s.secH, key: key() }, sec.h));
  (sec.rows || []).forEach((r) => {
    const rendered = renderRow(r);
    if (Array.isArray(rendered)) rendered.forEach((x) => out.push(x));
    else out.push(rendered);
  });
  return out;
}

function buildDoc(form) {
  const { code, title, subtitle, isoRef = 'სსტ ISO/IEC 17020:2012', signers = ['შემავსებელი', 'შემოწმებული', 'დამტკიცებული'], sections = [], retention = '5 წელი' } = form;
  const body = [];
  Header(code, isoRef, title, subtitle).forEach((x) => body.push(x));
  sections.forEach((sec) => buildSection(sec).forEach((x) => body.push(x)));
  if (signers && signers.length) body.push(sigBlock(signers));
  body.push(h(Text, { style: { fontSize: 6.5, color: '#888', textAlign: 'center', marginTop: 8 }, key: key() },
    `${code}  |  ვერსია 1.0  |  2026  |  ${isoRef}  |  შენახვის ვადა: ${retention}`));
  body.push(Footer(code));

  return h(Document, {},
    h(Page, { size: 'A4', style: s.page },
      [h(View, { style: s.wm, fixed: true, key: 'wm' }, LOGO_SRC ? h(Image, { src: LOGO_SRC, style: s.wmImg }) : null), ...body]));
}

function sanitize(name) {
  return name.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim();
}

async function renderForm(form, outDir) {
  await init();
  const fileTitle = sanitize(`${form.code} — ${form.title}`);
  const outPath = path.join(outDir, `${fileTitle}.pdf`);
  await ReactPDF.renderToFile(buildDoc(form), outPath);
  return outPath;
}

module.exports = { renderForm, init };
