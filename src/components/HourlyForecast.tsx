'use client';

import { getWeatherCode } from '@/lib/weather-codes';

interface HourlyItem {
  time: string;
  temp: number;
  prob: number;
  code: number;
}

interface HourlyForecastProps {
  hours: HourlyItem[];
  toDisplayTemp: (c: number) => string;
}

export default function HourlyForecast({ hours, toDisplayTemp }: HourlyForecastProps) {
  if (hours.length === 0) return null;

  const now = new Date();
  const MS_PER_HOUR = 3_600_000;

  return (
    <div className="card forecast-section">
      <div className="section-title">Next 24 Hours</div>
      <div className="hourly-scroll">
        {hours.map((h, i) => {
          const d = new Date(h.time);
          const isCurrent =
            i === 0 ||
            (d.getTime() - now.getTime() < MS_PER_HOUR &&
              d.getTime() >= now.getTime());
          const timeLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const { emoji } = getWeatherCode(h.code);

          return (
            <div
              key={h.time}
              className={`hourly-item${isCurrent ? ' current-hour' : ''}`}
              aria-label={`${timeLabel}: ${toDisplayTemp(h.temp)}`}
            >
              <span className="hourly-time">{timeLabel}</span>
              <span className="hourly-emoji" aria-hidden="true">{emoji}</span>
              <span className="hourly-temp">{toDisplayTemp(h.temp)}</span>
              {h.prob > 0 && (
                <span className="hourly-prob">💧{h.prob}%</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
