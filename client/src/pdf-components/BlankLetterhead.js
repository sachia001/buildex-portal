import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf'; 

// ფონტის რეგისტრაცია
Font.register({ family: 'BPG Arial', src: fontPath });

const styles = StyleSheet.create({
  page: {
    fontFamily: 'BPG Arial',
    paddingTop: 30,
    paddingBottom: 50,
    paddingLeft: 40,
    paddingRight: 40,
    fontSize: 10,
    lineHeight: 1.5,
    backgroundColor: '#fff'
  },

  // --- წყლის ნიშანი (ფონი) ---
  watermarkContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center', zIndex: -1
  },
  watermarkImage: { width: 500, opacity: 0.08 },

  // --- ჰედერი ---
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    paddingBottom: 10
  },

  logoImage: { 
      height: 80, 
      objectFit: 'contain', 
      marginBottom: 5 
  },

  // ყველა ტექსტი ერთი ფერით
  companyInfoText: { 
      fontSize: 10, 
      color: '#003366', // ერთიანი ფერი
      fontWeight: 'bold', 
      textAlign: 'center', 
      marginTop: 2 
  },
  companyNameText: { 
      fontSize: 16, 
      color: '#003366', // ერთიანი ფერი
      fontWeight: 'bold', 
      textAlign: 'center', 
      marginTop: 5, 
      marginBottom: 5 
  },

  // --- ფუტერი ---
  footerFixed: {
    position: 'absolute', 
    bottom: 20, 
    left: 40, 
    right: 40,
    // borderTopWidth: 0.5, // ❌ ხაზი წავშალეთ
    // borderTopColor: '#ccc', 
    paddingTop: 10,
    textAlign: 'center'
  },
  // ფუტერის ტექსტებიც იმავე ფერით
  footerText: { 
      fontSize: 8, 
      color: '#003366', // ერთიანი ფერი (იყო #666)
      marginBottom: 2 
  },
  contactText: { 
      fontSize: 8, 
      color: '#003366', // ერთიანი ფერი
      fontWeight: 'bold' 
  }
});

const BlankLetterhead = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* წყლის ნიშანი */}
        <View style={styles.watermarkContainer} fixed>
           <Image src="/logo.png" style={styles.watermarkImage} />
        </View>

        {/* --- ჰედერი --- */}
        <View style={styles.headerContainer} fixed>
            <Image src="/logo.png" style={styles.logoImage} />
            
            <Text style={styles.companyInfoText}>A ტიპის ინსპექტირების ორგანო</Text>
            <Text style={styles.companyNameText}>„ბილდექს ექსპერტიზა“</Text>
            
            <Text style={styles.companyInfoText}>ს/კ</Text>
            <Text style={styles.companyInfoText}>აკრედიტაცია N</Text>
        </View>

        {/* --- შინაარსის ადგილი (ცარიელი) --- */}
        <View style={{ marginTop: 20 }}>
            {/* აქ შეგიძლიათ ჩაწეროთ ნებისმიერი ტექსტი, თუ გჭირდებათ */}
        </View>

        {/* --- ფუტერი --- */}
        <View style={styles.footerFixed} fixed>
             <Text style={styles.footerText}>მისამართი: თელავი, ლეონიძის ქუჩა 22</Text>
             <Text style={styles.contactText}>ტელ: +995 511 74 74 00 | ელ.ფოსტა: info@buildexpertise.com</Text>
        </View>

      </Page>
    </Document>
  );
};

export default BlankLetterhead;