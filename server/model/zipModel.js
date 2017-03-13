var mongoose = require('mongoose');
var zip = new mongoose.Schema({
    Zip: String
})

module.exports = mongoose.model('zip', zip)