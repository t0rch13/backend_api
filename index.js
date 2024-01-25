const express = require("express");
const axios = require("axios");
const path = require("path");
const ejs = require("ejs");

const app = express();

const PORT = 3000;

// Set the view engine to EJS
app.set("view engine", "ejs");
app.use(express.static('public'));

// Serve the index.ejs file
app.get("/", function (req, res) {
  res.render("index");
});

app.get("/weather", async function (req, res) {
  try {
    const currentDate = new Date();
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(currentDate.getMonth() - 1);
    const fromDate = formatDate(lastMonthDate);

    const city = req.query.city || "Astana";
    const apiKeyWeather = "0cf3f5de822ed6c4e1bdb6901da1036e";
    const apiKeyMaps = 'AIzaSyAGiuA9tp6RdD4No9aEzZ438n38NyMIN7M';
    const apiUrlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyWeather}&units=metric`;
    const apiUrlNews = `https://newsapi.org/v2/everything?q=${city}&searchIn=title&from=${fromDate}&language=en&sortBy=popularity&apiKey=27df3cb829584967b560725662dc7f47`

    const apiResponseWeather = await axios.get(apiUrlWeather);
    const weatherData = apiResponseWeather.data;

    const apiResponseNews = await axios.get(apiUrlNews);
    const newsData = apiResponseNews.data;

    const temp = weatherData.main.temp;
    const description = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;
    const imgURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    const coordinates = weatherData.coord;
    const feelsLike = weatherData.main.feels_like;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    const countryCode = weatherData.sys.country;

    const articles = newsData.articles.slice(0, 5);
    if (!articles) {
      articles = 'No articles found';
    }

    res.render("weather", {
      temp,
      city,
      description,
      imgURL,
      coordinates,
      feelsLike,
      humidity,
      windSpeed,
      countryCode,
      apiKeyMaps,
      articles,
    });
  } catch (error) {
    console.error(`Error making HTTPS request to weather: ${error.message}`);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/apod', async (req, res) => {
  try {
    const response = await axios.get('https://api.nasa.gov/planetary/apod', {
      params: {
        api_key: 'FYUgxA9FfcQbu2CxnHsUuNhfstLZjE24m9Dzykew',
      },
    });

    res.render('apod', { apod: response.data });
  } catch (error) {
    console.error('Error fetching APOD data:', error);

    res.render('apod', { apod: null });
  }
});

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
