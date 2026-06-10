/* generateForms.cjs — renders all BE-FM-* forms to Desktop\ფორმები */
const path = require('path');
const fs = require('fs');
const os = require('os');
const { renderForm } = require('./formEngine.cjs');
const { FORMS } = require('./formsData.cjs');

function findDesktop() {
  const candidates = [
    path.join(os.homedir(), 'OneDrive', 'Desktop'),
    path.join(os.homedir(), 'Desktop'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[candidates.length - 1];
}

const OUT_DIR = path.join(findDesktop(), 'ფორმები');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log(`გენერაცია: ${FORMS.length} ფორმა → ${OUT_DIR}\n`);
  let ok = 0, fail = 0;
  for (const form of FORMS) {
    try {
      const p = await renderForm(form, OUT_DIR);
      console.log(`  ✓ ${form.code} — ${form.title}`);
      ok++;
    } catch (e) {
      console.error(`  ✗ ${form.code} — ${form.title}\n     ${e.message}`);
      fail++;
    }
  }
  console.log(`\nდასრულდა: ${ok} წარმატებული, ${fail} შეცდომა.`);
})();
