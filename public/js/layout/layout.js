var app = angular.module('PictureYourselfApp', ['ngResource', 'ngAnimate']);

app.controller('LayoutCtrl', function($scope, $window){
    $scope.show_quit = false;

    $scope.quit = function(){
        $window.location.href = '/';
    }

    $scope.$on('toggle_quit', function(){
        $scope.show_quit = !$scope.show_quit;
    });

    $scope.get_tos = function(){
      $window.location.href = "/tos"
    }

    $scope.startover = function(){
      $window.location.href = '/';
    }

    $scope.get_camera = function(){
      $window.location.href = '/camera';
    };

});

// LayoutCtrl.$inject = ['$scope', '$window'];  //for minifying angular
