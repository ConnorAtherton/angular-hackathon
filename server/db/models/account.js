var mongoose = require('mongoose');
var User = require('./user');
var Schema = mongoose.Schema;

var Account = new Schema({
  name: String,
  dateCreated: Date,
  dateAdded: Date,
  accessKey: String,
  defaultAccount: Boolean,
  accountType: String,
  secretAccessKey: String,
  active: Boolean,
  _owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Account', Account);
