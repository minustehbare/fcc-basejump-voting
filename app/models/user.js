var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

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
        'validator': function(v) {
          return mongoose.model('User').count({
            'accounts': {
              '$elemMatch': {
                'provider': v.provider,
                'id': v.id
              }
            }
          }, function(err, count) {
            if (err) {
              throw err;
            }

            return count === 0;
          });
        },
        'message': 'A user with that account already exists'
      }
    ]
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User;

