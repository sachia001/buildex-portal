// src/components/pdf/pdfStyles.js
import { StyleSheet } from '@react-pdf/renderer';
import fontBold from '../../assets/fonts/bpg_nino_mtavruli_bold.ttf'; // შეცვალეთ თქვენი ფონტის მისამართით
import fontNormal from '../../assets/fonts/bpg_nino_mtavruli_normal.ttf'; // შეცვალეთ თქვენი ფონტის მისამართით

// ფონტების რეგისტრაცია (თუ უკვე არ გაქვთ მთავარ ფაილში)
// Font.register({ family: 'BPG Nino Mtavruli', fonts: [{ src: fontNormal }, { src: fontBold, fontWeight: 'bold' }] });

export const commonStyles = StyleSheet.create({
  page: {
    padding: '30px 40px',
    fontFamily: 'BPG Nino Mtavruli',
    fontSize: 11,
    position: 'relative', // აუცილებელია ფონისათვის
  },
  // --- წყლის ნიშანი (ფონი) ---
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)', // ცენტრში და დახრილი
    width: '80%', // სიგანე გვერდის 80%
    height: 'auto',
    opacity: 0.1, // ძალიან მკრთალი
    zIndex: -1, // ტექსტის უკან
  },
  // --- ქუდი (Header) ---
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 30,
    borderBottom: '2px solid #1a365d', // მუქი ლურჯი ხაზი ქვემოთ
    paddingBottom: 15,
  },
  logosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  // ლოგოების ზომები გაზრდილია!
  sideLogo: {
    width: 80, // იყო პატარა, გახდა 80
    height: 80,
    objectFit: 'contain',
  },
  centerLogo: {
    width: 100, // შუა ლოგო კიდევ უფრო დიდი
    height: 100,
    objectFit: 'contain',
  },
  headerTextContainer: {
    textAlign: 'center',
    color: '#1a365d',
  },
  orgName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orgDetails: {
    fontSize: 10,
  },
  // --- დამხმარე სტილები ცარიელი ფორმებისთვის ---
  blankLine: {
    borderBottom: '1px solid #000',
    marginTop: 25,
    marginBottom: 5,
    height: 20, // ხაზის სიმაღლე
  },
  blankLabel: {
    fontSize: 9,
    color: '#666',
    marginBottom: 25, // დაშორება შემდეგ ხაზამდე
  }
});