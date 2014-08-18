var passport = require('passport');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var csrf = require('csurf');
var express = require('express');
var http = require('http');
var socket = require('socket.io');
var auth = require('./lib/auth');
var config = require('../config/config').server;
var app = module.exports = express();

//
// Middleware (remember that order matters!)
//
app.use(morgan(':remote-addr :method :url'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(express.static(config.dist));
app.use(cookieParser(config.secret));
app.use(cookieSession({ secret: config.secret }));

//
// Load cert files here if using https.
//

// app.use(csrf());
// app.use(function(req, res, next) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   next();
// });

//
// This initialises the passport local strategy
// the rest are added in the oauth route file
//
auth.initialise();
app.use(passport.initialize());
app.use(passport.session());

//
// Routes
//
require('./routes/auth').addRoutes(app, config);
require('./routes/oauth').addRoutes(app, config);
require('./routes/static').addRoutes(app, config);
require('./routes/404').addRoutes(app, config);

//
// Add last minute error handling down here after all routes!
// Could stream the stack to a log file?
//
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { message: err.message });
});

//
// Start the server
//
var server = http.createServer(app).listen(config.port, '0.0.0.0', 511, function() {
  console.log('Listening on port', config.port);
});

//
// Connect socket.io to express server
//
var io = socket.listen(server);

//
// Socket api logic
//
require('./api/sockets').addSocket(io);
