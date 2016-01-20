var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var mongoose = require('mongoose');

// load .env settings
require('dotenv').load();

// Passport setup
require('../config/passport')(passport);

// Mongoose setup
require('../config/mongoose')(mongoose);

var routes = require('./controllers/index');
var users = require('./controllers/users');
var auth = require('./controllers/auth')(passport);
var polls = require('./controllers/polls');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  'secret': process.env.SESSION_SECRET,
  'resave': false,
  'saveUninitialized': false
}));
app.use(express.static(path.join(__dirname, '../public')));
app.use(passport.initialize());
app.use(passport.session());

// set locals
app.use(function(req, res, next) {
  res.locals.currentUser = req.isAuthenticated() ? req.user : null;
  next();
});

// bind controller routes
app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);
app.use('/polls', polls);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
