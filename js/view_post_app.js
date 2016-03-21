viewPostApp = angular.module("viewPostApp", ['ngRoute', 'shared-services']);

viewPostApp.controller("viewPostCtrl", function($scope, $http, SharedServices, $q){
  $scope.comment_text = null;
  $scope.show_alert = false;
  $scope.show_success = false;
  $scope.logout = logout;

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
    })
  }

  is_logged_in().then(function(response) {
		if (response['data']['LoggedIn'] == 'False') {
      $scope.template = 'site_navbar.html';
		} else {
      $scope.template = 'user_navbar.html';
			$scope.username = response['data']['username'];
		}
	});

  $scope.delete_post = function() {
    $scope.show_popup = true;
  }

  $scope.confirm_yes = function(){
      $http({
        method: "POST",
        url: 'php/request_processor.php',
        data: {
          'function': 'delete_post',
          'Post_ID': document.URL.split('?')[1]
        },
        dataType: 'json'
      }).then(function(response){
        console.log(response);
        if (response['data']['Status'] == 'Success') {
          window.location.href = 'my_posts.html';
        }
      })
  }

  $scope.confirm_no = function(){
    $scope.show_popup = false;
  }

  $scope.cmt_txtarea_visible = false;

  $scope.new_comment = function() {
    $scope.cmt_txtarea_visible = true;
  }

  $scope.cancel_comment = function() {
    $scope.cmt_txtarea_visible = false;
  }

  $scope.comment_submit = function() {
    $http({
      method: "POST",
      url: 'php/request_processor.php',
      data: {
        'function': 'comment_submit',
        'Post_ID': document.URL.split('?')[1],
        'comment_text': $scope.comment_text,
        'replied_to': '0'
      },
      dataType: 'json'
    }).then(function(response){
      $scope.cmt_txtarea_visible = false;
      console.log(response);
      $scope.get_comments();
    })
    $scope.comment_text = null;
  }

  $scope.reply_submit = function(comment) {
    $http({
      method: "POST",
      url: 'php/request_processor.php',
      data: {
        'function': 'comment_submit',
        'Post_ID': document.URL.split('?')[1],
        'comment_text': comment.reply_text,
        'replied_to': comment.Comment_ID
      },
      dataType: 'json'
    }).then(function(response){
      comment.reply_vis = false;
      console.log(response);
      $scope.get_comments();
    })
    comment.reply_text = null;
  }

  $scope.get_comments = function() {
    $http({
      method: "POST",
      url: 'php/request_processor.php',
      data: {
        'function': 'get_comments',
        'Post_ID': document.URL.split('?')[1]
      },
      dataType: 'json'
    }).then(function(response){
      console.log(response['data']);
      $scope.comments = response['data']['comments'];
    })
  }

  $scope.comment_reply = function(comment) {
    comment.reply_vis = true;
  }

  $scope.comment_delete = function(comment) {
    $http({
      method: "POST",
      url: 'php/request_processor.php',
      data: {
        'function': 'comment_delete',
        'Comment_ID': comment.Comment_ID
      },
      dataType: 'json'
    }).then(function(response){
      console.log(response['data']);
      $scope.get_comments();
    })
  }

  $scope.get_post();
  $scope.get_comments();
});
