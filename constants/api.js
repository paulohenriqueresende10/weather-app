export const API_ROUTES = {
  baseUrlWeather: (api_key, city) =>
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`,
  baseUrlCities: () =>
  `https://servicodados.ibge.gov.br/api/v1/localidades/distritos?orderBy=nome`
};