const apikey = "7761e5644bf2af39970d6760ed459312";

const handleSearch = async () => {
  const city = document.querySelector(".search input").value;
  if (!city) return;
  const currentWeatherData = await fetchWeatherData(
    `https://api.openweathermap.org/data/2.5/weather?appid=${apikey}&q=${city}&units=imperial`
  );
  if (currentWeatherData) {
    displayCurrentWeather(currentWeatherData);
    const forecastData = await fetchWeatherData(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${currentWeatherData.coord.lat}&lon=${currentWeatherData.coord.lon}&units=imperial&appid=${apikey}`
    );
    if (forecastData) displayForecast(forecastData);
  }
};

const fetchWeatherData = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) return await response.json();
    throw new Error("Network response was not ok.");
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

const convertUnixTimestampToDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const displayCurrentWeather = (data) => {
  const { name, dt, weather, main, wind } = data;
  const iconUrl = `https://openweathermap.org/img/w/${weather[0].icon}.png`;
  const formattedDate = convertUnixTimestampToDate(dt);
  const currentEl = document.querySelector(".current");
  currentEl.innerHTML = `
    <h2>${name} ${formattedDate}</h2>
    <img src="${iconUrl}" alt="Weather Icon">
    <p>temperature: ${main.temp} F</p>
    <p>humidity: ${main.humidity} %</p>
    <p>wind speed: ${wind.speed} mph</p>
  `;
};

const displayForecast = (data) => {
  const forecastEl = document.querySelector(".forecast");
  forecastEl.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const { city, list } = data;
    const { name } = city;
    const { dt, weather, main, wind } = list[i * 8];
    const iconUrl = `https://openweathermap.org/img/w/${weather[0].icon}.png`;
    const formattedDate = convertUnixTimestampToDate(dt);
    forecastEl.innerHTML += `
      <h3>${name} ${formattedDate}</h3>
      <img src="${iconUrl}" alt="Weather Icon">
      <p>temperature: ${main.temp} F</p>
      <p>humidity: ${main.humidity} %</p>
      <p>wind speed: ${wind.speed} mph</p>
    `;
  }
};

document.querySelector(".search button").addEventListener("click", handleSearch);
