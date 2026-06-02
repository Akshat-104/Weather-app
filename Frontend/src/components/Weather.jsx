import React, { useState } from 'react'
import SearchBar from './SearchBar'
import axios from "axios";
import WeatherCard from './WeatherCard';
import video from './video.mp4';
import ErrorPage from './ErrorPage';
import { useNavigate } from 'react-router-dom';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);   // 👈 toggle state
  const navigate = useNavigate();

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = `https://api.openweathermap.org/data/2.5/weather`;

  const fetchWeather = async (city) => {
    setLoading(true);
    setError('');
    try {
      const url = `${API_URL}?q=${city}&units=metric&appid=${API_KEY}`;
      const response = await axios.get(url);
      setWeather(response.data);

      // Save city to backend history
      await axios.post(`${import.meta.env.VITE_API_URL}/api/history`, { city, userId: 1 });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('City not found, Please Try Again.');
      } else {
        setError("An error occurred");
      }
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleHistory = async () => {
    if (!showHistory) {
      // Only fetch when showing
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/history`, { params: { userId: 1 } });
      setHistory(res.data);
    }
    setShowHistory(!showHistory);   // 👈 toggle on/off
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-blue-100 relative overflow-hidden'>
      <video className='absolute top-0 left-0 w-full h-full object-cover' autoPlay loop muted>
        <source src={video} type='video/mp4'/>
      </video>
      <div className='bg-black/70 text-white rounded-lg shadow-lg p-8 max-w-md w-full z-10'>
        <h1 className='text-3xl font-bold text-center mb-4'>Weather App</h1>

        <SearchBar fetchWeather={fetchWeather}/>
        {loading && <p className='text-center mt-4'>...Loading</p>}
        {error && <ErrorPage/>}
        {weather && <WeatherCard weather={weather} />}

        <div className='flex justify-center items-center mt-4'>
          <button
            onClick={toggleHistory}
            className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
          >
            {showHistory ? "Hide History" : "Show History"}   {/* 👈 dynamic label */}
          </button>
        </div>

        {showHistory && history.length > 0 && (   // 👈 only render when toggled on
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Search History</h2>
            <ul>
              {history.map((h) => (
                <li key={h.id}>{h.city}</li>
              ))}
            </ul>
          </div>
        )}

        <div className='flex justify-center items-center mt-4'>
          <button
            onClick={handleLogout}
            className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Weather;