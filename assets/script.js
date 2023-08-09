const apikey = "7761e5644bf2af39970d6760ed459312";

const fetchWeatherData = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data)
      return data;
    }
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
    <p>Temp: ${main.temp} F</p>
    <p>Humidity: ${main.humidity} %</p>
    <p>Wind Speed: ${wind.speed} mph</p>
  `;
};

const displayForecast = (data) => {
  const forecastEl = document.querySelector(".forecast");
  forecastEl.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const card = document.createElement("div");
    card.classList.add("five-day");
    const { city, list } = data;
    const { name } = city;
    const { dt, weather, main, wind } = list[i * 8 - 1];
    const iconUrl = `https://openweathermap.org/img/w/${weather[0].icon}.png`;
    const formattedDate = convertUnixTimestampToDate(dt);
    card.innerHTML += `
      <h3>${name} ${formattedDate}</h3>
      <img src="${iconUrl}" alt="Weather Icon">
      <p>Temp: ${main.temp} F</p>
      <p>Humidity: ${main.humidity} %</p>
      <p>Wind Speed: ${wind.speed} mph</p>
    `;
    forecastEl.append(card);
  }
};

const saveCityToLocalStorage = (city) => {
  const cities = JSON.parse(localStorage.getItem("cities")) || [];
  if (!cities.includes(city)) {
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
  }
};

const populateCityButtons = () => {
  const cities = JSON.parse(localStorage.getItem("cities")) || [];
  const historyEl = document.querySelector(".history");
  historyEl.innerHTML = "";
  cities.forEach((city) => {
    const cityButton = document.createElement("button");
    cityButton.textContent = city;
    cityButton.classList.add("city-button", "btn", "d-flex", "column", "btn-secondary", "mb-2");
    cityButton.addEventListener("click", () => {
      searchByCity(city);
    });
    historyEl.appendChild(cityButton);
  });
};

const searchByCity = async (city) => {
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

document.querySelector(".search button").addEventListener("click", () => {
  const city = document.querySelector(".search input").value;
  if (city) {
    handleSearch(city);
  }
});

document.querySelector(".clear").addEventListener("click", () => {
  localStorage.removeItem("cities");
  const historyEl = document.querySelector(".history");
  historyEl.innerHTML = "";
  console.clear();
  window.location.replace("index.html");
});

const handleSearch = async (city) => {
  const currentWeatherData = await fetchWeatherData(
    `https://api.openweathermap.org/data/2.5/weather?appid=${apikey}&q=${city}&units=imperial`
  );
  if (currentWeatherData) {
    displayCurrentWeather(currentWeatherData);
    const forecastData = await fetchWeatherData(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${currentWeatherData.coord.lat}&lon=${currentWeatherData.coord.lon}&units=imperial&appid=${apikey}`
    );
    if (forecastData) {
      displayForecast(forecastData);
      saveCityToLocalStorage(city);
      populateCityButtons();
    }
  }
};

populateCityButtons();