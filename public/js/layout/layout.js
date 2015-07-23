var app = angular.module('PictureYourselfApp', ['ngResource', 'ngAnimate']);

app.controller('LayoutCtrl', function($scope, $window){
  $scope.careers = ["college", "medical", "military", "legal", "business"];

    $scope.show_quit = false;

    $scope.quit = function(){
        $window.location.href = '/';
    }

    $scope.$on('toggle_quit', function(){
        $scope.show_quit = !$scope.show_quit;
    });

    $scope.get_career = function(){
      $window.location.href = "/career"
    }

    $scope.stickers_for_career = function(career){
      if (career === "random") {
        var randomInteger = Math.floor(Math.random() * $scope.careers.length);
        career = $scope.careers[randomInteger];
      }

      setCookie("career", career);
      $window.location.href = "/background?career=" + career
    }

    $scope.get_tos = function(){
      $window.location.href = "/tos"
    }

    $scope.login = function() {
      $window.location.href = "/login"
    }

    $scope.startover = function(){
      $window.location.href = '/';
    }

    $scope.get_camera = function(){
      $window.location.href = '/camera';
    };

});

// LayoutCtrl.$inject = ['$scope', '$window'];  //for minifying angular
