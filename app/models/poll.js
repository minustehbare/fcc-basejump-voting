var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var optionSchema = new Schema({
  '_id': false,
  'text': { 'type': String, 'required': true },
  'votes': { 'type': Number, 'required': true, 'default': 0 }
});

var pollSchema = new mongoose.Schema({
  'creator': { 'type': String, 'required': true },
  'question': { 'type': String, 'required': true },
  'options': {
    'type': [ optionSchema ],
    'validate': [
      {
        'validator': function(v) {
          return v.length >= 2;
        },
        'message': 'Poll must have at least two options'
      },
      {
        'validator': function(v) {
          var temp = v.reduce(function(acc, option) {
            if (acc.indexOf(option.text) === -1) acc.push(option.text);
            return acc;
          }, []);

          return v.length === temp.length;
        },
        'message': 'Poll options must be unique'
      }
    ]
  }
});

pollSchema.index({ 'creator': 1, 'question': 1 }, { 'unique': true });

pollSchema.methods.addOption = function(text) {
  this.options.push({ 'text': text });
};

var Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;

