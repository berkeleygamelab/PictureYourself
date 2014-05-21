(function( $ ){
    jQuery.sessionTimeout = function( options ) {
        var defaults = {
            message      : 'Your session is about to expire.',
            keepAliveUrl : '/selfie',
            redirUrl     : '/',
            logoutUrl    : '/',
            warnAfter    : 180000, // 3 minutes
            redirAfter   : 60000 // 1 minute
        };

        // Extend user-set options over defaults
        var o = defaults,
                dialogTimer,
                redirTimer;

        if ( options ) { o = $.extend( defaults, options ); }

        // Create timeout warning dialog
        $('body').append('<div title="" id="sessionTimeout-dialog">'+ o.message +'</div>');
        $('#sessionTimeout-dialog').dialog({
            autoOpen: false,
            width:325,
            height:250,
            modal:true,            
            closeOnEscape: false,
            open: function() { 
              $(".ui-dialog-titlebar-close").hide(); 
            },
            buttons: {
              "FINISH": function() {
                window.location = o.logoutUrl;
              },
              "STAY": function() {
                $(this).dialog('close');
                $.ajax({
                    type: 'GET',
                    url: o.keepAliveUrl
                });
                // Stop redirect timer and restart warning timer
                controlRedirTimer('stop');
                controlDialogTimer('start');
              }
            }
          });

        $(document).bind("click keypress", function() {
            controlRedirTimer('stop');
            controlDialogTimer('stop');//why needed?
            controlDialogTimer('start');
        })

        function controlDialogTimer(action){
            switch(action) {
                case 'start':
                    // After warning period, show dialog and start redirect timer
                    dialogTimer = setTimeout(function(){
                        $('#sessionTimeout-dialog').dialog('open');
                        controlRedirTimer('start');
                    }, o.warnAfter);
                    break;

                case 'stop':
                    clearTimeout(dialogTimer);
                    break;
            }
        }

        function controlRedirTimer(action){
            switch(action) {
                case 'start':
                    // Dialog has been shown, if no action taken during redir period, redirect
                    redirTimer = setTimeout(function(){
                        window.location = o.redirUrl;
                    }, o.redirAfter - o.warnAfter);
                    break;

                case 'stop':
                    clearTimeout(redirTimer);
                    break;
            }
        }

        // Begin warning period
        controlDialogTimer('start');
    };
})( jQuery );

$(document).ready(function() {
    $.sessionTimeout({
        warnAfter: 100000,
        redirAfter: 300000
    });
});
