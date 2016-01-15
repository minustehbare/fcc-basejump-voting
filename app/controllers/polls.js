var express = require('express');
var router = new express.Router();

router.route('/')
.get(function(req, res, next) {
  res.render('polls/index');
})
.post(function(req, res, next) {
  res.send('created new poll');
});

router.route('/new')
.get(function(req, res, next) {
  res.render('polls/new');
});

router.route('/:id')
.get(function(req, res, next) {
  res.render('polls/show');
})
.put(function(req, res, next) {
  res.send('updated poll');
})
.delete(function(req, res, next) {
  res.send('deleted poll');
});

router.route('/:id/edit')
.get(function(req, res, next) {
  res.render('polls/edit');
});

module.exports = router;
