var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Mongo = require('../db/mongo');
var SALT = require('../../config/config').db.salt; // maybe use __dirname here?

var connection = Mongo.connect();

function DatabaseStrategy() {
  Mongo.seed();
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
  passport.use(new LocalStrategy({ usernameField: 'email' }, verify));
}

function verify(email, password, done) {
  Mongo.User.findOne({ email: email }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'There is no user with that email.' });
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if (!isMatch) return done(null, false, { message: 'The password does not match that email.' });
      return done(null, user);
    });
  });
}

function serializeUser(user, done) {
  done(null, user._id);
}

function deserializeUser(id, done) {
  Mongo.User.findById(id, function(err, user) {
    return done(err, user);
  });
}

module.exports.Strategy = DatabaseStrategy;
