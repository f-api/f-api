const weatherOptions = ["Sunny", "Rainy", "Cloudy", "Stormy", "Snowy", "Windy", "Foggy"];

function getRandomWeather() {
    const randomWeather = [];
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * weatherOptions.length);
        randomWeather.push(weatherOptions[randomIndex]);
    }
    return randomWeather;
}

// URL에 /api 경로가 있을 경우, JSON 데이터를 반환합니다.
if (window.location.pathname === '/api') {
    const randomWeather = getRandomWeather();
    document.body.textContent = JSON.stringify(randomWeather);
}
