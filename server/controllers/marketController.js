var Market = require('../model/farmModel.js');
var Q = require('q');
var rp = require('request-promise');
var MarketQuery = require('../methods/marketMethods');
var util = require('../util/util_functions');
var api = require('../../API_KEYS');
var zip = require('../model/zipModel');
var fetcher = require('../../Database_Data/fetchFarmersMarketData');
var getAllFarms = Q.nbind(Market.find, Market);
var queryMarkets = Q.nbind(Market.find, Market);
var queryById = Q.nbind(Market.findById, Market);
var findAndUpdate = Q.nbind(Market.update, Market);
var findAndRemove = Q.nbind(Market.remove, Market);
var createMarket = Q.nbind(Market.create, Market);
var createComment = Q.nbind(Market.findOneAndUpdate, Market);

var zipQuery = Q.nbind(zip.find, zip);
module.exports = {
  allMarkets: function (req, res, next) {
    console.log("allMarkets....")
    getAllFarms({})
      .then(function (farms) {
        res.json(farms)
      })
      .fail(function (error) {
        next(error);
      });
  },

  createComment: (req, res) => {
    console.log("obj received: ", req.body)
    const comment = req.body.comment
    const author = req.body.author
    const id = req.body.id
    createComment(
        { "ID": id},
          {"$push": {
            "Comments": {
              "author": author,
              "comment": comment,
              "timestamp": new Date()
            }
          }
        },
        {new: true}
      )
      .then((newComment) => {
        console.log('line 48    ', newComment.Comments[newComment.Comments.length - 1]);
        res.send(newComment)
      })
      .catch(err => {
        console.error('new comment NOT created!  ', err)
      })
  },


  getLocationMarkets: (req, res, next) => {
    var address = util.replaceSpaceInAddress(req.query.address);
    var radius = util.convertMilesToKm(req.query.radius);
    console.log('here is the radius', radius)
    rp.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}`
    ).then((data) => {
      var userZip
      JSON.parse(data).results[0].address_components.find((item) => {
        if (item.types[0] === 'postal_code') {
          userZip = item.long_name;
        }
      })
      var coordinates = JSON.parse(data).results[0].geometry.location;
      console.log('successfully got geocode' + coordinates);
      zipQuery({
          Zip: userZip
        })
        .then((result) => {
          if (result.length === 0) {
            zip.collection.insert({
                Zip: userZip
              })
              .then(() => {
                console.log('here in market controller')
                fetcher(userZip, coordinates, radius, res, (coordinates, radius, res) => {
                  console.log(coordinates)
                  marketLocation(coordinates, radius, res)
                })
              })
          } else {
            console.log(coordinates, radius)
            marketLocation(coordinates, radius, res)
          }
        })
    });
  },

  addMarket: (req, res, next) => {
    console.log("req.body", req.body);
    console.log("geo coords", req.body.geometry);
    Market.create({
        Address: req.body.market.Address,
        GoogleLink: req.body.market.Link,
        Products: req.body.market.Products,
        Schedule: req.body.market.Schedule,
        Name: req.body.market.Name,
        geometry: req.body.market.geometry
      },
      function (err, newMarket) {
        if (err) {
          console.log("Error creating object!", err);
          res.send("error creating object!");
        } else {
          Market.collection.createIndex({
            geometry: "2dsphere"
          });
          res.send(newMarket);

        }
      });
  },

  fetchOne: (req, res) => {
    console.log("above fetch");
    console.log(req.body.marketId);
    queryById(req.body.marketId)
      .then((doc) => {
        console.log("in fetch one", doc);
        res.send(doc);
      })
      .catch((err) => {
        console.log(err);
        res.send('not found');
      });
  },

  updateOne: (req, res) => {
    console.log("put request through to 'updateOne' func in market controller");
    console.log("obj received: ", req.body.updatedObj.data);
    console.log(req.body.updatedObj.data._id, "id");
    console.log(typeof req.body.updatedObj.data.geometry.coordinates);
    findAndUpdate({
        _id: req.body.updatedObj.data._id
      }, {
        '$set': {
          'Address': req.body.updatedObj.data.Address,
          'Products': req.body.updatedObj.data.Products,
          'Schedule': req.body.updatedObj.data.Schedule,
          'Name': req.body.updatedObj.data.Name,
          'GoogleLink': req.body.updatedObj.data.GoogleLink,
          'geometry.coordinates': req.body.updatedObj.data.geometry.coordinates
        }
      },
      () => {
        res.send("updated");
      })
  },

  delete: (req, res) => {
    console.log(req.body, "req.body!!")
    findAndRemove({
        _id: req.body.market.data._id
      },
      () => {
        res.send("item removed");
      });
  }
};

function marketLocation(coordinates, radius, res) {
  var lng = Number(coordinates.lng);
  var lat = Number(coordinates.lat);
  console.log("typeof lng,", typeof lng, typeof lat, lng)
  var marketsDetails;
  queryMarkets({
      geometry: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          $minDistance: 0,
          $maxDistance: radius || 1609.3 //distance must be in meters
        }
      }
    })
    .then((markets) => {
      marketsDetails = markets;
      res.json(marketsDetails);
    })
    .catch((err) => {
      console.error('Failed', err);
    });
}
