












$(window).on('beforeunload', function(){

  var leftArr = []; //don't forget to clear array so that things aren't added more than once when beforeunload is called multiple times 
  var topArr = [];
  var srcArr = [];
  var rotArr = [];

  $.each($('#edit .toolboxImage'), function(index, value){ 
    leftArr.push($(value).css('left'));
  })

  $.each($('#edit .toolboxImage'), function(index, value){ 
    topArr.push($(value).css('top'));
  })

  $.each($('#edit .toolboxImage'), function(index, value){
    rotArr.push($(value).css('-webkit-transform'));
  })

  $.each($('#edit .toolboxImage .itemImage'), function(index, value){ 
    srcArr.push($(value).attr('src'));
  })

  //eventually background will be refactored to simply be included with the rest of the images
  var background = $('#edit #diagram').css('background-image') 

  var formData = new FormData();
  //var filename = $scope.pyuserid;
  //formData.append("name", name);

  formData.append("leftArr", leftArr);
  formData.append("topArr", topArr);
  formData.append("srcArr", srcArr);
  formData.append("rotArr", rotArr);
  formData.append("background", background);

  var xhr2 = new XMLHttpRequest();
  xhr2.open('POST', '/session');
  xhr2.send(formData);
});