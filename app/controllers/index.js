var express = require('express');
var router = new express.Router();
var User = require('../models/user');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/:id', function(req, res, next) {
  User.findOne({ 'username': req.params.id }, function(err, user) {
    if (err) {
      res.status(500).send({ 'error': err });
    }
    else {
      res.render('user', { 'showUser': user});
    }
  });
});

module.exports = router;
