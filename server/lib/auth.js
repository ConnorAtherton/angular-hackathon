var express = require('express');
var passport = require('passport');
var _ = require('lodash');
var crypto = require('crypto');
var User = require('../db/models/user');
var DatabaseStrategy = require('../strategies/local').Strategy;
var Mongo = require('../db/mongo');
var SALT = require('../../config/config').db.salt;

var filterUser = function(user) {
  if (user) {
    return {
      user: {
        email: user.email,
        accounts: _.map(user.accounts, function (account) {
          return account;
        }),
        fullName: user.fullName,
        joinDate: user.joinDate
      }
    };
  } else {
    return { user: null };
  }
}

var auth = {
  initialise: function() {
    DatabaseStrategy();
  },

  // login: function(req, res, next, user) {
  //   // var mode = user ? 'register' : 'login';
  //   // console.log('Logging in in mode', mode);
  //   // req.logIn( (user || req.user) , function(err) {
  //   //   if (err) return next(err);
  //   //   return res.json(filterUser(req.user));
  //   // });
  //   console.log('login route');
  //   passport.authenticate('local', function (err, user, info) {
  //     console.log('trying to authenticate');
  //     if (err) return next(err);
  //     if (!user) return res.json(401, info);
  //     req.logIn(user, function(err) {
  //       if (err) return next(err);
  //       return res.json(filterUser(req.user));
  //     });
  //   })(req, res, next);
  // },
  login: function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) return next(err);
      if (!user) return res.json(401, info)
      req.logIn(user, function(err) {
        if (err) return next(err);
        return res.send(filterUser(user));
      });
    })(req, res, next);
  },

  logout: function(req, res, next) {
    req.logout();
    res.send(200);
  },

  register: function(req, res, next) {
    var user = new User({
      email: req.body.email,
      password: req.body.password
    });

    auth.verifyUniqueEmail(user.email, res, function (err, doc) {
      if (err) return next(err);
      if (doc) return res.send(401, {message: 'There is already a user with that email. Please pick another one.'});

      user.save(function (err) {
        if (err) return next(err);
        return auth.login(req, res, next);
      });
    });
  },

  //
  // TODO
  // Use this to check if an email is valid as
  // they fill out the register form
  //
  verifyUniqueEmail: function (email, res, cb) {
    return Mongo.User.findOne({ email: email }, function (err, doc) {
      if (err) return cb(err);
      if (doc) return cb(null, doc);
      return cb(null, null)
    });
  },

  sendCurrentUser: function(req, res, next) {
    res.json(200, filterUser(req.user));
  }

}

module.exports = auth;
