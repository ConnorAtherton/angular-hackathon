angular.module('nghack', [
  'templates',
  'ui.router',
  'ui.bootstrap',
  'ngResource',

  'Directives',
  'Services',
])

.config(function myAppConfig($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

  $urlRouterProvider.otherwise('/404');
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "home.tpl.html",
      resolve: {
        redirect: function (AuthManager) {
          // return AuthManager.redirectIfAuthenticated('console');
        }
      }
    })
    .state('about', {
      url: "/about",
      templateUrl: "about.tpl.html",
      resolve: {
        auth: function (AuthManager) {
          return AuthManager.requireAuthenticatedUser('about');
        }
      }
    })
    // facebook attached this stupid string, just redirect homee
    .state('facebookcb', {
      url: "/_=_", // ui-router strips leading #
      controller: ['$state', function($state) {
        $state.go('home');
      }]
    })
    .state('404', {
      url: "/404",
      templateUrl: "404.tpl.html",
    });

  $httpProvider.interceptors.push(function ($q, $location, $rootScope) {
    return {
      'responseError': function (response) {
        if (response.status === 401 || response.status === 403) {
          $rootScope.appErrorMessage = response.data.message;
          // $location.path('/login');
        }
        return $q.reject(response);
      }
    };
  });
})

.run(function ($rootScope, AuthManager) {
  // Check to see if a user is already logged in
  // from a previous session.
  AuthManager.requestCurrentUser();
})

.controller('AppCtrl', function AppCtrl($scope, $state, AuthManager) {

  $scope.isAuthenticated = AuthManager.isAuthenticated;

  $scope.isPage = function (page) {
    return $state.is(page);
  };

});

angular.module('Directives', [
  'toolbar',
  'Gravatar'
]);

angular.module('Gravatar', [])

// A simple directive to display a gravatar image given an email
.directive('gravatar', ['md5', function(md5) {

  return {
    restrict: 'E',
    template: '<img ng-src="http://www.gravatar.com/avatar/{{hash}}{{getParams}}"/>',
    replace: true,
    scope: {
      email: '=',
      size: '=',
      defaultImage: '=',
      forceDefault: '='
    },
    link: function(scope, element, attrs) {
      scope.options = {};
      scope.$watch('email', function(email) {
        if ( email ) {
          scope.hash = md5(email.trim().toLowerCase());
        }
      });
      scope.$watch('size', function(size) {
        scope.options.s = (angular.isNumber(size)) ? size : undefined;
        generateParams();
      });
      scope.$watch('forceDefault', function(forceDefault) {
        scope.options.f = forceDefault ? 'y' : undefined;
        generateParams();
      });
      scope.$watch('defaultImage', function(defaultImage) {
        scope.options.d = defaultImage ? defaultImage : undefined;
        generateParams();
      });
      function generateParams() {
        var options = [];
        scope.getParams = '';
        angular.forEach(scope.options, function(value, key) {
          if ( value ) {
            options.push(key + '=' + encodeURIComponent(value));
          }
        });
        if ( options.length > 0 ) {
          scope.getParams = '?' + options.join('&');
        }
      }
    }
  };
}])

.factory('md5', function() {
  function md5cycle(x, k) {
    var a = x[0],
      b = x[1],
      c = x[2],
      d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);

  }

  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }

  function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }

  function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }

  function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  function md51(s) {
    txt = '';
    var n = s.length,
      state = [1732584193, -271733879, -1732584194, 271733878],
      i;
    for (i = 64; i <= s.length; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++) {
      tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    }
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) {
        tail[i] = 0;
      }
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }

  /* there needs to be support for Unicode here,
   * unless we pretend that we can redefine the MD-5
   * algorithm for multi-byte characters (perhaps
   * by adding every four 16-bit characters and
   * shortening the sum to 32 bits). Otherwise
   * I suggest performing MD-5 as if every character
   * was two bytes--e.g., 0040 0025 = @%--but then
   * how will an ordinary MD-5 sum be matched?
   * There is no way to standardize text to something
   * like UTF-8 before transformation; speed cost is
   * utterly prohibitive. The JavaScript standard
   * itself needs to look at this: it should start
   * providing access to strings as preformed UTF-8
   * 8-bit unsigned value arrays.
   */

  function md5blk(s) { /* I figured global was faster.   */
    var md5blks = [],
      i; /* Andy King said do it this way. */
    for (i = 0; i < 64; i += 4) {
      md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }

  var hex_chr = '0123456789abcdef'.split('');

  function rhex(n) {
    var s = '', j = 0;
    for (; j < 4; j++) {
      s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
    }
    return s;
  }

  function hex(x) {
    for (var i = 0; i < x.length; i++) {
      x[i] = rhex(x[i]);
    }
    return x.join('');
  }

  function md5(s) {
    return hex(md51(s));
  }

  /* this function is much faster,
  so if possible we use it. Some IEs
  are the only ones I know of that
  need the idiotic second function,
  generated by an if clause.  */

  add32 = function(a, b) {
    return (a + b) & 0xFFFFFFFF;
  };

  if (md5('hello') !== '5d41402abc4b2a76b9719d911017c592') {
    add32 = function (x, y) {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF),
        msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    };
  }

  return md5;
});

angular.module('Services', [
  'AuthService'
]);

angular.module('toolbar', [
  'AuthManager'
])

// The loginToolbar directive is a reusable widget that can show login or logout buttons
// and information the current authenticated user
.directive('loginToolbar', ['AuthManager',
  function(AuthManager) {
    var directive = {
      templateUrl: 'directives/toolbar/toolbar.tpl.html',
      restrict: 'E',
      replace: true,
      scope: true,
      link: function($scope, $element, $attrs, $controller) {
        $scope.isAuthenticated = AuthManager.isAuthenticated;
        $scope.login = AuthManager.showLogin;
        $scope.logout = AuthManager.logout;
        $scope.currentUser = null;

        $scope.$watch(function() {
            return AuthManager.currentUser;
          },
          function(currentUser) {
            $scope.currentUser = currentUser;
          });
      }
    };
    return directive;
  }
]);

angular.module('AuthService', [
  // 'Auth.AuthProvider',
  // 'Services.Authinterceptor',
  'AuthManager',
  'RetryQueue',
  'Login',
  'Register'
]);

angular.module('interceptor', [

]);

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

angular.module('RetryQueue', [])

// This is a generic retry queue for security failures.  Each item is expected to expose two functions: retry and cancel.
.factory('RetryQueue', ['$q', '$log',
  function($q, $log) {
    var retryQueue = [];
    var service = {
      // The security service puts its own handler in here!
      onItemAddedCallbacks: [],

      hasMore: function() {
        return retryQueue.length > 0;
      },
      push: function(retryItem) {
        retryQueue.push(retryItem);
        // Call all the onItemAdded callbacks
        angular.forEach(service.onItemAddedCallbacks, function(cb) {
          try {
            cb(retryItem);
          } catch (e) {
            $log.error('RetryQueue.push(retryItem): callback threw an error' + e);
          }
        });
      },
      pushRetryFn: function(reason, retryFn) {
        var args;
        // The reason parameter is optional
        if (arguments.length === 1) {
          retryFn = reason;
          reason = undefined;
          args = [].slice.call(arguments, 1);
        }

        args = [].slice.call(arguments, 2);

        // The deferred object that will be resolved or rejected by calling retry or cancel
        var deferred = $q.defer();
        var retryItem = {
          reason: reason,
          retry: function() {
            // Wrap the result of the retryFn into a promise if it is not already
            $q.when(retryFn.apply(this, args)).then(function(value) {
              // If it was successful then resolve our deferred
              deferred.resolve(value);
            }, function(value) {
              // Othewise reject it
              deferred.reject(value);
            });
          },
          cancel: function() {
            // Give up on retrying and reject our deferred
            deferred.reject();
          }
        };
        service.push(retryItem);
        return deferred.promise;
      },
      retryReason: function() {
        return service.hasMore() ? retryQueue[0].reason : '';
      },
      cancelAll: function() {
        while (service.hasMore()) {
          retryQueue.shift().cancel();
        }
      },
      retryAll: function() {
        while (service.hasMore()) {
          retryQueue.shift().retry();
        }
      }
    };
    return service;
  }
]);

angular.module('Login', [
  'AuthManager'
])

.config(function($stateProvider) {

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'services/auth/login/login.tpl.html',
      controller: 'LoginCtrl',
      resolve: {
        redirect: function(AuthManager) {
          return AuthManager.redirectIfAuthenticated();
        }
      }
    });

})

.controller('LoginCtrl', function LoginCtrl($scope, $window, AuthManager) {

  $scope.user = {};
  $scope.message = null;

  $scope.login = function() {
    AuthManager.login($scope.user).catch(function(loggedIn) {
      $scope.message = 'Email and password don\'t match.';
    });
  };

  $scope.getLoginReason = function() {
    return AuthManager.getLoginReason();
  };

  $scope.loginWith = function(provider) {
    $window.location.href = ('/auth/' + provider);
  };

});

angular.module('Register', [
  'AuthManager'
])

.config(function($stateProvider) {

  $stateProvider
    .state('register', {
      url: '/register',
      templateUrl: 'services/auth/register/register.tpl.html',
      controller: 'RegisterCtrl',
      resolve: {
        redirect: function(AuthManager) {
          return AuthManager.redirectIfAuthenticated();
        }
      }
    });

})

.controller('RegisterCtrl', function($scope, $window, AuthManager) {

  $scope.user = {};
  $scope.message = null;

  $scope.register = function() {
    AuthManager.register($scope.user).catch(function (res) {
      console.log('Registration error', res);
      $scope.message = res.data.message;
    });
  };

  $scope.loginWith = function(provider) {
    $window.location.href = ('/auth/' + provider);
  };

});
