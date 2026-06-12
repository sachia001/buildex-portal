import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf';

Font.register({ family: 'BPG Arial', src: fontPath });

const styles = StyleSheet.create({
  page: {
    fontFamily: 'BPG Arial',
    paddingTop: 30,
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
  watermarkImage: { width: 500, opacity: 0.08 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 75,
    marginBottom: 10
  },
  logosLeft: {
    width: 250,
    height: 70,
    position: 'relative'
  },
  logoGAC:     { position: 'absolute', left: 0,   top: 0, width: 140, height: 60, objectFit: 'contain' },
  logoBuildex: { position: 'absolute', left: 150, top: 0, width: 60,  height: 60, objectFit: 'contain' },
  directorText: {
    textAlign: 'right',
    fontSize: 10,
    marginTop: 15,
    color: '#000',
    width: 220
  },
  infoRow:      { flexDirection: 'row', marginBottom: 6, alignItems: 'center' },
  infoLabel:    { width: 120, fontWeight: 'bold', fontSize: 10 },
  infoValueLine: { borderBottomWidth: 0.5, borderBottomColor: '#ccc', width: 185, height: 13, marginLeft: 5 },
  title:        { fontSize: 15, textAlign: 'center', marginTop: 10, fontWeight: 'bold', color: '#003366' },
  subtitle:     { fontSize: 11, textAlign: 'center', marginTop: 4, marginBottom: 10, color: '#003366' },
  sectionHeader: { backgroundColor: '#f4f4f4', padding: 3, marginTop: 6, marginBottom: 5, fontSize: 10, fontWeight: 'bold' },
  objectRow:    { flexDirection: 'row', marginBottom: 6 },
  objectLabel:  { width: 90, fontWeight: 'bold' },
  objectLine:   { borderBottomWidth: 0.5, borderBottomColor: '#ccc', flex: 1, height: 13, marginLeft: 5 },
  checkboxRow:  { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4, paddingLeft: 5 },
  box:          { width: 11, height: 11, border: '0.5px solid #000', marginRight: 10, marginTop: 2 },
  boxFilled:    { width: 11, height: 11, border: '0.5px solid #000', marginRight: 10, marginTop: 2, backgroundColor: '#003366' },
  checkboxText: { flex: 1, fontSize: 10 },
  textAreaBox:  { border: '0.5px solid #000', height: 90, marginTop: 4, marginBottom: 5 },
  footerContainer: { marginTop: 'auto', paddingTop: 10 },
  footer:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  footerLine:   { borderBottomWidth: 0.5, borderBottomColor: '#000', width: 150, marginBottom: 2 }
});

const ALL_SCOPES = [
  'ობიექტის ხარჯთაღრიცხვის ინსპექტირება',
  'ობიექტის ხარჯთაღრიცხვის ფასწარმოქმნის ადეკვატურობის ინსპექტირება',
  'ობიექტზე შესრულებული სამუშაოების ინსპექტირება (მათ შორის ფორმა#2-ის მიხედვით)'
];

const ALL_DOCS = [
  'სატენდერო ხელშეკრულება;',
  'შეთანხმება;',
  'კორექტირებული ხარჯთაღრიცხვა;',
  'შესრულებული სამუშაოების ფორმა №2;',
  'ფარული სამუშაოთა აქტები;',
  'ლაბორატორიული დასკვნები;',
  'სხვა'
];

const BlankApplicationForm = ({ data }) => {
  const d = data || {};
  const selectedScopes = d.selectedScopes || [];
  const selectedDocs   = d.selectedDocs   || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        <View style={styles.watermarkContainer}>
          <Image src="/logo.png" style={styles.watermarkImage} />
        </View>

        <View style={styles.headerContainer}>
          <View style={styles.logosLeft}>
            <Image src="/logo.png" style={styles.logoBuildex} />
          </View>
          <View style={styles.directorText}>
            <Text>შპს ბილდექს ექსპერტიზა-ს დირექტორს</Text>
            <Text style={{ marginTop: 5, fontWeight: 'bold' }}>ლევან საჩიშვილს</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ორგანიზაცია:</Text>
          {d.org
            ? <Text style={{ fontSize: 10, marginLeft: 5 }}>{d.org}</Text>
            : <View style={styles.infoValueLine} />}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>წარმომადგენელი:</Text>
          {d.rep
            ? <Text style={{ fontSize: 10, marginLeft: 5 }}>{d.rep}</Text>
            : <View style={styles.infoValueLine} />}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ID/კოდი/პ.ნომ.:</Text>
          {d.idCode
            ? <Text style={{ fontSize: 10, marginLeft: 5 }}>{d.idCode}</Text>
            : <View style={styles.infoValueLine} />}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ელ.ფოსტა:</Text>
          {d.email
            ? <Text style={{ fontSize: 10, marginLeft: 5 }}>{d.email}</Text>
            : <View style={styles.infoValueLine} />}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ტელეფონი:</Text>
          {d.phone
            ? <Text style={{ fontSize: 10, marginLeft: 5 }}>{d.phone}</Text>
            : <View style={styles.infoValueLine} />}
        </View>

        <Text style={styles.title}>გ ა ნ ც ხ ა დ ე ბ ა</Text>
        <Text style={styles.subtitle}>ინსპექტირების შესახებ</Text>

        <Text style={styles.sectionHeader}>ინსპექტირების ობიექტი:</Text>
        <View style={styles.objectRow}>
          <Text style={styles.objectLabel}>დასახელება:</Text>
          {d.objectName
            ? <Text style={{ fontSize: 10, marginLeft: 5, flex: 1 }}>{d.objectName}</Text>
            : <View style={styles.objectLine} />}
        </View>
        <View style={styles.objectRow}>
          <Text style={styles.objectLabel}>მისამართი:</Text>
          {d.objectAddress
            ? <Text style={{ fontSize: 10, marginLeft: 5, flex: 1 }}>{d.objectAddress}</Text>
            : <View style={styles.objectLine} />}
        </View>

        <Text style={styles.sectionHeader}>სფერო:</Text>
        {ALL_SCOPES.map(function(item) {
          var ticked = selectedScopes.indexOf(item) !== -1;
          return (
            <View key={item} style={styles.checkboxRow}>
              <View style={ticked ? styles.boxFilled : styles.box} />
              <Text style={styles.checkboxText}>{item}</Text>
            </View>
          );
        })}

        <Text style={styles.sectionHeader}>განცხადების შინაარსი:</Text>
        {d.content
          ? <View style={[styles.textAreaBox, { padding: 4 }]}><Text style={{ fontSize: 10 }}>{d.content}</Text></View>
          : <View style={styles.textAreaBox} />}

        <Text style={styles.sectionHeader}>წარმოდგენილი დოკუმენტაცია:</Text>
        {ALL_DOCS.map(function(item) {
          var ticked = selectedDocs.indexOf(item) !== -1;
          return (
            <View key={item} style={styles.checkboxRow}>
              <View style={ticked ? styles.boxFilled : styles.box} />
              <Text style={styles.checkboxText}>{item}</Text>
            </View>
          );
        })}

        <View style={styles.footerContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Text>დანართი: </Text>
            <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#000', width: 40, marginLeft: 5 }} />
            <Text style={{ marginLeft: 5 }}>ფურცლად.</Text>
          </View>
          <View style={styles.footer}>
            <View>
              <View style={styles.footerLine} />
              <Text style={{ fontSize: 10, textAlign: 'center' }}>ხელმოწერა</Text>
            </View>
            <View>
              <View style={styles.footerLine} />
              <Text style={{ fontSize: 10, textAlign: 'center' }}>თარიღი</Text>
            </View>
          </View>
        </View>

      </Page>
    </Document>
  );
};

export default BlankApplicationForm;
