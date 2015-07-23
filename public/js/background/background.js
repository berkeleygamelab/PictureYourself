var applyCarousel = function($timeout) {

  $timeout(function() {
    $('.backgrounds_div').slick({
      centerMode: true,
      draggable: false,
      speed: 0,
      swipeToSlide: false,
      variableWidth: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 3
          }
        },
        {
          breakpoint: 480,
          settings: {
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 1
          }
        }
      ]
    });


  // We need this to be delayed so that slick won't be called until after Angular has
  // fully finished ng-repeat and the DOM is complete. Otherwise, slick will fail to carousel.
  // Visually, this has the side effect of seeing all the background images in a row first, before
  // slick kicks in. However, the user should never see that since this should be hidden while
  // the user is taking a selfie
  }, 3000);

}


app.controller('BackgroundCtrl', function($scope, $http, $timeout, $location){
  // Grab backgrounds from server



  var career = location.search.split("?career=")[1] || getCookie("career");
  if (career) {
    $http.get('/careers/' + career + '/backgrounds').success(
      function(data){
        $scope.background_images = data;
        $timeout(function() {
          applyCarousel($timeout);
        // We need this to be delayed so that slick won't be called until after Angular has
        // fully finished ng-repeat and the DOM is complete. Otherwise, slick will fail to carousel.
        // Visually, this has the side effect of seeing all the background images in a row first, before
        // slick kicks in. However, the user should never see that since this should be hidden while
        // the user is taking a selfie
        }, 3000);
      }
    );
  } else {
    $http.get('/global_json/backgrounds.json').success(
      function(data){
        $scope.background_images = data;
        applyCarousel($timeout);
      }
    );
  }



  $scope.selectBackground = function(){
    $scope.bg = $('.slick-center>img').attr('src');
    //Sent to ViewCtrl
    setCookie("currentbackground", $scope.bg)
    window.location.href = "/camera";
  }

  $timeout(function(){
    $('.backgrounds').click(function(){
      if($($(this).parent()).hasClass('slick-center')){
        $scope.$apply(function(){
          $scope.selectBackground();
        });
      }
    });
  }, 4000);
});
