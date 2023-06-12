import { API_ROUTES } from "./constants/api.js";
import { env } from "../env.js";

const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const error404Text = document.querySelector('.not-found p');
const inputText = document.querySelector('.search-box input');

search.addEventListener('click', async () => {
    const city = document.querySelector('.search-box input').value;

    if (!city) {
        return;
    }

    const response = await fetchWeather(env.api_key, city);

    const checkHttpCode = await checkApiResponseHttpCode(response);

    if (checkHttpCode) {
        renderApiResponse(response);
    }
});

inputText.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        search.click();
      }
});

const fetchWeather = async (APIKey, city) => {
 const response = await fetch(API_ROUTES.baseUrlWeather(APIKey, city))
    .then(response => response.json());
    return response;
};

const renderApiResponse = (json) => {
    const image = document.querySelector('.weather-box img');
    const temperature = document.querySelector('.weather-box .temperature');
    const description = document.querySelector('.weather-box .description');
    const humidity = document.querySelector('.weather-details .humidity span');
    const wind = document.querySelector('.weather-details .wind span');

    selectWeatherImage(json.weather[0].main, image);

    temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
    description.innerHTML = `${json.weather[0].description}`;
    humidity.innerHTML = `${json.main.humidity}%`;
    wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

    weatherBox.style.display = '';
    weatherDetails.style.display = '';
    weatherBox.classList.add('fadeIn');
    weatherDetails.classList.add('fadeIn');
    container.style.height = '590px';
};

const selectWeatherImage = (weatherMain, image) => {
    switch (weatherMain) {
        case 'Clear':
            image.src = 'images/clear.png';
            break;

        case 'Rain':
            image.src = 'images/rain.png';
            break;

        case 'Snow':
            image.src = 'images/snow.png';
            break;

        case 'Clouds':
            image.src = 'images/cloud.png';
            break;

        case 'Haze':
            image.src = 'images/mist.png';
            break;

        default:
            image.src = '';
    }
};

const checkApiResponseHttpCode = async ({cod, message}) => {
    if (cod === '404') {
        container.style.height = '400px';
        weatherBox.style.display = 'none';
        weatherDetails.style.display = 'none';
        error404.style.display = 'block';
        error404.classList.add('fadeIn');
        error404Text.innerText = message;
        return false;
    }

    error404.style.display = 'none';
    error404.classList.remove('fadeIn');
    return true;
};

const fetchcities = async () => {
    const response = await fetch(API_ROUTES.baseUrlCities())
        .then(response => response.json());
    return response;
};

const renderCitiesOptions = async (cities) => {
    const datalistOption = document.querySelector('#cityname');
    cities.forEach(city => {
        const options = document.createElement('option');
        options.value = city.nome;
        datalistOption.append(options);
    });
};

const handleDatalistOptions = async () => {
    const response = await fetchcities();
    await renderCitiesOptions(response);
};

handleDatalistOptions();
