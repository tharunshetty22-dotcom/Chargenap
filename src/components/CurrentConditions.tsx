'use client';

import type { GeoLocation, ForecastData, TemperatureUnit } from '@/lib/types';
import { getWeatherCode } from '@/lib/weather-codes';

interface CurrentConditionsProps {
  location: GeoLocation;
  forecast: ForecastData;
  unit: TemperatureUnit;
  toDisplayTemp: (c: number) => string;
}

function windDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

export default function CurrentConditions({
  location,
  forecast,
  unit,
  toDisplayTemp,
}: CurrentConditionsProps) {
  const c = forecast.current;
  const { emoji, label } = getWeatherCode(c.weather_code);

  const updatedAt = new Date(forecast.fetchedAt);
  const timeStr = updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="card current-card">
      <div className="current-top">
        <div className="current-location">
          <h2>{location.name}</h2>
          <div className="country">
            {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
          </div>
        </div>
        <div className="current-main">
          <span className="current-emoji" aria-hidden="true">{emoji}</span>
          <div>
            <div className="current-temp">{toDisplayTemp(c.temperature_2m)}</div>
            <div className="current-desc">{label}</div>
          </div>
        </div>
      </div>

      <div className="current-details">
        <div className="detail-item">
          <span className="detail-label">Feels like</span>
          <span className="detail-value">{toDisplayTemp(c.apparent_temperature)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{c.relative_humidity_2m}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind</span>
          <span className="detail-value">
            {c.wind_speed_10m} km/h {windDirection(c.wind_direction_10m)}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Precipitation</span>
          <span className="detail-value">{c.precipitation} mm</span>
        </div>
      </div>

      <div className="last-updated">Last updated: {timeStr}</div>
    </div>
  );
}
