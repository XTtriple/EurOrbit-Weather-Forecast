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

        const forecasts = data.dataseries.slice(0, 14); // Get 14-day forecast

        const weatherIcons = {
            "Clear Day": "./assets/weather-icons/clearday.png",
            "Clear Night": "./assets/weather-icons/Clearnight.png",
            "Cloudy Day": "./assets/weather-icons/cloudyday.png",
            cloudyday: "./assets/weather-icons/cloudyday.png",
            Cloudy: "./assets/weather-icons/partly-cloudy.png", // Unified for day and night
            "Cloudy Night": "./assets/weather-icons/cloudynight.png",
            "Light Rain": "./assets/weather-icons/rain.png", // Unified for day and night
            snow: "./assets/weather-icons/Snow.png",
            "Light Snow": "./assets/weather-icons/Snow.png",
            fog: "./assets/weather-icons/fog.png",
            Thunderstorm: "./assets/weather-icons/Thunderstorm.png",
            Showers: "./assets/weather-icons/heavyrain.png", // Unified for day and night
            humidnight: "./assets/weather-icons/humid-night.png",
            "Humid Night": "./assets/weather-icons/HumidNight.png",
            default: "./assets/weather-icons/default.png",
        };

        // Normalize weather conditions
        const normalizeWeatherCondition = (condition) => {
            const normalizedConditions = {
                lightrainday: "Light Rain",
                lightrainnight: "Light Rain",
                mcloudyday: "Cloudy Day",
                mcloudynight: "Cloudy Night",
                oshowerday: "Showers",
                oshowernight: "Showers",
                ishowerday: "Showers",
                ishowernight: "Showers",
                pcloudynight: "Cloudy Night",
                "Clear night": "Clear Night",
                cloudyday: "Cloudy Day",
                pcloudyday: "Cloudy Day",
                cloudynight: "Cloudy Night",
                tsday: "Thunderstorm",
                lightsnownight: "Light Snow",
                lightsnowday: "Light Snow",
                clearnight: "Clear Night",
                clearday: "Clear Day",
                humidnight: "Humid Night",
                
            };
            return normalizedConditions[condition] || condition; // Default to the original condition if no match
        };

        forecasts.forEach((day, index) => {
            console.log(day); // Debug: Inspect the structure of the forecast object

            const card = document.createElement("div");
            card.className = "forecast-card";

            // Calculate the date for each forecast
            const today = new Date();
            const forecastDate = new Date(today);
            forecastDate.setDate(today.getDate() + index);
            const dayName = forecastDate.toLocaleDateString("en-US", { weekday: "short" });
            const fullDate = forecastDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

            // Normalize the weather condition
            const weatherCondition = normalizeWeatherCondition(day.weather);
            const weatherIconPath = weatherIcons[weatherCondition] || weatherIcons.default;

            // Get temperature data
            const temperature = day.temp2m !== undefined ? `${day.temp2m}°C` : "Data Unavailable";

            card.innerHTML = `
                <h3>${dayName} (${fullDate})</h3>
                <img src="${weatherIconPath}" alt="${weatherCondition} Icon" />
                <p>Temp: ${temperature}</p>
                <p>${weatherCondition}</p>
            `;
            forecastContainer.appendChild(card);
        });
    } catch (error) {
        forecastContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});