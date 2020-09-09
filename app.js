const https = require('https');
const express = require('express');
const files = require('fs');

const PORT = 8000;
const API_KEY = "0445f2e6d1908c387af15db894090f71";
const API_URL = (loc, key) => `https://api.openweathermap.org/data/2.5/weather?q=${loc}&units=metric&appid=${key}`
const temperatureHTML = (loc, temperature) =>
`
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Weather Info</title>
</head>

<body>
    Temperature in ${loc} is ${temperature} °C.
    <br />
    <a href="http://localhost:8000">go back</a>
</body>
</html>
`

var app = express();
app.use(express.urlencoded({ extended: false }));
var server = app.listen(PORT, () => { console.log("running...")});

app.get('/', returnMain);
function returnMain (request, response) 
{
    files.readFile('./index.html', function (error, content) {
        if (error) 
        {
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.end("Heheh err");
        }
        else 
        {
            response.writeHead(200,  {'Content-Type': 'text/html'});
            response.write(content);
            response.end();
        }
    });
}

app.post('/weather-info', getWeather);
function getWeather(request, response) 
{
    var location = request.body.weather_location;
    console.log(location);
    //check location
    https.get(API_URL(location, API_KEY), (resp) =>
        {
            let data = '';
            resp.on('data', (chunk) => 
            {
                data += chunk;
            });

            resp.on('end', () => 
            {
                var parsedData = JSON.parse(data);
                console.log(parsedData);
                response.writeHead(200,  {'Content-Type': 'text/html'});
                response.write(temperatureHTML(location, parsedData.main.temp));
                response.end();
            });
        }).on('error', (e) => 
        {
            console.log("err");
            response.send("error occured");
        });
}
