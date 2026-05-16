import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf';

Font.register({ family: 'BPG Arial', src: fontPath });

const s = StyleSheet.create({
  page: { fontFamily: 'BPG Arial', padding: '0 0 50 0', fontSize: 10, lineHeight: 1.75 },
  watermark: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
  watermarkImg: { width: 460, opacity: 0.2 },

  headerBar: { padding: '8 50', flexDirection: 'row', alignItems: 'center', marginBottom: 0 },
  headerLogo: { width: 40, height: 40, marginRight: 14, objectFit: 'contain' },
  headerTextBlock: { flex: 1 },
  headerCompany: { color: '#003366', fontSize: 11, fontWeight: 'bold' },
  headerSub: { color: '#666', fontSize: 7.5, marginTop: 1 },
  headerNum: { color: '#003366', fontSize: 9, marginLeft: 'auto' },

  dividerTop: { borderTopWidth: 2, borderTopColor: '#c8a84b', marginBottom: 0 },

  body: { paddingHorizontal: 50, paddingTop: 22 },

  // Title block
  docTitle: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 3 },
  docNum: { fontSize: 10, textAlign: 'center', color: '#333', marginBottom: 16 },
  cityDateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, fontSize: 10 },
  divider: { borderTopWidth: 0.8, borderTopColor: '#003366', marginVertical: 12 },

  preamble: { fontSize: 10, textAlign: 'justify', marginBottom: 14, lineHeight: 1.75 },

  decisionSection: { marginBottom: 10 },
  decisionNum: { fontSize: 10.5, fontWeight: 'bold', marginBottom: 4 },
  decisionBody: { fontSize: 10, textAlign: 'justify', marginLeft: 14, lineHeight: 1.75 },

  sigSection: { marginTop: 30 },
  sigTitle: { fontSize: 10, fontWeight: 'bold', marginBottom: 16 },
  sigRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 30 },
  sigBlock: { minWidth: '40%', marginBottom: 16 },
  sigLabel: { fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  sigDetail: { fontSize: 9, color: '#444', marginBottom: 1 },
  sigLine: { borderBottomWidth: 0.5, borderBottomColor: '#555', marginTop: 40, width: 180 },
  sigLineLabel: { fontSize: 8.5, textAlign: 'left', marginTop: 3, color: '#333' },
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
    ? 'ერთპიროვნული პარტნიორის გადაწყვეტილება'
    : 'პარტნიორთა კრების ოქმი';

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.watermark} fixed>
          <Image src="/logo.png" style={s.watermarkImg} />
        </View>

        {/* ── Header bar (logo + company name, like inspection PDFs) ── */}
        <View style={s.headerBar} fixed>
          <Image src="/logo.png" style={s.headerLogo} />
          <View style={s.headerTextBlock}>
            <Text style={s.headerCompany}>შპს „ბილდექს ექსპერტიზა"</Text>
            <Text style={s.headerSub}>A ტიპის ინსპექტირების ორგანო  |  ISO/IEC 17020:2012/2013  |  ს/კ 431188010</Text>
          </View>
          <Text style={s.headerNum}>№ {decisionNumber}</Text>
        </View>
        <View style={s.dividerTop} />

        {/* ── Body ── */}
        <View style={s.body}>
          <Text style={s.docTitle}>შპს „ბილდექს ექსპერტიზა"-ს</Text>
          <Text style={s.docTitle}>{titleLabel}</Text>
          <Text style={s.docNum}>№ {decisionNumber}</Text>

          <View style={s.cityDateRow}>
            <Text>{city}</Text>
            <Text>თარიღი: {decisionDate}</Text>
          </View>
          <View style={s.divider} />

          {/* Preamble */}
          {isSingle ? (
            <Text style={s.preamble}>
              {`მე, ${p0.name} (საქართველოს მოქალაქე, პირადი ნომერი: ${p0.personalId}, რეგისტრირებული მისამართი: საქართველო, ${p0.address || '—'}), როგორც შეზღუდული პასუხისმგებლობის საზოგადოება „ბილდექს ექსპერტიზა"-ს ${p0.share || 100}%-იანი წილის ერთპიროვნულმა პარტნიორმა, „მეწარმეთა შესახებ" საქართველოს კანონით ხელმძღვანელობით, მივიღე შემდეგი\n\nგ ა დ ა წ ყ ვ ე ტ ი ლ ე ბ ა :`}
            </Text>
          ) : (
            <Text style={s.preamble}>
              {`შეზღუდული პასუხისმგებლობის საზოგადოება „ბილდექს ექსპერტიზა"-ს პარტნიორთა კრებაზე დამსწრე პარტნიორები: ${partners.map(p => `${p.name} (პ/ნ ${p.personalId}, ${p.share}%)`).join('; ')}.${agendaNote ? `\n\nდღის წესრიგი: ${agendaNote}` : ''}\n\nპარტნიორთა კრებამ, „მეწარმეთა შესახებ" საქართველოს კანონის, საქართველოს სამოქალაქო კოდექსისა და საზოგადოების წესდების შესაბამისად, ერთხმად მიიღო შემდეგი\n\nგ ა დ ა წ ყ ვ ე ტ ი ლ ე ბ ა :`}
            </Text>
          )}

          {/* Decisions */}
          {decisions.length > 0 ? decisions.map((d, i) => (
            <View key={i} style={s.decisionSection}>
              <Text style={s.decisionNum}>{i + 1}. {d.title}</Text>
              <Text style={s.decisionBody}>{d.body}</Text>
            </View>
          )) : (
            <Text style={{ fontSize: 10, color: '#999' }}>[გადაწყვეტილების ტექსტი]</Text>
          )}

          <View style={s.divider} />

          {/* Signatures */}
          <View style={s.sigSection}>
            <Text style={s.sigTitle}>
              {isSingle ? 'დამფუძნებელი (პარტნიორი):' : 'პარტნიორები:'}
            </Text>
            <View style={s.sigRow}>
              {partners.map((p, i) => (
                <View key={i} style={s.sigBlock}>
                  <Text style={s.sigLabel}>{p.name}</Text>
                  <Text style={s.sigDetail}>პ/ნ: {p.personalId}</Text>
                  <Text style={s.sigDetail}>წილი: {p.share || 100}%</Text>
                  <View style={s.sigLine} />
                  <Text style={s.sigLineLabel}>{`/ ${p.name.split(' ').pop()} /`}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={s.footer}>
            {`შპს „ბილდექს ექსპერტიზა"  |  ს/კ 431188010  |  გადაწყვეტილება №${decisionNumber}  |  ${decisionDate}`}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PartnerDecisionPdf;
