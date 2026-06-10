/* generateInspectionReport.cjs — BE-FM-IR blank inspection report.
 * EXACT replica of the portal's ReportCoverPdf.js rendered with empty data
 * (all filled case values cleared, including the hardcoded director name).
 * Uses the same 3-logo header (gac_logo.png + logo.png) and layout. */
const path = require('path');
const fs = require('fs');
const os = require('os');
const { pathToFileURL } = require('url');

const RPKG  = path.join(__dirname, '..', 'client', 'node_modules', '@react-pdf', 'renderer', 'lib', 'react-pdf.js');
const REACT = path.join(__dirname, '..', 'client', 'node_modules', 'react');
const FONT_PATH = path.join(__dirname, '..', 'client', 'src', 'fonts', 'bpg_arial.ttf');
const PUB = path.join(__dirname, '..', 'client', 'public');
const dataURI = (file) => {
  const p = path.join(PUB, file);
  return fs.existsSync(p) ? 'data:image/png;base64,' + fs.readFileSync(p).toString('base64') : null;
};
const LOGO_SRC = dataURI('logo.png');
const GAC_SRC  = dataURI('gac_logo.png');

(async () => {
  let RP = await import(pathToFileURL(RPKG).href);
  if (RP.default && !RP.Document) RP = RP.default;
  const React = (await import(pathToFileURL(path.join(REACT, 'index.js')).href)).default || require(REACT);
  const { Document, Page, Text, View, Image, StyleSheet, Font, renderToFile } = RP;
  const h = React.createElement;
  Font.register({ family: 'BPG Arial', src: FONT_PATH });

  // ── styles copied verbatim from ReportCoverPdf.js ──
  const styles = StyleSheet.create({
    page: { fontFamily: 'BPG Arial', paddingTop: 30, paddingBottom: 60, paddingLeft: 40, paddingRight: 40, fontSize: 10, lineHeight: 1.3 },
    watermarkContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
    watermarkImage: { width: 500, opacity: 0.08 },
    headerIso: { position: 'absolute', top: 20, left: 40, fontSize: 9, color: '#000' },
    headerPageNum: { position: 'absolute', top: 20, right: 40, fontSize: 9, fontWeight: 'bold', color: '#000' },
    headerContainer: { position: 'relative', marginTop: 15, height: 180, marginBottom: 10, width: '100%', paddingBottom: 10 },
    leftLogoAbsolute: { position: 'absolute', left: 0, top: 0, width: 190, height: 85 },
    combinedLogoImg: { width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'left' },
    centerColumn: { width: '100%', alignItems: 'center', position: 'absolute', top: 0 },
    buildexLogoImg: { height: 95, objectFit: 'contain', marginBottom: 5 },
    companyInfoText: { fontSize: 10, color: '#003366', fontWeight: 'bold', textAlign: 'center', marginTop: 2 },
    companyNameText: { fontSize: 16, color: '#003366', fontWeight: 'bold', textAlign: 'center', marginTop: 5, marginBottom: 5 },
    titleContainer: { marginTop: 40, marginBottom: 40, textAlign: 'center' },
    mainTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#000' },
    reportNumber: { fontSize: 14, fontWeight: 'bold', color: '#000' },
    infoGroup: { marginBottom: 20 },
    label: { fontSize: 11, marginBottom: 5, fontWeight: 'bold' },
    value: { fontSize: 12, paddingLeft: 5 },
    yearContainer: { marginTop: 100, textAlign: 'center', marginBottom: 20 },
    yearText: { fontSize: 22, fontWeight: 'bold' },
    coverFooter: { textAlign: 'center', marginTop: 'auto' },
    genInfoTitle: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, marginTop: 10 },
    formRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12, width: '100%' },
    formLabel: { fontSize: 10, fontWeight: 'bold', marginRight: 5, minWidth: 50 },
    formLine: { flex: 1, borderBottomWidth: 0, paddingBottom: 2, fontSize: 10, minHeight: 14 },
    multiLineContainer: { marginBottom: 12 },
    multiLineLabel: { fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
    multiLineBox: { borderBottomWidth: 0, marginBottom: 5, width: '100%' },
    sectionTitle: { fontSize: 11, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
    listItem: { flexDirection: 'row', marginBottom: 8, marginLeft: 15 },
    bullet: { width: 15, fontWeight: 'bold' },
    conclusionBox: { borderWidth: 1, borderColor: '#000', height: 220, marginTop: 5, marginBottom: 15, padding: 10 },
    researchBox: { borderWidth: 1, borderColor: '#000', height: 220, marginTop: 5, padding: 10, justifyContent: 'center', alignItems: 'center' },
    signatureRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 35 },
    signatureBlock: { width: '45%' },
    signatureLine: { borderBottomWidth: 0.5, borderBottomColor: '#000', marginTop: 45, marginBottom: 5 },
  });

  const currentYear = new Date().getFullYear();

  const Header = () => h(React.Fragment, null,
    h(Text, { style: styles.headerIso, fixed: true }, 'სსტ ისო/იეკ 17020'),
    h(Text, { style: styles.headerPageNum, fixed: true, render: ({ pageNumber }) => (pageNumber >= 2 ? (pageNumber - 1) : ' ') }),
    h(View, { style: styles.headerContainer, fixed: true },
      h(View, { style: styles.leftLogoAbsolute }, GAC_SRC ? h(Image, { src: GAC_SRC, style: styles.combinedLogoImg }) : null),
      h(View, { style: styles.centerColumn },
        LOGO_SRC ? h(Image, { src: LOGO_SRC, style: styles.buildexLogoImg }) : null,
        h(Text, { style: styles.companyInfoText }, 'A ტიპის ინსპექტირების ორგანო'),
        h(Text, { style: styles.companyNameText }, '„ბილდექს ექსპერტიზა"'),
        h(Text, { style: styles.companyInfoText }, 'ს/კ'),
        h(Text, { style: styles.companyInfoText }, 'აკრედიტაცია N'),
      ),
    ),
  );

  const formRow = (label, value) => h(View, { style: styles.formRow },
    h(Text, { style: styles.formLabel }, label),
    h(View, { style: styles.formLine }, h(Text, null, value || '')),
  );
  const multiLine = (label, value) => h(View, { style: styles.multiLineContainer },
    h(Text, { style: styles.multiLineLabel }, label),
    h(View, { style: styles.multiLineBox }, h(Text, { style: { fontSize: 10 } }, value || '')),
  );

  const doc = h(Document, null,
    h(Page, { size: 'A4', style: styles.page },
      h(View, { style: styles.watermarkContainer, fixed: true }, LOGO_SRC ? h(Image, { src: LOGO_SRC, style: styles.watermarkImage }) : null),
      h(Header),

      // ── Page 1: cover ──
      h(View, { style: styles.titleContainer },
        h(Text, { style: styles.mainTitle }, 'ინსპექტირების ანგარიში'),
        h(Text, { style: styles.reportNumber }, ''),
      ),
      h(View, { style: { marginLeft: 20, marginRight: 20 } },
        h(View, { style: styles.infoGroup }, h(Text, { style: styles.label }, 'ინსპექტირების ობიექტის დასახელება:'), h(Text, { style: styles.value }, '')),
        h(View, { style: styles.infoGroup }, h(Text, { style: styles.label }, 'მისამართი:'), h(Text, { style: styles.value }, '')),
        h(View, { style: styles.infoGroup }, h(Text, { style: styles.label }, 'დამკვეთი:'), h(Text, { style: styles.value }, '')),
      ),
      h(View, { style: styles.yearContainer }, h(Text, { style: styles.yearText }, currentYear + ' წელი')),
      h(View, { style: styles.coverFooter },
        h(Text, { style: { fontSize: 9, color: '#003366' } }, 'თელავი, ჭ. ამირეჯიბის ქ. №26; ტელ: +995 511 74 74 00'),
        h(Text, { style: { fontSize: 9, color: '#003366' } }, 'info@buildexexpertise.com'),
      ),
      h(Text, { break: true }),

      // ── Page 2: general info ──
      h(Text, { style: styles.genInfoTitle }, 'ინსპექტირების ანგარიში'),
      formRow('ანგარიშის N:', ''),
      formRow('ანგარიშის გაცემის თარიღი:', ''),
      formRow('ინსპექტირების დაწყებისა და დასრულების თარიღი:', ''),
      multiLine('ობიექტის დასახელება:', ''),
      formRow('დამკვეთი:', ''),
      formRow('წარმომადგენელი:', ''),
      multiLine('ანგარიშის შედგენის საფუძველი:', ''),
      formRow('აკრედიტაციის სფერო:', ''),
      multiLine('ინსპექტირების ამოცანა:', ''),
      h(Text, { break: true }),

      // ── Page 3: contents ──
      h(Text, { style: { fontWeight: 'bold', textAlign: 'center', marginBottom: 10 } }, 'ინსპექტირების შემსრულებლები:'),
      h(Text, { style: { textAlign: 'justify', marginBottom: 20, fontSize: 9 } }, 'ინსპექტირების შემსრულებლები ინსპექტირების ორგანოს ხელმძღვანელის მიერ გაფრთხილებული და პასუხისმგებელნი ვართ ინსპექტირება ვაწარმოოთ მიუკერძოებლად, ჯეროვნად ჩავატაროთ კვლევა და დავიცვათ ინსპექტირების ჩატარების დროს მიღებული ან წარმოქმნილი ნებისმიერი სახის ინფორმაციის კონფიდენციალურობა.'),
      h(View, { style: styles.listItem }, h(Text, null, '1. ინსპექტორი:')),

      h(Text, { style: styles.sectionTitle }, 'წარმოდგენილი მასალები:'),
      ...[0, 1, 2, 3, 4].map((i) => h(View, { key: 'm' + i, style: styles.listItem }, h(Text, { style: styles.bullet }, (i + 1) + '.'))),

      h(Text, { style: styles.sectionTitle }, 'კვლევაში გამოყენებული ნორმატიული დოკუმენტაცია:'),
      h(View, { style: styles.listItem }, h(Text, { style: styles.bullet }, '•')),

      h(Text, { style: styles.sectionTitle }, 'კვლევაში გამოყენებული ხელსაწყოები:'),
      h(View, { style: styles.listItem }, h(Text, { style: styles.bullet }, '•')),
      h(Text, { break: true }),

      // ── Page 4: conclusion + research ──
      h(Text, { style: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' } }, 'დასკვნა'),
      h(View, { style: [styles.conclusionBox, { justifyContent: 'flex-start', alignItems: 'flex-start' }] }),
      h(Text, { style: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginTop: 10 } }, 'კვლევითი ნაწილი'),
      h(View, { style: [styles.researchBox, { justifyContent: 'flex-start', alignItems: 'flex-start' }] },
        h(Text, { style: { color: '#ccc' } }, '(ადგილი ტექსტისთვის და ფოტოებისთვის)'),
      ),
      h(Text, { break: true }),

      // ── Page 5: signatures (names cleared) ──
      h(View, { style: { marginTop: 20 } },
        h(Text, { style: { fontWeight: 'bold' } }, 'ინსპექტირების ანგარიში მოამზადა:'),
        h(View, { style: styles.signatureRow }, h(View, { style: styles.signatureBlock },
          h(Text, null, 'ინსპექტორი:'), h(View, { style: styles.signatureLine }), h(Text, { style: { textAlign: 'center', fontSize: 8 } }, '(ხელმოწერა)'))),

        h(Text, { style: { fontWeight: 'bold', marginTop: 30 } }, 'ტექნიკური წესით გადაამოწმა:'),
        h(View, { style: styles.signatureRow }, h(View, { style: styles.signatureBlock },
          h(Text, null, 'ტექნიკური მენეჯერი:'), h(View, { style: styles.signatureLine }), h(Text, { style: { textAlign: 'center', fontSize: 8 } }, '(ხელმოწერა)'))),

        h(Text, { style: { fontWeight: 'bold', marginTop: 30 } }, 'ადმინისტრაციული წესით გადაამოწმა:'),
        h(View, { style: styles.signatureRow }, h(View, { style: styles.signatureBlock },
          h(Text, null, 'ხელმძღვანელი:'), h(View, { style: styles.signatureLine }), h(Text, { style: { textAlign: 'center', fontSize: 8 } }, '(ხელმოწერა)'))),
      ),
    ),
  );

  function findDesktop() {
    const c = [path.join(os.homedir(), 'OneDrive', 'Desktop'), path.join(os.homedir(), 'Desktop')];
    for (const x of c) if (fs.existsSync(x)) return x;
    return c[0];
  }
  const outDir = path.join(findDesktop(), 'ფორმები');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, 'BE-FM-IR — ინსპექტირების ანგარიში და დასკვნა.pdf');
  await renderToFile(doc, out);
  console.log('✓ შეიქმნა: ' + out);
})().catch(e => { console.error('ERROR:', e); process.exit(1); });
