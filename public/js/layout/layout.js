// Hamburger drop-down
$(document).ready(function () {
    //Commented out because original code is commented out
    //was causing an error and stopping other elements from
    //loading.

    ///*
    var click = false;
    var visible = false;
    document.getElementById("dropdown").style.width = (document.getElementById("hamburger").width - parseInt(document.getElementById("dropdown").style.left)).toString + 'px';
    // document.getElementById("dropdown").style.top = (document.getElementById("ham").style.height.slice(0, 2)).toString + 'px';
    $("#hamburger")
        .mouseover(function () {
            document.getElementById("dropdown").style.visibility = "visible";
            visible = true;
        })
        .mouseleave(function () {
            if (!click) {
                document.getElementById("dropdown").style.visibility = "hidden";
                visible = false;
            }
        })
        .on('click', function () {
            if (click) {
                document.getElementById("dropdown").style.visibility = "hidden";
                visible = false;
            } else {
                document.getElementById("dropdown").style.visibility = "visible";
                visible = true;
            }
            click = !click;
        });
    //*/
});

function LayoutCtrl($scope){
  
}
