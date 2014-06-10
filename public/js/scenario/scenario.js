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
            change_color($('select[name="colorpicker"]').val(), layer, $scope);   
        });

    // Used to close tools for all stickers
    var closeTools = function(){
        var tools = $(stage.find('.y, .x, .delete, .rotate, .background'));

        tools.each(function(index){
            tools[index].visible(false);
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
    stage_container.addEventListener('dragover',function(e){
        e.preventDefault(); //@important
    });


    // STAGE ///////////////////////////////////////////////////////////////

    // Add sticker to stage via drop action
    stage_container.addEventListener('drop',function(e){

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


    $scope.call_email = function(){
        // Show loading overlay
        $(".loader").show();

        closeTools();
        stage.draw();

        var emails = prompt("Please enter your friend's email(s)","oski@berkeley.edu, friend@berkeley.edu");
        
        //check if input is correct
        if(emails !== null) {  

          //remove spaces to have one long string as argv for python
          emails = emails.replace(/\s+/g, '');        

          //change to use scope variable instead
          pyuserid = getCookie('pyuserid');
          
          stage.toDataURL({
            callback: function(dataUrl) {
                debug('callback');
                email(pyuserid, emails, dataUrl);
            }

          }) ;         
        }
        // User clicked cancel, hide loading screen
        else{
            $(".loader").hide();
        }

    };

    

} // End of Scenario Controller



//Used to make it easy to turn on and off console.log
function debug(msg){
    if(debug_flag){
        console.log(msg);
    }
}

