//jshint esversion:6

const express = require("express");//external module
const https = require("https");//native module
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    //go to the external server and fetch the info using their API
    const query = req.body.cityName;
    const apiKey = "fe1a30df7dcff213928906b3b11cd8de";
    const unit = "metric";
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey;//the url of the server we are going to query
    https.get(url, function (response) {
      if (response.statusCode === 200)  {

    response.on("data", function(data) {
// getting today's date in a wonderful format

        let date = new Date();
        let option = {
          weekday: "long",
          day: "numeric",
          month: "long"
        };
        let today = date.toLocaleDateString("en-Us", option);


          //using the response(data) from the external server
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.render("result", {todayDate: today,
                            resultCity: query,
                            resultTemp: temp,
                            resultWeatherDescription: weatherDescription,
                            resultIcon: icon,
                            resultImageURL: imageURL});
    });
  } else {
    console.log(response);
    res.sendFile(__dirname + "/failure.html");
  }
  });
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});

// heroku app url  https://evening-caverns-80880.herokuapp.com/
// https://evening-caverns-80880.herokuapp.com/
