// This might not factory (possibly a service or just a function)
app.factory('Sticker', function(){
	return{
		new : function(imageObj, pos, start_size, layer, imageObjBack){
    		var sticker = {
    			background : null,
				delete_icon : null,
				group : null,
				image : null,
				imageBack : null,
				move_color : null,
				previous_color : null,
				rotate : null,
				scalerX : null,
				scalerY : null, 
				reposition : null
			}

	        // Used to make sure both background and foreground are loaded together
			var image_load_count = 0;
			// Used to make sure that scaling and positioning of controls are synced
			var tool_size = 30;

	        sticker.group = new Kinetic.Group({
	            draggable: true,
	            x: pos.x + start_size.width/2,
	            y: pos.y + start_size.height/2
	        });

            sticker.image = new Kinetic.Image({
	            image:imageObj,
	            width: start_size.width,  //this makes the image lower quality for some reason
	            height: start_size.height,
	            x: 0, // pos.x + start_size.width/2,
	            y: 0, // pos.y + start_size.height/2,
	            offsetX: start_size.width/2,
	            offsetY: start_size.height/2,
            });

		   	if (imageObjBack != null){
		        sticker.imageBack = new Kinetic.Image({
		            image:imageObjBack,
		            width: start_size.width,  //this makes the image lower quality for some reason
		            height: start_size.height,
		            offsetX: start_size.width/2,
	               	offsetY: start_size.height/2,
		            x: 0, // pos.x + start_size.width/2,
		            y: 0, // pos.y + start_size.height/2,
	        	});
	        }

	        sticker.background = new Kinetic.Rect({
	        	width: start_size.width,
	        	height: start_size.height,
	        	x: 0,
	        	y: 0,
	        	offsetX: start_size.width/2,
	        	offsetY: start_size.height/2,
            	fill: '#00cdcd',
            	visible: true,
            	opacity: 0.2,
            	name: 'background'
	        });

	       	sticker.delete_icon = new Kinetic.Text({
	            visible:true,
	            text: '',
	            fontFamily: 'FontAwesome',
	            fontSize: tool_size,
	            fill: '#eee',
	            stroke: "#222",
	            strokeWidth: 0.75,
	            name: 'delete', 
	            x: start_size.width/2,
	            y: -start_size.height/2,
	            offsetX: tool_size/2,
	            offsetY: tool_size/2
			});

			sticker.scalerX = new Kinetic.Text({
	            x : start_size.width/2, // sticker.image.x() + start_size.width/2,
	            y : 0, // sticker.image.y(),
	            offsetX: tool_size/2,
	            offsetY: tool_size/2,
	            text: '',
	            fontFamily: 'FontAwesome',
	            fontSize: tool_size,
	            fill: '#eee',
	            stroke: "#222",
	            strokeWidth: 0.75,
	            draggable:true,
	            visible:true,
	            name: 'x',
	        });

            sticker.scalerY = new Kinetic.Text({
	            x : 0, // sticker.image.x(),
	            y : start_size.height/2, // sticker.image.y() + start_size.height/2,
	            offsetY: tool_size/2,
	            offsetX: tool_size * 13 / 60,
	            text: '',
	            fontFamily: 'FontAwesome',
	            fontSize: tool_size,
	            fill: '#eee',
	            stroke: "#222",
	            strokeWidth: 0.75,
	            draggable:true,
	            visible:true,
	            name: 'y',
	        });
            

            sticker.rotate = new Kinetic.Text({
	            x : - start_size.width/2, // sticker.image.x() - start_size.width/2,
	            y : - start_size.height/2, // sticker.image.y() - start_size.height/2,
	            offsetX: tool_size/2,
	            offsetY: tool_size/2,
	            text: '',  //leave this it won't render correctly here but will on the canvas
	            fontFamily: 'FontAwesome',
	            fontSize: tool_size,
	            fill: '#eee',
	            stroke: "#222",
	            strokeWidth: 0.75,
	            draggable:true,
	            visible:true,
	            name: 'rotate',
	        });

            /* Unsuccessful delete image try
	        var delete_img = new Image();
	        delete_img.src = "images/img/close-button.png";
	        delete_img.onload = function() {
	        	sticker.delete_icon = new Kinetic.Image({
	        		visible: true,
	        		height: tool_size,
	        		width: tool_size,
	        		name: 'delete',
	        		x: start_size.width/2,
	        		y: -start_size.height/2,
	        		offsetX: tool_size/2,
	        		offsetY: tool_size/2
	        	})
	        } */

	        if (imageObjBack != null){
	            sticker.imageBack.offsetX(start_size.width/2);
	            sticker.imageBack.offsetY(start_size.height/2);
	        }

	        if(imageObjBack != null){
	            // Using image_load_count as a counter to make sure
	            // both the background and foreground are loaded before onload process

	            imageObjBack.onload = function(){
	                if(image_load_count > 0){
	                    return load();
	                }

	                image_load_count++;
	            };

	            imageObj.onload = function(){
	                if(image_load_count > 0){
	                    return load();
	                };
	                image_load_count++;
	            };

	        }

	        else {
	            imageObj.onload = function(){
	                return load();
	            };
	        }

	        //construct group to drop after image loads
	        var load = function(){
	            
	            if(imageObjBack != null){
	                sticker.group.add(sticker.imageBack);
	                sticker.move_color();
	            }
	            sticker.group.add(sticker.background);
	            sticker.group.add(sticker.image);
	            sticker.group.add(sticker.scalerX);
	            sticker.group.add(sticker.scalerY);
	            sticker.group.add(sticker.delete_icon);
	            sticker.group.add(sticker.rotate);

	            layer.add(sticker.group);
	            
	            sticker.reposition();
	            layer.draw();
	        }

			sticker.reposition = function(){

				var half_width = sticker.image.width()/2;
				var half_height = sticker.image.height()/2;

		        sticker.rotate.x(-half_width);
		        sticker.rotate.y(-half_height);

		        sticker.scalerX.x(half_width);
		        sticker.scalerX.y(0);

		        sticker.scalerY.x(0);
		        sticker.scalerY.y(half_height);

		        sticker.delete_icon.x(half_width);
		        sticker.delete_icon.y(-half_height);

		        sticker.background.x(0);
		        sticker.background.y(0);
		        sticker.background.width(half_width*2);
		        sticker.background.height(half_height*2);
		        sticker.background.offsetX(half_width);
		        sticker.background.offsetY(half_height);


	        };

	        sticker.move_color = function(){

	            // var y = sticker.scalerY.getAbsolutePosition().y - sticker.image.height()/2;
	            // var x = sticker.scalerX.getAbsolutePosition().x  
	            //      + $('#container').offset().left
	            //      - sticker.image.getWidth() 
	            //      - sticker.image.offsetX() 
	            //      - $('#modal').width();

	            var y = sticker.scalerX.getAbsolutePosition().y;
	            var x = sticker.scalerY.getAbsolutePosition().x;

	            $("#modal").css({left: x, top: y});
	            $("#modal").show();
	        }

	 		return sticker;
	     
		}
	}
});
