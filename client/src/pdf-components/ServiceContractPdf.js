import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf';

Font.register({ family: 'BPG Arial', src: fontPath });

const s = StyleSheet.create({
  page: { fontFamily: 'BPG Arial', padding: '0 0 50 0', fontSize: 10, lineHeight: 1.7 },
  watermark: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
  watermarkImg: { width: 460, opacity: 0.2 },

  headerBar: { padding: '7 50', flexDirection: 'row', alignItems: 'center' },
  headerLogo: { width: 38, height: 38, marginRight: 12, objectFit: 'contain' },
  headerTextBlock: { flex: 1 },
  headerCompany: { color: '#003366', fontSize: 11, fontWeight: 'bold' },
  headerSub: { color: '#666', fontSize: 7.5, marginTop: 1 },
  dividerTop: { borderTopWidth: 0.8, borderTopColor: '#ccc' },

  body: { paddingHorizontal: 50, paddingTop: 16 },

  centerBold: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginBottom: 3 },
  centerSub: { fontSize: 9.5, textAlign: 'center', color: '#555', marginBottom: 3 },
  centerRef: { fontSize: 8.5, textAlign: 'center', color: '#888', marginBottom: 4 },
  centerNum: { fontSize: 9, textAlign: 'center', color: '#444', marginBottom: 14 },

  cityDateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, fontSize: 10 },
  divider: { borderTopWidth: 0.8, borderTopColor: '#003366', marginVertical: 8 },

  partiesBox: { borderWidth: 0.8, borderColor: '#003366', marginBottom: 12 },
  partyRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#dde' },
  partyLabel: { backgroundColor: '#eef2f6', width: 120, paddingVertical: 5, paddingHorizontal: 8, fontSize: 9, fontWeight: 'bold', flexShrink: 0 },
  partyData: { flex: 1, paddingVertical: 5, paddingHorizontal: 8, fontSize: 9 },

  artTitle: { fontSize: 10.5, fontWeight: 'bold', marginTop: 10, marginBottom: 4 },
  para: { fontSize: 10, textAlign: 'justify', marginBottom: 4, lineHeight: 1.7 },
  paraIn: { fontSize: 10, textAlign: 'justify', marginBottom: 3, marginLeft: 14, lineHeight: 1.7 },

  sigSection: { marginTop: 24 },
  sigRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sigBlock: { width: '44%' },
  sigBlockLabel: { fontSize: 10, fontWeight: 'bold', marginBottom: 3 },
  sigDetail: { fontSize: 9, color: '#444', marginBottom: 2 },
  sigLine: { borderBottomWidth: 0.5, borderBottomColor: '#555', marginTop: 36, width: 180 },
  sigLineLabel: { fontSize: 8.5, textAlign: 'left', marginTop: 3, color: '#333' },
  footer: { fontSize: 7.5, color: '#aaa', textAlign: 'center', marginTop: 16 },
});

const ServiceContractPdf = ({ data = {} }) => {
  const {
    contractNumber = '',
    contractDate = '',
    city = 'ქ. თელავი',
    clientType = 'physical',
    clientName = '______________________________',
    clientId = '______________________________',
    clientAddress = '______________________________',
    clientRepName = '',
    clientRepId = '',
    serviceType = 'შენობა-ნაგებობის ინსპექტირება',
    serviceScope = '',
    objectAddress = '______________________________',
    serviceFee = '_______________',
    paymentTerms = 'ანგარიშ-ფაქტურის გამოწერიდან 5 (ხუთი) სამუშაო დღის ვადაში',
    contractStart = '',
    contractEnd = '',
    vatIncluded = true,
  } = data;

  const isLegal = clientType === 'legal';

  const clientDesc = isLegal
    ? `${clientName}, ს/კ: ${clientId}, იურ. მისამ.: ${clientAddress}${clientRepName ? `, წარმომადგ.: ${clientRepName}${clientRepId ? ` (პ/ნ: ${clientRepId})` : ''}` : ''}`
    : `${clientName}, საქ. მოქ., პ/ნ: ${clientId}, მისამართი: ${clientAddress}`;

  const feeText = serviceFee
    ? `${serviceFee} (${serviceFee}) ლარი${vatIncluded ? ', დღგ-ის ჩათვლით' : ', დღგ-ის გარეშე'}`
    : '_______________  (_______________) ლარი';

  const termText = contractStart && contractEnd
    ? `${contractStart}-დან ${contractEnd}-მდე`
    : contractStart
    ? `${contractStart}-დან მომსახურების სრულ დასრულებამდე`
    : '______________________________';

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.watermark} fixed>
          <Image src="/logo.png" style={s.watermarkImg} />
        </View>

        {/* Header */}
        <View style={s.headerBar} fixed>
          <Image src="/logo.png" style={s.headerLogo} />
          <View style={s.headerTextBlock}>
            <Text style={s.headerCompany}>შპს „ბილდექს ექსპერტიზა"</Text>
            <Text style={s.headerSub}>A ტიპის ინსპექტირების ორგანო  |  ISO/IEC 17020:2012/2013  |  ს/კ 431188010</Text>
          </View>
        </View>
        <View style={s.dividerTop} />

        <View style={s.body}>
          {/* Title */}
          <Text style={s.centerBold}>მომსახურების ხელშეკრულება</Text>
          <Text style={s.centerSub}>{serviceType}</Text>
          <Text style={s.centerRef}>{`საქართველოს სამოქალაქო კოდექსი  |  „ინსპექტირების საქმიანობის შესახებ" საქართველოს კანონი`}</Text>
          {contractNumber
            ? <Text style={s.centerNum}>{`№ ${contractNumber}`}</Text>
            : <Text style={{ marginBottom: 14 }}> </Text>}

          <View style={s.cityDateRow}>
            <Text>{city}</Text>
            <Text>{contractDate}</Text>
          </View>

          {/* Parties box */}
          <View style={s.partiesBox}>
            <View style={[s.partyRow, { borderBottomWidth: 0 }]}>
              <Text style={[s.partyLabel, { backgroundColor: '#003366', color: '#fff' }]}>მხარეები</Text>
              <Text style={[s.partyData, { fontSize: 8, color: '#555' }]}>
                {`მომსახურების ხელშეკრულება — საქართველოს სამოქალაქო კოდექსის შესაბამისად`}
              </Text>
            </View>
            <View style={s.partyRow}>
              <Text style={s.partyLabel}>შემსრულებელი</Text>
              <Text style={s.partyData}>{`შპს „ბილდექს ექსპერტიზა", ს/კ: 431188010, საქართველო, ქ. თელავი, ლიონიძის ქ. №22; დირექტორი: ლევან საჩიშვილი`}</Text>
            </View>
            <View style={[s.partyRow, { borderBottomWidth: 0 }]}>
              <Text style={s.partyLabel}>დამკვეთი</Text>
              <Text style={s.partyData}>{clientDesc}</Text>
            </View>
          </View>

          {/* Art 1 */}
          <Text style={s.artTitle}>მუხლი 1. ხელშეკრულების საგანი</Text>
          <Text style={s.para}>{`1.1. წინამდებარე ხელშეკრულების საფუძველზე შემსრულებელი — შპს „ბილდექს ექსპერტიზა" (ISO/IEC 17020:2012/2013-ის შესაბამისად აკრედიტებული A ტიპის ინსპექტირების ორგანო) — ვალდებულია გაუწიოს დამკვეთს ${serviceType}-ის მომსახურება, ხოლო დამკვეთი ვალდებულია მიიღოს ეს მომსახურება და გადაიხადოს ხელშეკრულებით განსაზღვრული საფასური.`}</Text>
          <Text style={s.para}>{`1.2. ინსპექტირების ობიექტი: ${objectAddress}.`}</Text>
          {serviceScope
            ? <Text style={s.para}>{`1.3. მომსახურების მოცულობა: ${serviceScope}.`}</Text>
            : null}
          <Text style={s.para}>{`${serviceScope ? '1.4' : '1.3'}. შემსრულებელი ახორციელებს ინსპექტირებას ISO/IEC 17020:2012/2013 სტანდარტის, საქართველოს კანონმდებლობისა და დარგობრივი ნორმების შესაბამისად. ინსპექტირება მოიცავს ობიექტის ვიზუალურ შემოწმებასა და შესაბამის გაზომვებს, შედეგების ფიქსაციასა და ინსპექტირების ანგარიშის გაცემას.`}</Text>

          {/* Art 2 */}
          <Text style={s.artTitle}>მუხლი 2. მომსახურების პირობები და ვადები</Text>
          <Text style={s.para}>{`2.1. მომსახურების განხორციელების ვადა: ${termText}.`}</Text>
          <Text style={s.para}>{`2.2. ინსპექტირების კონკრეტული თარიღი (ან თარიღები) შეთანხმდება მხარეებს შორის ზეპირი ან წერილობითი კომუნიკაციით ხელშეკრულების ხელმოწერიდან 3 (სამი) სამუშაო დღის ვადაში.`}</Text>
          <Text style={s.para}>{`2.3. ინსპექტირების ანგარიში გამოიცემა ინსპექტირების ჩატარებიდან 5 (ხუთი) სამუშაო დღის ვადაში, თუ მხარეებს სხვაგვარად არ შეუთანხმდებიათ.`}</Text>
          <Text style={s.para}>{`2.4. შემსრულებლის ობიექტამდე გადაადგილებისათვის საჭირო ტრანსპორტირების ხარჯი ${serviceFee ? 'შეიცავს' : 'შეიძლება შეიცავდეს'} ანაზღაურებას ან ანაზღაურება განისაზღვრება ცალკე შეთანხმებით.`}</Text>

          {/* Art 3 */}
          <Text style={s.artTitle}>მუხლი 3. შემსრულებლის ვალდებულებები</Text>
          <Text style={s.para}>{`3.1. შემსრულებელი ვალდებულია:`}</Text>
          <Text style={s.paraIn}>{`(ა) ჩაატაროს ინსპექტირება ISO/IEC 17020:2012/2013 სტანდარტის, შესაბამისი ეროვნური სტანდარტებისა და ნორმატიული დოკუმენტების მოთხოვნათა სრული დაცვით;`}</Text>
          <Text style={s.paraIn}>{`(ბ) ინსპექტირება ჩაატაროს კვალიფიციური, კომპეტენტური და დამოუკიდებელი ინსპექტორი(ები)ს მიერ, რომლებიც არ იმყოფებიან ინტერესთა კონფლიქტში ობიექტთან ან დამკვეთთან;`}</Text>
          <Text style={s.paraIn}>{`(გ) გამოსცეს ინსპექტირების ოფიციალური ანგარიში — დამოწმებული უფლებამოსილი ინსპექტორის მიერ — 2.3 პუნქტით განსაზღვრულ ვადაში;`}</Text>
          <Text style={s.paraIn}>{`(დ) დამკვეთს დაუყოვნებლივ, გონივრულ ვადაში, შეატყობინოს ინსპექტირების ჩატარებისათვის შემაფერხებელი ნებისმიერი გარემოების შესახებ;`}</Text>
          <Text style={s.paraIn}>{`(ე) შეინახოს ინსპექტირებასთან დაკავშირებული ყველა ჩანაწერი, ფოტოგრაფია და სხვა მტკიცებულება არანაკლებ 5 (ხუთი) წლის ვადით;`}</Text>
          <Text style={s.paraIn}>{`(ვ) არ გაამჟღავნოს ინსპექტირებისას მიღებული კონფიდენციალური ინფორმაცია მესამე პირებს — გარდა კანონმდებლობით პირდაპირ განსაზღვრული შემთხვევებისა;`}</Text>
          <Text style={s.paraIn}>{`(ზ) უზრუნველყოს ინსპექტირების პროცედურების სრული სახელმძღვანელო დოკუმენტების შესაბამისობა ISO/IEC 17020:2012/2013-ის მოთხოვნებთან.`}</Text>

          {/* Art 4 */}
          <Text style={s.artTitle}>მუხლი 4. შემსრულებლის უფლებები</Text>
          <Text style={s.para}>{`4.1. შემსრულებელს უფლება აქვს:`}</Text>
          <Text style={s.paraIn}>{`(ა) მოითხოვოს დამკვეთისაგან ინსპექტირებისათვის საჭირო ყველა ტექნიკური, სამშენებლო და სხვა დოკუმენტაციის (პროექტი, ნებართვები, პასპორტები) წარდგენა — ინსპექტირების ჩატარებამდე 2 (ორი) სამუშაო დღით ადრე;`}</Text>
          <Text style={s.paraIn}>{`(ბ) დამოუკიდებლად შეარჩიოს ინსპექტირების მეთოდი, სტანდარტი და ტექნიკური პროცედურა — ISO/IEC 17020:2012/2013-ის შესაბამისად;`}</Text>
          <Text style={s.paraIn}>{`(გ) ინსპექტირება გადადოს ან განახლდეს, თუ ობიექტის მდგომარეობა ან ხელმისაწვდომობა ინსპექტირების ჩატარების შეუძლებელს ხდის — ამის შესახებ დამკვეთის წინასწარი შეტყობინებით;`}</Text>
          <Text style={s.paraIn}>{`(დ) მოითხოვოს მომსახურების ანაზღაურება ხელშეკრულებით განსაზღვრულ ოდენობასა და ვადაში;`}</Text>
          <Text style={s.paraIn}>{`(ე) ინსპექტირების ანგარიში გამოსცეს ობიექტური, მტკიცებულებებზე დაფუძნებული შედეგებით — დამოუკიდებლად, ნებისმიერი გარე ზეწოლისაგან თავისუფლად.`}</Text>

          {/* Art 5 */}
          <Text style={s.artTitle}>მუხლი 5. დამკვეთის ვალდებულებები</Text>
          <Text style={s.para}>{`5.1. დამკვეთი ვალდებულია:`}</Text>
          <Text style={s.paraIn}>{`(ა) შემსრულებელს შეუქმნას ინსპექტირების ჩასატარებლად საჭირო ყველა პირობა — მათ შორის, ობიექტზე, შესაბამის ფართზე, სისტემებსა და კომუნიკაციებზე სრული უსაფრთხო წვდომა;`}</Text>
          <Text style={s.paraIn}>{`(ბ) ინსპექტირების ჩატარებამდე 2 (ორი) სამუშაო დღით ადრე წარუდგინოს შემსრულებელს ინსპექტირებისთვის საჭირო ყველა ტექნიკური დოკუმენტაცია (არსებობის შემთხვევაში);`}</Text>
          <Text style={s.paraIn}>{`(გ) ინსპექტირების დღეს უზრუნველყოს კვალიფიციური წარმომადგენლის/პასუხისმგებელი პირის დასწრება ობიექტზე;`}</Text>
          <Text style={s.paraIn}>{`(დ) გადაიხადოს მომსახურების საფასური ამ ხელშეკრულების მე-7 მუხლით განსაზღვრულ ოდენობასა და ვადაში;`}</Text>
          <Text style={s.paraIn}>{`(ე) ინსპექტირების შეუძლებლობის ან გადადების შემთხვევაში შეატყობინოს შემსრულებელს არაუგვიანეს შეთანხმებული ვიზიტის დღის წინა 24 (ოცდაოთხი) საათისა;`}</Text>
          <Text style={s.paraIn}>{`(ვ) არ განახორციელოს ობიექტზე ცვლილება, სარემონტო სამუშაო ან სხვა ქმედება, რომელიც გააუარესებს ან შეცვლის ინსპექტირების შედეგებს.`}</Text>

          {/* Art 6 */}
          <Text style={s.artTitle}>მუხლი 6. დამკვეთის უფლებები</Text>
          <Text style={s.para}>{`6.1. დამკვეთს უფლება აქვს:`}</Text>
          <Text style={s.paraIn}>{`(ა) მიიღოს ინსპექტირების სრული ოფიციალური ანგარიში, ინსპექტირების შედეგებზე ყველა ჩანაწერი და, შეთანხმებისამებრ, ფოტომასალა;`}</Text>
          <Text style={s.paraIn}>{`(ბ) წარადგინოს მოტივირებული აპელაცია ინსპექტირების შედეგებთან დაკავშირებით შემსრულებლის სახელით — ISO/IEC 17020-ის 7.9 პუნქტის შესაბამისად;`}</Text>
          <Text style={s.paraIn}>{`(გ) მოითხოვოს შემსრულებლისაგან ინსპექტირების პროცედურების განმარტება;`}</Text>
          <Text style={s.paraIn}>{`(დ) ხელშეკრულების ვადამდე შეწყვეტის შემთხვევაში — 5 (ხუთი) სამუშაო დღით ადრე წერილობით გაფრთხილების პირობით — ისარგებლოს შეწყვეტის უფლებით; ასეთ შემთხვევაში დამკვეთი ვალდებულია გადაიხადოს უკვე შესრულებული სამუშაოს ღირებულება.`}</Text>

          {/* Art 7 */}
          <Text style={s.artTitle}>მუხლი 7. ანაზღაურება და გადახდის პირობები</Text>
          <Text style={s.para}>{`7.1. მომსახურების ჯამური საფასური შეადგენს: ${feeText}.`}</Text>
          <Text style={s.para}>{`7.2. გადახდა განხორციელდება შემდეგი წესით: ${paymentTerms}.`}</Text>
          <Text style={s.para}>{`7.3. გადახდა ხორციელდება საბანკო გადარიცხვის გზით შემსრულებლის საბანკო რეკვიზიტებზე, ანგარიშ-ფაქტურის საფუძველზე.`}</Text>
          <Text style={s.para}>{`7.4. ანგარიშ-ფაქტურის განსაზღვრულ ვადაში გადაუხდელობის შემთხვევაში დამკვეთი იხდის საჯარიმო სანქციას — დავალიანების 0.05 (ნულ მთელი ხუთი მეასედი) პროცენტს ყოველ ვადაგადაცილებულ კალენდარულ დღეზე.`}</Text>
          <Text style={s.para}>{`7.5. საფასურის გადახდა არ არის დამოკიდებული ინსპექტირების შედეგებზე — მათ შორის, შეუსაბამობის გამოვლენის ან შეუსაბამობის არარსებობის შემთხვევაში.`}</Text>

          {/* Art 8 */}
          <Text style={s.artTitle}>მუხლი 8. კონფიდენციალურობა</Text>
          <Text style={s.para}>{`8.1. მხარეები ვალდებულნი არიან კონფიდენციალურად შეინახონ ამ ხელშეკრულებით გათვალისწინებული მომსახურების შედეგები, ინსპექტირების ანგარიში და ხელშეკრულების პირობები — გარდა შემთხვევებისა, რომელიც კანონმდებლობით პირდაპირ არის გათვალისწინებული, ან ორივე მხარის წინასწარი წერილობითი თანხმობის შემთხვევებისა.`}</Text>
          <Text style={s.para}>{`8.2. შემსრულებელი, ISO/IEC 17020:2012/2013-ის 4.2 პუნქტის შესაბამისად, ვალდებულია დაიცვას დამკვეთის კომერციული საიდუმლოება, გარდა შემთხვევებისა, სადაც ინფორმაციის გამჟღავნება სახელმწიფო უსაფრთხოების ან საზოგადოებრივი ინტერესის უზრუნველსაყოფად კანონმდებლობითაა გათვალისწინებული.`}</Text>
          <Text style={s.para}>{`8.3. კონფიდენციალურობის ვალდებულება ვრცელდება ხელშეკრულების ძალაში შესვლიდან 5 (ხუთი) წლის განმავლობაში.`}</Text>

          {/* Art 9 */}
          <Text style={s.artTitle}>მუხლი 9. მხარეთა პასუხისმგებლობა</Text>
          <Text style={s.para}>{`9.1. შემსრულებელი პასუხისმგებელია ინსპექტირების ანგარიშში არსებული მნიშვნელოვანი შეცდომებისთვის, რომლებიც გამოწვეულია შემსრულებლის გულგრილობით ან უხეში უყურადღებობით — ასეთ შემთხვევაში შემსრულებელი ვალდებულია ჩაატაროს განმეორებითი ინსპექტირება ანაზღაურების გარეშე.`}</Text>
          <Text style={s.para}>{`9.2. შემსრულებლის პასუხისმგებლობა შემოიფარგლება მომსახურების საფასურის ოდენობით და არ ვრცელდება დამკვეთის 간접ზე, გაცდენილ მოგებაზე ან სხვა შედეგობრივ ზიანზე, გარდა განზრახ ბრალის შემთხვევებისა.`}</Text>
          <Text style={s.para}>{`9.3. შემსრულებლის ინსპექტირების ანგარიში ასახავს ობიექტის მდგომარეობას ინსპექტირების ჩატარების მომენტში და არ წარმოადგენს სამშენებლო, სამართლებრივ ან სადაზღვევო კონსულტაციას.`}</Text>
          <Text style={s.para}>{`9.4. დამკვეთის მხრიდან 5.1.(ე) პუნქტით გათვალისწინებული 24-საათიანი გაფრთხილების გარეშე ინსპექტირებაზე ჩასვლის ხელშეშლის ან ინსპექტირების გაუქმების შემთხვევაში, დამკვეთი ვალდებულია გადაიხადოს განმეორებითი ვიზიტის ხარჯი.`}</Text>
          <Text style={s.para}>{`9.5. არცერთი მხარე არ არის პასუხისმგებელი ვალდებულების შეუსრულებლობაზე, თუ ეს გამოწვეულია დაუძლეველი ძალის (force majeure) გარემოებებით. ასეთ შემთხვევაში დაზარალებული მხარე ვალდებულია 5 (ხუთი) სამუშაო დღის ვადაში შეატყობინოს მეორე მხარეს.`}</Text>

          {/* Art 10 */}
          <Text style={s.artTitle}>მუხლი 10. ხელშეკრულების ვადა და შეწყვეტა</Text>
          <Text style={s.para}>{`10.1. ხელშეკრულება ძალაში შედის ხელმოწერის მომენტიდან და მოქმედებს ინსპექტირების ანგარიშის გადაცემასა და მომსახურების სრული ანაზღაურებამდე.`}</Text>
          <Text style={s.para}>{`10.2. ხელშეკრულება შეიძლება ვადამდე შეწყდეს: (ა) ორივე მხარის წერილობითი შეთანხმებით; (ბ) ერთ-ერთი მხარის მიერ მეორე მხარის მნიშვნელოვანი ვალდებულების დარღვევის შემთხვევაში, 10 (ათი) კალენდარული დღის წერილობითი გაფრთხილების შემდეგ; (გ) კანონმდებლობით პირდაპირ გათვალისწინებულ სხვა შემთხვევებში.`}</Text>
          <Text style={s.para}>{`10.3. ხელშეკრულების შეწყვეტა არ ათავისუფლებს მხარეებს შეწყვეტამდე წარმოშობილი ვალდებულებებისაგან.`}</Text>

          {/* Art 11 */}
          <Text style={s.artTitle}>მუხლი 11. დავების გადაწყვეტა</Text>
          <Text style={s.para}>{`11.1. ხელშეკრულებიდან გამომდინარე ნებისმიერი დავა მხარეები ჯერ ვალდებულნი არიან გადაწყვიტონ მოლაპარაკებათა გზით. სადავო საკითხი წერილობით ეცნობება მეორე მხარეს; მხარეებს 20 (ოცი) კალენდარული დღე ეძლევათ შეთანხმებისათვის.`}</Text>
          <Text style={s.para}>{`11.2. ინსპექტირების ანგარიშის შედეგებზე უთანხმოების შემთხვევაში დამკვეთს შეუძლია ISO/IEC 17020-ის 7.9 პუნქტის შესაბამისად წარადგინოს ფორმალური სააპელაციო განცხადება შემსრულებლის ხარისხის სამსახურში.`}</Text>
          <Text style={s.para}>{`11.3. მოლაპარაკებებით შეუთანხმებლობის შემთხვევაში დავა გადაეცემა განსახილველად საქართველოს სასამართლოს — საქართველოს სამოქალაქო საპროცესო კოდექსის შესაბამისად.`}</Text>

          {/* Art 12 */}
          <Text style={s.artTitle}>მუხლი 12. დასკვნითი დებულებები</Text>
          <Text style={s.para}>{`12.1. ხელშეკრულება შედგენილია ქართულ ენაზე, 2 (ორ) თანაბარი იურიდიული ძალის მქონე ეგზემპლარად.`}</Text>
          <Text style={s.para}>{`12.2. ხელშეკრულებაში ნებისმიერი ცვლილება ან დამატება ძალაშია მხოლოდ ორივე მხარის მიერ ხელმოწერილი წერილობითი შეთანხმების სახით.`}</Text>
          <Text style={s.para}>{`12.3. ხელშეკრულების ნებისმიერი დებულების ბათილობა არ იწვევს ხელშეკრულების მთლიანად ბათილობას.`}</Text>
          <Text style={s.para}>{`12.4. ამ ხელშეკრულებაში მოუწესრიგებელ ყველა საკითხზე გამოიყენება საქართველოს კანონმდებლობა.`}</Text>
          <Text style={s.para}>{`12.5. მხარეთა შეტყობინებები წარმოებს წერილობით — ელ. ფოსტის, ნოტარიული ან სასამართლო გზავნილის სახით, ხელშეკრულებაში მითითებულ მისამართებზე.`}</Text>

          <View style={s.divider} />

          {/* Signatures */}
          <View style={s.sigSection}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 12 }}>მხარეთა რეკვიზიტები და ხელმოწერები:</Text>
            <View style={s.sigRow}>
              <View style={s.sigBlock}>
                <Text style={s.sigBlockLabel}>შემსრულებელი:</Text>
                <Text style={s.sigDetail}>{`შპს „ბილდექს ექსპერტიზა"`}</Text>
                <Text style={s.sigDetail}>{`ს/კ: 431188010`}</Text>
                <Text style={s.sigDetail}>{`ქ. თელავი, ლიონიძის ქ. №22`}</Text>
                <Text style={s.sigDetail}>{`ტელ.: +995 511 747 400`}</Text>
                <Text style={s.sigDetail}>{`ელ-ფოსტა: info@buildexexpertise.com`}</Text>
                <View style={s.sigLine} />
                <Text style={s.sigLineLabel}>{`დირექტორი / საჩიშვილი /`}</Text>
              </View>
              <View style={s.sigBlock}>
                <Text style={s.sigBlockLabel}>დამკვეთი:</Text>
                <Text style={s.sigDetail}>{clientName}</Text>
                <Text style={s.sigDetail}>{isLegal ? `ს/კ: ${clientId}` : `პ/ნ: ${clientId}`}</Text>
                <Text style={s.sigDetail}>{clientAddress}</Text>
                {isLegal && clientRepName
                  ? <Text style={s.sigDetail}>{`წარმ.: ${clientRepName}`}</Text>
                  : null}
                <View style={s.sigLine} />
                <Text style={s.sigLineLabel}>{`/ ხელმოწერა /`}</Text>
              </View>
            </View>
          </View>

          <Text style={s.footer}>
            {`შპს „ბილდექს ექსპერტიზა"  |  ს/კ 431188010  |  მომსახურების ხელშეკრ. №${contractNumber}  |  ${contractDate}`}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ServiceContractPdf;
