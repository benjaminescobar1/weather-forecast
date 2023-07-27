// Stores search history
let searchHistory = [];

function searchCity() {
    var cityInput = document.getElementById("cityInput");
    var city = cityInput.value;

    // Calls function to fetch weather data using the city name
    fetchWeatherData(city);
}

function fetchWeatherData(city) {
    // Fetch's data using the API
    var apiKey = 'aeda3c9e23bfe8356ef66fb7d8f722ef';
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Gets the current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayCurrentWeather(data);
                // Add city to the search history
                addToSearchHistory(city);
            } else {
                alert('City not found. Please try again.');
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));

    // Gets the future weather data (5-day forecast)
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                displayForecast(data);
            }
        })
        .catch(error => console.error('Error fetching forecast data:', error));
}

function displayCurrentWeather(data) {
  var weatherInfo = document.getElementById("weatherInfo");
  var currentDate = new Date().toLocaleDateString();

  // Weather icon URL
  var iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  // Create HTML elements to display current weather information
  var cityInfo = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>Date: ${currentDate}</p>
      <p>Temperature: ${data.main.temp} °C</p>
      <p>Humidity: ${data.main.humidity} %</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
      <img src="${iconUrl}" alt="${data.weather[0].description}">
  `;

  weatherInfo.innerHTML = cityInfo;
}

function displayForecast(data) {
  var forecastInfo = document.createElement("div");
  forecastInfo.innerHTML = '<h3>5-Day Forecast</h3>';

  var forecastList = data.list;

  // Stores the forecast data for per day
  var dailyForecast = {};

  // Loops through the forecast list to filter and store one entry per day
  for (let i = 0; i < forecastList.length; i++) {
      var forecastDateTime = new Date(forecastList[i].dt * 1000);
      var dateKey = forecastDateTime.toDateString();

      // Skip entries that have already been added for the current day
      if (dailyForecast[dateKey]) continue;

      // Stores the forecast data for the current day
      dailyForecast[dateKey] = forecastList[i];
  }

  // Loops through the daily forecast data and create HTML elements
  for (var key in dailyForecast) {
      var forecastData = dailyForecast[key];
      var forecastDateTime = new Date(forecastData.dt * 1000);

      // Gets the weather icon URL
      var iconUrl = `http://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png`;

      // Creates HTML elements to display the forecast for each day
      var forecastItem = `
          <div class="forecast-item">
              <p>Date: ${forecastDateTime.toLocaleDateString()}</p>
              <img src="${iconUrl}" alt="${forecastData.weather[0].description}">
              <p>Temperature: ${forecastData.main.temp} °C</p>
              <p>Humidity: ${forecastData.main.humidity} %</p>
              <p>Wind Speed: ${forecastData.wind.speed} m/s</p>
          </div>
      `;

      forecastInfo.innerHTML += forecastItem;
      
  }

  var weatherInfo = document.getElementById("weatherInfo");
  weatherInfo.appendChild(forecastInfo);
}
function addToSearchHistory(city) {
    // Adds the city to the searchHistory array and updates the display
    searchHistory.push(city);

    var searchHistoryDiv = document.getElementById("searchHistory");
    searchHistoryDiv.innerHTML = `
        <h3>Search History</h3>
        <ul>
            ${searchHistory.map(city => `<li onclick="searchCityFromHistory('${city}')">${city}</li>`).join('')}
        </ul>
    `;
}

function searchCityFromHistory(city) {
    // Calls the fetchWeatherData function with the city from the search history
    fetchWeatherData(city);
}