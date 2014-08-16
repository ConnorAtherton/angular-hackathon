var express = require('express');

exports.addRoutes = function(app, config) {

  //
  // THOUGHT
  // Should gulp copy these from jade and let express render
  // them instead? That way we could insert data into server
  // templates.
  //

  app.get('/', function(req, res) {
    res.sendfile(config.dist + '/index.html');
  });

  app.get('/test', function(req, res) {
    console.log('hitting the test route');
    res.json(200, { message: 'Working fine amigo' });
  });

  app.get('/contact', function(req, res) {
    res.send(500);
    // res.sendfile(config.dist + '/index.html');
  });

};
