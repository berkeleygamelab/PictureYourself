
$(document).ready(function(){
	
		    'use strict';

		    // Get the absolute position of a particular object on the page
		    // Source: http://www.quirksmode.org/js/findpos.html
		    function findPos(obj) {
		        var curleft = 0, curtop = 0;
		        if (obj.offsetParent) {
		            do {
		                curleft += obj.offsetLeft;
		                curtop += obj.offsetTop;
		            } while (obj = obj.offsetParent);
		            return [curleft, curtop];
		        } else {
		            return false;
		        }
		    }

		    // Get the current position of the mouse, relative to the page
		    function getCoords(event) {
		        event = event || window.event;
		        if (event.pageX || event.pageY) {
		            return {x: event.pageX, y: event.pageY};
		        }
		        return {
		            x: event.clientX + document.body.scrollLeft - document.body.clientLeft,
		            y: event.clientY + document.body.scrollTop  - document.body.clientTop
		        };
		    }

		    // Draw the shape based on the current coordinates and position at onmousedown
		    function doDraw(event) {
		        if (rect) {
		            var mousePos = getCoords(event);
		            var currentX = mousePos.x - offset[0];
		            var currentY = mousePos.y - offset[1];
		            var width = currentX - startX;
		            var height = currentY - startY;

		            if (width < 0) {
		                rect.attr({'x': currentX, 'width': width * -1});
		            } else {
		                rect.attr({'x': startX, 'width': width});
		            }
		            if (height < 0) {
		                rect.attr({'y': currentY, 'height': height * -1});
		            } else {
		                rect.attr({'y': startY, 'height': height});
		            }
				final_width = width;
				final_height = height;
		        }
		    }

		    // Global variables
		    var div_paper = document.getElementById('paper');
			var offset = findPos(div_paper);
			var background = new Raphael('image',334,334);
			var img = background.image('img/test.jpg',0, 0, 334, 334);
			
			//var background = new Raphael('image',334,334);
			//var img = background.image('img/student2.jpg',0, 0, 334, 334);
			
		    var paper = new Raphael('paper');

		    var rect;
		    var startX = 0, startY = 0;


			var final_attr = []
			var final_width = 0;
			var final_height

		    div_paper.onmousedown = function(event) {
		        var mouseCoords = getCoords(event);
				final_attr = [];
		        startX = mouseCoords.x - offset[0];
		        startY = mouseCoords.y - offset[1];
		        rect = paper.rect(startX, startY, 0, 0);
		        document.onmousemove = doDraw;
				final_attr.push(startX);
				final_attr.push(startY);
				//console.log(startX,startY)
		    };

		    document.onmouseup = function(event) {
		        if (rect) {
		            rect.remove();
					final_attr.push(final_width);
					final_attr.push(final_height);
					$('#x').val(startX.toString());
					$('#y').val(startY.toString());
					$('#width').val(final_width.toString());
					$('#height').val(final_height.toString());
					console.log(final_attr);
		        }
		        document.onmousemove = null;
		    };

});