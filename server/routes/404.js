exports.addRoutes = function(app, config) {

  // This route deals enables HTML5Mode by forwarding missing files to the index.html
  app.all('/*', function(req, res) {
    res.sendfile(config.dist + '/index.html');
  });

};
