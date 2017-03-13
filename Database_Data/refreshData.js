var mongoose = require('mongoose');
var zip = require('../server/model/zipModel');
var markets = require('../server/model/farmModel');
var rp = require('request-promise');

var dbRefresh = function() {
  markets.find((err, results) => {
    var time = 5000;
    results.forEach((market) => {
      setTimeout(() => {
        rp.get(`http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=${market.ID}`)
          .then((marketBody) => {
            marketBody = JSON.parse(marketBody);
            var Address = marketBody['marketdetails']['Address'];
            var Products = marketBody['marketdetails']['Products'];
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
            var cords = [longitude, latitude];
            var Schedule = marketBody['marketdetails']['Schedule'].replace(/\<br\>/g, "");
            if (Address !== market.Address) {
              markets.update({ "_id": market._id }, { $set: { "Address": Address } }, (err, mark) => {
                if (err) {
                  console.log(err);
                  return;
                }
                console.log('updated Address');
              })
            }

            if (Products !== market.Products) {
              markets.update({ "_id": market._id }, { $set: { "Products": Products } }, (err, mark) => {
                if (err) {
                  console.log(err);
                  return;
                }
                console.log('updated Products');
              })
            }

            if (GoogleLink !== market.GoogleLink) {
              markets.update({ "_id": market._id }, { $set: { "GoogleLink": GoogleLink } }, (err, mark) => {
                if (err) {
                  console.log(err)
                  return;
                }
                console.log('updated GoogleLink')
              })
            }
            if (market.geometry.coordinates.toString() !== cords.toString()) {
              console.log(market.geometry.coordinates.toString(), cords.toString())
              markets.update({ "_id": market._id }, { $set: { "market.geometry.coordinates": cords } }, (err, mark) => {
                if (err) {
                  console.log(err);
                  return;
                }
                console.log('updated Coordinates');
              })
            }

          })
          .catch((err) => {
            console.log(err, market.ID)
          })
      }, time, market)
      time += 1000;
    })
  })
}

module.exports = dbRefresh;