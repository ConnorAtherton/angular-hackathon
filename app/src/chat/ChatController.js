angular.module('Chat', [])

.config(function($stateProvider) {

  $stateProvider
    .state('chat', {
      url: '/chat',
      controller: 'ChatCtrl',
      templateUrl: 'chat/chat.tpl.html'
    });
})

.controller('ChatCtrl', ['$scope', 'socket', function ($scope, socket) {

  $scope.messages = [];

  $scope.sendMessage = function() {
    socket.emit('message', $scope.message);
    $scope.message = '';
  };

  socket.on('message:new', function(msg) {
    $scope.messages.push(msg);
  });

}]);
