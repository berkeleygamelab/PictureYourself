//Stuff related to emailing will get moved here

function email(pyuserid, emails, data, $scope){

    var formData = { "pyuserid" : pyuserid, "data" : data};
      
    $.ajax({
        url: '/email',
        type: 'POST',
        data: formData,
        success: function(){        
          send_email(pyuserid, emails, $scope);
        },
        error : function(){
            $scope.$apply(function(){
                $scope.loading = false;
            })
        }
    });
}

function send_email(pyuserid, emails, $scope){

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
            $scope.$apply(function(){
                $scope.loading = false;
            })
        },
        error: function(status, msg){ 
            alert("Something went wrong");
            $scope.$apply(function(){
                $scope.loading = false;
            })
        }
    });

}
