const express = require("express"); //importing library called express

const app = express(); //creates an object from the library called app

app.use(express.json());

// var admin = require("firebase-admin");

app.post("/chat", (req, res) => {
  var apiKey = "5a694c490d287c448e9a1b9e68a91eba";
  var request = require("request");

  var city = "krypton";
  city = req.body.queryResult.parameters.city;

  var dateString = req.body.queryResult.parameters.date;
  var date = new Date(dateString);
  var month = date.getMonth();
  var day = date.getDate();
  var latitude = null;
  var longitude = null;
  var limit = 5;

  if (city == null) {
    city = "singapore";
  } else {
    request(
      "http://api.openweathermap.org/geo/1.0/direct?q=" +
        city +
        `&limit=${limit}&appid=${apiKey}`,
      function (error, response, body) {
        console.log("error:", error); //To print the error
        console.log("StatusCode:", response && response.statusCode);
        //console.log("body:", body);
        //var obj = JSON.parse(body);
        //var list = obj.list[0];
        latitude = body[0].lat;
        longitude = body[0].lon;
      }
    );
  }

  request(
    `https://api.openweathermap.org/data/2.5/forecast?lat=35&lon=139&appid=${apiKey}`,
    function (error, response, body) {
      console.log("error:", error); //To print the error
      console.log("StatusCode:", response && response.statusCode);
      //console.log("body:", body);
      var obj = JSON.parse(body);
      var list = obj.list[0];
      console.log(list);
      console.log("total length:" + list.length);
      var tempDate = new Date("2018-11-09T12:00:00+08:00");
      console.log("tempdate month is " + tempDate.getMonth());

      var s = "";
      var description = "none found";
      for (var i = 0; i < obj.list.length; i++) {
        var date = new Date(obj.list[i].dt * 1000);
        var weather = obj.list[i].weather[0].description;
        if (date.getMonth() == month && date.getDate() === day) {
          description = weather;
          description = description + " " + date.toString();
        }
      }

      res.send(JSON.stringify({ fulfillmentText: description }));
    }
  );
});

app.listen(3000, () => console.log("Listening to port 3000...."));
