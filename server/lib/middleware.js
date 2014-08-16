var middleware = {
  isAuthenticated: function (req, res, next) {
    if(req.isAuthenticated()) return next();
    else res.send(401);
  }
}

module.exports = middleware;
