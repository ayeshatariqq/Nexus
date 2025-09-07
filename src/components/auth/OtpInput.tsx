import React, { useEffect, useRef, useState } from 'react';

interface Props {
  length?: number;
  onComplete?: (code: string) => void;
  disabled?: boolean;
}

export const OtpInput: React.FC<Props> = ({ length = 6, onComplete, disabled }) => {
  const [values, setValues] = useState<string[]>(() => Array(length).fill(''));
  const refs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (values.every((v) => v !== '')) {
      onComplete?.(values.join(''));
    }
  }, [values, onComplete]);

  const setDigit = (idx: number, val: string) => {
    const v = val.replace(/[^0-9]/g, '').slice(0, 1);
    setValues((prev) => {
      const next = [...prev];
      next[idx] = v;
      return next;
    });
    if (v && idx < length - 1) refs.current[idx + 1]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !values[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
      setValues((prev) => {
        const next = [...prev];
        next[idx - 1] = '';
        return next;
      });
    }
    if (e.key === 'ArrowLeft' && idx > 0) refs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < length - 1) refs.current[idx + 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!paste) return;
    e.preventDefault();
    setValues(paste.split(''));
    refs.current[Math.min(paste.length, length) - 1]?.focus();
  };

  return (
    <div className="flex gap-2">
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          value={v}
          disabled={disabled}
          inputMode="numeric"
          maxLength={1}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(e, i)}
          onPaste={onPaste}
          className="w-10 h-12 text-center text-lg border rounded"
        />
      ))}
    </div>
  );
};
