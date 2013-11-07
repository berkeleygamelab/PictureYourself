
app.factory('Upload', function($resource,$http){
	return {
		image: function(data){
			return $resource('/fileupload',{},{post:{method:'POST', params:{data:data}}}).post();
			//$http.post('/fileupload',{data:data});
		}
	}
})

var UploadController = function ($scope, fileReader, Upload, $http, $timeout) {
    
	$scope.send_snapshot = function(){
		//$scope.test = $('#snapshot').attr('src');
		kinetic($('#snapshot').attr('src'));
	}
	
	function stringGen(len)
	{
	    var text = " ";

	    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < len; i++ )
	        text += charset.charAt(Math.floor(Math.random() * charset.length));

	    return text;
	}
	
	$scope.upload_webcam = function(){
		var formData = new FormData();
		var name = stringGen(5);
		formData.append("name",name);
		formData.append("data",$('#snapshot').attr('src'));
		console.log($('#snapshot').attr('src'));
		var xhr = new XMLHttpRequest();
				xhr.open('POST', '/webcam_test')
				//xhr.open('POST', '/grabcut?filename=imgtest.jpg'+'&coords=0+0+100+100'//+x+'+'+y+'+'+width+'+'+height)
				xhr.send(formData);
				
				$timeout(function(){
					window.location.href = 'http://localhost:1234/webcam_test/'+ name;
				},3000);
	}
	
	var kinetic = function(result) {
        $scope.imageSrc = result;
      	var imageObj = new Image();
		imageObj.src = result;
		
		var stage = new Kinetic.Stage({
        container: 'container',
        width: imageObj.width,
        height: imageObj.height
      	});
		
		var background = new Kinetic.Rect({
			x:0,
			y:0,
			width: imageObj.width,
			height: imageObj.height,
			fillEnabled: false,
			opacity: 1
		});
		
		var selection = new Kinetic.Rect({
			x:0,
			y:0,
			stroke:'yellow',
			strokeWidth: 3,
			fillEnabled: false
		})
		var originalPoint = {x: selection.getX(), y: selection.getY()};

      	var layer = new Kinetic.Layer();
		var down = false;
		
      	imageObj.onload = function() {
        	var yoda = new Kinetic.Image({
          		x: 0,
          		y: 0,
          		image: imageObj,
          		width: imageObj.width,
          		height: imageObj.height
        	});

       	 // add the shape to the layer
	        layer.add(yoda);
			layer.add(background);
			layer.add(selection);

       	 // add the layer to the stage
       	 stage.add(layer);
      	}; // end of imageObj.onload
	
	stage.on('mousedown',function(){
		down = true;
		selection.setX(stage.getMousePosition().x);
		selection.setY(stage.getMousePosition().y);
		x = selection.getX();
		y = selection.getY();
	})
	
	stage.on('mouseup', function(){
		down = false;
	})

	stage.on('mousemove', function(){
		if (!down) return;

		selection.setWidth(stage.getMousePosition().x - selection.getX());
		selection.setHeight(stage.getMousePosition().y - selection.getY());

		width = selection.getWidth();
		height = selection.getHeight();
		layer.draw();
	});
};
	
    $scope.getFile = function () {
		var x = 0;
		var y = 0;
		var width = 0;
		var height = 0;
		//var filename = '';
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
                      .then(
						function(result) {
		                        $scope.imageSrc = result;
					      	var imageObj = new Image();
							imageObj.src = result;
							
							var stage = new Kinetic.Stage({
					        container: 'container',
					        width: imageObj.width,
					        height: imageObj.height
					      	});
							
							var background = new Kinetic.Rect({
								x:0,
								y:0,
								width: imageObj.width,
								height: imageObj.height,
								fillEnabled: false,
								opacity: 1
							});
							
							var selection = new Kinetic.Rect({
								x:0,
								y:0,
								stroke:'yellow',
								strokeWidth: 3,
								fillEnabled: false
							})
							var originalPoint = {x: selection.getX(), y: selection.getY()};
					
					      	var layer = new Kinetic.Layer();
							var down = false;
							
					      	imageObj.onload = function() {
					        	var yoda = new Kinetic.Image({
					          		x: 0,
					          		y: 0,
					          		image: imageObj,
					          		width: imageObj.width,
					          		height: imageObj.height
					        	});
		
					       	 // add the shape to the layer
						        layer.add(yoda);
								layer.add(background);
								layer.add(selection);
		
					       	 // add the layer to the stage
					       	 stage.add(layer);
					      	}; // end of imageObj.onload
						
						stage.on('mousedown',function(){
							down = true;
							selection.setX(stage.getMousePosition().x);
							selection.setY(stage.getMousePosition().y);
							x = selection.getX();
							y = selection.getY();
						})
						
						stage.on('mouseup', function(){
							down = false;
						})
		
						stage.on('mousemove', function(){
							if (!down) return;
		
							selection.setWidth(stage.getMousePosition().x - selection.getX());
							selection.setHeight(stage.getMousePosition().y - selection.getY());
		
							width = selection.getWidth();
							height = selection.getHeight();
							layer.draw();
						})

						}); //end of then
 	
	
	$scope.upload = function(){
		var data = new FormData();
		var xhr = new XMLHttpRequest();
		
		data.append('file',$scope.file,$scope.file.name);
		xhr.open('POST','/fileupload');
		xhr.send(data);
		$timeout(function(){
			var xhr = new XMLHttpRequest();
			console.log($scope.file.name);
			xhr.open('POST', '/grabcut?filename='+$scope.file.name+'&coords='+x+'+'+y+'+'+width+'+'+height)
			xhr.send();
			// $http.post('/grabcut', {filename:'test.jpg',coord:'10 10 100 200'});
		},1000)
		$timeout(function(){
			window.location.href = 'http://localhost:1111/sticker';
		},2000);
		
	}				
    $scope.$on("fileProgress", function(e, progress) {
        $scope.progress = progress.loaded / progress.total;
    });


}; //$scope.getFile
} //UploadController

app.directive("ngFileSelect",function(){

  return {
    link: function($scope,el){
      
      el.bind("change", function(e){
      
        $scope.file = (e.srcElement || e.target).files[0];
        $scope.getFile();
      })
      
    }
    
  }
  
  
})



function LayoutCtrl($scope){
	
}

function IndexCtrl($scope){
	
}

function StickerCtrl($scope){	
	var img = angular.element("#picture").attr('src');
	var background = new Image();
  	var imageObj = new Image();
	var hatObj = new Image();
  	
	$scope.background = background;
	$scope.imageObj = imageObj;
	$scope.hatObj = hatObj;
	imageObj.src = img;
	background.src = 'img/background.jpg'
	hatObj.src = 'img/hat.png'
	
	
	var stage = new Kinetic.Stage({
    container: 'container',
    width: background.width,
    height: background.height
  	});

    var layer = new Kinetic.Layer();

	
  	imageObj.onload = function() {
    	var floater = new Kinetic.Image({
      		x: 0,
      		y: 0,
      		image: imageObj,
      		width: imageObj.width,
      		height: imageObj.height,
			draggable:true
    	});
		var backgroundImg = new Kinetic.Image({
			x:0,
			y:0,
			image: background,
			width: background.width,
			height: background.hidth
		})
		var hat = new Kinetic.Image({
			x:0,
			y:0,
			image: hatObj,
			width: hatObj.width,
			height: hatObj.hidth,
			draggable:true
		})
		
		layer.add(backgroundImg);
		layer.add(floater);
		layer.add(hat);


        // add the shape to the layer
		hat.hide();
		stage.add(layer);

        // add button event bindings
        document.getElementById('show').addEventListener('click', function() {
		hat.show();
        layer.draw();
        }, false);

		var addHat = function(){
			hat.show();
			layer.draw();
		}

	}
	
	var addHat = function(){
		hat.show()
	};
		
$scope.images = [imageObj,hatObj,background];
	
}