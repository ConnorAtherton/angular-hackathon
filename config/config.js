var path = require('path');

module.exports = {
  server: {
    dist: path.join(process.cwd(), '../', 'dist/'),
    port: process.env.PORT || 9000,
    secret: 'cookie-secret'
  },

  db: {
    // salt: 'supersecretsalt'
  }
}
