/**
 * Created by michael.stifter on 10.03.2017.
 */
var router = require('express').Router();
var request = require('request');

/**
 * Reads the IMS data file and returns the content.
 */
router.get('/', function(req, res, next) {
    request('https://api.chucknorris.io/jokes/random', function(err, response, body) {
        if (err) {
            return next(err);
        }

        var error;

        if (response.statusCode === 200) {
            var jsonBody = JSON.parse(body);

            if (jsonBody && jsonBody.value) {
                return  res.status(200).send(jsonBody.value);
            } else {
                error = new Error();
                error.message = "Sorry, this is not the response we expected. Maybe try again later?";

                return next(error);
            }
        } else {
            error = new Error();
            error.message = "Sorry, this is not the response we expected. Maybe try again later?";

            return next(error);
        }
    });
});

module.exports = router;