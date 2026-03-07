import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf'; 

Font.register({ family: 'BPG Arial', src: fontPath });

const styles = StyleSheet.create({
  page: { 
    fontFamily: 'BPG Arial', 
    paddingTop: 30, 
    paddingBottom: 60, 
    paddingLeft: 40, 
    paddingRight: 40, 
    fontSize: 10,
    lineHeight: 1.3
  },
  
  // ფონი
  watermarkContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center', zIndex: -1
  },
  watermarkImage: { width: 500, opacity: 0.08 },

  // --- ზედა კუთხეები (FIXED) ---
  // ISO - მარცხენა ზედა კუთხე (ნომრის გარეშე)
  headerIso: { 
      position: 'absolute', 
      top: 20, 
      left: 40, 
      fontSize: 9, 
      color: '#000' 
  },
  // ნუმერაცია - მარჯვენა ზედა კუთხე
  headerPageNum: { 
      position: 'absolute', 
      top: 20, 
      right: 40, 
      fontSize: 9, 
      fontWeight: 'bold',
      color: '#000'
  },

  // ძირითადი ჰედერი
  headerContainer: {
    position: 'relative', 
    marginTop: 15, 
    height: 180, 
    marginBottom: 10, 
    width: '100%', 
    paddingBottom: 10
  },
  leftLogoAbsolute: { position: 'absolute', left: 0, top: 0, width: 190, height: 85 },
  combinedLogoImg: { width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'left' },
  centerColumn: { width: '100%', alignItems: 'center', position: 'absolute', top: 0 },
  buildexLogoImg: { height: 95, objectFit: 'contain', marginBottom: 5 },
  companyInfoText: { fontSize: 10, color: '#003366', fontWeight: 'bold', textAlign: 'center', marginTop: 2 },
  companyNameText: { fontSize: 16, color: '#003366', fontWeight: 'bold', textAlign: 'center', marginTop: 5, marginBottom: 5 },

  // გვერდი 1: თავფურცელი
  titleContainer: { marginTop: 40, marginBottom: 40, textAlign: 'center' },
  mainTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#000' },
  reportNumber: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  infoGroup: { marginBottom: 20 },
  label: { fontSize: 11, marginBottom: 5, fontWeight: 'bold' },
  value: { fontSize: 12, paddingLeft: 5 },
  
  yearContainer: { marginTop: 100, textAlign: 'center', marginBottom: 20 }, 
  yearText: { fontSize: 22, fontWeight: 'bold' },
  coverFooter: { textAlign: 'center', marginTop: 'auto' }, 

  // გვერდი 2: ფორმები
  genInfoTitle: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, marginTop: 10 },
  formRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12, width: '100%' },
  formLabel: { fontSize: 10, fontWeight: 'bold', marginRight: 5, minWidth: 50 },
  formLine: { flex: 1, borderBottomWidth: 0, paddingBottom: 2, fontSize: 10, minHeight: 14 },
  multiLineContainer: { marginBottom: 12 },
  multiLineLabel: { fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
  multiLineBox: { borderBottomWidth: 0, marginBottom: 5, width: '100%' },

  // შიდა გვერდები
  sectionTitle: { fontSize: 11, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }, 
  listItem: { flexDirection: 'row', marginBottom: 8, marginLeft: 15 },
  bullet: { width: 15, fontWeight: 'bold' },
  
  // --- ჩარჩოები (თანაბარი ზომები) ---
  conclusionBox: { 
      borderWidth: 1, borderColor: '#000', 
      height: 220, 
      marginTop: 5, marginBottom: 15, padding: 10 
  },
  researchBox: { 
      borderWidth: 1, borderColor: '#000', 
      height: 220, 
      marginTop: 5, padding: 10, justifyContent: 'center', alignItems: 'center' 
  },

  signatureRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 35 },
  signatureBlock: { width: '45%' },
  signatureLine: { borderBottomWidth: 0.5, borderBottomColor: '#000', marginTop: 45, marginBottom: 5 },
});

const ReportCoverPdf = ({ data = {} }) => {
  const start = data.startDate ? data.startDate.split('T')[0] : '';
  const end = data.status === 'დასრულებული' && data.deadline ? data.deadline.split('T')[0] : '';
  const issueDate = data.issueDate ? data.issueDate.split('T')[0] : ''; 
  const currentYear = new Date().getFullYear();
  const reportNum = data.inspectionNumber || '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        <View style={styles.watermarkContainer} fixed><Image src="/logo.png" style={styles.watermarkImage} /></View>
        
        {/* --- ზედა კუთხეები (FIXED) --- */}
        {/* ISO - ნომრის გარეშე */}
        <Text style={styles.headerIso} fixed>სსტ ისო/იეკ 17020</Text>
        
        {/* ნუმერაცია */}
        <Text style={styles.headerPageNum} fixed render={({ pageNumber }) => (
            pageNumber >= 2 ? (pageNumber - 1) : " "
        )} />

        {/* ჰედერი */}
        <View style={styles.headerContainer} fixed>
            <View style={styles.leftLogoAbsolute}><Image src="/gac_logo.png" style={styles.combinedLogoImg} /></View>
            <View style={styles.centerColumn}>
                <Image src="/logo.png" style={styles.buildexLogoImg} />
                <Text style={styles.companyInfoText}>A ტიპის ინსპექტირების ორგანო</Text>
                <Text style={styles.companyNameText}>„ბილდექს ექსპერტიზა“</Text>
                
                {/* შესწორებული: მხოლოდ ს/კ */}
                <Text style={styles.companyInfoText}>ს/კ</Text>
                
                {/* შესწორებული: მხოლოდ აკრედიტაცია N */}
                <Text style={styles.companyInfoText}>აკრედიტაცია N</Text>
            </View>
        </View>


        {/* =================== გვერდი 1: თავფურცელი ================ */}
        
        <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>ინსპექტირების ანგარიში</Text>
            <Text style={styles.reportNumber}>{reportNum}</Text> 
        </View>

        <View style={{marginLeft: 20, marginRight: 20}}>
            <View style={styles.infoGroup}><Text style={styles.label}>ინსპექტირების ობიექტის დასახელება:</Text><Text style={styles.value}>{data.objectName}</Text></View>
            <View style={styles.infoGroup}><Text style={styles.label}>მისამართი:</Text><Text style={styles.value}>{data.address}</Text></View>
            <View style={styles.infoGroup}><Text style={styles.label}>დამკვეთი:</Text><Text style={styles.value}>{data.clientName}</Text></View>
        </View>

        <View style={styles.yearContainer}><Text style={styles.yearText}>{currentYear} წელი</Text></View>
        
        <View style={styles.coverFooter}>
            <Text style={{fontSize: 9, color: '#003366'}}>თელავი, ლეონიძის ქუჩა 22; ტელ: +995 511 74 74 00</Text>
            <Text style={{fontSize: 9, color: '#003366'}}>info@buildexpertise.com</Text>
        </View>

        <Text break />


        {/* =================== გვერდი 2: ზოგადი ინფორმაცია ======== */}

        <Text style={styles.genInfoTitle}>ინსპექტირების ანგარიში</Text>

        <View style={styles.formRow}>
            <Text style={styles.formLabel}>ანგარიშის N:</Text>
            <View style={styles.formLine}><Text>{reportNum}</Text></View>
        </View>

        <View style={styles.formRow}>
            <Text style={styles.formLabel}>ანგარიშის გაცემის თარიღი:</Text>
            <View style={styles.formLine}><Text>{issueDate}</Text></View>
        </View>

        <View style={styles.formRow}>
            <Text style={styles.formLabel}>ინსპექტირების დაწყებისა და დასრულების თარიღი:</Text>
            <View style={styles.formLine}>
                 <Text>{(start && end) ? `${start}  -  ${end}` : ""}</Text>
            </View>
        </View>

        <View style={styles.multiLineContainer}>
            <Text style={styles.multiLineLabel}>ობიექტის დასახელება:</Text>
            <View style={styles.multiLineBox}>
                <Text style={{fontSize: 10}}>{data.objectName}</Text>
            </View>
        </View>

        <View style={styles.formRow}>
            <Text style={styles.formLabel}>დამკვეთი:</Text>
            <View style={styles.formLine}><Text>{data.clientName}</Text></View>
        </View>

        <View style={styles.formRow}>
            <Text style={styles.formLabel}>წარმომადგენელი:</Text>
            <View style={styles.formLine}>
                <Text>{data.contactPerson || data.clientContact || ""}</Text>
            </View>
        </View>

        <View style={styles.multiLineContainer}>
            <Text style={styles.multiLineLabel}>ანგარიშის შედგენის საფუძველი:</Text>
            <View style={styles.multiLineBox}></View>
            <View style={styles.multiLineBox}></View>
        </View>

        <View style={styles.formRow}>
            <Text style={styles.formLabel}>აკრედიტაციის სფერო:</Text>
            <View style={styles.formLine}><Text>{data.accreditationScope || ""}</Text></View>
        </View>

        <View style={styles.multiLineContainer}>
            <Text style={styles.multiLineLabel}>ინსპექტირების ამოცანა:</Text>
            <View style={styles.multiLineBox}>
                 <Text style={{fontSize: 10}}>{data.inspectionTask || ""}</Text>
            </View>
        </View>

        <Text break />


        {/* =================== გვერდი 3: სარჩევი ================= */}
        
        <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>სარჩევი</Text>
        {[...Array(8)].map((_, i) => (<View key={i} style={styles.listItem}><Text>{i + 1}.</Text></View>))}
        <Text style={styles.sectionTitle}>დანართები</Text>
        {[...Array(4)].map((_, i) => (<View key={i} style={styles.listItem}><Text>{i + 1}.</Text></View>))}

        <Text break />


        {/* =================== გვერდი 4: შინაარსი ================ */}

        <Text style={{fontWeight: 'bold', textAlign: 'center', marginBottom: 10}}>ინსპექტირების შემსრულებლები:</Text>
        <Text style={{textAlign: 'justify', marginBottom: 20, fontSize: 9}}>ინსპექტირების შემსრულებლები ინსპექტირების ორგანოს ხელმძღვანელის მიერ გაფრთხილებული და პასუხისმგებელნი ვართ ინსპექტირება ვაწარმოოთ მიუკერძოებლად, ჯეროვნად ჩავატაროთ კვლევა და დავიცვათ ინსპექტირების ჩატარების დროს მიღებული ან წარმოქმნილი ნებისმიერი სახის ინფორმაციის კონფიდენციალურობა.</Text>
        
        <View style={styles.listItem}><Text>1. ინსპექტორი:</Text></View>
        <View style={styles.listItem}><Text>2. ინსპექტორი:</Text></View>

        <Text style={styles.sectionTitle}>წარმოდგენილი მასალები:</Text>
        {[...Array(5)].map((_, i) => (<View key={i} style={styles.listItem}><Text style={styles.bullet}>{i + 1}.</Text></View>))}
        
        <Text style={styles.sectionTitle}>კვლევაში გამოყენებული ნორმატიული დოკუმენტაცია:</Text>
        <View style={styles.listItem}><Text style={styles.bullet}>•</Text></View>
        
        <Text style={styles.sectionTitle}>კვლევაში გამოყენებული ხელსაწყოები:</Text>
        <View style={styles.listItem}><Text style={styles.bullet}>•</Text></View>

        <Text break />


        {/* =================== გვერდი 5: დასკვნა და კვლევა ================= */}

        <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'center'}}>დასკვნა</Text>
        <View style={styles.conclusionBox}></View>
        
        <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginTop: 10}}>კვლევითი ნაწილი</Text>
        <View style={styles.researchBox}><Text style={{color: '#ccc'}}>(ადგილი ტექსტისთვის და ფოტოებისთვის)</Text></View>

        <Text break />


        {/* =================== გვერდი 6: ხელმოწერები ============= */}

        <View style={{marginTop: 20}}>
            <Text style={{fontWeight: 'bold'}}>ინსპექტირების ანგარიში მოამზადა:</Text>
            <View style={styles.signatureRow}><View style={styles.signatureBlock}><Text>ინსპექტორი:</Text><View style={styles.signatureLine} /><Text style={{textAlign:'center', fontSize:8}}>(ხელმოწერა)</Text></View></View>
            
            <Text style={{fontWeight: 'bold', marginTop: 30}}>ტექნიკური წესით გადაამოწმა:</Text>
            <View style={styles.signatureRow}><View style={styles.signatureBlock}><Text>ტექნიკური მენეჯერი:</Text><View style={styles.signatureLine} /><Text style={{textAlign:'center', fontSize:8}}>(ხელმოწერა)</Text></View></View>
            
            <Text style={{fontWeight: 'bold', marginTop: 30}}>ადმინისტრაციული წესით გადაამოწმა:</Text>
            <View style={styles.signatureRow}><View style={styles.signatureBlock}><Text>ხელმძღვანელი: ლევან საჩიშვილი</Text><View style={styles.signatureLine} /><Text style={{textAlign:'center', fontSize:8}}>(ხელმოწერა)</Text></View></View>
        </View>

      </Page>
    </Document>
  );
};

export default ReportCoverPdf;