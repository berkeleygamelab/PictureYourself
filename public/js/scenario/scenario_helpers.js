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

function grabStickerImages($scope){
	
	var default_category = "shoes_and_pants";
    
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
                                '\' src="/' + sticker.source + '" name="' + sticker.name +
                                 '" data-chroma_green="' + sticker.chroma_green.toString() +'"/>');


                            if(sticker.chroma_green){
                                $scope.image_sources[sticker.name] = {'fore':sticker.fore_source,
                                                                     'back': sticker.back_source};
                            };

                    });
                });

            $('.sticker').bind('dragstart',function(e){  //!!!!!ALL STICKERS MUST HAVE CLASS 'sticker'
                $scope.dragSrcEl = this;

                // Flag so color change tool is added to sticker
                debug($(this).data('chroma_green'));
                if($(this).data('chroma_green') == true){
                    $scope.chroma_green = true;
                }
                else
                    $scope.chroma_green = false;
            });

    });
}

