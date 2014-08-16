var passport = require('passport');
var TwitterStrategy = require('../strategies/twitter');
var GoogleStrategy = require('../strategies/google');
var FacebookStrategy = require('../strategies/facebook');
var redirects = { successRedirect: '/', failureRedirect: '/login' };

module.exports.addRoutes = function(app, config) {

  passport.use(TwitterStrategy());
  passport.use(FacebookStrategy());
  passport.use(GoogleStrategy());

  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', redirects));

  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', redirects));

  app.get('/auth/google', passport.authenticate('google'));
  app.get('/auth/google/callback', passport.authenticate('google', redirects));

}
