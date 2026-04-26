import type { GeoLocation, ForecastData } from './types';
import { getCached, setCached } from './cache';

export async function searchLocations(query: string): Promise<GeoLocation[]> {
  if (!query.trim()) return [];
  const cacheKey = `geo_${query.toLowerCase().trim()}`;
  const cached = getCached<GeoLocation[]>(cacheKey);
  if (cached) return cached;

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch locations');
  const data = await res.json();
  const results: GeoLocation[] = data.results ?? [];
  setCached(cacheKey, results, 60 * 60 * 1000); // 1 hour for geo
  return results;
}

export async function fetchForecast(lat: number, lon: number): Promise<ForecastData> {
  const cacheKey = `forecast_${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const cached = getCached<ForecastData>(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
    hourly: 'temperature_2m,precipitation_probability,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max',
    timezone: 'auto',
    forecast_days: '7',
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error('Failed to fetch forecast');
  const data = await res.json();
  const result: ForecastData = { ...data, fetchedAt: Date.now() };
  setCached(cacheKey, result);
  return result;
}
