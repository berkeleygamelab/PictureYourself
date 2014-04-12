(function(a){
  jQuery.sessionTimeout=function(b){
    function f(a){
      switch(a){
        case "start":
        redirTimer=setTimeout(function(){
          window.location=d.redirUrl},
          d.redirAfter-d.warnAfter
        );
        break;
        case "stop":
          clearTimeout(redirTimer);
          break;
      }
    }

    function e(b){
      switch(b){
        case "start":
          dialogTimer=setTimeout(function(){
            a("#sessionTimeout-dialog").dialog("open");
            f("start")},
            d.warnAfter);
          break;
        case "stop":
          clearTimeout(dialogTimer);
          break;
      }
    }

    var c = { 
      message:"Your session is about to expire.",
      keepAliveUrl:"/selfie",
      redirUrl:"/",
      logoutUrl:"/",
      warnAfter:9e5,
      redirAfter:12e5
    };

    var d=c;

    if(b){
      var d=a.extend(c,b)
    }

    a("#sessionTimeout-dialog").dialog({
      autoOpen:false,
      width:400,
      height:250,
      modal:true,
      closeOnEscape:false,
      open:function(b,c){
        a(".ui-dialog-titlebar-close").hide()},
        buttons:{"Log Out Now":function(){
          window.location=d.logoutUrl},
          "Stay Connected":function(){
            a(this).dialog("close");
            a.ajax({type:"GET",url:d.keepAliveUrl});
            f("stop");
            e("start")
          }
        }
      });
    e("start")}})(jQuery)

$(document).ready(function() {
  $.sessionTimeout({
    warnAfter: 180000,
    redirAfter: 300000
  });
});
