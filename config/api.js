module.exports = {
  facebook: {
    clientID: process.env.FACEBOOK_ID || '840289459325731',
    clientSecret: process.env.FACEBOOK_SECRET || '5b15c53c413822c2aefe4cbfdc313b00',
    callbackURL: 'http://localhost:9000' + '/auth/facebook/callback',
    passReqToCallback: true
  },

  twitter: {
    consumerKey: 'HOzQSOkjOYLiAhkgBo4c9Jc90',
    consumerSecret: '4styu3oHqAxzIRhAR2b4zflChNaTeEibVByBrzHQQF8lk79tmo',
    callbackURL: 'http://localhost:9000' + '/auth/twitter/callback',
    passReqToCallback: true
  },

  google: {
    clientID: '228571544440-lm0hj16urj4pca4rhdgj0qedmn858d75.apps.googleusercontent.com',
    clientSecret: 'DzORFGmARsM5Q-n6DvQFfx_b',
    returnURL: 'http://localhost:9000' + '/auth/google/callback',
    passReqToCallback: true
  },

  github: {

  }
}
