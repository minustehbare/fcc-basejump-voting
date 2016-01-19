var GitHubStrategy = require('passport-github2');
var User = require('../app/models/user.js');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    var user = User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new GitHubStrategy(
    {
      'clientID': process.env.GITHUB_CLIENT_ID,
      'clientSecret': process.env.GITHUB_CLIENT_SECRET,
      'callbackURL': process.env.APP_URL + '/auth/github/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        User.findOne({
          'accounts': {
            '$elemMatch': {
              'provider': profile.provider,
              'id': profile.id
            }
          }
        },
        function(err, user) {
          if (err) {
            throw err;
          }

          if (!user) {
            return createUser(profile, done);
          }
          else {
            return done(null, user);
          }
        });
      });
    }
  ));
};

function createUser(profile, done) {
  var newUser = new User();
  newUser.accounts = [{
    'provider': profile.provider,
    'id': profile.id
  }];

  if (profile.username) {
    User.count({ 'username': profile.username }, function(err, count) {
      if (err) {
        throw err;
      }

      if (count === 0) {
        newUser.username = profile.username;
      }
      else {
        newUser.username = newUser.id;
      }

      newUser.save(function(err) {
        if (err) {
          return done(err, null);
        }

        return done(null, newUser);
      });
    });
  }
}
