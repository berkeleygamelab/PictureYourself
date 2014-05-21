function SnapshotCtrl($scope, fileReader, $http, $timeout){
	//create proper login methods etc...
	var mouse = 'up';
	var pyuserid = getCookie(pyuseridtag);

	//console.log(pyuserid);   // Dev
	checkCookie(pyuserid);

	//canvas setup
	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');
	var video = document.querySelector('video');
	var cropObj; // CropJS object set up in function kinetic()

	var button = document.querySelector('#button'); // need this?
	$scope.pyuserid = getCookie(pyuseridtag);     // fix - Do we need both this and var pyuserid? i don't think so


	//site setup
	$scope.camera = false;
	$scope.show_camera = true;
	$scope.show_capture = false;
	$scope.camera_loaded = false;
	$scope.loading = false;
	$scope.cutDisabled = false;
	$scope.snapshot_button = {'start':true,'snap_it':false,'cut':false, 'retake':false};

	// //KineticJS setup
	var imageObj = new Image();

	// Button functions

    $scope.retake = function(){
    		$scope.snapshot_button.retake = false;
    		$scope.snapshot_button.snap_it = true;
    		$scope.snapshot_button.cut = false;
			$scope.show_camera = true;
			$scope.show_capture = false;
			$scope.loading = false;
			width = 0;
			height = 0;
    };

	//Call grabcut with coordinates
	// fix - Make it so users can drag from bottom right

	$scope.cut = function(){
		var coord = cropObj.getSelectionRectangle().getOpenCVXYWH();
		console.log(coord);
		var formData = {};
		var filename = $scope.pyuserid + "/1.png";
		formData["filename"] = filename;
		formData['coords'] = coord.x + ' ' + coord.y  + ' ' + coord.width + ' ' + coord.height;
		console.log(formData['coords']);
		formData['pyuserid'] = $scope.pyuserid;

		// Display loading
		$scope.loading = true;
		$scope.cutDisabled = true;
		$scope.$apply();

		$.ajax({
			url: '/grabcut',
			type: 'POST',
			data: formData,
			success: function() {
				window.location = '/selfie';
			},
			error: function(){
				$scope.loading = false;
				$scope.cutDisabled = true;
			}
		});
		// // fix - Need to implement code that fires on success
		// $timeout(function(){

		// },1000);
	};

	$scope.send_snapshot = function(){
		kinetic($('#snapshot').attr('src'));
	};

	$scope.get_camera = function(){
    /*if iPhone, do input...)
      else if no getUserMedia() do fileupload.
    */
		$scope.camera = getUserMedia();
		$scope.snapshot_button.start = false;
		$scope.snapshot_button.snap_it = true;
		$scope.camera_loaded = true;
	};

	$scope.capture = function(){
		ctx.drawImage(video, 0, 0);
		//hide camera and show capture
  		$scope.show_camera = false;
  		$scope.show_capture = true;
		kinetic(canvas.toDataURL('image/png'));

		$scope.snapshot_button.cut = true;
		$scope.snapshot_button.snap_it = false;
	};

	$scope.upload_webcam = function(){
		if (cropObj.getSelectionRectangle()) {
			var name = $scope.pyuserid;
			var formData = {"name":name, "data":canvas.toDataURL('image/png')};
			$.ajax({
				url: '/fileupload',
				type: 'POST',
				data: formData,
				success: function(){
					$scope.cut();
				}
			});
		} else {
			alert("You must select a cut");
		}

	};


	// Creates the kineticJS environment
	// Should be called by the change of img

	var kinetic = function(result) {
		imageObj.src = result;
		imageObj.onload = function() {
		// CropJS set up
		cropObj = new CropJS({
			cropEdges: new EdgeList({
				topY: 160,
				bottomY: 320,
				leftX: 213,
				rightX: 426,
			}),
			image: imageObj,
			imageContainerID: "container",
		});
		//snapshot effect
		$('#container').addClass('animated fadeInUp');

      	}; // end of imageObj.onload
	    
	}; // End of kinetic Function

}//End of new SnapshotCtrl

app.directive("ngFileSelect",function(){
  return {
    link: function($scope,el){

      el.bind("change", function(e){

        $scope.file = (e.srcElement || e.target).files[0];
        $scope.getFile();
      });

    }

  };
});

function debug(msg){
    if(debug_flag){
        console.log(msg);
    }
}

// SnapshotCtrl.$inject = ['$scope', 'fileReader', '$http', '$timeout'];