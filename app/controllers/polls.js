var express = require('express');
var router = new express.Router();

router.get('/', function(req, res, next) {
  res.render('polls/index');
});

router.get('/new', function(req, res, next) {
  res.render('polls/new');
});

router.get('/:id', function(req, res, next) {
  res.render('polls/show');
});

router.get('/:id/edit', function(req, res, next) {
  res.render('polls/edit');
});

module.exports = router;
