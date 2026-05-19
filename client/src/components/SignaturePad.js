import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from 'react-bootstrap';

const SignaturePad = ({ onChange, width = 380, height = 130 }) => {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [isEmpty, setIsEmpty] = useState(true);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const start = useCallback((e) => {
    e.preventDefault();
    drawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }, []);

  const draw = useCallback((e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsEmpty(false);
  }, []);

  const stop = useCallback(() => {
    if (!drawing.current) return;
    drawing.current = false;
    const dataURL = canvasRef.current.toDataURL('image/png');
    onChange(dataURL);
  }, [onChange]);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onChange(null);
  }, [onChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stop, { passive: false });
    return () => {
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stop);
    };
  }, [start, draw, stop]);

  return (
    <div>
      <div style={{
        border: '1.5px solid #adb5bd',
        borderRadius: 6,
        background: '#fdfdff',
        cursor: 'crosshair',
        touchAction: 'none',
        position: 'relative',
        display: 'inline-block',
        width: '100%',
      }}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ display: 'block', width: '100%', height: height }}
          onMouseDown={start}
          onMouseMove={draw}
          onMouseUp={stop}
          onMouseLeave={stop}
        />
        {isEmpty && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ccc', fontSize: 13, pointerEvents: 'none', fontStyle: 'italic',
          }}>
            ✍️ ხელმოწერა აქ
          </div>
        )}
      </div>
      <div className="d-flex justify-content-between align-items-center mt-1">
        <small className="text-muted">მაუსით ან სენსორული ეკრანით</small>
        <Button size="sm" variant="outline-secondary" onClick={clear} disabled={isEmpty} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
          🗑 გასუფთავება
        </Button>
      </div>
    </div>
  );
};

export default SignaturePad;
