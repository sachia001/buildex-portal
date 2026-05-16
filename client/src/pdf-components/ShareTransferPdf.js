import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf';

Font.register({ family: 'BPG Arial', src: fontPath });

const s = StyleSheet.create({
  page: { fontFamily: 'BPG Arial', padding: '0 0 50 0', fontSize: 10, lineHeight: 1.75 },
  watermark: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
  watermarkImg: { width: 460, opacity: 0.3 },

  headerBar: { padding: '8 50', flexDirection: 'row', alignItems: 'center' },
  headerLogo: { width: 40, height: 40, marginRight: 14, objectFit: 'contain' },
  headerTextBlock: { flex: 1 },
  headerCompany: { color: '#003366', fontSize: 11, fontWeight: 'bold' },
  headerSub: { color: '#666', fontSize: 7.5, marginTop: 1 },
  dividerGold: { borderTopWidth: 2, borderTopColor: '#c8a84b' },

  body: { paddingHorizontal: 50, paddingTop: 22 },

  centerBold: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginBottom: 3 },
  centerSub: { fontSize: 9.5, textAlign: 'center', color: '#555', marginBottom: 3 },
  centerRef: { fontSize: 8.5, textAlign: 'center', color: '#888', marginBottom: 4 },
  centerNum: { fontSize: 9, textAlign: 'center', color: '#444', marginBottom: 18 },

  cityDateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14, fontSize: 10 },
  divider: { borderTopWidth: 0.8, borderTopColor: '#003366', marginVertical: 10 },

  artTitle: { fontSize: 10.5, fontWeight: 'bold', marginTop: 12, marginBottom: 5 },
  para: { fontSize: 10, textAlign: 'justify', marginBottom: 5, lineHeight: 1.75 },
  paraIn: { fontSize: 10, textAlign: 'justify', marginBottom: 4, marginLeft: 14, lineHeight: 1.75 },

  tableHeader: { flexDirection: 'row', backgroundColor: '#eef2f6', paddingVertical: 4, paddingHorizontal: 6, marginBottom: 1 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ccc', paddingVertical: 4, paddingHorizontal: 6 },
  tc: { fontSize: 9 },

  partiesBox: { borderWidth: 0.8, borderColor: '#003366', marginBottom: 12 },
  partyRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#dde' },
  partyLabel: { backgroundColor: '#eef2f6', width: 115, paddingVertical: 6, paddingHorizontal: 8, fontSize: 9, fontWeight: 'bold', flexShrink: 0 },
  partyData: { flex: 1, paddingVertical: 6, paddingHorizontal: 8, fontSize: 9 },

  sigSection: { marginTop: 32 },
  sigTitle: { fontSize: 10, fontWeight: 'bold', marginBottom: 14 },
  sigRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sigBlock: { width: '44%' },
  sigBlockLabel: { fontSize: 10, fontWeight: 'bold', marginBottom: 3 },
  sigDetail: { fontSize: 9, color: '#444', marginBottom: 2 },
  sigLine: { borderBottomWidth: 0.5, borderBottomColor: '#555', marginTop: 40, width: 180 },
  sigLineLabel: { fontSize: 8.5, textAlign: 'left', marginTop: 3, color: '#333' },
  footer: { fontSize: 7.5, color: '#aaa', textAlign: 'center', marginTop: 20 },
});

const num = v => parseInt(v, 10) || 0;

const ShareTransferPdf = ({ data = {} }) => {
  const {
    transferType = 'gift',
    transferorName = 'ლევან საჩიშვილი',
    transferorId = '20001017959',
    transferorAddress = 'ქ. თელავი, ლიონიძის ქ. №22',
    transferorCurrentShare = '100',
    transfereeName = '',
    transfereeId = '',
    transfereeAddress = '',
    sharePercent = '',
    shareValue = '',
    salePrice = '',
    paymentTerms = '',
    contractDate = '',
    contractNumber = '',
    city = 'ქ. თელავი',
    notaryName = '',
    partners = [],
  } = data;

  const isGift = transferType === 'gift';
  const pct    = num(sharePercent);
  const cur    = num(transferorCurrentShare);
  const rem    = cur - pct;

  const tName  = transfereeName  || '______________________________';
  const tId    = transfereeId    || '______________________________';
  const tAddr  = transfereeAddress || '______________________________';
  const pctStr = pct ? `${pct}%-ს (${pct} პროცენტს)` : '__%-ს';
  const curStr = cur ? `${cur}%-ს (${cur} პროცენტს)` : '__%-ს';
  const remStr = rem >= 0 ? `${rem}%` : '____%';

  const art = n => isGift ? n : n + 1;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.watermark} fixed>
          <Image src="/logo.png" style={s.watermarkImg} />
        </View>

        {/* ── Header ── */}
        <View style={s.headerBar} fixed>
          <Image src="/logo.png" style={s.headerLogo} />
          <View style={s.headerTextBlock}>
            <Text style={s.headerCompany}>შპს „ბილდექს ექსპერტიზა"</Text>
            <Text style={s.headerSub}>A ტიპის ინსპექტირების ორგანო  |  ISO/IEC 17020:2012/2013  |  ს/კ 431188010</Text>
          </View>
        </View>
        <View style={s.dividerGold} />

        <View style={s.body}>
          {/* ── Title ── */}
          <Text style={s.centerBold}>
            {isGift
              ? 'წილის უსასყიდლოდ დათმობის ხელშეკრულება'
              : 'წილის ნასყიდობის ხელშეკრულება'}
          </Text>
          <Text style={s.centerSub}>
            {isGift
              ? 'შეზღუდული პასუხისმგებლობის საზოგადოება „ბილდექს ექსპერტიზა"-ში წილის უსასყიდლო გადაცემის შესახებ'
              : 'შეზღუდული პასუხისმგებლობის საზოგადოება „ბილდექს ექსპერტიზა"-ში წილის გაყიდვა-შეძენის შესახებ'}
          </Text>
          <Text style={s.centerRef}>
            {isGift
              ? 'სამოქალაქო კოდექსი მ. 524-528  |  მეწარმეთა შესახებ კანონი'
              : 'სამოქალაქო კოდექსი მ. 477-503  |  მეწარმეთა შესახებ კანონი'}
          </Text>
          {contractNumber
            ? <Text style={s.centerNum}>{`№ ${contractNumber}`}</Text>
            : <Text style={{ marginBottom: 18 }}> </Text>}

          <View style={s.cityDateRow}>
            <Text>{city}</Text>
            <Text>{contractDate}</Text>
          </View>

          {/* ── Parties box ── */}
          <View style={s.partiesBox}>
            <View style={[s.partyRow, { borderBottomWidth: 0 }]}>
              <Text style={[s.partyLabel, { backgroundColor: '#003366', color: '#fff' }]}>მხარეები</Text>
              <Text style={[s.partyData, { fontSize: 8, color: '#555' }]}>
                {isGift ? 'ჩუქება — სამოქ. კოდ. 524-ე მუხლის საფუძველზე' : 'ნასყიდობა — სამოქ. კოდ. 477-ე მუხლის საფუძველზე'}
              </Text>
            </View>
            <View style={s.partyRow}>
              <Text style={s.partyLabel}>წილის დამთმობი</Text>
              <Text style={s.partyData}>{`${transferorName}, საქ. მოქ., პ/ნ: ${transferorId}, მისამართი: ${transferorAddress}`}</Text>
            </View>
            <View style={[s.partyRow, { borderBottomWidth: 0 }]}>
              <Text style={s.partyLabel}>წილის შემძენი</Text>
              <Text style={s.partyData}>{`${tName}, პ/ნ: ${tId}, მისამართი: ${tAddr}`}</Text>
            </View>
          </View>

          {/* ── Art 1: Subject ── */}
          <Text style={s.artTitle}>მუხლი 1. ხელშეკრულების საგანი</Text>
          <Text style={s.para}>
            {`1.1. წილის დამთმობი — ${transferorName} — ფლობს შეზღუდული პასუხისმგებლობის საზოგადოება „ბილდექს ექსპერტიზა" (საიდენტიფიკაციო კოდი: 431188010, შემდგომში — „საზოგადოება") საწესდებო კაპიტალის ${curStr}. წინამდებარე ხელშეკრულებით წილის დამთმობი ${isGift ? 'უსასყიდლოდ, ჩუქების სახით' : 'ნასყიდობის გზით'} გადასცემს წილის შემძენს — ${tName} — საზოგადოებაში მის მიერ ფლობილი წილიდან ${pctStr}.`}
          </Text>
          {shareValue
            ? <Text style={s.para}>{`1.2. გადაცემული წილის ნომინალური (ბალანსური) ღირებულება: ${shareValue} ლარი.`}</Text>
            : null}
          <Text style={s.para}>
            {`${shareValue ? '1.3' : '1.2'}. ხელშეკრულების გაფორმების შემდეგ საზოგადოებაში წილების განაწილება ასახულია ქვემოთ:`}
          </Text>

          {/* Share table */}
          <View style={s.tableHeader}>
            <Text style={[s.tc, { flex: 1, fontWeight: 'bold' }]}>პარტნიორი</Text>
            <Text style={[s.tc, { width: 100, textAlign: 'center', fontWeight: 'bold' }]}>წილი ხელშეკრ.-მდე</Text>
            <Text style={[s.tc, { width: 100, textAlign: 'center', fontWeight: 'bold' }]}>წილი ხელშეკრ.-შემდეგ</Text>
          </View>
          <View style={s.tableRow}>
            <Text style={[s.tc, { flex: 1 }]}>{transferorName} (წილის დამთმობი)</Text>
            <Text style={[s.tc, { width: 100, textAlign: 'center' }]}>{cur ? `${cur}%` : '—'}</Text>
            <Text style={[s.tc, { width: 100, textAlign: 'center' }]}>{remStr}</Text>
          </View>
          <View style={s.tableRow}>
            <Text style={[s.tc, { flex: 1 }]}>{tName} (წილის შემძენი)</Text>
            <Text style={[s.tc, { width: 100, textAlign: 'center' }]}>—</Text>
            <Text style={[s.tc, { width: 100, textAlign: 'center' }]}>{pct ? `${pct}%` : '—'}</Text>
          </View>
          {partners.filter(p => p.name !== transferorName && p.name !== transfereeName).map((p, i) => (
            <View key={i} style={s.tableRow}>
              <Text style={[s.tc, { flex: 1 }]}>{p.name}</Text>
              <Text style={[s.tc, { width: 100, textAlign: 'center' }]}>{p.share}%</Text>
              <Text style={[s.tc, { width: 100, textAlign: 'center' }]}>{p.share}%</Text>
            </View>
          ))}

          {/* ── Art 2: Price (sale only) ── */}
          {!isGift && (
            <View>
              <Text style={s.artTitle}>მუხლი 2. ნასყიდობის ფასი და ანგარიშსწორება</Text>
              <Text style={s.para}>
                {`2.1. წილის ნასყიდობის ფასი, რომელიც შეთანხმებულია მხარეებს შორის, შეადგენს: ${salePrice || '_______________'} (${salePrice || '_______________'}) ლარს.`}
              </Text>
              <Text style={s.para}>
                {`2.2. ნასყიდობის ფასი გადახდილი იქნება შემდეგი წესით: ${paymentTerms || '_______________'}.`}
              </Text>
              <Text style={s.para}>
                {`2.3. გადახდის ფაქტი დასტურდება ორმხრივად ხელმოწერილი ქვითრით ან საბანკო გადარიცხვის დამადასტურებელი დოკუმენტით.`}
              </Text>
              <Text style={s.para}>
                {`2.4. ნასყიდობის ფასის სრულად გადახდამდე წილის შემძენი ვერ ახდენს წილით განკარგვის სამართლებრივ მოქმედებებს.`}
              </Text>
            </View>
          )}

          {/* ── Warranties ── */}
          <Text style={s.artTitle}>{`მუხლი ${art(2)}. მხარეთა გარანტიები და წარმომადგენლობა`}</Text>
          <Text style={s.para}>{`${art(2)}.1. წილის დამთმობი ადასტურებს და გარანტიას იძლევა, რომ:`}</Text>
          <Text style={s.paraIn}>{`(ა) გადაცემული წილი სრულად და უდავოდ ეკუთვნის მას, თავისუფალია ნებისმიერი სახის გირავნობის, ყადაღის, ტვირთის ან/და მესამე პირთა პრეტენზიისაგან;`}</Text>
          <Text style={s.paraIn}>{`(ბ) წილის დამთმობის წინაშე არ არსებობს გადაუხდელი ვალდებულებები, რომლებიც შეიძლება გადავიდეს წილის შემძენზე;`}</Text>
          <Text style={s.paraIn}>{`(გ) ხელშეკრულების გაფორმებაზე მიღებულია ყველა საჭირო კორპორაციული გადაწყვეტილება — ${partners.length === 1 ? 'ერთპიროვნული პარტნიორის გადაწყვეტილება' : 'პარტნიორთა კრების ოქმი'};`}</Text>
          <Text style={s.paraIn}>{`(დ) წილის გასხვისება არ ეწინააღმდეგება საზოგადოების წესდებას, „მეწარმეთა შესახებ" საქართველოს კანონს და მოქმედ კანონმდებლობას;`}</Text>
          <Text style={s.paraIn}>{`(ე) ${isGift ? 'ჩუქება განხორციელებულია ნებაყოფლობით, სრული ქმედუნარიანობით და ნათელი ნებით' : 'ნასყიდობა განხორციელებულია ნებაყოფლობით, სამართლიანი ბაზრის პირობებში'};`}</Text>
          <Text style={s.paraIn}>{`(ვ) საზოგადოების სხვა პარტნიორ(ებ)მა გამოიყენეს ან წერილობით უარი განაცხადეს წილის უპირატეს შესყიდვის უფლებაზე, ან ეს უფლება გამომდინარეობს საზოგადოების წესდებიდან.`}</Text>
          <Text style={s.para}>{`${art(2)}.2. წილის შემძენი ადასტურებს, რომ:`}</Text>
          <Text style={s.paraIn}>{`(ა) გაეცნო საზოგადოების წესდებასა და პარტნიორთა კრების მოქმედ გადაწყვეტილებებს;`}</Text>
          <Text style={s.paraIn}>{`(ბ) ${isGift ? 'მიიღო საჩუქარი ნებაყოფლობით და სრული გაცნობიერებით' : 'შეათანხმა ყველა პირობა წილის დამთმობთან'};`}</Text>
          <Text style={s.paraIn}>{`(გ) ეთანხმება საზოგადოების წესდებას და კისრულობს პარტნიორის ყველა ვალდებულებას.`}</Text>

          {/* ── Obligations ── */}
          <Text style={s.artTitle}>{`მუხლი ${art(3)}. მხარეთა ვალდებულებები`}</Text>
          <Text style={s.para}>{`${art(3)}.1. წილის დამთმობი ვალდებულია:`}</Text>
          <Text style={s.paraIn}>{`(ა) ხელშეკრულების გაფორმებიდან 10 (ათი) სამუშაო დღის ვადაში სსიპ საჯარო რეესტრის ეროვნულ სააგენტოში (ნოტარიუსის ან სარეგისტრაციო სამსახურის მეშვეობით) განახორციელოს სახელმწიფო რეგისტრაცია;`}</Text>
          <Text style={s.paraIn}>{`(ბ) გადასცეს წილის შემძენს წილთან დაკავშირებული ყველა საჭირო დოკუმენტი.`}</Text>
          <Text style={s.para}>{`${art(3)}.2. წილის შემძენი ვალდებულია:`}</Text>
          <Text style={s.paraIn}>{isGift
            ? `(ა) მიიღოს გადაცემული წილი და ხელი მოაწეროს სარეგისტრაციო სამსახურში წარსადგენ ყველა დოკუმენტს;`
            : `(ა) ${paymentTerms ? `გადაიხადოს ნასყიდობის ფასი 2.2 პუნქტით განსაზღვრული წესით;` : 'გადაიხადოს ნასყიდობის ფასი შეთანხმებული წესით;'}`}
          </Text>
          <Text style={s.paraIn}>{`(${isGift ? 'ბ' : 'ბ'}) იკისროს საზოგადოების პარტნიორის ყველა უფლება-მოვალეობა;`}</Text>
          <Text style={s.paraIn}>{`(${isGift ? 'გ' : 'გ'}) ხელი შეუწყოს სახელმწიფო რეგისტრაციის განხორციელებას.`}</Text>
          <Text style={s.para}>{`${art(3)}.3. წილის შემძენი იძენს პარტნიორის სრულ კანონიერ სტატუსს — მათ შორის კენჭისყრის, ინფორმაციის მიღებისა და დივიდენდის გამართვის უფლებებს — სსიპ საჯარო რეესტრის ეროვნულ სააგენტოში შესაბამისი ცვლილების სახელმწიფო რეგისტრაციის მომენტიდან.`}</Text>

          {/* ── Confidentiality ── */}
          <Text style={s.artTitle}>{`მუხლი ${art(4)}. კონფიდენციალურობა`}</Text>
          <Text style={s.para}>{`${art(4)}.1. მხარეები ვალდებულნი არიან არ გაამჟღავნონ ამ ხელშეკრულების პირობები და მათი შინაარსი მესამე პირთათვის, გარდა კანონმდებლობის პირდაპირი მოთხოვნის შემთხვევებისა.`}</Text>
          <Text style={s.para}>{`${art(4)}.2. კონფიდენციალურობის ვალდებულება ძალაშია ხელშეკრულების ძალაში შესვლიდან 5 (ხუთი) წლის განმავლობაში.`}</Text>

          {/* ── Disputes ── */}
          <Text style={s.artTitle}>{`მუხლი ${art(5)}. დავების გადაწყვეტა`}</Text>
          <Text style={s.para}>{`${art(5)}.1. ხელშეკრულებიდან გამომდინარე ან მასთან დაკავშირებული ყოველი დავა მხარეები ვალდებულნი არიან გადაწყვიტონ მოლაპარაკებათა გზით, გონივრულ ვადაში.`}</Text>
          <Text style={s.para}>{`${art(5)}.2. შეუთანხმებლობის შემთხვევაში დავა გადაწყდება საქართველოს სასამართლოში, საქართველოს კანონმდებლობის შესაბამისად.`}</Text>

          {/* ── Final provisions ── */}
          <Text style={s.artTitle}>{`მუხლი ${art(6)}. დასკვნითი დებულებები`}</Text>
          <Text style={s.para}>{`${art(6)}.1. წინამდებარე ხელშეკრულება შედგენილია ქართულ ენაზე, 2 (ორ) თანაბარი იურიდიული ძალის მქონე ეგზემპლარად, თითო — თითოეული მხარისათვის.`}</Text>
          <Text style={s.para}>{`${art(6)}.2. ხელშეკრულება ძალაში შედის ორივე მხარის მიერ ხელმოწერის მომენტიდან.`}</Text>
          <Text style={s.para}>{`${art(6)}.3. ხელშეკრულებაში ნებისმიერი ცვლილება ან დამატება ძალაშია მხოლოდ მხარეთა ხელმოწერილი წერილობითი შეთანხმების სახით.`}</Text>
          <Text style={s.para}>{`${art(6)}.4. ხელშეკრულების ნებისმიერი მუხლის ბათილობა არ იწვევს ხელშეკრულების მთლიანად ბათილობას.`}</Text>
          <Text style={s.para}>{`${art(6)}.5. წინამდებარე ხელშეკრულებაზე ვრცელდება საქართველოს კანონმდებლობა.`}</Text>
          {notaryName
            ? <Text style={s.para}>{`${art(6)}.6. ხელშეკრულება დამოწმებულია ნოტარიუსის მიერ: ${notaryName}.`}</Text>
            : null}

          {/* ── Signatures ── */}
          <View style={s.sigSection}>
            <Text style={s.sigTitle}>მხარეთა რეკვიზიტები და ხელმოწერები:</Text>
            <View style={s.sigRow}>
              <View style={s.sigBlock}>
                <Text style={s.sigBlockLabel}>წილის დამთმობი:</Text>
                <Text style={s.sigDetail}>{transferorName}</Text>
                <Text style={s.sigDetail}>{`პ/ნ: ${transferorId}`}</Text>
                <Text style={s.sigDetail}>{transferorAddress}</Text>
                <View style={s.sigLine} />
                <Text style={s.sigLineLabel}>{`/ ${transferorName.split(' ').pop()} /`}</Text>
              </View>
              <View style={s.sigBlock}>
                <Text style={s.sigBlockLabel}>წილის შემძენი:</Text>
                <Text style={s.sigDetail}>{tName}</Text>
                <Text style={s.sigDetail}>{`პ/ნ: ${tId}`}</Text>
                <Text style={s.sigDetail}>{tAddr}</Text>
                <View style={s.sigLine} />
                <Text style={s.sigLineLabel}>{`/ ${transfereeName ? transfereeName.split(' ').pop() : '———'} /`}</Text>
              </View>
            </View>
          </View>

          <Text style={s.footer}>
            {`${isGift ? 'წილის უსასყიდლოდ დათმობის ხელშეკრ.' : 'წილის ნასყიდობის ხელშეკრ.'}  |  შპს „ბილდექს ექსპერტიზა"  |  ს/კ 431188010  |  ${contractDate}`}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ShareTransferPdf;
