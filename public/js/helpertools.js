
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

// function email(pyuserid, emails, data){
//   var formData = {"pyuserid":pyuserid, "data":data};
//   $.ajax({
//     url: '/email',
//     type: 'POST',
//     data: formData,
//     success: function(){        
//       send_email(pyuserid, emails);
//     }
//   })
// }

// function send_email(pyuserid, emails){
//   var formData = {"pyuserid":pyuserid, "emails":emails};
//   $.ajax({
//     url: '/send_email',
//     type: 'POST',
//     data: formData,
//     success: function(){
//       $( "#dialog-confirm-email" ).dialog({
//         resizable: false,
//         // height:140,
//         // width: 70,
//         modal: true,
//         draggable:false,
//         closeOnEscape:false,
//         dialogClass: 'email-dialog no-close',
//         buttons: {
//           "Start over": function() {
//             window.location = "/"
//           },
//           "Continue": function() {
//             $( this ).dialog( "close" );
//           }
//         }
//     })
//       .position({of:'#container'});
//     }
//   })
// }
