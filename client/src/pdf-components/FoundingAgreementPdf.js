import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf';

Font.register({ family: 'BPG Arial', src: fontPath });

const s = StyleSheet.create({
  page: { fontFamily: 'BPG Arial', padding: '40 50 50 50', fontSize: 9, lineHeight: 1.6 },
  watermark: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
  watermarkImg: { width: 300, opacity: 0.04 },

  titleBlock: { alignItems: 'center', marginBottom: 10 },
  mainTitle: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 2 },
  subTitle: { fontSize: 8.5, textAlign: 'center', color: '#444' },
  mandatoryNote: { fontSize: 8, color: '#888', textAlign: 'center', marginTop: 3, marginBottom: 4 },
  divider: { borderTopWidth: 0.8, borderTopColor: '#003366', marginVertical: 8 },

  sectionLabel: { fontSize: 9.5, fontWeight: 'bold', textDecoration: 'underline', marginTop: 10, marginBottom: 4 },

  fieldRow: { flexDirection: 'row', marginBottom: 2, alignItems: 'flex-start' },
  fieldLabel: { fontSize: 9, fontWeight: 'bold', minWidth: 150, flexShrink: 0 },
  dotBox: { flex: 1, borderBottomWidth: 0.5, borderBottomColor: '#999', paddingBottom: 1, minHeight: 14 },
  fieldValue: { fontSize: 9 },
  fieldNote: { fontSize: 7.5, color: '#888', marginBottom: 4, marginLeft: 152 },

  tableHeader: { flexDirection: 'row', backgroundColor: '#ddd', paddingVertical: 3, paddingHorizontal: 4, marginTop: 4 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#bbb', paddingVertical: 4, paddingHorizontal: 4 },
  tableNote: { fontSize: 7.5, color: '#888', fontStyle: 'italic', marginLeft: 4, marginTop: 1 },
  tc: { fontSize: 8.5 },

  blankLine: { borderBottomWidth: 0.5, borderBottomColor: '#999', height: 14, marginBottom: 3 },
  blankLineWide: { borderBottomWidth: 0.5, borderBottomColor: '#999', height: 14, marginBottom: 3, marginLeft: 152 },

  sigSection: { marginTop: 24 },
  sigBlock: { marginBottom: 18 },
  sigName: { fontSize: 9.5, fontWeight: 'bold' },
  sigRole: { fontSize: 8.5, color: '#555', marginBottom: 4 },
  sigLineRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.8, borderTopColor: '#333', paddingTop: 3, marginTop: 26 },
  sigLineText: { fontSize: 8.5 },

  attachNote: { fontSize: 8.5, color: '#555', marginTop: 8, marginBottom: 6, textAlign: 'justify' },
  footer: { fontSize: 7.5, color: '#aaa', textAlign: 'center', marginTop: 12 },
});

const Field = ({ label, value, note }) => (
  <View>
    <View style={s.fieldRow}>
      <Text style={s.fieldLabel}>{label}</Text>
      <View style={s.dotBox}><Text style={s.fieldValue}>{value || ''}</Text></View>
    </View>
    {note ? <Text style={s.fieldNote}>{note}</Text> : null}
  </View>
);

const BlankLines = ({ count = 3 }) => (
  <View style={{ marginLeft: 152, marginBottom: 4 }}>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={s.blankLine} />
    ))}
  </View>
);

const FoundingAgreementPdf = ({ data = {} }) => {
  const {
    partners = [{ name: 'ლევან საჩიშვილი', personalId: '20001017959', address: 'ქ.თელავი, არაყიშვილის ქუჩა 2', share: 100 }],
    director = 'ლევან საჩიშვილი',
    directorId = '20001017959',
    directorAddress = 'ქ.თელავი, არაყიშვილის ქუჩა 2',
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

        {/* ── Title ── */}
        <View style={s.titleBlock}>
          <Text style={s.mainTitle}>სადამფუძნებლო შეთანხმება</Text>
          <Text style={s.subTitle}>{'(შეზღუდული პასუხისმგებლობის საზოგადოების სარეგისტრაციო მონაცემები / სარეგისტრაციო განაცხადი)'}</Text>
          <Text style={s.mandatoryNote}>{'* — სიმბოლოთი აღნიშნული ველების შევსება სავალდებულოა'}</Text>
        </View>
        <View style={s.divider} />

        {/* ── 1. Basic company info ── */}
        <Field label="სამართლებრივი ფორმა" value={'შეზღუდული პასუხისმგებლობის საზოგადოება'} />
        <Field
          label={'* საფირმო სახელწოდება (ქართ.)'}
          value={'შპს „ბილდექს ექსპერტიზა"'}
          note={'უნდა განისაზღვროს ქართულ ენაზე, „მეწარმეთა შესახებ" საქართველოს კანონით გათვალისწინებული წესით'}
        />
        <Field
          label={'* საფირმო სახელწოდება (ინგლ.)'}
          value={'Buildex Expertise LLC'}
          note={'უნდა შეესაბამებოდეს ქართულ ენაზე განსაზღვრულ სახელწოდებას'}
        />
        <Field
          label={'* იურიდიული მისამართი'}
          value={address}
          note={'საზოგადოების ფიზიკური (ფაქტობრივი) მისამართი'}
        />

        {/* ── 2. Capital ── */}
        <Text style={s.sectionLabel}>კაპიტალი (იმ შემთხვევაში, თუ განსაზღვრულია)</Text>
        <Field
          label={'ნებადართული კაპიტალი'}
          value={''}
          note={'კაპიტალის მაქსიმალური ოდენობა, რომ. ფარგლებში შპს-ს შეუძლია მომავალში მიიღოს წილების განთავსების გადაწყვეტილება'}
        />
        <Field
          label={'განთავსებული კაპიტალი'}
          value={''}
          note={'სამეწარმეო საზოგად. მიერ განსაზღვრული ფულადი ოდენობა — განაღდება რეგისტრაციის მომ-ისთვის სავალდებულო არ არის'}
        />
        <Field
          label={'* განთავს. წილ. რ-ნობა'}
          value={`${totalShares} ერთეული`}
          note={'წილ. ჯამური რ-ნობა, რომ. გასცა საზოგადოებამ — გამოხ. უნდა იყოს მთელი რიცხვით'}
        />
        <Field
          label={'ერთი წ. ნომ. ღირებ. (₾)'}
          value={''}
          note={'(კლასის არ მქონე წილისთვის)'}
        />

        {/* ── 3. Partners table ── */}
        <Text style={s.sectionLabel}>{'* პარტნიორები და პარტნიორთა წილობრივი მონაწილეობა განთავსებულ კაპიტალში'}</Text>
        <View style={s.tableHeader}>
          <Text style={[s.tc, { width: 18, fontWeight: 'bold' }]}>№</Text>
          <Text style={[s.tc, { flex: 1, fontWeight: 'bold' }]}>
            {'პარტნიორი / პარტნიორები\n* ფიზ. პ: სახელი, გვარი, პ/ნ, მისამართი'}
          </Text>
          <Text style={[s.tc, { width: 60, textAlign: 'center', fontWeight: 'bold' }]}>
            {'წილის\nოდენობა *\n(ერთ.)'}
          </Text>
          <Text style={[s.tc, { width: 65, textAlign: 'center', fontWeight: 'bold' }]}>
            {'წილობრივი\nმონაწილ.\n* (%)'}
          </Text>
        </View>
        {partners.map((p, i) => (
          <View key={i} style={s.tableRow}>
            <Text style={[s.tc, { width: 18 }]}>{i + 1}</Text>
            <Text style={[s.tc, { flex: 1 }]}>{p.name}, პ/ნ: {p.personalId}{p.address ? `, მისამ.: ${p.address}` : ''}</Text>
            <Text style={[s.tc, { width: 60, textAlign: 'center' }]}>{p.share}</Text>
            <Text style={[s.tc, { width: 65, textAlign: 'center' }]}>{p.share}%</Text>
          </View>
        ))}
        <Text style={s.tableNote}>* წილ. ოდ. — მთელი რიცხვი (ერთ.); წილობ. მონ. — პროცენტებში</Text>

        {/* ── 4. Management ── */}
        <Text style={s.sectionLabel}>ხელმძღვანელი ორგანო</Text>
        <Field
          label={'ხელმძღვ. ორგ. დასახელება'}
          value={'დირექტორი'}
          note={'მაგ.: დირექტორი, დირექტორატი, დირექტ. საბჭო, პრეზიდიუმი და სხვა'}
        />
        <Field
          label={'* ხელმძღვ. ორგ. წევრი'}
          value={`${director}, პ/ნ: ${directorId}, მისამ.: ${directorAddress}`}
          note={'ფიზ. პ: სახ., გვ., პ/ნ, მისამ.; იურ. პ: სახ-ება, ს/კ; უფლ-ის ვადა (თუ განს.)'}
        />
        <Field
          label={'* წარმ. უფლებამ. ფარგლები'}
          value={representation}
          note={'ერთობლივი — ერთად; ერთპიროვნული — ცალ-ცალკე'}
        />
        <Field
          label={'* ავტ. გვ-ის ადმ. პასუხ. პირი'}
          value={director}
          note={'ხელმძღვ./წარმ. უფლ. პირი — რამდ. პირის შ. მიეთ. მხოლოდ ერთი'}
        />
        <Field
          label={'ელ. ფოსტა'}
          value={email}
          note={'ლათინური შრიფტით'}
        />
        <Field
          label={'ტელეფონი'}
          value={phone}
          note={'საქ-ში მოქმ. მობ. ოპ. მობ. ნ.'}
        />

        {/* ── 5. Supervisory board (blank) ── */}
        <Text style={s.sectionLabel}>სამეთვალყურეო საბჭო (არსებობის შემთხვევაში)</Text>
        <Field label={'სამ. საბ. წ-თა რაოდენობა'} value={''} note={'(რაოდენობა)'} />
        <Field label={'სამ. საბ. წევრები'} value={''} note={'ფიზ. პ: სახ., გვ., პ/ნ, მ.; იურ. პ: სახ-ება, ს/კ; ვადა (თუ განს.)'} />
        <BlankLines count={2} />

        {/* ── 6. Other management body (blank) ── */}
        <Text style={s.sectionLabel}>სხვა მმართველი ორგანო (არსებობის შემთხვევაში)</Text>
        <Field label={'მმ. ორგ. დასახელება'} value={''} />
        <Field label={'მმ. ორგ. წევრები'} value={''} note={'ფიზ. პ: სახ., გვ., პ/ნ, მ.; იურ. პ: სახ-ება, ს/კ; ვადა (თ. განს.)'} />
        <BlankLines count={2} />

        {/* ── 7. Prokura (blank) ── */}
        <Text style={s.sectionLabel}>გენ. სავაჭრო წარმ. / პროკურისტი (არსებობის შემ.)</Text>
        <BlankLines count={1} />

        {/* ── 8. Share manager (blank) ── */}
        <Text style={s.sectionLabel}>პარტნიორის წილის მმართველი (არსებობის შემ.)</Text>
        <BlankLines count={1} />

        {/* ── Annex note ── */}
        <View style={s.divider} />
        <Text style={s.attachNote}>
          {'დანართი: დამფუძნებლების/პარტნიორების მიერ შემუშავებული სამეწარმეო საზოგადოების წესდება, რომელიც წარმოადგენს სადამფუძნებლო შეთანხმების განუყოფელ ნაწილს.'}
        </Text>

        {/* ── Signatures ── */}
        <View style={s.sigSection}>
          {partners.map((p, i) => (
            <View key={i} style={s.sigBlock}>
              <Text style={s.sigName}>{p.name}</Text>
              <Text style={s.sigRole}>{'პარტნიორი / ხელმძღვანელობაზე და წარმომადგენლობაზე უფლებამოსილი პირი'}</Text>
              <View style={s.sigLineRow}>
                <Text style={s.sigLineText}>{'ხელმოწერა: ____________________________  /  '}{p.name.split(' ').pop()}{'  /'}</Text>
                <Text style={s.sigLineText}>{'თარიღი: '}{foundingDate}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={s.footer}>
          {'შპს „ბილდექს ექსპერტიზა"  |  ს/კ 431188010  |  სადამფუძნებლო შეთანხმება  |  '}{foundingDate}
        </Text>
      </Page>
    </Document>
  );
};

export default FoundingAgreementPdf;
