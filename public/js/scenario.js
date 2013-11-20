function ScenarioCtrl($scope, $resource, $http){

		var layer = new Kinetic.Layer();
		var stage = new Kinetic.Stage({
		    container: 'container',
		    width: 600,
		    height: 600
		});
		stage.add(layer);
		
		$http.get('test/stickers').success(function(data){
			angular.forEach(data,function(sticker){
				
				var image = new Image();
				image.src = sticker;
				
				image.onload = function() {
					var pic = new Kinetic.Image({
						image:image,
						draggable:true
					});
					
					layer.add(pic);
					layer.draw();
				};

			}); //forEach
		});//success


		

}
