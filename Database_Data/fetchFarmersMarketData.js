// here is the script to make the API requests to Farmer's Market API to grab all market data based on zip code
var request = require('request');
var rp = require('request-promise');
var mongoose = require('mongoose');
var GeoJSON = require('mongoose-geojson-schema');
var market = require('../server/model/farmModel');
var async = require('async');

var fetchAllData = function(zipCode, coordinates, radius, res, cb) {
  rp.get(`http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=${zipCode}`)
    .then((body) => {
      console.log('got the zips')
      JSON.parse(body).results.forEach((marketData, index) => {
        var id = marketData.id
        rp.get(`http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=${id}`)
          .then((marketBody) => {
            var Name = marketData.marketname.split('').slice(4).join("");
            marketBody = JSON.parse(marketBody)
            var ID = id;
            var Address = marketBody['marketdetails']['Address'];
            var Products = marketBody['marketdetails']['Products'].split('; ').join(',').split(',')
            var GoogleLink = marketBody['marketdetails']['GoogleLink'];
            var string = marketBody['marketdetails']['GoogleLink'];
            var start = string.indexOf("=");
            var end = string.indexOf("(");
            var coordString = string.slice(start + 1, end);
            var scissorIndex = coordString.indexOf("-");
            var latitudeWithPercentages = coordString.slice(0, scissorIndex);
            var longitudeWithPercentages = coordString.slice(scissorIndex);
            var percentLatIndex = latitudeWithPercentages.indexOf("%");
            var percentLongIndex = longitudeWithPercentages.indexOf("%");
            var longitude = Number(longitudeWithPercentages.slice(0, percentLongIndex));
            var latitude = Number(latitudeWithPercentages.slice(0, percentLatIndex));
            var Schedule = marketBody['marketdetails']['Schedule'].replace(/\<br\>/g, "");
            var Obj = {
              ID,
              Name,
              Address,
              Products,
              GoogleLink,
              Schedule,
              geometry: {
                type: "Point",
                coordinates: [longitude, latitude]
              },
              Comments: [{
                comment: '',
                author: '',
                timestamp: new Date()
              }]
            }
            market.collection.insert(Obj);
            market.collection.createIndex({
              geometry: "2dsphere"
            });
          })
        if (index === JSON.parse(body).results.length - 1) {
          setTimeout(cb, 1000, coordinates, radius, res);
        }
      })
    })
}

module.exports = fetchAllData;