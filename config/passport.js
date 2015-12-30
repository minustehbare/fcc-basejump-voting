var GitHubStrategy = require("passport-github2");

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  var options = 
  passport.use(new GitHubStrategy({
    "clientID": process.env.GITHUB_CLIENT_ID,
    "clientSecret": process.env.GITHUB_CLIENT_SECRET,
    "callbackURL": process.env.APP_URL + "/auth/github/callback"
  },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        return done(null, profile);
      });
    }
  ));
};
