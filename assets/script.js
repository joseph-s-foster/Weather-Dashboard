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
  const iconUrl = `https://openweathermap.org/img/w/${weather[0].icon}.png`;
  const temp = main.temp.toFixed(0);
  const tempMin = main.temp_min.toFixed(0);
  const tempMax = main.temp_max.toFixed(0);
  const feelsLike = main.feels_like.toFixed(0);
  const humidity = main.humidity;
  const windSpeed = wind.speed.toFixed(0);
  // const desc = capitalizeWords(weather[0].description);
  const currentEl = document.querySelector(".current");
  currentEl.innerHTML = `
  Today <img src="${iconUrl}" alt="Weather Icon"><br> 
  <h2>${temp}°</h2><br>
  Feels like ${feelsLike}°<br>
  L:${tempMin} - H:${tempMax}
  `;
};

const displayForecast = (data) => {
  const forecastEl = document.querySelector(".forecast");
  forecastEl.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const card = document.createElement("div");
    card.classList.add("five-day");
    const { list } = data;
    const { dt, weather, main} = list[i * 8 - 1];
    const iconUrl = `https://openweathermap.org/img/w/${weather[0].icon}.png`;
    const formattedDate = displayDay(dt);
    const tempMin5 = main.temp_min.toFixed(0);
    const tempMax5 = main.temp_max.toFixed(0);
    // const desc = capitalizeWords(weather[0].description);
    card.innerHTML += `
    ${formattedDate}<br>
    <img src="${iconUrl}" alt="Weather Icon"><br>
    ${tempMin5}° - ${tempMax5}°
    `;
    forecastEl.append(card);
  }
};

// const saveCityToLocalStorage = (city) => {
//   const cities = JSON.parse(localStorage.getItem("cities")) || [];
//   if (!cities.includes(city)) {
//     cities.push(city);
//     localStorage.setItem("cities", JSON.stringify(cities));
//   }
// };

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
  const city = document.querySelector(".search input").value;
  if (city) {
    handleSearch(city);
  }
});

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
      // saveCityToLocalStorage(city);
      // populateCityButtons();
    }
  }
};

// populateCityButtons();