#!/usr/bin/env node
/**
 * seed-admin.js — ადმინ-მომხმარებლის უსაფრთხო შექმნა (CR-1 / OPS-009).
 *
 * ცვლის წაშლილ hardcoded default admin-ს (admin / Buildex@2026).
 * მომხმარებელი იქმნება მხოლოდ env-ცვლადებიდან, კოდში პაროლი არ წერია.
 *
 * გამოყენება:
 *   MONGODB_URI=...  ADMIN_USERNAME=admin  ADMIN_PASSWORD='ძლიერი-პაროლი-12+' \
 *     node scripts/seed-admin.js
 *
 * ან npm-ით:  npm run seed-admin
 *
 * თუ მომხმარებელი უკვე არსებობს — პაროლი განახლდება (--reset აზრით idempotent).
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { MONGODB_URI, ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_ROLE } = process.env;

function fail(msg) {
    console.error('❌ ' + msg);
    process.exit(1);
}

if (!MONGODB_URI) fail('MONGODB_URI არ არის დაყენებული.');
if (!ADMIN_USERNAME) fail('ADMIN_USERNAME არ არის დაყენებული.');
if (!ADMIN_PASSWORD) fail('ADMIN_PASSWORD არ არის დაყენებული.');
if (ADMIN_PASSWORD.length < 12)
    fail('ADMIN_PASSWORD ძალიან სუსტია — საჭიროა მინ. 12 სიმბოლო.');

// იგივე სქემა, რაც server.js-ში inline AuthUser (collection: authusers).
const AuthUser = mongoose.model('AuthUser', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'inspector' },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true }));

(async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
        const role = ADMIN_ROLE || 'admin';

        const existing = await AuthUser.findOne({ username: ADMIN_USERNAME });
        if (existing) {
            existing.passwordHash = passwordHash;
            existing.role = role;
            await existing.save();
            console.log(`🔄 ადმინი განახლდა: ${ADMIN_USERNAME} (role=${role})`);
        } else {
            await AuthUser.create({ username: ADMIN_USERNAME, passwordHash, role });
            console.log(`✅ ადმინი შეიქმნა: ${ADMIN_USERNAME} (role=${role})`);
        }
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        fail('seed-admin შეცდომა: ' + err.message);
    }
})();
