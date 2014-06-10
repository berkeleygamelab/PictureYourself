//http://angular-ui.github.io/bootstrap/

//COLOR PICKER - https://github.com/tkrotoff/jquery-simplecolorpicker

//This flag is used to determine if you want console output or not.
//Don't use console.log, instead use debug("some thing you want to send to console")
var debug_flag = true;
var default_background = '/images/stickers/0-backgrounds/ASproul.jpg';

$(document).ready(function() {
    /*
    * Gets user selfie
    */
    //also have to refresh page to get changes, why? probably a caching thing?
    //set pyuserid as global variable to easily access it

    $('#selfie').attr('src', '../users/'+getCookie('pyuserid')+'/1_sticker.png');

    $("#toolicon li").on("click", function(){
        $(this).parent().children().removeClass("active");
        $(this).addClass("active");
    });

    //fixes positioning issue with kineticJS canvas
    $(".kineticjs-content").css('position',''); 
    
    $("#modal").hide();

    // Canvas where color changing occurs. Should always be hidden
    $("#color_change_canvas").hide();
});


/*
* The actual Kinetic Stage where users can move stickers around
* Also loads all the images dynamically
* And stores data about the images on the canvas into the stickers array
*/

function ScenarioCtrl($scope, $resource, $http, $compile, Sticker){
    var stage_width = 800;
    var stage_height = 550;
    
    // flags
    $scope.loading = false;
    $scope.chroma_green = false;

    $scope.image_sources = {};
    $scope.selected_image = null;

    // KineticJS Setup ///////////////////////////////////////////////////////////////
    kinetic = kineticSetup(stage_width,stage_height);

    var layer = kinetic.layer;
    var stage = kinetic.stage;

    var stage_container = stage.container();
    var dragSrcEl = null;

    $scope.image_download = 'test.jpg';
    var stickers = []; //will store information about stickers

    $('select[name="colorpicker"]').simplecolorpicker({picker:true}).
        on('change', function(){
            change_color($('select[name="colorpicker"]').val());    
        });

    // Used to close tools for all stickers
    var closeTools = function(){
        a = $(stage.find('.y, .x, .delete, .rotate, .background'));

        a.each(function(index){
            a[index].visible(false);
        });

        $("#modal").hide();

        layer.draw();
    };


    // Background ///////////////////////////////////////////////////////////////
    
    $scope.background = backgroundSetup(closeTools, default_background, layer, stage);

    // Called when user selects a background
    $scope.background_update = function(e){
        $scope.background.getImage().src = e.target.src;
    };


    // Load background images via ajax call
    grabBackgroundImages($scope, $http, $compile);

    // Stickers ///////////////////////////////////////////////////////////////
    grabStickerImages($scope, $http, $compile);

    // Toggle sticker category
    $scope.toggle = function(category){
        $scope.visible[category] = !$scope.visible[category];
    };


    // Drag and drop stickers start
    con.addEventListener('dragover',function(e){
        e.preventDefault(); //@important
    });


    // STAGE ///////////////////////////////////////////////////////////////

    // Add sticker to stage via drop action
    con.addEventListener('drop',function(e){

        //stop Firefox from opening image
        e.preventDefault();

        // close tools of previously selected sticker 
        if ($scope.selected_sticker != null) { $scope.selected_sticker.toggleTools(false) };

        // Assign a local variable with chroma green flag value
        var has_chroma_green = $scope.chroma_green;

        imageObj = new Image();
        imageObj.src = $scope.dragSrcEl.src;
        
        var imageObjBack = null;

        // If chroma green set background object and foreground object appropriately 
        if (has_chroma_green){
            var sources = $scope.image_sources[$scope.dragSrcEl.name];

            imageObjBack = new Image();
            imageObjBack.src = sources['back'];

            imageObj.src = sources['fore'];

            $scope.selected_background = imageObjBack;
        }

        //get position relative to the container and page
        x = e.pageX - $('#container').offset().left;
        y = e.pageY - $('#container').offset().top;

        // Start size for dropped images. Used in code to set sizes
        var start_size = {"width":120,"height":120};

        // Sticker.new(Image, {'x':,'y':}, {'width':,'height':'}, Kinetic.Layer, Image)
        // Creates a new sticker object from factory in factories.js
        // Returns a dictionary with sticker objects and needed functions.

        var sticker = Sticker.new(imageObj, {'x':x,'y':y}, start_size, layer, imageObjBack, $scope, stage);

        $scope.selected_sticker = sticker;


        //hide and show tools
        sticker.image.on('click',function(e){
            var is_visible = sticker.scalerX.visible();

            if(is_visible){ 
                $scope.selected_background = null;
                $scope.selected_sticker = null;    

            } else{
                
                // Close tools for previously selected sticker
                if($scope.selected_sticker != null)
                    $scope.selected_sticker.toggleTools(false);

                $scope.selected_sticker = sticker;  

                // Set previous selected color
                if($scope.selected_sticker.previous_color != null){
                    $('select[name="colorpicker"]').simplecolorpicker('selectColor', $scope.selected_sticker.previous_color);   
                }

                // Move color picker and assign background image object
                if(has_chroma_green){
                    sticker.move_color();
                    $scope.selected_background = imageObjBack;
                }
            }
            
            sticker.toggleTools(!is_visible);

            layer.draw();
        });



    }); // End of drop listener


   // TODO do we need to have these in Scenario?
   //Probably not, but there dependencies on things defined in this file, such as the stage. 

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
        $scope.image_download = 'somethingelse.jpg';
        stage.toDataURL({
            mimeType: 'image/jpg',
            quality: 1,
            callback: function(dataUrl) {
                var link = document.createElement('a');
                angular.element(link)
                .attr('href', dataUrl)
                .attr('download', 'test.jpg'); // Pretty much only works in chrome
                link.click();
                debug('click?');
            }
        });
    };


    // Update the color of a background image
    // Basic operation:
    // 1 - Draw image on hidden canvas
    // 2 - Export canvas image pixel data to variable
    // 3 - Traverse image pixel and change colors
    // 4 - Put new colored image back on canvas
    // 5 - Export canvas as image and assign to source of background image

    function change_color(color){

        if($scope.selected_sticker)
            $scope.selected_sticker.previous_color = color;

        var canvas = document.getElementById('color_change_canvas');
        var context = canvas.getContext('2d');

        canvas.width = $scope.selected_background.width;
        canvas.height = $scope.selected_background.height;

        // clears canvas 
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.drawImage($scope.selected_background, 0,0, canvas.width, canvas.height);

        var imageX = 0;
        var imageY = 0;
        var imageWidth = $scope.selected_background.width;
        var imageHeight = $scope.selected_background.height;

        var imageData = context.getImageData(imageX, imageY, imageWidth, imageHeight);
        var data = imageData.data;

        // Color picker returns hex, call function in helpertools.js
        // to convert to
        var rgb = hexToRgb(color);

        // iterate over all pixels
        for(var i = 0, n = data.length; i < n; i += 4) {
          data[i] = rgb['r'];
          data[i+1] = rgb['g'];
          data[i+2] = rgb['b'];
        }

        context.putImageData(imageData,0,0);
        $scope.selected_background.onload = null;

        $scope.selected_background.src = canvas.toDataURL("image/png");

        layer.draw();
    }
    

} // End of Scenario Controller



//Used to make it easy to turn on and off console.log
function debug(msg){
    if(debug_flag){
        console.log(msg);
    }
}

