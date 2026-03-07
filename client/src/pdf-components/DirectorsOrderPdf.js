import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf'; 

Font.register({ family: 'BPG Arial', src: fontPath });

const styles = StyleSheet.create({
  page: { 
    fontFamily: 'BPG Arial', 
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 40,
    paddingRight: 40,
    fontSize: 10,
    lineHeight: 1.3
  },
  watermarkContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center', zIndex: -1
  },
  watermarkImage: { width: 400, opacity: 0.1 },

  // --- ჰედერი ---
  header: { alignItems: 'center', marginBottom: 10, width: '100%' },
  logoImage: { height: 60, objectFit: 'contain', marginBottom: 5 },
  companyInfoText: { fontSize: 9, color: '#003366', fontWeight: 'bold', textAlign: 'center', marginTop: 2 },
  companyNameText: { fontSize: 14, color: '#003366', fontWeight: 'bold', textAlign: 'center', marginTop: 3, marginBottom: 3 },

  // ბრძანების ნომერი და სათაური
  orderTitleBlock: { textAlign: 'center', marginBottom: 10, marginTop: 5 },
  orderTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  orderNumber: { fontSize: 11, fontWeight: 'bold' },
  
  // თარიღი და ადგილი
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, paddingBottom: 0 },

  // შინაარსი
  subjectText: { fontSize: 10, fontWeight: 'bold', marginBottom: 10, textAlign: 'left' },
  preambleText: { textAlign: 'justify', marginBottom: 10, fontSize: 10 },
  commandTitle: { fontWeight: 'bold', marginBottom: 10, textAlign: 'center', fontSize: 11, letterSpacing: 2 },
  listItem: { flexDirection: 'row', marginBottom: 5, textAlign: 'justify' },
  
  // ხელმოწერა
  footer: { 
      marginTop: 20, 
      flexDirection: 'row', 
      justifyContent: 'space-between',
      alignItems: 'flex-end' // რომ ხელმოწერა ხაზზე დაჯდეს
  },
  signatureBlock: { 
      alignItems: 'center', 
      width: 150 
  },
  // 👇 ახალი სტილი ხელმოწერის სურათისთვის
  signatureImage: {
      width: 100,
      height: 50,
      objectFit: 'contain',
      marginBottom: -10 // ოდნავ ჩამოვწიოთ რომ ხაზს დაადგეს
  },
  signatureLine: { 
      borderTopWidth: 1, 
      borderTopColor: '#000', 
      width: '100%', // ხაზი მთელ სიგანეზე
      textAlign: 'center', 
      paddingTop: 5, 
      fontSize: 9 
  }
});

const DirectorsOrderPdf = ({ data }) => {
  // data ელოდება: number, date, subject, preamble, clauses, directorName, AND signature (image data)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        <View style={styles.watermarkContainer} fixed><Image src="/logo.png" style={styles.watermarkImage} /></View>

        <View style={styles.header}>
            <Image src="/logo.png" style={styles.logoImage} />
            <Text style={styles.companyInfoText}>A ტიპის ინსპექტირების ორგანო</Text>
            <Text style={styles.companyNameText}>„ბილდექს ექსპერტიზა“</Text>
            <Text style={styles.companyInfoText}>ს/კ</Text>
            <Text style={styles.companyInfoText}>აკრედიტაცია N</Text>
        </View>

        <View style={styles.orderTitleBlock}>
            <Text style={styles.orderTitle}>დირექტორის ბრძანება</Text>
            <Text style={styles.orderNumber}>№ {data.number}</Text>
        </View>

        <View style={styles.dateRow}><Text>ქ. თელავი</Text><Text>{data.date}</Text></View>

        <Text style={styles.subjectText}>თემა: {data.subject}</Text>
        <Text style={styles.preambleText}>{data.preamble}</Text>
        <Text style={styles.commandTitle}>ვ ბ რ ძ ა ნ ე ბ:</Text>
        {data.clauses.map((clause, index) => (<View key={index} style={styles.listItem}><Text>{clause.title ? <Text style={{fontWeight: 'bold'}}>{clause.title}: </Text> : <Text>{index + 1}. </Text>}{clause.text}</Text></View>))}

        {/* --- ხელმოწერის ბლოკი (განახლებული) --- */}
        <View style={styles.footer}>
            <View>
                <Text style={{fontWeight: 'bold', fontSize: 10}}>დირექტორი</Text>
                <Text style={{marginTop: 5, fontSize: 10}}>{data.directorName || "ლევან საჩიშვილი"}</Text>
            </View>
            
            <View style={styles.signatureBlock}>
                {/* 👇 თუ არის ხელმოწერის სურათი, ვსვამთ მას, თუ არა - ცარიელ ადგილს */}
                {data.signature ? (
                    <Image src={data.signature} style={styles.signatureImage} />
                ) : null}
                
                {/* ხაზი და წარწერა (ხელმოწერა) */}
                <Text style={styles.signatureLine}>(ხელმოწერა)</Text>
            </View>
        </View>

      </Page>
    </Document>
  );
};

export default DirectorsOrderPdf;