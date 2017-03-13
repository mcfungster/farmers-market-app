var mongoose = require('mongoose');
var cacheMarket = new mongoose.Schema({
    ID: String,
    Address: String,
    GoogleLink: String,
    Products: [],
    Schedule: String,
    geometry: { type: { type: String }, coordinates: { type: [Number] } },
    Name: String,
    Comments: [{
        comment: String,
        author: String,
        timestamp: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('cacheMarket', cacheMarket);
