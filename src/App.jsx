// App.jsx
import React, { useEffect, useState } from 'react';
import RacecourseWeatherUI from './RacecourseWeatherUI';
import './index.css';

const racecourses = {
  tokyo: { name: '東京', lat: 35.6639, lon: 139.4846 },
  kyoto: { name: '京都', lat: 34.9086, lon: 135.7256 },
  niigata: { name: '新潟', lat: 37.9122, lon: 139.0615 },
};

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

function getDirection(deg) {
  const directions = ['北', '北北東', '北東', '東北東', '東', '東南東', '南東', '南南東', '南', '南南西', '南西', '西南西', '西', '西北西', '北西', '北北西'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

export default function App() {
  const [selected, setSelected] = useState('tokyo');
  const [weather, setWeather] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchWeather = () => {
    const { lat, lon } = racecourses[selected];
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=ja`)
      .then(res => res.json())
      .then(data => {
        setWeather({
          speed: data.wind?.speed,
          deg: data.wind?.deg,
          description: data.weather?.[0]?.description,
        });

        const now = new Date();
        const formatted = now.toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit'
        });
        setLastUpdated(formatted);
      })
      .catch(err => console.error("API fetch error:", err));
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 60000);
    return () => clearInterval(interval);
  }, [selected]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-xl font-bold mb-4">風見馬</h1>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-1">競馬場</label>
        <select
          className="w-full border p-2 rounded"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {Object.entries(racecourses).map(([id, rc]) => (
            <option key={id} value={id}>{rc.name}</option>
          ))}
        </select>
      </div>
      <RacecourseWeatherUI selected={selected} deg={weather?.deg} />

      {weather ? (
        <div className="bg-blue-50 p-4 rounded shadow mt-4">
          <p>風速: {weather.speed} m/s</p>
          <p>風向き: {getDirection(weather.deg)}（{weather.deg}°）</p>
          {weather.description && <p>天候: {weather.description}</p>}
          <p className="text-gray-500 text-sm mt-2">最終更新：{lastUpdated}</p>
        </div>
      ) : (
        <p>読み込み中...</p>
      )}
    </div>
  );
}
