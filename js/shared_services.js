angular.module('shared-services', [])
  .service('SharedServices', function($http){
    is_logged_in = function() {
  		return $http({
  			method: "POST",
  			url: 'php/request_processor.php',
  			data: {
  				'function': 'is_logged_in',
  			},
  			dataType: 'json'
  		})
  	}

    logout = function(){
      $http({
  			method: "POST",
  			url: 'php/request_processor.php',
  			data: {
  				'function': 'logout',
  			},
  			dataType: 'json'
  		}).then(function(response) {
  			console.log(response);
  		})
      window.location.href = "home.html"
    }

    shorten_post = function(text){
      max_len = 500;
      if (text.length > max_len) {
        return text.slice(0, max_len)
                   .split(' ')
                   .slice(0, -1)
                   .join(' ')
                   .replace(/^\s+|\s+$/g, "")
                   .replace(/^[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+|[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/g, "")
                   + '...';
      }
      else {
        return text;
      }
    }

    pagination = function(num_pages, page_number, scope) {
      if (num_pages <= 5) {
        start = 1;
        end = num_pages;
      } else if (page_number <= 2) {
        start = 1;
        end = 5;
      } else if (page_number <= num_pages - 2) {
        start = page_number - 2;
        end = page_number + 2;
      } else {
        start = num_pages - 4;
        end = num_pages;
      }

      scope.pages = [];
      for (var i = start; i <= end; i++) {
        scope.pages.push(i);
      }

      pagi_elems = angular.element('.pagination')
      for (var idx = 0; idx < pagi_elems.length; idx++) {
        pagi_elems.eq(idx).children().removeClass('disabled');
        if (page_number == 1) {
          pagi_elems.eq(idx).children().eq(0).addClass('disabled');
        }
        if (page_number == num_pages) {
          pagi_elems.eq(idx).children().eq(-1).addClass('disabled');
        }
      }
    }
  });
