// here is the mongoDB model for user(s) so that they can login and make changes to the DB
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

var keys = require('../../API_KEYS.js');
const SALT = 5;

var userSchema = new mongoose.Schema({
  local: {
    email   : String,
    password: String,
  },
  // facebook: {},
  // google: {},
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// userSchema.methods.generateJwt = function() {
//   var expiry = new Date();
//   expiry.setDate(expiry.getDate() + 1);
//
//   return jwt.sign({
//     _id: this._id,
//     email: this.email,
//     username: this.username,
//     exp: parseInt(expiry.getTime() / 1000),
//   }, keys.secret);
// };
//

module.exports = mongoose.model('User', userSchema);
