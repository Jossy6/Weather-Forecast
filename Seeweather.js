const apiKey = "4877eb37dba23df28a88c441aa66bd00";

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;

  // Current weather API
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},NG&appid=${apiKey}&units=metric`;

  // 5-day forecast API
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},NG&appid=${apiKey}&units=metric`;

  // Fetch current weather
  fetch(currentUrl)
    .then(res => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(data => {
      document.getElementById("currentWeather").innerHTML = `
        <h2>Current Weather in ${data.name}</h2>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Conditions: ${data.weather[0].description}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon">
      `;
    })
    .catch(error => {
      document.getElementById("currentWeather").innerHTML = `<p>Could not find weather for "${city}".</p>`;
      document.getElementById("forecast").innerHTML = "";
      console.error(error);
    });

  // Fetch 5-day forecast
  fetch(forecastUrl)
    .then(res => res.json())
    .then(data => {
      const forecastDiv = document.getElementById("forecast");
      forecastDiv.innerHTML = "";

      const dailyForecast = {};
      data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!dailyForecast[date] && item.dt_txt.includes("12:00:00")) {
          dailyForecast[date] = item;
        }
      });

      const forecastArray = Object.values(dailyForecast).slice(0, 5);
      forecastArray.forEach(day => {
        const date = new Date(day.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

        forecastDiv.innerHTML += `
          <div class="forecast-day">
            <h4>${dayName}</h4>
            <img src="${iconUrl}" alt="icon">
            <p>${day.main.temp} °C</p>
            <p>${day.weather[0].description}</p>
          </div>
        `;
      });
    })
    .catch(err => {
      document.getElementById("forecast").innerHTML = `<p>Could not load forecast data.</p>`;
      console.error(err);
    });
}
