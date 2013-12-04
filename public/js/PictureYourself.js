//add UID to uploaded/saved file when user is not yet registered
//Global variables for IP and port
var port = '9393';
var ip = '127.0.0.1';
var pyuseridtag = 'pyuserid' //cookie for GUID
var pyuseridlife = 1;

function setCookie(c_name,value,exdays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
	console.log('set cookie');
}

function getCookie(c_name) {
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1)
	  c_start = c_value.indexOf(c_name + "=");
	if (c_start == -1)
	  c_value = null;
	else {
	  c_start = c_value.indexOf("=", c_start) + 1;
	  var c_end = c_value.indexOf(";", c_start);
	  if (c_end == -1)
			c_end = c_value.length;
		c_value = unescape(c_value.substring(c_start,c_end));
	}
	return c_value;
}

function checkCookie(pyuserid){
  if (pyuserid!=null && pyuserid!="")
  	console.log('creating pyuserid');
	else  {
		var randomID = GUID();
  	// check if value GUID is already registered on server
    setCookie(pyuseridtag,randomID,pyuseridlife);
    console.log(getCookie(pyuseridtag));
  }
}

function GUID(){
	var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x7;
		return v.toString(16);
	});
	return guid;
}


function SnapshotCtrl($scope, fileReader, $http, $timeout){
	//create proper login methods etc...
	var mouse = 'up';
	var pyuserid = getCookie(pyuseridtag);
	//console.log(pyuserid);   // Dev
	checkCookie(pyuserid);

	var button = document.querySelector('#button');
    $scope.pyuserid = getCookie(pyuseridtag);     // fix - Do we need both this and var pyuserid?

	// variables for cut creation
	var x = 0;
	var y = 0;
	var width = 0;
	var height = 0;
	var mouse = 'up';

	//Call grabcut with coordinates
	// fix - Make it so users can drag from bottom right

	$scope.cut = function(){
		//console.log('cut was called');  // Dev
		
		var formData = new FormData();
		var filename = $scope.pyuserid + "/1.png";
		formData.append("filename",filename);
		formData.append('coords', x + ' ' + y + ' ' + width + ' ' + height);
		formData.append('pyuserid', $scope.pyuserid)
		//console.log('got this far');  // Dev
		var xhr2 = new XMLHttpRequest();
		xhr2.open('POST','/grabcut');
		xhr2.send(formData);
		// fix - Need to implement code that fires on success
		$timeout(function(){
			$scope.selfie();
		},1000);
	}

	$scope.send_snapshot = function(){
		kinetic($('#snapshot').attr('src'));
	}

	// fix - Does this need to be a function?
	$scope.selfie = function() {
		//console.log("redirecting"); // Dev
		window.location = '/selfie';
	}

	$scope.upload_webcam = function(){
		//console.log('here')
		var name = $scope.pyuserid;
		var formData = {"name":name, "data":$('#snapshot').attr('src')};
		
		$.ajax({
			url: '/fileupload',
			type: 'POST',
			data: formData,
			success: function(){
				$scope.cut();
			}
		})
		// var xhr = new XMLHttpRequest();
		// xhr.open('POST', '/fileupload');
		// xhr.send(formData);
		// 
		// // fix - impliment to happen with successful call instead of timeout
		// $timeout(function(){
		// 	$scope.cut();
		// },1000);
	}

	// Looks for when img changes then recreates canvas for rect selection
	// fix - need to look up img by id instead
	$('img').bind('load',function(){
		console.log('img change');
		kinetic($('img').attr('src'))
	})

	// Creates the kineticJS environment
	// Should be called by the change of img

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
		
		$(document).on('mousedown', function(e){
			if (stage){
				if(mouse == 'up'){
					mouse = 'down';
					console.log('Up: ' + mouse);
				}
				
				selection.setX(stage.getPointerPosition().x);
				selection.setY(stage.getPointerPosition().y);
				x = selection.getX();
				y = selection.getY();

			}
			
		});
		
		$(document).on('mousemove', function(e){
			if (stage){
				if(mouse == 'up') return;
				
				selection.setWidth(stage.getPointerPosition().x - selection.getX());
				selection.setHeight(stage.getPointerPosition().y - selection.getY());

				width = selection.getWidth();
				height = selection.getHeight();
				layer.draw();
			}
		});

		$(document).on('mouseup', function(){
			if (stage){

					if(mouse == 'down'){
						mouse = 'up';
						console.log('Down: ' + mouse);
						console.log('Params: X:' + x + ", Y:"+y+ ", W:"+width+ ", H:"+height);
			
					}
				}
		});

	    
	}

};//End of new SnapshotCtrl


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

function LoginCtrl($scope){
	//create proper login methods etc...
	$scope.username = 'username';
	$scope.login = function(){
		console.log($scope.username);
		var xhr = new XMLHttpRequest();
		xhr.open('POST','/loggedin?username='+$scope.username);
		xhr.send();
		window.location.href = 'http://'+ip+':'+port+'/loggedin?username='+$scope.username;
		}
}

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
}
