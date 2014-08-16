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
