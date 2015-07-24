app.controller('ComicCtrl', function($scope, $timeout, $window, $http, $attrs){
  $scope.comics = angular.fromJson($attrs.comics);

  var randomInteger = Math.floor(Math.random() * $scope.comics.length);
  $scope.comic = $scope.comics[randomInteger];

  var sampleComic = function() {
    $timeout(function() {
      var randomInteger = Math.floor(Math.random() * $scope.comics.length);
      $scope.comic = $scope.comics[randomInteger];
      console.log("Now sampling comic!")
      console.log($scope.comic)
      sampleComic();
    }, 5000);
  }

  sampleComic()



});

// LayoutCtrl.$inject = ['$scope', '$window'];  //for minifying angular
