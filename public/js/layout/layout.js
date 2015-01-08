// Hamburger drop-down
// $(document).ready(function () {
//     var click = false;
//     var visible = false;
//     document.getElementById("dropdown").style.width = (document.getElementById("hamburger").width - parseInt(document.getElementById("dropdown").style.left)).toString + 'px';

//     $("#hamburger").hover( function(){
//             $('#dropdown').toggle();
//     });
// });

var app = angular.module('PictureYourselfApp', ['ngResource', 'ngAnimate']);

app.controller('LayoutCtrl', function($scope, $window){
    $scope.show_quit = false;

    $scope.quit = function(){
        $window.location.href = '/';
    }

    $scope.$on('show_quit', function(){
        $scope.show_quit = true;
    });
});

// LayoutCtrl.$inject = ['$scope', '$window'];  //for minifying angular
