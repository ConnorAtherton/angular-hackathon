var GoogleStrategy = require('passport-google').Strategy;
var config = require('../../config/api').google;
var Mongo = require('../db/mongo');

module.exports = function() {

  if (!config.clientID) throw new Error('A google client id is required if you want to enable login via google.');
  if (!config.clientSecret) throw new Error('A google client secret is required if you want to enable login via google.');

  return new GoogleStrategy(config, function(req, identifier, profile, done) {
      // normalize so it's similiar with facebook and twitter
      profile.id = identifier;
      var opts = {
        profile: profile
      };

      Mongo.User.findOne({
        'google.id': profile.id
      }, function(err, hasAccount) {
        if (err) return done(err);
        if (req.user && hasAccount) return done(null, hasAccount); // already have one

        if (req.user) { // already logged in
          // Get full account object and connect the facebook account to that account
          Mongo.User.findOne(req.user.id, function(err, user) {
            if (err) return done(err);
            return _saveGoogleUser(opts, function(err, updatedUser) { // add account to previous
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
            email: profile.emails[0].value
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
        }
      });
    });
};

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
  var user = existing || new Mongo.User();
  user.google.id = opts.profile.id;
  user.google.name = opts.profile.name;
  user.google.email = opts.profile.emails[0].value;

  user.save(function(err) {
    if (err) return cb(err);
    return cb(null, user);
  });
}
