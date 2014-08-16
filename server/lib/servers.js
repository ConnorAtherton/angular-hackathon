var Bitnami = require('./bitnami');

var servers = {
  getAll: function (req, res, next) {
    console.log('Got request for all instances');
    var state = Bitnami.init(req.user);

    if (state === 'error') {
      return res.send('403', { message: 'Please add an AWS account.'});
    }

    Bitnami.getAllInstances(function (err, response) {
      if (err) return console.log(err);
      res.send(response);
      res.end();
    });
  },

  launch: function (req, res, next) {
    console.log('Trying to launch a server..');
    // fetch user secret keys
    // var user  = getUser(req.user);
    var options = {} //req.body.server;
    options.name = 'Bitnamo Demo Server Name';
    var state = Bitnami.init(req.user, options);

    if (state === 'error') {
      return res.send('403', { message: 'Please add an AWS account. '});
    }

    Bitnami.launchInstance(function (err, instanceId) {
      if (err) return console.log(err);
      var status = servers.checkStatus(instanceId);
      res.send(status);
      res.end();
    });

  },

  checkStatus: function (instanceId) {
    return {status: 'Initialising'};
  },

  stop: function (req, res, next) {

  },

  start: function (req, res, next) {

  },

  restart: function (req, res, next) {

  },

  getApplications: function (req, res, next) {
    res.send(200);
    res.end();
  }
};

module.exports = servers;
