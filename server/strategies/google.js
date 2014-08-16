var GoogleStrategy = require('passport-google').Strategy;
var config = require('../../config/api').google;
var Mongo = require('../db/mongo');

module.exports = function() {

  if (!config.clientID) throw new Error('A google client id is required if you want to enable login via google.');
  if (!config.clientSecret) throw new Error('A google client secret is required if you want to enable login via google.');

  return new GoogleStrategy(config, function(req, token, tokenSecret, profile, done) {
      var opts = {
        token: token,
        tokenSecret: tokenSecret,
        profile: profile
      }

      Mongo.User.findOne({
        'google.id': profile.id
      }, function(err, hasAccount) {
        if (err) return done(err);
        if (req.user && hasAccount) return done(null, hasAccount); // already have one

        if (req.user) { // already logged in
          // Get full account object and connect the facebook account to that account
          Mongo.User.findOne(req.user.id, function(err, user) {
            if (err) return done(err);
            return _saveGoogleUser(opts, function(err, updatedUser) { // add fb account to previous
              if (err) return done(err);
              return done(null, updatedUser);
            }, user);
          });
        } else { // not logged in
          // Already has an account so just log them in
          if (hasAccount) return done(null, hasAccount);

          //
          // The only way to pair up accounts is to check if the user email
          // is the same as the one supplied to facebook. Else we'll assume they
          // are just different accounts entirely
          //
          Mongo.User.findOne({
            email: profile._json.email
          }, function(err, user) {
            if (err) return done(err);
            if (user) {
              // flash to user saying there is already a person using that email
              // req.flash()
              return done(err);
            }
            return _saveGoogleUser(opts, function(err, newUser) {
              if (err) return done(err);
              return done(err, newUser);
            });
          });
        };
      });
    });
}

//
// Private
//

//
// Accepts an options object and saves a user to the database with
// google credentials attached
// @param {object} opts Options returned from google
// @param {function} cb Function to call to indicate success or error
// @param {object} user Mongoose schema user objects. Used to update existing users account.
// @private
// @returns {function} callback with an error and the new user
//
function _saveGoogleUser(opts, cb, existing) {
  return console.log(opts.profile);
  var user = existing || new Mongo.User();
  user.google.id = opts.profile.id;
  user.google.token = opts.token;
  user.google.tokenSecret = opts.tokenSecret;
  user.google.name = opts.profile.displayName;
  // Look at _json for any more information to save to db.
  // We'll just store this for now.
  user.google.location = opts.profile._json.location;
  user.google.picture = opts.profile._json.profile_image_url

  user.save(function(err) {
    if (err) return cb(err);
    return cb(null, user);
  });
}
