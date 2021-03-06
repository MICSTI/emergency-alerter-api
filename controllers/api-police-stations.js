/**
 * Created by michael.stifter on 10.03.2017.
 */
var router = require('express').Router();
var request = require('request');
var logger = require('winston');
var fs = require('fs');

var configFilePath = '../config.js';

var config = {};

if (fs.existsSync(configFilePath)) {
	// we use the config file
	config = require(configFilePath);
}

/**
 * Reads the IMS data file and returns the content.
 */
router.get('/', function(req, res, next) {
    var key = process.env.GOOGLE_MAPS_KEY || config.google_maps_key;
    var lat = req.query.lat || 0;
    var lng = req.query.lng || 0;
    var radius = req.query.radius || 10000;
    var types = 'police';

    var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json" +
        "?key=" + key +
        "&location=" + lat + "," + lng +
        "&radius=" + radius +
        "&types=" + types;

    request(url, function(err, response, body) {
        if (err) {
            return next(err);
        }

        var error;

        if (response.statusCode === 200) {
            var jsonBody = JSON.parse(body);

            if (jsonBody && jsonBody.results) {
                // check for invalid key
                if (jsonBody.status && jsonBody.status === "REQUEST_DENIED") {
                    error = new Error();
                    error.status = 401;
                    error.message = "A valid Google Maps API key must be provided on the server";

                    return next(error);
                }

                // map the results array to our own data structure
                var data = jsonBody.results.map(function(item) {
                    return {
                        name: item.name,
                        location: {
                            lat: item.geometry.location.lat,
                            lng: item.geometry.location.lng
                        }
                    }
                });

				// change result response to a more Swift-friendly fromat (I hate you, Swift!)
                /*var result = {
                    status: "success",
                    data: data
                };*/

				// now we just send the array
                return  res.status(200).send(data);
            } else {
                logger.error(response.statusCode, body);

                error = new Error();
                error.status = 401;
                error.message = "Sorry, this is not the response we expected. Maybe try again later?";

                return next(error);
            }
        } else {
            error = new Error();
            error.status = 401;
            error.message = "Sorry, this is not the response we expected. Maybe try again later?";

            return next(error);
        }
    });
});

module.exports = router;