export const WMO_CODES: Record<number, { emoji: string; label: string }> = {
  0: { emoji: '☀️', label: 'Clear sky' },
  1: { emoji: '🌤️', label: 'Mainly clear' },
  2: { emoji: '⛅', label: 'Partly cloudy' },
  3: { emoji: '☁️', label: 'Overcast' },
  45: { emoji: '🌫️', label: 'Fog' },
  48: { emoji: '🌫️', label: 'Depositing rime fog' },
  51: { emoji: '🌦️', label: 'Light drizzle' },
  53: { emoji: '🌦️', label: 'Moderate drizzle' },
  55: { emoji: '🌧️', label: 'Dense drizzle' },
  61: { emoji: '🌧️', label: 'Slight rain' },
  63: { emoji: '🌧️', label: 'Moderate rain' },
  65: { emoji: '🌧️', label: 'Heavy rain' },
  71: { emoji: '🌨️', label: 'Slight snow' },
  73: { emoji: '🌨️', label: 'Moderate snow' },
  75: { emoji: '❄️', label: 'Heavy snow' },
  77: { emoji: '🌨️', label: 'Snow grains' },
  80: { emoji: '🌦️', label: 'Slight showers' },
  81: { emoji: '🌧️', label: 'Moderate showers' },
  82: { emoji: '⛈️', label: 'Violent showers' },
  85: { emoji: '🌨️', label: 'Slight snow showers' },
  86: { emoji: '❄️', label: 'Heavy snow showers' },
  95: { emoji: '⛈️', label: 'Thunderstorm' },
  96: { emoji: '⛈️', label: 'Thunderstorm with hail' },
  99: { emoji: '⛈️', label: 'Heavy thunderstorm with hail' },
};

export function getWeatherCode(code: number): { emoji: string; label: string } {
  return WMO_CODES[code] ?? { emoji: '🌡️', label: 'Unknown' };
}
