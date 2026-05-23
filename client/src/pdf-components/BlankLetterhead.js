import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf';

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
  watermarkContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center', zIndex: -1
  },
  watermarkImage: { width: 500, opacity: 0.08 },
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
  companyInfoText: {
    fontSize: 10,
    color: '#003366',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 2
  },
  companyNameText: {
    fontSize: 16,
    color: '#003366',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5
  },
  footerFixed: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    paddingTop: 10,
    textAlign: 'center'
  },
  footerText: {
    fontSize: 8,
    color: '#003366',
    marginBottom: 2
  },
  contactText: {
    fontSize: 8,
    color: '#003366',
    fontWeight: 'bold'
  }
});

const BlankLetterhead = ({ data }) => {
  const d = data || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        <View style={styles.watermarkContainer} fixed>
          <Image src="/logo.png" style={styles.watermarkImage} />
        </View>

        <View style={styles.headerContainer} fixed>
          <Image src="/logo.png" style={styles.logoImage} />
          <Text style={styles.companyInfoText}>A ტიპის ინსპექტირების ორგანო</Text>
          <Text style={styles.companyNameText}>ბილდექს ექსპერტიზა</Text>
          <Text style={styles.companyInfoText}>ს/კ</Text>
          <Text style={styles.companyInfoText}>აკრედიტაცია N</Text>
        </View>

        <View style={{ marginTop: 20 }}>

          {d.to || d.date ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <View>
                {d.to ? (
                  <Text style={{ fontSize: 10, color: '#003366', fontWeight: 'bold' }}>{d.to}</Text>
                ) : null}
              </View>
              {d.date ? (
                <Text style={{ fontSize: 10, color: '#003366' }}>{d.date}</Text>
              ) : null}
            </View>
          ) : null}

          {d.ref ? (
            <Text style={{ fontSize: 10, color: '#003366', marginBottom: 8 }}>N {d.ref}</Text>
          ) : null}

          {d.subject ? (
            <Text style={{ fontSize: 11, color: '#003366', fontWeight: 'bold', textAlign: 'center', marginBottom: 14 }}>
              {d.subject}
            </Text>
          ) : null}

          {d.body ? (
            <Text style={{ fontSize: 10, color: '#000', lineHeight: 1.8, textAlign: 'justify' }}>
              {d.body}
            </Text>
          ) : null}

          {d.to || d.body ? (
            <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'flex-start' }}>
              <View style={{ width: 180 }}>
                <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#003366', marginBottom: 4 }} />
                <Text style={{ fontSize: 9, color: '#003366', textAlign: 'center' }}>დირექტორი / ხელმოწერა</Text>
              </View>
            </View>
          ) : null}

        </View>

        <View style={styles.footerFixed} fixed>
          <Text style={styles.footerText}>მისამართი: თელავი, ლეონიძის ქუჩა 22</Text>
          <Text style={styles.contactText}>ტელ: +995 511 74 74 00  |  ელ.ფოსტა: info@buildexpertise.com</Text>
        </View>

      </Page>
    </Document>
  );
};

export default BlankLetterhead;
