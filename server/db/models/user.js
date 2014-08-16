var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Account = require('./account');
var Schema = mongoose.Schema;

var User = new Schema({
  email: {
    type: String,
    unique: true
  },
  password: String,
  fullName: String,
  joinDate: Date,
  defaultAccount: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  accounts: [{
    type: Schema.Types.ObjectId,
    ref: 'Account'
  }],
  date: {
    type: Date,
    default: Date.now
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

User.pre('save', function(next) {
  // if the password isn't modified then we
  // don't want to hash it again
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

User.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', User);
