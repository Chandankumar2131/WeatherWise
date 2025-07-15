import React, { useEffect, useState } from "react";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Air from "../assets/Air.png";
import Humidity from "../assets/Humidity.png";
import { CiSearch } from "react-icons/ci";

export default function WeatherCard() {
  const [city, setCity] = useState("");
  const [apiData, setApidata] = useState({});

  const fetchApi = async (cityName = city) => {
    const searchCity = cityName || city;
    if (!searchCity) {
      toast.error("Please enter a city name.");
;
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const res = await fetch(url);
      const fdata = await res.json();
      if (fdata.cod === "404") {
      toast.error("Please enter a valid city name."); ;
        return;
      }
      setApidata({
        temperature: Math.floor(fdata.main.temp),
        name: fdata.name,
        humidity: fdata.main.humidity,
        windSpeed: fdata.wind.speed,
        icon:fdata.weather[0].icon,
        description: fdata.weather[0].description,
      });

      console.log(fdata.name);
    } catch (error) {
      console.log(error);
     toast.error("Something went wrong. Please try again later."); 
    }
  };

  useEffect(() => {
    fetchApi("Delhi");
  }, []);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-sky-950 via-indigo-900 to-purple-950 text-white flex flex-col items-center px-4 py-8 overflow-auto">
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center tracking-wide drop-shadow-md">
        <i>
          Welcome to <span className="text-blue-400">WeatherWise</span>
        </i>
      </h1>

      {/* Search */}
      <div className="flex gap-3 mb-12 items-center bg-white/10 rounded-full px-4 py-2 shadow-lg w-80 sm:w-[400px]">
        <input
          type="text"
          name="city"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
    if (e.key === "Enter") fetchApi();
  }}
          className="flex-grow bg-transparent focus:outline-none text-white placeholder-gray-300 text-lg"
        />
        <button
          onClick={() => fetchApi()}
          className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition"
        >
          <CiSearch size={24} />
        </button>
      </div>

      {/* Weather Icon */}
      <div className="mb-6">
       {apiData.icon && (
  <img
    src={`https://openweathermap.org/img/wn/${apiData.icon}@2x.png`}
    alt="weather icon"
    className="w-36 h-36 animate-[bounce_2s_infinite]"
  />
)}
{apiData.description && (
  <p className="text-xl text-white capitalize text-center mb-4">
    {apiData.description}
  </p>
)}

      </div>

      {/* Temperature & City */}
      <div className="text-center mb-10">
        <h2 className="text-6xl sm:text-7xl font-bold text-yellow-300 drop-shadow-xl">
          {apiData.temperature}°C
        </h2>
        <h2 className="text-3xl sm:text-4xl mt-2 tracking-wider uppercase font-medium">
          {apiData.name}
        </h2>
      </div>

      {/* Humidity & Wind */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-xl px-6">
        <div className="flex items-center gap-4 bg-white/10 px-6 py-5 rounded-2xl shadow-lg backdrop-blur-sm">
          <img src={Humidity} alt="Humidity" className="w-10 h-10" />
          <div>
            <h3 className="text-xl font-medium">Humidity</h3>
            <p className="text-lg text-blue-200">{apiData.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white/10 px-6 py-5 rounded-2xl shadow-lg backdrop-blur-sm">
          <img src={Air} alt="Wind Speed" className="w-10 h-10" />
          <div>
            <h3 className="text-xl font-medium">Wind Speed</h3>
            <p className="text-lg text-blue-200">{apiData.windSpeed} m/s</p>
          </div>
        </div>
      </div>
    </div>
  );

}
