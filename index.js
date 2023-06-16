import { API_ROUTES } from "./constants/api.js";
import { env } from "../env.js";

const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const error404Text = document.querySelector('.not-found p');
const inputText = document.querySelector('.search-box input');
const inputIcon = document.querySelector('.search-box i');

search.addEventListener('click', async () => {
    const city = document.querySelector('.search-box input').value;

    if (!city) {
        return;
    }

    const response = await fetchWeather(env.api_key, `q=${city}`);

    if (response) {
        renderApiResponse(response);
    }
});

inputText.addEventListener('keypress', (event) => {
    const inputValue = event.target.value;
    if (event.key === "Enter") {
        event.preventDefault();
        search.click();
    }
    if (inputValue.length >= 3) {
        handleDatalistOptions(inputValue);
    }
});

const fetchWeather = async (APIKey, apiParam) => {
    const response = await axios.get(API_ROUTES.baseUrlWeather(APIKey, apiParam))
    .catch((error) => {
        container.style.height = '400px';
        weatherBox.style.display = 'none';
        weatherDetails.style.display = 'none';
        error404.style.display = 'block';
        error404.classList.add('fadeIn');
        error404Text.innerText = error.response.data.message;
        return false;
    });
    if(!response) {
        return response;
    }
    error404.style.display = 'none';
    error404.classList.remove('fadeIn');
    return response.data;
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

const fetchcities = async () => {
    const response = await axios.get(API_ROUTES.baseUrlCities());
    return response.data;
};

const renderCitiesOptions = async (cities) => {
    const datalistOption = document.querySelector('#cityname');
    cities.forEach(city => {
        const options = document.createElement('option');
        options.value = city.nome;
        datalistOption.append(options);
    });
};

const handleDatalistOptions = async (cityFilter) => {
    const CitiesOptions = await fetchcities();
    const newCities = CitiesOptions.filter((city) => 
        city.nome.toLowerCase().includes(cityFilter)
    );
    await renderCitiesOptions(newCities);
};

const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
};

const showPosition = async (position) => {
    const response = await fetchWeather(env.api_key, `lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
    renderApiResponse(response);
};

inputIcon.addEventListener('click', async () => {
    getLocation();
});