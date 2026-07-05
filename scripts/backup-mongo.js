#!/usr/bin/env node
/**
 * backup-mongo.js — production MongoDB-ის ყოველდღიური სარეზერვო ასლი (ISO §8.4 ჩანაწერების დაცვა).
 *
 * წყარო-URL პრიორიტეტით:
 *   1) --uri <mongodb://...>   2) env BACKUP_MONGO_URI   3) railway CLI (MongoDB-OJol → MONGO_PUBLIC_URL)
 *
 * ინახავს: backups/YYYY-MM-DD_HHmm/<collection>.ejson.json  (EJSON — თარიღები/ObjectId-ები აღდგენადია)
 * Retention: ბოლო 14 ასლი; ძველები ავტომატურად იშლება.
 *
 * გაშვება:  node scripts/backup-mongo.js          (ან: npm run backup)
 * აღდგენა:  EJSON.parse + insertMany შესაბამის კოლექციაში.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const mongoose = require('mongoose');
const { EJSON } = require('bson');

const RETENTION = 14;
const ROOT = path.join(__dirname, '..');
const BACKUP_DIR = path.join(ROOT, 'backups');

function resolveUri() {
    const argIdx = process.argv.indexOf('--uri');
    if (argIdx >= 0 && process.argv[argIdx + 1]) return process.argv[argIdx + 1];
    if (process.env.BACKUP_MONGO_URI) return process.env.BACKUP_MONGO_URI;
    const kv = execSync('railway variables --service MongoDB-OJol --kv', { encoding: 'utf8', cwd: ROOT });
    const line = kv.split('\n').find(l => l.startsWith('MONGO_PUBLIC_URL='));
    if (!line) throw new Error('MONGO_PUBLIC_URL ვერ მოიძებნა — გადაამოწმეთ railway CLI-ს ავტორიზაცია');
    let uri = line.slice('MONGO_PUBLIC_URL='.length).trim();
    if (!uri.includes('?')) uri += '/buildexDB?authSource=admin';
    return uri;
}

(async () => {
    const started = new Date();
    const stamp = started.toISOString().slice(0, 16).replace('T', '_').replace(':', '');
    const outDir = path.join(BACKUP_DIR, stamp);

    const uri = resolveUri();
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    console.log(`[backup] ბაზა: ${mongoose.connection.name} → ${outDir}`);

    fs.mkdirSync(outDir, { recursive: true });
    const collections = await db.listCollections().toArray();
    let total = 0;
    for (const { name } of collections) {
        if (name.startsWith('system.')) continue;
        const docs = await db.collection(name).find({}).toArray();
        fs.writeFileSync(path.join(outDir, `${name}.ejson.json`), EJSON.stringify(docs));
        console.log(`[backup]   ${name}: ${docs.length} ჩანაწერი`);
        total += docs.length;
    }

    // Retention — ძველი ასლების წაშლა
    const snapshots = fs.readdirSync(BACKUP_DIR, { withFileTypes: true })
        .filter(e => e.isDirectory()).map(e => e.name).sort();
    for (const old of snapshots.slice(0, Math.max(0, snapshots.length - RETENTION))) {
        fs.rmSync(path.join(BACKUP_DIR, old), { recursive: true, force: true });
        console.log(`[backup] retention: წაიშალა ${old}`);
    }

    console.log(`[backup] ✓ დასრულდა: ${collections.length} კოლექცია, ${total} ჩანაწერი, ${((Date.now() - started) / 1000).toFixed(1)}წმ`);
    process.exit(0);
})().catch(e => { console.error('[backup] ✗ შეცდომა:', e.message); process.exit(1); });
