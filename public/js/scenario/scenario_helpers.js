function kineticSetup(stage_width, stage_height){

    var stage = new Kinetic.Stage({
        container: 'container',
        width: stage_width,
        height: stage_height
    });

    var layer = new Kinetic.Layer();
    stage.add(layer);

    return {'stage' : stage, 'layer' : layer};
}

function backgroundSetup(closeTools, default_backgroud, layer, stage){
    
    var background_obj = new Image();

    var background = new Kinetic.Image({
        image: background_obj,
        x:0,
        y:0,
        width:  stage.getWidth(),
        height: stage.getHeight()
    });

    background_obj.src = default_background;

    background_obj.onload = function(){
        layer.add(background);
        background.setZIndex(1);

        layer.draw();
    };

    // Remove sticker tools when background is clicked
    background.on('click', function(){
        closeTools();
    });

    return background;
}

function grabBackgroundImages($scope){
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
}


