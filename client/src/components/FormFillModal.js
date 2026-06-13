import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Modal, Button, Form, Row, Col, Nav, Tab, Badge } from 'react-bootstrap';
import { pdf } from '@react-pdf/renderer';
import SignaturePad from './SignaturePad';

// ── Auth helper ────────────────────────────────────────────────
const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ── Build sigs array ───────────────────────────────────────────
const buildSigs = (signers, sigsData) => {
  const today = new Date().toLocaleDateString('ka-GE');
  return signers.map((_, i) => {
    const sig = sigsData[i];
    if (sig && sig.dataURL)
      return { dataURL: sig.dataURL, name: sig.name || '', date: sig.date || today };
    return undefined;
  });
};

// ── Is this signer label an external party? ────────────────────
const isExternal = (label = '') =>
  /დამკვეთ|კლიენტ|კონტრაქტ|მომჩივ|მოწმე/i.test(label);

// ── Trimmed full name (იცავს ბოლო/დამატებითი probელებისგან — DAT გასუფთავება) ──
const fullName = (u) => [u.firstName, u.lastName].map(x => (x || '').trim()).filter(Boolean).join(' ');

// ── TableRows editor ───────────────────────────────────────────
const TableRowsEditor = ({ field, value, onChange, staffList = [] }) => {
  const minRows = field.minRows || 1;
  const rows = value && value.length > 0 ? value : Array.from({ length: minRows }, () => ({}));

  const update = (idx, colId, v) => {
    const newRows = rows.map((r, i) => i === idx ? { ...r, [colId]: v } : r);
    onChange(field.id, newRows);
  };
  const addRow = () => onChange(field.id, [...rows, {}]);
  const removeRow = (idx) => {
    if (rows.length <= minRows) return;
    onChange(field.id, rows.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {rows.map((row, idx) => (
        <div key={idx} className="border rounded p-2 mb-2" style={{ background: '#f8f9fa' }}>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <small className="text-muted fw-semibold" style={{ fontSize: '0.7rem' }}>მწკრივი {idx + 1}</small>
            {rows.length > minRows && (
              <Button size="sm" variant="outline-danger"
                style={{ fontSize: '0.65rem', padding: '1px 6px', lineHeight: 1 }}
                onClick={() => removeRow(idx)}>✕</Button>
            )}
          </div>
          <Row className="g-1">
            {field.columns.map(col => (
              <Col key={col.id} md={col.md || 6} xs={12}>
                <Form.Label className="small mb-0" style={{ fontSize: '0.68rem', color: '#555' }}>
                  {col.label}
                </Form.Label>
                {col.type === 'select' ? (
                  <Form.Select size="sm" value={row[col.id] || ''}
                    onChange={e => update(idx, col.id, e.target.value)}>
                    <option value="">—</option>
                    {col.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </Form.Select>
                ) : col.type === 'staff' ? (
                  <Form.Select size="sm" value={row[col.id] || ''}
                    onChange={e => update(idx, col.id, e.target.value)}>
                    <option value="">— თანამშრომელი —</option>
                    {staffList.map(u => {
                      const n = fullName(u);
                      return <option key={u._id} value={n}>{n}{u.position ? ` — ${u.position}` : ''}</option>;
                    })}
                  </Form.Select>
                ) : col.type === 'textarea' ? (
                  <Form.Control as="textarea" rows={2} size="sm" value={row[col.id] || ''}
                    onChange={e => update(idx, col.id, e.target.value)} />
                ) : (
                  <Form.Control size="sm" type={col.type || 'text'} value={row[col.id] || ''}
                    onChange={e => update(idx, col.id, e.target.value)} />
                )}
              </Col>
            ))}
          </Row>
        </div>
      ))}
      <Button size="sm" variant="outline-primary" className="w-100 mt-1"
        style={{ fontSize: '0.75rem' }} onClick={addRow}>
        + მწკრივის დამატება
      </Button>
    </div>
  );
};

// ── Field renderer ─────────────────────────────────────────────
const FieldInput = ({ field, value, onChange, staffList, inspectionList }) => {
  if (field.type === 'case') {
    return (
      <Form.Select size="sm" value={value || ''}
        onChange={e => onChange(field.id, e.target.value)}>
        <option value="">— საქმე (BE-CASE) — მონაცემები ავტომატურად ჩაიწერება —</option>
        {inspectionList.map(i => (
          <option key={i._id} value={i.inspectionNumber}>
            {i.inspectionNumber}
            {i.objectName ? ` — ${i.objectName}` : ''}
            {i.clientName ? ` (${i.clientName})` : ''}
          </option>
        ))}
      </Form.Select>
    );
  }
  if (field.type === 'staff') {
    return (
      <Form.Select size="sm" value={value || ''}
        onChange={e => onChange(field.id, e.target.value)}>
        <option value="">— აირჩიეთ თანამშრომელი —</option>
        {staffList.map(u => {
          const val   = fullName(u);
          const label = `${val}${u.position ? ` — ${u.position}` : ''}`;
          return <option key={u._id} value={val}>{label}</option>;
        })}
      </Form.Select>
    );
  }
  // multi-select პერსონალი — ჩამოსაშლელი ჩექბოქსებით (ერთი/რამდენიმე/ყველა); ინახება მძიმით გამოყოფილ სტრიქონად
  if (field.type === 'staffmulti') {
    const selected = (value || '').split(',').map(x => x.trim()).filter(Boolean);
    const allNames = staffList.map(fullName);
    const allSel = allNames.length > 0 && allNames.every(n => selected.includes(n));
    const toggle = (n) => {
      const next = selected.includes(n) ? selected.filter(x => x !== n) : [...selected, n];
      onChange(field.id, next.join(', '));
    };
    return (
      <div className="border rounded p-2" style={{ maxHeight: 170, overflowY: 'auto', background: '#f8f9fa' }}>
        {staffList.length === 0 && <div className="text-muted small">პერსონალი არ არის რეგისტრირებული</div>}
        {staffList.length > 0 && (
          <>
            <Form.Check type="checkbox" className="fw-bold" label="✓ ყველას მონიშვნა"
              checked={allSel} onChange={() => onChange(field.id, allSel ? '' : allNames.join(', '))} />
            <hr className="my-1" />
            {staffList.map(u => {
              const n = fullName(u);
              return <Form.Check key={u._id} type="checkbox"
                label={`${n}${u.position ? ` — ${u.position}` : ''}`}
                checked={selected.includes(n)} onChange={() => toggle(n)} />;
            })}
          </>
        )}
      </div>
    );
  }
  // multi-select პერსონალი → ცხრილის მწკრივები: თითო მონიშნული თანამშრომელი ცალკე მწკრივად,
  // ავტომატურად შევსებული პირადი ნომრითა და თანამდებობით (ინახება ობიექტების მასივად)
  if (field.type === 'staffrows') {
    const rows = Array.isArray(value) ? value : [];
    const rowOf = (u) => ({ _id: u._id, name: fullName(u), personalId: (u.personalId || '').trim(), position: (u.position || '').trim() });
    const isSel = (u) => rows.some(r => r._id === u._id);
    const toggle = (u) => onChange(field.id, isSel(u) ? rows.filter(r => r._id !== u._id) : [...rows, rowOf(u)]);
    const allSel = staffList.length > 0 && staffList.every(isSel);
    const sf = field.statusField; // არასავალდებულო: თითო მონიშნული მონაწილის სტატუსი (მაგ. კომპეტენცია)
    const setStatus = (id, v) => onChange(field.id, rows.map(r => r._id === id ? { ...r, [sf.id]: v } : r));
    return (
      <>
        <div className="border rounded p-2" style={{ maxHeight: 220, overflowY: 'auto', background: '#f8f9fa' }}>
          {staffList.length === 0 && <div className="text-muted small">პერსონალი არ არის რეგისტრირებული</div>}
          {staffList.length > 0 && (
            <>
              <Form.Check type="checkbox" className="fw-bold" label="✓ ყველას მონიშვნა"
                checked={allSel} onChange={() => onChange(field.id, allSel ? [] : staffList.map(rowOf))} />
              <hr className="my-1" />
              {staffList.map(u => (
                <Form.Check key={u._id} type="checkbox"
                  label={`${fullName(u)}${u.personalId ? ` — ${(u.personalId || '').trim()}` : ''}${u.position ? ` (${u.position})` : ''}`}
                  checked={isSel(u)} onChange={() => toggle(u)} />
              ))}
            </>
          )}
        </div>
        {sf && rows.length > 0 && (
          <div className="border rounded p-2 mt-2" style={{ background: '#fff' }}>
            <div className="fw-bold small mb-1" style={{ fontSize: '0.72rem' }}>{sf.label}</div>
            {rows.map(r => (
              <Row key={r._id} className="g-1 align-items-center mb-1">
                <Col xs={5}><span style={{ fontSize: '0.72rem' }}>{r.name}</span></Col>
                <Col xs={7}>
                  <Form.Select size="sm" value={r[sf.id] || ''} onChange={e => setStatus(r._id, e.target.value)}>
                    <option value="">— აირჩიეთ —</option>
                    {sf.options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
                  </Form.Select>
                </Col>
              </Row>
            ))}
          </div>
        )}
      </>
    );
  }
  if (field.type === 'tablerows')
    return <TableRowsEditor field={field} value={value} onChange={onChange} staffList={staffList} />;
  if (field.type === 'textarea')
    return (
      <Form.Control as="textarea" rows={3} size="sm" value={value || ''}
        onChange={e => onChange(field.id, e.target.value)} />
    );
  if (field.type === 'select')
    return (
      <Form.Select size="sm" value={value || ''}
        onChange={e => onChange(field.id, e.target.value)}>
        <option value="">—</option>
        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
      </Form.Select>
    );
  if (field.type === 'yesno')
    return (
      <div className="d-flex gap-3 pt-1">
        <Form.Check type="radio" label="კი"  checked={value === 'yes'} onChange={() => onChange(field.id, 'yes')} />
        <Form.Check type="radio" label="არა" checked={value === 'no'}  onChange={() => onChange(field.id, 'no')}  />
      </div>
    );
  if (field.type === 'multicheck')
    return (
      <div className="d-flex flex-wrap gap-3 pt-1">
        {field.options.map(o => (
          <Form.Check key={o} type="checkbox" label={o}
            checked={(value || []).includes(o)}
            onChange={() => {
              const arr = value || [];
              onChange(field.id, arr.includes(o) ? arr.filter(x => x !== o) : [...arr, o]);
            }}
          />
        ))}
      </div>
    );
  return (
    <Form.Control
      type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
      size="sm" placeholder={field.placeholder || ''} value={value || ''}
      onChange={e => onChange(field.id, e.target.value)}
    />
  );
};

// ── Staff signer block ─────────────────────────────────────────
const StaffSignerBlock = ({ label, index, sigsData, onSigChange, staffList }) => {
  const sig = sigsData[index] || {};
  const today = new Date().toISOString().split('T')[0];
  const [showManual, setShowManual] = useState(false);

  const sigRef = useRef(sig);
  sigRef.current = sig;
  const handlePad = useCallback((dataURL) => {
    onSigChange(index, { ...sigRef.current, dataURL });
  }, [index, onSigChange]);

  const setName = v => onSigChange(index, { ...sig, name: v });
  const setDate = v => onSigChange(index, { ...sig, date: v });

  const inStaffList = staffList.some(u => fullName(u) === sig.name);
  const manualMode = showManual || (sig.name && !inStaffList);

  return (
    <div className="rounded p-3 mb-3" style={{
      border: `2px solid ${sig.dataURL ? '#198754' : '#dee2e6'}`,
      background: sig.dataURL ? '#f0fff4' : '#fff',
    }}>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="fw-bold" style={{ fontSize: '0.84rem' }}>
          {sig.dataURL ? '✅' : '⬜'} {label}
        </span>
        {sig.dataURL && <Badge bg="success" style={{ fontSize: '0.6rem' }}>ხელმოწერილია</Badge>}
      </div>
      <Row className="g-2 mb-2">
        <Col md={7}>
          <Form.Label className="small mb-1">სახელი / გვარი</Form.Label>
          {!manualMode ? (
            <Form.Select size="sm" value={inStaffList ? sig.name : ''} onChange={e => {
              if (e.target.value === '__manual__') { setShowManual(true); setName(''); }
              else setName(e.target.value);
            }}>
              <option value="">— სიიდან —</option>
              {staffList.map(u => {
                const val = fullName(u);
                return <option key={u._id} value={val}>{val}{u.position ? ` — ${u.position}` : ''}</option>;
              })}
              <option value="__manual__">✏️ ხელით ჩაწერა…</option>
            </Form.Select>
          ) : (
            <div className="d-flex gap-1">
              <Form.Control size="sm" placeholder="სახელი გვარი" value={sig.name || ''}
                onChange={e => setName(e.target.value)} />
              <Button size="sm" variant="outline-secondary"
                style={{ whiteSpace: 'nowrap', fontSize: '0.7rem' }}
                onClick={() => { setShowManual(false); setName(''); }}>◀ სია</Button>
            </div>
          )}
        </Col>
        <Col md={5}>
          <Form.Label className="small mb-1">თარიღი</Form.Label>
          <Form.Control size="sm" type="date" value={sig.date || today}
            onChange={e => setDate(e.target.value)} />
        </Col>
      </Row>
      <SignaturePad onChange={handlePad} height={100} />
      {sig.dataURL && (
        <div className="text-center mt-2">
          <img src={sig.dataURL} alt="sig" style={{
            maxHeight: 42, border: '1px solid #dee2e6',
            borderRadius: 4, background: '#fff', padding: 3
          }} />
        </div>
      )}
    </div>
  );
};

// ── External signer block (client, contractor, witness) ────────
const ExternalSignerBlock = ({ label, index, sigsData, onSigChange, inspectionList }) => {
  const sig = sigsData[index] || {};
  const today = new Date().toISOString().split('T')[0];

  const sigRef = useRef(sig);
  sigRef.current = sig;
  const handlePad = useCallback((dataURL) => {
    onSigChange(index, { ...sigRef.current, dataURL });
  }, [index, onSigChange]);

  const setName = v => onSigChange(index, { ...sig, name: v });
  const setDate = v => onSigChange(index, { ...sig, date: v });

  const handleCasePick = caseNum => {
    if (!caseNum) return;
    const insp = inspectionList.find(i => i.inspectionNumber === caseNum);
    if (!insp) return;
    const autoName = insp.contactPerson || insp.clientName || '';
    onSigChange(index, { ...sig, name: autoName, caseNum });
  };

  return (
    <div className="rounded p-3 mb-3" style={{
      border: `2px solid ${sig.dataURL ? '#198754' : '#dee2e6'}`,
      background: sig.dataURL ? '#f0fff4' : '#fff',
    }}>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="fw-bold" style={{ fontSize: '0.84rem' }}>
          {sig.dataURL ? '✅' : '⬜'} {label}
        </span>
        {sig.dataURL && <Badge bg="success" style={{ fontSize: '0.6rem' }}>ხელმოწერილია</Badge>}
      </div>
      <Row className="g-2 mb-2">
        <Col md={12}>
          <Form.Label className="small mb-1">
            საქმიდან ავტო-შევსება <span className="text-muted">(კლიენტის სახელი ჩაჯდება)</span>
          </Form.Label>
          <Form.Select size="sm" value={sig.caseNum || ''} onChange={e => handleCasePick(e.target.value)}>
            <option value="">— BE-CASE (სახელი ავტომატურად ჩაიწერება) —</option>
            {inspectionList.map(i => (
              <option key={i._id} value={i.inspectionNumber}>
                {i.inspectionNumber}{i.clientName ? ` — ${i.clientName}` : ''}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Row className="g-2 mb-2">
        <Col md={7}>
          <Form.Label className="small mb-1">სახელი / გვარი (ან ხელით)</Form.Label>
          <Form.Control size="sm" placeholder="სახელი გვარი" value={sig.name || ''}
            onChange={e => setName(e.target.value)} />
        </Col>
        <Col md={5}>
          <Form.Label className="small mb-1">თარიღი</Form.Label>
          <Form.Control size="sm" type="date" value={sig.date || today}
            onChange={e => setDate(e.target.value)} />
        </Col>
      </Row>
      <SignaturePad onChange={handlePad} height={100} />
      {sig.dataURL && (
        <div className="text-center mt-2">
          <img src={sig.dataURL} alt="sig" style={{
            maxHeight: 42, border: '1px solid #dee2e6',
            borderRadius: 4, background: '#fff', padding: 3
          }} />
        </div>
      )}
    </div>
  );
};

// ── Main modal ─────────────────────────────────────────────────
const FormFillModal = ({ show, onHide, config, pdfComponent, pdfFileName, formCode }) => {
  const [formData,       setFormData]       = useState({});
  const [sigsData,       setSigsData]       = useState({});
  const [staffList,      setStaffList]      = useState([]);
  const [inspectionList, setInspectionList] = useState([]);
  const [gen,            setGen]            = useState(''); // PDF გენერაცია მხოლოდ ღილაკზე (on-demand — შეფერხების გარეშე)

  // Keep stable refs for auto-fill callbacks
  const inspListRef  = useRef([]);
  const configRef    = useRef(config);
  useEffect(() => { inspListRef.current  = inspectionList; }, [inspectionList]);
  useEffect(() => { configRef.current    = config;         }, [config]);

  useEffect(() => {
    if (!show) return;
    const h = { headers: authHeaders() };
    fetch('/api/users/staff', h)
      .then(r => r.ok ? r.json() : [])
      .then(d => setStaffList(Array.isArray(d) ? d : []))
      .catch(() => {});
    fetch('/api/inspections', h)
      .then(r => r.ok ? r.json() : [])
      .then(d => setInspectionList(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, [show]);

  // Field setter with case auto-fill support
  const setField = useCallback((id, val) => {
    setFormData(prev => {
      const next = { ...prev, [id]: val };
      const cfg = configRef.current;
      if (cfg?.caseAutoFill) {
        const allFields = (cfg.sections || []).flatMap(s => s.fields);
        const def = allFields.find(f => f.id === id);
        if (def?.type === 'case' && val) {
          const insp = inspListRef.current.find(i => i.inspectionNumber === val);
          if (insp) Object.assign(next, cfg.caseAutoFill(insp));
        }
      }
      return next;
    });
  }, []);

  const handleSigChange = useCallback((idx, sigObj) => {
    setSigsData(prev => ({ ...prev, [idx]: sigObj }));
  }, []);

  if (!config || !show) return null;

  const { signers = [], sections = [] } = config;

  const sigCount = Object.values(sigsData).filter(s => s && s.dataURL).length;

  // PDF გენერაცია მხოლოდ ღილაკზე დაჭერისას (არა ყოველ კლავიშზე) — შეფერხების აღმოფხვრა
  const downloadPdf = async (mode) => {
    setGen(mode);
    try {
      const data = mode === 'filled'
        ? { ...(config.buildData ? config.buildData(formData) : formData), sigs: buildSigs(signers, sigsData) }
        : { sigs: signers.map(() => undefined) };
      const blob = await pdf(React.cloneElement(pdfComponent, { data })).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pdfFileName}_${mode === 'filled' ? 'შევსებული' : 'ცარიელი'}.pdf`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (e) { console.error('PDF generation error:', e); }
    setGen('');
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static" scrollable>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-6">
          📝 {formCode} — {config.title}&nbsp;
          <Badge bg="info" style={{ fontSize: '0.65rem' }}>შევსება</Badge>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        <Tab.Container defaultActiveKey="fields">
          <Nav variant="tabs" className="mb-3" style={{ fontSize: '0.82rem' }}>
            <Nav.Item><Nav.Link eventKey="fields">📋 მონაცემები</Nav.Link></Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="sig">
                ✍️ ხელმოწერები
                {signers.length > 0 && (
                  <Badge bg={sigCount === signers.length ? 'success' : 'secondary'}
                    className="ms-1" style={{ fontSize: '0.6rem' }}>
                    {sigCount}/{signers.length}
                  </Badge>
                )}
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            {/* ── DATA TAB ── */}
            <Tab.Pane eventKey="fields">
              {sections.map(sec => (
                <div key={sec.label} className="mb-3">
                  <div className="fw-bold text-primary small mb-2 border-bottom pb-1">
                    {sec.label}
                  </div>
                  <Row className="g-2">
                    {sec.fields.map(field => {
                      const fullWidth = ['textarea','multicheck','tablerows','case','staffmulti','staffrows'].includes(field.type);
                      return (
                        <Col key={field.id} md={fullWidth ? 12 : 6}>
                          <Form.Label className="small fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>
                            {field.label}
                          </Form.Label>
                          <FieldInput
                            field={field}
                            value={formData[field.id]}
                            onChange={setField}
                            staffList={staffList}
                            inspectionList={inspectionList}
                          />
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              ))}
            </Tab.Pane>

            {/* ── SIGNATURE TAB ── */}
            <Tab.Pane eventKey="sig">
              <p className="small text-muted mb-3">
                <strong>ორგანიზაციის თანამშრომლები</strong> — სიიდან ამოირჩიეთ, ხელი მოაწერეთ.<br />
                <strong>გარე მხარეები</strong> (დამკვეთი, კონტრაქტორი) — საქმის ნომრიდან ავტო-შევსება ან ხელით.
              </p>
              {signers.length === 0 && (
                <p className="text-muted small">ამ ფორმას ხელმოწერის ველი არ აქვს.</p>
              )}
              {signers.map((lbl, i) =>
                isExternal(lbl)
                  ? <ExternalSignerBlock key={i} index={i} label={lbl}
                      sigsData={sigsData} onSigChange={handleSigChange}
                      inspectionList={inspectionList} />
                  : <StaffSignerBlock key={i} index={i} label={lbl}
                      sigsData={sigsData} onSigChange={handleSigChange}
                      staffList={staffList} />
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 gap-2">
        <Button variant="secondary" size="sm" onClick={onHide}>დახურვა</Button>
        <Button variant="outline-primary" size="sm" disabled={!!gen} onClick={() => downloadPdf('blank')}>
          {gen === 'blank' ? '⏳ მზადდება…' : '📄 ცარიელი ჩამოტვირთვა'}
        </Button>
        <Button variant="success" size="sm" disabled={!!gen} onClick={() => downloadPdf('filled')}>
          {gen === 'filled' ? '⏳ მზადდება…' : `📥 შევსებული ჩამოტვირთვა${sigCount > 0 ? ` (${sigCount} ✍️)` : ''}`}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormFillModal;
