//http://angular-ui.github.io/bootstrap/

//This flag is used to determine if you want console output or not.
//Don't use console.log, instead use debug("some thing you want to send to console")

var debug_flag = true;
var default_background = '/images/stickers/0-backgrounds/Asproul.png';

$(document).ready(function() {
    /*
    * Gets user selfie
    */
    //also have to refresh page to get changes, why?
    //set pyuserid as global variable to easily access it

    $('#selfie').attr('src', '../users/'+getCookie('pyuserid')+'/1_sticker.png'); //users/ed39cd11-86cd-4faf-7b12-2cd9df6fc706/
    //debug("ID: " + getCookie('pyuserid'));

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
});


/*
* The actual Kinetic Stage where users can move stickers around
* Also loads all the images dynamically
* And stores data about the images on the canvas into the stickers array
*/

function ScenarioCtrl($scope, $resource, $http, $compile){
    var stage_width = 800;
    var stage_height = 550;
    $scope.loading = false;
    var previous_edit = {'image':null,'collapse':null, 'on': true};

    var stage = new Kinetic.Stage({
        container: 'container',
        width: stage_width,//$('#container').width(),
        height: stage_height//$('#container').height()
    });

    var layer = new Kinetic.Layer();
    stage.add(layer);

    var con = stage.getContainer();
    var dragSrcEl = null;
	$scope.slider = document.getElementById('slider');

    $scope.image_download = 'test.jpg';
    var stickers = []; //will store information about stickers

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

    //Background selection
    $scope.backgroundObj = new Image();
    var background = new Kinetic.Image({
        image:$scope.backgroundObj,
        x:0,
        y:0,
        width:stage_width,//$('#container').width(),
        height:stage_height//$('#container').height()
    });
    $scope.backgroundObj.src = default_background;

    $scope.backgroundObj.onload = function(){
        debug("Bacground onload");
        layer.add(background);
        background.setZIndex(1);
        layer.draw();
    };

    background.on('click', function(){
        debug('background click');
        // collapse_last()
    });

    $scope.background_update = function(e){
        $scope.backgroundObj.src = e.target.src;
    };
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

        }) ;//success


    //frame selection
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

    $('.frames').click(function(){
        // collapse_last()
    });

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

    // Grab stickers
    $http.get('/stickers').success(
    function(data){
        data = angular.fromJson(data);
        $scope.visible = {};
        $scope.stickers = data['stickers'];
        $scope.categories = data['categories'];

        angular.forEach($scope.stickers,
            function(stickers,category){
                $scope.visible[category] = (category == "shoes_and_pants");
                //create the dynamic html
                html= "<div id="+category+"_subtab class='subtab_title' "+
                    "ng-click=\"toggle('"+category+"')\">"+$scope.categories[category]+"</div>"+
                    "<div ng-show='visible."+category+"' id='"+category+"_content' class='subtab_content'></div>";
                //compile it with angular so functions work
                compiledElement = $compile(html)($scope);
                $("#sticker_tab").append(compiledElement);
                //add stickers
                angular.forEach(stickers,
                    function(path,name){
                         $("#"+category+"_content").append('<img class=\'sticker\' src="/' + path + '" name="/' + name + '"/>');
                });
            });
        $('.sticker').bind('dragstart',function(e){  //!!!!!ALL STICKERS MUST HAVE CLASS 'sticker'
            $scope.dragSrcEl = this;
        });



    });//success


    $scope.toggle = function(category){
        $scope.visible[category] = !$scope.visible[category];
    };


    // Drag and drop stickers start

    con.addEventListener('dragover',function(e){
        e.preventDefault(); //@important
    });

    var closeTools = function(){
        a = $(stage.find('.y, .x, .delete, .rotate'));
        a.each(function(index){
            a[index].setVisible(false);
        });
    };

    //insert image to stage
    var count = 0;
    con.addEventListener('drop',function(e){
        // collapse_last();
        //set up imageObj before creating other items that
        //may be reliant on its dimensions

        //this removes the tool circles around all existing stickers when a new one is dropped
        closeTools();

        imageObj = new Image();
        imageObj.src = $scope.dragSrcEl.src;

        //stop Firefox from opening image
        e.preventDefault();

        //get position relative to the container and page
        x = e.pageX - $('#container').offset().left;
        y = e.pageY - $('#container').offset().top;
        size_offset = 60;

        var group = new Kinetic.Group({
            draggable: true
        });


        var image = new Kinetic.Image({
           image:imageObj,
           width: 120,  //this makes the image lower quality for some reason
           height: 120,
           x: x ,//+ size_offset,
           y: y// + size_offset//,
		   //filter: Kinetic.Filters.Blur,
           //offset:[60,60] //size determined by width, height input
        });


        //may not need, but may need to refactor code
        var start_size = {"width":120,"height":120};
        var scaler_start = {"x":image.getX() + start_size.width,"y":image.getY() + start_size.height};

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

        //there is a reposition function that sets all the positions
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
            y:0//,
            //offset:[image.getWidth()/2,image.getHeight()/2]
            });

            delete_icon.on('click', function(){
            debug('DELETE');
            group.remove();
            layer.draw();
        });

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


        //hide and show resize and scaler
        image.on('click',function(){
            if(scalerX.isVisible()){  //this should be enough to determine if all the other buttons are visible as well
                closeTools();
            } else{
                closeTools(); //refactor? this is done because this removes all buttons, but the existance of the button is necessary 
                //to determine the if condition 
                scalerX.setVisible(true);
                scalerY.setVisible(true);
                delete_icon.setVisible(true);
                rotate.setVisible(true);
            }
            layer.draw();
        });

        image.on('drop', function(){
            debug("dropped~");
            scalerX.setVisible(true);
            scalerY.setVisible(true);
            delete_icon.setVisible(true);
            rotate.setVisible(true);
        });

        //set rotation
        var canvasOffset = $("#container").offset();
        var offsetX = canvasOffset.left;
        var offsetY = canvasOffset.top;
        var startX;
        var startY;

        image.setOffsetX(start_size.width/2);
        image.setOffsetY(start_size.height/2);
        rotate.setOffsetX(start_size.width/2);
        rotate.setOffsetY(start_size.height/2);

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

        //set horizontal height of image
        scalerX.on('dragmove touchmove',function(){
            var diff = this.getAbsolutePosition().x - image.getAbsolutePosition().x - image.getWidth();
            image.setWidth(image.getWidth() + diff * 2);
            image.setAbsolutePosition(image.getAbsolutePosition().x - diff/2, image.getAbsolutePosition().y);
            reposition();
            layer.draw();
        });

        //set vertical height of image
        scalerY.on('dragmove touchmove',function(){
            var diff = this.getAbsolutePosition().y - image.getAbsolutePosition().y - image.getHeight();
            image.setHeight(image.getHeight() + diff * 2);
            image.setAbsolutePosition(image.getAbsolutePosition().x, image.getAbsolutePosition().y - diff/2);
            reposition();
            layer.draw();

        });

        //construct group to drop after image loads
        imageObj.onload = function(){
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

          // debug("x: " + x + " y: " + y);

          rotate.setAbsolutePosition(x - 10, y - 10);
          scalerX.setAbsolutePosition(x + image.getWidth(),y + image.getHeight()/2);
          scalerY.setAbsolutePosition(x + image.getWidth()/2, y + image.getHeight());
          delete_icon.setAbsolutePosition(x + image.getWidth(), y);


        };//End of reposition

    }); // End of drop listener

    var collapse_last = function(){
        if(previous_edit.image != null){
            previous_edit.collapse();
            previous_edit.image = null;
        }    
        layer.draw();
    };
   
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

} // End of Scenario Controller



//Used to make it easy to turn on and off console.log
function debug(msg){
    if(debug_flag){
        console.log(msg);
    }
}


