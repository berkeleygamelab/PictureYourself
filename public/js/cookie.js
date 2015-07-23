var pyuseridtag = 'pyuserid'; //cookie for GUID
var pyuseridlife = 1;
var debug_flag = false;

function setCookie(c_name,value,exdays) {
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
    //console.log('set cookie'); //DEV
}

function getCookie(c_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1)
      c_start = c_value.indexOf(c_name + "=");
    if (c_start == -1)
      c_value = null;
    else {
      c_start = c_value.indexOf("=", c_start) + 1;
      var c_end = c_value.indexOf(";", c_start);
      if (c_end == -1)
            c_end = c_value.length;
        c_value = unescape(c_value.substring(c_start,c_end));
    }
    return c_value;
}

function checkCookie(pyuserid){
  if (pyuserid!=null && pyuserid!="")
    debug('pyuserid already created; creating a new pyuserid');
  else  {
    var randomID = GUID();
    // check if value GUID is already registered on server or as cookie
    setCookie(pyuseridtag,randomID,pyuseridlife);
    console.log(getCookie(pyuseridtag));
  }
}

function GUID(){
    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x7;
        return v.toString(16);
    });
    return guid;
}
