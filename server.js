// server.js
// where your node app starts

// init project
var express = require('express');
var db = require('./db');
var auth = require('./auth')(db);
var app = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var nunjucks = require('nunjucks');
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var configDB = require('./config/database.js');
//var configPassport = require('./config/passport.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

// require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: process.env.TWITTER_CONSUMER_SECRET })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/dashboard", function (request, response) {
  var username = request.param('user');
  var password = request.param('pass');
  //response.json(null);
  //response.json({ user: username });
  //response.json({ pass: password});
  //response.status(500).json({ error: 'message' });
  response.sendFile(__dirname + '/views/dashboard.html');
});

app.get("/calendar", function (request, response){
  response.sendFile(__dirname + '/views/calendar.html');
});
// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body



app.get('/login/twitter', passport.authenticate('TwitterStrategy', {failureRedirect: '/login'}),
       function(req, res) {
  res.redirect('/');
});

// Simple in-memory store for now
/*
var Users = [
  {
  username: "@williamkhepri",
  password:  "CCVf4sqc"
  //reditect to dashboard with these data
  }
];*/

// listen for requests :)
/*var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
*/