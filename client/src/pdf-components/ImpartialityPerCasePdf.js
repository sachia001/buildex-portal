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
  fieldRow: { flexDirection: 'row', marginBottom: 5, alignItems: 'flex-end' },
  fieldLabel: { marginRight: 5, flexShrink: 0, fontSize: 9, color: '#555' },
  underline: { borderBottomWidth: 1, borderBottomColor: '#000', flexGrow: 1, paddingBottom: 1, fontSize: 9 },
  sectionBar: { backgroundColor: '#003366', padding: '3 6', marginBottom: 6, marginTop: 8 },
  sectionBarText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  yesNoRow: { flexDirection: 'row', marginBottom: 5, alignItems: 'center' },
  yesNoLabel: { flex: 1, fontSize: 9 },
  yesNoBoxes: { flexDirection: 'row', flexShrink: 0 },
  yesNoItem: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  yesNoText: { fontSize: 9, marginLeft: 3 },
  checkbox: { width: 10, height: 10, borderWidth: 1, borderColor: '#003366', marginRight: 4, flexShrink: 0 },
  checkboxFilled: { width: 10, height: 10, borderWidth: 1, borderColor: '#003366', backgroundColor: '#003366', marginRight: 4, flexShrink: 0 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  checkLabel: { flex: 1, fontSize: 9 },
  sigRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  sigBlock: { width: '30%', alignItems: 'center' },
  sigImage: { width: 85, height: 42, objectFit: 'contain', marginBottom: -9 },
  sigLine: { borderTopWidth: 1, borderTopColor: '#000', width: '100%', paddingTop: 3, textAlign: 'center', fontSize: 8 },
});

const conflictItems = [
  ['acquainted', 'პირადად იცნობ კლიენტს ან კლიენტის წარმომადგენელს?'],
  ['employed', 'ბოლო 2 წლის განმავლობაში ნამსახურები ხარ კლიენტთან?'],
  ['financial', 'გაქვს ფინანსური ინტერესი ამ ინსპექტირების შედეგში?'],
  ['participated', 'მონაწილეობდი ამ ობიექტის პროექტირებაში, მშენებლობაში ან ზედამხედველობაში?'],
  ['other', 'სხვა სახის ინტერესთა კონფლიქტი?'],
];

const ImpartialityPerCasePdf = ({ data }) => {
  const {
    name = '', position = '', personalId = '', date = '',
    inspectionNumber = '', applicationNumber = '', clientName = '',
    objectName = '', objectAddress = '', caseDate = '',
    caseConflicts = {}, conclusion = 'clear', signature,
  } = data;

  const isClear = conclusion === 'clear';

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
          <Text style={s.companyInfo}>ქ. თელავი, ჭ. ამირეჯიბის ქ. №26 | info@buildexexpertise.com</Text>
        </View>
        <View style={s.divider} />

        <Text style={s.docTitle}>მიუკერძოებლობის შეფასება — კონკრეტული საქმისთვის</Text>
        <Text style={s.docCode}>FM-02b | ვ.1 | 2026 | ISO/IEC 17020:2012/2013 §4.1.5</Text>

        {/* Section A — Inspector data */}
        <View style={s.sectionBar}>
          <Text style={s.sectionBarText}>A — ინსპექტორის მონაცემები</Text>
        </View>
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

        {/* Section B — Case data */}
        <View style={s.sectionBar}>
          <Text style={s.sectionBarText}>B — საქმის მონაცემები</Text>
        </View>
        <View style={s.fieldRow}>
          <Text style={s.fieldLabel}>ინსპ. №:</Text>
          <View style={[s.underline, { maxWidth: 160 }]}><Text>{inspectionNumber}</Text></View>
          <Text style={[s.fieldLabel, { marginLeft: 10 }]}>განცხ. №:</Text>
          <View style={[s.underline, { maxWidth: 160 }]}><Text>{applicationNumber}</Text></View>
        </View>
        <View style={s.fieldRow}>
          <Text style={s.fieldLabel}>კლიენტი:</Text>
          <View style={s.underline}><Text>{clientName}</Text></View>
        </View>
        {objectName ? (
          <View style={s.fieldRow}>
            <Text style={s.fieldLabel}>ობიექტი:</Text>
            <View style={s.underline}><Text>{objectName}</Text></View>
          </View>
        ) : null}
        {objectAddress ? (
          <View style={s.fieldRow}>
            <Text style={s.fieldLabel}>მისამართი:</Text>
            <View style={s.underline}><Text>{objectAddress}</Text></View>
          </View>
        ) : null}
        <View style={s.fieldRow}>
          <Text style={s.fieldLabel}>რეგისტრ. თარიღი:</Text>
          <View style={[s.underline, { maxWidth: 160 }]}><Text>{caseDate}</Text></View>
          <Text style={[s.fieldLabel, { marginLeft: 10 }]}>შევსების თარიღი:</Text>
          <View style={[s.underline, { maxWidth: 120 }]}><Text>{date}</Text></View>
        </View>

        {/* Section C — Conflict assessment */}
        <View style={s.sectionBar}>
          <Text style={s.sectionBarText}>C — ინტერესთა კონფლიქტის შეფასება</Text>
        </View>
        {conflictItems.map(([key, label]) => {
          const isYes = caseConflicts[key] === true;
          return (
            <View key={key} style={s.yesNoRow}>
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
          );
        })}

        {/* Section D — Conclusion */}
        <View style={s.sectionBar}>
          <Text style={s.sectionBarText}>D — დასკვნა</Text>
        </View>
        <View style={s.checkRow}>
          <View style={isClear ? s.checkboxFilled : s.checkbox} />
          <Text style={s.checkLabel}>ინტერესთა კონფლიქტი არ გამოვლინდა — ინსპექტირება შეიძლება</Text>
        </View>
        <View style={s.checkRow}>
          <View style={!isClear ? s.checkboxFilled : s.checkbox} />
          <Text style={s.checkLabel}>ინტერესთა კონფლიქტი გამოვლინდა — ინსპექტირება ვერ ჩავატარებ</Text>
        </View>

        <View style={s.sigRow}>
          <View style={s.sigBlock}>
            <Text style={{ fontSize: 9, marginBottom: signature ? 2 : 28 }}>ინსპექტორი:</Text>
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
          კონფიდენციალური | FM-02b v.1 | შპს „ბილდექს ექსპერტიზა" | შენახვა: 5 წელი
        </Text>
      </Page>
    </Document>
  );
};

export default ImpartialityPerCasePdf;
