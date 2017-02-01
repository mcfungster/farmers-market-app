var express    = require('express');
var mongoose   = require('mongoose');
var passport   = require('passport');
var flash      = require('connect-flash');

var morgan       = require('morgan');
var path         = require('path');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

var keys    = require('../API_KEYS.js');
var port    = process.env.PORT || 8080;
var routes  = require('./routes/routes.js');


// setup mongodb connection
var mongoURI = process.env.mongoURI || keys.mongoURI;
mongoose.connect(mongoURI);

// configure passport
// require('./config/passport')(passport);


var app = express();

// app.set('superSecret', keys.secret);   // what does this do??
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// passport
app.use(session({secret: keys.secret}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// routing
app.use(express.static(path.join(__dirname, '../client')));
app.use(routes);


app.listen(port);
console.log("server running on port " + port);

// module.exports = app;
