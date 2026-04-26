'use client';

import type { TemperatureUnit } from '@/lib/types';

interface UnitToggleProps {
  unit: TemperatureUnit;
  onChange: (u: TemperatureUnit) => void;
}

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div className="unit-toggle" role="group" aria-label="Temperature unit">
      <button
        className={`unit-btn${unit === 'C' ? ' active' : ''}`}
        onClick={() => onChange('C')}
        aria-pressed={unit === 'C'}
      >
        °C
      </button>
      <button
        className={`unit-btn${unit === 'F' ? ' active' : ''}`}
        onClick={() => onChange('F')}
        aria-pressed={unit === 'F'}
      >
        °F
      </button>
    </div>
  );
}
