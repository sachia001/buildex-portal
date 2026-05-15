import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf';

Font.register({ family: 'BPG Arial', src: fontPath });

const s = StyleSheet.create({
  page: { fontFamily: 'BPG Arial', padding: '45 50 55 50', fontSize: 9.5, lineHeight: 1.7 },
  watermark: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
  watermarkImg: { width: 300, opacity: 0.04 },
  titleBlock: { alignItems: 'center', marginBottom: 16 },
  mainTitle: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginBottom: 3 },
  subTitle: { fontSize: 9.5, textAlign: 'center', color: '#555' },
  note: { fontSize: 8.5, color: '#888', textAlign: 'center', marginTop: 3 },
  divider: { borderTopWidth: 0.8, borderTopColor: '#003366', marginVertical: 10 },
  sectionLabel: { fontSize: 10, fontWeight: 'bold', textDecoration: 'underline', marginTop: 12, marginBottom: 6 },
  row: { flexDirection: 'row', marginBottom: 5, alignItems: 'flex-start' },
  label: { fontSize: 9.5, fontWeight: 'bold', minWidth: 130, flexShrink: 0 },
  value: { fontSize: 9.5, flex: 1 },
  dotLine: { borderBottomWidth: 0.5, borderBottomColor: '#999', flex: 1, marginBottom: 2, paddingBottom: 1 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#eee', paddingVertical: 4, paddingHorizontal: 6, marginBottom: 1 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ccc', paddingVertical: 5, paddingHorizontal: 6 },
  tc: { fontSize: 9, paddingHorizontal: 2 },
  footNote: { fontSize: 8.5, color: '#666', textAlign: 'justify', marginTop: 6 },
  sigSection: { marginTop: 28 },
  sigBlock: { marginBottom: 20 },
  sigName: { fontSize: 9.5, fontWeight: 'bold' },
  sigDetail: { fontSize: 9, color: '#555' },
  sigLine: { borderTopWidth: 1, borderTopColor: '#000', marginTop: 28, paddingTop: 3, fontSize: 8.5, flexDirection: 'row', justifyContent: 'space-between' },
  footer: { fontSize: 7.5, color: '#aaa', textAlign: 'center', marginTop: 14 },
});

const DotRow = ({ label, value }) => (
  <View style={s.row}>
    <Text style={s.label}>{label}</Text>
    <View style={s.dotLine}><Text style={{ fontSize: 9.5 }}>{value || ''}</Text></View>
  </View>
);

const FoundingAgreementPdf = ({ data = {} }) => {
  const {
    partners = [{ name: 'ლევან საჩიშვილი', personalId: '20001017959', address: 'ქ. თელავი, ლიონიძის ქ. №22', share: 100 }],
    director = 'ლევან საჩიშვილი',
    directorId = '20001017959',
    directorAddress = 'ქ. თელავი, ლიონიძის ქ. №22',
    address = 'საქართველო, ქ. თელავი, ლიონიძის ქუჩა №22',
    email = 'info@buildexexpertise.com',
    phone = '+995 511 747 400',
    foundingDate = '09 მარტი, 2026 წელი',
    totalShares = '100',
    representation = 'ერთპიროვნული',
  } = data;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.watermark} fixed>
          <Image src="/logo.png" style={s.watermarkImg} />
        </View>

        {/* Title */}
        <View style={s.titleBlock}>
          <Text style={s.mainTitle}>სადამფუძნებლო შეთანხმება</Text>
          <Text style={s.subTitle}>(შეზღუდული პასუხისმგებლობის საზოგადოების სარეგისტრაციო მონაცემები / სარეგისტრაციო განაცხადი)</Text>
          <Text style={s.note}>* — სიმბოლოთი აღნიშნული ველების შევსება სავალდებულოა</Text>
        </View>
        <View style={s.divider} />

        {/* Basic info */}
        <DotRow label="სამართლებრივი ფორმა" value={'შეზღუდული პასუხისმგებლობის საზოგადოება'} />
        <DotRow label="* საფირმო სახელწოდება (ქართ.)" value={'შპს „ბილდექს ექსპერტიზა"'} />
        <DotRow label="* საფირმო სახელწოდება (ინგლ.)" value={'Buildex Expertise LLC'} />
        <DotRow label="* იურიდიული მისამართი" value={address} />
        <DotRow label="ელ. ფოსტა" value={email} />
        <DotRow label="ტელეფონი" value={phone} />

        <Text style={s.sectionLabel}>კაპიტალი (იმ შემთხვევაში, თუ განსაზღვრულია)</Text>
        <DotRow label="ნებადართული კაპიტალი" value="" />
        <DotRow label="განთავსებული კაპიტალი" value="" />
        <DotRow label="* განთავსებული წილების რაოდენობა" value={`${totalShares} ერთეული`} />
        <DotRow label="ერთი წილის ნომინალური ღირებულება" value="" />

        {/* Partners table */}
        <Text style={s.sectionLabel}>* პარტნიორები და პარტნიორთა წილობრივი მონაწილეობა</Text>
        <View style={s.tableHeader}>
          <Text style={[s.tc, { width: 20 }]}>№</Text>
          <Text style={[s.tc, { flex: 1 }]}>პარტნიორი (სახელი, გვარი, პ/ნ, მისამართი)</Text>
          <Text style={[s.tc, { width: 60, textAlign: 'center' }]}>წილის ოდენობა</Text>
          <Text style={[s.tc, { width: 55, textAlign: 'center' }]}>წილი (%)</Text>
        </View>
        {partners.map((p, i) => (
          <View key={i} style={s.tableRow}>
            <Text style={[s.tc, { width: 20 }]}>{i + 1}</Text>
            <Text style={[s.tc, { flex: 1 }]}>{p.name}, პ/ნ: {p.personalId}{p.address ? `, ${p.address}` : ''}</Text>
            <Text style={[s.tc, { width: 60, textAlign: 'center' }]}>{p.share}</Text>
            <Text style={[s.tc, { width: 55, textAlign: 'center' }]}>{p.share}%</Text>
          </View>
        ))}
        <Text style={s.footNote}>წილის ოდენობა გამოხატულია მთელი რიცხვით (ერთეულები); წილი — პროცენტებში.</Text>

        {/* Management */}
        <Text style={s.sectionLabel}>ხელმძღვანელი ორგანო</Text>
        <DotRow label="ხელმძღვანელი ორგანოს სახელწოდება" value="დირექტორი" />
        <DotRow label="* ხელმძღვანელი ორგანოს წევრი" value={`${director}, პ/ნ: ${directorId}, ${directorAddress}`} />
        <DotRow label="* წარმომადგენლობითი უფლებამოსილება" value={representation} />
        <DotRow label="* საიტის ადმინ. პასუხისმგებელი პირი" value={director} />
        <DotRow label="ელ. ფოსტა / ტელეფონი" value={`${email} / ${phone}`} />

        {/* Charter attachment note */}
        <View style={[s.divider, { marginTop: 14 }]} />
        <Text style={{ fontSize: 9, color: '#555', marginBottom: 10 }}>
          დანართი: დამფუძნებლების/პარტნიორების მიერ შემუშავებული სამეწარმეო საზოგადოების წესდება, რომელიც წარმოადგენს სადამფუძნებლო შეთანხმების განუყოფელ ნაწილს.
        </Text>

        {/* Signatures */}
        <View style={s.sigSection}>
          {partners.map((p, i) => (
            <View key={i} style={s.sigBlock}>
              <Text style={s.sigName}>{p.name}</Text>
              <Text style={s.sigDetail}>პარტნიორი / ხელმძღვანელობაზე და წარმომადგენლობაზე უფლებამოსილი პირი</Text>
              <View style={s.sigLine}>
                <Text>ხელმოწერა: ___________________________ / {p.name.split(' ').pop()} /</Text>
                <Text>თარიღი: {foundingDate}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={s.footer}>
          {`შპს „ბილდექს ექსპერტიზა" | ს/კ 431188010 | სადამფუძნებლო შეთანხმება | ${foundingDate}`}
        </Text>
      </Page>
    </Document>
  );
};

export default FoundingAgreementPdf;
