import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf';

Font.register({ family: 'BPG Arial', src: fontPath });

const s = StyleSheet.create({
  page: { fontFamily: 'BPG Arial', padding: 40, fontSize: 10, lineHeight: 1.5 },
  watermarkContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
  watermarkImage: { width: 350, opacity: 0.07 },
  header: { alignItems: 'center', marginBottom: 10 },
  logo: { height: 52, marginBottom: 4 },
  companyName: { fontSize: 13, fontWeight: 'bold', color: '#003366', textAlign: 'center' },
  companyInfo: { fontSize: 8, color: '#555', textAlign: 'center', marginTop: 1 },
  divider: { borderTopWidth: 1, borderTopColor: '#003366', marginVertical: 8 },
  docTitle: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 2 },
  docCode: { fontSize: 8.5, textAlign: 'center', color: '#666', marginBottom: 12 },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', marginTop: 10, marginBottom: 5, borderBottomWidth: 0.5, borderBottomColor: '#ccc', paddingBottom: 2 },
  body: { textAlign: 'justify', marginBottom: 7 },
  fieldRow: { flexDirection: 'row', marginBottom: 7, alignItems: 'flex-end' },
  fieldLabel: { marginRight: 5, flexShrink: 0 },
  underline: { borderBottomWidth: 1, borderBottomColor: '#000', flexGrow: 1, paddingBottom: 1 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  box: { width: 11, height: 11, border: '1 solid #333', marginRight: 6, flexShrink: 0 },
  boxFilled: { width: 11, height: 11, border: '1 solid #333', marginRight: 6, flexShrink: 0, backgroundColor: '#003366' },
  yesNo: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  sigRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  sigBlock: { width: '30%', alignItems: 'center' },
  sigImage: { width: 85, height: 42, objectFit: 'contain', marginBottom: -9 },
  sigLine: { borderTopWidth: 1, borderTopColor: '#000', width: '100%', paddingTop: 3, textAlign: 'center', fontSize: 8 },
});

const CB = ({ checked }) => <View style={checked ? s.boxFilled : s.box} />;

const ImpartialityDeclarationPdf = ({ data = {} }) => {
  const {
    name = '', position = '', personalId = '', date = '',
    scopes = [],
    conflicts = {},
    sigs = [],
  } = data;
  // Support signature from FormFillModal (sigs[0]) or legacy `signature` field
  const signature = sigs[0]?.dataURL || data.signature || null;
  const sig0name  = sigs[0]?.name  || '';

  const conflictItems = [
    ['ownership', 'მფლობელობითი ინტერესი ან წილი კლიენტის კომპანიაში'],
    ['family', 'ნათესავური, მეგობრული ან სხვა პირადი კავშირი კლიენტთან'],
    ['employment', 'ადრინდელი დასაქმება კლიენტთან ბოლო 2 წლის განმავლობაში'],
    ['financial', 'ფინანსური დამოკიდებულება ან ინტერესი კლიენტთან'],
    ['contract', 'სხვა მოქმედი ხელშეკრულება ან ვალდებულება კლიენტთან'],
  ];

  const scopeItems = [
    ['BE-PR-01', 'ხარჯთაღრიცხვის შესაბამისობის ინსპექტირება'],
    ['BE-PR-02', 'შესრულებული სამუშაოს ფორმა 2-ის ინსპექტირება'],
    ['BE-PR-03', 'ფასწარმოქმნის ადეკვატურობის ინსპექტირება'],
    ['BE-PR-04', 'ტექნიკური ზედამხედველობის ინსპექტირება'],
  ];

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.watermarkContainer} fixed>
          <Image src="/logo.png" style={s.watermarkImage} />
        </View>

        <View style={s.header}>
          <Image src="/logo.png" style={s.logo} />
          <Text style={s.companyName}>შპს „ბილდექს ექსპერტიზა"</Text>
          <Text style={s.companyInfo}>A ტიპის ინსპექტირების ორგანო | საიდენტიფიკაციო კოდი 431188010</Text>
          <Text style={s.companyInfo}>ქალაქი თელავი, ჭაბუა ამირეჯიბის ქუჩა №26 | info@buildexpertise.com</Text>
        </View>
        <View style={s.divider} />

        <Text style={s.docTitle}>მიუკერძოებლობის დეკლარაცია</Text>
        <Text style={s.docCode}>BE-FM-IMP-DECL | ვ.1 | 2026 | ISO/IEC 17020:2012/2013 §4</Text>

        <View style={s.fieldRow}>
          <Text style={s.fieldLabel}>მე, ქვემოხსენებული:</Text>
          <View style={s.underline}><Text>{name}</Text></View>
        </View>
        <View style={s.fieldRow}>
          <Text style={s.fieldLabel}>თანამდებობა:</Text>
          <View style={s.underline}><Text>{position}</Text></View>
          <Text style={[s.fieldLabel, { marginLeft: 10 }]}>პირადი ნომერი:</Text>
          <View style={[s.underline, { maxWidth: 110 }]}><Text>{personalId}</Text></View>
        </View>

        <Text style={[s.body, { marginTop: 6 }]}>
          ვადასტურებ, რომ გავეცანი ISO/IEC 17020:2012/2013 სტანდარტის §4-ის მოთხოვნებს მიუკერძოებლობისა და
          დამოუკიდებლობის შესახებ. ვიღებ ვალდებულებას სრულად შევინარჩუნო მიუკერძოებლობა ინსპექტირების
          საქმიანობის განხორციელებისას და წარმოვაჩინო ნებისმიერი შესაძლო ინტერესთა კონფლიქტი.
        </Text>

        <Text style={s.sectionTitle}>ავტორიზებული სფეროები (მონიშნეთ შესაბამისი):</Text>
        {scopeItems.map(([code, label]) => (
          <View key={code} style={s.checkRow}>
            <CB checked={scopes.includes(code)} />
            <Text><Text style={{ fontWeight: 'bold' }}>{code}</Text> — {label}</Text>
          </View>
        ))}

        <Text style={s.sectionTitle}>ინტერესთა კონფლიქტი (მონიშნეთ კი ან არა):</Text>
        {conflictItems.map(([key, label]) => (
          <View key={key} style={[s.checkRow, { justifyContent: 'space-between' }]}>
            <Text style={{ flex: 1 }}>{label}</Text>
            <View style={s.yesNo}>
              <CB checked={conflicts[key] === true} />
              <Text style={{ marginRight: 10 }}>კი</Text>
              <CB checked={conflicts[key] !== true} />
              <Text>არა</Text>
            </View>
          </View>
        ))}

        <Text style={[s.body, { marginTop: 10 }]}>
          ვადასტურებ, რომ ზემოაღნიშნული ინფორმაცია სრული და სწორია. ვიცი, რომ ინტერესთა კონფლიქტის
          წარმოშობის შემთხვევაში ვალდებული ვარ დაუყოვნებლივ ვაცნობო ხელმძღვანელობას.
        </Text>

        <View style={s.sigRow}>
          <View style={s.sigBlock}>
            <Text style={{ fontSize: 9, marginBottom: 4 }}>თანამშრომელი:</Text>
            {sig0name ? <Text style={{ fontSize: 8, marginBottom: 1 }}>{sig0name}</Text> : null}
            {signature
              ? <Image src={signature} style={s.sigImage} />
              : <View style={{ height: 42 }} />}
            <View style={s.sigLine}>
              <Text>{sigs[0]?.date || date || '___________'}</Text>
            </View>
          </View>
        </View>

        <View style={[s.divider, { marginTop: 18 }]} />
        <Text style={{ fontSize: 7, color: '#aaa', textAlign: 'center' }}>
          კონფიდენციალური — მხოლოდ შიდა გამოყენებისთვის | BE-FM-IMP-DECL v1.0 | შპს „ბილდექს ექსპერტიზა"
        </Text>
      </Page>
    </Document>
  );
};

export default ImpartialityDeclarationPdf;
