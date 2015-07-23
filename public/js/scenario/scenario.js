//http://angular-ui.github.io/bootstrap/

//COLOR PICKER - https://github.com/tkrotoff/jquery-simplecolorpicker

//This flag is used to determine if you want console output or not.
//Don't use console.log, instead use debug("some thing you want to send to console")
var debug_flag = true;
var default_background = '/images/stickers/0-backgrounds/ASproul.jpg';

$(document).ready(function() {
  var formData;
  /*
  * Gets user selfie
  */
  //set pyuserid as global variable to easily access it
  $("#toolicon li").on("click", function(){
      $(this).parent().children().removeClass("active");
      $(this).addClass("active");
  });

  //fixes positioning issue with kineticJS canvas
  $(".kineticjs-content").css('position','');

  $("#modal").hide();

  // Canvas where color changing occurs. Should always be hidden
  $("#color_change_canvas").hide();

});


/*
* The actual Kinetic Stage where users can move stickers around
* Also loads all the images dynamically
* And stores data about the images on the canvas into the stickers array
*/

/*
    MINIFIER - reference https://docs.angularjs.org/guide/controller for guide
    to minify and retain references to angular syntax (e.g. $scope, $resource, etc)
    without $injector
*/

app // Need this for .controller and .directive
    .controller('ScenarioCtrl',
        function($scope, $resource, $http, $compile, $timeout, Sticker){
            var stage_width = $('#container').width()
            var stage_height = $('#container').height()

            $scope.loading = false;
            $scope.chroma_green = false;

            $scope.image_sources = {};
            $scope.selected_image = null;
            $scope.sticker_text = {}

            $scope.show_save_tos = true;
            $scope.show_saving_collage = false;
            $scope.show_saved = false;
            $scope.show_email_prompt = true;
            $scope.show_saving_email = false;
            $scope.show_emailed = false;

            // KineticJS stage and layer setup
            kinetic = kineticSetup(stage_width,stage_height);

            var layer = kinetic.layer;
            var stage = kinetic.stage;

            var stage_container = stage.container();
            var dragged_image = null;

            // Setup title
            $scope.title = "Enter your collage title here!";
            $scope.clearTitle = function(){
                if($scope.title == "Enter your collage title here!"){
                    $scope.title = null;
                }
            }

            // Setup color picker
            $('select[name="colorpicker"]').simplecolorpicker({picker:true}).
                on('change', function(){
                    change_color($('select[name="colorpicker"]').val(), layer, $scope);
                });

            // Used to close tools for all stickers
            var closeTools = function(){
                var tools = $(stage.find('.y, .x, .delete, .rotate, .background, .txt'));

                tools.each(function(index){
                    tools[index].visible(false);
                });
                $("#modal").hide();
                layer.draw();
            };

            $scope.background = backgroundSetup(closeTools, default_background, layer, stage);

            $scope.selfies = []
            $http.get("/selfies").success(function(data) {
              console.log(data)
              for (var i = 0; i < data.length; i += 1)
              {
                $scope.selfies.push({source: data[i], count: i + 1});
              }
            })




            var background = getCookie("currentbackground");
            if (background)
            {
              $scope.background_path           = background;
              $scope.background.getImage().src = background;
            }



            // $scope.selfies = [];
            // Listens to load_selfies event broadcast from ViewCtrl
            // $scope.$on('load_selfies', function(event, data, selfieCount, background){
            //     $scope.selfies.push({source: data, count: selfieCount});
                // if(background != undefined){
                //     $scope.background_path = background;
                //     $scope.background.getImage().src = background;
                // }
            // });
            // Users can have a maximum of 3 selfies. Hides the add another selfie button after 3 selfies
            $scope.checkSelfiesLength = function(){
                return $scope.selfies.length < 3;
            }


            // Setup and assign background Kinetic.Image object
            // $scope.background = backgroundSetup(closeTools, default_background, layer, stage);
            // $scope.background = backgroundSetup(closeTools, $scope.bg, layer, stage);

            // Called when user selects a background
            $scope.background_update = function(e){
                $scope.background.getImage().src = e.target.src;
            };

            // Ajax call to load background images and stickers
            grabBackgroundImages($scope, $http, $compile);
            grabStickerImages($scope, $http, $compile);

            // Called by custom directive to add event to start start of sticker drag
            $scope.addDrag = function(){
                $('.sticker').bind('dragstart',function(e){  //!!!!!ALL STICKERS MUST HAVE CLASS 'sticker'
                    $scope.dragged_image = this;

                    // Flag so color change tool is added to sticker
                    if($(this).data('chroma_green') == true){
                        $scope.chroma_green = true;
                    }
                    else{
                        $scope.chroma_green = false;
                    }
                });
            };

            // Add sticker to stage via drop action
            stage_container.addEventListener('drop',function(e){

                //stop Firefox from opening image
                e.preventDefault();

                // close tools of previously selected sticker
                if ($scope.selected_sticker != null) { $scope.selected_sticker.toggleTools(false) };

                // Assign a local variable with chroma green flag value.
                var has_chroma_green = $scope.chroma_green;

                imageObj = new Image();
                imageObj.src = $scope.dragged_image.src;

                var imageObjBack = null;

                // If chroma green set background and foreground sticker source appropriately
                if (has_chroma_green){
                    var sources = $scope.image_sources[$scope.dragged_image.name];

                    imageObjBack = new Image();
                    imageObjBack.src = sources['back'];

                    imageObj.src = sources['fore'];

                    $scope.selected_background = imageObjBack;
                }

                //get position relative to the container and page
                x = e.pageX - $('#container').offset().left;
                y = e.pageY - $('#container').offset().top;

                // Start size for dropped images. Used in code to set sizes
                var start_size = {"width":120,"height":120};

                var offset = {};

                // Creates a new sticker object. See factories.js
                var sticker = Sticker.new(imageObj, {'x':x,'y':y}, start_size, layer, imageObjBack, $scope,
                                          stage, offset, $scope.sticker_text[$scope.dragged_image.name]);

                $scope.selected_sticker = sticker;

                // Event to hide and show tools
                sticker.image.on('click',function(e){
                    var is_visible = sticker.scalerX.visible();

                    // Tools for sticker are displayed
                    if(is_visible){
                        $scope.selected_background = null;
                        $scope.selected_sticker = null;
                    }

                    // Tools for sticker are not displayed
                    else{
                        // Close tools for previously selected sticker
                        if($scope.selected_sticker != null)
                            $scope.selected_sticker.toggleTools(false);

                        $scope.selected_sticker = sticker;

                        // Set previous selected color
                        if($scope.selected_sticker.previous_color != null){
                            $('select[name="colorpicker"]').simplecolorpicker('selectColor', $scope.selected_sticker.previous_color);
                        }

                        // Assign a local variable with chroma green flag value.
                        var has_chroma_green = $scope.chroma_green;

                        // Move color picker and assign background image object
                        if(has_chroma_green){
                            sticker.move_color();
                            $scope.selected_background = imageObjBack;
                        }
                    }

                    sticker.toggleTools(!is_visible);
                    layer.draw();
                });
            });

            $scope.add_selfie = function(){
              window.location.href = "/camera";
            }

            $('#emailModal').on('shown.bs.modal', function(){
                $('.email_text').focus();
            });

            $('.email_text').keypress(function(event){
              if(event.keyCode == 13){
                $('.send_email_button').click();
              }
            });

            // Next two eventListeners and two functions are to reset the
            // modals if the user closes the modal by clicking outside of it
            // rather than clicking the return to collage button
            $('#saveModal').on('hidden.bs.modal', function(){
                $scope.$apply(function(){
                    $scope.resetSaveModal();
                });
            });

            $('#emailModal').on('hidden.bs.modal', function(){
                $scope.$apply(function(){
                    $scope.resetEmailModal();
                });
            });

            $scope.resetSaveModal = function(){
                $timeout(function(){
                    $scope.show_save_tos = true;
                    $scope.show_saving_collage = false;
                    $scope.show_saved = false;
                }, 500);
            }

            $scope.resetEmailModal = function(){
                $timeout(function(){
                    $scope.show_email_prompt = true;
                    $scope.show_saving_email = false;
                    $scope.show_emailed = false;
                }, 500);
            }

            // Initiate email process
            $scope.call_email = function(){
                closeTools();
                stage.draw();
                $scope.show_email_prompt = false;
                $scope.show_saving_email = true;
                $('#scenario_ctrl').css('pointer-events', 'none');

                //check if input exists
                if($scope.emails !== null) {
                  //remove spaces to have one long string as argv for python
                  $scope.emails = $scope.emails.replace(/\s+/g, '');
                  //change to use scope variable instead
                  pyuserid = getCookie('pyuserid');
                  // Create image from stage and send to email function in email.js
                  stage.toDataURL({
                    callback: function(dataUrl) {
                        formData = {"title": $scope.title, "image": dataUrl, "pyuserid": getCookie('pyuserid')};
                        email($scope, $http, formData, $scope.emails);
                    }
                  }) ;
                }
            };

            // Save image to gallery
            $scope.saveToGallery = function(){
                closeTools();
                stage.draw();
                $scope.show_save_tos = false;
                $scope.show_saving_collage = true;
                $('#scenario_ctrl').css('pointer-events', 'none');

                stage.toDataURL({
                    callback: function(dataUrl) {
                        formData = {"title": $scope.title, "image": dataUrl, "pyuserid": getCookie('pyuserid')};
                        $http.post('/collages', formData).success(function(data){
                            $scope.show_saving_collage = false;
                            $scope.show_saved = true;
                            $('#scenario_ctrl').css('pointer-events', '');
                        }).error(function(){
                            alert("An error occured while saving the image");
                            $('#saveModal').modal('hide');
                            $('#scenario_ctrl').css('pointer-events', '');
                        });
                    }
                });
            }

            $scope.saveToGalleryAndContinue = function(){
                closeTools();
                stage.draw();
                $scope.show_save_tos = false;
                $scope.show_saving_collage = true;
                $('#scenario_ctrl').css('pointer-events', 'none');

                stage.toDataURL({
                    callback: function(dataUrl) {
                        formData = {"title": $scope.title, "image": dataUrl, "pyuserid": getCookie('pyuserid')};
                        $http.post('/collages', formData).success(function(data){
                            $scope.show_saving_collage = false;
                            $scope.show_saved = false;
                            $('#scenario_ctrl').css('pointer-events', '');
                            window.location.href = "/comic";

                        }).error(function(){
                            alert("An error occured while saving the image");
                            $('#saveModal').modal('hide');
                            $('#scenario_ctrl').css('pointer-events', '');
                        });
                    }
                });
            }

            // $scope.save = function(){
            //     // formData = JSON.parse(stage.toJSON());
            //     // formData.children[0].children[0].src = $scope.background.getImage().src;

            //     formData = {}
            //     formData.pyuserid = getCookie('pyuserid');
            //     formData.title = $scope.title;
            //     formData.background = {}
            //     formData.background.src = $scope.background.getImage().src;
            //     formData.stickers = []

            //     var stickers = $(stage.find('.sticker'));
            //     // console.log(stickers);

            //     stickers.each(function(index, sticker) {
            //         stickerDict = {};
            //         console.log(sticker);
            //         stickerDict.src = sticker.attrs.src;
            //         stickerDict.height = sticker.attrs.height;
            //         stickerDict.width = sticker.attrs.width;
            //         stickerDict.offsetX = sticker.attrs.offsetX;
            //         stickerDict.offsetY = sticker.attrs.offsetY;
            //         stickerDict.x = sticker.parent.attrs.x;
            //         stickerDict.y = sticker.parent.attrs.y;
            //         stickerDict.rotation = sticker.parent.attrs.rotation;
            //         formData.stickers.push(stickerDict);
            //     })

            //     debug( formData );
            //     $http.post('/save_canvas', formData).success(
            //         function( data ){
            //             debug("SUCCESS!");
            //         }
            //     )
            // }

            // $scope.load = function(){
            //     pyuserid = getCookie('pyuserid');
            //     title = $scope.requested_scenario
            //     formData = {'pyuserid': pyuserid, 'title': title}
            //     $http.post('load_canvas', formData).success(
            //         function( data ){
            //             // Close any open tools
            //             console.log(data);
            //             closeTools();
            //             // Set the background
            //             $scope.background.getImage().src = data.background.src;

            //             // Remove all existing stickers
            //             var stickers = $(stage.find('.sticker'));
            //             stickers.each(function(index){
            //                 stickers[index].remove();
            //             });
            //             layer.draw();

            //             // Get all the image data
            //             $(data.stickers).each(function(index, s) {
            //                 console.log(s);
            //                 var imageObj = new Image();
            //                 imageObj.src = s.src;
            //                 var imageObjBack = s.back;

            //                 var offset = {"offsetX": s.offsetX,
            //                                     "offsetY": s.offsetY}
            //                 var start_size = {"width":s.width,
            //                                            "height":s.height};

            //                 var x = s.x - start_size.width / 2;
            //                 var y = s.y - start_size.height / 2;

            //                 // Create a new sticker with the information
            //                 var sticker = Sticker.new(imageObj, {'x':x,'y':y}, start_size, layer, imageObjBack, $scope, stage, offset);
            //                 // Rotate image
            //                 sticker.group.rotate(s.rotation);
            //                 // Set the tool popup event
            //                 show_tools(sticker);
            //             })

            //         })
            //         .error(
            //                function(){
            //                     console.log()
            //                })
            // }

            // Prevent default action for stage drag over
            stage_container.addEventListener('dragover',function(e){
                e.preventDefault(); //@important
            });

        })// End of Scenario Controller

    // custom directive, calls when sticker image is created during ng-repeat in view
    // addDrag binds drag event to image object
    .directive('addDrag', function(){
        return function($scope, element, attrs){
            $scope.$eval('addDrag()');
        }
    });


//Used to make it easy to turn on and off console.log
function debug(msg){
    if(debug_flag){
        console.log(msg);
    }
}
