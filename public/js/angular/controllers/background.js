angular.module('PictureYourselfApp').controller('BackgroundCtrl', function($scope, $http, $attrs, $timeout){
  var career = location.search.split("?career=")[1] || getCookie("career");
  $http.get('/careers/' + career + '/backgrounds').success(
    function(data){
      console.log(data)
      $scope.background_images = data;
    }
  );

  $scope.applyCarousel = function() {
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

    $scope.loadingComplete = true;
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
