// FormLauncher — ფორმის შევსების ერთიანი გამშვები ნებისმიერი გვერდიდან.
// კოდით თავად პოულობს კონფიგსა და PDF-რენდერერს (getFormConfig + getFormPdf) და ხსნის FormFillModal-ს.
// გამოყენება: <FormLauncher code="BE-FM-VISIT" initialCase={insp} label="ვიზიტის ჩანაწერი" />
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import FormFillModal from './FormFillModal';
import { getFormConfig } from '../utils/getFormConfig';
import { getFormPdf } from '../utils/formPdfMap';

const FormLauncher = ({ code, label, variant = 'outline-primary', size = 'sm', className = '',
  initialCase, initialStaff, initialByLabel, initialData, savedForm, onSaved }) => {
  const [show, setShow] = useState(false);
  const resolved = getFormConfig(code);
  if (!resolved) return null;
  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={() => setShow(true)}>
        {label || `📝 ${code}`}
      </Button>
      {show && (
        <FormFillModal
          show={show}
          onHide={() => setShow(false)}
          config={resolved.config}
          pdfComponent={getFormPdf(code)}
          pdfFileName={`${code} — ${resolved.config.title}`}
          formCode={code}
          initialCase={initialCase}
          initialStaff={initialStaff}
          initialByLabel={initialByLabel}
          initialData={initialData}
          savedForm={savedForm}
          onSaved={onSaved}
        />
      )}
    </>
  );
};

export default FormLauncher;
