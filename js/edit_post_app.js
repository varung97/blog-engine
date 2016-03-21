editPostApp = angular.module("editPostApp", ['ngRoute', 'shared-services']);

editPostApp.controller("editPostCtrl", function($scope, $http, SharedServices){
	$scope.logout = logout;

	$scope.postSubmitForm = {};
	$scope.edit_post = function() {
		$http({
			method: "POST",
			url: 'php/request_processor.php',
			data: {
				'function': 'edit_post',
				'title': $scope.postSubmitForm.title,
				'text': $scope.postSubmitForm.text,
				'Post_ID': $scope.post.Post_ID
			},
			dataType: 'json'
		}).success(function(response) {
			console.log(response);
			if (response['Status'] == 'Success') {
				$scope.show_alert = true;
			}
		})
  }

	$scope.get_post = function(){
    $http({
      method: "POST",
      url: 'php/request_processor.php',
      data: {
        'function': 'get_post',
        'Post_ID': document.URL.split('?')[1]
      },
      dataType: 'json'
    }).then(function(response){
      console.log(response);
      $scope.post = response['data'];
			$scope.postSubmitForm.title = $scope.post.title;
			$scope.postSubmitForm.text = $scope.post.text;
    })
  }

	is_logged_in().then(function(response) {
		if (response['data']['LoggedIn'] == 'False') {
				window.location.href = 'home.html';
		} else {
			$scope.username = response['data']['username'];
		}
	});

	$scope.cancel = function() {
		window.location.href = 'view_post.html?' + String($scope.post.Post_ID);
	}

	$scope.show_alert = false;

	$scope.get_post();
});

// App1.config(function ($routeProvider) {
// 	$routeProvider
// 	  .when('/', {templateUrl: 'login.html', controller: 'welcomeCtrl'})
// 		.otherwise({redirectTo: '/'})
// })
