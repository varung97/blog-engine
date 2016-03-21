myPostsApp = angular.module("myPostsApp", ['ngRoute', 'shared-services']);

myPostsApp.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl : 'my_posts_posts.html',
				controller  : 'myPostsCtrl'
			})
			.when('/view_post', {
				templateUrl : 'view_post.html',
				controller  : 'viewPostCtrl'
			})
      .otherwise({
        redirectTo: '/'
      })
});

myPostsApp.factory('Data', function(){
  return {
    Post_ID : 1,
    username: null,
    page_number: 1,
    update_ID: function(new_ID) {
      this.Post_ID = new_ID;
    },
    update_page: function(new_page) {
      this.page_number = new_page;
    }
  }
});

myPostsApp.controller("navbarCtrl", function($scope, $http, SharedServices) {
  is_logged_in().then(function(response) {
		if (response['data']['LoggedIn'] == 'False') {
			window.location.href = 'home.html';
		} else {
			$scope.username = response['data']['username'];
		}
	});
});

myPostsApp.controller("myPostsCtrl", function($scope, $http, SharedServices, $anchorScroll, $location, Data){
  $scope.num_pages = 5;
  $scope.page_number = Data.page_number;

  $scope.logout = logout;

  is_logged_in().then(function(response) {
		if (response['data']['LoggedIn'] == 'False') {
				window.location.href = 'home.html';
		} else {
			$scope.username = response['data']['username'];
		}
	});

  $scope.get_posts = function(page_number){
    if (page_number >= 1 && page_number <= $scope.num_pages) {
      Data.update_page(page_number);
      $scope.page_number = page_number;
      $http({
        method: "POST",
        url: 'php/request_processor.php',
        data: {
          'function': 'get_posts',
          'only_user_posts': 'true',
          'page_number': '' + $scope.page_number
        },
        dataType: 'json'
      }).then(function(response){
        console.log(response);
        $scope.posts = response['data']['articles'];
        num_posts = $scope.posts.length;
        for (var i = 0; i < num_posts; i++) {
          $scope.posts[i].text = shorten_post($scope.posts[i].text);
        }
        $scope.num_pages = parseInt(response['data']['num_pages']);
      }).then(function() {
        if ($scope.num_pages < $scope.page_number) {
          window.location.href = 'my_posts.html?' + $scope.num_pages;
        }

        pagination($scope.num_pages, $scope.page_number, $scope);

        window.scrollTo(0, 0);
      })
    }
  }

  $scope.$on('$includeContentLoaded', function () {
    angular.element('#nav_my_posts').addClass('active').children().attr('href', '#').attr('onclick', 'window.location.reload()');
		$scope.get_posts($scope.page_number);
  });

  $scope.view_post = function(Post_ID) {
    Data.update_ID(Post_ID);
  }
});

myPostsApp.controller("viewPostCtrl", function($scope, $http, SharedServices, Data){
  $scope.Post_ID = Data.Post_ID;
  $scope.comment_text = null;
  $scope.show_alert = false;
  $scope.show_success = false;

  $scope.logout = logout;

  is_logged_in().then(function(response) {
		if (response['data']['LoggedIn'] == 'False') {
				window.location.href = 'home.html';
		} else {
			$scope.username = response['data']['username'];
		}
	});

  $scope.get_post = function(){
    $http({
      method: "POST",
      url: 'php/request_processor.php',
      data: {
        'function': 'get_post',
        'Post_ID': $scope.Post_ID
      },
      dataType: 'json'
    }).then(function(response){
      console.log(response);
      $scope.post = response['data'];
    })
  }

  $scope.delete_post = function() {
    $scope.show_popup = true;
  }

  $scope.confirm_yes = function(){
      $http({
        method: "POST",
        url: 'php/request_processor.php',
        data: {
          'function': 'delete_post',
          'Post_ID': $scope.Post_ID
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
        'Post_ID': $scope.Post_ID,
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
        'Post_ID': $scope.Post_ID,
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
        'Post_ID': $scope.Post_ID
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
})
