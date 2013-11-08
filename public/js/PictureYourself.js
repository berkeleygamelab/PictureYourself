//ToDo:
// 	c1 : put in filename for saving file
		
//add UID to uploaded/saved file when user is not yet registered
//Global variables for IP and port
var port = '9393';
var ip = '127.0.0.1';
var pyuseridtag = 'pyuserid' //cookie for GUID
var pyuseridlife = 1;

app.factory('Upload', function($resource,$http){
	return {
		image: function(data){
			return $resource('/fileupload',{},{post:{method:'POST', params:{data:data}}}).post();
			//$http.post('/fileupload',{data:data});
		}
	}
})

function UIDCtrl($scope, fileReader, $http, $timeout){
	//create proper login methods etc...

	var pyuserid=getCookie(pyuseridtag);
	console.log(pyuserid);
	checkCookie(pyuserid);

	function GUID() {
		var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x7;
		return v.toString(16);
		});
		return guid;
	}
	
	

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
// } //UIDCtrl end


// var UploadController = function ($scope, fileReader, $http, $timeout) {
    $scope.pyuserid = getCookie(pyuseridtag);
    var x = 0;
	var y = 0;
	var width = 0;
	var height = 0;
	
	$scope.cut = function(){
		console.log('cut was called')
		var formData = new FormData();
		var filename = $scope.pyuserid + "/1.png";
		formData.append("filename",filename);
		formData.append('coords',x + ' ' + y + ' ' + width + ' ' + height);
		// formData.append('y',y);
		// formData.append('width',width);
		// formData.append('height',height);
		console.log('got this far');
		var xhr2 = new XMLHttpRequest();
		xhr2.open('POST','/grabcut');
		xhr2.send(formData);
		
	}
	
	$scope.send_snapshot = function(){
		//$scope.test = $('#snapshot').attr('src');
		kinetic($('#snapshot').attr('src'));
	}

	$scope.upload_webcam = function(){
		var formData = new FormData();
		// c1 - change var name = cookie_value to correct val
		var name = $scope.pyuserid
		formData.append("name",name);
		formData.append("data",$('#snapshot').attr('src'));
		console.log($('#snapshot').attr('src'));
		var xhr = new XMLHttpRequest();
		xhr.open('POST', '/fileupload')
		//xhr.open('POST', '/grabcut?filename=imgtest.jpg'+'&coords=0+0+100+100'//+x+'+'+y+'+'+width+'+'+height)
		xhr.send(formData);
	
		$timeout(function(){
			kinetic($('#snapshot').attr('src'));
			// window.location.href = 'http://localhost:1234/webcam_test/'+ name;
		},1000);
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
	}

};


//} //UploadController

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
