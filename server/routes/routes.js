var serverRoutes = require('express').Router();
var marketController = require('../controllers/marketController');
var adminController = require('../controllers/adminController');
var util = require('../util/util_functions');
var bcrypt = require('bcrypt-nodejs');

// this single, one-time admin setup should only be invoked once. As long as the database has 1 instance of the admin, this route should never ever be visited a second time.
serverRoutes.route('/setup')
.get((req, res) => {
  adminController.setup(req, res);
});

serverRoutes.route('/api/search')
.get(/* [,some middleware] */ (req, res) => {
  // invoke marketController.getRadiusMarkets to make query to DB
  marketController.getLocationMarkets(req, res);
});

serverRoutes.route('/api/login')
.post((req, res) => {
  adminController.login(req, res);
});

  /////////////////////////////////
 // dress up with passport later
//// and new routes
serverRoutes.route('/login')

serverRoutes.route('/signup')
.post(passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

serverRoutes.route('/profile')
.get(isLoggedIn, (req, res) => {

});

serverRoutes.route('/logout')
.get((req,res) => {
  req.logout(); // this method is provided by passport!
  res.redirect('/');
});

// end of new passport routes //
///////////////////////////////

serverRoutes.route('/api/create')
.post(/* [,some middleware] */ (req, res) => {
  // invoke marketController.createMarket to add a new market to DB
  marketController.createMarket(req, res);
});

serverRoutes.route('/api/getOne')
.post((req,res) => {

  marketController.fetchOne(req, res);

});

serverRoutes.route('/api/update')
.put((req,res)=>{

	marketController.updateOne(req, res);
});

serverRoutes.route('/api/delete')
.put((req,res)=>{
	console.log("in serverRoutes at delete");
	console.log(req.body, "obj in routes");
	marketController.delete(req,res);
});

serverRoutes.route('/api/add')
.put((req,res)=>{
	marketController.addMarket(req,res);
});



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
};



module.exports = serverRoutes;
