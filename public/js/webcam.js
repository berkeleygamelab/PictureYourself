function hasGetUserMedia() {
  // Note: Opera is unprefixed.
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

if (hasGetUserMedia()) {
  // Good to go!
} else {
  alert('Accessing user webcam is unsupported by the browser. Please manually upload a picture.');
}


function getUserMedia(){

	var video = document.querySelector('video');
	var canvas = document.querySelector('canvas');
	var button = document.querySelector('#button');
	var ctx = canvas.getContext('2d');
	var localMediaStream = null;

	navigator.getMedia = ( navigator.getUserMedia ||
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
			var video = document.querySelector('video');
			video.src = window.URL.createObjectURL(localMediaStream);
			video.onloadedmetadata = function(e) {
	        // Do something with the video here.
	    	};
	   	},

	   // errorCallback
	   function(err) {
	    console.log("The following error occured: " + err);
	   }
	);

	return true;
}


