//Stuff related to emailing will get moved here

function email(pyuserid, emails, data){

	  var formData = { "pyuserid" : pyuserid, "data" : data};
	  
	  $.ajax({
	    url: '/email',
	    type: 'POST',
	    data: formData,
	    success: function(){        
	      send_email(pyuserid, emails);
	    },
	    error : function(){
        	$(".loader").hide();
	    }
	  });
}

function send_email(pyuserid, emails){

	var formData = {"pyuserid" : pyuserid, "emails" : emails};

	$.ajax({
		url: '/send_email',
		type: 'POST',
		data: formData,
		success: function(){
		  $( "#dialog-confirm-email" ).dialog({
		    resizable: false,
		    // height:140,
		    // width: 70,
		    modal: true,
		    draggable:false,
		    closeOnEscape:false,
		    dialogClass: 'email-dialog no-close',
		    buttons: {
		      "Start over": function() {
		        window.location = "/";
		      },
		      "Continue": function() {
		        $( this ).dialog( "close" );
		      }
		    }
		})
		  .position({of:'#container'});
		  $(".loader").hide();

		},
		error: function(){ 
			$(".loader").hide();
		}
	});


}
