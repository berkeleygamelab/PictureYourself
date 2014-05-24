

//http://angular-ui.github.io/bootstrap/

//This flag is used to determine if you want console output or not.
//Don't use console.log, instead use debug("some thing you want to send to console")

var debug_flag = false;
var default_background = '/images/stickers/0-backgrounds/Asproul.png';

$(document).ready(function() {

    $("#modal").hide();

    $("#toolicon li").on("click", function(){
        $(this).parent().children().removeClass("active");
        $(this).addClass("active");
    });

    //fixes positioning issue with kineticJS canvas
   $(".kineticjs-content").css('position',''); 
});


/*
* The actual Kinetic Stage where users can move stickers around
* Also loads all the images dynamically
* And stores data about the images on the canvas into the stickers array
*/

//try to wrap this all in a function somehow? ScenarioCtrl is preventing that from happening
function ChromaCtrl($scope){
    var stage_width = 800;
    var stage_height = 550;

    $scope.selected_image = null;

    // Setup kinetic stage
    var stage = new Kinetic.Stage({
        container: 'container',
        width: stage_width,
        height: stage_height
    });


    // Setup layer to add stickers to
    var layer = new Kinetic.Layer();
    stage.add(layer);

    // Background
    var backgroundRect = new Kinetic.Rect({
        width: stage_width,
        height: stage_height,
        opacity: 0

    });

    backgroundRect.on('click', function(){
        $scope.selected_image = null;
        $("#modal").hide();
    });

    layer.add(backgroundRect);

    // Group 1
    var group = new Kinetic.Group({
        draggable: true
    });

    layer.add(group);

    // Group 2
    var group2 = new Kinetic.Group({
        draggable: true
    });

    layer.add(group2);

    // Load images
    foregroundImg = new Image();
    foregroundImg.src = '/images/stickers/2-shirts/zSweaterWomanPink.png';

    backgroundImg = new Image();
    backgroundImg.src = '/images/stickers/2-shirts/zSweaterWomanPink_back.png';

    f2 = new Image();
    f2.src = "images/stickers/2-shirts/zSweaterGuyBlue.png";

    f2b = new Image();
    f2b.src = "images/stickers/2-shirts/zSweaterGuyBlue_back.png";


    // Group 1
    foregroundImg.onload = function(){    
        var foreground = new Kinetic.Image({
            image:foregroundImg,
            width: 120, 
            height: 120,
            x: stage_width/2 - 60,
            y: stage_height/2 - 60
        });


        group.add(foreground);
        layer.draw();
    };

    // load background and setup color changing 
    backgroundImg.onload = function(){    
        var background = new Kinetic.Image({
            image:backgroundImg,
            width: 120, 
            height: 120,
            x: stage_width/2 - 60,
            y: stage_height/2 - 60
        });

        if ($scope.selected_image == null){
            $scope.selected_image = backgroundImg;
        }

        group.add(background);
        layer.draw();
        
    };
    function move_color(selected_group, e){
        var canvas = document.getElementById('container');
        $("#modal").css({left: e.pageX, top: e.pageY});
        $("#modal").show();
        console.log($("#modal").offset());
    }

    // on click select this image
    group.on('click', function(e){
        if($scope.selected_image == backgroundImg)
        {
            $("#modal").hide();
            $scope.selected_image = null;
        }
        else{
            $scope.selected_image = backgroundImg;
            move_color(this,e);
        }
    });

    group.on('dragmove', function(e){
        $("#modal").offset({left: e.pageX, top: e.pageY});
    });

    // Group 2
    f2.onload = function(){    
        var foreground = new Kinetic.Image({
            image:f2,
            width: 120, 
            height: 120,
            x: stage_width/2 - 60,
            y: stage_height/2 - 60
        });


        group2.add(foreground);
        layer.draw();
    };

    // load background and setup color changing 
    f2b.onload = function(){    
        var background = new Kinetic.Image({
            image:f2b,
            width: 120, 
            height: 120,
            x: stage_width/2 - 60,
            y: stage_height/2 - 60
        });

        group2.add(background);
        layer.draw();
        
    };

        // on click select this image
    group2.on('click', function(e){
        if($scope.selected_image == f2b)
        {
            $("#modal").hide();
            $scope.selected_image = null;
        }
        else{
            $scope.selected_image = f2b;
            move_color(this, e);
        }
    });

    group2.on('dragmove', function(e){
        $("#modal").offset({left: e.pageX - this.getChildren()[0].getWidth()/2, top: e.pageY - this.getChildren()[0].getHeight()});
    });

    // function that changes
    $scope.change_color = function(color){

    
        var canvas = document.getElementById('color_change_canvas');
        var context = canvas.getContext('2d');
        // clears canvas 
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.drawImage($scope.selected_image, 0,0,120,120);

        var imageX = 0;
        var imageY = 0;
        var imageWidth = $scope.selected_image.width;
        var imageHeight = $scope.selected_image.height;

        var imageData = context.getImageData(imageX, imageY, imageWidth, imageHeight);
        var data = imageData.data;

        var rgb = hexToRgb(color);

        // iterate over all pixels
        for(var i = 0, n = data.length; i < n; i += 4) {
          data[i] = rgb['r'];
          data[i+1] = rgb['g'];
          data[i+2] = rgb['b'];
        }

        context.putImageData(imageData,0,0);

        $scope.selected_image.src = canvas.toDataURL("image/png");
        layer.draw();

    };





    jQuery(document).ready(function($) {

        $('#color1').colorPicker({ onColorChange : function(id, newValue) { 
                $scope.change_color(newValue); 
            } 
        });
    });

}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


ChromaCtrl['$inject'] = ['$scope'];

