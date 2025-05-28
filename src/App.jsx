import { useState, useEffect } from 'react';
import { racecourses } from './racecourses';

function App() {
  const [selected, setSelected] = useState('tokyo');
  const [weather, setWeather] = useState(null);

  useEffect(() => {
 const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const fetchWeather = () => {
      const { lat, lon } = racecourses[selected];
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=ja`)
        .then(res => res.json())
        .then(data =>
          setWeather({
            speed: data.wind?.speed,
            deg: data.wind?.deg,
            description: data.weather?.[0]?.description,
          })
        )
        .catch(err => console.error("API fetch error:", err));
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 60000);
    return () => clearInterval(interval);
  }, [selected]);

  const getDirection = (deg) => {
    if (deg > 337.5 || deg <= 22.5) return "北";
    else if (deg <= 67.5) return "北東";
    else if (deg <= 112.5) return "東";
    else if (deg <= 157.5) return "南東";
    else if (deg <= 202.5) return "南";
    else if (deg <= 247.5) return "南西";
    else if (deg <= 292.5) return "西";
    else return "北西";
  };

  const selectedCourse = racecourses[selected];
  const trueDirection = weather?.deg != null
    ? (weather.deg + (selectedCourse.northOffset || 0)) % 360
    : 0;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">赤い矢印の方向へ風が吹いています</h1>
      <h1 className="text-xl font-bold mb-4">競馬場の選択</h1>

      <select
        className="w-full p-2 border rounded mb-4"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        {Object.entries(racecourses).map(([id, rc]) => (
          <option key={id} value={id}>
            {rc.name}
          </option>
        ))}
      </select>

      <div className="bg-white p-4 shadow rounded mb-4">
        <p>選択中：<strong>{selectedCourse.name}</strong></p>
        <p>緯度: {selectedCourse.lat}</p>
        <p>経度: {selectedCourse.lon}</p>
      </div>

      <div className="relative mb-4">
        <img
          src={selectedCourse.image}
          alt={`${selectedCourse.name}のコース図`}
          className="w-full h-auto border rounded"
        />
        {weather?.deg != null && (
          <svg
            className="absolute top-4 right-4 w-16 h-16"
            style={{ transform: `rotate(${trueDirection}deg)` }}
            viewBox="0 0 100 100"
            title={`風向き：${getDirection(weather.deg)}（${weather.deg}°）`}
          >
            <circle cx="50" cy="50" r="45" stroke="#3b82f6" strokeWidth="4" fill="white" />
            <polygon points="50,5 35,30 65,30" fill="#ef4444" />
            <line x1="50" y1="30" x2="50" y2="50" stroke="#ef4444" strokeWidth="4" />
            <text x="48" y="12" fontSize="8" fill="#333">*</text>
            <text x="88" y="52" fontSize="8" fill="#333">*</text>
            <text x="48" y="92" fontSize="8" fill="#333">*</text>
            <text x="8"  y="52" fontSize="8" fill="#333">*</text>
          </svg>
        )}
      </div>

      {weather ? (
        <div className="bg-blue-50 p-4 rounded shadow">
          <p className="text-lg font-bold">風速・風向・天気</p>
          <p>風速: {weather.speed} m/s</p>
          <p>風向き: {getDirection(weather.deg)}（{weather.deg}°）</p>
          {weather.description && <p>天候: {weather.description}</p>}
        </div>
      ) : (
        <p>読み込み中...</p>
      )}
    </div>
  );
}

export default App;
