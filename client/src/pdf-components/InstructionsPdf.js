import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fontPath from '../fonts/bpg_arial.ttf';

Font.register({ family: 'BPG Arial', src: fontPath });

const S = StyleSheet.create({
  page: {
    fontFamily: 'BPG Arial',
    paddingTop: 28,
    paddingBottom: 45,
    paddingLeft: 38,
    paddingRight: 38,
    fontSize: 9,
    lineHeight: 1.4,
  },
  watermarkContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center', zIndex: -1,
  },
  watermarkImage: { width: 420, opacity: 0.06 },

  // ── header ──────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#003366',
    paddingBottom: 8,
  },
  logo: { width: 36, height: 36, objectFit: 'contain', marginRight: 10 },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 13, fontWeight: 'bold', color: '#003366' },
  headerSub: { fontSize: 8, color: '#555', marginTop: 2 },

  // ── badge strip ──────────────────────────────────────
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#003366',
    color: '#fff',
    fontSize: 7.5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 5,
    marginBottom: 4,
  },
  badgeLabel: { color: '#003366', fontSize: 7.5, fontWeight: 'bold', marginRight: 3 },
  badgeLine: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },

  // ── overview box ─────────────────────────────────────
  purposeBox: {
    backgroundColor: '#f0f4fa',
    borderLeftWidth: 3,
    borderLeftColor: '#003366',
    padding: 8,
    marginBottom: 10,
    borderRadius: 2,
  },
  purposeLabel: { fontSize: 7.5, fontWeight: 'bold', color: '#003366', marginBottom: 3 },
  purposeText: { fontSize: 8.5, color: '#222', lineHeight: 1.5 },

  // ── section header ───────────────────────────────────
  sectionHeader: {
    backgroundColor: '#003366',
    color: '#fff',
    fontSize: 8.5,
    fontWeight: 'bold',
    padding: 5,
    marginTop: 10,
    marginBottom: 4,
    borderRadius: 2,
  },

  // ── field block ──────────────────────────────────────
  fieldBlock: {
    marginBottom: 7,
    paddingLeft: 6,
    borderLeftWidth: 1,
    borderLeftColor: '#ccd6e8',
  },
  fieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  fieldName: { fontSize: 8.5, fontWeight: 'bold', color: '#003366', flex: 1 },
  requiredDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#dc3545', marginLeft: 5, marginTop: 1,
  },
  optionalDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#adb5bd', marginLeft: 5, marginTop: 1,
  },
  fieldInstr: { fontSize: 8, color: '#333', lineHeight: 1.5 },

  // ── legend ───────────────────────────────────────────
  legend: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 12,
    gap: 16,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 7, height: 7, borderRadius: 3.5, marginRight: 4 },
  legendText: { fontSize: 7.5, color: '#555' },

  // ── footer ───────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 38,
    right: 38,
    borderTopWidth: 0.5,
    borderTopColor: '#ccd6e8',
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: { fontSize: 7, color: '#888' },
});

const InstructionsPdf = ({ instrData, code }) => {
  if (!instrData) {
    return (
      <Document>
        <Page size="A4" style={S.page}>
          <Text style={{ color: '#999' }}>ინსტრუქცია ვერ მოიძებნა.</Text>
        </Page>
      </Document>
    );
  }

  const meta = [
    { label: 'შემავსებელი', value: instrData.filledBy },
    { label: 'შევსების დრო', value: instrData.when },
    { label: 'შენახვა', value: instrData.retention },
    { label: 'ISO მინ.', value: instrData.isoRef },
  ];

  return (
    <Document>
      <Page size="A4" style={S.page}>
        {/* watermark */}
        <View style={S.watermarkContainer} fixed>
          <Image src="/logo.png" style={S.watermarkImage} />
        </View>

        {/* header */}
        <View style={S.header} fixed>
          <Image src="/logo.png" style={S.logo} />
          <View style={S.headerText}>
            <Text style={S.headerTitle}>📋 შევსების ინსტრუქცია — {code}</Text>
            <Text style={S.headerSub}>{instrData.title}</Text>
          </View>
          <Text style={{ fontSize: 7.5, color: '#888' }}>ბილდექს ექსპერტიზა | ISO 17020</Text>
        </View>

        {/* meta badges */}
        <View style={{ marginBottom: 8 }}>
          {meta.map(function(m) {
            return m.value ? (
              <View key={m.label} style={S.badgeLine}>
                <Text style={S.badgeLabel}>{m.label}:</Text>
                <Text style={{ fontSize: 8, color: '#333' }}>{m.value}</Text>
              </View>
            ) : null;
          })}
        </View>

        {/* purpose box */}
        {instrData.purpose ? (
          <View style={S.purposeBox}>
            <Text style={S.purposeLabel}>დოკუმენტის დანიშნულება</Text>
            <Text style={S.purposeText}>{instrData.purpose}</Text>
          </View>
        ) : null}

        {/* legend */}
        <View style={S.legend}>
          <View style={S.legendItem}>
            <View style={[S.legendDot, { backgroundColor: '#dc3545' }]} />
            <Text style={S.legendText}>სავალდებულო ველი</Text>
          </View>
          <View style={S.legendItem}>
            <View style={[S.legendDot, { backgroundColor: '#adb5bd' }]} />
            <Text style={S.legendText}>სურვილისამებრ ველი</Text>
          </View>
        </View>

        {/* sections */}
        {(instrData.sections || []).map(function(sec) {
          return (
            <View key={sec.title} wrap={false}>
              <Text style={S.sectionHeader}>{sec.title}</Text>
              {(sec.fields || []).map(function(f) {
                return (
                  <View key={f.field} style={S.fieldBlock}>
                    <View style={S.fieldRow}>
                      <Text style={S.fieldName}>{f.field}</Text>
                      <View style={f.required ? S.requiredDot : S.optionalDot} />
                    </View>
                    <Text style={S.fieldInstr}>{f.instruction}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}

        {/* footer */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>ბილდექს ექსპერტიზა — შევსების ინსტრუქცია: {code}</Text>
          <Text style={S.footerText}>ISO/IEC 17020:2012 | {instrData.isoRef}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InstructionsPdf;
