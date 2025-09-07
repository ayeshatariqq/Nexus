import React, { useMemo } from 'react';

export type Strength = 0 | 1 | 2 | 3 | 4;

function scorePassword(pw: string): { score: Strength; label: string; hints: string[] } {
  if (!pw) return { score: 0, label: 'Very weak', hints: ['Use at least 8 characters'] };

  const hints: string[] = [];
  let score = 0 as Strength;

  const lengthOK = pw.length >= 8;
  const lower = /[a-z]/.test(pw);
  const upper = /[A-Z]/.test(pw);
  const number = /\d/.test(pw);
  const symbol = /[^A-Za-z0-9]/.test(pw);

  const checks = [lengthOK, lower, upper, number, symbol];
  score = Math.min(checks.filter(Boolean).length as Strength, 4);

  if (!lengthOK) hints.push('Use at least 8 characters');
  if (!upper) hints.push('Add uppercase letters');
  if (!lower) hints.push('Add lowercase letters');
  if (!number) hints.push('Add numbers');
  if (!symbol) hints.push('Add a special character');

  const labelMap: Record<Strength, string> = {
    0: 'Very weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Strong',
    4: 'Very strong',
  };

  return { score, label: labelMap[score], hints };
}

export const PasswordStrengthMeter: React.FC<{ password: string }> = ({ password }) => {
  const { score, label, hints } = useMemo(() => scorePassword(password), [password]);

  return (
    <div className="mt-2">
      <div className="flex gap-1 h-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex-1 rounded ${i < score ? 'bg-green-500' : 'bg-gray-200'}`}
            style={{ transition: 'background-color 150ms ease' }}
          />
        ))}
      </div>
      <div className="text-sm mt-1">
        <span className="font-medium">Strength:</span> {label}
      </div>
      {hints.length > 0 && (
        <ul className="text-xs mt-1 list-disc ml-5 text-gray-600">
          {hints.slice(0, 3).map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
