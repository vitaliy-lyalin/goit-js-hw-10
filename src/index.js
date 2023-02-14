import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';

import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

addInnerStyle();

function onSearch(event) {
  event.preventDefault();
  const inputValue = event.target.value.trim();
  if (inputValue === '') {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  } else
    fetchCountries(inputValue).then(renderMarkup).catch(createErrorMessage);
}
function renderMarkup(country) {
  if (country.length > 10) {
    createInfoMessage();
  } else if (country.length === 1) {
    createMarkupCountryInfo(country);
  } else {
    createMarkupCountryList(country);
  }
}

function createMarkupCountryList(country) {
  const markup = country
    .map(
      ({ name: { official }, flags: { svg, alt } }) => `<li>
  <img src="${svg}" alt="${alt}" height="30" width="50">
  <h2>${official}</h2>
  </li>`
    )
    .join('');
  countryList.innerHTML = markup;
  countryInfo.innerHTML = '';
}

function createMarkupCountryInfo(country) {
  const [
    {
      name: { official },
      capital,
      population,
      flags: { svg, alt },
      languages,
    },
  ] = country;

  const languageslist = Object.values(languages).join(', ');

  const markup = `<div class="country-title">
  <img src="${svg}" alt="${alt}" width="50px" />
  <h3>${official}</h3>
  </div>
  <p>Capital: <span>${capital}</span></p>
  <p>Population: <span>${population}</span></p>
  <p>Languages: <span>${languageslist}</span></p>`;

  countryInfo.innerHTML = markup;
  countryList.innerHTML = '';
}

function createErrorMessage(error) {
  // console.log('error status:', error.message);
  if (error.message === '404') {
    Notify.failure('Oops, there is no country  that name');
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
}

function createInfoMessage() {
  Notify.info('Too many matches found. Please enter a more specific name.');
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function addInnerStyle() {
  const extraStyle = document.createElement('style');
  extraStyle.innerHTML = `#search-box {margin: 5px;}
ul {list-style: none; padding-left: 0;}
li {display: flex; gap: 10px; align-items: center; padding: 5px;}
h2 {font-size: 16px; font-weight: 500; margin: 0;}
h3{font-size: 24 px; }
.country-title {display: flex; gap: 10px; align-items: center; padding: 5px; font-weight: 700;}
p {padding: 5px; margin: 0; font-weight: 700;}
span {font-weight: 400;}`;

  document.head.appendChild(extraStyle);
}
