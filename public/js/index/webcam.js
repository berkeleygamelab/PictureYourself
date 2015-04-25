//Checks if user's browser has the ability to access the user's webcam
function hasGetUserMedia() {
    // Note: Opera is unprefixed.
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

if (!hasGetUserMedia()) {
    alert('Accessing user webcam is unsupported by the browser. Please use a supported browser (e.g. Chrome).');
}

var stream;

function getUserMedia($scope){
    var video = document.querySelector('video');
    var canvas = document.querySelector('canvas');
    var button = document.querySelector('#button');
    var ctx = canvas.getContext('2d');
    var localMediaStream = null;

    navigator.getMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    navigator.getMedia (
        // constraints
        {
            video:{
                mandatory:{
                    maxWidth: 640,
                    maxHeight: 480
                }
            }
        },

        // successCallback
        function(localMediaStream) {
            stream = localMediaStream;
            video = document.querySelector('video');
            video.src = window.URL.createObjectURL(localMediaStream);
            $('#snap_it').attr("disabled", false).popover('hide');
            $('.up_arrow').fadeOut();
            $scope.$apply(function(){
                $scope.$emit('toggle_quit');
            });
            video.onloadedmetadata = function(e) {
            // Do something with the video here.
            };
        },

        // errorCallback
        function(err) {
            alert('Webcam access denied. Please refresh the page to enable.');
        }
    );

    return true;
}

function stop_webcam(){
    stream.stop();
}
