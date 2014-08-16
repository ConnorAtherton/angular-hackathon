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
