var TwitterStrategy = require('passport-twitter').Strategy;
var config = require('../../config/api').twitter;
var Mongo = require('../db/mongo');

module.exports = function() {

  if (!config.consumerKey) throw new Error('A Twitter Consumer Key is required if you want to enable login via Twitter.');
  if (!config.consumerSecret) throw new Error('A Twitter Consumer Secret is required if you want to enable login via Twitter.');

  return new TwitterStrategy(config, function(req, token, tokenSecret, profile, done) {
      var opts = {
        token: token,
        tokenSecret: tokenSecret,
        profile: profile
      };

      Mongo.User.findOne({
        'twitter.id': profile.id
      }, function(err, hasAccount) {
        if (err) return done(err);
        if (req.user && hasAccount) return done(null, hasAccount); // already have one

        if (req.user) { // already logged in
          // Get full account object and connect the facebook account to that account
          Mongo.User.findOne(req.user.id, function(err, user) {
            if (err) return done(err);
            return _saveTwitterUser(opts, function(err, updatedUser) { // add fb account to previous
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
            return _saveTwitterUser(opts, function(err, newUser) {
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
// twitter credentials attached
// @param {object} opts Options returned from twitter
// @param {function} cb Function to call to indicate success or error
// @param {object} user Mongoose schema user objects. Used to update existing users account.
// @private
// @returns {function} callback with an error and the new user
//
function _saveTwitterUser(opts, cb, existing) {
  // console.log(opts.profile._json);
  var user = existing || new Mongo.User();
  user.twitter.id = opts.profile.id;
  user.twitter.token = opts.token;
  user.twitter.tokenSecret = opts.tokenSecret;
  user.twitter.name = opts.profile.displayName;
  // Look at _json for any more information to save to db.
  // We'll just store this for now.
  user.twitter.location = opts.profile._json.location;
  user.twitter.picture = opts.profile._json.profile_image_url;

  user.save(function(err) {
    if (err) return cb(err);
    return cb(null, user);
  });
}
