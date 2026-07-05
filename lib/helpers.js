// lib/helpers.js — server.js-ის სუფთა (side-effect-ის გარეშე) დამხმარე ფუნქციები.
// ცალკეა გატანილი, რომ node:test-ით შემოწმდეს სერვერის ატვირთვის გარეშე.

const GEO_SYNONYMS = {
    'გრუნტ': 'ნიადაგ', 'გრუნტის': 'ნიადაგ', 'გრუნტი': 'ნიადაგ',
    'ექსკავ': 'გათხ', 'ექსკავატორ': 'გათხ', 'ექსკავაციი': 'გათხ',
    'ამოთხრ': 'გათხ', 'გაჭრ': 'გათხ', 'გათხრ': 'გათხ',
    'დამუშავ': 'გათხ',
    'შევსებ': 'მოყრ', 'გადავსებ': 'მოყრ', 'ყრ': 'მოყრ', 'ყრილ': 'მოყრ',
    'გატკეპნ': 'ტკეპნ', 'ტკეპნ': 'ტკეპნ', 'შეტკეპნ': 'ტკეპნ',
    'ბეტონ': 'ბეტ', 'ბეტ': 'ბეტ', 'რკინაბეტ': 'ბეტ',
    'ქვიშ': 'ქვიშ', 'ქვიშის': 'ქვიშ',
    'ბალიშ': 'ქვიშ',
    'ასფალტ': 'ასფ', 'ასფ': 'ასფ', 'ასფალტბეტ': 'ასფ',
    'სრიალ': 'ასფ',
    'ფილ': 'ფილ', 'ბეტონის ფილ': 'ფილ',
    'კონსტრუქც': 'კონსტ', 'სტრუქტურ': 'კონსტ',
    'მილ': 'მილ', 'მილსადენ': 'მილ', 'სადენ': 'მილ', 'ტრუბ': 'მილ',
    'ჭ': 'ჭა', 'ჭები': 'ჭა', 'ჭის': 'ჭა', 'სანიაღვრ': 'ჭა', 'სალუქ': 'ჭა',
    'ჰიდრ': 'ჭა',
    'ბორდიურ': 'ბორდ', 'ევრობ': 'ბორდ', 'ლილვ': 'ბორდ',
    'სადრენ': 'დრენ', 'დრენაჟ': 'დრენ', 'წყაბ': 'დრენ',
    'კირ': 'კირ', 'კირხსნ': 'კირ',
    'ცემ': 'ცემ', 'ცემენტ': 'ცემ',
    'ხელ': 'ხელ', 'ხელით': 'ხელ', 'ხელნ': 'ხელ',
    'მექ': 'მექ', 'მექანიზ': 'მექ', 'მანქან': 'მექ',
    'გათბ': 'გათბ', 'გათბობ': 'გათბ',
    'იზოლ': 'იზოლ', 'თბო': 'იზოლ', 'ჰიდრო': 'ჰიდრ',
    'საღებავ': 'ღებ', 'შეღებ': 'ღებ',
    'ლითონ': 'ლით', 'მეტალ': 'ლით',
    'კარ': 'კარ', 'ფანჯარ': 'ფანჯ',
    'სახურავ': 'სახ', 'გადახურვ': 'სახ',
    'ლესვ': 'შტუკ', 'შტუკატ': 'შტუკ', 'გათეთრ': 'შტუკ',
    'ტრასა': 'ტრასა', 'ტრასის': 'ტრასა', 'ტრაპ': 'ტრასა',
    'ფენ': 'ფენ', 'მოფენ': 'ფენ', 'დაგებ': 'ფენ',
    'სარეაბ': 'რემ', 'სარემ': 'რემ', 'რეაბ': 'რემ', 'რეკ': 'რემ',
    'ნგრ': 'დემ', 'დანგრ': 'დემ', 'დემონტ': 'დემ',
    'მოხსნ': 'დემ', 'ამოღ': 'დემ',
};

function normalizeGeo(word) {
    if (GEO_SYNONYMS[word]) return GEO_SYNONYMS[word];
    // Try prefix match for longer words (e.g. "გრუნტებს" → check "გრუნტ")
    for (const [key, val] of Object.entries(GEO_SYNONYMS)) {
        if (word.startsWith(key) && key.length >= 4) return val;
    }
    return word;
}

function extractKeywords(text) {
    if (!text) return [];
    return String(text).toLowerCase()
        .replace(/[()[\]{}/\\,;:.!?«»""''–—]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2)
        .map(normalizeGeo);
}

function kwMatchScore(words1, words2) {
    if (!words1.length || !words2.length) return 0;
    const set2 = new Set(words2);
    const matches = words1.filter(w => set2.has(w)).length;
    return matches / Math.max(words1.length, words2.length);
}

function diffDoc(before, after, fields) {
    if (!before || !after) return '';
    const parts = [];
    for (const f of fields) {
        const sa = before[f] === undefined || before[f] === null ? '' : String(before[f]);
        const sb = after[f]  === undefined || after[f]  === null ? '' : String(after[f]);
        if (sa !== sb) parts.push(`${f}: "${sa}" → "${sb}"`);
    }
    return parts.join('; ');
}

function validateBody(body, rules) {
    const errors = [];
    for (const [field, rule] of Object.entries(rules)) {
        const v = body ? body[field] : undefined;
        const empty = v === undefined || v === null || v === '';
        if (rule.required && empty) { errors.push(`${rule.label || field}: სავალდებულოა`); continue; }
        if (empty) continue;
        if (rule.type === 'string' && typeof v !== 'string') errors.push(`${rule.label || field}: ტექსტი უნდა იყოს`);
        if (rule.type === 'number' && isNaN(Number(v))) errors.push(`${rule.label || field}: რიცხვი უნდა იყოს`);
        if (rule.type === 'email' && !(typeof v === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v))) errors.push(`${rule.label || field}: ელ.ფოსტა არასწორია`);
        if (rule.maxLength && typeof v === 'string' && v.length > rule.maxLength) errors.push(`${rule.label || field}: მაქს. ${rule.maxLength} სიმბოლო`);
        if (rule.enum && !rule.enum.includes(v)) errors.push(`${rule.label || field}: დაუშვებელი მნიშვნელობა`);
    }
    return errors;
}

module.exports = { GEO_SYNONYMS, normalizeGeo, extractKeywords, kwMatchScore, diffDoc, validateBody };
