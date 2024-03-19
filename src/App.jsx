import React, { useState, useEffect } from 'react';
import axios from 'axios';
import weatherService from './services/weather.js';
import './App.css'; // Import CSS file

const SingleCountryDisplay = ({ country }) => {
  const keys = Object.keys(country.languages);
  return (
    <div className="country-card">
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h3><strong>Languages:</strong></h3>
      <ul>
        {keys.map((key) => (
          <li key={key}>{country.languages[key]}</li>
        ))}
      </ul>
      <div>
        <img src={country.flags.png} alt="Country Flag" height="150" width="200" />
      </div>
    </div>
  );
};

const FindCountries = ({ text, value, onChange }) => (
  <div>
    {text} <input value={value} onChange={onChange} />
  </div>
);

const DisplayCountries = ({ countriesAfterFilter, onShowButtonClick }) => (
  <div>
    {countriesAfterFilter.length > 10 ?
      (<div className="country-card">Too many matches, specify another filter</div>)
      :
      countriesAfterFilter.length === 1 ?
        (<SingleCountryDisplay country={countriesAfterFilter[0]} />)
        :
        (countriesAfterFilter.map((country, index) => (
          <div key={index} className="country-card">
            {country.name.common}
            <button className="button" onClick={() => onShowButtonClick(country)}>Show</button>
          </div>
        )))
    }
  </div>
);

const App = () => {
  const [countries, setCountries] = useState([]);
  const [newCurrCountry, setNewCurrCountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then((response) => setCountries(response.data))
      .catch((error) => console.error('Error fetching countries:', error));
  }, []);

  const handleCountryChange = (event) => {
    setNewCurrCountry(event.target.value);
    setSelectedCountry(null);
  };

  const handleShowButtonClick = (country) => {
    setSelectedCountry(country);
    weatherService.findWeather(country.capital)
      .then((response) => setWeather(response))
      .catch((error) => console.error('Error fetching weather:', error));
  };

  const filtered = countries.filter((country) =>
    country.name.common.toLowerCase().includes(newCurrCountry.toLowerCase()));

  return (
    <div className="container">
      <FindCountries text="Find countries" value={newCurrCountry} onChange={handleCountryChange} />

      {selectedCountry !== null ? (
        <div className="country-card">
          <SingleCountryDisplay country={selectedCountry} />
          {weather && (
            <div className="weather-card">
              <h2>Weather in {selectedCountry.capital}</h2>
              <p>Description: {weather.weather[0].description} </p>
              <p>Temperature: {weather.main.temp} K</p>
              <p>Feels Like: {weather.main.feels_like} K</p>
            </div>
          )}
        </div>
      ) : (
        <DisplayCountries countriesAfterFilter={filtered} onShowButtonClick={handleShowButtonClick} />
      )}

      {filtered.length === 1 && (
        <div className="weather-card">
          {weather && (
            <div>
              <h2>Weather in {filtered[0].capital}</h2>
              <p>Description: {weather.weather[0].description}</p>
              <p>Temperature: {weather.main.temp} K</p>
              <p>Feels Like: {weather.main.feels_like} K</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
