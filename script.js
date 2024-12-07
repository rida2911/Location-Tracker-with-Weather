const apiKey = "95ca7c3095a48090643d20031391cc6a";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";
const locationBtn = document.getElementById("locationBtn");
const cityDisplay = document.querySelector(".city");
const tempDisplay = document.querySelector(".temp");
const humidityDisplay = document.querySelector(".humidity");
const windDisplay = document.querySelector(".wind");
const weatherIcon = document.getElementById("weatherIcon");

function showMap(lat, lon) {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: { lat, lng: lon }
    });
    new google.maps.Marker({ position: { lat, lng: lon }, map });
}

async function fetchWeather(lat, lon) {
    try {
        const response = await fetch(`${weatherUrl}&lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const data = await response.json();

        cityDisplay.textContent = data.name + ", " + data.sys.country;
        tempDisplay.textContent = `${Math.round(data.main.temp)}°C`;
        humidityDisplay.textContent = `Humidity: ${data.main.humidity}%`;
        windDisplay.textContent = `Wind Speed: ${data.wind.speed} km/h`;

        // Set weather icon based on condition
        switch (data.weather[0].main) {
            case "Clouds":
                weatherIcon.src = "images/clouds.png";
                break;
            case "Clear":
                weatherIcon.src = "images/clear.png";
                break;
            case "Rain":
                weatherIcon.src = "images/rain.png";
                break;
            case "Drizzle":
                weatherIcon.src = "images/drizzle.png";
                break;
            case "Mist":
                weatherIcon.src = "images/mist.png";
                break;
            default:
                weatherIcon.src = "images/default.png";
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
        showMap(lat, lon);

    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.querySelector(".error").style.display = "block";
    }
}

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeather(latitude, longitude);
            },
            () => document.querySelector(".error").style.display = "block"
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});