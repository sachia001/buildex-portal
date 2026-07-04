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
  body: { textAlign: 'justify', marginBottom: 8 },
  numbered: { flexDirection: 'row', marginBottom: 6 },
  numLabel: { width: 20, fontWeight: 'bold', flexShrink: 0 },
  numText: { flex: 1, textAlign: 'justify' },
  fieldRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-end' },
  fieldLabel: { marginRight: 5, flexShrink: 0 },
  underline: { borderBottomWidth: 1, borderBottomColor: '#000', flexGrow: 1, paddingBottom: 1 },
  sigRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  sigBlock: { width: '30%', alignItems: 'center' },
  sigImage: { width: 85, height: 42, objectFit: 'contain', marginBottom: -9 },
  sigLine: { borderTopWidth: 1, borderTopColor: '#000', width: '100%', paddingTop: 3, textAlign: 'center', fontSize: 8 },
});

const ConfidentialityAgreementPdf = ({ data = {} }) => {
  const { name = '', position = '', date = '', sigs = [] } = data;
  const signature = sigs[0]?.dataURL || data.signature || null;
  const sig0name  = sigs[0]?.name  || '';

  const clauses = [
    'ყველა ინფორმაცია, რომელსაც ვიღებ სამუშაო პროცესში — კლიენტის მონაცემები, ინსპექტირების შედეგები, ფინანსური ინფორმაცია, ტექნიკური დოკუმენტაცია — კონფიდენციალურია და მესამე პირებზე გადაცემას არ ექვემდებარება.',
    'ვალდებულება ძალაშია დასაქმების მთელი პერიოდის განმავლობაში და მისი დასრულებიდან 5 (ხუთი) წლის განმავლობაში, დასაქმების შეწყვეტის მიზეზის მიუხედავად.',
    'კონფიდენციალური ინფორმაცია შეიძლება გაიცეს მხოლოდ: (ა) კანონიერი სასამართლო გადაწყვეტილების; ან (ბ) ორგანიზაციის ხელმძღვანელობის წერილობითი თანხმობის საფუძველზე.',
    'ვალდებული ვარ კომპანიის ინფორმაციული სისტემები გამოვიყენო მხოლოდ სამსახურეობრივი მიზნებისათვის და არ გადავიღო ან გავიტანო კონფიდენციალური დოკუმენტები უფლებამოსილების გარეშე.',
    'ვალდებული ვარ დაუყოვნებლივ ვაცნობო ხელმძღვანელობას კონფიდენციალური ინფორმაციის გაჟონვის, დაკარგვის ან არასათანადო გამოყენების ნებისმიერი ფაქტის შესახებ.',
    'პერსონალური მონაცემების დამუშავება ხდება „პერსონალურ მონაცემთა დაცვის შესახებ" საქართველოს კანონის (№5669) მოთხოვნების სრული დაცვით.',
    'სამსახურიდან გათავისუფლებისას ვალდებული ვარ დაუყოვნებლივ დავაბრუნო ყველა კონფიდენციალური მასალა, მათ შორის ელექტრონული ფორმატით შენახული დოკუმენტები.',
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
          <Text style={s.companyInfo}>ქალაქი თელავი, ლიონიძის ქუჩა №22 | buildexexspertise@gmail.com</Text>
        </View>
        <View style={s.divider} />

        <Text style={s.docTitle}>კონფიდენციალურობის შეთანხმება</Text>
        <Text style={s.docCode}>BE-FM-CONF | ვ.1 | 2026 | ISO/IEC 17020:2012/2013 §5</Text>

        <View style={s.fieldRow}>
          <Text style={s.fieldLabel}>მე:</Text>
          <View style={s.underline}><Text>{name}</Text></View>
          <Text style={[s.fieldLabel, { marginLeft: 10 }]}>თანამდებობა:</Text>
          <View style={s.underline}><Text>{position}</Text></View>
        </View>

        <Text style={s.body}>
          ვადასტურებ, რომ გავეცანი შპს „ბილდექს ექსპერტიზა"-ს კონფიდენციალურობის პოლიტიკას (POL-02)
          და ვიღებ შემდეგ ვალდებულებებს:
        </Text>

        {clauses.map((text, i) => (
          <View key={i} style={s.numbered}>
            <Text style={s.numLabel}>{i + 1}.</Text>
            <Text style={s.numText}>{text}</Text>
          </View>
        ))}

        <Text style={[s.body, { marginTop: 8 }]}>
          ვადასტურებ, რომ ზემოაღნიშნული ვალდებულებები სრულად გავიგე და ვეთანხმები. ვიცი, რომ
          ვალდებულების დარღვევა გამოიწვევს სამსახურიდან გათავისუფლებასა და კანონიერ პასუხისმგებლობას.
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
          კონფიდენციალური — მხოლოდ შიდა გამოყენებისთვის | BE-FM-CONF v1.0 | შპს „ბილდექს ექსპერტიზა"
        </Text>
      </Page>
    </Document>
  );
};

export default ConfidentialityAgreementPdf;
