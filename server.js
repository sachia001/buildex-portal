require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const XLSX_LIB = require('xlsx');

const JWT_SECRET = process.env.JWT_SECRET || 'buildex-secret-2026';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/buildexDB')
    .then(() => console.log('✅ ბაზა და რეგლამენტი ჩაიტვირთა!'))
    .catch(err => console.error('❌ ბაზის შეცდომა:', err));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/norms', express.static(path.join(__dirname, 'uploads/norms')));
app.use('/uploads/estimates', express.static(path.join(__dirname, 'uploads/estimates')));

// --- UPLOAD CONFIG ---
const uploadDir = './uploads/docs/';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const safeName = Buffer.from(file.originalname, 'latin1').toString('utf8').replace(/\s+/g, '_');
        cb(null, Date.now() + '-' + safeName);
    }
});
const upload = multer({ storage });

// --- MODELS ---

const AuthUser = mongoose.model('AuthUser', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'inspector' },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true }));

// Seed default admin on startup
mongoose.connection.once('open', async () => {
    try {
        const exists = await AuthUser.findOne({ username: 'admin' });
        if (!exists) {
            const hash = await bcrypt.hash('Buildex@2026', 10);
            await AuthUser.create({ username: 'admin', passwordHash: hash, role: 'admin' });
            console.log('✅ ადმინი შეიქმნა: admin / Buildex@2026');
        }
    } catch (err) {
        console.error('Admin seed error:', err.message);
    }
});

// JWT middleware
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'ავტორიზაცია საჭიროა' });
    const token = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ message: 'ტოკენი არასწორია ან ვადაგასულია' });
    }
};

const Counter = mongoose.model('Counter', new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
}));

const User = mongoose.model('User', new mongoose.Schema({
    firstName: String, lastName: String, personalId: String, position: String,
    email: String, phone: String,
    authExpiry: Date, competencies: [String],
    documents: { type: Object, default: {} },
    status: { type: String, default: 'აქტიური' },
    photo: String
}, { timestamps: true }));

const InspectionSchema = new mongoose.Schema({
    inspectionNumber: { type: String, unique: true },
    applicationNumber: String,
    objectName: String,
    objectAddress: String,
    inspectionScope: String,
    tenderNumber: String,
    tenderLink: String,
    clientName: String,
    clientID: String,
    clientPhone: String,
    clientEmail: String,
    contactPerson: String,
    issueDate: String,
    inspectionTask: String,
    accreditationScope: String,
    applicationContent: String,
    status: { type: String, default: 'რეგისტრირებული' },
    deadline: Date,
    startDate: Date,
    submittedDocs: { type: [String], default: [] },
    expert: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    technicalManager: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    qualityManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    documents: { type: Object, default: {} }
}, { timestamps: true });

const Inspection = mongoose.model('Inspection', InspectionSchema);

const OfficeDocument = mongoose.model('OfficeDocument', new mongoose.Schema({
    docNumber: { type: String, unique: true },
    category: { type: String, required: true },
    title: String, content: String, signatory: String,
    fileUrl: String, date: { type: Date, default: Date.now }
}, { timestamps: true }));

const Equipment = mongoose.model('Equipment', new mongoose.Schema({
    name: { type: String, required: true },
    serialNumber: { type: String, required: true, unique: true },
    manufacturer: String,
    calibrationDate: Date,
    calibrationInterval: { type: Number, default: 12 },
    nextCalibration: Date,
    status: { type: String, default: 'active' }
}, { timestamps: true }));

const ManagementReview = mongoose.model('ManagementReview', new mongoose.Schema({
    reviewDate: { type: Date, required: true },
    participants: { type: String, required: true },
    inputs: {
        prevActions: String,
        internalAudits: String,
        complaints: String,
        resources: String
    },
    outputs: {
        improvements: String,
        trainingNeeds: String,
        decisions: String
    },
    status: { type: String, default: 'დასრულებული' }
}, { timestamps: true }));

const Complaint = mongoose.model('Complaint', new mongoose.Schema({
    complaintNumber: { type: String, unique: true },
    dateReceived: { type: Date, required: true, default: Date.now },
    complainant: { type: String, required: true },
    complainantContact: String,
    inspectionRef: String,
    description: { type: String, required: true },
    category: { type: String, default: 'საჩივარი' }, // საჩივარი / აპელაცია
    status: { type: String, default: 'განხილვაში' }, // განხილვაში / დასრულებული / უარყოფილი
    reviewedBy: String,
    resolution: String,
    closedDate: Date,
    preventiveAction: String
}, { timestamps: true }));

const InternalAudit = mongoose.model('InternalAudit', new mongoose.Schema({
    auditNumber: { type: String, unique: true },
    auditDate: { type: Date, required: true },
    auditor: { type: String, required: true },
    scope: String,
    findings: [String],
    nonConformities: String,
    positiveFindings: String,
    conclusion: String,
    correctiveActionRequired: { type: Boolean, default: false },
    status: { type: String, default: 'დასრულებული' }
}, { timestamps: true }));

const CorrectiveAction = mongoose.model('CorrectiveAction', new mongoose.Schema({
    carNumber: { type: String, unique: true },
    sourceType: { type: String, default: 'შიდა აუდიტი' }, // შიდა აუდიტი / საჩივარი / გარე აუდიტი / პერსონალის შეფასება
    sourceRef: String,
    description: { type: String, required: true },
    rootCause: String,
    actionPlan: String,
    responsiblePerson: String,
    deadline: Date,
    completedDate: Date,
    effectiveness: String,
    status: { type: String, default: 'ღია' } // ღია / მიმდინარე / დახურული
}, { timestamps: true }));

const Insurance = mongoose.model('Insurance', new mongoose.Schema({
    insurerName: { type: String, required: true },
    policyNumber: { type: String, required: true },
    insuranceType: { type: String, default: 'პროფესიული პასუხისმგებლობა' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    insuredAmount: String,
    notes: String,
    fileUrl: String,
    status: { type: String, default: 'active' }
}, { timestamps: true }));

const CompanyDoc = mongoose.model('CompanyDoc', new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, default: 'სხვა' }, // წესდება / PO გადაწყვეტილება / სხვა
    description: String,
    fileUrl: String,
    docDate: { type: Date, default: Date.now },
}, { timestamps: true }));

const CompanySettings = mongoose.model('CompanySettings', new mongoose.Schema({
    key: { type: String, default: 'main', unique: true },
    partners: { type: Array, default: [] },
    config: { type: Object, default: {} },
}, { timestamps: true }));

// --- PRICE ADEQUACY MODELS ---

const NormFile = mongoose.model('NormFile', new mongoose.Schema({
    originalName: String,
    fileUrl: String,
    normType: { type: String, default: 'NER' },
    year: Number,
    quarter: Number,
    entryCount: { type: Number, default: 0 },
}, { timestamps: true }));

const NormEntry = mongoose.model('NormEntry', new mongoose.Schema({
    normFileId: { type: mongoose.Schema.Types.ObjectId, ref: 'NormFile' },
    normType: String,
    year: Number,
    quarter: Number,
    code: { type: String, default: '' },
    description: String,
    unit: { type: String, default: '' },
    unitPrice: Number,
    chapter: { type: String, default: '' },
    keywords: [String],
}));

const PriceAdequacyCheck = mongoose.model('PriceAdequacyCheck', new mongoose.Schema({
    checkNumber: { type: String, unique: true },
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inspection', default: null },
    caseNumber: { type: String, default: '' },
    objectName: { type: String, default: '' },
    checkDate: { type: Date, default: Date.now },
    checkedBy: { type: String, default: '' },
    estimateFileName: String,
    normType: String,
    normYear: Number,
    normQuarter: Number,
    totalLines: { type: Number, default: 0 },
    matchedLines: { type: Number, default: 0 },
    violationCount: { type: Number, default: 0 },
    warningCount: { type: Number, default: 0 },
    okCount: { type: Number, default: 0 },
    unmatchedCount: { type: Number, default: 0 },
    conclusion: { type: String, default: '' },
    status: { type: String, default: 'შემოწმებული' },
    lineItems: [new mongoose.Schema({
        lineNum: Number,
        code: { type: String, default: '' },
        description: String,
        unit: { type: String, default: '' },
        quantity: { type: Number, default: 0 },
        unitPrice: { type: Number, default: 0 },
        totalPrice: { type: Number, default: 0 },
        normCode: { type: String, default: '' },
        normDescription: { type: String, default: '' },
        normUnitPrice: { type: Number, default: null },
        deviation: { type: Number, default: null },
        matchScore: { type: Number, default: 0 },
        lineStatus: { type: String, default: 'ვერ შემოწმდა' },
    }, { _id: false })],
}, { timestamps: true }));

// --- HELPER: ნუმერაციის გენერატორი ---
async function generateDocumentNumber(type, date = new Date()) {
    const yearFull = date.getFullYear();
    const yearShort = yearFull.toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    // BX-INS and IN: derive sequence from actual existing records, not a stored counter
    // This ensures numbering is correct after deletions
    if (type === 'BX-INS') {
        const last = await Inspection.findOne({}, 'inspectionNumber').sort({ createdAt: -1 });
        let nextSeq = 1;
        if (last && last.inspectionNumber) {
            const parts = last.inspectionNumber.split('-');
            const n = parseInt(parts[parts.length - 1]);
            if (!isNaN(n)) nextSeq = n + 1;
        }
        return `BX-INS-${yearShort}-${month}-${nextSeq.toString().padStart(4, '0')}`;
    }

    if (type === 'IN') {
        const last = await Inspection.findOne({}, 'applicationNumber').sort({ createdAt: -1 });
        let nextSeq = 1;
        if (last && last.applicationNumber) {
            const m = last.applicationNumber.match(/^IN-(\d+)\//);
            if (m) nextSeq = parseInt(m[1]) + 1;
        }
        return `IN-${nextSeq}/${yearShort}`;
    }

    const counterKey = `${type}-${yearFull}`;
    const counter = await Counter.findByIdAndUpdate(
        { _id: counterKey }, { $inc: { seq: 1 } }, { new: true, upsert: true }
    );
    const seq = counter.seq;
    const seq2 = seq.toString().padStart(2, '0');
    const seq4 = seq.toString().padStart(4, '0');
    switch (type) {
        case 'PO':     return `PO/${seq2}-${yearShort}`;
        case '01':     return `\u211601/${seq2}-${yearShort}`;
        case '02-HR':  return `\u211602-HR/${seq2}-${yearShort}`;
        case '03-TR':  return `\u211603-TR/${seq2}-${yearShort}`;
        case 'OUT':    return `OUT-${seq}/${yearShort}`;
        case 'LC':     return `LC-${seq2}-${month}/${yearShort}`;
        case 'SC':     return `SC-${seq2}-${month}/${yearShort}`;
        case 'IM':     return `IM-${seq}/${yearShort}`;
        case 'COMP': return `COMP-${seq}/${yearShort}`;
        case 'AUD':  return `AUD-${seq}/${yearShort}`;
        case 'CAR':  return `CAR-${seq}/${yearShort}`;
        case 'PA':   return `PA-${seq4}/${yearShort}`;
        default: throw new Error("უცნობი კატეგორია");
    }
}

// =============================================
// PRICE ADEQUACY — HELPERS
// =============================================

function extractKeywords(text) {
    if (!text) return [];
    return String(text).toLowerCase()
        .replace(/[()[\]{}/\\,;:.!?«»""''–—]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2);
}

function kwMatchScore(words1, words2) {
    if (!words1.length || !words2.length) return 0;
    const set2 = new Set(words2);
    const matches = words1.filter(w => set2.has(w)).length;
    return matches / Math.max(words1.length, words2.length);
}

function parseNormExcel(buffer) {
    const wb = XLSX_LIB.read(buffer, { type: 'buffer' });
    const entries = [];
    for (const sheetName of wb.SheetNames) {
        const ws = wb.Sheets[sheetName];
        const rows = XLSX_LIB.utils.sheet_to_json(ws, { header: 1, defval: '' });
        let codeCol = -1, descCol = -1, unitCol = -1, priceCol = -1, headerRowIdx = -1;
        for (let i = 0; i < Math.min(rows.length, 25); i++) {
            const row = rows[i].map(c => String(c).toLowerCase().trim());
            const dIdx = row.findIndex(c => c.includes('დასახ') || c.includes('სახელ') || c.includes('description') || c.includes('სამუშა'));
            const pIdx = row.findIndex(c => (c.includes('ფას') || c.includes('price')) && !c.includes('სულ') && !c.includes('total'));
            if (dIdx >= 0 || pIdx >= 0) {
                headerRowIdx = i;
                const cIdx = row.findIndex(c => c === 'კოდი' || c === '№' || c.includes('კოდ') || c === 'code');
                const uIdx = row.findIndex(c => (c.includes('ერთ') && c.length < 15) || c === 'unit');
                if (cIdx >= 0) codeCol = cIdx;
                if (dIdx >= 0) descCol = dIdx;
                if (uIdx >= 0) unitCol = uIdx;
                if (pIdx >= 0) priceCol = pIdx;
                break;
            }
        }
        if (headerRowIdx === -1) {
            for (let i = 0; i < Math.min(rows.length, 15); i++) {
                if (rows[i].length >= 3 && /^[A-Za-zეE][0-9]/.test(String(rows[i][0]).trim())) {
                    codeCol = 0; descCol = 1; unitCol = 2; priceCol = 3; headerRowIdx = i - 1; break;
                }
            }
        }
        const startRow = Math.max(0, headerRowIdx + 1);
        let currentChapter = sheetName;
        for (let i = startRow; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.every(c => !String(c).trim())) continue;
            const code = codeCol >= 0 ? String(row[codeCol] || '').trim() : '';
            const desc = descCol >= 0 ? String(row[descCol] || '').trim() : '';
            const unit = unitCol >= 0 ? String(row[unitCol] || '').trim() : '';
            const rawPrice = priceCol >= 0 ? String(row[priceCol] || '').trim() : '';
            const unitPrice = parseFloat(rawPrice.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
            if (desc && !unitPrice && !code && desc.length > 3) { currentChapter = desc; continue; }
            if (desc && unitPrice > 0) {
                entries.push({ code, description: desc, unit, unitPrice, chapter: currentChapter, keywords: extractKeywords(desc) });
            }
        }
    }
    return entries;
}

function parseCostEstimateExcel(buffer) {
    const wb = XLSX_LIB.read(buffer, { type: 'buffer' });
    const items = [];
    for (const sheetName of wb.SheetNames) {
        const ws = wb.Sheets[sheetName];
        const rows = XLSX_LIB.utils.sheet_to_json(ws, { header: 1, defval: '' });
        let codeCol = -1, descCol = -1, unitCol = -1, qtyCol = -1, priceCol = -1, totalCol = -1, headerRowIdx = -1;
        for (let i = 0; i < Math.min(rows.length, 35); i++) {
            const row = rows[i].map(c => String(c).toLowerCase().trim());
            const dIdx = row.findIndex(c => c.includes('დასახ') || c.includes('სამუშა') || c.includes('description') || c.includes('სახელ'));
            const qIdx = row.findIndex(c => c.includes('რაოდ') || c.includes('quantity') || c === 'qty');
            const pIdx = row.findIndex(c => (c.includes('ფას') || c.includes('price')) && !c.includes('სულ') && !c.includes('total'));
            const tIdx = row.findIndex(c => c.includes('სულ') || c.includes('total') || c === 'ჯამი');
            const uIdx = row.findIndex(c => (c.includes('ერთ') && c.length < 15) || c === 'unit');
            const cIdx = row.findIndex(c => c === 'კოდი' || c === '№' || c.includes('კოდ') || c === '#');
            if (dIdx >= 0 && (pIdx >= 0 || tIdx >= 0 || qIdx >= 0)) {
                headerRowIdx = i;
                if (cIdx >= 0) codeCol = cIdx;
                descCol = dIdx;
                if (uIdx >= 0) unitCol = uIdx;
                if (qIdx >= 0) qtyCol = qIdx;
                if (pIdx >= 0) priceCol = pIdx;
                if (tIdx >= 0) totalCol = tIdx;
                break;
            }
        }
        if (headerRowIdx === -1) continue;
        const startRow = headerRowIdx + 1;
        let lineNum = items.length + 1;
        for (let i = startRow; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.every(c => !String(c).trim())) continue;
            const desc = String(row[descCol] || '').trim();
            if (!desc || desc.length < 3) continue;
            const code = codeCol >= 0 ? String(row[codeCol] || '').trim() : '';
            const unit = unitCol >= 0 ? String(row[unitCol] || '').trim() : '';
            const qty = qtyCol >= 0 ? parseFloat(String(row[qtyCol] || '0').replace(/[^\d.,]/g, '').replace(',', '.')) || 0 : 0;
            const unitPrice = priceCol >= 0 ? parseFloat(String(row[priceCol] || '0').replace(/[^\d.,]/g, '').replace(',', '.')) || 0 : 0;
            const totalPrice = totalCol >= 0 ? parseFloat(String(row[totalCol] || '0').replace(/[^\d.,]/g, '').replace(',', '.')) || 0 : unitPrice * qty;
            if (!unitPrice && !totalPrice && !qty) continue;
            items.push({ lineNum: lineNum++, code, description: desc, unit, quantity: qty, unitPrice, totalPrice });
        }
    }
    return items;
}

async function runMatchingEngine(lineItems, normYear, normQuarter, normType) {
    const q = {};
    if (normYear) q.year = normYear;
    if (normQuarter) q.quarter = normQuarter;
    if (normType && normType !== 'all') q.normType = normType;
    const norms = await NormEntry.find(q).lean();
    const codeIndex = {};
    for (const n of norms) { if (n.code) codeIndex[n.code.toUpperCase().replace(/[–—]/g, '-')] = n; }
    let matchedLines = 0, violationCount = 0, warningCount = 0, okCount = 0, unmatchedCount = 0;
    const results = lineItems.map(item => {
        let normMatch = null, mScore = 0;
        if (item.code) {
            const key = item.code.toUpperCase().replace(/[–—]/g, '-');
            if (codeIndex[key]) { normMatch = codeIndex[key]; mScore = 1.0; }
        }
        if (!normMatch && item.description) {
            const itemKw = extractKeywords(item.description);
            let best = 0, bestNorm = null;
            for (const n of norms) {
                const score = kwMatchScore(itemKw, n.keywords);
                if (score > best) { best = score; bestNorm = n; }
            }
            if (best >= 0.4) { normMatch = bestNorm; mScore = best; }
        }
        let lineStatus = 'ვერ შემოწმდა', deviation = null;
        if (normMatch && item.unitPrice > 0 && normMatch.unitPrice > 0) {
            matchedLines++;
            deviation = ((item.unitPrice - normMatch.unitPrice) / normMatch.unitPrice) * 100;
            if (deviation <= 5) { lineStatus = 'შესაბამისი'; okCount++; }
            else if (deviation <= 15) { lineStatus = 'გაფრთხილება'; warningCount++; }
            else { lineStatus = 'დარღვევა'; violationCount++; }
        } else if (!normMatch) { unmatchedCount++; }
        return {
            ...item,
            normCode: normMatch?.code || '',
            normDescription: normMatch?.description || '',
            normUnitPrice: normMatch?.unitPrice ?? null,
            deviation: deviation !== null ? Math.round(deviation * 10) / 10 : null,
            matchScore: Math.round(mScore * 100),
            lineStatus,
        };
    });
    return { results, matchedLines, violationCount, warningCount, okCount, unmatchedCount };
}

function generateWordReport(check) {
    const fmtNum = n => n != null ? n.toLocaleString('ka-GE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
    const fmtDev = d => d != null ? (d > 0 ? `+${d}%` : `${d}%`) : '—';
    const statusBg = s => s === 'დარღვევა' ? '#fee2e2' : s === 'გაფრთხილება' ? '#fef9c3' : s === 'შესაბამისი' ? '#dcfce7' : '#f3f4f6';
    const rows = check.lineItems.map((it, i) => `
        <tr style="background:${statusBg(it.lineStatus)}">
            <td style="text-align:center">${it.lineNum}</td>
            <td>${it.code || ''}</td>
            <td>${it.description || ''}</td>
            <td style="text-align:center">${it.unit || ''}</td>
            <td style="text-align:right">${it.quantity || ''}</td>
            <td style="text-align:right">${fmtNum(it.unitPrice)}</td>
            <td style="text-align:right">${fmtNum(it.normUnitPrice)}</td>
            <td style="text-align:center">${fmtDev(it.deviation)}</td>
            <td style="text-align:center"><b>${it.lineStatus}</b></td>
        </tr>`).join('');
    return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8"><title>${check.checkNumber}</title>
<style>
body{font-family:Sylfaen,Arial,sans-serif;font-size:10pt;margin:2cm}
h1{font-size:14pt;text-align:center;color:#003366}
h2{font-size:11pt;color:#003366;border-bottom:1px solid #003366;padding-bottom:3px}
table{border-collapse:collapse;width:100%;font-size:8.5pt}
th{background:#003366;color:#fff;padding:5px 4px;border:1px solid #001f45}
td{border:1px solid #ccc;padding:3px 4px}
.meta td{border:none;padding:2px 6px}
.summary{display:flex;gap:20px;margin:10px 0}
.card{border:1px solid #ccc;padding:8px 12px;min-width:100px;text-align:center}
.card .num{font-size:18pt;font-weight:bold}
.card .lbl{font-size:8pt;color:#666}
.footer{margin-top:30px;border-top:1px solid #ccc;padding-top:10px}
</style></head>
<body>
<h1>ფასწარმოქმნის ადეკვატურობის ინსპექციის ანგარიში</h1>
<h2>1. ზოგადი ინფორმაცია</h2>
<table class="meta"><tr><td><b>შემოწმების №:</b></td><td>${check.checkNumber}</td><td><b>თარიღი:</b></td><td>${new Date(check.checkDate).toLocaleDateString('ka-GE')}</td></tr>
<tr><td><b>BE-CASE №:</b></td><td>${check.caseNumber || '—'}</td><td><b>ობიექტი:</b></td><td>${check.objectName || '—'}</td></tr>
<tr><td><b>შემმოწმებელი:</b></td><td>${check.checkedBy || '—'}</td><td><b>ნორმ. ბაზა:</b></td><td>${check.normType || 'NER'}${check.normYear ? ' ' + check.normYear : ''}${check.normQuarter ? ' კვ.' + check.normQuarter : ''}</td></tr>
<tr><td><b>ხარჯთაღრ. ფაილი:</b></td><td colspan="3">${check.estimateFileName || '—'}</td></tr></table>
<h2>2. შემოწმების შედეგები</h2>
<table class="meta">
<tr><td><b>სულ პოზიცია:</b> ${check.totalLines}</td><td><b>შემოწმდა:</b> ${check.matchedLines}</td><td><b>შესაბამისი:</b> ${check.okCount}</td><td><b>გაფრთხ.:</b> ${check.warningCount}</td><td><b>დარღვევა:</b> ${check.violationCount}</td><td><b>ვერ შემოწ.:</b> ${check.unmatchedCount}</td></tr>
</table>
<h2>3. დასკვნა</h2>
<p>${check.conclusion || '—'}</p>
<h2>4. ხარჯთაღრიცხვის ანალიზი</h2>
<table>
<tr><th>#</th><th>კოდი</th><th>დასახელება</th><th>ერთ.</th><th>რაოდ.</th><th>ხარჯთ. ფასი (₾)</th><th>ნორმ. ფასი (₾)</th><th>გადახ. %</th><th>სტატუსი</th></tr>
${rows}
</table>
<div class="footer">
<table class="meta"><tr>
<td style="width:30%"><b>შემმოწმებელი:</b><br><br>_______________________<br><small>${check.checkedBy || ''}</small></td>
<td style="width:30%"><b>ტექნიკური მენეჯერი:</b><br><br>_______________________</td>
<td style="width:30%"><b>ხარისხის მენეჯერი:</b><br><br>_______________________</td>
</tr></table>
</div>
</body></html>`;
}

// =============================================
// API ROUTER — ყველა API route ერთ Router-ში
// =============================================
const api = express.Router();
api.use((req, res, next) => { console.log('[API ROUTER]', req.method, req.path); next(); });
api.use(requireAuth);

// --- INSPECTIONS ---
api.post('/inspections', async (req, res) => {
    if (!['admin', 'chancellor'].includes(req.user.role))
        return res.status(403).json({ error: 'საქმის რეგისტრაციის უფლება არ გაქვთ' });
    try {
        const appNum  = await generateDocumentNumber('IN');
        const inspNum = await generateDocumentNumber('BX-INS');
        const newInsp = new Inspection({ ...req.body, applicationNumber: appNum, inspectionNumber: inspNum });
        await newInsp.save();
        await OfficeDocument.create({
            docNumber: appNum, category: 'IN',
            title: `განცხადება: ${req.body.objectName}`,
            content: req.body.applicationContent,
            signatory: req.body.clientName
        });
        res.status(201).json(newInsp);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

api.get('/inspections', async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'inspector' && req.user.staffId) {
            query = { $or: [{ expert: req.user.staffId }, { technicalManager: req.user.staffId }] };
        }
        const list = await Inspection.find(query).populate('expert', 'firstName lastName').populate('technicalManager', 'firstName lastName').sort({ createdAt: -1 });
        res.json(list);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

api.get('/inspections/:id', async (req, res) => {
    try {
        const item = await Inspection.findById(req.params.id).populate('expert technicalManager qualityManager');
        if (!item) return res.status(404).json({ error: 'ვერ მოიძებნა' });
        res.json(item);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

api.delete('/inspections/:id', async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'წაშლის უფლება არ გაქვთ' });
    try {
        await Inspection.findByIdAndDelete(req.params.id);
        res.json({ msg: 'საქმე წაიშალა' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

api.put('/inspections/:id', async (req, res) => {
    try {
        const updated = await Inspection.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

api.post('/inspections/:id/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'ფაილი არ არის' });
        const webPath = `uploads/docs/${req.file.filename}`;
        const insp = await Inspection.findById(req.params.id);
        if (!insp) return res.status(404).json({ error: 'ვერ მოიძებნა' });
        if (!insp.documents) insp.documents = {};
        insp.documents[req.body.docType] = webPath;
        insp.markModified('documents');
        await insp.save();
        res.json(insp);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- USERS ---
api.post('/users/register', async (req, res) => {
    try {
        // photo comes as base64 data URL (stored directly in MongoDB — no filesystem needed)
        const user = await new User(req.body).save();
        res.json({ msg: 'OK', user });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

api.get('/users/staff', async (req, res) => {
    try {
        res.json(await User.find().sort({ lastName: 1 }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

api.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'ვერ მოიძებნა' });
        res.json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

api.put('/users/:id', async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'ვერ მოიძებნა' });
        res.json(updated);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

api.delete('/users/:id', async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'წაშლის უფლება არ გაქვთ' });
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'თანამშრომელი წაიშალა' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

api.post('/users/:id/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'ფაილი არ არის' });
        const webPath = `uploads/docs/${req.file.filename}`;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'ვერ მოიძებნა' });
        if (!user.documents) user.documents = {};
        user.documents[req.body.docType] = webPath;
        user.markModified('documents');
        await user.save();
        res.json(user);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- EQUIPMENT ---
api.get('/equipment', async (req, res) => {
    try {
        res.json(await Equipment.find().sort({ createdAt: -1 }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

api.post('/equipment', async (req, res) => {
    try {
        const { name, serialNumber, manufacturer, calibrationDate, calibrationInterval } = req.body;
        const calDate       = new Date(calibrationDate);
        const intervalMonths = parseInt(calibrationInterval) || 12;
        const nextCal       = new Date(calDate);
        nextCal.setMonth(nextCal.getMonth() + intervalMonths);
        const item = await Equipment.create({ name, serialNumber, manufacturer, calibrationDate: calDate, calibrationInterval: intervalMonths, nextCalibration: nextCal });
        res.status(201).json(item);
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ error: 'ამ სერიული ნომრით ხელსაწყო უკვე არსებობს' });
        res.status(400).json({ error: err.message });
    }
});

api.delete('/equipment/:id', async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'წაშლის უფლება არ გაქვთ' });
    try {
        await Equipment.findByIdAndDelete(req.params.id);
        res.json({ msg: 'წაიშალა' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- MANAGEMENT REVIEWS ---
api.get('/management-reviews', async (req, res) => {
    try {
        res.json(await ManagementReview.find().sort({ reviewDate: -1 }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

api.post('/management-reviews', async (req, res) => {
    try {
        const review = await ManagementReview.create(req.body);
        res.status(201).json(review);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

api.delete('/management-reviews/:id', async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'წაშლის უფლება არ გაქვთ' });
    try {
        await ManagementReview.findByIdAndDelete(req.params.id);
        res.json({ msg: 'წაიშალა' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- DASHBOARD STATS ---
api.get('/dashboard/stats', async (req, res) => {
    try {
        const today   = new Date();
        const in5Days = new Date();
        in5Days.setDate(today.getDate() + 5);

        const [total, active, completed, registered, staffCount, equipmentList, urgentList, insuranceList, openComplaints, overdueActions] = await Promise.all([
            Inspection.countDocuments(),
            Inspection.countDocuments({ status: 'მიმდინარე' }),
            Inspection.countDocuments({ status: 'დასრულებული' }),
            Inspection.countDocuments({ status: 'რეგისტრირებული' }),
            User.countDocuments(),
            Equipment.find(),
            Inspection.find({
                deadline: { $gte: today, $lte: in5Days },
                status:   { $ne: 'დასრულებული' }
            }).populate('expert', 'firstName lastName').sort({ deadline: 1 }).limit(10),
            Insurance.find({ status: 'active' }).sort({ endDate: 1 }),
            Complaint.countDocuments({ status: 'განხილვაში' }),
            CorrectiveAction.countDocuments({ status: { $ne: 'დახურული' }, deadline: { $lt: today } })
        ]);

        const eqStats = { expired: 0, warning: 0, valid: 0 };
        equipmentList.forEach(eq => {
            if (!eq.nextCalibration) return;
            const diffDays = Math.ceil((new Date(eq.nextCalibration) - today) / (1000 * 60 * 60 * 24));
            if (diffDays < 0)       eqStats.expired++;
            else if (diffDays <= 30) eqStats.warning++;
            else                     eqStats.valid++;
        });

        const insStats = { expiringSoon: [], expired: [] };
        insuranceList.forEach(ins => {
            if (!ins.endDate) return;
            const diffDays = Math.ceil((new Date(ins.endDate) - today) / (1000 * 60 * 60 * 24));
            if (diffDays < 0) insStats.expired.push({ id: ins._id, insurerName: ins.insurerName, policyNumber: ins.policyNumber, endDate: ins.endDate });
            else if (diffDays <= 30) insStats.expiringSoon.push({ id: ins._id, insurerName: ins.insurerName, policyNumber: ins.policyNumber, endDate: ins.endDate, daysLeft: diffDays });
        });

        res.json({ counts: { total, active, completed, registered, staffCount }, equipment: eqStats, urgentList, insurance: insStats, alerts: { openComplaints, overdueActions } });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- COMPLAINTS ---
api.get('/complaints', async (req, res) => {
    try { res.json(await Complaint.find().sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

api.post('/complaints', async (req, res) => {
    try {
        const num = await generateDocumentNumber('COMP');
        const item = await Complaint.create({ ...req.body, complaintNumber: num });
        res.status(201).json(item);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

api.put('/complaints/:id', async (req, res) => {
    try {
        const updated = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'ვერ მოიძებნა' });
        res.json(updated);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

api.delete('/complaints/:id', async (req, res) => {
    if (!['admin', 'quality_manager'].includes(req.user.role)) return res.status(403).json({ error: 'უფლება არ გაქვთ' });
    try {
        await Complaint.findByIdAndDelete(req.params.id);
        res.json({ msg: 'წაიშალა' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- INTERNAL AUDITS ---
api.get('/internal-audits', async (req, res) => {
    try { res.json(await InternalAudit.find().sort({ auditDate: -1 })); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

api.post('/internal-audits', async (req, res) => {
    try {
        const num = await generateDocumentNumber('AUD');
        const item = await InternalAudit.create({ ...req.body, auditNumber: num });
        res.status(201).json(item);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

api.put('/internal-audits/:id', async (req, res) => {
    try {
        const updated = await InternalAudit.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'ვერ მოიძებნა' });
        res.json(updated);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

api.delete('/internal-audits/:id', async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'წაშლის უფლება არ გაქვთ' });
    try {
        await InternalAudit.findByIdAndDelete(req.params.id);
        res.json({ msg: 'წაიშალა' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- CORRECTIVE ACTIONS ---
api.get('/corrective-actions', async (req, res) => {
    try { res.json(await CorrectiveAction.find().sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

api.post('/corrective-actions', async (req, res) => {
    try {
        const num = await generateDocumentNumber('CAR');
        const item = await CorrectiveAction.create({ ...req.body, carNumber: num });
        res.status(201).json(item);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

api.put('/corrective-actions/:id', async (req, res) => {
    try {
        const updated = await CorrectiveAction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'ვერ მოიძებნა' });
        res.json(updated);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

api.delete('/corrective-actions/:id', async (req, res) => {
    if (!['admin', 'quality_manager'].includes(req.user.role)) return res.status(403).json({ error: 'უფლება არ გაქვთ' });
    try {
        await CorrectiveAction.findByIdAndDelete(req.params.id);
        res.json({ msg: 'წაიშალა' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- INSURANCE ---
api.get('/insurance', async (req, res) => {
    try { res.json(await Insurance.find().sort({ endDate: 1 })); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

api.post('/insurance', upload.single('file'), async (req, res) => {
    try {
        const data = JSON.parse(req.body.data || '{}');
        if (req.file) data.fileUrl = `uploads/docs/${req.file.filename}`;
        const item = await Insurance.create(data);
        res.status(201).json(item);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

api.put('/insurance/:id', async (req, res) => {
    try {
        const updated = await Insurance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'ვერ მოიძებნა' });
        res.json(updated);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

api.delete('/insurance/:id', async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'წაშლის უფლება არ გაქვთ' });
    try {
        await Insurance.findByIdAndDelete(req.params.id);
        res.json({ msg: 'წაიშალა' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- COMPANY DOCS ---
api.get('/company-docs', async (req, res) => {
    try { res.json(await CompanyDoc.find().sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

api.post('/company-docs', upload.single('file'), async (req, res) => {
    try {
        const data = JSON.parse(req.body.data || '{}');
        if (req.file) data.fileUrl = `uploads/docs/${req.file.filename}`;
        const item = await CompanyDoc.create(data);
        res.status(201).json(item);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

api.delete('/company-docs/:id', async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'უფლება არ გაქვთ' });
    try {
        await CompanyDoc.findByIdAndDelete(req.params.id);
        res.json({ msg: 'წაიშალა' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- ORDER NUMBER GENERATION ---
api.post('/claim-order-number', async (req, res) => {
    try {
        const { type } = req.body; // '02-HR', '03-TR'
        if (!['02-HR', '03-TR', '01'].includes(type))
            return res.status(400).json({ error: 'უცნობი ბრძანების ტიპი' });
        const number = await generateDocumentNumber(type);
        res.json({ number });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- COMPANY SETTINGS (partners + config) ---
api.get('/company-settings', async (req, res) => {
    try {
        const settings = await CompanySettings.findOne({ key: 'main' });
        res.json(settings || { partners: [], config: {} });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

api.put('/company-settings', async (req, res) => {
    try {
        const { partners, config } = req.body;
        const settings = await CompanySettings.findOneAndUpdate(
            { key: 'main' },
            { $set: { partners, config } },
            { upsert: true, new: true }
        );
        res.json(settings);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- PRICE ADEQUACY: NORM MANAGEMENT ---
const normsUploadDir = './uploads/norms/';
const estimateUploadDir = './uploads/estimates/';
if (!fs.existsSync(normsUploadDir)) fs.mkdirSync(normsUploadDir, { recursive: true });
if (!fs.existsSync(estimateUploadDir)) fs.mkdirSync(estimateUploadDir, { recursive: true });

const normUpload = multer({ storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, normsUploadDir),
    filename: (req, file, cb) => {
        const safeName = Buffer.from(file.originalname, 'latin1').toString('utf8').replace(/\s+/g, '_');
        cb(null, Date.now() + '-' + safeName);
    }
}) });
const estimateUpload = multer({ storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, estimateUploadDir),
    filename: (req, file, cb) => {
        const safeName = Buffer.from(file.originalname, 'latin1').toString('utf8').replace(/\s+/g, '_');
        cb(null, Date.now() + '-' + safeName);
    }
}) });

api.post('/norms/upload', normUpload.single('file'), async (req, res) => {
    if (!['admin', 'quality_manager'].includes(req.user.role))
        return res.status(403).json({ error: 'ნების ჩატვირთვის უფლება მხოლოდ ადმინს და ხარ.მენეჯერს აქვს' });
    try {
        if (!req.file) return res.status(400).json({ error: 'ფაილი არ არის' });
        const { normType = 'NER', year, quarter } = req.body;
        const buffer = fs.readFileSync(req.file.path);
        const parsed = parseNormExcel(buffer);
        if (parsed.length === 0) return res.status(400).json({ error: 'ფაილში ნორმები ვერ მოიძებნა. შეამოწმეთ Excel ფორმატი.' });
        const normFile = await NormFile.create({
            originalName: Buffer.from(req.file.originalname, 'latin1').toString('utf8'),
            fileUrl: `uploads/norms/${req.file.filename}`,
            normType, year: parseInt(year) || new Date().getFullYear(), quarter: parseInt(quarter) || 1, entryCount: parsed.length,
        });
        await NormEntry.insertMany(parsed.map(e => ({ normFileId: normFile._id, normType, year: parseInt(year) || new Date().getFullYear(), quarter: parseInt(quarter) || 1, ...e })));
        res.json({ normFile, entryCount: parsed.length });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

api.get('/norms/files', async (req, res) => {
    try { res.json(await NormFile.find().sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

api.delete('/norms/files/:id', async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'წაშლის უფლება არ გაქვთ' });
    try {
        const file = await NormFile.findByIdAndDelete(req.params.id);
        if (file) await NormEntry.deleteMany({ normFileId: file._id });
        res.json({ msg: 'წაიშალა' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

api.get('/norms/entries', async (req, res) => {
    try {
        const { normFileId, search, page = 1, limit = 100 } = req.query;
        const q = {};
        if (normFileId) q.normFileId = normFileId;
        if (search) q.$or = [{ code: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
        const total = await NormEntry.countDocuments(q);
        const entries = await NormEntry.find(q).skip((page - 1) * parseInt(limit)).limit(parseInt(limit));
        res.json({ entries, total, pages: Math.ceil(total / parseInt(limit)) });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- PRICE ADEQUACY: CHECKS ---
api.post('/price-adequacy/check', estimateUpload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'ხარჯთაღრიცხვის ფაილი არ არის' });
        const { caseId, caseNumber, objectName, normYear, normQuarter, normType, checkedBy } = req.body;
        const buffer = fs.readFileSync(req.file.path);
        const ext = path.extname(req.file.originalname).toLowerCase();
        let lineItems = [];
        if (['.xlsx', '.xls', '.xlsm'].includes(ext)) {
            lineItems = parseCostEstimateExcel(buffer);
        } else {
            return res.status(400).json({ error: 'Excel ფორმატი (.xlsx, .xls) მხარდაჭერილია' });
        }
        if (lineItems.length === 0) return res.status(400).json({ error: 'ხარჯთაღრიცხვაში სტრიქონები ვერ მოიძებნა. შეამოწმეთ Excel სტრუქტურა.' });
        const { results, matchedLines, violationCount, warningCount, okCount, unmatchedCount }
            = await runMatchingEngine(lineItems, normYear ? parseInt(normYear) : null, normQuarter ? parseInt(normQuarter) : null, normType);
        const checkNum = await generateDocumentNumber('PA');
        let conclusion = violationCount > 0
            ? `ხარჯთაღრიცხვაში გამოვლენილია ${violationCount} პოზიცია, სადაც ერთეული ფასი აღემატება მოქმედ ნებადართულ ელემენტარულ ფასდებს 15%-ზე მეტით. შეუსაბამობა მოითხოვს კორექტირებას.`
            : warningCount > 0
            ? `ხარჯთაღრიცხვაში ${warningCount} პოზიციაში ფასი 5–15%-ით აღემატება ნორმას. რეკომენდებულია დამატებითი დასაბუთება.`
            : matchedLines > 0
            ? `ხარჯთაღრიცხვის ${matchedLines} შემოწმებული პოზიცია შეესაბამება მოქმედ ნებადართულ ელემენტარულ ფასდებს.`
            : `ხარჯთაღრიცხვა ვერ შეუსაბამა ნორმატიულ ბაზას — საჭიროა ნორმ-ბაზის განახლება ან ხელით გადამოწმება.`;
        const check = await PriceAdequacyCheck.create({
            checkNumber: checkNum, caseId: caseId || null, caseNumber: caseNumber || '',
            objectName: objectName || '', checkedBy: checkedBy || req.user.username,
            estimateFileName: Buffer.from(req.file.originalname, 'latin1').toString('utf8'),
            normType: normType || 'NER', normYear: normYear ? parseInt(normYear) : null, normQuarter: normQuarter ? parseInt(normQuarter) : null,
            totalLines: lineItems.length, matchedLines, violationCount, warningCount, okCount, unmatchedCount, conclusion, lineItems: results,
        });
        res.json(check);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

api.get('/price-adequacy', async (req, res) => {
    try { res.json(await PriceAdequacyCheck.find({}, '-lineItems').sort({ createdAt: -1 })); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

api.get('/price-adequacy/:id', async (req, res) => {
    try {
        const check = await PriceAdequacyCheck.findById(req.params.id);
        if (!check) return res.status(404).json({ error: 'ვერ მოიძებნა' });
        res.json(check);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

api.get('/price-adequacy/:id/word', async (req, res) => {
    try {
        const check = await PriceAdequacyCheck.findById(req.params.id);
        if (!check) return res.status(404).json({ error: 'ვერ მოიძებნა' });
        const html = generateWordReport(check);
        res.setHeader('Content-Type', 'application/msword');
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(check.checkNumber + '.doc')}`);
        res.send(html);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Seed demo NER norm data (approximate 2025 Georgian market prices)
api.post('/norms/seed-demo', async (req, res) => {
    if (!['admin', 'quality_manager'].includes(req.user.role))
        return res.status(403).json({ error: 'უფლება არ გაქვთ' });
    try {
        const year = parseInt(req.body.year) || 2025;
        const quarter = parseInt(req.body.quarter) || 2;
        const normType = req.body.normType || 'NER';
        // Check if already seeded
        const existing = await NormFile.findOne({ normType, year, quarter, originalName: /ნიმუში/ });
        if (existing) return res.status(400).json({ error: 'ამ პერიოდის საცდელი ბაზა უკვე ჩატვირთულია' });

        const DEMO = [
            // მიწის სამუშაოები
            { chapter:'მიწის სამუშაოები', code:'E1-1-1', description:'ნიადაგის გათხრა (მექ.)',           unit:'მ³',  unitPrice:8.50 },
            { chapter:'მიწის სამუშაოები', code:'E1-1-2', description:'ნიადაგის გათხრა (ხელ.)',          unit:'მ³',  unitPrice:18.00 },
            { chapter:'მიწის სამუშაოები', code:'E1-2-1', description:'ნიადაგის მოტანა 5 კმ-მდე',       unit:'მ³',  unitPrice:12.00 },
            { chapter:'მიწის სამუშაოები', code:'E1-3-1', description:'ნიადაგის გატკეპნა ვიბ.',          unit:'მ³',  unitPrice:6.00 },
            { chapter:'მიწის სამუშაოები', code:'E1-4-1', description:'თხრილის გათხრა (ბინ.)',            unit:'მ³',  unitPrice:15.00 },
            { chapter:'მიწის სამუშაოები', code:'E1-5-1', description:'ქვიშის მომზ. ბალიშად',            unit:'მ³',  unitPrice:45.00 },
            // საძირკვლის სამ.
            { chapter:'საძირკვლის სამუშაოები', code:'E2-1-1', description:'ლენტური საძირკვ. ბეტ. C20/25',unit:'მ³', unitPrice:380.00 },
            { chapter:'საძირკვლის სამუშაოები', code:'E2-1-2', description:'ფილა საძირკველი C25/30',      unit:'მ³',  unitPrice:420.00 },
            { chapter:'საძირკვლის სამუშაოები', code:'E2-2-1', description:'კედელ-საძირკვ. ქვა-ბეტონი',  unit:'მ³',  unitPrice:220.00 },
            // ბეტონ-რკინ.
            { chapter:'ბეტონ-რკინაბეტ. სამ.', code:'E6-1-1', description:'მონოლ. კედელი C20/25',         unit:'მ³',  unitPrice:450.00 },
            { chapter:'ბეტონ-რკინაბეტ. სამ.', code:'E6-1-2', description:'სვეტი/კოლონა C25/30',          unit:'მ³',  unitPrice:520.00 },
            { chapter:'ბეტონ-რკინაბეტ. სამ.', code:'E6-1-3', description:'გადახურვის ფილა C25/30',       unit:'მ³',  unitPrice:490.00 },
            { chapter:'ბეტონ-რკინაბეტ. სამ.', code:'E6-1-4', description:'კიბის მოედანი და საფეხ.',      unit:'მ³',  unitPrice:550.00 },
            { chapter:'ბეტონ-რკინაბეტ. სამ.', code:'E6-2-1', description:'არმატურა A240 ∅8–12',         unit:'კგ',  unitPrice:1.85 },
            { chapter:'ბეტონ-რკინაბეტ. სამ.', code:'E6-2-2', description:'არმატურა A400 ∅14–25',        unit:'კგ',  unitPrice:1.75 },
            { chapter:'ბეტონ-რკინაბეტ. სამ.', code:'E6-3-1', description:'ხის ყალიბი ერთჯ.',            unit:'მ²',  unitPrice:48.00 },
            { chapter:'ბეტონ-რკინაბეტ. სამ.', code:'E6-3-2', description:'ლოჰმანი/ინვ. ყალიბი',         unit:'მ²',  unitPrice:35.00 },
            // ქვის სამ.
            { chapter:'ქვის/ბლოკ. სამუშაოები', code:'E8-1-1', description:'ნახ. ბლოკი 20სმ ბ.',          unit:'მ²',  unitPrice:58.00 },
            { chapter:'ქვის/ბლოკ. სამუშაოები', code:'E8-1-2', description:'ნახ. ბლოკი 30სმ ბ.',          unit:'მ²',  unitPrice:68.00 },
            { chapter:'ქვის/ბლოკ. სამუშაოები', code:'E8-2-1', description:'სილიკ. აგური (0.5NF)',        unit:'მ²',  unitPrice:72.00 },
            { chapter:'ქვის/ბლოკ. სამუშაოები', code:'E8-2-2', description:'კერამ. აგური (1NF)',          unit:'მ²',  unitPrice:85.00 },
            { chapter:'ქვის/ბლოკ. სამუშაოები', code:'E8-3-1', description:'ქვიშ.-ცემ. ბლოკი 20სმ',      unit:'მ²',  unitPrice:52.00 },
            { chapter:'ქვის/ბლოკ. სამუშაოები', code:'E8-4-1', description:'ბუნებ. ქვა (ლოდი)',           unit:'მ³',  unitPrice:180.00 },
            // ლოჯ./ბ.
            { chapter:'ლოჯიისა და ბალკ.', code:'E9-1-1', description:'ლოჯია/ბალკ. ფილა C25/30',          unit:'მ²',  unitPrice:280.00 },
            // ეკრანი/ტიხ.
            { chapter:'ტიხრ./ელემ. კედ.', code:'E10-1-1', description:'გიფსოლ. ტიხრები 10სმ',            unit:'მ²',  unitPrice:42.00 },
            { chapter:'ტიხრ./ელემ. კედ.', code:'E10-1-2', description:'გიფსოლ. ტიხრები 7.5სმ',           unit:'მ²',  unitPrice:38.00 },
            // საიზოლაციო
            { chapter:'საიზოლაციო სამ.', code:'E11-1-1', description:'ბიტ. ორფენ. ჰიდ. (სახ.)',          unit:'მ²',  unitPrice:22.00 },
            { chapter:'საიზოლაციო სამ.', code:'E11-1-2', description:'სახ. ჰიდ. — ლოჯია/სვ.',           unit:'მ²',  unitPrice:28.00 },
            { chapter:'საიზოლაციო სამ.', code:'E11-2-1', description:'მინ. ბამბა 5სმ (სახ.)',             unit:'მ²',  unitPrice:18.00 },
            { chapter:'საიზოლაციო სამ.', code:'E11-2-2', description:'მინ. ბამბა 10სმ (კედ.)',            unit:'მ²',  unitPrice:24.00 },
            { chapter:'საიზოლაციო სამ.', code:'E11-3-1', description:'პოლ. ფენ. 5სმ (ცოკ./სახ.)',        unit:'მ²',  unitPrice:20.00 },
            { chapter:'საიზოლაციო სამ.', code:'E11-3-2', description:'EPS/XPS 10სმ (საძ.)',               unit:'მ²',  unitPrice:32.00 },
            // სახურავი
            { chapter:'სახურავის სამ.', code:'E20-1-1', description:'ბიტ. შინდ. (კრ. სახ.)',              unit:'მ²',  unitPrice:55.00 },
            { chapter:'სახურავის სამ.', code:'E20-2-1', description:'ლითონ. პროფ. (სახ.)',                unit:'მ²',  unitPrice:48.00 },
            { chapter:'სახურავის სამ.', code:'E20-3-1', description:'ბიტ. რულ. მ-ბიტ. (ბ.)',             unit:'მ²',  unitPrice:35.00 },
            { chapter:'სახურავის სამ.', code:'E20-4-1', description:'ქვ. ნ. შ. (ხ. კარ.)',               unit:'მ²',  unitPrice:65.00 },
            // ლესვა
            { chapter:'ლესვა და ისრება', code:'E15-1-1', description:'ცემ.-ქვ. ლესვა კედ. (ბ.)',          unit:'მ²',  unitPrice:22.00 },
            { chapter:'ლესვა და ისრება', code:'E15-1-2', description:'ცემ.-ქვ. ლესვა ჭ. (ბ.)',            unit:'მ²',  unitPrice:28.00 },
            { chapter:'ლესვა და ისრება', code:'E15-2-1', description:'გიფსური ლესვა კედ. (ბ.)',           unit:'მ²',  unitPrice:20.00 },
            { chapter:'ლესვა და ისრება', code:'E15-2-2', description:'გიფსური ლესვა ჭ. (ბ.)',             unit:'მ²',  unitPrice:25.00 },
            { chapter:'ლესვა და ისრება', code:'E15-3-1', description:'სუბსტ. ლ. (ლეწ. ბ.)',               unit:'მ²',  unitPrice:15.00 },
            // მოსაპირ.
            { chapter:'მოპირკეთება', code:'E16-1-1', description:'კერამ. ფილა კედ. (გ.)',                  unit:'მ²',  unitPrice:32.00 },
            { chapter:'მოპირკეთება', code:'E16-1-2', description:'კერამ. ფილა იატ. (გ.)',                  unit:'მ²',  unitPrice:28.00 },
            { chapter:'მოპირკეთება', code:'E16-2-1', description:'მარ. ქ. ბ. (გ.)',                        unit:'მ²',  unitPrice:90.00 },
            { chapter:'მოპირკეთება', code:'E16-3-1', description:'მოზ. ფ. (გ.)',                           unit:'მ²',  unitPrice:55.00 },
            // საღებ.
            { chapter:'საღებავი სამ.', code:'E18-1-1', description:'შ. ემ. ღ. კ. 2-ჯ. (გ.)',               unit:'მ²',  unitPrice:9.00 },
            { chapter:'საღებავი სამ.', code:'E18-1-2', description:'ლ. ღ. კ. ან ჭ. (გ.)',                  unit:'მ²',  unitPrice:12.00 },
            { chapter:'საღებავი სამ.', code:'E18-2-1', description:'ეპოქ.-ბ. ღ. (გ.)',                     unit:'მ²',  unitPrice:22.00 },
            // იატ.
            { chapter:'იატაკის სამ.', code:'E17-1-1', description:'ც.-ქ. გ. ავ. (ბ.)',                     unit:'მ²',  unitPrice:26.00 },
            { chapter:'იატაკის სამ.', code:'E17-2-1', description:'ლამ. 8მმ (გ.)',                          unit:'მ²',  unitPrice:35.00 },
            { chapter:'იატაკის სამ.', code:'E17-3-1', description:'პარ. ზ. (გ.)',                           unit:'მ²',  unitPrice:75.00 },
            { chapter:'იატაკის სამ.', code:'E17-4-1', description:'გ. ბ. ე. (გ.) 80x80',                   unit:'მ²',  unitPrice:40.00 },
            // კარ-ფანჯ.
            { chapter:'კარ-ფანჯრ. სამ.', code:'E23-1-1', description:'შ. PVC ფ. 1.0x1.2 ერთ.',            unit:'ც.',  unitPrice:380.00 },
            { chapter:'კარ-ფანჯრ. სამ.', code:'E23-1-2', description:'შ. PVC ფ. 1.5x1.5 ერთ.',            unit:'ც.',  unitPrice:520.00 },
            { chapter:'კარ-ფანჯრ. სამ.', code:'E23-2-1', description:'შ. ალ. ფ. (ორ. მ.)',                unit:'მ²',  unitPrice:280.00 },
            { chapter:'კარ-ფანჯრ. სამ.', code:'E23-3-1', description:'შ. ხ. კ. 0.9x2.0',                 unit:'ც.',  unitPrice:260.00 },
            { chapter:'კარ-ფანჯრ. სამ.', code:'E23-3-2', description:'შ. ლ. კ. 0.9x2.0',                 unit:'ც.',  unitPrice:320.00 },
            { chapter:'კარ-ფანჯრ. სამ.', code:'E23-4-1', description:'შ. ალ./PVC შ. კ.',                  unit:'ც.',  unitPrice:550.00 },
            // სანტ.
            { chapter:'სანტ.-ტექ. სამ.', code:'E25-1-1', description:'ც. წ. მ. PP ∅20',                   unit:'გ.მ', unitPrice:9.00 },
            { chapter:'სანტ.-ტექ. სამ.', code:'E25-1-2', description:'ც. წ. მ. PP ∅25',                   unit:'გ.მ', unitPrice:12.00 },
            { chapter:'სანტ.-ტექ. სამ.', code:'E25-2-1', description:'კ. PVC ∅50',                         unit:'გ.მ', unitPrice:10.00 },
            { chapter:'სანტ.-ტექ. სამ.', code:'E25-2-2', description:'კ. PVC ∅110',                        unit:'გ.მ', unitPrice:18.00 },
            { chapter:'სანტ.-ტექ. სამ.', code:'E25-3-1', description:'ს. ტ. PP ∅25',                       unit:'გ.მ', unitPrice:14.00 },
            { chapter:'სანტ.-ტექ. სამ.', code:'E25-3-2', description:'ს. ტ. PP ∅32',                       unit:'გ.მ', unitPrice:18.00 },
            { chapter:'სანტ.-ტექ. სამ.', code:'E25-4-1', description:'ქვ. კვ. ს.',                         unit:'ც.',  unitPrice:95.00 },
            { chapter:'სანტ.-ტექ. სამ.', code:'E25-4-2', description:'ქვ. ნ. ს. (შ.)',                    unit:'ც.',  unitPrice:140.00 },
            // ელ.
            { chapter:'ელ. სამ.', code:'E30-1-1', description:'კ. NYM 3x1.5',                               unit:'გ.მ', unitPrice:5.50 },
            { chapter:'ელ. სამ.', code:'E30-1-2', description:'კ. NYM 3x2.5',                               unit:'გ.მ', unitPrice:7.50 },
            { chapter:'ელ. სამ.', code:'E30-1-3', description:'კ. NYM 3x4.0',                               unit:'გ.მ', unitPrice:10.00 },
            { chapter:'ელ. სამ.', code:'E30-2-1', description:'ა. სარ. (ჩ.)',                               unit:'ც.',  unitPrice:28.00 },
            { chapter:'ელ. სამ.', code:'E30-2-2', description:'ა. გამ. (ჩ.)',                               unit:'ც.',  unitPrice:22.00 },
            { chapter:'ელ. სამ.', code:'E30-3-1', description:'ელ. ქ. (ჩ.) 3ფ.',                           unit:'ც.',  unitPrice:380.00 },
            // ვ.ტ.
            { chapter:'ვენტ.-ტ. სამ.', code:'E28-1-1', description:'ვ. ა. ∅100 PVC',                       unit:'გ.მ', unitPrice:8.00 },
            { chapter:'ვენტ.-ტ. სამ.', code:'E28-1-2', description:'ვ. ა. ∅150 PVC',                       unit:'გ.მ', unitPrice:12.00 },
            { chapter:'ვენტ.-ტ. სამ.', code:'E28-2-1', description:'ვ. ბ. ∅125',                           unit:'ც.',  unitPrice:65.00 },
            // ლ.
            { chapter:'ლიფტი', code:'E32-1-1', description:'ლ. შ. (4 გ., 400 კგ)',                         unit:'ც.',  unitPrice:28000.00 },
            { chapter:'ლიფტი', code:'E32-1-2', description:'ლ. შ. (6 გ., 630 კგ)',                         unit:'ც.',  unitPrice:38000.00 },
            // გ.
            { chapter:'გარე სამ.', code:'E35-1-1', description:'ა. გ. ა. (ა.)',                             unit:'მ²',  unitPrice:35.00 },
            { chapter:'გარე სამ.', code:'E35-2-1', description:'ბ. ა. (ა.)',                                unit:'მ²',  unitPrice:42.00 },
            { chapter:'გარე სამ.', code:'E35-3-1', description:'ს. ღ. ს. (ა.)',                             unit:'მ²',  unitPrice:28.00 },
        ];

        const normFile = await NormFile.create({
            originalName: `NER ${year} კვ.${quarter} — ნიმუში (საქ. ბაზ. 2025)`,
            fileUrl: '',
            normType,
            year,
            quarter,
            entryCount: DEMO.length,
        });
        await NormEntry.insertMany(DEMO.map(e => ({
            normFileId: normFile._id,
            normType,
            year,
            quarter,
            code: e.code,
            description: e.description,
            unit: e.unit,
            unitPrice: e.unitPrice,
            chapter: e.chapter,
            keywords: extractKeywords(e.description + ' ' + e.chapter),
        })));
        res.json({ msg: 'საცდელი NER ბაზა ჩაიტვირთა', entryCount: DEMO.length, normFile });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

api.delete('/price-adequacy/:id', async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'წაშლის უფლება არ გაქვთ' });
    try { await PriceAdequacyCheck.findByIdAndDelete(req.params.id); res.json({ msg: 'წაიშალა' }); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

// --- AUTH ROUTES (public — no JWT required) ---
const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await AuthUser.findOne({ username });
        if (!user) return res.status(401).json({ message: 'მომხმარებელი ვერ მოიძებნა' });
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ message: 'პაროლი არასწორია' });
        const token = jwt.sign({ id: user._id, username: user.username, role: user.role, staffId: user.staffId || null }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, username: user.username, role: user.role });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

authRouter.post('/change-password', requireAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await AuthUser.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'მომხმარებელი ვერ მოიძებნა' });
        const ok = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!ok) return res.status(401).json({ message: 'ძველი პაროლი არასწორია' });
        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: 'პაროლი შეიცვალა' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin+HR: list and create auth users
const canManageUsers = (role) => role === 'admin' || role === 'hr';

authRouter.get('/users', requireAuth, async (req, res) => {
    if (!canManageUsers(req.user.role)) return res.status(403).json({ message: 'უფლება არ გაქვთ' });
    const users = await AuthUser.find({}, 'username role staffId createdAt').populate('staffId', 'firstName lastName');
    res.json(users);
});

authRouter.post('/users', requireAuth, async (req, res) => {
    if (!canManageUsers(req.user.role)) return res.status(403).json({ message: 'უფლება არ გაქვთ' });
    try {
        const { username, password, role, staffId } = req.body;
        // HR cannot create admin accounts
        if (req.user.role === 'hr' && role === 'admin') return res.status(403).json({ message: 'HR-ს არ შეუძლია ადმინის შექმნა' });
        const hash = await bcrypt.hash(password, 10);
        const user = await AuthUser.create({ username, passwordHash: hash, role: role || 'inspector', staffId: staffId || null });
        res.json({ _id: user._id, username: user.username, role: user.role });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ message: 'მომხმარებელი უკვე არსებობს' });
        res.status(400).json({ message: err.message });
    }
});

authRouter.delete('/users/:id', requireAuth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'მხოლოდ ადმინს შეუძლია წაშლა' });
    await AuthUser.findByIdAndDelete(req.params.id);
    res.json({ msg: 'წაიშალა' });
});

app.use('/api/auth', authRouter);

// Mount the API router — BEFORE static file serving
app.use('/api', api);

// Health check for Railway deployment
app.get('/health', (req, res) => res.json({ ok: true }));

// --- FRONTEND (React Build) ---
const buildPath = path.join(__dirname, 'client', 'build');
// Static assets (JS/CSS) have content hashes — cache them long-term
app.use(express.static(buildPath, { index: false }));
// index.html must never be cached so browser always gets the latest bundle reference
app.use((req, res) => {
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.sendFile(indexPath);
    } else {
        res.status(200).json({ status: 'API running', buildMissing: true });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
