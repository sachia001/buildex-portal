import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf';

Font.register({ family: 'BPG Arial', src: fontPath });

const s = StyleSheet.create({
  page: { fontFamily: 'BPG Arial', padding: '50 55 60 55', fontSize: 10, lineHeight: 1.75 },
  watermark: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
  watermarkImg: { width: 320, opacity: 0.04 },
  centerBold: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginBottom: 3 },
  centerSub: { fontSize: 10, textAlign: 'center', color: '#444', marginBottom: 4 },
  centerSmall: { fontSize: 9, textAlign: 'center', color: '#666', marginBottom: 18 },
  cityDateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18, fontSize: 10 },
  articleTitle: { fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginTop: 14, marginBottom: 6, textDecoration: 'underline' },
  para: { fontSize: 10, textAlign: 'justify', marginBottom: 6 },
  paraIndent: { fontSize: 10, textAlign: 'justify', marginBottom: 5, marginLeft: 14 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#bbb', paddingVertical: 4 },
  tableCell: { fontSize: 9 },
  sigSection: { marginTop: 36 },
  sigTitle: { fontSize: 10, fontWeight: 'bold', marginBottom: 14 },
  sigRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sigBlock: { width: '44%' },
  sigBlockLabel: { fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  sigDetail: { fontSize: 9, color: '#444', marginBottom: 2 },
  sigLine: { borderTopWidth: 1, borderTopColor: '#000', marginTop: 32, paddingTop: 4, textAlign: 'center', fontSize: 8.5 },
  divider: { borderTopWidth: 0.5, borderTopColor: '#bbb', marginVertical: 12 },
  footer: { fontSize: 7.5, color: '#999', textAlign: 'center', marginTop: 20 },
});

const num = v => parseInt(v, 10) || 0;

const ShareTransferPdf = ({ data = {} }) => {
  const {
    transferType = 'gift',
    transferorName = 'ლევან საჩიშვილი',
    transferorId = '20001017959',
    transferorAddress = 'ქ. თელავი, ლეონიძის ქ. №22',
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
  const pct = num(sharePercent);
  const current = num(transferorCurrentShare);
  const remaining = current - pct;

  const giver = isGift ? 'ჩამჩუქებელი' : 'გამყიდველი';
  const receiver = isGift ? 'დასაჩუქრებული' : 'მყიდველი';
  const tName = transfereeName || '______________________';
  const tId = transfereeId || '______________________';
  const tAddr = transfereeAddress || '______________________';
  const pctStr = pct ? `${pct}%-ს (${pct} პროცენტს)` : '______%-ს';
  const curStr = current ? `${current}%-ს (${current} პროцენтს)` : '______%-ს';
  const remStr = remaining >= 0 ? `${remaining}%` : '____%';

  const a = (n) => isGift ? n : n + 1;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.watermark} fixed>
          <Image src="/logo.png" style={s.watermarkImg} />
        </View>

        {/* Title */}
        <Text style={s.centerBold}>
          {isGift ? 'ჩუქების ხელშეკრულება' : 'წილის ნასყიდობის ხელშეკრულება'}
        </Text>
        <Text style={s.centerSub}>
          {isGift
            ? 'შეზღუდული პასუხისმგებლობის საზოგადოება „ბილდექს ექსპერტიზა"-ში წილის სახელმწიფო სანოტარო მოწმობის გარეშე პირდაპირ გადაცემის შესახებ'
            : 'შეზღუდული პასუხისმგებლობის საზოგადოება „ბილდექს ექსპერტიზა"-ში წილის ნასყიდობის შესახებ'}
        </Text>
        {contractNumber
          ? <Text style={s.centerSmall}>№ {contractNumber}</Text>
          : <Text style={s.centerSmall}> </Text>}

        <View style={s.cityDateRow}>
          <Text>{city}</Text>
          <Text>{contractDate}</Text>
        </View>

        {/* Parties */}
        <Text style={s.articleTitle}>მუხლი 1. მხარეები</Text>
        <Text style={s.para}>
          {`1.1. ${giver}: ${transferorName}, საქართველოს მოქალაქე, პირადი ნომერი: ${transferorId}, მისამართი: ${transferorAddress} (შემდგომში — „${giver}").`}
        </Text>
        <Text style={s.para}>
          {`1.2. ${receiver}: ${tName}, პირადი ნომერი: ${tId}, მისამართი: ${tAddr} (შემდგომში — „${receiver}").`}
        </Text>
        <Text style={s.para}>
          {`${giver} და ${receiver} ერთობლივად მოიხსენიებიან „მხარეებად".`}
        </Text>

        {/* Subject */}
        <Text style={s.articleTitle}>მუხლი 2. ხელშეკრულების საგანი</Text>
        <Text style={s.para}>
          {`2.1. ${giver} ფლობს შეზღუდული პასუხისმგებლობის საზოგადოება „ბილდექს ექსპერტიზა" (საიდენტიფიკაციო კოდი: 431188010, შემდგომში — „საზოგადოება") საწესდებო კაპიტალის ${curStr}.`}
        </Text>
        <Text style={s.para}>
          {isGift
            ? `2.2. ${giver} საქართველოს სამოქალაქო კოდექსის 524-ე მუხლის შესაბამისად, ნებაყოფლობით, სრულად გაცნობიერებული ნებით და ანაზღაურების გარეშე, ჩუქების სახით გადასცემს ${receiver}-ს საზოგადოების საწესდებო კაპიტალის ${pctStr}. ${receiver} ადასტურებს, რომ იღებს ამ საჩუქარს.`
            : `2.2. ${giver} საქართველოს სამოქალაქო კოდექსის 477-ე მუხლის შესაბამისად ყიდის ${receiver}-ს საზოგადოების საწესდებო კაპიტალის ${pctStr}, ხოლო ${receiver} ყიდულობს ამ წილს ქვემოთ განსაზღვრულ პირობებში.`}
        </Text>
        {shareValue
          ? <Text style={s.para}>{`2.3. გადაცემული წილის ნომინალური (ბალანსური) ღირებულება შეადგენს: ${shareValue} (${shareValue}) ლარს.`}</Text>
          : null}
        <Text style={s.para}>
          {`2.4. წინამდებარე ხელშეკრულების გაფორმების შემდეგ საზოგადოებაში წილების განაწილება განისაზღვრება შემდეგნაირად:`}
        </Text>
        <View style={[s.tableRow, { backgroundColor: '#f5f5f5', paddingHorizontal: 8 }]}>
          <Text style={[s.tableCell, { flex: 1, fontWeight: 'bold' }]}>პარტნიორი</Text>
          <Text style={[s.tableCell, { width: 80, textAlign: 'center', fontWeight: 'bold' }]}>წილი (%)</Text>
        </View>
        <View style={[s.tableRow, { paddingHorizontal: 8 }]}>
          <Text style={[s.tableCell, { flex: 1 }]}>{transferorName} ({giver})</Text>
          <Text style={[s.tableCell, { width: 80, textAlign: 'center' }]}>{remStr}</Text>
        </View>
        <View style={[s.tableRow, { paddingHorizontal: 8 }]}>
          <Text style={[s.tableCell, { flex: 1 }]}>{tName} ({receiver})</Text>
          <Text style={[s.tableCell, { width: 80, textAlign: 'center' }]}>{pct ? `${pct}%` : '____%'}</Text>
        </View>
        {partners.filter(p => p.name !== transferorName && p.name !== transfereeName).map((p, i) => (
          <View key={i} style={[s.tableRow, { paddingHorizontal: 8 }]}>
            <Text style={[s.tableCell, { flex: 1 }]}>{p.name}</Text>
            <Text style={[s.tableCell, { width: 80, textAlign: 'center' }]}>{p.share}%</Text>
          </View>
        ))}

        {/* Price — sale only */}
        {!isGift && (
          <>
            <Text style={s.articleTitle}>მუხლი 3. ნასყიდობის ფასი და ანგარიშსწორება</Text>
            <Text style={s.para}>
              {`3.1. წილის ნასყიდობის საერთო ფასი შეადგენს: ${salePrice || '_______________'} (${salePrice || '_______________'}) ლარს.`}
            </Text>
            <Text style={s.para}>
              {`3.2. ანგარიშსწორება განხორციელდება შემდეგი წესით: ${paymentTerms || '_______________'}.`}
            </Text>
            <Text style={s.para}>
              {`3.3. ანგარიშსწორების განხორციელების ფაქტს ადასტურებს ორმხრივად გაფორმებული გადახდის ქვითარი ან/და საბანკო გადარიცხვის დამადასტურებელი დოკუმენტი.`}
            </Text>
          </>
        )}

        {/* Warranties */}
        <Text style={s.articleTitle}>მუხლი {a(3)}. გარანტიები და წარმომადგენლობა</Text>
        <Text style={s.para}>
          {`${a(3)}.1. ${giver} უზრუნველყოფს, რომ:`}
        </Text>
        <Text style={s.paraIndent}>
          {`(ა) გადაცემული წილი სრულად ეკუთვნის მას, თავისუფალია ნებისმიერი სახის ტვირთისაგან, გირავნობისაგან, დაყადაღებისა და მესამე პირების ნებისმიერი პრეტენზიისაგან;`}
        </Text>
        <Text style={s.paraIndent}>
          {`(ბ) ხელშეკრულების გაფორმებაზე მიღებულია ყველა საჭირო კორპორაციული გადაწყვეტილება, მათ შორის საზოგადოების ${current === pct ? 'ერთპიროვნული პარტნიორის გადაწყვეტილება' : 'პარტნიორთა კრების ოქმი'};`}
        </Text>
        <Text style={s.paraIndent}>
          {`(გ) წილის გასხვისება არ ეწინააღმდეგება საზოგადოების წესდებას, კანონმდებლობას ან მხარეებისათვის სავალდებულო სხვა სამართლებრივ ნორმას;`}
        </Text>
        <Text style={s.paraIndent}>
          {`(დ) საზოგადოების სხვა პარტნიო${remaining > 0 ? 'ებ' : ''}მ${remaining > 0 ? '' : 'ა'} განახორციელ${remaining > 0 ? 'ეს' : 'ა'} გასხვისებული წილის შეძენის უპირატესი უფლებაზე წერილობითი თავისა თავის გათავისუფლება ან ეს უფლება დადგენილია წინასწარ საზოგადოების წესდებით.`}
        </Text>

        {/* Obligations */}
        <Text style={s.articleTitle}>მუხლი {a(4)}. მხარეთა ვალდებულებები</Text>
        <Text style={s.para}>
          {`${a(4)}.1. ${giver} ვალდებულია:`}
        </Text>
        <Text style={s.paraIndent}>
          {`(ა) ხელშეკრულების გაფორმებიდან 10 (ათი) სამუშაო დღის ვადაში უზრუნველყოს სსიპ საჯარო რეესტრის ეროვნულ სააგენტოში (ნოტარიუსის ან სარეგისტრაციო სამსახურის მეშვეობით) შესაბამისი ცვლილების სახელმწიფო რეგისტრაცია;`}
        </Text>
        <Text style={s.paraIndent}>
          {`(ბ) გადასცეს ${receiver}-ს წილთან დაკავშირებული ყველა საჭირო დოკუმენტი.`}
        </Text>
        <Text style={s.para}>
          {`${a(4)}.2. ${receiver} ვალდებულია:`}
        </Text>
        <Text style={s.paraIndent}>
          {isGift
            ? `(ა) მიიღოს ჩუქებული წილი და, საჭიროების შემთხვევაში, ხელი მოაწეროს სარეგისტრაციო სამსახურში წარსადგენ ყველა დოკუმენტს.`
            : `(ა) ${paymentTerms ? `გადაიხადოს ნასყიდობის ფასი 3.2 პუნქტით განსაზღვრული წესით;` : 'გადაიხადოს ნასყიდობის ფასი შეთანხმებული წესით;'}`}
        </Text>
        <Text style={s.paraIndent}>
          {`(${isGift ? 'ბ' : 'ბ'}) დაეთანხმოს საზოგადოების წესდებასა და პარტნიორთა კრების მიმდინარე გადაწყვეტილებებს.`}
        </Text>
        <Text style={s.para}>
          {`${a(4)}.3. ${receiver} იძენს პარტნიორის სრულ უფლებამოსილებასა და კენჭისყრის უფლებას სსიპ საჯარო რეესტრის ეროვნულ სააგენტოში ცვლილების სახელმწიფო რეგისტრაციის მომენტიდან.`}
        </Text>

        {/* Final provisions */}
        <Text style={s.articleTitle}>მუხლი {a(5)}. დასკვნითი დებულებები</Text>
        <Text style={s.para}>
          {`${a(5)}.1. წინამდებარე ხელშეკრულება შედგენილია ქართულ ენაზე, 2 (ორ) ეგზემპლარად, ერთი-ერთი — თითოეული მხარისათვის. ორივე ეგზემპლარს თანაბარი იურიდიული ძალა გააჩნია.`}
        </Text>
        <Text style={s.para}>
          {`${a(5)}.2. ხელშეკრულება ძალაში შედის ორივე მხარის მიერ ხელმოწერის მომენტიდან.`}
        </Text>
        <Text style={s.para}>
          {`${a(5)}.3. ხელშეკრულებაში ცვლილებები შეიძლება შეტანილ იქნეს მხოლოდ მხარეთა წერილობითი თანხმობით.`}
        </Text>
        <Text style={s.para}>
          {`${a(5)}.4. ხელშეკრულებიდან გამომდინარე ან მასთან დაკავშირებული ნებისმიერი დავა, რომელიც ვერ გადაწყდება მოლაპარაკებების გზით, გადაიგზავნება საქართველოს საერთო სასამართლოებში, საქართველოს კანონმდებლობის შესაბამისად.`}
        </Text>
        {notaryName
          ? <Text style={s.para}>{`${a(5)}.5. ხელშეკრულება დამოწმებულია ნოტარიუსის მიერ: ${notaryName}.`}</Text>
          : null}

        {/* Signatures */}
        <View style={s.sigSection}>
          <Text style={s.sigTitle}>მხარეთა რეკვიზიტები და ხელმოწერები:</Text>
          <View style={s.sigRow}>
            <View style={s.sigBlock}>
              <Text style={s.sigBlockLabel}>{giver}:</Text>
              <Text style={s.sigDetail}>{transferorName}</Text>
              <Text style={s.sigDetail}>პ/ნ: {transferorId}</Text>
              <Text style={s.sigDetail}>{transferorAddress}</Text>
              <View style={s.sigLine}><Text>(ხელმოწერა / თარიღი)</Text></View>
            </View>
            <View style={s.sigBlock}>
              <Text style={s.sigBlockLabel}>{receiver}:</Text>
              <Text style={s.sigDetail}>{tName}</Text>
              <Text style={s.sigDetail}>პ/ნ: {tId}</Text>
              <Text style={s.sigDetail}>{tAddr}</Text>
              <View style={s.sigLine}><Text>(ხელმოწერა / თარიღი)</Text></View>
            </View>
          </View>
        </View>

        <Text style={s.footer}>
          {`${isGift ? 'ჩუქების ხელშეკრულება' : 'ნასყიდობის ხელშეკრულება'} | შპს „ბილდექს ექსპერტიზა" | ს/კ 431188010 | ${contractDate}`}
        </Text>
      </Page>
    </Document>
  );
};

export default ShareTransferPdf;
