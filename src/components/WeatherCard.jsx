import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Air from "../assets/Air.png";
import Humidity from "../assets/Humidity.png";
import { CiSearch } from "react-icons/ci";

export default function WeatherCard() {
  const [city, setCity] = useState("");
  const [apiData, setApidata] = useState({});
  const [darkMode, setDarkMode] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null); // <-- new

  const fetchApi = async (cityName = city) => {
    const searchCity = cityName || city;
    if (!searchCity) {
      toast.error("Please enter a city name.");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const res = await fetch(url);
      const fdata = await res.json();
      if (fdata.cod === "404") {
        toast.error("Please enter a valid city name.");
        return;
      }
      setApidata({
        temperature: Math.floor(fdata.main.temp),
        name: fdata.name,
        humidity: fdata.main.humidity,
        windSpeed: fdata.wind.speed,
        icon: fdata.weather[0].icon,
        description: fdata.weather[0].description,
        timezone: fdata.timezone, // <-- added
      });
      setLastUpdated(new Date()); // <-- added
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    fetchApi("Delhi");
  }, []);

  // compute city local time if timezone exists
  const getCityLocalTime = () => {
    if (apiData.timezone == null) return null;
    // OpenWeather gives timezone offset in seconds from UTC
    const utcMs = Date.now();
    const cityMs = utcMs + apiData.timezone * 1000;
    return new Date(cityMs);
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center px-4 py-6 overflow-auto ${
        darkMode
          ? "bg-gradient-to-br from-sky-950 via-indigo-900 to-purple-950 text-white"
          : "bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white"
      }`}
    >
      {/* Toggle Button */}
      <div className="w-full flex justify-end px-4 mb-4 sm:mb-6">
        <span
          onClick={() => setDarkMode(!darkMode)}
          className="cursor-pointer text-sm sm:text-base font-medium sm:font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/20 hover:bg-white/30 transition whitespace-nowrap"
        >
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 text-center tracking-wide drop-shadow-md">
        <i>
          Welcome to <span className="text-blue-400">WeatherWise</span>
        </i>
      </h1>

      {/* Search */}
      <div className="flex gap-2 sm:gap-3 mb-10 items-center bg-white/10 rounded-full px-4 py-2 shadow-lg w-full max-w-[400px]">
        <input
          type="text"
          name="city"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchApi();
          }}
          className="flex-grow bg-transparent focus:outline-none text-white placeholder-gray-300 text-base sm:text-lg"
        />
        <button
          onClick={() => fetchApi()}
          className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition"
        >
          <CiSearch size={24} />
        </button>
      </div>

      {/* Weather Icon */}
      <div className="mb-4 sm:mb-6 text-center">
        {apiData.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${apiData.icon}@2x.png`}
            alt="weather icon"
            className="w-28 h-28 sm:w-36 sm:h-36 animate-[bounce_2s_infinite]"
          />
        )}
        {apiData.description && (
          <p className="text-lg sm:text-xl text-white capitalize mt-2">
            {apiData.description}
          </p>
        )}
      </div>

      {/* Temperature & City */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-5xl sm:text-7xl font-bold text-yellow-300 drop-shadow-xl">
          {apiData.temperature}°C
        </h2>
        <h2 className="text-2xl sm:text-4xl mt-2 tracking-wider uppercase font-medium">
          {apiData.name}
        </h2>
      </div>

      {/* New: Local Time & Last Updated */}
      {apiData.name && (
        <div className="text-center mb-6 space-y-1">
          {getCityLocalTime() && (
            <div className="text-sm sm:text-base text-blue-200">
              Local Time:{" "}
              {getCityLocalTime().toLocaleString("en-IN", {
                timeStyle: "short",
                dateStyle: "medium",
              })}
            </div>
          )}
          {lastUpdated && (
            <div className="text-xs sm:text-sm text-gray-200/80">
              Last Updated: {lastUpdated.toLocaleTimeString("en-IN")}
            </div>
          )}
        </div>
      )}

      {/* Humidity & Wind */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl px-4 sm:px-6">
        <div className="flex items-center gap-4 bg-white/10 px-5 py-4 sm:px-6 sm:py-5 rounded-2xl shadow-lg backdrop-blur-sm">
          <img src={Humidity} alt="Humidity" className="w-8 h-8 sm:w-10 sm:h-10" />
          <div>
            <h3 className="text-lg sm:text-xl font-medium">Humidity</h3>
            <p className="text-base sm:text-lg text-blue-200">
              {apiData.humidity}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white/10 px-5 py-4 sm:px-6 sm:py-5 rounded-2xl shadow-lg backdrop-blur-sm">
          <img src={Air} alt="Wind Speed" className="w-8 h-8 sm:w-10 sm:h-10" />
          <div>
            <h3 className="text-lg sm:text-xl font-medium">Wind Speed</h3>
            <p className="text-base sm:text-lg text-blue-200">
              {apiData.windSpeed} m/s
            </p>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={2000} theme="dark" />
    </div>
  );
}
