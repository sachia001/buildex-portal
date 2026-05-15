import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf';

Font.register({ family: 'BPG Arial', src: fontPath });

const s = StyleSheet.create({
  page: { fontFamily: 'BPG Arial', padding: 40, fontSize: 10, lineHeight: 1.55 },
  watermarkContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
  watermarkImage: { width: 350, opacity: 0.07 },
  header: { alignItems: 'center', marginBottom: 10 },
  logo: { height: 52, marginBottom: 4 },
  companyName: { fontSize: 13, fontWeight: 'bold', color: '#003366', textAlign: 'center' },
  companyInfo: { fontSize: 8, color: '#555', textAlign: 'center', marginTop: 1 },
  divider: { borderTopWidth: 1, borderTopColor: '#003366', marginVertical: 8 },
  docTitle: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 2 },
  docCode: { fontSize: 8.5, textAlign: 'center', color: '#666', marginBottom: 12 },
  fieldRow: { flexDirection: 'row', marginBottom: 6, alignItems: 'flex-end' },
  fieldLabel: { marginRight: 5, flexShrink: 0 },
  underline: { borderBottomWidth: 1, borderBottomColor: '#000', flexGrow: 1, paddingBottom: 1 },
  body: { textAlign: 'justify', marginBottom: 8 },
  sectionBar: { backgroundColor: '#003366', padding: '3 6', marginBottom: 6, marginTop: 8 },
  sectionBarText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  checkbox: { width: 10, height: 10, borderWidth: 1, borderColor: '#003366', marginRight: 4, flexShrink: 0 },
  checkboxFilled: { width: 10, height: 10, borderWidth: 1, borderColor: '#003366', backgroundColor: '#003366', marginRight: 4, flexShrink: 0 },
  checkLabel: { flex: 1, fontSize: 9 },
  yesNoRow: { flexDirection: 'row', marginBottom: 6, alignItems: 'flex-start' },
  yesNoLabel: { flex: 1, fontSize: 9 },
  yesNoBoxes: { flexDirection: 'row', gap: 6, flexShrink: 0 },
  yesNoItem: { flexDirection: 'row', alignItems: 'center', marginLeft: 6 },
  yesNoText: { fontSize: 9, marginLeft: 3 },
  detailLine: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 2, marginBottom: 4, marginLeft: 14 },
  detailLabel: { fontSize: 8, color: '#555', marginRight: 4, flexShrink: 0 },
  detailUnderline: { borderBottomWidth: 0.5, borderBottomColor: '#999', flexGrow: 1, paddingBottom: 1, fontSize: 8, color: '#333' },
  sigRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  sigBlock: { width: '30%', alignItems: 'center' },
  sigImage: { width: 85, height: 42, objectFit: 'contain', marginBottom: -9 },
  sigLine: { borderTopWidth: 1, borderTopColor: '#000', width: '100%', paddingTop: 3, textAlign: 'center', fontSize: 8 },
  conclusion: { textAlign: 'justify', marginTop: 8, marginBottom: 8, fontSize: 9, color: '#333' },
});

const scopeOptions = [
  ['BE-PR-01', 'ხარჯთაღრიცხვის შესაბამისობის ინსპექტირება'],
  ['BE-PR-02', 'შესრულებული სამუშაოს ფ. №2-ის ინსპექტირება'],
  ['BE-PR-03', 'ფასწარმოქმნის ადეკვატურობის ინსპექტირება'],
  ['BE-PR-04', 'ტექნიკური ზედამხედველობის ინსპექტირება'],
];

const conflictItems = [
  ['ownership', 'მაქვს საკუთრებრივი ინტერესი ან წილი სამომავლო კლიენტთა კომპანიებში'],
  ['family', 'მყავს ოჯახური/ახლო პირადი კავშირი სამომავლო კლიენტებთან'],
  ['employment', 'ვიყავი დასაქმებული სამომავლო კლიენტთა ორგანიზაციებში ბოლო 2 წლის განმავლობაში'],
  ['financial', 'მაქვს ფინანსური დამოკიდებულება ან ინტერესი სამომავლო კლიენტთა მიმართ'],
  ['other', 'სხვა ინტერესთა კონფლიქტის სახეობა'],
];

const ImpartialityGeneralPdf = ({ data }) => {
  const {
    name = '', position = '', personalId = '', date = '',
    scopes = [], conflicts = {}, conflictDetails = {}, signature,
  } = data;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.watermarkContainer} fixed>
          <Image src="/logo.png" style={s.watermarkImage} />
        </View>

        <View style={s.header}>
          <Image src="/logo.png" style={s.logo} />
          <Text style={s.companyName}>შპს „ბილდექს ექსპერტიზა"</Text>
          <Text style={s.companyInfo}>A ტიპის ინსპექტირების ორგანო | ს/კ 431188010</Text>
          <Text style={s.companyInfo}>ქ. თელავი, ჭ. ამირეჯიბის ქ. №26 | buildexpertiza@gmail.com</Text>
        </View>
        <View style={s.divider} />

        <Text style={s.docTitle}>მიუკერძოებლობისა და დამოუკიდებლობის ზოგადი დეკლარაცია</Text>
        <Text style={s.docCode}>FM-02a | ვ.1 | 2026 | ISO/IEC 17020:2012/2013 §4.1</Text>

        <View style={s.fieldRow}>
          <Text style={s.fieldLabel}>სახელი, გვარი:</Text>
          <View style={s.underline}><Text>{name}</Text></View>
        </View>
        <View style={s.fieldRow}>
          <Text style={s.fieldLabel}>თანამდებობა:</Text>
          <View style={s.underline}><Text>{position}</Text></View>
          <Text style={[s.fieldLabel, { marginLeft: 10 }]}>პ/ნ:</Text>
          <View style={[s.underline, { maxWidth: 120 }]}><Text>{personalId}</Text></View>
        </View>
        <View style={s.fieldRow}>
          <Text style={s.fieldLabel}>თარიღი:</Text>
          <View style={[s.underline, { maxWidth: 160 }]}><Text>{date}</Text></View>
        </View>

        <Text style={s.body}>
          ვადასტურებ, რომ გავეცანი ISO/IEC 17020:2012/2013 სტანდარტის §4.1 მოთხოვნებს
          მიუკერძოებლობისა და დამოუკიდებლობის შესახებ. ვუქმნი ვალდებულებას, რომ
          ინსპექტირების საქმიანობის განხორციელებისას ვიყო სრულად მიუკერძოებელი და
          დამოუკიდებელი და დაუყოვნებლივ ვაცნობო ტექნიკურ მენეჯერს ნებისმიერი ინტერესთა
          კონფლიქტის შემთხვევაში.
        </Text>

        {/* Section A — scopes */}
        <View style={s.sectionBar}>
          <Text style={s.sectionBarText}>A — ავტორიზებული სფეროები</Text>
        </View>
        {scopeOptions.map(([code, label]) => (
          <View key={code} style={s.checkRow}>
            <View style={scopes.includes(code) ? s.checkboxFilled : s.checkbox} />
            <Text style={s.checkLabel}>{code} — {label}</Text>
          </View>
        ))}

        {/* Section B — general conflict declaration */}
        <View style={s.sectionBar}>
          <Text style={s.sectionBarText}>B — ინტერესთა კონფლიქტის ზოგადი დეკლარაცია</Text>
        </View>
        {conflictItems.map(([key, label]) => {
          const isYes = conflicts[key] === true;
          const detail = conflictDetails[key] || '';
          return (
            <View key={key}>
              <View style={s.yesNoRow}>
                <Text style={s.yesNoLabel}>{label}</Text>
                <View style={s.yesNoBoxes}>
                  <View style={s.yesNoItem}>
                    <View style={isYes ? s.checkboxFilled : s.checkbox} />
                    <Text style={s.yesNoText}>კი</Text>
                  </View>
                  <View style={s.yesNoItem}>
                    <View style={!isYes ? s.checkboxFilled : s.checkbox} />
                    <Text style={s.yesNoText}>არა</Text>
                  </View>
                </View>
              </View>
              {isYes && (
                <View style={s.detailLine}>
                  <Text style={s.detailLabel}>დეტალები:</Text>
                  <View style={s.detailUnderline}><Text>{detail}</Text></View>
                </View>
              )}
            </View>
          );
        })}

        <Text style={s.conclusion}>
          ვადასტურებ, რომ ზემოაღნიშნული ინფორმაცია სრული და სწორია. ვიცი, რომ ახალი
          ინტერესთა კონფლიქტის წარმოშობის შემთხვევაში ვალდებული ვარ დაუყოვნებლივ
          ვაცნობო ხელმძღვანელობას.
        </Text>

        <View style={s.sigRow}>
          <View style={s.sigBlock}>
            <Text style={{ fontSize: 9, marginBottom: signature ? 2 : 28 }}>თანამშრომელი:</Text>
            {signature && <Image src={signature} style={s.sigImage} />}
            <View style={s.sigLine}><Text>(ხელმოწერა)</Text></View>
            <Text style={{ fontSize: 8, marginTop: 4 }}>თარიღი: {date}</Text>
          </View>
          <View style={s.sigBlock}>
            <Text style={{ fontSize: 9, marginBottom: 28 }}>ტექნ. მენეჯერი:</Text>
            <View style={s.sigLine}><Text>(ხელმოწერა)</Text></View>
            <Text style={{ fontSize: 8, marginTop: 4 }}>თარიღი: ___________</Text>
          </View>
          <View style={s.sigBlock}>
            <Text style={{ fontSize: 9, marginBottom: 28 }}>ხარ. მენეჯერი:</Text>
            <View style={s.sigLine}><Text>(ხელმოწერა)</Text></View>
            <Text style={{ fontSize: 8, marginTop: 4 }}>თარიღი: ___________</Text>
          </View>
        </View>

        <View style={[s.divider, { marginTop: 14 }]} />
        <Text style={{ fontSize: 7, color: '#aaa', textAlign: 'center' }}>
          კონფიდენციალური — მხოლოდ შიდა გამოყენებისთვის | FM-02a v.1 | შპს „ბილდექს ექსპერტიზა" | შენახვა: 5 წელი
        </Text>
      </Page>
    </Document>
  );
};

export default ImpartialityGeneralPdf;
