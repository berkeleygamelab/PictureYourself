var app = angular.module('PictureYourselfApp', ['ngResource']);

app.controller('ComicCtrl', function($scope, $window, $http, $attrs){

  $scope.comic = angular.fromJson($attrs.comic);
  console.log($attrs)
  console.log($scope.comic)


});

// LayoutCtrl.$inject = ['$scope', '$window'];  //for minifying angular
