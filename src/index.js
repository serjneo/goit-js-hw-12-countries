import getRefs from './js/getRefs';
import countriesApi from './js/fetchCountries';
import countryTpl from './template/card-template.hbs';
import countriesTpl from './template/list-template.hbs';
import { info, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const debounce = require('lodash.debounce');
const refs = getRefs();
let foundedCountry = '';

refs.input.addEventListener('input', debounce(() => {handleSearch();}, 500),);

function handleSearch() {
  resetSearch();
  foundedCountry = refs.input.value;
  countriesApi(foundedCountry)
    .then(renderMarkup)
    .catch(error => console.log(error));
}

function resetSearch() {
  refs.countriesContainer.innerHTML = '';
}

function renderMarkup(country) {
  if (country.length === 1) {
    resetSearch();
    markupContry(countryTpl, country);
  } else if (country.length > 1 && country.length < 10) {
    resetSearch();
    markupContry(countriesTpl, country);
  } else if (country.length >= 10) {
    resultMessage(
      error,
      'To many matches found. Please enter a more specific query!',
    );
  } else {
    resultMessage(info, 'No matches found!');
  }
}

function resultMessage(typeInfo, textInfo) {
  typeInfo({
    text: `${textInfo}`,
    delay: 1000,
    closerHover: true,
  });
}

function markupContry(tpl, country) {
  refs.countriesContainer.insertAdjacentHTML('beforeend', tpl(country));
}