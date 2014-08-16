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
