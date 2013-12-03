var CHROMA_GREEN = [3, 200, 52]

var skin_color_converter = function(imageSource, color) {
	// imageSource is URL of sticker/body
	// color is RGB list of new color for sticker/body
	
	var image = document.createElement('img');
	image.src = imageSource;
	document.body.appendChild(image);

	var canvas = document.createElement('canvas');
	canvas.width = image.width;
	canvas.height = image.height;
	document.body.appendChild(canvas);

	var context = canvas.getContext("2d");
	context.drawImage(image, 0, 0);

	var imageData = context.getImageData(0, 0, image.width, image.height);
	for (var i=0; i < imageData.data.length; i += 4) {
		if (imageData.data[i] == CHROMA_GREEN[0] &&
			imageData.data[i+1] == CHROMA_GREEN[1] &&
			imageData.data[i+2] == CHROMA_GREEN[2]
			) {
			imageData.data[i] == color[0];
			imageData.data[i+1] == color[1];
			imageData.data[i+2] == color[2];
		}
	}

	context.putImageData(imageData);
	var dataURL = canvas.toDataURL();
}







/*

var image = new Image();
image.onload = function() {
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Now you can access pixel data from imageData.data.
    // It's a one-dimensional array of RGBA values.
    // Here's an example of how to get a pixel's color at (x,y)
    var index = (y*imageData.width + x) * 4;
    var red = imageData.data[index];
    var green = imageData.data[index + 1];
    var blue = imageData.data[index + 2];
    var alpha = imageData.data[index + 3];
};
image.src = base64EncodedImage



*/