describe('AppCtrl tests', function () {

  // Module method allows us to specify
  // modules that should be used in a test
  beforeEach(module('nghack'));

  var $scope;
  var $rootScope;
  var $httpBackend;
  var $state;
  var authRequestHandler;
  var createController;

  beforeEach(inject(function (_$rootScope_, _$state_,  _$httpBackend_, $controller) {
    $scope = _$rootScope_.$new();
    $rootScope = _$rootScope_;
    $state = _$state_;
    $httpBackend = _$httpBackend_;
    authRequestHandler = $httpBackend.when('GET', '/current-user')
                          .respond(401, {user: null});
    createController = function() {
      return $controller('AppCtrl', { '$scope': $scope });
    }
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('Should check if there is already a user authenticated', inject(function($state, $rootScope){
    $httpBackend.expectGET('/current-user');
    var controller = createController();
    $httpBackend.flush();
    expect($scope.authenticated).toEqual(false);
  }));

  it('Should start in the home state', function() {
   var controller = createController();
   $scope.$digest();
   $httpBackend.flush();
   expect($scope.isPage('home')).toEqual(true);
  });

  it('Should return the current state when it\'s changed', function() {
    $state.go('chat');
    var controller = createController();
    $scope.$digest();
    $httpBackend.flush()
    expect($scope.isPage('chat')).toEqual(true);
  });

  // it('Should redirect when a route is protected', function() {
  //var controller = createController();
  //$state.go('about');
  //$scope.$digest();
  //$httpBackend.flush();
  //expect($scope.isPage('login')).toEqual(true);
  //})
});
