// Slider code from http://www.sitepoint.com/creating-slide-show-plugin-angularjs/
app.controller('SlideshowCtrl', function($scope, $http, $interval, $timeout){
    $scope.collages = null
    // $scope.showArrows = false;

    var getCollages = function(data){
        $scope.date = Date.now();
        $scope.collages = data;
        $scope.showArrows = $($scope.collages).length > 1
    }

    // Get collages the first time
    $http.get('/getCollages').success(getCollages);

    // Update collages every 5 minutes
    $interval(function() {
        $http.get('/getCollages').success(getCollages);
    }, 300000); 

    $scope.currentIndex = 0; // Initially the index is at the first image
     
    $scope.next = function() {
        if($($scope.collages).length > 1){
                $scope.currentIndex < $scope.collages.length - 1 ? $scope.currentIndex++ : $scope.currentIndex = 0;
        }
    };

    //Update image every 5 seconds
    $interval(function() {
        $scope.next();
    }, 5000); 

    $scope.$watch('collages', function(){
        $scope.$watch('currentIndex', function() {
            if(jQuery.type($scope.collages) == "array"){
                $scope.collages.forEach(function(collage) {
                    collage.visible = false; // make every image invisible
                });
                $scope.collages[$scope.currentIndex].visible = true; // make the current image visible
            } 
        });
    });

    // $scope.prev = function() {
    //     if($($scope.collages).length > 1){
    //         $scope.currentIndex > 0 ? $scope.currentIndex-- : $scope.currentIndex = $scope.collages.length - 1;
    //     }
    // };
});