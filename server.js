// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

app.use(loggerMiddleware); // root level ito kasi app.use() with a single argument points to the root path '/'

function loggerMiddleware(req, res, next) {
  var method = req.method;
  var path = req.path;
  var ip = req.ip;
  console.log(`${method} ${path} - ${ip}`);
  next();
}

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public')); // serving stylesheet

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) { // serving index.html
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

let isDateValid = function(date) {
  let testDate = new Date(date); let res = false;
  testDate === "Invalid Date" ? res = false : res = true;
  return res; 
}

let inUnixFormat = function(date) {
  let delta = date.length - date.match(/\d/g).length; let res = false;
  delta ? res = false : res = true;
  return res;
};

app.get("/api/timestamp/:date_string?", function(req, res) {
  let requestDate = req.params.date_string; let date;
  !requestDate ? date = new Date() : date = new Date(requestDate);
  console.log({requestDate, date});
  if (!requestDate) { // if date_string is not supplied
    console.log('no date supplied, responding with current date...')
    res.json({utc: date.toUTCString(), unix: date.getTime()});
  }
  if (inUnixFormat(requestDate)) {
    console.log('converting for unix...')
    date = new Date(parseInt(requestDate))
  }
  if (isDateValid(date)) {
    res.json({utc: date.toUTCString(), unix: date.getTime()});
  } else res.json({error: "Invalid Date"})
});

// {"unix": <date.getTime()>, "utc" : <date.toUTCString()> }
// https://fcc-api-microservice-timestamp.glitch.me/api/timestamp/1450137600


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});