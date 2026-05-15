import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf';

Font.register({ family: 'BPG Arial', src: fontPath });

const s = StyleSheet.create({
  page: { fontFamily: 'BPG Arial', padding: '50 55 60 55', fontSize: 10, lineHeight: 1.75 },
  watermark: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
  watermarkImg: { width: 300, opacity: 0.04 },
  headerBlock: { alignItems: 'center', marginBottom: 20 },
  companyName: { fontSize: 11, fontWeight: 'bold', textAlign: 'center', marginBottom: 3 },
  docTitle: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginBottom: 3 },
  docNum: { fontSize: 10, textAlign: 'center', color: '#444' },
  cityDateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, fontSize: 10 },
  preamble: { fontSize: 10, textAlign: 'justify', marginBottom: 14, lineHeight: 1.75 },
  decisionSection: { marginBottom: 10 },
  decisionNum: { fontSize: 10.5, fontWeight: 'bold', marginBottom: 4 },
  decisionBody: { fontSize: 10, textAlign: 'justify', marginLeft: 14, lineHeight: 1.75 },
  divider: { borderTopWidth: 0.8, borderTopColor: '#003366', marginVertical: 14 },
  sigSection: { marginTop: 30 },
  sigTitle: { fontSize: 10, fontWeight: 'bold', marginBottom: 16 },
  sigRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 30 },
  sigBlock: { minWidth: '40%', marginBottom: 16 },
  sigLabel: { fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  sigDetail: { fontSize: 9, color: '#444', marginBottom: 1 },
  sigLine: { borderTopWidth: 1, borderTopColor: '#000', marginTop: 32, paddingTop: 3, fontSize: 8.5, textAlign: 'center' },
  footer: { fontSize: 7.5, color: '#aaa', textAlign: 'center', marginTop: 18 },
});

const PartnerDecisionPdf = ({ data = {} }) => {
  const {
    decisionNumber = 'PO-01',
    decisionDate = '09 მარტი, 2026 წელი',
    city = 'ქ. თელავი',
    partners = [{ name: 'ლევან საჩიშვილი', personalId: '20001017959', address: 'ქ. თელავი, ლიონიძის ქ. №22', share: 100 }],
    decisions = [],
    agendaNote = '',
  } = data;

  const isSingle = partners.length === 1;
  const p0 = partners[0] || {};

  const titleLabel = isSingle
    ? 'შპს „ბილდექს ექსპერტიზა"-ს ერთპიროვნული პარტნიორის გადაწყვეტილება'
    : 'შპს „ბილდექს ექსპერტიზა"-ს პარტნიორთა კრების ოქმი';

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.watermark} fixed>
          <Image src="/logo.png" style={s.watermarkImg} />
        </View>

        {/* Header */}
        <View style={s.headerBlock}>
          <Text style={s.companyName}>შეზღუდული პასუხისმგებლობის საზოგადოება „ბილდექს ექსპერტიზა"</Text>
          <Text style={s.docTitle}>{titleLabel}</Text>
          <Text style={s.docNum}>№ {decisionNumber}</Text>
        </View>

        <View style={s.cityDateRow}>
          <Text>{city}</Text>
          <Text>თარიღი: {decisionDate}</Text>
        </View>

        <View style={s.divider} />

        {/* Preamble */}
        {isSingle ? (
          <Text style={s.preamble}>
            {`მე, ${p0.name} (საქართველოს მოქალაქე, პირადი ნომერი: ${p0.personalId}, რეგისტრირებული მისამართი: ${p0.address || '—'}), როგორც შეზღუდული პასუხისმგებლობის საზოგადოება „ბილდექს ექსპერტიზა"-ს ერთპიროვნულმა პარტნიორმა (${p0.share || 100}%-იანი წილის მფლობელი), „მეწარმეთა შესახებ" საქართველოს კანონის შესაბამისად, მივიღე შემდეგი გ ა დ ა წ ყ ვ ე ტ ი ლ ე ბ ა :`}
          </Text>
        ) : (
          <Text style={s.preamble}>
            {`შეზღუდული პასუხისმგებლობის საზოგადოება „ბილდექს ექსპერტიზა"-ს პარტნიორთა კრებაზე დამსწრე პარტნიორები: ${partners.map(p => `${p.name} (პ/ნ ${p.personalId}, ${p.share}%)`).join('; ')}.${agendaNote ? `\n\nდღის წესრიგი: ${agendaNote}` : ''}\n\nპარტნიორთა კრებამ, „მეწარმეთა შესახებ" საქართველოს კანონის, საქართველოს სამოქალაქო კოდექსისა და საზოგადოების წესდების შესაბამისად, ერთხმად მიიღო შემდეგი გ ა დ ა წ ყ ვ ე ტ ი ლ ე ბ ა :`}
          </Text>
        )}

        {/* Decisions */}
        {decisions.length > 0 ? decisions.map((d, i) => (
          <View key={i} style={s.decisionSection}>
            <Text style={s.decisionNum}>{i + 1}. {d.title}</Text>
            <Text style={s.decisionBody}>{d.body}</Text>
          </View>
        )) : (
          <View style={s.decisionSection}>
            <Text style={{ fontSize: 10, color: '#999', fontStyle: 'italic' }}>[გადაწყვეტილების ტექსტი]</Text>
          </View>
        )}

        <View style={s.divider} />

        {/* Signatures */}
        <View style={s.sigSection}>
          <Text style={s.sigTitle}>
            {isSingle ? 'ერთპიროვნული პარტნიორი:' : 'პარტნიორები:'}
          </Text>
          <View style={s.sigRow}>
            {partners.map((p, i) => (
              <View key={i} style={s.sigBlock}>
                <Text style={s.sigLabel}>{p.name}</Text>
                <Text style={s.sigDetail}>პ/ნ: {p.personalId}</Text>
                <Text style={s.sigDetail}>წილი: {p.share || 100}%</Text>
                <View style={s.sigLine}>
                  <Text>_______________________ / {p.name.split(' ').pop()} /</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Text style={s.footer}>
          {`შპს „ბილდექს ექსპერტიზა" | ს/კ 431188010 | გადაწყვეტილება №${decisionNumber} | ${decisionDate}`}
        </Text>
      </Page>
    </Document>
  );
};

export default PartnerDecisionPdf;
