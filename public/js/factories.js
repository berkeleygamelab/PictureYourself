// This might not factory (possibly a service or just a function)
app.factory('Sticker', function(){
	return{
		new : function(imageObj, pos, start_size, layer, imageObjBack){
	        		var sticker = {background : null,
									delete_icon : null,
									group : null,
									image : null,
									imageBack : null,
									move_color : null,
									rotate : null,
									scalerX : null,
									scalerY : null, 
									reposition : null}

			        // Used to make sure both background and foreground are loaded together
        			var image_load_count = 0;

			        sticker.group = new Kinetic.Group({
			            draggable: true,
			        });

		            sticker.image = new Kinetic.Image({
		               image:imageObj,
		               width: start_size.width,  //this makes the image lower quality for some reason
		               height: start_size.height,
		               x: pos.x,
		               y: pos.y
		            });

				   	if (imageObjBack != null){
			            sticker.imageBack = new Kinetic.Image({
			               image:imageObjBack,
			               width: start_size.width,  //this makes the image lower quality for some reason
			               height: start_size.height,
			               x: pos.x,
			               y: pos.y 
			        	});
			        }

			       	sticker.delete_icon = new Kinetic.Text({
			            visible:true,
			            text: '',
			            fontFamily: 'FontAwesome',
			            fontSize: 30,
			            fill: '#eee',
			            stroke: "#222",
			            strokeWidth: 2,
			            name: 'delete', 
			            x:0,
			            y:0
        			});

        			sticker.scalerX = new Kinetic.Text({
			            x : sticker.image.getX() + start_size.width,
			            y : sticker.image.getY() + start_size.height/2,
			            text: '',
			            fontFamily: 'FontAwesome',
			            fontSize: 30,
			            fill: '#eee',
			            stroke: "#222",
			            strokeWidth: 2,
			            draggable:true,
			            visible:true,
			            name: 'x',
			            dragBoundFunc: function(pos){
			                return{
			                    x: pos.x,
			                    y: this.getAbsolutePosition().y
			                };
			            }
			        });

	                sticker.scalerY = new Kinetic.Text({
			            x : sticker.image.getX() + start_size.width/2,
			            y : sticker.image.getY() + start_size.height,
			            text: '',
			            fontFamily: 'FontAwesome',
			            fontSize: 30,
			            fill: '#eee',
			            stroke: "#222",
			            strokeWidth: 2,
			            draggable:true,
			            visible:true,
			            name: 'y',
			            //offset:[image.getWidth()/2,image.getHeight()/2],
			            dragBoundFunc: function(pos){
			              return{
			                x: this.getAbsolutePosition().x,
			                y: pos.y
			              };
			            }
			        });

	                sticker.rotate = new Kinetic.Text({
			            x: 0,
			            y: 0,
			            text: '',  //leave this it won't render correctly here but will on the canvas
			            fontFamily: 'FontAwesome',
			            fontSize: 30,
			            fill: '#eee',
			            stroke: "#222",
			            strokeWidth: 2,
			            draggable:true,
			            visible:true,
			            name: 'rotate',
			            dragBoundFunc: function(pos) {
			                var x = image.getAbsolutePosition().x + start_size.width/2;
			                var y = image.getAbsolutePosition().y + start_size.height/2;//100;  // your center point
			                var radius = Math.sqrt(Math.pow(image.getWidth()/2,2) + Math.pow(image.getWidth()/2,2));//60;//Math.min(image.getWidth() / 2 , image.getHeight() / 2);//60;
			                var scale = radius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)); // distance formula ratio
			                  return {
			                    y: Math.round((pos.y - y) * scale + y),
			                    x: Math.round((pos.x - x) * scale + x)
			                  };
			              }
			        });

					// ▼▼ REMOVE WHEN ROTATE IS COMPELTED ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
					sticker.rotate.setVisible(false);
					// ▲▲ REMOVE WHEN ROTATE IS COMPELTED ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

			        // Set offsets to put image's x and y in center
			        sticker.image.setOffsetX(start_size.width/2);
			        sticker.image.setOffsetY(start_size.height/2);
			        
			        sticker.rotate.setOffsetX(start_size.width/2);
			        sticker.rotate.setOffsetY(start_size.height/2);

			        sticker.scalerX.setOffsetX(start_size.width/2);
			        sticker.scalerX.setOffsetY(start_size.height/2);

			        sticker.scalerY.setOffsetX(start_size.width/2);
			        sticker.scalerY.setOffsetY(start_size.height/2);

			        sticker.delete_icon.setOffsetX(start_size.width/2);
			        sticker.delete_icon.setOffsetY(start_size.height/2);

			        if (imageObjBack != null){
			            sticker.imageBack.setOffsetX(start_size.width/2);
			            sticker.imageBack.setOffsetY(start_size.height/2);
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

			        else{
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
			            console.log(sticker.group);
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
			          var x = sticker.image.getAbsolutePosition().x;
			          var y = sticker.image.getAbsolutePosition().y;

			          sticker.rotate.setAbsolutePosition(x - 10, y - 10);
			          
			          sticker.scalerX.setAbsolutePosition(x + sticker.image.getWidth(), y + sticker.image.getHeight()/2);
			          sticker.scalerY.setAbsolutePosition(x + sticker.image.getWidth()/2, y + sticker.image.getHeight());
			          sticker.delete_icon.setAbsolutePosition(x + sticker.image.getWidth(), y);

			        };

			        sticker.move_color = function(){

			            var y = sticker.scalerY.getAbsolutePosition().y;
			            var x = sticker.scalerX.getAbsolutePosition().x  
			                 + $('#container').offset().left
			                 - sticker.image.getWidth() 
			                 - sticker.image.getOffsetX() 
			                 - $('#modal').width();

			            $("#modal").css({left: x, top: y});
			            $("#modal").show();
			        }

			 		return sticker;
			     
		}
	}
});