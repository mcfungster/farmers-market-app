var marketController = require('../controllers/marketController');
var adminController = require('../controllers/adminController');

var twilio = require('../controllers/twilioController');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(app, passport) {
  // this single, one-time admin setup should only be invoked once. As long as the database has 1 instance of the admin, this route should never ever be visited a second time.
  app.get('/setup', (req, res) => {
    adminController.setup(req, res);
  });

  app.get('/api/search', /* [,some middleware] */ (req, res) => {
    // invoke marketController.getRadiusMarkets to make query to DB
    marketController.getLocationMarkets(req, res);
  });

  app.post('/api/login', (req, res) => {
    adminController.login(req, res);
  });

  app.post('/api/create', /* [,some middleware] */ (req, res) => {
    // invoke marketController.createMarket to add a new market to DB
    marketController.createMarket(req, res);
  });

  app.post('/api/getOne', (req,res) => {
    marketController.fetchOne(req, res);
  });

  app.put('/api/update', (req,res)=>{
    marketController.updateOne(req, res);
  });

  app.put('/api/delete', (req,res)=>{
    // console.log("in serverRoutes at delete");
    console.log(req.body, "obj in routes");
    marketController.delete(req,res);
  });

  app.put('/api/add', (req,res)=>{
    marketController.addMarket(req,res);
  });

  app.post('/api/createComment', (req, res) => {
    console.log('1) Hitting createComment route...   ', req.body)
    marketController.createComment(req, res)
  })



  /************************************
  * new routes for passport and auth *
  ************************************/
  app.post('/signup', function(req, res, next) {
    console.log('routes.js  attempting to signup');
    passport.authenticate('local-signup', function(err, user, info) {
      if (err) return next(err); // will generate a 500 error
      // Generate a JSON response reflecting signup
      if (!user) {
        return res.send({ success : false, message : 'signup failed' });
      }
      req.session.cookie.expires = false;
      return res.send({ success : true, message : 'signup succeeded', user: user });
    })(req, res, next);
  });


  // app.post('/login',
  //   passport.authenticate('local'),
  //   function(req, res) {
  //     // If this function gets called, authentication was successful.
  //     // `req.user` contains the authenticated user.
  //     res.redirect('/users/' + req.user.username);
  //   });



  app.post('/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) {
        console.log('err: ', err);
        return next(err); // will generate a 500 error
      }
      // Generate a JSON response reflecting successful login
      if (!user) {
        console.log('routes.js: login failed');
        return res.send({ success : false, message : 'login failed' });
      }
      console.log('routes.js: login successful');
      req.login(user, function() {
        return res.send({ success : true,
          message : 'login succeeded',
          user: user
        });
      })
    })(req, res, next);
  });

  app.get('/logout', (req, res) => {
    console.log('routes.js LOGGING OUT');
    req.logout();
    passport.user = null;
    console.log('routes.js LOGGING OUT', passport.user);
    res.redirect('/');
  });

  app.get('/api/isAuth', (req, res) => {
    console.log('routes.js passport obj: ', passport);
    console.log('routes.js passport.user obj: ', passport.user);
    res.send(passport.user);
  });


  app.post('/message', (req, res) => {
      var time = 1000
      req.body.forEach((num) => {
          var phone = num.phoneNum;
          var content = num.message;
          setTimeout(twilio.sendMessage, time, phone, content);
          time += 1000
      })
      res.status(200).send();

  })

}

// auth middleware for protected routes
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}



// module.exports = serverRoutes; // relic from pre-refactor
