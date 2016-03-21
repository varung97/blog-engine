signUpApp = angular.module("signUpApp", ['ngRoute', 'shared-services']);

signUpApp.controller("signUpCtrl", function($scope, $http, SharedServices){
	$scope.signupForm = {};
	$scope.signup = function () {
		if ($scope.signupForm.password !== $scope.signupForm.conf_password) {
			$scope.alert_message = 'Confirmation Password must match Password!';
			$scope.show_alert = true;
		} else {
			$http({
				method: "POST",
				url: 'php/request_processor.php',
				data: {
					'function': 'signup',
					'username': $scope.signupForm.username,
					'password': $scope.signupForm.password
				},
				dataType: 'json'
			}).success(function(response) {
				console.log(response);
				if (response['Status'] == 'Success') {
					window.location.href = "login.html"
				}
				else {
					$scope.alert_message = 'Username is already taken!';
					$scope.show_alert = true;
				}
			})
		}
  }

	$scope.show_alert = false;
	$scope.alert_message = null;
});

// App1.config(function ($routeProvider) {
// 	$routeProvider
// 	  .when('/', {templateUrl: 'login.html', controller: 'welcomeCtrl'})
// 		.otherwise({redirectTo: '/'})
// })
