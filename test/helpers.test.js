// საბაზისო ტესტები server-ის სუფთა ჰელფერებზე — გაშვება: npm test (node --test)
const { test } = require('node:test');
const assert = require('node:assert');
const { normalizeGeo, extractKeywords, kwMatchScore, diffDoc, validateBody } = require('../lib/helpers');

test('normalizeGeo — სინონიმი კანონიკურ ძირზე დაიყვანება', () => {
    assert.strictEqual(normalizeGeo('გრუნტის'), 'ნიადაგ');
    assert.strictEqual(normalizeGeo('ექსკავატორ'), 'გათხ');
    // პრეფიქსული დამთხვევა (≥4 სიმბოლო)
    assert.strictEqual(normalizeGeo('ბორდიურები'), 'ბორდ');
    // უცნობი სიტყვა უცვლელი რჩება
    assert.strictEqual(normalizeGeo('ზღარბი'), 'ზღარბი');
});

test('extractKeywords — პუნქტუაცია იწმინდება, მოკლე სიტყვები იფილტრება', () => {
    const kw = extractKeywords('ბეტონის (M300) სხმა, კედელი!');
    assert.ok(kw.includes('ბეტ'));           // სინონიმ-რუკით ნორმალიზდა
    assert.ok(!kw.includes('m30'));           // 3-სიმბოლიანი და ციფრები არ შემოდის ისე
    assert.deepStrictEqual(extractKeywords(''), []);
    assert.deepStrictEqual(extractKeywords(null), []);
});

test('kwMatchScore — ქულა [0..1] და სიმეტრიულად ითვლის მაქს. სიგრძეზე', () => {
    assert.strictEqual(kwMatchScore([], ['x']), 0);
    assert.strictEqual(kwMatchScore(['a', 'b'], ['a', 'b']), 1);
    assert.strictEqual(kwMatchScore(['a', 'b', 'c', 'd'], ['a', 'b']), 0.5);
});

test('diffDoc — მხოლოდ შეცვლილი ველები შედის diff-ში', () => {
    const before = { status: 'ღია', name: 'X', other: 1 };
    const after  = { status: 'დახურული', name: 'X', other: 2 };
    const d = diffDoc(before, after, ['status', 'name']);
    assert.ok(d.includes('status'));
    assert.ok(!d.includes('name'));
    assert.strictEqual(diffDoc(null, after, ['status']), '');
});

test('validateBody — required/type/enum/maxLength წესები', () => {
    const rules = {
        name:  { required: true, type: 'string', maxLength: 5, label: 'სახელი' },
        email: { type: 'email', label: 'ელფოსტა' },
        cat:   { enum: ['ა', 'ბ'], label: 'კატეგორია' },
    };
    assert.strictEqual(validateBody({ name: 'ok' }, rules).length, 0);
    assert.ok(validateBody({}, rules).length >= 1);                          // required
    assert.ok(validateBody({ name: 'ძალიანგრძელი' }, rules).length >= 1);    // maxLength
    assert.ok(validateBody({ name: 'ok', email: 'არასწორი' }, rules).length >= 1);
    assert.ok(validateBody({ name: 'ok', cat: 'გ' }, rules).length >= 1);    // enum
    assert.strictEqual(validateBody({ name: 'ok', email: 'a@b.ge', cat: 'ა' }, rules).length, 0);
});
