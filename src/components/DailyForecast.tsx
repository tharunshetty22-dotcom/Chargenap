'use client';

import type { DailyWeather } from '@/lib/types';
import { getWeatherCode } from '@/lib/weather-codes';

interface DailyForecastProps {
  daily: DailyWeather;
  toDisplayTemp: (c: number) => string;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DailyForecast({ daily, toDisplayTemp }: DailyForecastProps) {
  return (
    <div className="card forecast-section">
      <div className="section-title">7-Day Forecast</div>
      <div className="daily-grid">
        {daily.time.map((dateStr, i) => {
          const [year, month, day] = dateStr.split('-').map(Number);
          const date = new Date(year, month - 1, day);
          const dayName = DAY_NAMES[date.getDay()];
          const { emoji, label } = getWeatherCode(daily.weather_code[i]);
          const isToday = i === 0;

          return (
            <div key={dateStr} className="daily-item">
              <span className="daily-day">{isToday ? 'Today' : dayName}</span>
              <span className="daily-emoji" aria-hidden="true">{emoji}</span>
              <span className="daily-desc">{label}</span>
              <div className="daily-temps">
                <span className="daily-high">{toDisplayTemp(daily.temperature_2m_max[i])}</span>
                <span className="daily-low">{toDisplayTemp(daily.temperature_2m_min[i])}</span>
              </div>
              {daily.precipitation_sum[i] > 0 && (
                <span className="daily-precip">💧 {daily.precipitation_sum[i].toFixed(1)} mm</span>
              )}
              <span className="daily-wind">💨 {daily.wind_speed_10m_max[i]} km/h</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
