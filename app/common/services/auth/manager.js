angular.module('AuthManager', [
  'RetryQueue'
])

.factory('AuthManager', ['$http', '$q', '$location', 'RetryQueue', function($http, $q, $state, RetryQueue) {

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

    getLoginReason: function () {
      return RetryQueue.retryReason();
    },

    isAuthenticated: function () {
      return !!api.currentUser;
    },

    register: function (user) {
      return $http.post('/register', user).then(function (res) {
        api.currentUser = res.data.user;
        if (api.isAuthenticated()) {
          return RetryQueue.hasMore() ? retry(true) : $state.go('console');
        }
        return api.isAuthenticated();
      });
    },

    login: function (user) {
      return $http.post('/login', user).then(function (res) {
        console.log('login response', res);
        api.currentUser = res.data.user;
        if (api.isAuthenticated()) {
          return RetryQueue.hasMore() ? retry(true) : $state.go('console');
        }
        return api.isAuthenticated();
      });
    },

    logout: function() {
      $http.post('/logout').then(function () {
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
        return $http.get('/current-user').then(function (res) {
          api.currentUser = res.data.user;
          return api.currentUser;
        });
      }
    },

    requireAuthenticatedUser: function (path, pageName) {
      pageName = pageName ? 'the ' + pageName : 'this';

      var promise = api.requestCurrentUser().then(function(user) {
        if (!api.isAuthenticated()) {
          return RetryQueue.pushRetryFn('You need to be logged in to view ' + pageName + ' page.', api.requireAuthenticatedUser, path, pageName);
        } else {
          $state.go(path);
        }
      });
      return promise;
    },

    redirectIfAuthenticated: function (route) {
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

    getAccounts: function () {
      return api.isAuthenticated() ? api.currentUser.accounts : null;
    },

    // stores state of the current user
    // and account details etc
    currentUser: null
  };

  return api;
}]);
