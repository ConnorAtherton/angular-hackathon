var Mongo = require('../db/mongo');

var accounts = {
  getAll: function(req, res) {
    if (!req.user) {
      return res.json(200, {
        error: 'You are not logged in.'
      });
    }

    Mongo.Account.find({
      _owner: req.user._id
    }, function(err, accounts) {
      if (err) {
        res.send(500, 'Couldn\'t get account');
        res.end();
      } else {
        res.json(200, accounts);
        res.end();
      }
    })
  },

  create: function(req, res, next) {
    var account = req.body,
      id = req.user._id;
    // set some har coded defaults
    account.accountType = 'AWS';
    account.active = false;
    account._owner = id;

    // do some validation here!!!
    Mongo.Account.create(account, function(err, account) {
      if (err) {
        res.send(500, 'Couldn\'t insert into db');
        res.end()
      } else {
        Mongo.User.update({
          _id: id
        }, {
          $push: {
            accounts: account._id
          }
        }, function(err, done) {
          if (err) console.log(err);

          res.send(200, 'fine');
          res.end();
        });

      }
    })
  },

  update: function(req, res, next) {
    var account = req.body,
      id = req.params.id;

    delete account._id;

    Mongo.Account.update({
      _id: id
    }, {
      $set: account
    }, function(err, done) {
      if (err) {
        console.log(err);
        res.send(500, 'Couldn\'t update db');
        res.end()
      } else {
        res.send(200, 'fine');
        res.end();
      }
    })
  },

  delete: function(req, res, next) {
    Mongo.Account.findOneAndRemove({
      _id: req.params.id
    }, function(err, account) {
      if (err) {
        console.log(err);
        res.send(500, 'Couldn\'t delete from db');
        res.end()
      } else {
        console.log(account);
        Mongo.User.update({
          _id: account._owner
        }, {
          $pull: {
            accounts: account._id
          }
        }, function(err) {
          if (err) return console.log(err);
          res.send(200, 'fine');
          res.end();
        })
      }
    })
  }
};

module.exports = accounts;
