import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf'; 

Font.register({ family: 'BPG Arial', src: fontPath });

const styles = StyleSheet.create({
  page: { 
    fontFamily: 'BPG Arial', 
    paddingTop: 30,
    paddingBottom: 40,
    paddingLeft: 40,
    paddingRight: 40,
    fontSize: 9, 
    lineHeight: 1.4
  },
  watermarkContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center', zIndex: -1
  },
  watermarkImage: { width: 400, opacity: 0.08 },

  // --- ჰედერი ---
  header: { alignItems: 'center', marginBottom: 15, width: '100%', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 10 },
  logoImage: { height: 50, objectFit: 'contain', marginBottom: 5 },
  companyNameText: { fontSize: 12, color: '#003366', fontWeight: 'bold', textAlign: 'center' },
  companyInfoText: { fontSize: 8, color: '#666', textAlign: 'center' },

  // სათაურები
  docTitle: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginTop: 10, marginBottom: 10 },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', marginTop: 8, marginBottom: 4, backgroundColor: '#f0f0f0', padding: 2 },
  subTitle: { fontSize: 9, fontWeight: 'bold', marginTop: 5, marginBottom: 2, marginLeft: 10 },

  // ტექსტი
  text: { textAlign: 'justify', marginBottom: 4, fontSize: 9 },
  bold: { fontWeight: 'bold' },
  bullet: { marginLeft: 15, marginBottom: 2 },
  
  // ხელმოწერა
  signatureRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, breakInside: 'avoid' },
  signatureBox: { width: '45%' },
  signatureLine: { borderTopWidth: 1, borderTopColor: '#000', marginTop: 40, paddingTop: 5, textAlign: 'center', fontSize: 8 },
  signatureImage: { width: 100, height: 40, objectFit: 'contain', position: 'absolute', top: 0, left: 30 }
});

const Header = () => (
    <View style={styles.header}>
        <Image src="/logo.png" style={styles.logoImage} />
        <Text style={styles.companyNameText}>შპს „ბილდექს ექსპერტიზა“ (ს/კ 431180746)</Text>
        <Text style={styles.companyInfoText}>მისამართი: ქ. თელავი, ლეონიძის ქ. 22 | ტელ: +995 511 74 74 00</Text>
    </View>
);

const LaborContractPdf = ({ data }) => {
  return (
    <Document>
      {/* ==================== გვერდი 1: მთავარი ხელშეკრულება ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.watermarkContainer} fixed><Image src="/logo.png" style={styles.watermarkImage} /></View>
        <Header />
        
        <Text style={styles.docTitle}>შრომითი ხელშეკრულება № {data.contractNumber}</Text>
        <Text style={{textAlign: 'right', fontSize: 9, marginBottom: 10}}>ქ. თელავი, {data.date}</Text>
        
        <Text style={styles.sectionTitle}>1. ხელშეკრულების მხარეები და ზოგადი დებულებები</Text>
        <Text style={styles.text}>1.1. <Text style={styles.bold}>დამსაქმებელი:</Text> შპს „ბილდექს ექსპერტიზა“ (ს/ნ 431180746), იურიდიული მისამართი: საქართველო, ქ. თელავი, ლეონიძის ქ. N22; წარმოდგენილი დირექტორის, ლევან საჩიშვილის სახით.</Text>
        <Text style={styles.text}>1.2. <Text style={styles.bold}>დასაქმებული:</Text> {data.employeeName} (პ/ნ {data.personalId}), მცხოვრები: {data.address}, ტელ: {data.phone}.</Text>
        <Text style={styles.text}>1.3. წინამდებარე ხელშეკრულება არეგულირებს მხარეთა შორის შრომით-სამართლებრივ ურთიერთობებს და ეფუძნება საქართველოს კონსტიტუციას, საქართველოს ორგანული კანონის „საქართველოს შრომის კოდექსს“ (შემდგომში – „შრომის კოდექსი“), „მეწარმეთა შესახებ“ საქართველოს კანონს, კომპანიის წესდებას, შრომის შინაგანაწესს და SST ISO/IEC 17020:2012 საერთაშორისო სტანდარტს.</Text>

        <Text style={styles.sectionTitle}>2. ხელშეკრულების საგანი და სამუშაოს შესრულების ადგილი</Text>
        <Text style={styles.text}>2.1. დასაქმებული ინიშნება {data.position} პოზიციაზე.</Text>
        <Text style={styles.text}>2.2. სამუშაოს ძირითადი ადგილია დამსაქმებლის იურიდიული მისამართი (ქ. თელავი), თუმცა სამსახურებრივი სპეციფიკიდან გამომდინარე (სამშენებლო ობიექტების ინსპექტირება), სამუშაო სრულდება საქართველოს მთელ ტერიტორიაზე, რაც რეგულირდება მივლინების წესით.</Text>

        <Text style={styles.sectionTitle}>3. შრომის ანაზღაურება და ანგარიშსწორება</Text>
        <Text style={styles.text}>3.1. დასაქმებულის ყოველთვიური თანამდებობრივი სარგო შეადგენს {data.salary} ლარს (დარიცხული - Gross).</Text>
        <Text style={styles.text}>3.2. „ხელზე ასაღები“ (Net) თანხა განისაზღვრება საქართველოს კანონმდებლობით გათვალისწინებული გადასახადების (საშემოსავლო 20%, საპენსიო 2%) გამოკლების შემდეგ.</Text>
        <Text style={styles.text}>3.3. <Text style={styles.bold}>ISO 17020 იმპერატიული მოთხოვნა:</Text> კატეგორიულად აკრძალულია დასაქმებულის შრომის ანაზღაურების (მათ შორის, პრემიის/ბონუსის) დამოკიდებულება მის მიერ ჩატარებული ინსპექტირებების რაოდენობაზე ან ინსპექტირების შედეგებზე (ე.წ. „დადებითი დასკვნის“ გაცემაზე). ეს პუნქტი ემსახურება ინსპექტორის ფინანსური დამოუკიდებლობის უზრუნველყოფას.</Text>

        <Text style={styles.sectionTitle}>4. დასაქმებულის დეტალური ვალდებულებები</Text>
        <Text style={styles.subTitle}>4.1. ზოგადი და ადმინისტრაციული ვალდებულებები:</Text>
        <Text style={styles.text}>4.1.1. გამოცხადდეს სამსახურში დადგენილ დროს (10:00 სთ) და არ დატოვოს სამუშაო ადგილი უშუალო ხელმძღვანელის ნებართვის გარეშე (შრომის კოდექსის მუხლი 23).</Text>
        <Text style={styles.text}>4.1.2. მუდმივად ატაროს კომპანიის საიდენტიფიკაციო ბარათი (Badge) და გამოიყენოს კორპორატიული ეთიკის შესაბამისი ჩაცმულობა.</Text>
        <Text style={styles.text}>4.1.3. შეინარჩუნოს მუდმივი სატელეფონო და ელექტრონული კომუნიკაცია სამუშაო საათებში.</Text>
        
        <Text style={styles.subTitle}>4.2. ISO 17020 სტანდარტით გათვალისწინებული სპეციფიკური ვალდებულებები:</Text>
        <Text style={styles.text}>4.2.1. <Text style={styles.bold}>მიუკერძოებლობა:</Text> უარი თქვას ისეთი ობიექტის ინსპექტირებაზე, სადაც მას გააჩნია რაიმე სახის პირადი, ფინანსური ან ნათესაური ინტერესი.</Text>
        <Text style={styles.text}>4.2.2. <Text style={styles.bold}>დამოუკიდებლობა:</Text> არ დაემორჩილოს დამკვეთის, პროექტირების ან სამშენებლო კომპანიის წარმომადგენლის ზეწოლას დასკვნის შინაარსთან დაკავშირებით. ნებისმიერი ზეწოლის მცდელობა დაუყოვნებლივ აცნობოს ხარისხის მენეჯერს.</Text>
        <Text style={styles.text}>4.2.3. <Text style={styles.bold}>კომპეტენცია:</Text> ინსპექტირება ჩაატაროს მხოლოდ დამტკიცებული მეთოდოლოგიის, მოქმედი სამშენებლო ნორმების (სნ და წ) და ტექნიკური რეგლამენტების მკაცრი დაცვით.</Text>
        <Text style={styles.text}>4.2.4. <Text style={styles.bold}>კონფიდენციალურობა:</Text> უვადოდ დაიცვას დამკვეთის კომერციული საიდუმლოება და პერსონალური მონაცემები, რომლებიც მისთვის ცნობილი გახდა საქმიანობის განხორციელებისას.</Text>
        
        <Text style={styles.subTitle}>4.3. შრომის უსაფრთხოება (HSE):</Text>
        <Text style={styles.text}>4.3.1. სამშენებლო ობიექტზე შესვლისას სავალდებულო წესით გამოიყენოს ინდივიდუალური დაცვის საშუალებები (ჩაფხუტი, ჟილეტი, სპეციალური ფეხსაცმელი).</Text>
        <Text style={styles.text}>4.3.2. არ განახორციელოს სამუშაო სიმაღლეზე ან სახიფათო ზონაში შესაბამისი დაზღვევისა და ინსტრუქტაჟის გარეშე.</Text>

        <Text style={styles.sectionTitle}>5. ინტელექტუალური საკუთრება</Text>
        <Text style={styles.text}>5.1. დასაქმებულის მიერ სამსახურებრივი მოვალეობის შესრულებისას შექმნილი ნებისმიერი დოკუმენტი, დასკვნა, ნახაზი, ფოტომასალა, პროგრამული კოდი ან მეთოდოლოგია წარმოადგენს დამსაქმებლის ექსკლუზიურ საკუთრებას (საქართველოს კანონი „საავტორო და მომიჯნავე უფლებების შესახებ“).</Text>

        <Text style={styles.sectionTitle}>6. ინტერესთა კონფლიქტი და კონკურენციის აკრძალვა</Text>
        <Text style={styles.text}>6.1. წინამდებარე ხელშეკრულების მოქმედების პერიოდში დასაქმებულს ეკრძალება ანალოგიური მომსახურების გაწევა კონკურენტი კომპანიებისთვის ან კერძო საინსპექტირებო საქმიანობა დამსაქმებლის წერილობითი თანხმობის გარეშე.</Text>

        <Text style={styles.sectionTitle}>7. ხელშეკრულების შეწყვეტა</Text>
        <Text style={styles.text}>7.1. ხელშეკრულება შეიძლება შეწყდეს შრომის კოდექსის 37-ე მუხლით გათვალისწინებული საფუძვლებით, მათ შორის:</Text>
        <Text style={styles.bullet}>• უხეში დისციპლინური გადაცდომა (მაგ: არაფხიზელ მდგომარეობაში გამოცხადება);</Text>
        <Text style={styles.bullet}>• ISO 17020 სტანდარტის მიუკერძოებლობის პრინციპის დარღვევა (მაგ: ქრთამის აღება, დამკვეთთან გარიგება);</Text>
        <Text style={styles.bullet}>• კვალიფიკაციის შეუსაბამობა დაკავებულ თანამდებობასთან.</Text>

        <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
                <Text style={styles.bold}>დამსაქმებელი:</Text>
                <Text>ლევან საჩიშვილი</Text>
                {data.directorSignature && <Image src={data.directorSignature} style={styles.signatureImage} />}
                <Text style={styles.signatureLine}>(ხელმოწერა)</Text>
            </View>
            <View style={styles.signatureBox}>
                <Text style={styles.bold}>დასაქმებული:</Text>
                <Text>{data.employeeName}</Text>
                <Text style={styles.signatureLine}>(ხელმოწერა)</Text>
            </View>
        </View>
      </Page>

      {/* ==================== გვერდი 2: დანართი 1 (თანამდებობრივი ინსტრუქცია) ==================== */}
      <Page size="A4" style={styles.page}>
         <Header />
         <Text style={styles.docTitle}>თანამდებობრივი ინსტრუქცია (დანართი №1)</Text>
         <Text style={{textAlign:'center', marginBottom:10}}>დამტკიცებულია: დირექტორის ბრძანებით</Text>
         
         <Text style={styles.text}><Text style={styles.bold}>პოზიცია:</Text> {data.position}</Text>

         <Text style={styles.sectionTitle}>1. ფუნქციები დეტალურად</Text>
         
         <Text style={styles.subTitle}>1.1. მოსამზადებელი ეტაპი (ოფისში):</Text>
         <Text style={styles.bullet}>• ყოველი ინსპექტირების წინ გაეცნოს დამკვეთის მიერ წარმოდგენილ საპროექტო დოკუმენტაციას.</Text>
         <Text style={styles.bullet}>• შეამოწმოს საზომი ხელსაწყოების (ლაზერული მანძილმზომი, თეოდოლიტი, სკლერომეტრი) გამართულობა და მათი კალიბრაციის სტატუსი.</Text>
         <Text style={styles.bullet}>• უზრუნველყოს მობილური ტელეფონისა და ფოტოაპარატის ელემენტების სრული დამუხტვა ობიექტზე გასვლამდე.</Text>
         <Text style={styles.bullet}>• თან იქონიოს ინსპექტირებისთვის საჭირო ყველა ბლანკი და ჩეკლისტი (Checklist).</Text>

         <Text style={styles.subTitle}>1.2. საველე სამუშაოები (ობიექტზე):</Text>
         <Text style={styles.bullet}>• ობიექტზე გამოცხადდეს შეთანხმებულ დროს. დაგვიანების შემთხვევაში მინიმუმ 30 წუთით ადრე აცნობოს ტექნიკურ მენეჯერს და დამკვეთს.</Text>
         <Text style={styles.bullet}>• ობიექტზე მისვლისთანავე გაიაროს უსაფრთხოების ინსტრუქტაჟი ადგილობრივი პასუხისმგებელი პირისგან.</Text>
         <Text style={styles.bullet}>• აწარმოოს ობიექტის დეტალური ფოტო-ვიდეო გადაღება. ფოტოებზე უნდა ფიქსირდებოდეს თარიღი და დრო (Timestamp).</Text>
         <Text style={styles.bullet}>• გაზომვების წარმოებისას გამოიყენოს დამტკიცებული მეთოდოლოგია. შედეგები დაუყოვნებლივ შეიტანოს საველე ჟურნალში.</Text>
         <Text style={styles.bullet}>• არ დატოვოს ობიექტი, სანამ არ დარწმუნდება, რომ ყველა საჭირო მონაცემი მოპოვებულია.</Text>

         <Text style={styles.subTitle}>1.3. საანგარიშგებო ეტაპი:</Text>
         <Text style={styles.bullet}>• ინსპექტირებიდან არაუგვიანეს 2 (ორი) სამუშაო დღისა მოამზადოს ინსპექტირების ანგარიშის (დასკვნის) პროექტი.</Text>
         <Text style={styles.bullet}>• ანგარიშში დეტალურად აღწეროს შეუსაბამობები, მიუთითოს დარღვეული სამშენებლო ნორმა (მუხლი/პუნქტი) და დაურთოს ფოტომტკიცებულებები.</Text>
         <Text style={styles.bullet}>• მომზადებული პროექტი გადაუგზავნოს ტექნიკურ მენეჯერს ვიზირებისთვის.</Text>

         <Text style={styles.subTitle}>1.4. ტექნიკის მოვლა-პატრონობა:</Text>
         <Text style={styles.bullet}>• სამუშაო დღის ბოლოს გაწმინდოს და უსაფრთხო ადგილას შეინახოს მასზე მიბარებული ტექნიკა.</Text>
         <Text style={styles.bullet}>• ავტომობილის გამოყენების შემთხვევაში, აკონტროლოს საწვავის დონე, საბურავების მდგომარეობა და სისუფთავე სალონში.</Text>

         <Text style={styles.sectionTitle}>2. პასუხისმგებლობის ზღვარი</Text>
         <Text style={styles.text}>
            ინსპექტორი პასუხს აგებს მის მიერ გაცემული დასკვნის ტექნიკურ სისწორეზე. არასწორი გაზომვის ან ნორმის არასწორი ინტერპრეტაციის შემთხვევაში, მას დაეკისრება დისციპლინური პასუხისმგებლობა.
         </Text>

         <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
                <Text>გავეცანი:</Text>
                <Text style={styles.signatureLine}>(დასაქმებულის ხელმოწერა)</Text>
            </View>
        </View>
      </Page>

      {/* ==================== გვერდი 3: სრული მატერიალური პასუხისმგებლობის ხელშეკრულება ==================== */}
      <Page size="A4" style={styles.page}>
         <Header />
         <Text style={styles.docTitle}>სრული მატერიალური პასუხისმგებლობის ხელშეკრულება</Text>
         <Text style={{textAlign: 'right', fontSize: 9, marginBottom: 10}}>ქ. თელავი, {data.date}</Text>

         <Text style={styles.sectionTitle}>1. ხელშეკრულების საგანი</Text>
         <Text style={styles.text}>1.1. დამსაქმებელი დასაქმებულს გადასცემს, ხოლო დასაქმებული იბარებს მატერიალურ ფასეულობებს სამსახურებრივი მოვალეობის შესასრულებლად.</Text>
         <Text style={styles.text}>1.2. ფასეულობების ჩამონათვალი, ღირებულება და მდგომარეობა ფიქსირდება „მიღება-ჩაბარების აქტში“, რომელიც ერთვის ამ ხელშეკრულებას.</Text>

         <Text style={styles.sectionTitle}>2. დასაქმებულის ვალდებულებები</Text>
         <Text style={styles.text}>2.1. გაუფრთხილდეს გადაცემულ ქონებას ისე, როგორც საკუთარს.</Text>
         <Text style={styles.text}>2.2. არ გადასცეს ქონება მესამე პირებს (მათ შორის, სხვა თანამშრომლებს) მიღება-ჩაბარების აქტის გაფორმების გარეშე.</Text>
         <Text style={styles.text}>2.3. ქურდობის, ძარცვის ან ქონების დაზიანების ფაქტის აღმოჩენისთანავე დაუყოვნებლივ აცნობოს დამსაქმებელს და საპატრულო პოლიციას.</Text>

         <Text style={styles.sectionTitle}>3. ზიანის ანაზღაურება</Text>
         <Text style={styles.text}>3.1. საქართველოს სამოქალაქო კოდექსის 992-ე მუხლისა და შრომის კოდექსის შესაბამისად, დასაქმებული ვალდებულია სრულად აანაზღაუროს ზიანი, თუ:</Text>
         <Text style={styles.bullet}>ა) ზიანი გამოწვეულია განზრახი ქმედებით;</Text>
         <Text style={styles.bullet}>ბ) ზიანი გამოწვეულია ნივთის არადანიშნულებისამებრ გამოყენებით;</Text>
         <Text style={styles.bullet}>გ) ზიანი გამოწვეულია ნივთის უყურადღებოდ დატოვებით;</Text>
         <Text style={styles.bullet}>დ) ნივთი დაიკარგა და დასაქმებული ვერ ადასტურებს მესამე პირის ბრალეულობას.</Text>
         <Text style={styles.text}>3.2. ზიანის ოდენობა განისაზღვრება ნივთის საბაზრო ღირებულებით ზიანის მიყენების მომენტისთვის.</Text>

         <Text style={styles.sectionTitle}>4. დაკავების უფლება</Text>
         <Text style={styles.text}>4.1. მხარეები თანხმდებიან, რომ დამსაქმებელს უფლება აქვს, მიყენებული ზიანის თანხა (კანონით დადგენილი ლიმიტის ფარგლებში) დააკავოს დასაქმებულის ხელფასიდან ან საბოლოო ანგარიშსწორების თანხიდან.</Text>

         <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
                <Text style={styles.bold}>დამსაქმებელი:</Text>
                {data.directorSignature && <Image src={data.directorSignature} style={styles.signatureImage} />}
                <Text style={styles.signatureLine}>(ხელმოწერა)</Text>
            </View>
            <View style={styles.signatureBox}>
                <Text style={styles.bold}>დასაქმებული:</Text>
                <Text style={styles.signatureLine}>(ხელმოწერა)</Text>
            </View>
        </View>
      </Page>
    </Document>
  );
};

export default LaborContractPdf;