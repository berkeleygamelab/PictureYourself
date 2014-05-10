function checkCompatibility() {
	
	var features = {};
	features["canvas"] = Modernizr.canvas;
	features["webgl"] = Modernizr.webgl;
	features["localstorage"] = Modernizr.localstorage;
	features["touch"] = Modernizr.touch;
	features["geolocation"] = Modernizr.geolocation;
	features["websqldatabase"] = Modernizr.websqldatabase;
	features["history"] = Modernizr.history;
	features["draganddrop"] = Modernizr.draganddrop;
	features["rgba"] = Modernizr.rgba;
	features["textshadow"] = Modernizr.textshadow;
	features["opacity"] = Modernizr.opacity;
	features["cssanimations"] = Modernizr.cssanimations;
	features["cssreflections"] = Modernizr.cssreflections;
	features["csstransitions"] = Modernizr.csstransitions;
	features["video"] = Modernizr.video;
	features["audio"] = Modernizr.audio;
	features["sessionstorage"] = Modernizr.sessionstorage;

	var flag = true;
	for (var feature in features) {
		if (!feature) {
			flag = false;
		}
	}

	appManager(flag);

}


function appManager(flag) {
	if (!flag) {
		var message = "";
		message += 'The browser you are using does not support all the features of this app. ';
		message += 'Please switch to a modern browser such as ';
		message += '<a href="http://www.google.com/chrome">Chrome</a>';
		message += '. ';
		document.getElementById("compatibility").innerHTML = "message";
		document.getElementById("compatibility").style.visibility = "visible";
	}
}

function alertUser() {
	var width = $(window).width();
	var height = $( window ).height();
	if (width < 800) {
		
		// TODO removing this for now since it's really annoying

		// alert("Your browser window is too small for this app. Please maximize it.");
	}
};

var resizeTimer;
$(window).resize(function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(alertUser, 2000);
});
