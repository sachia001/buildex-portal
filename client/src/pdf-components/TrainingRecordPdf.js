import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf';

Font.register({ family: 'BPG Arial', src: fontPath });

const s = StyleSheet.create({
  page: { fontFamily: 'BPG Arial', padding: 35, fontSize: 9.5, lineHeight: 1.4 },
  watermarkContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
  watermarkImage: { width: 320, opacity: 0.07 },
  header: { alignItems: 'center', marginBottom: 8 },
  logo: { height: 46, marginBottom: 3 },
  companyName: { fontSize: 12, fontWeight: 'bold', color: '#003366', textAlign: 'center' },
  companyInfo: { fontSize: 7.5, color: '#555', textAlign: 'center', marginTop: 1 },
  divider: { borderTopWidth: 1, borderTopColor: '#003366', marginVertical: 6 },
  docTitle: { fontSize: 11, fontWeight: 'bold', textAlign: 'center', marginBottom: 2 },
  docCode: { fontSize: 8, textAlign: 'center', color: '#666', marginBottom: 8 },
  sectionBar: { backgroundColor: '#003366', padding: '3 6', marginTop: 8, marginBottom: 5 },
  sectionBarText: { color: 'white', fontWeight: 'bold', fontSize: 9.5 },
  fieldRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 5 },
  fieldLabel: { width: 140, flexShrink: 0, fontSize: 9.5 },
  fieldValue: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 1, fontSize: 9.5 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  box: { width: 10, height: 10, border: '1 solid #333', marginRight: 5, flexShrink: 0 },
  boxFilled: { width: 10, height: 10, border: '1 solid #333', marginRight: 5, flexShrink: 0, backgroundColor: '#003366' },
  inlineCheck: { flexDirection: 'row', alignItems: 'center', marginRight: 14 },
  sigRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  sigBlock: { width: '32%', alignItems: 'center' },
  sigImage: { width: 75, height: 36, objectFit: 'contain', marginBottom: -8 },
  sigLine: { borderTopWidth: 1, borderTopColor: '#000', width: '100%', paddingTop: 3, textAlign: 'center', fontSize: 7.5 },
});

const CB = ({ checked }) => <View style={checked ? s.boxFilled : s.box} />;

const TrainingRecordPdf = ({ data }) => {
  const {
    name = '', position = '', personalId = '', date = '',
    trainingDate = '', duration = '',
    trainingType = '',
    topic = '', trainer = '', location = '',
    assessmentMethods = [],
    assessmentResult = '',
    authorized = null,
    nextTrainingDate = '',
    signature
  } = data;

  const trainingTypes = [
    ['შიდა', 'შიდა ტრენინგი'],
    ['გარე', 'გარე ტრენინგი / სემინარი / კონფერენცია'],
    ['witnessing', 'ადგილზე დაკვირვება (Witnessing)'],
    ['ახალი_ინსპ', 'ახალი ინსპექტორის ზედამხედველობითი ტრენინგი'],
    ['ნორმატიული', 'ნორმატიული დოკუმენტის სწავლება'],
    ['IT', 'IT / პროგრამული უზრუნველყოფის ტრენინგი'],
    ['სხვა', 'სხვა'],
  ];

  const assessmentMethodItems = [
    ['test', 'წერილობითი ტესტი'],
    ['witnessing', 'ადგილზე დაკვირვება'],
    ['oral', 'ზეპირი გამოკითხვა'],
    ['practical', 'პრაქტიკული სავარჯიშო'],
    ['manager', 'ტექნიკური მენეჯერის შეფასება'],
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
          <Text style={s.companyInfo}>A ტიპის ინსპექტირების ორგანო | ს/კ 431188010 | ქ. თელავი</Text>
        </View>
        <View style={s.divider} />

        <Text style={s.docTitle}>ტრენინგის ჩანაწერი</Text>
        <Text style={s.docCode}>FM-13 | ვ.2 | 2026 | ISO/IEC 17020:2012/2013 §6.1</Text>

        {/* Section A */}
        <View style={s.sectionBar}><Text style={s.sectionBarText}>A — თანამშრომლის მონაცემები</Text></View>
        {[
          ['სახელი, გვარი:', name],
          ['თანამდებობა:', position],
          ['საიდენტ. №:', personalId],
          ['ტრენინგის თარიღი:', trainingDate || date],
          ['ხანგრძლივობა:', duration ? `${duration} საათი` : ''],
        ].map(([label, value]) => (
          <View key={label} style={s.fieldRow}>
            <Text style={s.fieldLabel}>{label}</Text>
            <Text style={s.fieldValue}>{value}</Text>
          </View>
        ))}

        {/* Section B */}
        <View style={s.sectionBar}><Text style={s.sectionBarText}>B — ტრენინგის ტიპი</Text></View>
        {trainingTypes.map(([key, label]) => (
          <View key={key} style={s.checkRow}>
            <CB checked={trainingType === key} />
            <Text>{label}</Text>
          </View>
        ))}

        {/* Section C */}
        <View style={s.sectionBar}><Text style={s.sectionBarText}>C — ტრენინგის შინაარსი</Text></View>
        {[
          ['სათაური / თემა:', topic],
          ['ორგანიზატორი / ტრენერი:', trainer],
          ['ადგილი:', location],
        ].map(([label, value]) => (
          <View key={label} style={s.fieldRow}>
            <Text style={s.fieldLabel}>{label}</Text>
            <Text style={s.fieldValue}>{value}</Text>
          </View>
        ))}

        {/* Section D */}
        <View style={s.sectionBar}><Text style={s.sectionBarText}>D — კომპეტენციის შეფასება ტრენინგის შემდეგ</Text></View>
        {assessmentMethodItems.map(([key, label]) => (
          <View key={key} style={s.checkRow}>
            <CB checked={assessmentMethods.includes(key)} />
            <Text>{label}</Text>
          </View>
        ))}
        <View style={[s.fieldRow, { marginTop: 5 }]}>
          <Text style={s.fieldLabel}>შეფასების შედეგი:</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={s.inlineCheck}>
              <CB checked={assessmentResult === 'კომპეტენტური'} />
              <Text>კომპეტენტური</Text>
            </View>
            <View style={s.inlineCheck}>
              <CB checked={assessmentResult === 'გრძელდება'} />
              <Text>ტრენინგი გრძელდება</Text>
            </View>
          </View>
        </View>

        {/* Section E */}
        <View style={s.sectionBar}><Text style={s.sectionBarText}>E — კომპეტენციის სტატუსი</Text></View>
        <View style={s.fieldRow}>
          <Text style={s.fieldLabel}>ავტორიზებულია:</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={s.inlineCheck}><CB checked={authorized === true} /><Text>კი</Text></View>
            <View style={s.inlineCheck}><CB checked={authorized === false} /><Text>არა</Text></View>
          </View>
        </View>
        <View style={s.fieldRow}>
          <Text style={s.fieldLabel}>შემდეგი ტრენინგის თარიღი:</Text>
          <Text style={s.fieldValue}>{nextTrainingDate}</Text>
        </View>

        {/* Section F */}
        <View style={s.sectionBar}><Text style={s.sectionBarText}>F — ხელმოწერები</Text></View>
        <View style={s.sigRow}>
          <View style={s.sigBlock}>
            <Text style={{ fontSize: 8.5, marginBottom: 22 }}>თანამშრომელი:</Text>
            {signature && <Image src={signature} style={s.sigImage} />}
            <View style={s.sigLine}><Text>(ხელმოწერა)</Text></View>
            <Text style={{ fontSize: 7.5, marginTop: 3 }}>თარიღი: {date}</Text>
          </View>
          <View style={s.sigBlock}>
            <Text style={{ fontSize: 8.5, marginBottom: 22 }}>ტექნ. მენეჯერი:</Text>
            <View style={s.sigLine}><Text>(ხელმოწერა)</Text></View>
            <Text style={{ fontSize: 7.5, marginTop: 3 }}>თარიღი: ___________</Text>
          </View>
          <View style={s.sigBlock}>
            <Text style={{ fontSize: 8.5, marginBottom: 22 }}>ხარ. მენეჯერი:</Text>
            <View style={s.sigLine}><Text>(ხელმოწერა)</Text></View>
            <Text style={{ fontSize: 7.5, marginTop: 3 }}>თარიღი: ___________</Text>
          </View>
        </View>

        <View style={[s.divider, { marginTop: 12 }]} />
        <Text style={{ fontSize: 7, color: '#aaa', textAlign: 'center' }}>
          კონფიდენციალური — მხოლოდ შიდა გამოყენებისთვის | FM-13 v.2 | შპს „ბილდექს ექსპერტიზა" | შენახვა: 5 წელი
        </Text>
      </Page>
    </Document>
  );
};

export default TrainingRecordPdf;
