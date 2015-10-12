angular.module('PictureYourselfApp').controller('comicCtrl', function($scope, $timeout, $window, $http, $attrs){
  $scope.comics = angular.fromJson($attrs.comics);

  var randomInteger = Math.floor(Math.random() * $scope.comics.length);
  $scope.comic = $scope.comics[randomInteger];

  var sampleComic = function() {
    $timeout(function() {

      var randomInteger = Math.floor(Math.random() * $scope.comics.length);
      $scope.comic = $scope.comics[randomInteger];
      sampleComic();
    }, 3000);
  }

  sampleComic()
});
