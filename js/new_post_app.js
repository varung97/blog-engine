newPostApp = angular.module("newPostApp", ['ngRoute', 'shared-services']);

newPostApp.controller("newPostCtrl", function($scope, $http, SharedServices){
	$scope.logout = logout;

	$scope.postSubmitForm = {};
	$scope.new_post = function() {
		$http({
			method: "POST",
			url: 'php/request_processor.php',
			data: {
				'function': 'new_post',
				'title': $scope.postSubmitForm.title,
				'text': $scope.postSubmitForm.text
			},
			dataType: 'json'
		}).success(function(response) {
			console.log(response);
			if (response['Status'] == 'Success') {
				$scope.show_alert = true;
			}
		})
  }

	is_logged_in().then(function(response) {
		if (response['data']['LoggedIn'] == 'False') {
				window.location.href = 'home.html';
		} else {
			$scope.username = response['data']['username'];
		}
	});

	$scope.$on('$includeContentLoaded', function () {
    angular.element(document.querySelector('#nav_new_post')).addClass('active').children().attr('href', '#').attr('onclick', 'window.location.reload()');
	});

	$scope.show_alert = false;
});
