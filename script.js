const weatherOptions = ["Sunny", "Rainy", "Cloudy", "Stormy", "Snowy", "Windy", "Foggy"];

function getRandomWeather() {
    const randomWeather = [];
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * weatherOptions.length);
        randomWeather.push(weatherOptions[randomIndex]);
    }
    return randomWeather;
}

if (window.location.pathname === '/f-api/api') {
    const randomWeather = getRandomWeather();
    document.body.textContent = JSON.stringify(randomWeather);
} else {
    document.getElementById('title').textContent = 'Weather API';
    document.getElementById('description').textContent = 'This is a simple weather API.';
}
