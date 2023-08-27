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

const displayDay = (timestamp) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date(timestamp * 1000);
  const dayOfWeek = daysOfWeek[date.getDay()];
  return dayOfWeek;
};

const capitalizeWords = (inputString) => {
  return inputString.split(' ').map(word => {
    if (word.length === 0) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
};

const displayCurrentWeather = (data) => {
  const { name, weather, main, wind } = data;
  const temp = main.temp.toFixed(0);
  const tempMin = main.temp_min.toFixed(0);
  const tempMax = main.temp_max.toFixed(0);
  // const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;
  // const feelsLike = main.feels_like.toFixed(0);
  // const humidity = main.humidity;
  // const windSpeed = wind.speed.toFixed(0);
  const desc = capitalizeWords(weather[0].description);
  const currentEl = document.querySelector(".current");
  currentEl.innerHTML = `
  <h4>${name}</h4>
  <h1>${temp}°</h1>
  ${desc}<br>
  L:${tempMin}° H:${tempMax}°
  `;
};

const displayForecast = (data) => {
  const forecastEl = document.querySelector(".forecast");
  forecastEl.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const { list } = data;
    const { dt, weather, main } = list[i * 8 - 1];
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;
    const formattedDate = displayDay(dt);
    const temp5 = main.temp.toFixed(0);
    const card = document.createElement("div");
    card.classList.add("five-day");
    card.innerHTML = `
      <div class="content-wrapper">
        <div class="left-align">${formattedDate}</div>
        <img src="${iconUrl}" alt="Weather Icon" class="center-align">
        <div class="right-align">${temp5}°</div>
      </div>
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

// const populateCityButtons = () => {
//   const cities = JSON.parse(localStorage.getItem("cities")) || [];
//   const historyEl = document.querySelector(".history");
//   historyEl.innerHTML = "";
//   cities.forEach((city) => {
//     const cityButton = document.createElement("button");
//     cityButton.textContent = city;
//     cityButton.classList.add("city-button", "btn", "d-flex", "column", "btn-secondary", "mb-2");
//     cityButton.addEventListener("click", () => {
//       searchByCity(city);
//     });
//     historyEl.appendChild(cityButton);
//   });
// };

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
  search();
});

document.querySelector(".search input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    search();
  }
});

function search() {
  const city = document.querySelector(".search input").value;
  if (city) {
    handleSearch(city);
  }
};

function showForecast() {
  const forecast = document.querySelector(".forecast");
  forecast.style.display = "flex";
};


// document.querySelector(".clear").addEventListener("click", () => {
//   localStorage.removeItem("cities");
//   const historyEl = document.querySelector(".history");
//   historyEl.innerHTML = "";
//   console.clear();
//   window.location.replace("index.html");
// });

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
      showForecast();
      saveCityToLocalStorage(city);
      // populateCityButtons();
    }
  }
};

// populateCityButtons();