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
