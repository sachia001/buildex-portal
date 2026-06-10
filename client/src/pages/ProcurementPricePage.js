import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form, Button, Badge, Card, Tab, Tabs, Table, InputGroup } from 'react-bootstrap';

// ══════════════════════════════════════════════════════════════
// CPP
// ══════════════════════════════════════════════════════════════
const CPP_BASE = 'https://cpp.procurement.gov.ge/tables/a1c7862a-fc91-4d5d-832b-1d0787d99b57';
const QUICK_SEARCHES = [
    { label: 'ბეტონი', emoji: '🏗️' }, { label: 'ცემენტი', emoji: '🪨' },
    { label: 'ქვიშა',  emoji: '⏳' },  { label: 'ხრეში',   emoji: '🪨' },
    { label: 'არმატურა', emoji: '🔩'}, { label: 'აგური',   emoji: '🧱' },
    { label: 'ლითონი', emoji: '⚙️' },  { label: 'ხე',      emoji: '🪵' },
    { label: 'გიფსი',  emoji: '🏠' },  { label: 'ასფალტი', emoji: '🛣️' },
    { label: 'კრამიტი',emoji: '🏠' },  { label: 'საღებავი',emoji: '🎨' },
    { label: 'მილი',   emoji: '〰️' },  { label: 'ჭიქა',    emoji: '🪟' },
    { label: 'ლუქი',   emoji: '🔩' },
];

// ══════════════════════════════════════════════════════════════
// Normative Database
// ══════════════════════════════════════════════════════════════
const CATEGORIES = {
    LAW:    { label: '📜 კანონები',               color: 'primary'   },
    TECH:   { label: '⚙️ ტექ. რეგლამენტები',      color: 'warning'   },
    NORM:   { label: '📐 სამშ. ნორმები (PN/GN)',   color: 'info'      },
    INSP:   { label: '🔍 ინსპ. / ზედამხ.',         color: 'success'   },
    SAFETY: { label: '🔥 უსაფრთხოება',             color: 'danger'    },
    ENV:    { label: '🌿 გარემო / ხმაური',         color: 'secondary' },
    STD:    { label: '📊 სსტ / ISO',               color: 'dark'      },
    ACC:    { label: '✅ აკრედიტაცია',             color: 'primary'   },
    SNIP_S: { label: '🏛️ სნიპი — სტრუქტ.',        color: 'info'      },
    SNIP_F: { label: '🔥 სნიპი — ხანძარი',         color: 'danger'    },
    SNIP_E: { label: '🔧 სნიპი — ინჟ. სისტ.',      color: 'warning'   },
    SNIP_O: { label: '🏗️ სნიპი — ორგ./შრ. დ.',    color: 'secondary' },
    SNIP_C: { label: '💰 სნიპი — ღირ./ეკ.',        color: 'dark'      },
    GOST:   { label: '📋 GOST სტანდარტები',        color: 'secondary' },
    ELEC:   { label: '⚡ ელ. ინსტ. / ენ.',         color: 'warning'   },
};

const snipUrl = (code) =>
    `https://docs.cntd.ru/document/${code}`;

const NORMS = [
    // ── კანონები ─────────────────────────────────────────────
    { id:1, cat:'LAW', name:'სივრ. დაგ., არქ. და სამშ. საქმ. კოდექსი', nameEn:'Code of Spatial Planning, Architecture and Construction', docNum:'3213-რს', year:2018, desc:'სამშ. საქმ., ზედამხ. და ნებართვების ყოვლ. ჩარჩო', url:'https://matsne.gov.ge/ka/document/view/4276845' },
    { id:2, cat:'LAW', name:'პროდუქტის უსაფ. და თავ. მიმ. კოდექსი', nameEn:'Product Safety and Free Movement Code', docNum:'6157-Iს', year:2012, desc:'სამშ. პროდ. უსაფ., ბაზრის ზედამხ.', url:'https://matsne.gov.ge/ka/document/view/1659419' },
    { id:3, cat:'LAW', name:'სამშენებლო საქმიანობის შესახებ', nameEn:'Law on Construction Activity', docNum:'—', year:2001, desc:'სამშ. საქმ. სამ., ორგ. და ეკ. საფ.', url:'https://matsne.gov.ge/ka/document/view/17338' },
    { id:4, cat:'LAW', name:'არქიტექტურული საქმ. შ-ხ.', nameEn:'Law on Architectural Activities', docNum:'—', year:2000, desc:'არქ. საქმ. და საპ. სტ-ბი', url:'https://matsne.gov.ge/ka/document/view/32506' },
    { id:5, cat:'LAW', name:'სახ. სახ. ზედამხ. - სამშ. ზ. (სსზ)', nameEn:'State Supervision of Construction Activities', docNum:'—', year:2000, desc:'სახ. ზედამხ. სამშ. საქმ-ზე', url:'https://matsne.gov.ge/ka/document/view/29956' },
    { id:6, cat:'LAW', name:'სახანძრო უსაფ. შ-ხ.', nameEn:'Law on Fire Safety', docNum:'—', year:1999, desc:'სახ. უსაფ. სამ. ჩარჩო', url:'https://matsne.gov.ge/ka/document/view/93748' },
    { id:7, cat:'LAW', name:'გარ. ზემ. შეფ. კოდექსი', nameEn:'Environmental Impact Assessment Code', docNum:'—', year:2017, desc:'სამშ. პ-ტ. გარ. ზემ. შეფასება', url:'https://matsne.gov.ge/ka/document/view/3691981' },
    { id:8, cat:'LAW', name:'შრომის უსაფ. შ-ხ.', nameEn:'Occupational Safety and Health Law', docNum:'—', year:2019, desc:'სამშ. ინდ. შრ. დაცვა; ILO სტ.', url:'https://matsne.gov.ge/ka/document/view/4872370' },
    { id:9, cat:'LAW', name:'მომხ. უფ. დ. შ-ხ.', nameEn:'Consumer Rights Protection Law', docNum:'—', year:1996, desc:'სამშ. პ-ტ. და მომს. სფ. მომხ. უფ.', url:'https://matsne.gov.ge/ka/document/view/32974' },

    // ── ტექ. რეგლ. ───────────────────────────────────────────
    { id:10, cat:'TECH', name:'ტ.რ.: შ-ბ. უსაფ. წ. (დ.41)', nameEn:'Tech.Reg.: Building Safety Rules (Decree 41)', docNum:'დ.41', year:2016, desc:'III–V კლ. შ-ბ. მინ. უსაფ. სტ.; სახ., გასასვ., ხელმ.', url:'https://matsne.gov.ge/ka/document/view/3176389' },
    { id:11, cat:'TECH', name:'ტ.რ.: სამშ. პროდ. (დ.476)', nameEn:'Tech.Reg.: Construction Products (Decree 476)', docNum:'დ.476', year:2018, desc:'ცემ., არმ., ელ.კ., პლ.მ. — ტექ. მოთ.', url:'https://matsne.gov.ge/ka/document/view/4336673' },
    { id:12, cat:'TECH', name:'ტ.რ.: სამშ. პ-ი (2024 ცვლ. დ.106)', nameEn:'Tech.Reg.: Construction Products Amendment 2024', docNum:'დ.106', year:2024, desc:'სამშ. პ-ტ. ტ. სტ-ბ. უახ. განახლება', url:'https://matsne.gov.ge/ka/document/view/6143338' },
    { id:13, cat:'TECH', name:'ტ.რ.: სამშ. სფ. (კრ.)', nameEn:'Technical Regulations of the Construction Sector', docNum:'—', year:2013, desc:'სამშ. სფ. ტ. რ-ბ. კომ.', url:'https://matsne.gov.ge/ka/document/view/2197044' },
    { id:14, cat:'TECH', name:'ტ.რ.: მომ. ტ. საფ. ობ.', nameEn:'Tech.Reg.: Technical Risk Parameters for Hazardous Objects', docNum:'—', year:2014, desc:'მ. ტ. საფ. ობ. ზღვ. პ-ბი', url:'https://matsne.gov.ge/ka/document/view/1810771' },
    { id:15, cat:'TECH', name:'ტ.რ.: ბ. განათ. და ინსოლ.', nameEn:'Tech.Reg.: Natural Lighting and Insolation', docNum:'—', year:2012, desc:'საც. შ-ბ. ბ. განათ. და მ. ნ. სტ.', url:'https://matsne.gov.ge/ka/document/view/1372410' },
    { id:16, cat:'TECH', name:'ტ.რ.: ხმ. ნ. შ-ბ-ში (2024)', nameEn:'Tech.Reg.: Acoustic Noise in Buildings (2024)', docNum:'—', year:2024, desc:'საც. და საზ. შ-ბ. ხმ. ნ.', url:'https://matsne.gov.ge/ka/document/view/3779710' },

    // ── PN / GN ნ. ───────────────────────────────────────────
    { id:17, cat:'NORM', name:'PN 01.01-09 — სეისმ. სამშ. (ქ. ს.)', nameEn:'Georgian Building Code: Earthquake Engineering', docNum:'PN 01.01-09', year:2009, desc:'3+ სართ. სავ. სეიზ. ნ.; UBC-97 ბ-ზ.; 2014-დ. სავ.', url:'https://iisee.kenken.go.jp/worldlist/20_Georgia/20_Georgia_Code.pdf' },
    { id:18, cat:'NORM', name:'1992-მდე ნ. გამ. (СНИП/GOST)', nameEn:'Use of Pre-1992 Soviet Standards', docNum:'—', year:2012, desc:'СНИП/GOST — საბჭ. ნ. გარდ. გამ.', url:'https://matsne.gov.ge/ka/document/view/1210709' },
    { id:19, cat:'NORM', name:'მ.ნ. გ. წ. (დ.140)', nameEn:'Construction Permit Issuance Procedures (Decree 140)', docNum:'დ.140', year:2005, desc:'სამშ. ნ. გ. პ-ბი და პ-რ-ები', url:'https://matsne.gov.ge/ka/document/view/5014' },
    { id:20, cat:'NORM', name:'განს. მ. ობ. მ.ნ.', nameEn:'Construction Permits for Special Objects', docNum:'—', year:2021, desc:'კრ. ინფ. (ბ., სარ.) სამშ. ნ-ები', url:'https://matsne.gov.ge/ka/document/view/4578118' },
    { id:21, cat:'NORM', name:'სამშ. სამ. ზ. ხ. და მ.', nameEn:'Overhead Costs in Construction Procurement', docNum:'—', year:2013, desc:'სახ. შ. სამ. ხ. და მ. გამ.', url:'https://matsne.gov.ge/ka/document/view/2195703' },
    { id:22, cat:'NORM', name:'სივ. დ. გეგ. მ. შ. წ.', nameEn:'Spatial Planning Methodology', docNum:'—', year:2021, desc:'სივ. დ. დ. შ. მ.', url:'https://matsne.gov.ge/ka/document/view/4579368' },
    { id:23, cat:'NORM', name:'ტ. გ. ძ. დ. (ტ. გ. უ. ო.)', nameEn:'Territory Use and Development Basic Provisions', docNum:'—', year:2021, desc:'ტ. გ. და გ. მ. ძ. პ.', url:'https://matsne.gov.ge/ka/document/view/4579383' },
    { id:24, cat:'NORM', name:'სამშ. ნ. — საგ. სიტ. / სამ. თ.', nameEn:'Construction Norms: Emergency / Civil Protection', docNum:'—', year:2004, desc:'საგ. სიტ. საინჟ.-ტ. ღ.', url:'https://matsne.gov.ge/ka/document/view/54226' },
    { id:25, cat:'NORM', name:'პ-ტ. კომ. ე-ზ. და დ. ნ.', nameEn:'Construction Project Comprehensive Expertise Standards', docNum:'—', year:2012, desc:'სამშ. პ-ტ. კ. ე-ზ. სტ.', url:'https://matsne.gov.ge/ka/document/view/1353340' },
    { id:26, cat:'NORM', name:'განს.მ.ობ. სავ. ე-ზ. დ. წ.', nameEn:'Mandatory Expert Examination for Special Objects', docNum:'—', year:2013, desc:'კრ. ი-ს. სამშ. პ-ტ. სავ. ე-ზ.', url:'https://matsne.gov.ge/ka/document/view/2198097' },

    // ── ინსპ. ────────────────────────────────────────────────
    { id:27, cat:'INSP', name:'ტ. და სამშ. ზ. სა. (TCSA) — დ.', nameEn:'Technical and Construction Supervision Agency Charter', docNum:'—', year:2012, desc:'TCSA ფ-ბი, სამშ. ზ.', url:'https://matsne.gov.ge/ka/document/view/2420052' },
    { id:28, cat:'INSP', name:'TCSA მ. სახ. და საფ.', nameEn:'TCSA Service Types and Fees', docNum:'—', year:2013, desc:'ტ. ზ. მ. სახ. და ტ-ბი', url:'https://matsne.gov.ge/ka/document/view/1969977' },
    { id:29, cat:'INSP', name:'მ. ტ. ზ. გ. დ. წ. (2024)', nameEn:'Temporary Technical Supervision Rule', docNum:'—', year:2023, desc:'სამშ. ო. ტ. ზ. დ. წ. (2024 მ-მ.)', url:'https://matsne.gov.ge/ka/document/view/5998745' },
    { id:30, cat:'INSP', name:'ISO/IEC 17020:2012 — ი. ო. მ.', nameEn:'ISO/IEC 17020:2012 Requirements for Inspection Bodies', docNum:'ISO/IEC 17020', year:2012, desc:'A-ტ. ი. ო. მ-ბი; GAC აკ. ბ-ზა', url:'https://gac.gov.ge/ka/accreditation/inspection-body' },

    // ── უსაფ. ────────────────────────────────────────────────
    { id:31, cat:'SAFETY', name:'სახ. სახ. წ. (ს-ო)', nameEn:'Fire Safety Rules for Georgia', docNum:'—', year:2005, desc:'სახ. წ. — პ-ა, ევ-ა, კ. მ.', url:'https://matsne.gov.ge/ka/document/view/70018' },
    { id:32, cat:'SAFETY', name:'ტ.რ.: შ-ბ. სახ. სისტ.', nameEn:'Tech.Reg.: Fire Detection/Suppression in Buildings', docNum:'დ.41 (ნ.I)', year:2016, desc:'შ. კლ. და სახ. სისტ., ევ. სქ.', url:'https://matsne.gov.ge/ka/document/view/3176389' },

    // ── გარ. / ხმ. ───────────────────────────────────────────
    { id:33, cat:'ENV', name:'გარ. დ. სამშ. სამ-ში', nameEn:'Environmental Protection in Construction', docNum:'—', year:2017, desc:'ჰ., ხმ. და ვ. გ. ნ-ბი', url:'https://matsne.gov.ge/ka/document/view/16210' },

    // ── ISO ──────────────────────────────────────────────────
    { id:34, cat:'STD', name:'სსტ ISO/IEC 17020 (ქ. ვ.)', nameEn:'Georgian Standard ISO/IEC 17020', docNum:'სსტ ISO/IEC 17020', year:2013, desc:'GAC-ის ი. ო. ე. სტ.', url:'https://sst.geostm.gov.ge/' },
    { id:35, cat:'STD', name:'სსტ EN 1990 — Eurocode 0', nameEn:'Eurocode 0: Basis of Structural Design', docNum:'სსტ EN 1990', year:2023, desc:'ე-კ. 0 — GEOSTM-ში რ.; EN 1, 2, 7 პ-ნ.', url:'https://sst.geostm.gov.ge/' },
    { id:36, cat:'STD', name:'GEOSTM სამშ. სტ. (91.040)', nameEn:'GEOSTM Construction Standards 91.040.01', docNum:'91.040.01', year:2024, desc:'სამშ. შ-ბ. სსტ ISO/EN კ-ა', url:'https://sst.geostm.gov.ge/9104001-%E1%83%9B%E1%83%A8%E1%83%94%E1%83%9C%E1%83%94%E1%83%91%E1%83%9A%E1%83%9D' },
    { id:37, cat:'STD', name:'GEOSTM სამ. მ-ლ. სტ. (91.100)', nameEn:'GEOSTM Construction Materials Standards 91.100', docNum:'91.100', year:2024, desc:'ც., ბ., ა., კ. სსტ ISO/EN', url:'https://sst.geostm.gov.ge/91100-%E1%83%A1%E1%83%90%E1%83%9B%E1%83%A8%E1%83%94%E1%83%9C%E1%83%94%E1%83%91%E1%83%9A%E1%83%9D' },
    { id:38, cat:'STD', name:'GEOSTM სამ. ინჟ. (93.010)', nameEn:'GEOSTM Civil Engineering Standards 93.010', docNum:'93.010', year:2024, desc:'გ., ხ., ბ. სამ. სსტ', url:'https://sst.geostm.gov.ge/93010-%E1%83%A1%E1%83%90%E1%83%9B%E1%83%9D%E1%83%A5%E1%83%90%E1%83%9A%E1%83%90%E1%83%A5%E1%83%9D' },

    // ── ACC ──────────────────────────────────────────────────
    { id:39, cat:'ACC', name:'GAC — ი. ო. (ISO/IEC 17020)', nameEn:'Georgian Accreditation Center — Inspection Bodies', docNum:'ISO/IEC 17020', year:2012, desc:'EA MLA / ILAC MRA წ.; A-ტ. ი.ო. სქ.', url:'https://gac.gov.ge/ka/accreditation/inspection-body' },
    { id:40, cat:'ACC', name:'ISO/IEC 17065 — პ. სერ. ო.', nameEn:'ISO/IEC 17065 Product Certification Bodies', docNum:'ISO/IEC 17065', year:2012, desc:'სამ. პ-ტ. სერ. ო. GAC', url:'https://gac.gov.ge/ka/accreditation/certification-body-products' },
    { id:41, cat:'ACC', name:'ISO/IEC 17025 — ლ-ბ.', nameEn:'ISO/IEC 17025 Testing/Calibration Laboratories', docNum:'ISO/IEC 17025', year:2017, desc:'სამ. მ-ლ. ლ-ბ. სტ.', url:'https://gac.gov.ge/ka/accreditation/laboratory' },

    // ════════════════════════════════════════════════════════
    // სნიპები — სტრუქტ.
    // ════════════════════════════════════════════════════════
    { id:42, cat:'SNIP_S', name:'СНиП 2.01.07-85* — დ. და ზ. (ძ.)', nameEn:'SNiP 2.01.07-85* — Loads and Impacts (Fundamental)', docNum:'СНиП 2.01.07-85*', year:1985, desc:'ძირ. სამ. დ. სქ. — ცო., ქ., ს., ვ., ტ., ს. ხ.', url:snipUrl('871001064') },
    { id:43, cat:'SNIP_S', name:'СНиП II-7-81* — სეისმ. ა. სამშ.', nameEn:'SNiP II-7-81* — Construction in Seismic Areas', docNum:'СНиП II-7-81*', year:1981, desc:'საქ-ო სეისმ. ზ-ებ. (VII–IX ბ.) სამ. კ.  — კრ. ნ.', url:snipUrl('871001066') },
    { id:44, cat:'SNIP_S', name:'СНиП 2.02.01-83* — ს. სა.', nameEn:'SNiP 2.02.01-83* — Foundations of Buildings', docNum:'СНиП 2.02.01-83*', year:1983, desc:'შ-ბ. და ნ. საძ-ბი — სა. და ბ. გ. ნ.', url:snipUrl('871001065') },
    { id:45, cat:'SNIP_S', name:'СНиП 2.02.03-85 — გ. ო.', nameEn:'SNiP 2.02.03-85 — Pile Foundations', docNum:'СНиП 2.02.03-85', year:1985, desc:'ოლ. საძ-ბ. — სახ., ტ. გ. ო-ი', url:snipUrl('871001071') },
    { id:46, cat:'SNIP_S', name:'СНиП 2.03.01-84* — ბ. და ა. ბ.', nameEn:'SNiP 2.03.01-84* — Concrete and Reinforced Concrete', docNum:'СНиП 2.03.01-84*', year:1984, desc:'ბ. და ა/ბ. კ-ბი — ძ., კ., ვ., ს.', url:snipUrl('871001076') },
    { id:47, cat:'SNIP_S', name:'СНиП II-23-81* — ლ. კ.', nameEn:'SNiP II-23-81* — Steel Structures', docNum:'СНиП II-23-81*', year:1981, desc:'ფ. კ-ბ. — ვ., ბ., მ. ელ.', url:snipUrl('871001082') },
    { id:48, cat:'SNIP_S', name:'СНиП II-25-80 — ხ. კ.', nameEn:'SNiP II-25-80 — Timber Structures', docNum:'СНиП II-25-80', year:1980, desc:'ხ. კ. სახ. კ-ს — ბ., კ., შ.', url:snipUrl('871001083') },
    { id:49, cat:'SNIP_S', name:'СНиП 2.03.04-84 — ბ. — ც. გ.', nameEn:'SNiP 2.03.04-84 — Concrete in Elevated Temperatures', docNum:'СНиП 2.03.04-84', year:1984, desc:'ც. ტ-ბ. (100°C+) ბ. და ა/ბ. კ.', url:snipUrl('871001080') },
    { id:50, cat:'SNIP_S', name:'СНиП 2.01.01-82 — კ. ს.', nameEn:'SNiP 2.01.01-82 — Construction Climatology', docNum:'СНиП 2.01.01-82', year:1982, desc:'კ. სამ. — ტ., ქ., ნ., ს. ი. ქ-ის მ.', url:snipUrl('871001063') },
    { id:51, cat:'SNIP_S', name:'СНиП 2.08.01-89* — საც. შ-ბი', nameEn:'SNiP 2.08.01-89* — Residential Buildings', docNum:'СНиП 2.08.01-89*', year:1989, desc:'საც. შ-ბ. (ბ. სახ.) — ს., ნ., ა., კ.', url:snipUrl('871001091') },
    { id:52, cat:'SNIP_S', name:'СНиП 2.08.02-89* — საზ. შ-ბი', nameEn:'SNiP 2.08.02-89* — Public Buildings and Structures', docNum:'СНиП 2.08.02-89*', year:1989, desc:'საზ. (სასკ., ს/კ., სსა., ს-ო.) შ-ბ.', url:snipUrl('871001093') },
    { id:53, cat:'SNIP_S', name:'СНиП 2.09.02-85* — სამ. შ-ბი', nameEn:'SNiP 2.09.02-85* — Industrial Buildings', docNum:'СНиП 2.09.02-85*', year:1985, desc:'სამ. შ-ბ. და ნ-ბ.', url:snipUrl('871001094') },
    { id:54, cat:'SNIP_S', name:'СНиП 2.09.03-85 — სამ. ნ-ბი', nameEn:'SNiP 2.09.03-85 — Engineering Structures / Facilities', docNum:'СНиП 2.09.03-85', year:1985, desc:'ს-ი. ნ-ბ. — ს., ს-ა., ბ-ი', url:snipUrl('871001095') },
    { id:55, cat:'SNIP_S', name:'СНиП 3.03.01-87 — ს. და შ. კ.', nameEn:'SNiP 3.03.01-87 — Load-bearing and Enclosing Structures', docNum:'СНиП 3.03.01-87', year:1987, desc:'სამ. ს. და შ. კ. შ-ი. ს-ო. — ხ. ბ., ა/ბ., ლ., ხ.', url:snipUrl('901705148') },
    { id:56, cat:'SNIP_S', name:'СНиП 3.02.01-87 — მ. სამ. და ს-ბ.', nameEn:'SNiP 3.02.01-87 — Earthworks and Foundations', docNum:'СНиП 3.02.01-87', year:1987, desc:'მ. სამ., ს-ბ. და საძ-ბ. ა.', url:snipUrl('901705146') },

    // ── სნიპ. — ხ. უს. ────────────────────────────────────
    { id:57, cat:'SNIP_F', name:'СНиП 21-01-97* — ხ. უ.', nameEn:'SNiP 21-01-97* — Fire Safety of Buildings', docNum:'СНиП 21-01-97*', year:1997, desc:'შ-ბ. ხ. უ. — კლ., კ. ა., ე. გ.', url:snipUrl('1200000779') },
    { id:58, cat:'SNIP_F', name:'СНиП 2.01.02-85* — ხ. ნ. (ძვ.)', nameEn:'SNiP 2.01.02-85* — Fire Safety Norms (Old)', docNum:'СНиП 2.01.02-85*', year:1985, desc:'ხ. უ. ძ. ნ. — 2001-ის გ-ი. 21-01-ით', url:snipUrl('871001059') },
    { id:59, cat:'SNIP_F', name:'НПБ 88-2001 — ა. ს. სისტ. ნ.', nameEn:'NPB 88-2001 — Fire Alarm and Suppression Norms', docNum:'НПБ 88-2001', year:2001, desc:'ა. ს. და ჩ-ქ. სისტ. მ-ბ.', url:'https://docs.cntd.ru/document/1200001020' },

    // ── სნიპ. — ინჟ. სისტ. ───────────────────────────────
    { id:60, cat:'SNIP_E', name:'СНиП 2.04.01-85* — გ. წ. კ.', nameEn:'SNiP 2.04.01-85* — Water Supply and Sewerage', docNum:'СНиП 2.04.01-85*', year:1985, desc:'შ-ბ. გ. წ-ს. და კ. სისტ.', url:snipUrl('871001084') },
    { id:61, cat:'SNIP_E', name:'СНиП 2.04.05-91* — გ., ვ., კ.', nameEn:'SNiP 2.04.05-91* — Heating, Ventilation, AC', docNum:'СНиП 2.04.05-91*', year:1991, desc:'გ-ა, ვ-ა და კ-ა სისტ.', url:snipUrl('871001086') },
    { id:62, cat:'SNIP_E', name:'СНиП 41-01-2003 — გ., ვ., კ-ა.', nameEn:'SNiP 41-01-2003 — Heating, Ventilation, Air Conditioning', docNum:'СНиП 41-01-2003', year:2003, desc:'თ., ვ. და კ-ა ახ. ს.', url:snipUrl('1200004707') },
    { id:63, cat:'SNIP_E', name:'СНиП 23-05-95* — ბ. და ხ. გ.', nameEn:'SNiP 23-05-95* — Natural and Artificial Lighting', docNum:'СНиП 23-05-95*', year:1995, desc:'ბ. და ხ. განათ. — ნ. ი., ს., ა.', url:snipUrl('1200001527') },
    { id:64, cat:'SNIP_E', name:'СНиП 2.04.03-85 — გ.კ. (გ.)', nameEn:'SNiP 2.04.03-85 — Sewerage (Outdoors)', docNum:'СНиП 2.04.03-85', year:1985, desc:'გ. კ. სისტ. — ნ-ბ., გ-ც. ს-ო.', url:snipUrl('871001085') },
    { id:65, cat:'SNIP_E', name:'СНиП 3.05.01-85 — შ. სისტ.', nameEn:'SNiP 3.05.01-85 — Internal Plumbing and Heating', docNum:'СНиП 3.05.01-85', year:1985, desc:'შ. გ.წ., კ., გ. და გ.ა. სისტ. მ.', url:snipUrl('901704800') },
    { id:66, cat:'SNIP_E', name:'СНиП 3.05.04-85 — გ. გ-ე.', nameEn:'SNiP 3.05.04-85 — External Water/Sewerage Systems', docNum:'СНиП 3.05.04-85', year:1985, desc:'გ. გ. და კ. სისტ. მ.', url:snipUrl('901704801') },
    { id:67, cat:'SNIP_E', name:'СНиП 3.06.04-91 — ხ. და გ.', nameEn:'SNiP 3.06.04-91 — Bridges and Tunnels', docNum:'СНиП 3.06.04-91', year:1991, desc:'ხ. და გ. მ.', url:snipUrl('1200002716') },
    { id:68, cat:'SNIP_E', name:'СНиП 23-03-2003 — ხმ. დ.', nameEn:'SNiP 23-03-2003 — Noise Protection in Buildings', docNum:'СНиП 23-03-2003', year:2003, desc:'შ-ბ. ხმ. დ. — ნ., ი., გ.', url:snipUrl('1200003567') },

    // ── სნიპ. — ო. / ş. დ. ──────────────────────────────
    { id:69, cat:'SNIP_O', name:'СНиП 3.01.01-85* — ო. გ.', nameEn:'SNiP 3.01.01-85* — Construction Organization', docNum:'СНиП 3.01.01-85*', year:1985, desc:'სამ. ო. — პ-ბ., ო. გ.', url:snipUrl('901704798') },
    { id:70, cat:'SNIP_O', name:'СНиП 12-03-2001 — შ.ს. I', nameEn:'SNiP 12-03-2001 — Construction Safety Part 1', docNum:'СНиП 12-03-2001', year:2001, desc:'სამ. ს. — ზ. მ., ო-ბ.', url:snipUrl('1200003612') },
    { id:71, cat:'SNIP_O', name:'СНиП 12-04-2002 — შ.ს. II', nameEn:'SNiP 12-04-2002 — Construction Safety Part 2', docNum:'СНиП 12-04-2002', year:2002, desc:'სამ. ს. — სპ. სამ. სახ.', url:snipUrl('1200003613') },
    { id:72, cat:'SNIP_O', name:'СНиП III-4-80 — ს-ო. ს.', nameEn:'SNiP III-4-80 — Safety in Construction', docNum:'СНиП III-4-80', year:1980, desc:'სამ. ს-ო. ს. (ს. მ. ს. გ-ს.)', url:snipUrl('1200003614') },
    { id:73, cat:'SNIP_O', name:'СНиП 1.02.01-85 — პ. ს. დ.', nameEn:'SNiP 1.02.01-85 — Project Cost Documentation', docNum:'СНиП 1.02.01-85', year:1985, desc:'პ. ღ-ბ. დ. შ-ი. ს-ო.', url:snipUrl('871001058') },
    { id:74, cat:'SNIP_O', name:'СНиП 1.02.07-87 — ი. კ.', nameEn:'SNiP 1.02.07-87 — Engineering Surveys for Construction', docNum:'СНиП 1.02.07-87', year:1987, desc:'ს-ო. საინჟ. კ. სამ.', url:snipUrl('871001057') },

    // ── სნიპ. — ღ. / ე. ────────────────────────────────
    { id:75, cat:'SNIP_C', name:'ЕНиР — ე. წ. ნ. სამ.', nameEn:'ENiR — Unified Production Norms for Construction', docNum:'ЕНиР', year:1987, desc:'გ-ი. სამ. ნ. — ტ. შ-ო., ო. ნ.', url:'https://docs.cntd.ru/document/1200008290' },
    { id:76, cat:'SNIP_C', name:'СНиП IV — ს. დ. (I–XVI)', nameEn:'SNiP IV — Budget Documentation (Parts I-XVI)', docNum:'СНиП IV-1…16-84', year:1984, desc:'ს. დ., ş. ნ., მ. ღ., მ-ო. ო.', url:'https://docs.cntd.ru/document/1200001521' },
    { id:77, cat:'SNIP_C', name:'ВНиР — გ. ს. ნ.', nameEn:'VNiR — Departmental Construction Norms', docNum:'ВНиР', year:1985, desc:'გ. სამ. ნ. — სპ. სამ.', url:'https://docs.cntd.ru/document/1200008289' },
    { id:78, cat:'SNIP_C', name:'ВЗЕР — ს. ზ. ნ.', nameEn:'VZER — Repair Construction Unit Norms', docNum:'ВЗЕР-88', year:1988, desc:'ს. ს. ზ. ე. ნ. — ს. ს. სამ.', url:'https://docs.cntd.ru/document/1200008288' },
    { id:79, cat:'SNIP_C', name:'СНиП 5.01.18-86 — მ. ნ.', nameEn:'SNiP 5.01.18-86 — Material Consumption Norms', docNum:'СНиП 5.01.18-86', year:1986, desc:'ს-ო. მ-ლ. ხ. ნ.', url:snipUrl('871001061') },

    // ── GOST ─────────────────────────────────────────────────
    { id:80, cat:'GOST', name:'GOST 27751 — ს. სა-ბ. (ISO 2394)', nameEn:'GOST 27751 — Reliability of Structures (ISO 2394)', docNum:'GOST 27751-2014', year:2014, desc:'კ. ს. სა-ბ. — ISO 2394-ის ა.', url:'https://docs.cntd.ru/document/1200115736' },
    { id:81, cat:'GOST', name:'GOST 10180 — ბ. სიმ. გ.', nameEn:'GOST 10180 — Concrete Strength Testing Methods', docNum:'GOST 10180-2012', year:2012, desc:'ბ. ს. გ. — ო-ბ., სი., ც.', url:'https://docs.cntd.ru/document/1200092975' },
    { id:82, cat:'GOST', name:'GOST 18105 — ბ. ს. კ.', nameEn:'GOST 18105 — Concrete Strength Control Rules', docNum:'GOST 18105-2010', year:2010, desc:'ბ. ს. კ-ლ. წ-ები', url:'https://docs.cntd.ru/document/1200084415' },
    { id:83, cat:'GOST', name:'GOST R 7.0.8 / ა-ა. ს-ო.', nameEn:'GOST 5781 — Reinforcing Steel for Concrete', docNum:'GOST 5781-82', year:1982, desc:'ა/ბ. ა-ა — A-I…A-VI; ც., ს., მ.', url:'https://docs.cntd.ru/document/1200003534' },
    { id:84, cat:'GOST', name:'GOST 8267 — ს. ა. (კ-ა)', nameEn:'GOST 8267 — Crushed Stone and Gravel for Construction', docNum:'GOST 8267-93', year:1993, desc:'სამ. ა. (კ-ა, ხ.) — ს., კ.', url:'https://docs.cntd.ru/document/1200000304' },
    { id:85, cat:'GOST', name:'GOST 10178 — პ-ტ. ც.', nameEn:'GOST 10178 — Portland Cement', docNum:'GOST 10178-85', year:1985, desc:'პ. ც. — კ., ს., მ.', url:'https://docs.cntd.ru/document/1200003382' },
    { id:86, cat:'GOST', name:'GOST 530 — კ. ა.', nameEn:'GOST 530 — Ceramic Bricks and Stones', docNum:'GOST 530-2012', year:2012, desc:'კ. ა. — ს., ც., ო.', url:'https://docs.cntd.ru/document/1200096003' },
    { id:87, cat:'GOST', name:'GOST 24544 — ბ. ვ. (შ.)', nameEn:'GOST 24544 — Concrete Deformation Tests', docNum:'GOST 24544-81', year:1981, desc:'ბ. შ. (შ. ვ.) ს-ო. გ. მ.', url:'https://docs.cntd.ru/document/1200012553' },

    // ── ელ. / ენ. ────────────────────────────────────────────
    { id:88, cat:'ELEC', name:'ПУЭ — ელ. ი-ა. წ.', nameEn:'PUE — Electrical Installation Rules', docNum:'ПУЭ გ.7', year:2002, desc:'ელ. ი-ა. წ. (7-ე გ.) — ს-ო. ვ.', url:'https://docs.cntd.ru/document/1200030216' },
    { id:89, cat:'ELEC', name:'სსტ EN 62305 — ელ. დ. სისტ.', nameEn:'IEC 62305 — Lightning Protection Systems', docNum:'IEC 62305', year:2010, desc:'ელ. ს. სისტ. — ი., კ.', url:'https://sst.geostm.gov.ge/' },
    { id:90, cat:'ELEC', name:'სსტ EN ISO 7730 — თ. კ.', nameEn:'EN ISO 7730 — Thermal Comfort in Buildings', docNum:'EN ISO 7730', year:2005, desc:'შ-ბ. თ-ა. კ. (PMV, PPD)', url:'https://sst.geostm.gov.ge/' },
];

// ══════════════════════════════════════════════════════════════
const CppTab = () => {
    const [query, setQuery]         = useState('ბეტონი');
    const [iframeUrl, setIframeUrl] = useState(`${CPP_BASE}?q=${encodeURIComponent('ბეტონი')}`);
    const [iframeError, setIframeError] = useState(false);

    const applySearch = (q) => {
        const term = (q || query).trim();
        if (!term) return;
        setQuery(term);
        setIframeUrl(`${CPP_BASE}?q=${encodeURIComponent(term)}`);
        setIframeError(false);
    };

    return (
        <>
            <Card className="shadow-sm mb-3 border-0" style={{ background: '#f8f9fa' }}>
                <Card.Body className="py-2 px-3">
                    <Row className="align-items-center g-2">
                        <Col xs={12} md={5}>
                            <InputGroup size="sm">
                                <Form.Control value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && applySearch(query)}
                                    placeholder="ძიება (ბეტონი, ცემენტი...)" />
                                <Button variant="primary" onClick={() => applySearch(query)}>🔍</Button>
                            </InputGroup>
                        </Col>
                        <Col xs={12} md={7}>
                            <div className="d-flex flex-wrap gap-1">
                                {QUICK_SEARCHES.map(({ label, emoji }) => (
                                    <Badge key={label}
                                        bg={query === label ? 'primary' : 'light'}
                                        text={query === label ? 'white' : 'dark'}
                                        className="px-2 py-1"
                                        style={{ cursor: 'pointer', fontSize: '0.7rem', border: '1px solid #dee2e6' }}
                                        onClick={() => applySearch(label)}>
                                        {emoji} {label}
                                    </Badge>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <div className="d-flex justify-content-between mb-2">
                <small className="text-muted">წყ.: <a href={CPP_BASE} target="_blank" rel="noreferrer">cpp.procurement.gov.ge</a> | 2026 Q2</small>
                <Button size="sm" variant="outline-primary" href={iframeUrl} target="_blank" rel="noreferrer">🔗 ახ. ჩ.</Button>
            </div>
            {iframeError ? (
                <Card className="border-warning text-center py-5">
                    <Card.Body>
                        <div style={{ fontSize:'3rem' }}>🔒</div>
                        <h5 className="fw-bold mt-2">iframe შეზღ.</h5>
                        <Button variant="primary" href={iframeUrl} target="_blank" rel="noreferrer">🌐 CPP გახსნა</Button>
                    </Card.Body>
                </Card>
            ) : (
                <div className="rounded overflow-hidden" style={{ border:'1px solid #dee2e6' }}>
                    <iframe key={iframeUrl} src={iframeUrl} title="CPP" width="100%"
                        style={{ height:'calc(100vh - 300px)', minHeight:480, border:'none', display:'block' }}
                        onError={() => setIframeError(true)}
                        onLoad={e => { try { void e.target.contentWindow.location.href; } catch { setIframeError(true); }}}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox" />
                </div>
            )}
        </>
    );
};

// ══════════════════════════════════════════════════════════════
const NormsTab = () => {
    const [search,    setSearch]  = useState('');
    const [catFilter, setCat]     = useState('ALL');

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return NORMS.filter(n => {
            const catOk  = catFilter === 'ALL' || n.cat === catFilter;
            const textOk = !q ||
                n.name.toLowerCase().includes(q) ||
                n.nameEn.toLowerCase().includes(q) ||
                n.desc.toLowerCase().includes(q) ||
                (n.docNum || '').toLowerCase().includes(q) ||
                String(n.year).includes(q);
            return catOk && textOk;
        });
    }, [search, catFilter]);

    const catCounts = useMemo(() =>
        Object.fromEntries(Object.keys(CATEGORIES).map(k => [k, NORMS.filter(n => n.cat === k).length])),
    []);

    return (
        <>
            <Card className="shadow-sm mb-2 border-0" style={{ background: '#f8f9fa' }}>
                <Card.Body className="py-2 px-3">
                    <Row className="g-2 align-items-start">
                        <Col xs={12} md={4}>
                            <InputGroup size="sm">
                                <InputGroup.Text>🔍</InputGroup.Text>
                                <Form.Control
                                    placeholder="კ-ი: СНиП, ISO, ბ., ს., ხ., 1985..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)} />
                                {search && <Button variant="outline-secondary" size="sm" onClick={() => setSearch('')}>✕</Button>}
                            </InputGroup>
                        </Col>
                        <Col xs={12} md={8}>
                            <div className="d-flex flex-wrap gap-1">
                                <Badge bg={catFilter==='ALL'?'dark':'light'} text={catFilter==='ALL'?'white':'dark'}
                                    style={{ cursor:'pointer', fontSize:'0.66rem', border:'1px solid #dee2e6', padding:'4px 7px' }}
                                    onClick={() => setCat('ALL')}>ყველა ({NORMS.length})</Badge>
                                {Object.entries(CATEGORIES).map(([key, { label, color }]) => (
                                    <Badge key={key}
                                        bg={catFilter===key ? color : 'light'}
                                        text={catFilter===key ? 'white' : 'dark'}
                                        style={{ cursor:'pointer', fontSize:'0.66rem', border:'1px solid #dee2e6', padding:'4px 7px' }}
                                        onClick={() => setCat(catFilter===key ? 'ALL' : key)}>
                                        {label} ({catCounts[key]})
                                    </Badge>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <div className="mb-2 d-flex justify-content-between align-items-center">
                <small className="text-muted">
                    <strong>{filtered.length}</strong> / {NORMS.length} დ.
                    {search && <> · „<strong>{search}</strong>"</>}
                </small>
                <div className="d-flex gap-1 flex-wrap">
                    {[
                        ['📜 matsne.gov.ge', 'https://matsne.gov.ge'],
                        ['📊 GEOSTM', 'https://sst.geostm.gov.ge'],
                        ['✅ GAC', 'https://gac.gov.ge'],
                        ['🏗️ TCSA', 'https://tacsa.gov.ge'],
                        ['📋 docs.cntd.ru', 'https://docs.cntd.ru'],
                    ].map(([label, href]) => (
                        <Button key={href} size="sm" variant="outline-secondary"
                            style={{ fontSize:'0.65rem' }}
                            href={href} target="_blank" rel="noreferrer">{label} ↗</Button>
                    ))}
                </div>
            </div>

            <div style={{ maxHeight:'calc(100vh - 340px)', overflowY:'auto' }}>
                <Table striped hover size="sm" className="mb-0" style={{ fontSize:'0.78rem' }}>
                    <thead className="table-dark sticky-top">
                        <tr>
                            <th style={{ width:28 }}>#</th>
                            <th style={{ width:120 }}>კატეგ.</th>
                            <th>დასახელება / აღწერა</th>
                            <th style={{ width:95, textAlign:'center' }}>№ / წ.</th>
                            <th style={{ width:65, textAlign:'center' }}>ბმ.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={5} className="text-center text-muted py-4">
                                ვერ მოიძ. — სც. სხ. სიტ.
                            </td></tr>
                        ) : filtered.map(n => {
                            const cat = CATEGORIES[n.cat];
                            return (
                                <tr key={n.id}>
                                    <td className="text-muted">{n.id}</td>
                                    <td>
                                        <Badge bg={cat.color} style={{ fontSize:'0.6rem', whiteSpace:'normal', lineHeight:1.3 }}>
                                            {cat.label}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="fw-bold" style={{ lineHeight:1.3 }}>{n.name}</div>
                                        <div className="text-muted" style={{ fontSize:'0.7rem' }}>{n.desc}</div>
                                    </td>
                                    <td className="text-muted text-center" style={{ lineHeight:1.3 }}>
                                        <div style={{ fontSize:'0.7rem' }}>{n.docNum}</div>
                                        <div className="fw-bold">{n.year}</div>
                                    </td>
                                    <td className="text-center">
                                        <Button size="sm" variant="outline-primary"
                                            style={{ fontSize:'0.6rem', padding:'2px 5px' }}
                                            href={n.url} target="_blank" rel="noreferrer">
                                            📄
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        </>
    );
};

// ══════════════════════════════════════════════════════════════
const ProcurementPricePage = () => (
    <Container fluid className="mt-3 pb-5 font-georgian">
        <Row className="mb-3 align-items-center">
            <Col>
                <h4 className="fw-bold mb-1">🏗️ სამშენებლო რესურსები და ნორმატიული ბაზა</h4>
                <p className="text-muted small mb-0">
                    საბაზ. ფ. (CPP) &nbsp;·&nbsp; 90 + დოკ.: კანონები · ტ.რ. · სნიპები · GOST · ISO · PN
                </p>
            </Col>
        </Row>
        <Tabs defaultActiveKey="norms" className="mb-3 fw-bold">
            <Tab eventKey="norms" title={`📜 ნ. ბაზა (${NORMS.length})`}>
                <NormsTab />
            </Tab>
            <Tab eventKey="cpp" title="💰 ფ. (CPP)">
                <CppTab />
            </Tab>
        </Tabs>
    </Container>
);

export default ProcurementPricePage;
