app.factory('Upload', function($resource,$http){
	return {
		image: function(data){
			return $resource('/fileupload',{},{post:{method:'POST', params:{data:data}}}).post();
			//$http.post('/fileupload',{data:data});
		}
	}
})

var UploadController = function ($scope, fileReader, Upload, $http, $timeout) {
     console.log(fileReader)
    $scope.getFile = function () {
		var x = 0;
		var y = 0;
		var width = 0;
		var height = 0;
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
                      .then(function(result) {
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
		console.log($scope.file)
		var data = new FormData();
		var xhr = new XMLHttpRequest();
		
		data.append('file',$scope.file,$scope.file.name);
		xhr.open('POST','/fileupload');
		xhr.send(data);
		$timeout(function(){
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/grabcut?filename=test.jpg&coords='+x+'+'+y+'+'+width+'+'+height)
			xhr.send();
			// $http.post('/grabcut', {filename:'test.jpg',coord:'10 10 100 200'});
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