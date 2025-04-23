document.getElementById("getWeather").addEventListener("click", async () => {
    const city = document.getElementById("city").value;
    const [lon, lat] = city.split(","); // Extract longitude and latitude
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = ""; // Clear previous forecast

    try {
        // Fetch weather data from 7Timer API
        const response = await fetch(`https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`);
        if (!response.ok) throw new Error("Failed to fetch weather data");

        const data = await response.json();
        console.log(data); // Debug: Inspect the API response structure

        const forecasts = data.dataseries.slice(0, 7); // Get 7-day forecast

        forecasts.forEach((day, index) => {
            console.log(day); // Debug: Inspect the structure of each forecast object

            const card = document.createElement("div");
            card.className = "forecast-card";

            // Calculate the date for each forecast
            const today = new Date();
            const forecastDate = new Date(today);
            forecastDate.setDate(today.getDate() + index);
            const dayName = forecastDate.toLocaleDateString("en-US", { weekday: "short" });

            const weatherIcons = {
                clear: "./assets/weather-icons/clear.png",
                cloudy: "./assets/weather-icons/cloudy.png",
                cloudyday: "./assets/weather-icons/cloudyday.png",
                cloudynight: "./assets/weather-icons/cloudynight.png",
                rain: "./assets/weather-icons/rain.png",
                snow: "./assets/weather-icons/snow.png",
                fog: "./assets/weather-icons/fog.png",
                thunderstorm: "./assets/weather-icons/thunderstorm.png",
                default: "./assets/weather-icons/default.png",
            };

            // Get temperature data
            const temperature = day.temp2m || "N/A";

            // Get the weather condition and corresponding icon
            const weatherCondition = day.weather;
            const weatherIconPath = weatherIcons[weatherCondition] || weatherIcons.default;

            card.innerHTML = `
                <h3>${dayName}</h3>
                <img src="${weatherIconPath}" alt="${weatherCondition} Icon" />
                <p>Temp: ${temperature}°C</p>
                <p>${weatherCondition}</p>
            `;
            forecastContainer.appendChild(card);
        });
    } catch (error) {
        forecastContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});