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

    // // Received from ScenarioCtrl
    // $scope.$on('collageToLayout', function(event, data){
    //     console.log("Layout updateCollages");
    //     // Send back down to SlideshowCtrl
    //     $scope.$broadcast('updateCollages', data);
    // });
});

// LayoutCtrl.$inject = ['$scope', '$window'];  //for minifying angular
