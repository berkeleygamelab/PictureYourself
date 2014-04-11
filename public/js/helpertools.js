function email(pyuserid, emails, data){
  console.log('at email')
  var formData = {"pyuserid":pyuserid, "data":data};
  $.ajax({
    url: '/email',
    type: 'POST',
    data: formData,
    success: function(){        
      send_email(pyuserid, emails);
    }
  })
}

function send_email(pyuserid, emails){
  console.log('sending email')
  var formData = {"pyuserid":pyuserid, "emails":emails};
  $.ajax({
    url: '/send_email',
    type: 'POST',
    data: formData,
    success: function(){
      $( "#dialog-confirm" ).dialog({
      resizable: false,
      height:140,
      modal: true,
      buttons: {
        "Delete all items": function() {
          $( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });
    }
  })
}
