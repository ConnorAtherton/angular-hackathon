FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../../config/api').facebook;
var Mongo = require('../db/mongo');

//
// Strategy
//
// I get the feeling this could be simplified but its already 1.30am
// and my brain isn't working at full capacity.
//
// if logged_in --> Connect account
//   if already_have_account --> Return message saying that it's connected ??
//   else connect_account --> Add information to account in db. Each service has it's own field in collection
// else not_logged_in --> Add account
//    if already_have_account --> Authenticate user
//    else dont_have_account --> Create account and authenticate user
//
// -----------------------------------------------------------------------
//
// Strategy v2
//
// already_have_account --> Check straight away.
//  if logged_in and already_have_account --> Already connected. Return.
//  if logged_in --> connect account
//  else not_logged_in --> Create account and authenticate user
//

module.exports = function() {

  if (!config.clientID) throw new Error('A Facebook App ID is required if you want to enable login via Facebook.');
  if (!config.clientSecret) throw new Error('A Facebook App Secret is required if you want to enable login via Facebook.');
  if (!config.callbackURL) throw new Error('A Facebook App callback URL is required if you want to enable login via Facebook.');

  return new FacebookStrategy(config, function(req, accessToken, refreshToken, profile, done) {
    console.log('logging in via facebook');
    var opts = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      profile: profile
    };

    Mongo.User.findOne({ 'facebook.id': profile.id }, function(err, hasAccount) {
      if (err) return done(err);
      if (req.user && hasAccount) return done(null, hasAccount); // already have one


      if (req.user) { // already logged in
        // Get full account object and connect the facebook account to that account
        Mongo.User.findOne(req.user.id, function(err, user) {
          if (err) return done(err);
          return _saveFacebookUser(opts, function(err, updatedUser) { // add fb account to previous
            if (err) return done(err);
            return done(null, updatedUser);
          }, user);
        });
      } else { // not logged in
        // Already has an account so just log them in
        if (hasAccount) return done(null, hasAccount);

        //
        // Don't try and pair accounts with facebook since there are some edge cases
        // where it fails to return an email
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
          return _saveFacebookUser(opts, function(err, newUser) {
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
// facebook credentials attached
// @param {object} opts Options returned from facebook
// @param {function} cb Function to call to indicate success or error
// @param {object} user Mongoose schema user objects. Used to update existing users account.
// @private
// @returns {function} callback with an error and the new user
//
function _saveFacebookUser(opts, cb, existing) {
  var user = existing || new Mongo.User();
  user.facebook.email = opts.profile._json.email || undefined;
  user.facebook.id = opts.profile.id;
  user.facebook.accessToken = opts.accessToken;
  user.facebook.name = opts.profile.name || opts.profile.name.givenName + ' ' + opts.profile.name.familyName;
  user.facebook.picture = opts.profile.picture || 'https://graph.facebook.com/' + user.facebook.id + '/picture?type=large';

  user.save(function(err) {
    if (err) return cb(err);
    return cb(null, user);
  });
}
