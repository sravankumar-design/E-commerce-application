import React, { useEffect, useState } from "react";
import axios from "axios";

function getWeatherDescription(code) {
  // Mapping based on Open-Meteo weather codes
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Fog";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([56, 57].includes(code)) return "Freezing drizzle";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([66, 67].includes(code)) return "Freezing rain";
  if ([71, 73, 75].includes(code)) return "Snowfall";
  if (code === 77) return "Snow grains";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if (code === 95) return "Thunderstorm";
  if ([96, 97, 98, 99].includes(code)) return "Thunderstorm with hail";
  return "Unknown conditions";
}

const Weather = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null); // { latitude, longitude }
  const [place, setPlace] = useState(null); // { name, country, admin1 }
  const [current, setCurrent] = useState(null); // { temperature, windspeed, weathercode, time }

  useEffect(() => {
    fetchCurrentLocationWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });

        try {
          const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
          const reverseUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`;

          const [weatherRes, reverseRes] = await Promise.all([
            axios.get(weatherUrl),
            axios.get(reverseUrl),
          ]);

          const cw = weatherRes?.data?.current_weather || null;
          setCurrent(cw);

          const firstPlace = reverseRes?.data?.results?.[0] || null;
          if (firstPlace) {
            setPlace({
              name: firstPlace.name,
              admin1: firstPlace.admin1,
              country: firstPlace.country,
            });
          } else {
            setPlace(null);
          }
        } catch (e) {
          setError("Failed to fetch weather data. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        const message =
          geoError.code === geoError.PERMISSION_DENIED
            ? "Location permission denied. Please allow access and retry."
            : geoError.message || "Unable to retrieve your location.";
        setError(message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const locationLabel = place
    ? [place.name, place.admin1, place.country].filter(Boolean).join(", ")
    : coords
    ? `${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}`
    : "";

  return (
    <div className="border border-4 border-warning p-3 mb-4 w-100">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="m-0">Your Local Weather</h2>
        <button className="btn btn-primary" onClick={fetchCurrentLocationWeather} disabled={loading}>
          {loading ? "Fetching..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}

      {!error && loading && (
        <div className="mt-3">Getting your location and weather...</div>
      )}

      {!loading && !error && current && (
        <div className="mt-3">
          <div className="fw-bold">{locationLabel}</div>
          <div className="mt-2">
            <div><span className="fw-bold">Temperature:</span> {current.temperature}°C</div>
            <div><span className="fw-bold">Wind:</span> {current.windspeed} km/h</div>
            <div><span className="fw-bold">Condition:</span> {getWeatherDescription(current.weathercode)}</div>
            <div className="text-muted">As of {current.time}</div>
          </div>
        </div>
      )}

      {!loading && !error && !current && (
        <div className="mt-3">Weather data not available yet.</div>
      )}
    </div>
  );
};

export default Weather;
