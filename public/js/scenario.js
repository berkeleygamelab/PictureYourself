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
    * Gets user selfie
    */
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

    var stage = new Kinetic.Stage({
        container: 'container',
        width: 950,// parseInt($('#container').css('width')) ,
        height: 650//parseInt($('#container').css('height'))
    });

    var layer = new Kinetic.Layer();
    stage.add(layer);

    var con = stage.getContainer();
    var dragSrcEl = null;

    $scope.image_download = 'test.jpg';
    var stickers = []; //will store information about stickers

    $scope.create_image = function(){
        console.log('called');
        $scope.image_download = 'somethingelse.jpg';
        stage.toDataURL({
            callback: function(dataUrl) {
                console.log('callback');
                var link = document.createElement('a');
                angular.element(link)
                .attr('href', dataUrl)
                .attr('download', 'test.jpg') // Pretty much only works in chrome
                link.click();
                console.log('click?')
            }
        })
    };

    //Background selection
    backgroundObj = new Image();
    var background = new Kinetic.Image({
        image:backgroundObj,
        x:0,
        y:0,
        width:$('#container').width(),
        height:$('#container').height()
    });
    layer.add(background);

    $('.background').click(function(){
        console.log($(this).attr('src'));
        backgroundObj.src = $(this).attr('src');
        background.moveToBottom();
        layer.draw();
    })



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


    // Drag and drop stickers start

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
        rotateObj.src = '/images/rotate.png';

        deleteObj = new Image();
        deleteObj.src = '/images/delete_button.png';
        //stop Firefox from opening image
        e.preventDefault();

        //get position relative to the container and page
        x = e.pageX - $('#container').offset().left;
        y = e.pageY - $('#container').offset().top;

        var group = new Kinetic.Group({
            draggable: true
        });

        var image = new Kinetic.Image({
           image:imageObj,
           width: 120,  //this makes the image lower quality for some reason
           height: 120,
           x: x,
           y: y,
           offset:[60,60] //size determined by width, height input
        });

        //may not need, but may need to refactor code
        var start_size = {"width":120,"height":120};
        var scaler_start = {"x":image.getX() + start_size.width,"y":image.getY() + start_size.height};

        //icon for rotation
        var rotate = new Kinetic.Circle({
            x:image.getX(),
            y:image.getY() + start_size.height/2,
            radius:10,
            fill: 'green',
            stroke:'black',
            draggable:true,
            visible:false,
            offset:[image.getWidth()/2,image.getHeight()/2],
            dragBoundFunc: function(pos) {
                var x = image.getX() + start_size.width / 2;
                var y = image.getY() + start_size.width/2;//100;  // your center point
                var radius = 60;//Math.min(image.getWidth() / 2 , image.getHeight() / 2);//60;
                var scale = radius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)); // distance formula ratio
                  return {
                    y: Math.round((pos.y - y) * scale + y),
                    x: Math.round((pos.x - x) * scale + x)
                  };
              }
        });

        var delete_icon = new Kinetic.Image({
          visible:false,
          width:25,
          height:25,
          image:deleteObj,
          x:x+image.getWidth() - 10,
          y:y,
          offset:[image.getWidth()/2,image.getHeight()/2]
        })

        delete_icon.on('click', function(){
          group.remove();
          layer.draw();
        })


        //object to drag to scale image on X axis
        var scalerX = new Kinetic.Circle({
            x:image.getX() + start_size.width,
            y:image.getY() + start_size.height/2,
            radius:10,
            fill: 'yellow',
            stroke:'black',
            draggable:true,
            visible:false,
            offset:[image.getWidth()/2,image.getHeight()/2],
            dragBoundFunc: function(pos){
                return{
                    x: pos.x,
                    y: this.getAbsolutePosition().y
                }
            }
        })

        //object to drag to scale image on Y axis
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
              return{
                x: this.getAbsolutePosition().x,
                y: pos.y
              }
            }
        })


        //hide and show resize and scaler
        group.on('mouseover',function(){
            scalerX.setVisible(true);
            scalerY.setVisible(true);
            delete_icon.setVisible(true);
            rotate.setVisible(true);
            layer.draw();
        });
        group.on('mouseout',function(){
            scalerX.setVisible(false);
            scalerY.setVisible(false);
            delete_icon.setVisible(false);
            rotate.setVisible(false);
            layer.draw();
        });

        //set rotation
        var canvasOffset = $("#container").offset();
        var offsetX = canvasOffset.left;
        var offsetY = canvasOffset.top;
        var startX;
        var startY;

        rotate.on('mouseenter', function(e){
            startX = parseInt(e.clientX - offsetX);
            startY = parseInt(e.clientY - offsetY);
        })

        rotate.on('dragmove', function(e){ //dragmove
            // console.log(mouseX + " " + mouseY);
            var dx = startX - parseInt(e.clientX - offsetX);
            var dy = startY - parseInt(e.clientY - offsetY);
            var angle = Math.atan2(dy, dx);
            image.setRotation(angle);
            layer.draw();
        })

        //set horizontal height of image
        scalerX.on('dragmove',function(){
            var x1 = this.getX();
            var x2 = image.getX();
            var dx = (x1 - x2 - image.getWidth()/2)/50;
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

        //construct group to drop after image loads
        imageObj.onload = function(){
            group.add(image);
            group.add(scalerX);
            group.add(scalerY);
            group.add(delete_icon);
            group.add(rotate);
            layer.add(group);
            layer.draw()
        };

    })
}



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
        stickers.push(JSON.stringify(sticker));
    // stickers[index] = sticker;
    })
    var formData = new FormData();
    //var filename = $scope.pyuserid;
    //formData.append("name", name);

    formData.append("stickers", stickers);
    var xhr2 = new XMLHttpRequest();
    xhr2.open('POST', '/session');

    xhr2.send(formData);
});


