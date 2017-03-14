/**
 * Created by michael.stifter on 14.03.2017.
 */
// modules ====================================
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var logger = require('winston');

var errorHandler = require('./controllers/error-handler');

// config files ====================================
var config = require("./config");

// check if Google Maps API key is set in config file
if (typeof config.google_maps_key === 'undefined') {
    logger.warn('There is no Google Maps API key set in the config file. The application might not work as expected');
}

// set port
var port = process.env.PORT || config.port;

// get all data of the body (POST) parameters
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// API routes ================================================
app.use('/api/nearest/police', require('./controllers/api-police-stations'));

// index route
app.get('/', function(req, res) {
    res.status(200).send("Hi there! This is the API backend for the Emergency Alert cross-platform app");
});

// 404
app.get("*", function(req, res) {
    res.status(404).send("This is not an allowed URL");
});

// error handler ====================================
app.use(errorHandler);

// start app ====================================
app.listen(port);

// console message
logger.info("API server started on port %d", port);

// expose app
exports = module.exports = app;