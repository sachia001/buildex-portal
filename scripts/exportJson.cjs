const fs = require('fs');
const path = require('path');
const { FORMS } = require('./formsData.cjs');
const out = path.join(__dirname, '..', 'client', 'src', 'components', 'newFormDefinitions.json');
fs.writeFileSync(out, JSON.stringify(FORMS, null, 2), 'utf8');
console.log(`wrote ${FORMS.length} forms → ${out}`);
