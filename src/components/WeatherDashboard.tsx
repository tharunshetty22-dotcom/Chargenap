'use client';

import { useState, useEffect, useCallback } from 'react';
import type { GeoLocation, ForecastData, TemperatureUnit } from '@/lib/types';
import { fetchForecast } from '@/lib/api';
import { getCached, setCached, LOCATION_KEY, UNIT_KEY } from '@/lib/cache';
import SearchBar from './SearchBar';
import UnitToggle from './UnitToggle';
import CurrentConditions from './CurrentConditions';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';

export function toDisplayTemp(celsius: number, unit: TemperatureUnit): string {
  if (unit === 'F') return `${Math.round(celsius * 9 / 5 + 32)}°F`;
  return `${Math.round(celsius)}°C`;
}

export default function WeatherDashboard() {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load persisted state on mount
  useEffect(() => {
    const savedUnit = getCached<TemperatureUnit>(UNIT_KEY);
    if (savedUnit) setUnit(savedUnit);

    const savedLocation = getCached<GeoLocation>(LOCATION_KEY);
    if (savedLocation) setLocation(savedLocation);
  }, []);

  const loadForecast = useCallback(async (loc: GeoLocation) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchForecast(loc.latitude, loc.longitude);
      setForecast(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load forecast.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch forecast when location changes
  useEffect(() => {
    if (!location) return;
    loadForecast(location);
    setCached(LOCATION_KEY, location, 7 * 24 * 60 * 60 * 1000); // 7 days
  }, [location, loadForecast]);

  const handleUnitChange = (u: TemperatureUnit) => {
    setUnit(u);
    setCached(UNIT_KEY, u, 365 * 24 * 60 * 60 * 1000);
  };

  const display = (c: number) => toDisplayTemp(c, unit);

  // Filter hourly data to next 24 hours
  const next24h = forecast
    ? (() => {
        const now = new Date();
        const cutoff = new Date(now.getTime() + 24 * 3600 * 1000);
        return forecast.hourly.time
          .map((t, i) => ({
            time: t,
            temp: forecast.hourly.temperature_2m[i],
            prob: forecast.hourly.precipitation_probability[i],
            code: forecast.hourly.weather_code[i],
          }))
          .filter(h => {
            const d = new Date(h.time);
            return d >= now && d <= cutoff;
          });
      })()
    : [];

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">🌤 Weather Dashboard</h1>
        <SearchBar onSelect={setLocation} />
        <UnitToggle unit={unit} onChange={handleUnitChange} />
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && (
        <div className="center-state">
          <div className="spinner" aria-label="Loading" />
          <span>Loading forecast…</span>
        </div>
      )}

      {!loading && !location && (
        <div className="center-state">
          <span className="empty-icon">🌍</span>
          <p className="empty-hint">Search for a city above to see current weather and forecasts.</p>
        </div>
      )}

      {!loading && forecast && location && (
        <>
          <CurrentConditions
            location={location}
            forecast={forecast}
            unit={unit}
            toDisplayTemp={display}
          />
          <HourlyForecast hours={next24h} toDisplayTemp={display} />
          <DailyForecast daily={forecast.daily} toDisplayTemp={display} />
        </>
      )}
    </main>
  );
}
