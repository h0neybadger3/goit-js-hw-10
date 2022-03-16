import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const refs = {
  searchBox: document.querySelector('#search-box'),
  listMarkup: document.querySelector('.country-list'),
  countryInfoContainer: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.searchBox.addEventListener('input', debounce(onSearchCountries, DEBOUNCE_DELAY));

function onSearchCountries(e) {
  if (refs.searchBox.value.length > 1) {
    const inputNameCountrie = refs.searchBox.value.trim();
    return fetchCountries(inputNameCountrie).then(showCountries).catch(inputWrongCountry);
  } else {
    refs.listMarkup.innerHTML = '';
    refs.countryInfoContainer.innerHTML = '';
  }
}

function showCountries(countries) {
  refs.listMarkup.innerHTML = '';
  refs.countryInfoContainer.innerHTML = '';
  if (countries.length > 10) {
    return Notify.info('Too many matches found. Please enter a more specific name.');
  }

  if (countries.length >= 2 && countries.length <= 10) {
    makeMarkupList(countries);
  }

  if (countries.length === 1) {
    makeMarkupContainer(countries);
  }
}

function makeMarkupList(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `<li class = "country-list__item"><img src="${flags.svg}" alt="Flag of ${name.official}" class = "country-list__img"> ${name.common}</li>`;
    })
    .join('');
  refs.listMarkup.innerHTML = markup;
}

function makeMarkupContainer(countries) {
  const markup = countries
    .map(({ flags, name, capital, languages, population }) => {
      return `
        <div class = "country-info__wrapper">
        <img src="${flags.svg}" alt="Flag of ${name.official}" class = "country-list__img">
        <h1 class = "country-title"> ${name.common}</h1>
        </div>
        <ul class = "country-info-list">
            <li class = "country-info-list__item">
            <p>Capital: ${capital}</p>
            </li>
            <li class = "country-info-list__item">
            <p>Population: ${population}</p>
            </li>
            <li class = "country-info-list__item">
            <p>Languages: ${Object.values(languages)}</p>
            </li>
        </ul>`;
    })
    .join('');
  refs.countryInfoContainer.innerHTML = markup;
}

function inputWrongCountry() {
  Notify.failure('Oops, there is no country with that name');
}
