angular.module('AuthManager', [
  'RetryQueue'
])

.factory('AuthManager', ['$http', '$q', '$state', 'RetryQueue', '$location', function($http, $q, $state, RetryQueue, $location) {

  function retry(success) {
    if (success) {
      RetryQueue.retryAll();
    } else {
      RetryQueue.cancelAll();
    }
  }

  RetryQueue.onItemAddedCallbacks.push(function(retryItem) {
    if (RetryQueue.hasMore()) {
      $state.go('login');
    }
  });

  // The public API of the service
  var api = {

    getLoginReason: function() {
      return RetryQueue.retryReason();
    },

    register: function(user) {
      return $http.post('/register', user).then(function(res) {
        api.currentUser = res.data.user;
        if (api.isAuthenticated()) {
          return RetryQueue.hasMore() ? retry(true) : $state.go('home');
        }
        return api.isAuthenticated();
      });
    },

    login: function(user) {
      return $http.post('/login', user).then(function(res) {
        api.currentUser = res.data.user;
        if (api.isAuthenticated()) {
          return RetryQueue.hasMore() ? retry(true) : $state.go('home');
        }
        return api.isAuthenticated();
      });
    },

    logout: function() {
      $http.post('/logout').then(function() {
        api.currentUser = null;
        // make sure to clear the retry queue
        // so it is empty if they try to log back in
        retry(false);
        $state.go('home');
      }, function() {
        console.log('[ERROR LOGGING OUT]');
      });
    },

    requestCurrentUser: function () {
      if (api.isAuthenticated()) {
        // need to return a promise here so the
        // auth provider can resolve it in a route
        return $q.when(api.currentUser);
      } else {
        return $http.get('/current-user').then(function(res) {
          api.currentUser = res.data.user;
          return api.currentUser;
        });
      }
    },

    requireAuthenticatedUser: function (path) {
      return api.requestCurrentUser().then(function(user) {
        if (api.isAuthenticated()) {
          // Recursively calls about state resolve
          // return $state.go("path");
          return $location.path(path);
        } else {
          return RetryQueue.pushRetryFn('You need to be logged in to view this page.', api.requireAuthenticatedUser, path);
        }
      });
    },

    redirectIfAuthenticated: function(route) {
      var deferred = $q.defer();

      if (!api.isAuthenticated()) {
        deferred.resolve();
      } else {
        deferred.reject();
        $location.path((route || '/'));
      }

      return deferred.promise;
    },

    forceUserRefresh: function() {
      return $http.get('/current-user').then(function (res) {
        api.currentUser = res.data.user;
        return api.currentUser;
      });
    },

    isAuthenticated: function() {
      return !!api.currentUser;
    },

    // stores state of the current user
    // and account details etc
    currentUser: null
  };

  return api;
}]);
