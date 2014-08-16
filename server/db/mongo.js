var mongo = require('mongodb');
var mongoose = require('mongoose');
var user = require('./seed');
var db = null;

var Mongo = {
  connect: function() {
    mongoose.connect('mongodb://localhost:27017/test');
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log('Connected to DB');
    });
    return db;
  },

  seed: function seed() {
    Mongo.User.find({}, function(err, collection) {
      if (err) return console.log('Error whilst seeding DB', err);
      if (collection.length === 0) {
        console.log('Seeding user...');
        Mongo.User.create(user);
        console.log('Done.');
      }
    });
  },

  // each collection should be attached to the Mongo object
  // so its schema can be used for querying
  User: require('./models/user'),
  Account: require('./models/account'),

}

module.exports = Mongo;
