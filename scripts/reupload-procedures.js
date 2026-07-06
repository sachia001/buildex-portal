#!/usr/bin/env node
/**
 * reupload-procedures.js — production-დოკუმენტაციის სრული განახლება ეტალონური ნაკრებით.
 *
 * რას აკეთებს:
 *   1. შლის ProcedureDoc-ის ყველა ჩანაწერს production-ბაზაში (soft-deleted-ების ჩათვლით)
 *      და buildex-procedures/* ფაილებს Cloudinary-ზე;
 *   2. uploads/procedures-ის (ეტალონის სარკე) ყველა ფაილს ტვირთავს Cloudinary-ზე
 *      და ქმნის ახალ ჩანაწერებს სწორი კოდით/სათაურით/კატეგორიით.
 *
 * კრედენციალები: railway CLI-დან (MongoDB-OJol → MONGO_PUBLIC_URL; BuildexPortal → CLOUDINARY_URL).
 * გაშვებამდე აუცილებელია ბექაპი: npm run backup
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const mongoose = require('mongoose');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const PROC_DIR = path.join(ROOT, 'uploads', 'procedures');

function railwayVar(service, name) {
    const kv = execSync(`railway variables --service ${service} --kv`, { encoding: 'utf8', cwd: ROOT });
    const line = kv.split('\n').find(l => l.startsWith(name + '='));
    if (!line) throw new Error(`${name} ვერ მოიძებნა (${service})`);
    return line.slice(name.length + 1).trim();
}

// ფოლდერი → კატეგორია (server.js-ის PROC_FOLDER_MAP-ის იდენტური)
const FOLDER_MAP = {
    'A_ხარისხის_სახელმძღვანელო': 'manual',
    'B_პროცედურები': 'procedure',
    'C_სამუშაო_ინსტრუქციები': 'instruction',
    'D_სამუშაო_აღწერილობები': 'job_description',
    'E_ფორმები_და_შაბლონები': 'form',
    'F_პოლიტიკები': 'policy',
    'G_რისკების_მართვა': 'risk',
    'H_ბრძანებები': 'order',
};

// კოდი→სათაური — კლიენტის ALL_DOCS_META-დან (ერთიანი წყარო)
function loadTitleMap() {
    const t = fs.readFileSync(path.join(ROOT, 'client/src/pages/ProceduresPage.js'), 'utf8');
    const map = {};
    for (const m of t.matchAll(/\{ code: '([^']+)', category: '[^']+', title: '([^']+)'/g)) map[m[1]] = m[2];
    return map;
}

function parseDocName(fname, titleMap) {
    const upAscii = (s) => s.replace(/[a-z]/g, c => c.toUpperCase());
    const base = fname.replace(/\.(docx?|pdf|xlsx?|xls)$/i, '').trim();
    if (base.includes('—')) {
        const i = base.indexOf('—');
        return { code: upAscii(base.slice(0, i).replace(/[\s_]+$/, '').trim()), title: base.slice(i + 1).trim() };
    }
    const s = base.replace(/_v\d+(_\d+)?$/i, '');
    const m = s.match(/^(QM-\d+|BE-PR-(?:MAIN|\d+)|BE-WI-\d+|HR-JD-\d+|BE-POL-\d+|BE-FM-[\wა-ჰ-]+|RM-\d+|ORD-\d+[A-Za-z]?)/);
    const code = upAscii(m ? m[1] : s.split(/[\s_]/)[0]);
    const title = titleMap[code] || s.slice(m ? m[1].length : 0).replace(/^[-_\s]+/, '').replace(/_/g, ' ').trim() || code;
    return { code, title };
}

(async () => {
    console.log('[reupload] კრედენციალების წამოღება railway-დან…');
    const mongoUrl = railwayVar('MongoDB-OJol', 'MONGO_PUBLIC_URL');
    const cloudinaryUrl = railwayVar('BuildexPortal', 'CLOUDINARY_URL');
    process.env.CLOUDINARY_URL = cloudinaryUrl;
    const cloudinary = require('cloudinary').v2;

    await mongoose.connect(mongoUrl + (mongoUrl.includes('?') ? '' : '/buildexDB?authSource=admin'));
    const ProcedureDoc = mongoose.model('ProcedureDoc', new mongoose.Schema({}, { strict: false }));
    console.log('[reupload] ბაზა:', mongoose.connection.name);

    // ─── 1. სრული წმენდა ───
    const before = await ProcedureDoc.countDocuments({});
    await ProcedureDoc.deleteMany({});
    console.log(`[reupload] წაიშალა ${before} ჩანაწერი ბაზიდან`);
    try {
        const delRes = await cloudinary.api.delete_resources_by_prefix('buildex-procedures', { resource_type: 'raw', type: 'upload' });
        console.log('[reupload] Cloudinary გაიწმინდა:', Object.keys(delRes.deleted || {}).length, 'ფაილი');
    } catch (e) { console.warn('[reupload] Cloudinary წმენდა:', e.message); }

    // ─── 2. ეტალონური ნაკრების ატვირთვა ───
    const titleMap = loadTitleMap();
    const exts = ['.docx', '.doc', '.pdf', '.xlsx', '.xls'];
    const files = [];
    const walk = (dir, category) => {
        for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
            const abs = path.join(dir, ent.name);
            if (ent.isDirectory()) walk(abs, FOLDER_MAP[ent.name] || category);
            else if (exts.some(e => ent.name.toLowerCase().endsWith(e))) files.push({ abs, fname: ent.name, category });
        }
    };
    walk(PROC_DIR, 'other');
    console.log(`[reupload] ასატვირთია ${files.length} ფაილი…`);

    const mimeMap = {
        '.pdf': 'application/pdf',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.doc': 'application/msword',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.xls': 'application/vnd.ms-excel',
    };
    let ok = 0, fail = 0;
    for (const { abs, fname, category } of files) {
        try {
            const { code, title } = parseDocName(fname, titleMap);
            const buffer = fs.readFileSync(abs);
            const ext = path.extname(fname).toLowerCase();
            const dataUri = `data:${mimeMap[ext] || 'application/octet-stream'};base64,${buffer.toString('base64')}`;
            const result = await cloudinary.uploader.upload(dataUri, {
                resource_type: 'raw', type: 'upload',
                folder: `buildex-procedures/${category}`,
                public_id: crypto.randomBytes(16).toString('hex'),
                overwrite: false,
            });
            await ProcedureDoc.create({
                code, title, category, version: '1.0',
                cloudinaryId: result.public_id, cloudinaryUrl: result.secure_url || '',
                filePath: '', originalName: fname, uploadedBy: 'system-reference',
                fileSize: buffer.length, notes: 'ეტალონური პაკეტი — სრულყოფილი დოკუმენტაცია',
                status: 'მოქმედი', invalidatedAt: null, invalidatedBy: '', invalidateReason: '',
                isDeleted: false, deletedAt: null, deletedBy: '',
            });
            ok++;
            if (ok % 20 === 0) console.log(`[reupload]   ${ok}/${files.length}…`);
        } catch (e) { fail++; console.error('[reupload] ✗', fname, '—', e.message); }
    }
    console.log(`[reupload] ✓ დასრულდა: ${ok} ატვირთული, ${fail} შეცდომა`);
    const after = await ProcedureDoc.countDocuments({});
    console.log(`[reupload] ბაზაში ახლა: ${after} ჩანაწერი`);
    process.exit(fail ? 1 : 0);
})().catch(e => { console.error('[reupload] ფატალური:', e.message); process.exit(1); });
