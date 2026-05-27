import React from 'react';
import { Modal, Button, Badge, Accordion } from 'react-bootstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FORM_INSTRUCTIONS } from './instructionData';
import InstructionsPdf from '../pdf-components/InstructionsPdf';

// ── colour helpers ───────────────────────────────────────────────────
const bsToHex = {
  primary: '#0d6efd', secondary: '#6c757d', success: '#198754',
  danger:  '#dc3545', warning:  '#fd7e14', info:    '#0dcaf0',
};

const InstructionModal = ({ show, onHide, instrKey, color = 'primary' }) => {
  const instrData = FORM_INSTRUCTIONS[instrKey];
  const accentHex = bsToHex[color] || bsToHex.primary;

  if (!instrData) return null;

  const meta = [
    { label: '✍️ შემავსებელი', value: instrData.filledBy },
    { label: '📅 შევსების დრო', value: instrData.when },
    { label: '🗂️ შენახვა',     value: instrData.retention },
    { label: '📌 ISO მინ.',    value: instrData.isoRef },
  ];

  return (
    <Modal show={show} onHide={onHide} size="lg" scrollable>
      {/* ── header ── */}
      <Modal.Header
        closeButton
        style={{ backgroundColor: accentHex, color: '#fff', borderBottom: 'none' }}
      >
        <Modal.Title className="d-flex align-items-center gap-2" style={{ fontSize: '1rem' }}>
          <span>📋</span>
          <span>შევსების ინსტრუქცია</span>
          <Badge bg="light" text="dark" style={{ fontSize: '0.75rem' }}>{instrKey}</Badge>
        </Modal.Title>
      </Modal.Header>

      {/* ── subtitle strip ── */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '8px 20px', borderBottom: '1px solid #dee2e6' }}>
        <div className="fw-semibold text-dark small">{instrData.title}</div>
        <div className="d-flex flex-wrap gap-3 mt-1">
          {meta.map(m => m.value ? (
            <span key={m.label} className="text-muted" style={{ fontSize: '0.72rem' }}>
              <span className="fw-bold">{m.label}:</span> {m.value}
            </span>
          ) : null)}
        </div>
      </div>

      <Modal.Body style={{ padding: '16px 20px' }}>

        {/* ── purpose box ── */}
        {instrData.purpose && (
          <div
            className="mb-3 p-3"
            style={{
              backgroundColor: '#f0f4fa',
              borderLeft: `4px solid ${accentHex}`,
              borderRadius: 4,
            }}
          >
            <div className="fw-bold mb-1" style={{ fontSize: '0.78rem', color: accentHex }}>
              📄 დოკუმენტის დანიშნულება
            </div>
            <p className="mb-0" style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>
              {instrData.purpose}
            </p>
          </div>
        )}

        {/* ── legend ── */}
        <div className="d-flex gap-3 mb-3" style={{ fontSize: '0.72rem' }}>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 5, backgroundColor: '#dc3545', marginRight: 4 }} />სავალდებულო</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 5, backgroundColor: '#adb5bd', marginRight: 4 }} />სურვილისამებრ</span>
        </div>

        {/* ── sections accordion ── */}
        <Accordion defaultActiveKey="0" flush>
          {(instrData.sections || []).map((sec, secIdx) => (
            <Accordion.Item key={secIdx} eventKey={String(secIdx)}>
              <Accordion.Header>
                <span className="fw-bold" style={{ fontSize: '0.82rem', color: accentHex }}>
                  {sec.title}
                </span>
              </Accordion.Header>
              <Accordion.Body style={{ padding: '10px 14px' }}>
                {(sec.fields || []).map((f, fIdx) => (
                  <div
                    key={fIdx}
                    className="mb-3 pb-2"
                    style={{
                      borderLeft: `3px solid ${f.required ? '#dc3545' : '#ced4da'}`,
                      paddingLeft: 10,
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-bold" style={{ fontSize: '0.82rem', color: '#212529' }}>
                        {f.field}
                      </span>
                      {f.required
                        ? <Badge bg="danger" style={{ fontSize: '0.6rem' }}>სავ.</Badge>
                        : <Badge bg="secondary" style={{ fontSize: '0.6rem' }}>სურ.</Badge>
                      }
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#444',
                        lineHeight: 1.7,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {f.instruction}
                    </div>
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Modal.Body>

      {/* ── footer ── */}
      <Modal.Footer style={{ backgroundColor: '#f8f9fa' }}>
        <PDFDownloadLink
          document={<InstructionsPdf instrData={instrData} code={instrKey} />}
          fileName={`ინსტრუქცია_${instrKey}.pdf`}
          style={{ textDecoration: 'none' }}
        >
          {({ loading }) => (
            <Button variant={color} size="sm" disabled={loading}>
              {loading ? '⏳ მომზ...' : '🖨️ ინსტრ. PDF ჩამოტვ.'}
            </Button>
          )}
        </PDFDownloadLink>
        <Button variant="outline-secondary" size="sm" onClick={onHide}>
          დახურვა
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InstructionModal;
