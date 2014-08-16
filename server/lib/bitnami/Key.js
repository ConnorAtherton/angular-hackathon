var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

var params = {
  KeyName: 'BitnamoHostingDemo'
};
var globalUser;

var api = {
  createKeyPair: function (ec2, user, callback) {
    globalUser = user;
    console.log('Creating a new key pair');
    ec2.createKeyPair(params, function (err, response) {
      if (err) {
        if (err.code === 'InvalidKeyPair.Duplicate') return callback(null, params.KeyName);
        return callback(err, null);
      }
      console.log('Created key', response.KeyName);
      api.saveKeyPair(response.KeyMaterial, function (err) {
        if (err) return callback(err, null);
        return callback(null, response.KeyName);
      });
    })
  },

  saveKeyPair: function (key, callback) {
    var filename = 'keys/' + globalUser._id + '-bitnamo-key.pem';
    console.log(path.dirname(filename));
    mkdirp(path.dirname(filename), function (err) {
      if (err) return callback(err);
      fs.writeFile(filename, key, function (err) {
        if (err) return callback(err);
        console.log('Key created - ', path.basename(filename));
        return callback();
      })
    })
  }
}

module.exports = api;
