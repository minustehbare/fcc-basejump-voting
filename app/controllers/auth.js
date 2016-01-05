var express = require('express');
var router = new express.Router();

module.exports = function(passport) {
  router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

  router.get('/github/callback',
    passport.authenticate('github', { 'failureRedirect': '/' }),
    function(req, res) {
      res.redirect('/');
    }
  );

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
};
