import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Toast, ToastContainer, Modal, Button } from 'react-bootstrap';

/**
 * Unified UI feedback layer (UX-003) — replaces native alert()/window.confirm().
 *
 * Provides:
 *   const { notify, confirm } = useFeedback();
 *   notify('გადაიწერა!', 'success');           // toast
 *   const ok = await confirm('წავშალოთ?');      // promise<boolean> modal
 *
 * A backward-compatible singleton is also exported (toast / confirmDialog) so
 * non-component code can trigger feedback, but components should use the hook.
 */

const FeedbackContext = createContext(null);

let externalNotify = null;   // set by provider for singleton access
let externalConfirm = null;

const VARIANT_BG = {
  success: 'success',
  danger: 'danger',
  error: 'danger',
  warning: 'warning',
  info: 'info',
};

export function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dialog, setDialog] = useState(null); // { message, title, confirmText, cancelText, variant }
  const resolverRef = useRef(null);
  const idRef = useRef(0);

  const notify = useCallback((message, variant = 'info', opts = {}) => {
    const id = ++idRef.current;
    const bg = VARIANT_BG[variant] || 'secondary';
    setToasts(prev => [...prev, { id, message: String(message), bg, delay: opts.delay || 4000 }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const confirm = useCallback((message, opts = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setDialog({
        message: String(message),
        title: opts.title || 'დადასტურება',
        confirmText: opts.confirmText || 'დიახ',
        cancelText: opts.cancelText || 'გაუქმება',
        variant: opts.variant || 'danger',
      });
    });
  }, []);

  const closeDialog = useCallback((result) => {
    setDialog(null);
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  }, []);

  // expose to singleton
  externalNotify = notify;
  externalConfirm = confirm;

  return (
    <FeedbackContext.Provider value={{ notify, confirm }}>
      {children}

      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1080 }}>
        {toasts.map(t => (
          <Toast
            key={t.id}
            bg={t.bg}
            onClose={() => removeToast(t.id)}
            delay={t.delay}
            autohide
          >
            <Toast.Body className={t.bg === 'warning' || t.bg === 'info' ? 'text-dark' : 'text-white'}>
              {t.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>

      <Modal show={!!dialog} onHide={() => closeDialog(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1.1rem' }}>{dialog?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ whiteSpace: 'pre-wrap' }}>{dialog?.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => closeDialog(false)}>
            {dialog?.cancelText}
          </Button>
          <Button variant={dialog?.variant || 'danger'} onClick={() => closeDialog(true)}>
            {dialog?.confirmText}
          </Button>
        </Modal.Footer>
      </Modal>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) {
    // Fallback so the hook never throws if used outside provider.
    return {
      notify: (m) => window.alert(m),
      confirm: (m) => Promise.resolve(window.confirm(m)),
    };
  }
  return ctx;
}

// Singleton helpers for non-hook contexts (best-effort).
export const toast = (message, variant) =>
  externalNotify ? externalNotify(message, variant) : window.alert(message);
export const confirmDialog = (message, opts) =>
  externalConfirm ? externalConfirm(message, opts) : Promise.resolve(window.confirm(message));
