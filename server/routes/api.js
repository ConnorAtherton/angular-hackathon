var passport = require('passport');
var accounts = require('../lib/accounts');
var servers = require('../lib/servers');
var middleware = require('../lib/middleware');

module.exports.addRoutes = function(app, config) {

  // All api routes from this point on are protected
  app.use('/api/*', middleware.isAuthenticated);

  app.get('/api/accounts', accounts.getAll);
  app.post('/api/accounts', accounts.create);
  app.put('/api/accounts/:id', accounts.update);
  app.delete('/api/accounts/:id', accounts.delete);

  app.get('/api/servers', servers.getAll);
  app.post('/api/servers', servers.launch);

  app.get('/api/applications', servers.getApplications);

}
