// Handles what view we see
app.controller('ViewCtrl', function($scope){
    $scope.views = {snapshot: true, scenario: false}
    $scope.$on('toggle_scenario', function(event, data, selfieCount){
        if(selfieCount != null){
            $scope.$broadcast('load_selfies', data, selfieCount);
        }
        $scope.views.snapshot = !$scope.views.snapshot;
        $scope.views.scenario = !$scope.views.scenario;
    });
});

//Handles getting user image from snapshot, sending image + coords to server, and calling the crop
app.controller('SnapshotCtrl', function($scope, fileReader, $http, $timeout, $window){
    //create proper login methods etc...
    var mouse = 'up';
    var pyuserid = getCookie(pyuseridtag);
    var selfieCount = 1; 
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
    $scope.show_tos = false;
    $scope.show_camera = true;
    $scope.show_capture = false;
    $scope.camera_loaded = false;
    $scope.loading = false;
    $scope.cutDisabled = false;
    $scope.show_buttons = true;
    $scope.has_agreed = false;
    $scope.check_face = false;
    $scope.snapshot_button = {'start':true,'snap_it':false,'cut':false, 'retake':false};

    // //KineticJS setup
    var imageObj = new Image();

    // Button functions
    //Handles retaking an image. Currently unused
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
    $scope.cut = function(){
        var coord = cropObj.getSelectionRectangle().getOpenCVXYWH();
        var formData = {};
        // var filename = $scope.pyuserid + "/" + selfieCount +  ".png";
        // formData["filename"] = filename;
        formData['coords'] = coord.x + ' ' + coord.y  + ' ' + coord.width + ' ' + coord.height;
        formData['pyuserid'] = $scope.pyuserid;
        formData['count'] = selfieCount;

        $http.post('/grabcut', formData).success(function(data){
            // Swap views
            if (!Date.now) {
                Date.now = function() { return new Date().getTime(); }
            }
            $scope.selfie = data + "?" + Date.now();

            $('.check_image').attr('src', data);
            $scope.check();
        })
        .error(function(){
            $scope.loading = false;
            $scope.cutDisabled = true;
            alert ("There was an issue cropping the image.");
        })
    };

    $scope.check = function(data){
        $scope.check_face = true;
        $scope.loading = false;
        $scope.show_capture = false;
        $scope.snapshot_button = {'start':false,'snap_it':false,'cut':false, 'retake':false};
    }

    $scope.redo = function(){
        $scope.camera = false;
        $scope.show_camera = true;
        $scope.show_capture = false;
        $scope.camera_loaded = false;
        $scope.loading = false;
        $scope.cutDisabled = false;
        $scope.check_face = false;
        $scope.snapshot_button = {'start':true,'snap_it':false,'cut':false, 'retake':false};
        $('#video').attr('src', '')
    }

    $scope.keep = function(){
        $scope.$emit('toggle_scenario', $scope.selfie, selfieCount);
        // Reset snapshot page
        $scope.camera = false;
        $scope.show_camera = true;
        $scope.show_capture = false;
        $scope.camera_loaded = false;
        $scope.loading = false;
        $scope.cutDisabled = false;
        $scope.check_face = false;
        $scope.snapshot_button = {'start':true,'snap_it':false,'cut':false, 'retake':false};
        $('#video').attr('src', '')
        selfieCount += 1 
    }

    $scope.send_snapshot = function(){
        kinetic($('#snapshot').attr('src'));
    };

    $scope.get_tos = function(){
        if($scope.has_agreed){
            $scope.get_camera();
        } else{
            // Parent is ViewCtrl, whose parent is LayoutCtrl
            $scope.$parent.$parent.show_quit = true;
            $scope.snapshot_button.start = false;
            $scope.show_tos = true;
            $scope.camera_loaded = true;
            $scope.show_camera = false;
            $scope.show_buttons = false;
            $scope.has_agreed = true;
        }
    }

    $scope.startover = function(){
        $window.location.href = '/';
    }

    $scope.get_camera = function(){
    /*if iPhone, do input...)
      else if no getUserMedia() do fileupload.
    */
        $scope.show_buttons = true;
        $scope.camera = getUserMedia();
        $scope.show_tos = false;
        $scope.snapshot_button.start = false;
        $scope.snapshot_button.snap_it = true;
        $scope.camera_loaded = true;
        $scope.show_camera = true;
    };

    $scope.capture = function(){
        ctx.drawImage(video, 0, 0);
        //hide camera and show capture
        $scope.show_camera = false;
        $scope.show_capture = true;
        kinetic(canvas.toDataURL('image/png'));

        $scope.snapshot_button.cut = true;
        $scope.snapshot_button.snap_it = false;
        // Turn off webcam. Function defined in webcam.js
        stop_webcam()
    };

    $scope.upload_webcam = function(){
        if (cropObj.getSelectionRectangle()) {

            // Display loading; will display regardless of success or failure
            $scope.loading = true;
            $scope.cutDisabled = true;

            var name = $scope.pyuserid;
            var formData = {"name":name, "data":canvas.toDataURL('image/png'), "count": selfieCount};
            $.ajax({
                url: '/fileupload',
                type: 'POST',
                data: formData,
                success: function(){
                    $scope.cut();
                },
                error: function(){
                    $scope.loading = false;
                    $scope.cutDisabled = true;
                    alert("There was an issue uploading the image.");
                }
            });
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
                imageContainerID: "snapshot_container",
            });
            //snapshot effect
            $('#snapshot_container').addClass('animated fadeInUp');

            }; // end of imageObj.onload
        
    }; // End of kinetic Function

});//End of new SnapshotCtrl

$(function () {
  $('[data-toggle="popover"]').popover()
})

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

// SnapshotCtrl.$inject = ['$scope', 'fileReader', '$http', '$timeout', '$window']; //required for minifying angular
// ViewCtrl.$inject = ['$scope']