import axios from 'axios';

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
const apiKey = '&appid=0ffe5cb07630cc742a561a0d1d542c6d'

const findWeather = async (capital) => {
  try {
    const response = await axios.get(`${baseUrl}${capital}${apiKey}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

export default { 
    findWeather: findWeather 
}