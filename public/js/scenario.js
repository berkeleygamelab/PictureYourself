
//http://angular-ui.github.io/bootstrap/

/*
* Tabs
*/

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

  /*
  * Background choosing
  */
  $('.background').click(function(){
    $('#container').css('background-image', 'url(\'..' + $(this).attr('src') + '\')' );
  });

  /*
  * Gets user selfie
  */
  //hardcoded because I don't know how to get userID
  //also have to refresh page to get changes, why?

  $('#selfie').attr('src', '../users/'+getCookie('pyuserid')+'/1_sticker.png'); //users/ed39cd11-86cd-4faf-7b12-2cd9df6fc706/
  //console.log("ID: " + getCookie('pyuserid'));


/*
* CSS filters, basic implementation
*/
var filter = '';

$('.filter').on('click', function(){

  var filterVal =  $(this).attr('id');
  if(filterVal == 'gray'){
    filter += ' grayscale(0.5)';
  } else if (filterVal == 'blur'){
    filter += ' blur(5px)';
  } else if (filterVal == 'sepia'){
    filter += ' sepia(0.5)';
  } else if (filterVal == 'saturate'){
    filter += ' saturate(0.5)';
  } else if (filterVal == 'invert'){
    filter += ' invert(100%)';
  } else if (filterVal == 'opacity'){
    filter += ' opacity(0.5)';
  } else if (filterVal == 'bright'){
    filter += ' brightness(2)';
  } else if (filterVal == 'contrast'){
    filter += ' contrast(0.5)';
  } else if(filterVal == 'reset'){
    filter = 'blur(0px)';
  }
  $('#container').css('-webkit-filter', filter);

  });

});




/*
* The actual Kinetic Stage where users can move stickers around
* Also loads all the images dynamically
* And stores data about the images on the canvas into the stickers array
*/

//try to wrap this all in a function somehow? ScenarioCtrl is preventing that from happening


    function ScenarioCtrl($scope, $resource, $http, $log){

      var stickers = []; //will store information about stickers

      var stage = new Kinetic.Stage({
        container: 'container',
        width: parseInt($('#container').css('width')) ,
        height: parseInt($('#container').css('height'))
      });

      var layer = new Kinetic.Layer();
      stage.add(layer);

      var con = stage.getContainer();

      var dragSrcEl = null;

    //Grab Stickers
      $http.get('test/stickers').success(function(data){
        angular.forEach(data,function(sticker){
           //console.log(sticker)
           if(sticker.match('txt') == null)
              $("#tab1").append('<img class=\'sticker\' src="/' + sticker + '">');
        }); //forEach
        //image
        $('.sticker').bind('dragstart',function(e){  //!!!!!ALL STICKERS MUST HAVE CLASS 'sticker'
         dragSrcEl = this;
        });

      });//success

    con.addEventListener('dragover',function(e){
        e.preventDefault(); //@important
    });


    //insert image to stage
    var count = 0;
    con.addEventListener('drop',function(e){
        //set up imageObj before creating other items that
        //may be reliant on its dimensions
        imageObj = new Image();
        imageObj.src = dragSrcEl.src;

        rotateObj = new Image();
        
        //stop Firefox from opening image
        e.preventDefault();
        //get position relative to the container and page
        x = e.pageX - $('#container').offset().left;
        y = e.pageY - $('#container').offset().top;

        var group = new Kinetic.Group({
            draggable: true
        });

        var image = new Kinetic.Image({
           //draggable : true,
           image:imageObj,
           width: 120,  //this makes the image lower quality for some reason
           height: 120,
           x: x,  //TOFIX: drop it at mouse location, instead of top left corner
           y: y,
           offset:[60,60]
        });

        var start_size = {"width":120,"height":120};
        var scaler_start = {"x":image.getX() + start_size.width,"y":image.getY() + start_size.height};

        //might not need
        function image_bounds(pos){
          new_pos = {"x":0,"y":0};

          var scaled_width = image.getWidth()*image.getScaleX();
          var scaled_height = image.getHeight()*image.getScaleY();
          if(scaled_width <= image.getWidth())
            new_pos.x = image.getWidth() + image.getX();
          else
            new_pos.x = pos.x
          if(scaled_height <= image.getHeight())
            new_pos.y = image.getHeight() + image.getY();
          else
            new_pos.y = pos.y

          return new_pos

        }

        var rotate = new Kinetic.Image({
            visible:false,
            image:rotateObj,
            x: x,
            y: y,
            offset:[image.getWidth()/2,image.getHeight()/2]
        });
        //layer.add(rotate);

        //object to drag to scale image
        var scalerX = new Kinetic.Circle({
          //x,y relative to the image size
          x:image.getX() + start_size.width,
          y:image.getY() + start_size.height/2,
          radius:10,
          fill: 'yellow',
          stroke:'black',
          draggable:true,
          visible:false,
          offset:[image.getWidth()/2,image.getHeight()/2],
          dragBoundFunc: function(pos){
              //return image_bounds(pos);
              return{
                x: pos.x,
                y: this.getAbsolutePosition().y
              }
            }
        })

        var scalerY = new Kinetic.Circle({
          x:image.getX() + start_size.width/2,
          y:image.getY() + start_size.height,
          radius:10,
          fill: 'yellow',
          stroke:'black',
          draggable:true,
          visible:false,
          offset:[image.getWidth()/2,image.getHeight()/2],
          dragBoundFunc: function(pos){
              //return image_bounds(pos);
              return{
                x: this.getAbsolutePosition().x,
                y: pos.y
              }
            }
        })

        rotateObj.src = '/images/rotate.png';
        //rotate.setImage(rotateObj);


        //hide and show resize and scaler
        group.on('mouseover',function(){
            scalerX.setVisible(true);
            scalerY.setVisible(true);
            rotate.setVisible(true);

            layer.draw();
          });
        group.on('mouseout',function(){
            scalerX.setVisible(false);
            scalerY.setVisible(false);
            rotate.setVisible(false);
            layer.draw();
          });
        
        //set horizontal height of image
       scalerX.on('dragmove',function(){
          
          var x1 = this.getX();
          var x2 = image.getX();
          var dx = (x1 - x2 - image.getWidth()/2)/50;
          //console.log('dx: '+ dx);
          //var dy = y1 - y2 - 60;
          image.setScaleX(dx);
          group.setSize(image.getSize());
          layer.draw();
        })

       //set vertical height of image
        scalerY.on('dragmove',function(){
          
          var y1 = this.getY();
          var y2 = image.getY();
          var dy = (y1 - y2 - image.getHeight()/2)/50;
          image.setScaleY(dy);
          group.setSize(image.getSize());
          layer.draw();
        })
        imageObj.onload = function(){
            group.add(image);
            group.add(scalerX);
            group.add(scalerY);
            group.add(rotate);
            layer.add(group);
            layer.draw()
        };

    })//Drop event

} //End of Selfie Ctrl





/*
		if(count % 2 == 0){
			image.on('mouseover',function(){
				console.log('EVEN');
			})
			count += 1;
		}

		else if(count % 2 == 1){
			image.on('mouseover',function(){
				console.log('ODD');
			})
			count += 1;
		}


	})

        //group.add(image);

        /*
        var centre = {
          x: image.attrs.x + 60,
          y: image.attrs.y + 60
        }
        console.log(image);
        console.log(centre);
        rotate.on('mousedown', function(){

        })*/




// $(window).click(function(e){
//     console.log(e.pageX + " " + e.pageY);
//   });

function rotate(centre, start, end){
  //console.log(centre, start, end);
  var v1 = {
    x: start.x - centre.x,
    y: start.y - centre.y,
    dist: distance(centre, start)
  }
  var v2 = {
    x: end.x - centre.x,
    y: end.y - centre.y,
    dist: distance(centre, end)
  }
  // console.log(v1);
  // console.log(v2);
  var dot = v1.x * v2.x  + v1.y * v2.y;
  // console.log(dot);
  dot /= (v1.dist * v2.dist);
  var angle = Math.acos(dot);
  console.log(angle);
}

function distance(p1, p2){
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y -p2.y, 2));
}




//for transformations, maybe use kinetic group to add circles on
//for rotations, i have three points: centre, some predetermined default, and wherever the user's mouse is moved to
//given that information, make two vectors from centre to both points, take a dot product to get the angle



//http://jsfiddle.net/projeqht/ttUd4/

//http://jsfiddle.net/hF36S/1/

//http://www.html5canvastutorials.com/labs/html5-canvas-drag-and-drop-resize-and-invert-images/

//http://stackoverflow.com/questions/8270612/get-element-moz-transformrotate-value-in-jquery (-webkit transform matrix to degree/rad)

//http://jqueryui.com/resizable/



//http://superdit.com/2011/12/04/jquery-plugin-for-rotating-image/

//NONE WORKING ROTATE
// ;(function( $ ) {
//     $.fn.myrotate = function() {
//         var img = this.find("img"); //wtf
//         var imgpos = img.position();
//         var x0, y0;

//         $(window).load(function() {
//             img.removeAttr("width");
//             img.removeAttr("height");

//             x0 = imgpos.left + (img.width() / 2);
//             y0 = imgpos.top + (img.height() / 2);
//         });

//         var x, y, x1, y1, drag = 0;

//         img.css({
//             "cursor": "pointer",
//             "position": "relative"
//         });

//         img.mousemove(function(e) {
//             x1 = e.pageX;
//             y1 = e.pageY;
//             x = x1 - x0;
//             y = y1 - y0;

//             r = 360 - ((180/Math.PI) * Math.atan2(y,x));

//             if (drag == 1) {
//                 img.css("transform","rotate(-"+r+"deg)");
//                 img.css("-moz-transform","rotate(-"+r+"deg)");
//                 img.css("-webkit-transform","rotate(-"+r+"deg)");
//                 img.css("-o-transform","rotate(-"+r+"deg)");
//             }
//         });

//         img.mousedown(function() {
//             if (drag == 0) {
//                 drag = 1;
//                 img.css("-webkit-box-shadow", "0 0 5px #999");
//                 img.css("-moz-box-shadow", "0 0 5px #999");
//                 img.css("box-shadow", "0 0 5px #999");
//             } else {
//                 drag = 0;
//                 img.css("-webkit-box-shadow", "0 0 2px #999");
//                 img.css("-moz-box-shadow", "0 0 2px #999");
//                 img.css("box-shadow", "0 0 2px #999");
//             }
//         });

//         img.mouseleave(function() {
//             drag = 0;
//         });
//     };
// })( jQuery );


// $('.sticker').myrotate();





//layer.getChildren()[0].attrs.image.src
//layer.getChildren()[0].attrs.x
$(window).on('beforeunload', function(){
  stickers = [];
  stickers.push($('#container').css('background-image'));
  $.each(layer.getChildren(), function(index, value){
    var sticker = {
      src: value.attrs.image.src,
      x: value.attrs.x,
      y: value.attrs.y
    }
    //console.log($(sticker).serializeArray());
    //console.log(JSON.stringify(sticker));
    stickers.push(JSON.stringify(sticker));
   // stickers[index] = sticker;
  })
  //console.log(stickers)
   // console.log(stickers);
  var formData = new FormData();
  //var filename = $scope.pyuserid;
  //formData.append("name", name);

  formData.append("stickers", stickers);
  var xhr2 = new XMLHttpRequest();
  xhr2.open('POST', '/session');

  xhr2.send(formData);
});






