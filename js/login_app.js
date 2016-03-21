loginApp = angular.module("loginApp", ['ngRoute']);

loginApp.controller("loginCtrl", function($scope, $http){
	$scope.loginForm = {};
	$scope.login = function () {
		$http({
			method: "POST",
			url: 'php/request_processor.php',
			data: {
				'function': 'login',
				'username': $scope.loginForm.username,
				'password': $scope.loginForm.password
			},
			dataType: 'json'
		}).success(function(response) {
			console.log(response);
			if (response['Status'] == 'Success') {
				window.location.href = "my_posts.html"
			}
			else {
				$scope.show_alert = true;
			}
		})
  }

	$scope.show_alert = false;

	$scope.$on('$includeContentLoaded', function () {
    angular.element(document.querySelector('#nav_login')).addClass('active').children().attr('href', '#').attr('onclick', 'window.location.reload()');
	});
});

// App1.config(function ($routeProvider) {
// 	$routeProvider
// 	  .when('/', {templateUrl: 'login.html', controller: 'welcomeCtrl'})
// 		.otherwise({redirectTo: '/'})
// })
