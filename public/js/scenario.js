//http://angular-ui.github.io/bootstrap/

//This flag is used to determine if you want console output or not.
//Don't use console.log, instead use debug("some thing you want to send to console")
var debug_flag = false;
var default_background = '/images/stickers/0-backgrounds/Asproul.png';

// TODO 
// 1 - Rotate and color picker position break when scaled, look into why

$(document).ready(function() {
    /*
    * Gets user selfie
    */
    //also have to refresh page to get changes, why?
    //set pyuserid as global variable to easily access it

    $('#selfie').attr('src', '../users/'+getCookie('pyuserid')+'/1_sticker.png'); //users/ed39cd11-86cd-4faf-7b12-2cd9df6fc706/

    $("#toolicon li").on("click", function(){
        $(this).parent().children().removeClass("active");
        $(this).addClass("active");
    });

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

    //fixes positioning issue with kineticJS canvas
   $(".kineticjs-content").css('position',''); 
    
    $("#modal").hide();

    // Cavas were color changing occurs. Should always be hidden
    $("#color_change_canvas").hide();
});


/*
* The actual Kinetic Stage where users can move stickers around
* Also loads all the images dynamically
* And stores data about the images on the canvas into the stickers array
*/

function ScenarioCtrl($scope, $resource, $http, $compile){
    var stage_width = 800;
    var stage_height = 550;
    
    // flags
    $scope.loading = false;
    $scope.chroma_green = false;

    var previous_edit = {'image':null,'collapse':null, 'on': true};

    $scope.image_sources = {};


    // KineticJS Setup ///////////////////////////////////////////////////////////////

    var stage = new Kinetic.Stage({
        container: 'container',
        width: stage_width,//$('#container').width(),
        height: stage_height//$('#container').height()
    });

    var layer = new Kinetic.Layer();
    stage.add(layer);

    var con = stage.getContainer();
    var dragSrcEl = null;

    $scope.image_download = 'test.jpg';
    var stickers = []; //will store information about stickers

    // Sets the color picker object
    $('#color1').colorPicker({ onColorChange : function(id, newValue) { 
        $scope.change_color(newValue); 
        } 
    });

    // Background ///////////////////////////////////////////////////////////////
    
    $scope.backgroundObj = new Image();
    
    var background = new Kinetic.Image({
        image:$scope.backgroundObj,
        x:0,
        y:0,
        width:stage_width,
        height:stage_height
    });

    $scope.backgroundObj.src = default_background;


    $scope.backgroundObj.onload = function(){
        debug("Bacground onload");
        
        layer.add(background);
        background.setZIndex(1);

        layer.draw();
    };

    // Remove sticker tools when background is clicked
    background.on('click', function(){
        debug('background click');
        closeTools();
    });

    // Called when user selects a background
    $scope.background_update = function(e){
        $scope.backgroundObj.src = e.target.src;
    };

    // Grab backgrounds from server
    $http.get('/stickers/backgrounds').success(
        function(data)
        {
            angular.forEach(data,
                function(source,name)
                {
                    html = "<img src='/" +  source + "' class='background' ng-click=\"background_update($event)\" alt='"+name+"'>";
                    compiledElement = $compile(html)($scope);
                    $("#backgrounds_tab").append(compiledElement);
                });

        }) ;


    // Frames ///////////////////////////////////////////////////////////////

    $scope.frameObj = new Image();

    var frame = new Kinetic.Image({
        image:$scope.frameObj,
        x:0,
        y:0,
        width:stage_width,//$('#container').width(),
        height:stage_height,//$('#container').height()
    });

    layer.add(frame);

    $scope.frameObj.onload = function(){
        debug('frame onload');

        layer.add(frame);
        layer.draw();
    };

    $scope.frame_update = function(e){
        debug('frame update');
        $scope.frameObj.src = e.target.src;
    };


    //TEMPORARY SO WE CAN HAVE IT SAY COMING SOON FOR FRAMES!!!!!!
    
    // $http.get('/stickers/frames').success(
    //     function(data)
    //     {
    //         angular.forEach(data,
    //             function(source,name)
    //             {
    //                 html = "<img src='/" +  source + "' class='frames' ng-click=\"frame_update($event)\" alt='"+name+"'>"
    //                 compiledElement = $compile(html)($scope);
    //                 $("#frames_tab").append(compiledElement)
    //             })

    // }) //success

    $scope.remove_frame = function(){
        debug('remove frame');

        $scope.frameObj.src = "";
        layer.draw();
    };





    // Stickers ///////////////////////////////////////////////////////////////

    var default_category = "shoes_and_pants";

    // TODO used to determine if object is part of chromagreen
    // most likely change if more categories have chromagreen
    var chromagreen_category = "shirts";
    
    // Grab stickers from server and append them to category
    $http.get('/stickers').success(
        function(data){
            data = angular.fromJson(data);
            $scope.visible = {};
            $scope.stickers = data['stickers'];
            $scope.categories = data['categories'];

            angular.forEach($scope.stickers,

                function(stickers,category){

                    // Category is open on page load if it's the default category
                    $scope.visible[category] = (category == default_category);

                    //create the dynamic html
                    html= "<div id="+category+"_subtab class='subtab_title' "+
                        "ng-click=\"toggle('"+category+"')\">"+$scope.categories[category]+"</div>"+
                        "<div ng-show='visible."+category+"' id='"+category+"_content' class='subtab_content'></div>";
                    
                    //compile it with angular so functions work
                    compiledElement = $compile(html)($scope);
                    $("#sticker_tab").append(compiledElement);
                    
                    //add stickers
                    angular.forEach(stickers,
                        function(sticker){
                            $("#"+category+"_content").
                            append('<img class=\'sticker ' + category + 
                                '\' src="/' + sticker.source + '" name="' + sticker.name + '"/>');


                            if(sticker.chroma_green){
                                $scope.image_sources[sticker.name] = {'fore':sticker.fore_source,
                                                                     'back': sticker.back_source};
                            };

                    });
                });

            $('.sticker').bind('dragstart',function(e){  //!!!!!ALL STICKERS MUST HAVE CLASS 'sticker'
                $scope.dragSrcEl = this;

                // Flag so color change tool is added to sticker
                if($(this).hasClass(chromagreen_category)){
                    $scope.chroma_green = true;
                }
                else
                    $scope.chroma_green = false;
            });

    });

    // Toggle sticker category
    $scope.toggle = function(category){
        $scope.visible[category] = !$scope.visible[category];
    };


    // Drag and drop stickers start
    con.addEventListener('dragover',function(e){
        e.preventDefault(); //@important
    });


    // Used to close tools for all stickers
    var closeTools = function(){
        a = $(stage.find('.y, .x, .delete, .rotate'));

        a.each(function(index){
            a[index].setVisible(false);
        });

        $("#modal").hide();

        layer.draw();
    };

    // STAGE ///////////////////////////////////////////////////////////////

    // Add sticker to stage via drop action
    con.addEventListener('drop',function(e){
        //set up imageObj before creating other items that
        //may be reliant on its dimensions

        //this removes the tool circles around all existing stickers when a new one is dropped
        closeTools();

        var has_chroma_green = $scope.chroma_green;

        imageObj = new Image();
        imageObj.src = $scope.dragSrcEl.src;

        if (has_chroma_green){
            var sources = $scope.image_sources[$scope.dragSrcEl.name];

            imageObjBack = new Image();
            imageObjBack.src = sources['back'];

            imageObjFore = new Image();
            imageObjFore.src = sources['fore'];
        }

        //stop Firefox from opening image
        e.preventDefault();

        //get position relative to the container and page
        x = e.pageX - $('#container').offset().left;
        y = e.pageY - $('#container').offset().top;
        size_offset = 60;

        var group = new Kinetic.Group({
            draggable: true
        });

        if (has_chroma_green){
            var imageBack = new Kinetic.Image({
               image:imageObjBack,
               width: 120,  //this makes the image lower quality for some reason
               height: 120,
               x: x,
               y: y 
            });

            var image = new Kinetic.Image({
               image:imageObjFore,
               width: 120,  //this makes the image lower quality for some reason
               height: 120,
               x: x,
               y: y
            });

        }
        else{

            var image = new Kinetic.Image({
               image:imageObj,
               width: 120,  //this makes the image lower quality for some reason
               height: 120,
               x: x,
               y: y
            });

        }

        // Start size for dropped images. Used in code to set sizes
        var start_size = {"width":120,"height":120};
        var scaler_start = {"x":image.getX() + start_size.width,"y":image.getY() + start_size.height};



        // Delete //////
        var delete_icon = new Kinetic.Text({
            visible:true,
            text: '',
            fontFamily: 'FontAwesome',
            fontSize: 30,
            fill: '#eee',
            stroke: "#222",
            strokeWidth: 2,
            name: 'delete', 
            x:0,
            y:0
            });

        delete_icon.on('click', function(){
            debug('DELETE');
            group.remove();
            $('#modal').hide();

            layer.draw();
         });



 
        // Scale X-axis //////
        var scalerX = new Kinetic.Text({
            x:image.getX() + start_size.width,
            y:image.getY() + start_size.height/2,
            text: '',
            fontFamily: 'FontAwesome',
            fontSize: 30,
            fill: '#eee',
            stroke: "#222",
            strokeWidth: 2,
            draggable:true,
            visible:true,
            name: 'x',
            dragBoundFunc: function(pos){
                return{
                    x: pos.x,
                    y: this.getAbsolutePosition().y
                };
            }
        });

        // set horizontal height of image
        scalerX.on('dragmove touchmove',function(){
            
            var diff = this.getAbsolutePosition().x - image.getAbsolutePosition().x - image.getWidth();
            
            image.setWidth(image.getWidth() + diff * 2);
            image.setAbsolutePosition(image.getAbsolutePosition().x - diff/2, image.getAbsolutePosition().y);
            
            if(has_chroma_green)
            {
                imageBack.setWidth(image.getWidth());
                imageBack.setAbsolutePosition(image.getAbsolutePosition().x, image.getAbsolutePosition().y);
            }

            reposition();
            layer.draw();
        });




        // Scale Y-axis //////
        var scalerY = new Kinetic.Text({
            x:image.getX() + start_size.width/2,
            y:image.getY() + start_size.height,
            text: '',
            fontFamily: 'FontAwesome',
            fontSize: 30,
            fill: '#eee',
            stroke: "#222",
            strokeWidth: 2,
            draggable:true,
            visible:true,
            name: 'y',
            //offset:[image.getWidth()/2,image.getHeight()/2],
            dragBoundFunc: function(pos){
              return{
                x: this.getAbsolutePosition().x,
                y: pos.y
              };
            }
        });

        //set vertical height of image
        scalerY.on('dragmove touchmove',function(){
            
            var diff = this.getAbsolutePosition().y - image.getAbsolutePosition().y - image.getHeight();
            
            image.setHeight(image.getHeight() + diff * 2);
            image.setAbsolutePosition(image.getAbsolutePosition().x, image.getAbsolutePosition().y - diff/2);
            
            if(has_chroma_green)
            {
                imageBack.setHeight(image.getHeight());
                imageBack.setAbsolutePosition(image.getAbsolutePosition().x, image.getAbsolutePosition().y);
            }

            reposition();   
            layer.draw();

        });




        // Rotation //////
        var rotate = new Kinetic.Text({
            x: 0,// image.getX(),
            y: 0,// image.getY() + start_size.height/2,
            text: '',  //leave this it won't render correctly here but will on the canvas
            fontFamily: 'FontAwesome',
            fontSize: 30,
            fill: '#eee',
            stroke: "#222",
            strokeWidth: 2,
            draggable:true,
            visible:true,
            name: 'rotate',
           // offset://[image.getWidth()/2,image.getHeight()/2],
            dragBoundFunc: function(pos) {
                var x = image.getAbsolutePosition().x + start_size.width/2;
                var y = image.getAbsolutePosition().y + start_size.height/2;//100;  // your center point
                var radius = Math.sqrt(Math.pow(image.getWidth()/2,2) + Math.pow(image.getWidth()/2,2));//60;//Math.min(image.getWidth() / 2 , image.getHeight() / 2);//60;
                var scale = radius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)); // distance formula ratio
                debug(scale);
                debug("x,y: " + x + ',' + y);
                  return {
                    y: Math.round((pos.y - y) * scale + y),
                    x: Math.round((pos.x - x) * scale + x)
                  };
              }
        });
        var canvasOffset = $("#container").offset();
        var offsetX = canvasOffset.left;
        var offsetY = canvasOffset.top;
        var startX;
        var startY;

        // Set offsets to put image's x and y in center
        image.setOffsetX(start_size.width/2);
        image.setOffsetY(start_size.height/2);
        
        rotate.setOffsetX(start_size.width/2);
        rotate.setOffsetY(start_size.height/2);

        scalerX.setOffsetX(start_size.width/2);
        scalerX.setOffsetY(start_size.height/2);

        scalerY.setOffsetX(start_size.width/2);
        scalerY.setOffsetY(start_size.height/2);

        delete_icon.setOffsetX(start_size.width/2);
        delete_icon.setOffsetY(start_size.height/2);

        if (has_chroma_green){
            imageBack.setOffsetX(start_size.width/2);
            imageBack.setOffsetY(start_size.height/2);
        }

        rotate.on('mouseenter', function(e){
            startX = parseInt(e.clientX - offsetX);
            startY = parseInt(e.clientY - offsetY);
        });

        rotate.on('dragmove touchmove', function(e){ //dragmove
            // debug(mouseX + " " + mouseY);
            start_position = {"x":image.getAbsolutePosition().x, "y": image.getAbsolutePosition().y};
            rotate_position = {"x":image.getAbsolutePosition().x + start_size.width/2,"y": image.getAbsolutePosition().y + start_size.height/2};

            var dx = startX - parseInt(e.clientX - offsetX);
            var dy = startY - parseInt(e.clientY - offsetY);
            var angle = Math.atan2(dy, dx);
            image.setRotation(angle);

            layer.draw();

        });

        


        // Color picker //////

        $scope.previous_color = null;

        // Used to move color picker with drag
        group.on('dragmove', function(){
            if(scalerX.isVisible() && has_chroma_green)
                move_color();   
        });

        // Move color picker to correct spot in reference to image
        function move_color(){
            var x = image.getAbsolutePosition().x + $('#container').offset().left;
            var y = image.getAbsolutePosition().y - $('#container').offset().top;

            var xAdjust = image.getWidth() + image.getOffsetX();
            var yAdjust = image.getHeight() + image.getOffsetY();    
            $("")
            $("#modal").css({left: x - xAdjust, top: y + yAdjust});
            $("#modal").show();
        }

        // function that changes color of image
        $scope.change_color = function(color){
    
            $scope.previous_color = color;

            var canvas = document.getElementById('color_change_canvas');
            var context = canvas.getContext('2d');

            // clears canvas 
            context.clearRect(0, 0, canvas.width, canvas.height);

            context.drawImage(imageObjBack, 0,0,start_size.width, start_size.height);

            var imageX = 0;
            var imageY = 0;
            var imageWidth = image.getWidth();
            var imageHeight = image.getHeight();

            var imageData = context.getImageData(imageX, imageY, imageWidth, imageHeight);
            var data = imageData.data;

            // Color picker returns hex, call function in helpertools.js
            // to convert to RGB
            var rgb = hexToRgb(color);

            // iterate over all pixels
            for(var i = 0, n = data.length; i < n; i += 4) {
              data[i] = rgb['r'];
              data[i+1] = rgb['g'];
              data[i+2] = rgb['b'];
            }

            context.putImageData(imageData,0,0);

            imageObjBack.src = canvas.toDataURL("image/png");
            layer.draw();

    }



        //hide and show resize and scaler
        image.on('click',function(e){
            if(scalerX.isVisible()){  //this should be enough to determine if all the other buttons are visible as well
                closeTools();
            } else{
                closeTools(); //refactor? this is done because this removes all buttons, but the existance of the button is necessary 
                //to determine the if condition 
                if(has_chroma_green){
                    move_color();
                }
                scalerX.setVisible(true);
                scalerY.setVisible(true);
                delete_icon.setVisible(true);
                rotate.setVisible(true);
            }
            layer.draw();
        });


        //construct group to drop after image loads
        imageObj.onload = function(){
            
            if(has_chroma_green){
                group.add(imageBack);
                move_color();
            }

            group.add(image);
            group.add(scalerX);
            group.add(scalerY);
            group.add(delete_icon);
            group.add(rotate);
            
            layer.add(group);
            
            reposition();
            layer.draw();
        };


        var reposition = function(){
          var x = image.getAbsolutePosition().x;
          var y = image.getAbsolutePosition().y;

          debug("x: " + x + " y: " + y);

          rotate.setAbsolutePosition(x - 10, y - 10);
          
          scalerX.setAbsolutePosition(x + image.getWidth(), y + image.getHeight()/2);
          scalerY.setAbsolutePosition(x + image.getWidth()/2, y + image.getHeight());
          delete_icon.setAbsolutePosition(x + image.getWidth(), y);

        };

    }); // End of drop listener


   // TODO do we need to have these in Scenario?

    function email(pyuserid, emails, data){
      var formData = {"pyuserid":pyuserid, "data":data};
      $.ajax({
        url: '/email',
        type: 'POST',
        data: formData,
        success: function(){        
          send_email(pyuserid, emails);
        }
      });
    }

    function send_email(pyuserid, emails){
        
        $scope.loading = true;
        $scope.$apply();

        var formData = {"pyuserid":pyuserid, "emails":emails};
        $.ajax({
        url: '/send_email',
        type: 'POST',
        data: formData,
        success: function(){
            $scope.loading = false;
            $scope.$apply();
          $( "#dialog-confirm-email" ).dialog({
            resizable: false,
            // height:140,
            // width: 70,
            modal: true,
            draggable:false,
            closeOnEscape:false,
            dialogClass: 'email-dialog no-close',
            buttons: {
              "Start over": function() {
                window.location = "/";
              },
              "Continue": function() {
                $( this ).dialog( "close" );
              }
            }
        })
          .position({of:'#container'});
        },
        error: function(){
            $scope.loading = false;
            $scope.$apply();  
        }
        });
    }


    $scope.call_email = function(){
        //first remove any tool circles if they exist
        closeTools();
        stage.draw();

        var emails=prompt("Please enter your friend's email(s)","oski@berkeley.edu, friend@berkeley.edu");
        //check if input is correct
        if(emails !== null) {                      
          debug('calling email');
          //remove spaces to have one long string as argv for python
          emails = emails.replace(/\s+/g, '');        
          debug(emails);
          //change to use scope variable instead
          pyuserid = getCookie('pyuserid');
          stage.toDataURL({
            callback: function(dataUrl) {
                debug('callback');
                //from helpertools
                email(pyuserid, emails, dataUrl);
            }
          }) ;         
        }
    };

    $scope.create_image = function(){
        debug('called');
        $scope.image_download = 'somethingelse.jpg';
        stage.toDataURL({
            mimeType: 'image/jpg',
            quality: 1,
            callback: function(dataUrl) {
                debug('callback');
                var link = document.createElement('a');
                angular.element(link)
                .attr('href', dataUrl)
                .attr('download', 'test.jpg'); // Pretty much only works in chrome
                link.click();
                debug('click?');
            }
        });
    };


    

} // End of Scenario Controller




//Used to make it easy to turn on and off console.log
function debug(msg){
    if(debug_flag){
        console.log(msg);
    }
}


