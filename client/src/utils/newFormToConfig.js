// newFormToConfig — გარდაქმნის NEW_FORMS განსაზღვრებას (newFormDefinitions.json) FormFillModal-ის
// თავსებად config-ად. field id-ები ემთხვევა GenericFormPdf-ის `r{si}_{ri}[a|b]` სქემას,
// ამიტომ FormFillModal-ის formData პირდაპირ მიეწოდება GenericFormPdf-ს data-დ (buildData არ სჭირდება).
export function newFormToConfig(form) {
  if (!form) return null;
  const sections = (form.sections || []).map((sec, si) => ({
    label: sec.h || '',
    fields: (sec.rows || []).flatMap((row, ri) => {
      if (typeof row === 'string') return [];
      const [type, a, b] = row;
      const id = `r${si}_${ri}`;
      switch (type) {
        case 'field':  return [{ id, label: a, type: 'text' }];
        case 'field2': return [{ id: id + 'a', label: a, type: 'text' }, { id: id + 'b', label: b, type: 'text' }];
        case 'area':   return [{ id, label: a, type: 'textarea' }];
        case 'yesno':  return [{ id, label: a, type: 'yesno' }];
        case 'check':  return [{ id, label: a, type: 'yesno' }];
        case 'table':  return [{
          id, label: (a && a.title) || sec.h || 'ცხრილი', type: 'tablerows', minRows: 1,
          columns: ((a && a.cols) || []).map((c, ci) => ({ id: 'c' + ci, label: c, type: 'text' })),
          // ფიქსირებულ-სტრიქონიანი ცხრილები (მაგ. აუდიტის ჩეკლისტი) — ედიტორი მასტერის სტრიქონებით იწყება
          presetRows: (a && a.rows) ? a.rows.map(r => Object.fromEntries(r.map((v, ci) => ['c' + ci, v]))) : undefined,
        }];
        default:       return [];
      }
    }),
  })).filter((sec) => sec.fields.length > 0);
  return { title: form.title, signers: form.signers || [], sections };
}
