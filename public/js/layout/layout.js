// Hamburger drop-down
// $(document).ready(function () {
//     var click = false;
//     var visible = false;
//     document.getElementById("dropdown").style.width = (document.getElementById("hamburger").width - parseInt(document.getElementById("dropdown").style.left)).toString + 'px';

//     $("#hamburger").hover( function(){
//             $('#dropdown').toggle();
//     });
// });

function LayoutCtrl($scope, $window){
    //Currently unused, but required because LayoutCtrl is defined in the erb
    $scope.show_quit = false;

    $scope.quit = function(){
        $window.location.href = '/';
    }
}

LayoutCtrl.$inject = ['$scope', '$window'];  //for minifying angular
