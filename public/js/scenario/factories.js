// Sticker.new(Image, {'x':,'y':}, {'width':,'height':'}, Kinetic.Layer, Image)
// Creates a new sticker object from factory in factories.js
// Returns a dictionary with sticker objects and needed event functions

app.service('Sticker', function(){
    return{
        new : function(imageObj, pos, start_size, layer, imageObjBack, $scope, stage, offset, text){
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
                reposition : null,
                toggleTools : null,
            }

            // Used to make sure both background and foreground are loaded together
            var image_load_count = 0;
            
            // Used to make sure that scaling and positioning of controls are synced
            var tool_size = 30;

            var has_background_sticker = (imageObjBack != null);

            sticker.group = new Kinetic.Group({
                draggable: true,
                x: pos.x + start_size.width/2,
                y: pos.y + start_size.height/2
            });

            if(!has_background_sticker) {
                sticker.image = new Kinetic.Image({
                    image:imageObj,
                    width: start_size.width,  //this makes the image lower quality for some reason
                    height: start_size.height,
                    x: 0, // pos.x + start_size.width/2,
                    y: 0, // pos.y + start_size.height/2,
                    offsetX: offset.offsetX || start_size.width/2,
                    offsetY: offset.offsetY || start_size.height/2,
                    src: imageObj.src,
                    name: 'sticker',
                });
            }

            if (has_background_sticker){
                sticker.image = new Kinetic.Image({
                    image:imageObj,
                    width: start_size.width,  //this makes the image lower quality for some reason
                    height: start_size.height,
                    x: 0, // pos.x + start_size.width/2,
                    y: 0, // pos.y + start_size.height/2,
                    offsetX: offset.offsetX || start_size.width/2,
                    offsetY: offset.offsetY || start_size.height/2,
                    src: imageObj.src,
                    back: imageObjBack.src,
                    name: 'sticker',
                });
                sticker.imageBack = new Kinetic.Image({
                    image:imageObjBack,
                    width: start_size.width,  //this makes the image lower quality for some reason
                    height: start_size.height,
                    offsetX: offset.offsetX || start_size.width/2,
                    offsetY: offset.offsetY || start_size.height/2,
                    x: 0, // pos.x + start_size.width/2,
                    y: 0, // pos.y + start_size.height/2,
                    name: 'sticker',
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
                x : start_size.width/2,
                y : start_size.height/2,
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
                x : - start_size.width/2,
                y : - start_size.height/2,
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
                y : start_size.height/2, // sticker.image.y() - start_size.height/2,
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

            if(text){
                sticker.txt = new Kinetic.Text({
                    x : start_size.width/4, // sticker.image.x() - start_size.width/2,
                    y : start_size.height/2, // sticker.image.y() - start_size.height/2,
                    offsetX: tool_size/2,
                    offsetY: tool_size/2,
                    text: 'T',  //leave this it won't render correctly here but will on the canvas
                    fontFamily: 'Serif',
                    fontSize: tool_size,
                    fill: '#eee',
                    stroke: "#222",
                    strokeWidth: 0.75,
                    visible:true,
                    name: 'txt',
                });
            }


            sticker.delete_icon.on('click', function(){
                sticker.group.destroy();
                $scope.selected_background = null;
                $scope.selected_sticker = null;
                $('#modal').hide();

                layer.draw();
                stage.remove( layer );
             });
            if(text){
                sticker.txt.on('click', function(){
                    var input = prompt("Enter your text:")
                    if(input.length > 100){
                        input = input.substring(0,99);
                    };

                    sticker.user_text = new Kinetic.Text({
                        x : -sticker.image.width()/4, // sticker.image.x() - start_size.width/2,
                        y : -sticker.image.height()/4, // sticker.image.y() - start_size.height/2,
                        offsetX: tool_size/2,
                        offsetY: tool_size/2,
                        text: input,
                        fontFamily: 'FontAwesome',
                        fontSize: tool_size,
                        fill: 'black',
                        stroke: "#222",
                        strokeWidth: 0.75,
                        visible:true,
                        name: 'user_text',
                        align: 'center',
                        width:sticker.image.width()/2,
                    });
                    sticker.group.add(sticker.user_text);
                    layer.add(sticker.group);
                    layer.draw();
                 });
            }

            





            // set horizontal height of image
            sticker.scalerX.on('dragmove touchmove',function(){
                    
                var half_width = Math.abs(this.x() - sticker.image.x());
                sticker.image.width(half_width * 2);
                sticker.image.offsetX(half_width);
                
                if(has_background_sticker) {
                    sticker.imageBack.width(sticker.image.width());
                    sticker.imageBack.offsetX(half_width);
                    // sticker.imageBack.setAbsolutePosition({ x: sticker.image.getAbsolutePosition().x, y: sticker.image.getAbsolutePosition().y });
                }

                sticker.reposition();
            });


            //set vertical height of image
            sticker.scalerY.on('dragmove touchmove',function(){
                
                var half_height = Math.abs(this.y() - sticker.image.y());
                sticker.image.height(half_height * 2);
                sticker.image.offsetY(half_height);

                if(has_background_sticker)
                {
                    sticker.imageBack.height(sticker.image.height());
                    sticker.imageBack.offsetY(half_height);
                    // sticker.imageBack.setAbsolutePosition({ x: sticker.image.getAbsolutePosition().x, y: sticker.image.getAbsolutePosition().y });
                }

                sticker.reposition();   
                layer.draw();

            });
            
            var startX;
            var startY;
            var half_width = sticker.image.getWidth()/2
            var half_height = sticker.image.getHeight()/2
            var start_angle, end_angle;
            var start_rotation;

            function angle(rad) {
                if (rad > Math.PI) {
                    rad = rad - 2*Math.PI;
                }
                return rad * 180 / Math.PI;
            }

            sticker.rotate.on('dragstart', function(e) {
                startX = stage.getPointerPosition().x - sticker.image.getAbsolutePosition().x;
                startY = stage.getPointerPosition().y - sticker.image.getAbsolutePosition().y;
                start_angle = Math.atan2(startY, startX);
                start_rotation = sticker.image.rotation();
            });

            sticker.rotate.on('dragmove touchmove', function(e){ //dragmove

                endX = stage.getPointerPosition().x - sticker.image.getAbsolutePosition().x;
                endY = stage.getPointerPosition().y - sticker.image.getAbsolutePosition().y;
                end_angle = Math.atan2(endY, endX);
                sticker.group.rotation(start_rotation + angle(end_angle - start_angle));

                sticker.reposition();   
                layer.draw();
            });
            

            if (has_background_sticker){
                sticker.imageBack.offsetX(start_size.width/2);
                sticker.imageBack.offsetY(start_size.height/2);
            }

            if(has_background_sticker){
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
                if(has_background_sticker){
                    sticker.group.add(sticker.imageBack);
                }
                sticker.group.add(sticker.background);
                sticker.group.add(sticker.image);
                sticker.group.add(sticker.scalerX);
                sticker.group.add(sticker.scalerY);
                sticker.group.add(sticker.delete_icon);
                sticker.group.add(sticker.rotate);
                if(text){
                    sticker.group.add(sticker.txt);
                }
                
                layer.add(sticker.group);
                
                sticker.reposition();
                
                if(has_background_sticker){
                    sticker.move_color();
                }

                layer.draw();
            }

            sticker.move_color = function(){

                $("#modal").css({
                    left: $('#container').offset().left + (sticker.rotate.getAbsolutePosition().x
                        + sticker.scalerY.getAbsolutePosition().x)/2 - tool_size/2,
                    top: $('#container').offset().top + (sticker.rotate.getAbsolutePosition().y
                        + sticker.scalerY.getAbsolutePosition().y)/2 - tool_size/2
                });
                $("#modal").show();
            }

            sticker.reposition = function(){

                var half_width = sticker.image.width()/2;
                var half_height = sticker.image.height()/2;
                var stagex = $('.kineticjs-content').position().left;
                var stagey = $('.kineticjs-content').position().top;

                sticker.rotate.x(-half_width);
                sticker.rotate.y(half_height);

                sticker.scalerX.x(-half_width);
                sticker.scalerX.y(-half_height);

                sticker.scalerY.x(half_width);
                sticker.scalerY.y(half_height);

                sticker.delete_icon.x(half_width);
                sticker.delete_icon.y(-half_height);

                if(text){
                    sticker.txt.x(half_width/4);
                    sticker.txt.y(half_height);
                    if(sticker.user_text){   
                        sticker.user_text.x(-half_width/2);
                        sticker.user_text.y(-half_height/2);
                        sticker.user_text.width(half_width);
                    }
                };

                

                sticker.background.x(0);
                sticker.background.y(0);
                sticker.background.width(half_width*2);
                sticker.background.height(half_height*2);
                sticker.background.offsetX(half_width);
                sticker.background.offsetY(half_height);

            };

            sticker.toggleTools = function(is_visible){
                sticker.scalerX.visible(is_visible);
                sticker.scalerY.visible(is_visible);
                sticker.delete_icon.visible(is_visible);
                sticker.rotate.visible(is_visible);
                sticker.background.visible(is_visible);
            
                // Toggle color picker            
                is_visible && has_background_sticker ? $("#modal").show() : $("#modal").hide();
                

            }

            sticker.group.on('dragmove', function(){
                if(sticker.scalerX.isVisible() && has_background_sticker)
                    sticker.move_color();   
            });



            return sticker;
             
            }
    }
});