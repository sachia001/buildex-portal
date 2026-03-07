import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// დარწმუნდით, რომ ფონტის ფაილი სწორ ადგილასაა
import fontPath from '../fonts/bpg_arial.ttf'; 

// ფონტის რეგისტრაცია ქართული მხარდაჭერისთვის
Font.register({ family: 'BPG Arial', src: fontPath });

const styles = StyleSheet.create({
  page: { fontFamily: 'BPG Arial', padding: 40, paddingTop: 30, fontSize: 10, lineHeight: 1.4 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center', height: 60 },
  logo: { width: 80, height: 'auto' }, // ლოგოს ზომა
  addressee: { textAlign: 'right', fontSize: 10, marginBottom: 20, marginTop: 10 },
  
  // ცხრილის სტილის რიგები
  row: { flexDirection: 'row', marginBottom: 4, alignItems: 'center' },
  label: { width: 140, fontSize: 10, fontWeight: 'bold' },
  value: { flex: 1, fontSize: 10, paddingLeft: 5 }, 
  
  // სათაურები
  title: { fontSize: 16, textAlign: 'center', marginTop: 10, marginBottom: 5, fontWeight: 'bold' },
  subtitle: { fontSize: 11, textAlign: 'center', marginBottom: 5 },
  regNumber: { fontSize: 10, textAlign: 'center', marginBottom: 15, fontWeight: 'bold' }, // რეგისტრაციის ნომრის სტილი

  sectionTitle: { marginTop: 15, marginBottom: 8, fontSize: 11, fontWeight: 'bold', backgroundColor: '#f0f0f0', padding: 4 },
  
  // ჩეკბოქსები
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4, paddingLeft: 5 },
  checkbox: { width: 12, height: 12, border: '1px solid black', marginRight: 8, marginTop: 1, alignItems: 'center', justifyContent: 'center' },
  checkMark: { fontSize: 10, lineHeight: 1 },
  
  textArea: { border: '1px solid black', minHeight: 40, marginTop: 5, padding: 5, fontSize: 10 },
  footer: { marginTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  objectContainer: { marginBottom: 5, paddingLeft: 5 }
});

const CheckBox = ({ checked, label }) => (
  <View style={styles.checkboxRow}>
    <View style={styles.checkbox}>{checked ? <Text style={styles.checkMark}>X</Text> : null}</View>
    <Text style={{ flex: 1, fontSize: 10 }}>{label}</Text>
  </View>
);

const PdfDocument = ({ data }) => {
  if (!data) return <Document><Page><Text>იტვირთება...</Text></Page></Document>;

  const scopes = [
    "ობიექტის ხარჯთაღრიცხვის ინსპექტირება",
    "ობიექტის ხარჯთაღრიცხვის ფასწარმოქმნის ადეკვატურობის ინსპექტირება",
    "ობიექტზე შესრულებული სამუშაოების ინსპექტირება (მათ შორის ფორმა#2-ის მიხედვით)",
    "ობიექტის სამშენებლო სამუშაოებზე ტექნიკური ზედამხედველობა – ინსპექტირება",
    "სამშენებლო ობიექტის პროექტის ან პროექტის ნაწილის მოქმედ დოკუმენტებთან შესაბამისობის შეფასება/ინსპექტირება"
  ];

  const documentsList = [
    { key: 'contract', label: "სატენდერო ხელშეკრულება;" },
    { key: 'agreement', label: "შეთანხმება;" },
    { key: 'budget', label: "კორექტირებული ხარჯთაღრიცხვა;" },
    { key: 'form2', label: "შესრულებული სამუშაოების ფორმა №2;" },
    { key: 'hiddenWorks', label: "ფარული სამუშაოთა აქტები;" },
    { key: 'labs', label: "ლაბორატორიული დასკვნები;" },
    { key: 'other', label: "სხვა" }
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* ჰედერი ლოგოებით */}
        <View style={styles.headerContainer}>
           {/* სურათები უნდა იყოს public საქაღალდეში ან იმპორტირებული */}
           <Image src="/logo.png" style={styles.logo} />
           {/* მეორე ლოგო თუ გაქვთ */}
           {/* <Image src="/gac_logo.png" style={styles.logo} /> */} 
        </View>

        <View style={styles.addressee}>
          <Text>შპს „ბილდექს ექსპერტიზა”-ს დირექტორს</Text>
          <Text style={{fontWeight: 'bold', marginTop: 2}}>ლევან საჩიშვილს</Text>
        </View>

        {/* დამკვეთის ბლოკი */}
        <View style={{ marginBottom: 15 }}>
          <View style={styles.row}><Text style={styles.label}>ორგანიზაცია:</Text><Text style={styles.value}>{data.clientName}</Text></View>
          {data.contactPerson && <View style={styles.row}><Text style={styles.label}>წარმომადგენელი:</Text><Text style={styles.value}>{data.contactPerson}</Text></View>}
          <View style={styles.row}><Text style={styles.label}>საიდენტიფიკაციო:</Text><Text style={styles.value}>{data.clientID}</Text></View>
          <View style={styles.row}><Text style={styles.label}>ელ.ფოსტა:</Text><Text style={styles.value}>{data.clientEmail || '-'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>ტელეფონი:</Text><Text style={styles.value}>{data.clientPhone || '-'}</Text></View>
        </View>

        {/* სათაური და ნომერი */}
        <Text style={styles.title}>გ ა ნ ც ხ ა დ ე ბ ა</Text>
        <Text style={styles.subtitle}>ინსპექტირების შესახებ</Text>
        
        {/* 👇👇👇 აი აქ ჩანს ახლა განცხადების ნომერი 👇👇👇 */}
        <Text style={styles.regNumber}>რეგისტრაციის №: {data.applicationNumber || "_____________"}</Text>

        {/* ობიექტის ბლოკი */}
        <Text style={styles.sectionTitle}>ინსპექტირების ობიექტი:</Text>
        <View style={styles.objectContainer}>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold', width: 90 }}>დასახელება: </Text>
                <Text style={{ flex: 1 }}>{data.objectName}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold', width: 90 }}>მისამართი: </Text>
                {/* 👇 აქ გასწორდა objectAddress-ზე */}
                <Text style={{ flex: 1 }}>{data.objectAddress || data.address}</Text>
            </View>
            
            {/* 👇 ტენდერის ჩვენება, თუ არსებობს */}
            {data.tenderNumber && (
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontWeight: 'bold', width: 90 }}>ტენდერი: </Text>
                    <Text style={{ flex: 1 }}>{data.tenderNumber}</Text>
                </View>
            )}
        </View>

        {/* სფერო */}
        <Text style={styles.sectionTitle}>სფერო:</Text>
        {scopes.map((scopeText, index) => (
          <CheckBox key={index} label={scopeText} checked={data.inspectionScope === scopeText} />
        ))}

        {/* შინაარსი */}
        <Text style={styles.sectionTitle}>განცხადების შინაარსი:</Text>
        <View style={styles.textArea}>
           <Text>{data.applicationContent}</Text>
        </View>

        {/* დოკუმენტაცია */}
        <Text style={styles.sectionTitle}>წარმოდგენილი დოკუმენტაცია:</Text>
        <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
            {documentsList.map((doc, index) => {
                let displayLabel = doc.label;
                // სავარაუდო ლოგიკა, თუ სხვა დოკუმენტებიც მონიშნულია (ამ ეტაპზე მარტივად ვტოვებთ)
                return (
                <View key={index} style={{ width: '50%' }}>
                    <CheckBox label={displayLabel} checked={false} /> 
                    {/* შენიშვნა: ვინაიდან რეგისტრაციის ფორმაში დოკუმენტების ჩეკბოქსები ჯერ არ გვაქვს, აქ default false-ია. 
                        თუ გინდათ, რომ ესეც ფორმიდან მოდიოდეს, AddInspection-ში უნდა დაემატოს ჩეკბოქსები */}
                </View>
                );
            })}
        </View>

        {/* ხელმოწერა */}
        <View style={styles.footer}>
          <View>
              <Text>დანართი: _______ ფურცლად.</Text>
              <Text style={{ marginTop: 20 }}>განმცხადებლის ხელმოწერა: ____________________</Text>
          </View>
          <View>
              <Text>თარიღი: {new Date(data.createdAt).toLocaleDateString('ka-GE')}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfDocument;