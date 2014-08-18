angular.module('nghack', [
  'btford.socket-io',
  'templates',
  'ui.router',
  'ui.bootstrap',
  'ngResource',

  'Directives',
  'Services',

  'Chat'
])

.config(function myAppConfig($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

  $urlRouterProvider.otherwise('/404');
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "home.tpl.html",
    })
    .state('about', {
      url: "/about",
      templateUrl: "about.tpl.html",
      resolve: {
        auth: function(AuthManager) {
          console.log('Auth', AuthManager);
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

  $httpProvider.interceptors.push(function($q, $location, $rootScope) {
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

.run(function($rootScope, $state, AuthManager) {
  // Check to see if a user is already logged in
  // from a previous session.
  AuthManager.requestCurrentUser();
  // add class to ui-view based on current state
  $rootScope.currentAppClass = 'state-' + $state.current;

  $rootScope.$watch(function () {
    return $state.current;
  }, function(current) {
    $rootScope.currentAppClass = 'state-' + current.name;
  });

})

.controller('AppCtrl', function AppCtrl($scope, $state, AuthManager) {

  $scope.authenticated = AuthManager.isAuthenticated;

  $scope.isPage = function(page) {
    return $state.is(page);
  };

  $scope.getState = function() {
    return $state.current();
  };

  $scope.$watch(function () {
    return AuthManager.isAuthenticated();
  }, function (currentUser) {
    $scope.authenticated = currentUser;
  });

});
