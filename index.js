const express = require("express");
const axios = require("axios");
const path = require("path");
const ejs = require("ejs");

const app = express();

const PORT = 3000;

// Set the view engine to EJS
app.set("view engine", "ejs");
//app.set("views", path.join(__dirname, "views"));
app.use(express.static('public'));

// Serve the index.ejs file
app.get("/", function (req, res) {
  res.render("index");
});

app.get("/weather", async function (req, res) {
  try {
    const city = req.query.city || "Astana";
    const apiKeyWeather = "0cf3f5de822ed6c4e1bdb6901da1036e";
    const apiKeyMaps = 'AIzaSyAGiuA9tp6RdD4No9aEzZ438n38NyMIN7M';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyWeather}&units=metric`;

    const apiResponse = await axios.get(apiUrl);
    const weatherData = apiResponse.data;

    const temp = weatherData.main.temp;
    const description = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;
    const imgURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    const coordinates = weatherData.coord;
    const feelsLike = weatherData.main.feels_like;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    const countryCode = weatherData.sys.country;

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
    }, apiKeyWeather);
  } catch (error) {
    console.error(`Error making HTTPS request to OpenWeatherMap API: ${error.message}`);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
