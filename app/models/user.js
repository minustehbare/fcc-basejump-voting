var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountsSchema = new Schema({
  '_id': false,
  'provider': { 'type': String, 'required': true },
  'id': { 'type': String, 'required': true }
});

var userSchema = new Schema({
  'username': { 'type': String, 'unique': true, 'required': true },
  'accounts': {
    'type': [accountsSchema],
    'validate': [
      {
        'validator': function(v) {
          return v.length >= 1;
        },
        'message': 'User must have at least one account'
      },
      {
        'validator': function(v, done) {
          var x = v.length;
          var y = 0;

          for (var i = 0; i < x; i++) {
            mongoose.model('User').count({
              'accounts': {
                '$elemMatch': {
                  'provider': v[i].provider,
                  'id': v[i].id
                }
              }
            }, function(err, count) {
              if (err) throw err;

              y = y + 1;
              if (count != 0) done(false);
              if (y === x) done(true);
            });
          }
        },
        'message': 'A user with that account already exists'
      }
    ]
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User;

