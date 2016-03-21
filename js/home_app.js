homeApp = angular.module("homeApp", ['ngRoute', 'shared-services']);

homeApp.controller("homeCtrl", function($scope, $http, $window, SharedServices){
  $scope.$on('$includeContentLoaded', function () {
    angular.element(document.querySelector('#nav_home')).addClass('active').children().attr('href', '#').attr('onclick', 'window.location.reload()');
	});

  is_logged_in().then(function(response) {
		if (response['data']['LoggedIn'] == 'False') {
      $scope.template = 'site_navbar.html';
		} else {
      $scope.template = 'user_navbar.html';
			$scope.username = response['data']['username'];
		}
	});

  $scope.logout = logout;

  $scope.jumb_height = String($window.innerHeight - 50) + 'px';
  $scope.cont_padding = String(($window.innerHeight - 50) * 0.3) + 'px';

  var w = angular.element($window);
  $scope.$watch(
    function () {
      return $window.innerHeight;
    },
    function (value) {
      $scope.jumb_height = String($window.innerHeight - 50) + 'px';
      $scope.cont_padding = String(($window.innerHeight - 50) * 0.3) + 'px';
    },
    true
  );

  w.bind('resize', function(){
    $scope.$apply();
  });
});
