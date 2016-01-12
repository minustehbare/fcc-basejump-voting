var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var accountsSchema = new Schema({
  '_id': false,
  'provider': String,
  'id': String
});

var userSchema = new Schema({
  'username': { 'type': String, 'unique': true },
  'accounts': [accountsSchema]
});

var User = mongoose.model('User', userSchema);

module.exports = User;

