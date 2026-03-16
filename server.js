const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'buildex-secret-2026';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/buildexDB')
    .then(() => console.log('✅ ბაზა და რეგლამენტი ჩაიტვირთა!'))
    .catch(err => console.error('❌ ბაზის შეცდომა:', err));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
    const exists = await AuthUser.findOne({ username: 'admin' });
    if (!exists) {
        const hash = await bcrypt.hash('Buildex@2026', 10);
        await AuthUser.create({ username: 'admin', passwordHash: hash, role: 'admin' });
        console.log('✅ ადმინი შეიქმნა: admin / Buildex@2026');
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
    applicationContent: String,
    status: { type: String, default: 'რეგისტრირებული' },
    deadline: Date,
    startDate: Date,
    expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    technicalManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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

// --- HELPER: ნუმერაციის გენერატორი ---
async function generateDocumentNumber(type, date = new Date()) {
    const yearFull = date.getFullYear();
    const yearShort = yearFull.toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
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
        case 'IN':     return `IN-${seq}/${yearShort}`;
        case 'OUT':    return `OUT-${seq}/${yearShort}`;
        case 'LC':     return `LC-${seq2}-${month}/${yearShort}`;
        case 'SC':     return `SC-${seq2}-${month}/${yearShort}`;
        case 'BX-INS': return `BX-INS-${yearShort}-${month}-${seq4}`;
        case 'IM':     return `IM-${seq}/${yearShort}`;
        default: throw new Error("უცნობი კატეგორია");
    }
}

// =============================================
// API ROUTER — ყველა API route ერთ Router-ში
// =============================================
const api = express.Router();
api.use((req, res, next) => { console.log('[API ROUTER]', req.method, req.path); next(); });
api.use(requireAuth);

// --- INSPECTIONS ---
api.post('/inspections', async (req, res) => {
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
        const list = await Inspection.find(query).populate('expert', 'firstName lastName').sort({ createdAt: -1 });
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
api.post('/users/register', upload.single('photo'), async (req, res) => {
    try {
        const userData = JSON.parse(req.body.userData);
        if (req.file) userData.photo = `uploads/docs/${req.file.filename}`;
        const user = await new User(userData).save();
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

        const [total, active, completed, registered, staffCount, equipmentList, urgentList] = await Promise.all([
            Inspection.countDocuments(),
            Inspection.countDocuments({ status: 'მიმდინარე' }),
            Inspection.countDocuments({ status: 'დასრულებული' }),
            Inspection.countDocuments({ status: 'რეგისტრირებული' }),
            User.countDocuments(),
            Equipment.find(),
            Inspection.find({
                deadline: { $gte: today, $lte: in5Days },
                status:   { $ne: 'დასრულებული' }
            }).populate('expert', 'firstName lastName').sort({ deadline: 1 }).limit(10)
        ]);

        const eqStats = { expired: 0, warning: 0, valid: 0 };
        equipmentList.forEach(eq => {
            if (!eq.nextCalibration) return;
            const diffDays = Math.ceil((new Date(eq.nextCalibration) - today) / (1000 * 60 * 60 * 24));
            if (diffDays < 0)       eqStats.expired++;
            else if (diffDays <= 30) eqStats.warning++;
            else                     eqStats.valid++;
        });

        res.json({ counts: { total, active, completed, registered, staffCount }, equipment: eqStats, urgentList });
    } catch (err) { res.status(500).json({ error: err.message }); }
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

// --- FRONTEND (React Build) ---
const buildPath = path.join(__dirname, 'client', 'build');
app.use(express.static(buildPath));
app.use((req, res) => res.sendFile(path.join(buildPath, 'index.html')));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
