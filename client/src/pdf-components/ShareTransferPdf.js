import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf';

Font.register({ family: 'BPG Arial', src: fontPath });

const s = StyleSheet.create({
  page: { fontFamily: 'BPG Arial', padding: '36 0 42 0', fontSize: 9.5, lineHeight: 1.6 },
  watermark: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
  watermarkImg: { width: 460, opacity: 0.2 },

  headerBar: { padding: '7 32 7 60', flexDirection: 'row', alignItems: 'center' },
  headerLogo: { width: 36, height: 36, marginRight: 12, objectFit: 'contain' },
  headerTextBlock: { flex: 1 },
  headerCompany: { color: '#003366', fontSize: 10.5, fontWeight: 'bold' },
  headerSub: { color: '#666', fontSize: 7, marginTop: 1 },
  dividerGold: { borderTopWidth: 0.8, borderTopColor: '#ccc' },

  body: { paddingLeft: 60, paddingRight: 32, paddingTop: 10 },

  centerBold: { fontSize: 11.5, fontWeight: 'bold', textAlign: 'center', marginBottom: 2 },
  centerSub: { fontSize: 8.5, textAlign: 'center', color: '#555', marginBottom: 2 },
  centerRef: { fontSize: 7.5, textAlign: 'center', color: '#888', marginBottom: 2 },
  centerNum: { fontSize: 9, textAlign: 'center', color: '#444', marginBottom: 7 },

  cityDateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6, fontSize: 9 },
  divider: { borderTopWidth: 0.8, borderTopColor: '#003366', marginVertical: 4 },

  artTitle: { fontSize: 9.5, fontWeight: 'bold', marginTop: 5, marginBottom: 2 },
  para: { fontSize: 9, textAlign: 'justify', marginBottom: 2, lineHeight: 1.5 },
  paraIn: { fontSize: 9, textAlign: 'justify', marginBottom: 1, marginLeft: 12, lineHeight: 1.5 },

  tableHeader: { flexDirection: 'row', backgroundColor: '#eef2f6', paddingVertical: 3, paddingHorizontal: 5, marginBottom: 1 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ccc', paddingVertical: 3, paddingHorizontal: 5 },
  tc: { fontSize: 8.5 },

  partiesBox: { borderWidth: 0.8, borderColor: '#003366', marginBottom: 8 },
  partyRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#dde' },
  partyLabel: { backgroundColor: '#eef2f6', width: 110, paddingVertical: 4, paddingHorizontal: 7, fontSize: 8.5, fontWeight: 'bold', flexShrink: 0 },
  partyData: { flex: 1, paddingVertical: 4, paddingHorizontal: 7, fontSize: 8.5 },

  sigSection: { marginTop: 8 },
  sigTitle: { fontSize: 9.5, fontWeight: 'bold', marginBottom: 6 },
  sigRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  sigBlock: { width: '44%', marginBottom: 8 },
  sigBlockLabel: { fontSize: 9, fontWeight: 'bold', marginBottom: 2 },
  sigDetail: { fontSize: 8.5, color: '#444', marginBottom: 1 },
  sigLine: { borderBottomWidth: 0.5, borderBottomColor: '#555', marginTop: 14, width: 170 },
  sigLineLabel: { fontSize: 8, textAlign: 'left', marginTop: 2, color: '#333' },
  footer: { fontSize: 7, color: '#aaa', textAlign: 'center', marginTop: 10 },
});

const num = v => parseInt(v, 10) || 0;

const numWord = n => ({ 2: 'ორ', 3: 'სამ', 4: 'ოთხ', 5: 'ხუთ' }[n] || String(n));

const ShareTransferPdf = ({ data = {} }) => {
  const {
    transferType = 'gift',
    transferorName = 'ლევან საჩიშვილი',
    transferorId = '20001017959',
    transferorAddress = 'ქ. თელავი, ლიონიძის ქ. №22',
    transferorCurrentShare = '100',
    shareValue = '',
    paymentTerms = '',
    contractDate = '',
    contractNumber = '',
    city = 'ქ. თელავი',
    notaryName = '',
    partners = [],
    withSignature = false,
  } = data;

  const transferees = data.transferees || [];
  const isGift = transferType === 'gift';
  const isMulti = transferees.length > 1;
  const tLabel = isMulti ? 'წილის შემძენები' : 'წილის შემძენი';

  const totalPct = transferees.reduce((s, t) => s + (num(t.sharePercent)), 0);
  const cur = num(transferorCurrentShare);
  const rem = cur - totalPct;
  const remStr = rem >= 0 ? `${rem}%` : '____%';
  const curStr = cur ? `${cur}%-ს (${cur} პროცენტს)` : '__%-ს';

  const totalSale = transferees.reduce((s, t) => s + (num(t.salePrice)), 0);

  const art = n => isGift ? n : n + 1;

  const totalCount = transferees.length + 1;

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
        <View style={s.dividerGold} />

        <View style={s.body}>
          {/* Title */}
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
            {'საქართველოს სამოქალაქო კოდექსი  |  „მეწარმეთა შესახებ" საქართველოს კანონი'}
          </Text>
          <Text style={s.centerNum}>{contractNumber ? `№ ${contractNumber}` : '№ ______'}</Text>

          <View style={s.cityDateRow}>
            <Text>{city}</Text>
            <Text>{contractDate}</Text>
          </View>

          {/* Parties box */}
          <View style={s.partiesBox}>
            <View style={[s.partyRow, { borderBottomWidth: 0 }]}>
              <Text style={[s.partyLabel, { backgroundColor: '#003366', color: '#fff' }]}>მხარეები</Text>
              <Text style={[s.partyData, { fontSize: 8, color: '#555' }]}>
                {isGift ? 'წილის უსასყიდლო გადაცემა — საქართველოს სამოქალაქო კოდექსის შესაბამისად' : 'წილის ნასყიდობა — საქართველოს სამოქალაქო კოდექსის შესაბამისად'}
              </Text>
            </View>
            <View style={s.partyRow}>
              <Text style={s.partyLabel}>წილის დამთმობი</Text>
              <Text style={s.partyData}>{`${transferorName}, საქ. მოქ., პ/ნ: ${transferorId}, მისამართი: ${transferorAddress}`}</Text>
            </View>
            {transferees.map((t, i) => (
              <View key={i} style={[s.partyRow, i === transferees.length - 1 ? { borderBottomWidth: 0 } : {}]}>
                <Text style={s.partyLabel}>{isMulti ? `წილის შემძენი ${i + 1}` : 'წილის შემძენი'}</Text>
                <Text style={s.partyData}>{`${t.name || '______________________________'}, პ/ნ: ${t.id || '______________________________'}, მისამართი: ${t.address || '______________________________'}`}</Text>
              </View>
            ))}
            {transferees.length === 0 && (
              <View style={[s.partyRow, { borderBottomWidth: 0 }]}>
                <Text style={s.partyLabel}>წილის შემძენი</Text>
                <Text style={s.partyData}>{'______________________________, პ/ნ: ______________________________, მისამართი: ______________________________'}</Text>
              </View>
            )}
          </View>

          {/* Art 1: Subject */}
          <Text style={s.artTitle}>მუხლი 1. ხელშეკრულების საგანი</Text>
          {isMulti ? (
            <View>
              <Text style={s.para}>
                {`1.1. წილის დამთმობი — ${transferorName} — ფლობს შეზღუდული პასუხისმგებლობის საზოგადოება „ბილდექს ექსპერტიზა" (საიდენტიფიკაციო კოდი: 431188010, შემდგომში — „საზოგადოება") საწესდებო კაპიტალის ${curStr}. წინამდებარე ხელშეკრულებით წილის დამთმობი ${isGift ? 'უსასყიდლოდ, ჩუქების სახით' : 'ნასყიდობის გზით'} გადასცემს შემდეგ პირებს:`}
              </Text>
              {transferees.map((t, i) => (
                <Text key={i} style={s.paraIn}>{`— ${t.name || '______'}: ${t.sharePercent || '__'}%-ს (${t.sharePercent || '__'} პროცენტს);`}</Text>
              ))}
            </View>
          ) : (
            <Text style={s.para}>
              {`1.1. წილის დამთმობი — ${transferorName} — ფლობს შეზღუდული პასუხისმგებლობის საზოგადოება „ბილდექს ექსპერტიზა" (საიდენტიფიკაციო კოდი: 431188010, შემდგომში — „საზოგადოება") საწესდებო კაპიტალის ${curStr}. წინამდებარე ხელშეკრულებით წილის დამთმობი ${isGift ? 'უსასყიდლოდ, ჩუქების სახით' : 'ნასყიდობის გზით'} გადასცემს ${tLabel}ს — ${transferees[0]?.name || '______________________________'} — საზოგადოებაში მის მიერ ფლობილი წილიდან ${transferees[0]?.sharePercent || '__'}%-ს (${transferees[0]?.sharePercent || '__'} პროცენტს).`}
            </Text>
          )}
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
            <Text style={[s.tc, { flex: 1 }]}>{`${transferorName} (წილის დამთმობი)`}</Text>
            <Text style={[s.tc, { width: 100, textAlign: 'center' }]}>{cur ? `${cur}%` : '—'}</Text>
            <Text style={[s.tc, { width: 100, textAlign: 'center' }]}>{remStr}</Text>
          </View>
          {transferees.map((t, i) => (
            <View key={i} style={s.tableRow}>
              <Text style={[s.tc, { flex: 1 }]}>{`${t.name || '______'} (${isMulti ? `წილის შემძენი ${i + 1}` : 'წილის შემძენი'})`}</Text>
              <Text style={[s.tc, { width: 100, textAlign: 'center' }]}>—</Text>
              <Text style={[s.tc, { width: 100, textAlign: 'center' }]}>{t.sharePercent ? `${t.sharePercent}%` : '—'}</Text>
            </View>
          ))}
          {transferees.length === 0 && (
            <View style={s.tableRow}>
              <Text style={[s.tc, { flex: 1 }]}>{`${tLabel}`}</Text>
              <Text style={[s.tc, { width: 100, textAlign: 'center' }]}>—</Text>
              <Text style={[s.tc, { width: 100, textAlign: 'center' }]}>—</Text>
            </View>
          )}
          {partners.filter(p => {
            const tNames = transferees.map(t => t.name);
            return p.name !== transferorName && !tNames.includes(p.name);
          }).map((p, i) => (
            <View key={i} style={s.tableRow}>
              <Text style={[s.tc, { flex: 1 }]}>{p.name}</Text>
              <Text style={[s.tc, { width: 100, textAlign: 'center' }]}>{`${p.share}%`}</Text>
              <Text style={[s.tc, { width: 100, textAlign: 'center' }]}>{`${p.share}%`}</Text>
            </View>
          ))}

          {/* Art 2: Price (sale only) */}
          {!isGift && (
            <View>
              <Text style={s.artTitle}>მუხლი 2. ნასყიდობის ფასი და ანგარიშსწორება</Text>
              {isMulti ? (
                <View>
                  <Text style={s.para}>
                    {`2.1. წილის ნასყიდობის ჯამური ფასი, რომელიც შეთანხმებულია მხარეებს შორის, შეადგენს: ${totalSale || '_______________'} (${totalSale || '_______________'}) ლარს, შემდეგი განაწილებით:`}
                  </Text>
                  {transferees.map((t, i) => (
                    <Text key={i} style={s.paraIn}>{`— ${t.name || '______'}: ${t.salePrice || '_______________'} ლარი;`}</Text>
                  ))}
                </View>
              ) : (
                <Text style={s.para}>
                  {`2.1. წილის ნასყიდობის ფასი, რომელიც შეთანხმებულია მხარეებს შორის, შეადგენს: ${transferees[0]?.salePrice || '_______________'} (${transferees[0]?.salePrice || '_______________'}) ლარს.`}
                </Text>
              )}
              <Text style={s.para}>
                {`2.2. ნასყიდობის ფასი გადახდილი იქნება შემდეგი წესით: ${paymentTerms || '_______________'}.`}
              </Text>
              <Text style={s.para}>
                {'2.3. გადახდის ფაქტი დასტურდება ორმხრივად ხელმოწერილი ქვითრით ან საბანკო გადარიცხვის დამადასტურებელი დოკუმენტით.'}
              </Text>
              <Text style={s.para}>
                {`2.4. ნასყიდობის ფასის სრულად გადახდამდე ${tLabel} ვერ ახდენს წილით განკარგვის სამართლებრივ მოქმედებებს.`}
              </Text>
            </View>
          )}

          {/* Art: Warranties */}
          <Text style={s.artTitle}>{`მუხლი ${art(2)}. მხარეთა გარანტიები და წარმომადგენლობა`}</Text>
          <Text style={s.para}>{`${art(2)}.1. წილის დამთმობი ადასტურებს და გარანტიას იძლევა, რომ:`}</Text>
          <Text style={s.paraIn}>{`(ა) გადაცემული წილი კანონიერად და უდავოდ ეკუთვნის მას, რეგისტრირებულია სსიპ საჯარო რეესტრის ეროვნულ სააგენტოში მის სახელზე და სრულად თავისუფალია ნებისმიერი გირავნობის, ყადაღის, ტვირთის, სასარჩელო მოთხოვნის ან მესამე პირის უფლების, პრეტენზიისა ან შეზღუდვისაგან;`}</Text>
          <Text style={s.paraIn}>{`(ბ) წილის დამთმობი სრულად ქმედუნარიანია; მის მიმართ არ მიმდინარეობს და დაწყებული არ ყოფილა გადახდისუუნარობის, გაკოტრების ან სხვა ანალოგიური სასამართლო ან ადმინისტრაციული პროცედურა;`}</Text>
          <Text style={s.paraIn}>{`(გ) ხელშეკრულების გაფორმებაზე მიღებულია ყველა საჭირო კორპორაციული გადაწყვეტილება — ${partners.length === 1 ? 'ერთპიროვნული პარტნიორის გადაწყვეტილება' : 'პარტნიორთა კრების ოქმი'} — „მეწარმეთა შესახებ" საქართველოს კანონისა და საზოგადოების წესდების შესაბამისად;`}</Text>
          <Text style={s.paraIn}>{`(დ) საზოგადოების სხვა პარტნიორებს, ასეთის არსებობის შემთხვევაში, შეთავაზებულ იქნა წილის უპირატეს შეძენის უფლება „მეწარმეთა შესახებ" საქართველოს კანონის შესაბამისად, ან ეს უფლება კანონით ან წესდებით გამოირიცხება;`}</Text>
          <Text style={s.paraIn}>{`(ე) გადაცემული წილი სრულად განთავსებულ კაპიტალს წარმოადგენს; არ არსებობს დაუფარავი შენატანის ვალდებულება ან საზოგადოების წინაშე სხვა გადაუხდელი ვალი, რომელიც შეიძლება გადაეცეს ${tLabel}ს;`}</Text>
          <Text style={s.paraIn}>{`(ვ) წილის გასხვისება არ ეწინააღმდეგება საზოგადოების წესდებას, პარტნიორთა შეთანხმებას, „მეწარმეთა შესახებ" საქართველოს კანონს და სხვა მოქმედ კანონმდებლობას;`}</Text>
          <Text style={s.paraIn}>{`(ზ) ${isGift ? 'ჩუქება განხორციელებულია ნებაყოფლობით, სრული ქმედუნარიანობით და ნათელი ნებით' : 'ნასყიდობა განხორციელებულია ნებაყოფლობით, სამართლიანი პირობებით, ყოველგვარი იძულების გარეშე'}.`}</Text>
          <Text style={s.para}>{`${art(2)}.2. ${tLabel} ადასტურებს და გარანტიას იძლევა, რომ:`}</Text>
          <Text style={s.paraIn}>{`(ა) სრულად გაეცნო საზოგადოების სადამფუძნებლო დოკუმენტებს, წესდებას, ბოლო საფინანსო ანგარიშგებასა და პარტნიორთა კრების მოქმედ გადაწყვეტილებებს და მათ შინაარსზე პრეტენზია არ გააჩნია;`}</Text>
          <Text style={s.paraIn}>{`(ბ) სრულად გაეცნო გადაცემული წილის სამართლებრივ სტატუსს, ღირებულებას და ყველა დაკავშირებულ გარემოებას; წილი შეიძინა ჯეროვანი სიფრთხილის განხორციელების შემდეგ;`}</Text>
          <Text style={s.paraIn}>{`(გ) სრულად ქმედუნარიანია; მის მიმართ არ მიმდინარეობს გადახდისუუნარობის, გაკოტრების ან სხვა ანალოგიური პროცედურა;`}</Text>
          <Text style={s.paraIn}>{`(დ) ${isGift ? 'ჩუქება მიღებულია ნებაყოფლობით, სრული გაცნობიერებით, ყოველგვარი ზეწოლის გარეშე' : 'წილის შეძენა ხდება ნებაყოფლობით, სამართლიანი პირობებით'};`}</Text>
          <Text style={s.paraIn}>{`(ე) ეთანხმება საზოგადოების წესდებასა და პარტნიორთა კრების მოქმედ გადაწყვეტილებებს და კისრულობს პარტნიორის ყველა უფლება-მოვალეობას „მეწარმეთა შესახებ" საქართველოს კანონის შესაბამისად.`}</Text>

          {/* Art: Transferor obligations */}
          <Text style={s.artTitle}>{`მუხლი ${art(3)}. წილის დამთმობის ვალდებულებები`}</Text>
          <Text style={s.para}>{`${art(3)}.1. წილის დამთმობი ვალდებულია:`}</Text>
          <Text style={s.paraIn}>{`(ა) ხელშეკრულების ხელმოწერიდან 10 (ათი) სამუშაო დღის ვადაში მოამზადოს და წარადგინოს სსიპ საჯარო რეესტრის ეროვნულ სააგენტოში სახელმწიფო რეგისტრაციისათვის საჭირო ყველა დოკუმენტი — ნოტარიუსის ან სარეგისტრაციო სამსახურის მეშვეობით;`}</Text>
          <Text style={s.paraIn}>{`(ბ) გადასცეს ${tLabel}ს ხელშეკრულების ხელმოწერილი ეგზემპლარი, შესაბამისი კორპორაციული გადაწყვეტილება წილის გადაცემის შესახებ და წილის სტატუსთან დაკავშირებული ყველა სხვა სათანადო დოკუმენტი;`}</Text>
          <Text style={s.paraIn}>{`(გ) ხელშეკრულების ხელმოწერიდან 5 (ხუთი) სამუშაო დღის ვადაში გონივრულ ვადაში აცნობოს საზოგადოების ხელმძღვანელობას წილის გადაცემის შესახებ;`}</Text>
          <Text style={s.paraIn}>{`(დ) ხელშეკრულების ხელმოწერიდან სახელმწიფო რეგისტრაციის დასრულებამდე არ განახორციელოს წილთან დაკავშირებული რაიმე დამატებითი სამართლებრივი ქმედება — გირავნობა, ყადაღა, სხვა პირზე გადაცემა ან სხვა განკარგვა;`}</Text>
          <Text style={s.paraIn}>{`(ე) სრულად ითანამშრომლოს ${tLabel}თან და სსიპ საჯარო რეესტრის ეროვნულ სააგენტოსთან სახელმწიფო რეგისტრაციის ოპერატიულად განხორციელებისათვის; ნებისმიერი ხარვეზის ან მოთხოვნის შემთხვევაში ოპერატიულად წარადგინოს დამატებითი დოკუმენტები;`}</Text>
          <Text style={s.paraIn}>{isGift
            ? `(ვ) ჩუქების გამოხმობის კანონით გათვალისწინებული საფუძვლების არარსებობის შემთხვევაში, ხელი არ შეუშალოს სახელმწიფო რეგისტრაციის განხორციელებას.`
            : `(ვ) გადასცეს ${tLabel}ს ბოლო 3 (სამი) საფინანსო წლის ანგარიშგება (ან ყველა ხელმისაწვდომი ანგარიშგება, თუ საზოგადოება 3 წელზე ნაკლები ხნის წინ დაფუძნდა) და ნებისმიერი სხვა ინფორმაცია, რომელიც ${tLabel}ს ესაჭიროება.`}
          </Text>
          <Text style={s.para}>{`${art(3)}.2. სახელმწიფო რეგისტრაციამდე წილის დამთმობი რჩება საზოგადოების პარტნიორად და პასუხისმგებელია პარტნიორის ყველა ვალდებულებაზე.`}</Text>

          {/* Art: Transferor rights */}
          <Text style={s.artTitle}>{`მუხლი ${art(4)}. წილის დამთმობის უფლებები`}</Text>
          <Text style={s.para}>{`${art(4)}.1. წილის დამთმობს უფლება აქვს:`}</Text>
          <Text style={s.paraIn}>{isGift
            ? `(ა) გამოიხმოს ჩუქება საქართველოს სამოქალაქო კოდექსით გათვალისწინებულ შემთხვევებში — კერძოდ, თუ წილის შემძენი მძიმე დანაშაულს ჩაიდენს წილის დამთმობის ან მისი ახლო ნათესავის წინააღმდეგ, ან თუ ჩუქება წილის დამთმობს შეუძლებელს გახდის საკუთარი ან მასზე დამოკიდებული პირის სარჩოს;`
            : `(ა) მოითხოვოს ნასყიდობის ფასის სრული გადახდა ხელშეკრულებაში განსაზღვრული ვადების და პირობების შესაბამისად;`}
          </Text>
          <Text style={s.paraIn}>{`(ბ) მოითხოვოს ${tLabel}საგან სახელმწიფო რეგისტრაციისათვის საჭირო ყველა დოკუმენტის დროული გამოყოფა და ხელმოწერა;`}</Text>
          <Text style={s.paraIn}>{`(გ) მიიღოს სრული ინფორმაცია სახელმწიფო რეგისტრაციის პროცედურის მდგომარეობის შესახებ;`}</Text>
          <Text style={s.paraIn}>{`(დ) სასამართლოში სარჩელის წარდგენის გზით მოითხოვოს ვალდებულებების შესრულება ან/და ზიანის ანაზღაურება, თუ ${tLabel} არ ასრულებს ხელშეკრულებით ნაკისრ ვალდებულებებს;`}</Text>
          <Text style={s.paraIn}>{`(ე) ისარგებლოს „მეწარმეთა შესახებ" საქართველოს კანონითა და საქართველოს სამოქალაქო კოდექსით გათვალისწინებული სხვა ყველა კანონიერი უფლებით.`}</Text>

          {/* Art: Transferee obligations */}
          <Text style={s.artTitle}>{`მუხლი ${art(5)}. ${tLabel}ს ვალდებულებები`}</Text>
          <Text style={s.para}>{`${art(5)}.1. ${tLabel} ვალდებულია:`}</Text>
          {!isGift && (
            <Text style={s.paraIn}>{`(ა) გადაიხადოს ნასყიდობის ფასი ხელშეკრულების მე-2 მუხლში განსაზღვრული ოდენობით, ვადებითა და წესით; ფასის სრული გადახდამდე წილით განკარგვა ან გასხვისება დაუშვებელია;`}</Text>
          )}
          <Text style={s.paraIn}>{`(${isGift ? 'ა' : 'ბ'}) ხელი მოაწეროს სსიპ საჯარო რეესტრის ეროვნულ სააგენტოში წარსადგენ ყველა დოკუმენტს და ყველა ქმედება განახორციელოს, რომელიც საჭიროა სახელმწიფო რეგისტრაციის ოპერატიულად დასრულებისათვის;`}</Text>
          <Text style={s.paraIn}>{`(${isGift ? 'ბ' : 'გ'}) სახელმწიფო რეგისტრაციის განხორციელებისთანავე, შეასრულოს „მეწარმეთა შესახებ" საქართველოს კანონითა და საზოგადოების წესდებით დადგენილი პარტნიორის ყველა ვალდებულება — მათ შორის შენატანის ვალდებულება, კონფიდენციალურობა და ინფორმაციის გამჟღავნების შეზღუდვა;`}</Text>
          <Text style={s.paraIn}>{`(${isGift ? 'გ' : 'დ'}) გაიღოს სსიპ საჯარო რეესტრის ეროვნულ სააგენტოში ცვლილების სახელმწიფო რეგისტრაციის სახელმწიფო მოსაკრებელი, თუ მხარეებს სხვაგვარად არ შეუთანხმდებიათ;`}</Text>
          <Text style={s.paraIn}>{`(${isGift ? 'დ' : 'ე'}) ხელი შეუწყოს წილის დამთმობს ხელშეკრულებიდან გამომდინარე ყველა ვალდებულების სათანადოდ შესრულებაში;`}</Text>
          <Text style={s.paraIn}>{`(${isGift ? 'ე' : 'ვ'}) დაუყოვნებლივ, 3 (სამი) სამუშაო დღის ვადაში, შეატყობინოს წილის დამთმობს ნებისმიერი გარემოების შესახებ, რომელიც ხელს შეუშლის ან შეაფერხებს ამ ხელშეკრულებით ნაკისრი ვალდებულების შესრულებას.`}</Text>

          {/* Art: Transferee rights */}
          <Text style={s.artTitle}>{`მუხლი ${art(6)}. ${tLabel}ს უფლებები`}</Text>
          <Text style={s.para}>{`${art(6)}.1. სსიპ საჯარო რეესტრის ეროვნულ სააგენტოში ცვლილების სახელმწიფო რეგისტრაციის მომენტიდან ${tLabel} იძენს პარტნიორის სრულ კანონიერ სტატუსს, მათ შორის:`}</Text>
          <Text style={s.paraIn}>{`(ა) კენჭისყრის უფლება პარტნიორთა კრებებზე შეძენილი წილის პროპორციულად — საქართველოს კანონმდებლობით გათვალისწინებული ყველა საკითხის გადასაწყვეტად;`}</Text>
          <Text style={s.paraIn}>{`(ბ) საზოგადოების ფინანსური ანგარიშგების, სააღრიცხვო დოკუმენტაციის, პარტნიორთა კრების ოქმების და სხვა კორპორაციული დოკუმენტების გაცნობისა და ასლის მიღების უფლება;`}</Text>
          <Text style={s.paraIn}>{`(გ) მოგებაში (დივიდენდში) მონაწილეობის უფლება შეძენილი წილის პროპორციულად — პარტნიორთა კრების გადაწყვეტილებით განაწილებული მოგების ფარგლებში;`}</Text>
          <Text style={s.paraIn}>{`(დ) საზოგადოების ლიკვიდაციის შემთხვევაში, კრედიტორებთან ანგარიშსწორების შემდეგ დარჩენილი ქონების შეძენილი წილის პროპორციული ნაწილის მიღების უფლება;`}</Text>
          <Text style={s.paraIn}>{`(ე) „მეწარმეთა შესახებ" საქართველოს კანონითა და საზოგადოების წესდებით გათვალისწინებული სხვა ნებისმიერი პარტნიორის უფლების განხორციელება.`}</Text>
          <Text style={s.para}>{`${art(6)}.2. ${tLabel}ს უფლება აქვს სასამართლოში სარჩელის წარდგენის გზით მოითხოვოს ვალდებულებების შესრულება ან/და ზიანის ანაზღაურება, თუ წილის დამთმობი არ ასრულებს ხელშეკრულებით ნაკისრ ვალდებულებებს.`}</Text>

          {/* Art: Registration */}
          <Text style={s.artTitle}>{`მუხლი ${art(7)}. წილის გადაცემა და სახელმწიფო რეგისტრაცია`}</Text>
          <Text style={s.para}>{`${art(7)}.1. წილი ითვლება გადაცემულად სსიპ საჯარო რეესტრის ეროვნული სააგენტოს მიერ შესაბამისი ცვლილების სახელმწიფო რეგისტრაციის მომენტიდან. სახელმწიფო რეგისტრაციამდე წილთან დაკავშირებული ყველა კორპორაციული უფლება შენარჩუნებულია წილის დამთმობის სახელზე.`}</Text>
          <Text style={s.para}>{`${art(7)}.2. სახელმწიფო რეგისტრაცია წარმოებს „მეწარმეთა შესახებ" საქართველოს კანონისა და „სამეწარმეო რეესტრის შესახებ" ინსტრუქციის შესაბამისად. მხარეები ვალდებულნი არიან ნებისმიერი სარეგისტრაციო ხარვეზის ან სსიპ საჯარო რეესტრის ეროვნული სააგენტოს მოთხოვნის შემთხვევაში ოპერატიულად წარადგინონ დამატებითი დოკუმენტები.`}</Text>
          <Text style={s.para}>{`${art(7)}.3. სახელმწიფო რეგისტრაციასთან დაკავშირებული ყველა ხარჯი — სახელმწიფო მოსაკრებლის ჩათვლით — ეკისრება ${tLabel}ს, გარდა იმ შემთხვევისა, თუ მხარეებს სხვაგვარად შეუთანხმდებიათ.`}</Text>
          <Text style={s.para}>{`${art(7)}.4. მხარეები შეთანხმდნენ, რომ სსიპ საჯარო რეესტრის ეროვნულ სააგენტოს გადასაგზავნი განცხადება და სარეგისტრაციო პაკეტი ხელშეკრულების ხელმოწერიდან 10 (ათი) სამუშაო დღის ვადაში იქნება წარდგენილი.`}</Text>

          {/* Art: Liability */}
          <Text style={s.artTitle}>{`მუხლი ${art(8)}. მხარეთა პასუხისმგებლობა`}</Text>
          <Text style={s.para}>{`${art(8)}.1. ვალდებულების სათანადოდ შეუსრულებლობის ან არაჯეროვნად შესრულების შემთხვევაში დამრღვევი მხარე ვალდებულია სრულად აანაზღაუროს მეორე მხარის პირდაპირი ზარალი საქართველოს სამოქალაქო კოდექსის შესაბამისად.`}</Text>
          {!isGift && (
            <Text style={s.para}>{`${art(8)}.2. ნასყიდობის ფასის განსაზღვრულ ვადაში გადაუხდელობის შემთხვევაში ${tLabel} იხდის ფულად საჯარიმო სანქციას — გადასახდელი თანხის 0.05 (ნულ მთელი ხუთი მეასედი) პროცენტს ყოველ ვადაგადაცილებულ კალენდარულ დღეზე, ვადაგადაცილებულ თანხაზე გაანგარიშებით.`}</Text>
          )}
          <Text style={s.para}>{`${art(8)}.${isGift ? 2 : 3}. ${art(2)}-ე მუხლით გათვალისწინებული გარანტიების დარღვევის შედეგად წარმოშობილი სარჩელი შეიძლება წარდგინდეს ხელშეკრულების ძალაში შესვლიდან 3 (სამი) წლის ვადაში.`}</Text>
          <Text style={s.para}>{`${art(8)}.${isGift ? 3 : 4}. საჯარიმო სანქციისა ან ვალდებულების შეუსრულებლობის გამო ზიანის ანაზღაურება არ ათავისუფლებს დამრღვევ მხარეს ვალდებულების ბუნებრივი შესრულებისაგან.`}</Text>
          <Text style={s.para}>{`${art(8)}.${isGift ? 4 : 5}. არცერთი მხარე არ არის პასუხისმგებელი ვალდებულების შეუსრულებლობაზე, თუ ეს გამოწვეულია დაუძლეველი ძალის (force majeure) გარემოებით — სტიქიური უბედურება, სახელმწიფო ღონისძიება ან სხვა გარემოება, რომელიც გონივრული სიფრთხილით ვერ იქნებოდა გათვალისწინებული და რომლის თავიდან აცილება მხარის ძალებს სცილდება. ასეთ შემთხვევაში დაზარალებული მხარე ვალდებულია 5 (ხუთი) სამუშაო დღის ვადაში შეატყობინოს მეორე მხარეს.`}</Text>

          {/* Art: Confidentiality */}
          <Text style={s.artTitle}>{`მუხლი ${art(9)}. კონფიდენციალურობა`}</Text>
          <Text style={s.para}>{`${art(9)}.1. მხარეები ვალდებულნი არიან, სახელმწიფო რეგისტრაციამდე და მის შემდეგ, არ გაამჟღავნონ ამ ხელშეკრულების პირობები, შინაარსი და მასთან დაკავშირებული კომერციული ინფორმაცია მესამე პირთათვის, გარდა კანონმდებლობის პირდაპირი მოთხოვნის, სასამართლოს განჩინების ან ორივე მხარის წინასწარი წერილობითი თანხმობის შემთხვევებისა.`}</Text>
          <Text style={s.para}>{`${art(9)}.2. კონფიდენციალურობის ვალდებულება ვრცელდება ხელშეკრულების ძალაში შესვლიდან 5 (ხუთი) წლის განმავლობაში.`}</Text>
          <Text style={s.para}>{`${art(9)}.3. კონფიდენციალურობის ვალდებულების დარღვევა წარმოშობს ზიანის ანაზღაურების მოთხოვნის უფლებას.`}</Text>

          {/* Art: Disputes */}
          <Text style={s.artTitle}>{`მუხლი ${art(10)}. დავების გადაწყვეტა`}</Text>
          <Text style={s.para}>{`${art(10)}.1. ხელშეკრულებიდან გამომდინარე ან მასთან დაკავშირებული ნებისმიერი დავა მხარეები ვალდებულნი არიან ჯერ გადაწყვიტონ მოლაპარაკებათა გზით. სადავო საკითხი წერილობით ეცნობება მეორე მხარეს; მხარეებს 20 (ოცი) კალენდარული დღე ეძლევათ მოლაპარაკებისათვის.`}</Text>
          <Text style={s.para}>{`${art(10)}.2. მოლაპარაკებებით შეუთანხმებლობის შემთხვევაში დავა გადაეცემა განსახილველად საქართველოს სასამართლოს — საქართველოს სამოქალაქო საპროცესო კოდექსით დადგენილი ტერიტორიული კომპეტენციის შესაბამისად.`}</Text>
          <Text style={s.para}>{`${art(10)}.3. ამ ხელშეკრულებაზე ყველა საკითხში, რომელიც ხელშეკრულებით პირდაპირ არ არის მოწესრიგებული, გამოიყენება საქართველოს კანონმდებლობა.`}</Text>

          {/* Art: Final provisions — force new page so art11 + signatures share one page */}
          <Text break style={s.artTitle}>{`მუხლი ${art(11)}. დასკვნითი დებულებები`}</Text>
          <Text style={s.para}>{`${art(11)}.1. წინამდებარე ხელშეკრულება შედგენილია ქართულ ენაზე, ${totalCount} (${numWord(totalCount)}) თანაბარი იურიდიული ძალის მქონე ეგზემპლარად, თითო — თითოეული მხარისათვის.`}</Text>
          <Text style={s.para}>{`${art(11)}.2. ხელშეკრულება ძალაში შედის ყველა მხარის მიერ ხელმოწერის მომენტიდან.`}</Text>
          <Text style={s.para}>{`${art(11)}.3. ხელშეკრულებაში ნებისმიერი ცვლილება ან დამატება ძალაშია მხოლოდ ყველა მხარის მიერ ხელმოწერილი წერილობითი შეთანხმების სახით.`}</Text>
          <Text style={s.para}>{`${art(11)}.4. ხელშეკრულების რომელიმე დებულების ბათილობა ან გამოუყენებლობა არ იწვევს ხელშეკრულების დანარჩენი ნაწილის ბათილობას; ასეთ შემთხვევაში მხარეები ვალდებულნი არიან ჩაანაცვლონ ბათილი პირობა ახლით, რომელიც მაქსიმალურად ახლოს იქნება თავდაპირველ სამართლებრივ და ეკონომიკურ შედეგთან.`}</Text>
          <Text style={s.para}>{`${art(11)}.5. მხარეთა ნებისმიერი შეტყობინება ხელშეკრულებასთან დაკავშირებით წარმოებს წერილობით — ელექტრონული ფოსტის, ნოტარიული ან სასამართლო გზავნილის სახით, ხელშეკრულებაში მითითებულ მისამართებზე.`}</Text>
          <Text style={s.para}>{`${art(11)}.6. წინამდებარე ხელშეკრულება ჩაანაცვლებს ამ ხელშეკრულების საგანთან დაკავშირებულ ყველა წინა ზეპირ ან წერილობით შეთანხმებას.`}</Text>
          {notaryName
            ? <Text style={s.para}>{`${art(11)}.7. ხელშეკრულება დამოწმებულია ნოტარიუსის მიერ: ${notaryName}.`}</Text>
            : null}

          {/* Signatures */}
          <View style={s.sigSection} wrap={false}>
            <Text style={s.sigTitle}>მხარეთა რეკვიზიტები და ხელმოწერები:</Text>
            <View style={s.sigRow}>
              <View style={s.sigBlock}>
                <Text style={s.sigBlockLabel}>წილის დამთმობი:</Text>
                <Text style={s.sigDetail}>{transferorName}</Text>
                <Text style={s.sigDetail}>{`პ/ნ: ${transferorId}`}</Text>
                <Text style={s.sigDetail}>{transferorAddress}</Text>
                <View style={{ position: 'relative', height: 60, width: 175, marginTop: 8 }}>
                  {withSignature && transferorName === 'ლევან საჩიშვილი' && (
                    <Image src="/signature-levan.png" style={{ position: 'absolute', bottom: 1, left: 0, width: 140, height: 58, objectFit: 'contain' }} />
                  )}
                  <View style={{ position: 'absolute', bottom: 0, left: 0, width: 175, borderBottomWidth: 0.5, borderBottomColor: '#555' }} />
                </View>
                <Text style={s.sigLineLabel}>{`/ ${transferorName.split(' ').pop()} /`}</Text>
              </View>
              {transferees.map((t, i) => (
                <View key={i} style={s.sigBlock}>
                  <Text style={s.sigBlockLabel}>{isMulti ? `წილის შემძენი ${i + 1}:` : `${tLabel}:`}</Text>
                  <Text style={s.sigDetail}>{t.name || '______________________________'}</Text>
                  <Text style={s.sigDetail}>{`პ/ნ: ${t.id || '______________________________'}`}</Text>
                  <Text style={s.sigDetail}>{t.address || '______________________________'}</Text>
                  <View style={{ position: 'relative', height: 60, width: 175, marginTop: 8 }}>
                    {withSignature && t.name === 'ლევან საჩიშვილი' && (
                      <Image src="/signature-levan.png" style={{ position: 'absolute', bottom: 1, left: 0, width: 140, height: 58, objectFit: 'contain' }} />
                    )}
                    <View style={{ position: 'absolute', bottom: 0, left: 0, width: 175, borderBottomWidth: 0.5, borderBottomColor: '#555' }} />
                  </View>
                  <Text style={s.sigLineLabel}>{`/ ${t.name ? t.name.split(' ').pop() : '———'} /`}</Text>
                </View>
              ))}
              {transferees.length === 0 && (
                <View style={s.sigBlock}>
                  <Text style={s.sigBlockLabel}>{`${tLabel}:`}</Text>
                  <Text style={s.sigDetail}>{'______________________________'}</Text>
                  <Text style={s.sigDetail}>{'პ/ნ: ______________________________'}</Text>
                  <Text style={s.sigDetail}>{'______________________________'}</Text>
                  <View style={s.sigLine} />
                  <Text style={s.sigLineLabel}>{'/ ——— /'}</Text>
                </View>
              )}
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
