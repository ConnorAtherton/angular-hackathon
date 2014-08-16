var passport = require('passport');
var auth = require('../lib/auth');

exports.addRoutes = function(app, config) {

  app.post('/login', auth.login);
  app.post('/logout', auth.logout);
  app.post('/register', auth.register);
  // password reset
  //app.post('/login/reset', auth.reset);

  app.get('/current-user', auth.sendCurrentUser);

};
