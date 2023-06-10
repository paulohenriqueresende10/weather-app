export const API_ROUTES = {
  baseUrl: (api_key, city) =>
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`
};