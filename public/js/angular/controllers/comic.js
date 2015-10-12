angular.module('PictureYourselfApp').controller('comicCtrl', function($scope, $timeout, $window, $http, $attrs){
  $scope.comics = angular.fromJson($attrs.comics);

  var sampleComic = function() {
    var randomInteger = Math.floor(Math.random() * $scope.comics.length);
    $scope.comic = $scope.comics[randomInteger];

    if ($scope.comic.collages.length == 0)
      sampleComic()
    else {
      $scope.comic.grouping = [];
      for (var i = 0; i < $scope.comic.collages.length; i = i + 2 ) {
        $scope.comic.grouping.push([ $scope.comic.collages[i], $scope.comic.collages[i+1] ])
      }
    }
  }

  var sampleAndQueueComic = function() {
    sampleComic();

    $timeout(function() {
      sampleAndQueueComic();
    }, 3000);
  }

  sampleAndQueueComic();
});
