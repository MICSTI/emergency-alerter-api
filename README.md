# emergency-alerter-api
The API backend for the Emergency Alerter cross-platform app

# Prerequisites
- node.js
- npm

# Quickstart
- npm install
- npm start
- visit <http://localhost:8144>

# Configuration
- in the /config folder, there is a sample configuration file
- in it, you are able to the set the port the app is running on
- an important config value is the Google Maps API key. Without it, you won't be able to retrieve actual data from Google Maps

# API routes
**GET /api/nearest/police?lat=LATITUDE&lng=LONGITUDE&radius=RADIUS_IN_KILOMETRES**

Retrieves all police stations located within the radius of the specified location.
```javascript
Response: 200 OK
{
  "status": "success",
  "data": [
    {
      "lat": 47.0897329,
      "lng": 15.4100455,
      "name": "Polizeiinspektion Graz - Wiener Straße"
    },
    {
      "lat": 47.1033302,
      "lng": 15.4229339,
      "name": "Polizeiinspektion Graz-Andritz"
    },
    {
      "lat": 47.0765347,
      "lng": 15.4287876,
      "name": "Polizeiinspektion Graz-Lendplatz"
    }
  ]
}
```
in case an invalid or no Google Maps API key was provided on the server, the following response will be returned
```javascript
Response: 401 Unauthorized
{
  "status": "error",
  "error": {
    "message": "A valid Google Maps API key must be provided on the server"
  }
}
```
