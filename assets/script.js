const apikey = "7761e5644bf2af39970d6760ed459312";
function handleSearch() {
    let city = document.querySelector(".search input").value
    if (!city) return;
    fetchCurrentWeather(city);
};

function fetchCurrentWeather(city) {
    const apiUrlWeather = `https://api.openweathermap.org/data/2.5/weather?appid=${apikey}&q=${city}&units=imperial`
    fetch(apiUrlWeather).then(function (res) {
        return res.json()
    }).then(function (data) {
        console.log(data)
        displayCurrentWeather(data)
        let lat = data.coord.lat
        let lon = data.coord.lon
        const apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apikey}`
        fetch(apiUrlForecast).then(function (res) {
            return res.json()
        }).then(function (data) {
            console.log(data)
        })
    })
};

function displayCurrentWeather(data) {
    const h2El = document.createElement("h2")
    h2El.textContent = `${data.name} ${data.dt} `
    let iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
    const icon = document.createElement("img")
    icon.src = iconUrl
    const tempEl = document.createElement("p")
    tempEl.textContent = `temperature: ${data.main.temp} F`
    const humidityEl = document.createElement("p")
    humidityEl.textContent = `humdity: ${data.main.humidity} %`
    const windSpeedEl = document.createElement("p")
    windSpeedEl.textContent = `wind speed: ${data.wind.speed} mph`
    document.querySelector(".current").append(h2El,icon,tempEl,humidityEl,windSpeedEl)
};

document.querySelector(".search button").addEventListener("click", handleSearch)