import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf';

Font.register({ family: 'BPG Arial', src: fontPath });

const s = StyleSheet.create({
  page: { fontFamily: 'BPG Arial', padding: 50, fontSize: 10, lineHeight: 1.7 },
  watermarkContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: -1 },
  watermarkImage: { width: 350, opacity: 0.05 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 10, textAlign: 'center', color: '#555', marginBottom: 16 },
  cityDate: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, fontSize: 10 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', marginTop: 14, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 3 },
  para: { fontSize: 10, textAlign: 'justify', marginBottom: 8, lineHeight: 1.7 },
  fieldRow: { flexDirection: 'row', marginBottom: 5, fontSize: 10 },
  fieldLabel: { fontWeight: 'bold', marginRight: 5, minWidth: 120 },
  sigSection: { marginTop: 40 },
  sigRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  sigBlock: { width: '45%' },
  sigLine: { borderTopWidth: 1, borderTopColor: '#000', marginTop: 30, paddingTop: 4, textAlign: 'center', fontSize: 9 },
  divider: { borderTopWidth: 1, borderTopColor: '#ddd', marginVertical: 10 },
  bold: { fontWeight: 'bold' },
});

const ShareTransferPdf = ({ data = {} }) => {
  const {
    transferType = 'gift',
    transferorName = 'ლევან საჩიშვილი',
    transferorId = '20001017959',
    transferorAddress = 'ქ. თელავი',
    transfereeName = '',
    transfereeId = '',
    transfereeAddress = '',
    sharePercent = '100',
    shareValue = '',
    salePrice = '',
    paymentTerms = '',
    contractDate = '',
    contractNumber = '',
    city = 'ქ. თელავი',
    notaryName = '',
  } = data;

  const isGift = transferType === 'gift';
  const docTitle = isGift ? 'ჩუქების ხელშეკრულება' : 'ნასყიდობის ხელშეკრულება';
  const docSubtitle = isGift
    ? 'შპს „ბილდექს ექსპერტიზა"-ში წილის სახელმწიფო სანოტარო მოწმობის გარეშე გადაცემის შესახებ'
    : 'შპს „ბილდექს ექსპერტიზა"-ში წილის გაყიდვის შესახებ';

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.watermarkContainer} fixed>
          <Image src="/logo.png" style={s.watermarkImage} />
        </View>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>{docTitle}</Text>
          <Text style={s.subtitle}>{docSubtitle}</Text>
          {contractNumber ? <Text style={{ fontSize: 9, color: '#666' }}>№ {contractNumber}</Text> : null}
        </View>

        <View style={s.cityDate}>
          <Text>{city}</Text>
          <Text>{contractDate}</Text>
        </View>

        {/* Parties */}
        <Text style={s.sectionTitle}>მხარეები</Text>
        <View style={s.fieldRow}>
          <Text style={s.fieldLabel}>{isGift ? 'ჩამჩუქებელი:' : 'გამყიდველი:'}</Text>
          <Text>{transferorName}, პ/ნ {transferorId}, მისამართი: {transferorAddress}</Text>
        </View>
        <View style={s.fieldRow}>
          <Text style={s.fieldLabel}>{isGift ? 'დასაჩუქრებული:' : 'მყიდველი:'}</Text>
          <Text>{transfereeName || '_______________'}, პ/ნ {transfereeId || '_______________'}, მისამართი: {transfereeAddress || '_______________'}</Text>
        </View>

        <View style={s.divider} />

        {/* Subject */}
        <Text style={s.sectionTitle}>1. ხელშეკრულების საგანი</Text>
        {isGift ? (
          <Text style={s.para}>
            {`1.1. ${transferorName} (ჩამჩუქებელი), რომელიც არის შეზღუდული პასუხისმგებლობის საზოგადოება „ბილდექს ექსპერტიზა" (ს/კ: 431188010, შემდგომ — „საზოგადოება") ${sharePercent}%-იანი წილის მფლობელი, საქართველოს სამოქალაქო კოდექსის 524-ე მუხლის შესაბამისად, საჩუქრად, უსასყიდლოდ, გადასცემს ${transfereeName || '_______________'}-ს (დასაჩუქრებული) საზოგადოებაში მის მიერ ფლობილი ${sharePercent}%-იან წილს.`}
          </Text>
        ) : (
          <Text style={s.para}>
            {`1.1. ${transferorName} (გამყიდველი), რომელიც არის შეზღუდული პასუხისმგებლობის საზოგადოება „ბილდექს ექსპერტიზა" (ს/კ: 431188010, შემდგომ — „საზოგადოება") ${sharePercent}%-იანი წილის მფლობელი, საქართველოს სამოქალაქო კოდექსის 477-ე მუხლის შესაბამისად, ყიდის ${transfereeName || '_______________'}-ს (მყიდველი) საზოგადოებაში მის მიერ ფლობილი ${sharePercent}%-იან წილს.`}
          </Text>
        )}
        <Text style={s.para}>
          {`1.2. წილის ნომინალური/ბალანსური ღირებულება: ${shareValue || '___'} ლარი.`}
        </Text>

        {/* Price section for sale */}
        {!isGift && (
          <>
            <Text style={s.sectionTitle}>2. ნასყიდობის ფასი და ანგარიშსწორება</Text>
            <Text style={s.para}>
              {`2.1. წილის ნასყიდობის ფასია: ${salePrice || '___'} (${salePrice || '___'}) ლარი.`}
            </Text>
            <Text style={s.para}>
              {`2.2. ანგარიშსწორების წესი: ${paymentTerms || '_______________'}.`}
            </Text>
            <Text style={s.para}>
              {`2.3. გამყიდველი ადასტურებს, რომ გასხვისებული წილი თავისუფალია ნებისმიერი სახის ტვირთისგან, პრეტენზიისგან ან/და დავისგან.`}
            </Text>
          </>
        )}

        {/* Obligations */}
        <Text style={s.sectionTitle}>{isGift ? '2.' : '3.'} მხარეთა უფლება-მოვალეობები</Text>
        <Text style={s.para}>
          {`${isGift ? '2' : '3'}.1. ${isGift ? 'ჩამჩუქებელი' : 'გამყიდველი'} ვალდებულია ხელშეკრულების გაფორმებიდან 10 (ათი) სამუშაო დღის ვადაში უზრუნველყოს სსიპ საჯარო რეესტრის ეროვნულ სააგენტოში შესაბამისი ცვლილების რეგისტრაცია.`}
        </Text>
        <Text style={s.para}>
          {`${isGift ? '2' : '3'}.2. ${isGift ? 'დასაჩუქრებული' : 'მყიდველი'} იძენს წილის მფლობელის სრულ უფლებამოსილებას სსიპ საჯარო რეესტრის ეროვნულ სააგენტოში ცვლილების რეგისტრაციის მომენტიდან.`}
        </Text>
        <Text style={s.para}>
          {`${isGift ? '2' : '3'}.3. წილის გადაცემის შესახებ გადაწყვეტილება მიიღება პარტნიორთა კრების/ერთპიროვნული პარტნიორის გადაწყვეტილებით, რომელიც წარმოადგენს წინამდებარე ხელშეკრულების განუყოფელ ნაწილს.`}
        </Text>

        {/* Final provisions */}
        <Text style={s.sectionTitle}>{isGift ? '3.' : '4.'} დასკვნითი დებულებები</Text>
        <Text style={s.para}>
          {`${isGift ? '3' : '4'}.1. წინამდებარე ხელშეკრულება შედგენილია ქართულ ენაზე, 2 (ორ) ეგზემპლარად, თითოეული მხარისთვის 1 ეგზემპლარი.`}
        </Text>
        <Text style={s.para}>
          {`${isGift ? '3' : '4'}.2. ხელშეკრულება ძალაში შედის ორივე მხარის მიერ ხელმოწერის მომენტიდან.`}
        </Text>
        <Text style={s.para}>
          {`${isGift ? '3' : '4'}.3. ხელშეკრულებასთან დაკავშირებული დავები გადაწყდება მოლაპარაკებების გზით, ხოლო შეუთანხმებლობის შემთხვევაში — საქართველოს კანონმდებლობის შესაბამისი სასამართლოს მეშვეობით.`}
        </Text>
        {notaryName && (
          <Text style={s.para}>
            {`${isGift ? '3' : '4'}.4. ხელშეკრულება დამოწმებულია ნოტარიუსის მიერ: ${notaryName}.`}
          </Text>
        )}

        {/* Signatures */}
        <View style={s.sigSection}>
          <Text style={[s.bold, { fontSize: 10, marginBottom: 8 }]}>მხარეთა ხელმოწერები:</Text>
          <View style={s.sigRow}>
            <View style={s.sigBlock}>
              <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{isGift ? 'ჩამჩუქებელი:' : 'გამყიდველი:'}</Text>
              <Text style={{ fontSize: 9, marginTop: 4, color: '#555' }}>{transferorName}</Text>
              <Text style={{ fontSize: 9, color: '#555' }}>პ/ნ: {transferorId}</Text>
              <View style={s.sigLine}><Text>(ხელმოწერა)</Text></View>
            </View>
            <View style={s.sigBlock}>
              <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{isGift ? 'დასაჩუქრებული:' : 'მყიდველი:'}</Text>
              <Text style={{ fontSize: 9, marginTop: 4, color: '#555' }}>{transfereeName || '_______________'}</Text>
              <Text style={{ fontSize: 9, color: '#555' }}>პ/ნ: {transfereeId || '_______________'}</Text>
              <View style={s.sigLine}><Text>(ხელმოწერა)</Text></View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ShareTransferPdf;
