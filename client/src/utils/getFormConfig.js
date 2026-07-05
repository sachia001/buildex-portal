// getFormConfig — ფორმის შესავსები კონფიგის ერთიანი რეზოლვერი (კონსოლიდაცია: 1 წყარო).
// პრიორიტეტი: FORM_CONFIGS (მდიდარი — case/staff ავტო-შევსებით) → newFormDefinitions (GenericFormPdf).
// ყველა გვერდმა ფორმის გასახსნელად ეს ფუნქცია უნდა გამოიყენოს — პირდაპირი იმპორტების ნაცვლად.
import { FORM_CONFIGS } from '../components/formConfigs';
import NEW_FORMS from '../components/newFormDefinitions.json';
import { newFormToConfig } from './newFormToConfig';

// აბრუნებს { config, form } — form მხოლოდ NEW_FORMS-წყაროსთვის (GenericFormPdf-ს სჭირდება)
export function getFormConfig(code) {
  if (FORM_CONFIGS[code]) return { config: FORM_CONFIGS[code], form: null };
  const nf = NEW_FORMS.find((f) => f.code === code);
  if (nf) {
    const config = newFormToConfig(nf);
    if (config && config.sections.length > 0) return { config, form: nf };
  }
  return null;
}

// ყველა შესავსები ფორმის კოდი (dropdown-ებისთვის)
export const FILLABLE_CODES = [...new Set([
  ...Object.keys(FORM_CONFIGS).filter((c) => c.startsWith('BE-FM-')),
  ...NEW_FORMS.map((f) => f.code),
])].sort();

// ფორმის სათაური კოდით
export function formTitle(code) {
  const r = getFormConfig(code);
  return r ? r.config.title : code;
}
