const BASE_URL = 'https://restcountries.com/v3.1';
const service = 'name';
const searchParameters = 'fields=name,capital,population,flags,languages';

export function fetchCountries(country) {
  return fetch(`${BASE_URL}/${service}/${country}?${searchParameters}`).then(
    response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    }
  );
}
