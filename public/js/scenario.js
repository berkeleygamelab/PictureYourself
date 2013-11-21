//http://angular-ui.github.io/bootstrap/

;(function($){
  $.fn.html5jTabs = function(options){
    return this.each(function(index, value){
      var obj = $(this),
      objFirst = obj.eq(index),
      objNotFirst = obj.not(objFirst);

      $("#" +  objNotFirst.attr("data-toggle")).hide();
      $(this).eq(index).addClass("active");

      obj.click(function(evt){

        toggler = "#" + obj.attr("data-toggle");
        togglerRest = $(toggler).parent().find("div");

        togglerRest.hide().removeClass("active");
        $(toggler).show().addClass("active");

        //toggle Active Class on tab buttons
        $(this).parent("div").find("a").removeClass("active");
        $(this).addClass("active");

        return false; //Stop event Bubbling and PreventDefault
      });
    });
  };
}(jQuery));

$(document).ready(function() {
  $(".tabs a").html5jTabs();
});

$('.background').click(function(){
  $('#scenario').css('background-image', 'url(\'..' + $(this).attr('src') + '\')' );
})

//kinetic
var stage = new Kinetic.Stage({
        container: 'scenario',
        width:  950,
        height: 650
      });
      var layer = new Kinetic.Layer();

      var imageObj = new Image();
      imageObj.onload = function() {
        var yoda = new Kinetic.Image({
          x: 200,
          y: 50,
          image: imageObj,
          width: 106,
          height: 118
        });

        // add the shape to the layer
        layer.add(yoda);

        // add the layer to the stage
        stage.add(layer);
      };
      imageObj.src = 'http://www.html5canvastutorials.com/demos/assets/yoda.jpg';




//how to dynamically get images from server


$(window).on('beforeunload', function(){

  var leftArr = []; //don't forget to clear array so that things aren't added more than once when beforeunload is called multiple times
  var topArr = [];
  var srcArr = [];
  var rotArr = [];

  $.each($('#edit .toolboxImage'), function(index, value){
    leftArr.push($(value).css('left'));
  })

  $.each($('#edit .toolboxImage'), function(index, value){
    topArr.push($(value).css('top'));
  })

  $.each($('#edit .toolboxImage'), function(index, value){
    rotArr.push($(value).css('-webkit-transform'));
  })

  $.each($('#edit .toolboxImage .itemImage'), function(index, value){
    srcArr.push($(value).attr('src'));
  })

  //eventually background will be refactored to simply be included with the rest of the images
  var background = $('#edit #diagram').css('background-image')

  var formData = new FormData();
  //var filename = $scope.pyuserid;
  //formData.append("name", name);

  formData.append("leftArr", leftArr);
  formData.append("topArr", topArr);
  formData.append("srcArr", srcArr);
  formData.append("rotArr", rotArr);
  formData.append("background", background);

  var xhr2 = new XMLHttpRequest();
  xhr2.open('POST', '/session');
  xhr2.send(formData);
});