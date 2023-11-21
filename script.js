function convertKelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(2);
}

function getWeather() {
    const apiKey = '7ded80d91f2b280ec979100cc8bbba94';
    const city = document.getElementById('cityInput').value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const xhr = new XMLHttpRequest();

    xhr.open('GET', apiUrl, true);
    xhr.onload = function () {
        const response = JSON.parse(xhr.responseText);

        console.log(response)

        const date = response.dt;
        const temperatureCelsius = convertKelvinToCelsius(response.main.temp);
        const feelsLikeCelsius = convertKelvinToCelsius(response.main.feels_like);
        const weatherDescription = response.weather[0].description;

        const weatherResultDiv = document.getElementById('weatherResult');
        weatherResultDiv.innerHTML = `
            <p>date and time: ${formatDtTxt(date)}</p>
            <p>real temperature: ${temperatureCelsius} °C</p>
            <p>felt temperature: ${feelsLikeCelsius} °C</p>
            <p>weather: ${weatherDescription}</p>
        `;
    };
    xhr.send();
}

function formatDtTxt(dt) {
    const date = new Date(dt * 1000); // Convert seconds to milliseconds
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function getFiveDayForecast() {
    const apiKey = '7ded80d91f2b280ec979100cc8bbba94';
    const city = document.getElementById('cityInput').value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiUrl);
    const forecastData = await response.json();

    console.log(forecastData);

    const dailyForecasts = forecastData.list.filter(item => item.dt_txt.includes('12:00'));

    const forecasts = dailyForecasts.map(item => {
        return {
            date: item.dt_txt,
            temperatureCelsius: convertKelvinToCelsius(item.main.temp),
            feelsLikeCelsius: convertKelvinToCelsius(item.main.feels_like),
            weatherDescription: item.weather[0].description,
        };
    });

    const weatherForecastResultDiv = document.getElementById('weatherForecastResult');
    weatherForecastResultDiv.innerHTML = forecasts.map(forecast => `
            <p>date and time: ${forecast.date}</p>
            <p>real temperature: ${forecast.temperatureCelsius} °C</p>
            <p>felt temperature: ${forecast.feelsLikeCelsius} °C</p>
            <p>weather: ${forecast.weatherDescription}</p>
            <br>
        `).join('');
}

document.getElementById('getWeatherBtn').addEventListener('click', getWeather);
document.getElementById('getWeatherBtn').addEventListener('click', getFiveDayForecast);