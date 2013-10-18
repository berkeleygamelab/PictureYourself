// JavaScript Document

$(document).ready(function() {
var canvas = document.getElementById('canvas');
var canvasInner = document.getElementById('canvasInner');
var image = document.getElementById('overlay');

var element = canvas.getContext("2d");
var ctx = canvasInner.getContext('2d');

var angleInDegrees = 0;
var zoomDelta = 0.1;
var currentScale = 1;
var currentAngle = 0;
var canvasWidth = 300;
var novosDadosTRBL;
var novosDadosWH;
var novosDadosW;
var novosDadosH;
var startX, startY, isDown = false;

var imageObj = new Image();
imageObj.onload = function(){
	ctx.drawImage(imageObj,0,0);
};
imageObj.src = 'img/student.jpg';

jQuery('#carregar').click(function () {
    element.translate(canvas.width / 2, canvas.height / 2);
    drawImage();
    jQuery('#canvas').attr('data-girar', 0);
    this.disabled = true;
});

jQuery('#giraresq').click(function () {
    angleInDegrees = 90;
    currentAngle += angleInDegrees;
    drawImage();
});

jQuery('#girardir').click(function () {
    angleInDegrees = -90;
    currentAngle += angleInDegrees;
    drawImage();
});

jQuery('#zoomIn').click(function () {
    currentScale += zoomDelta;
    drawImage();
});
jQuery('#zoomOut').click(function () {
    currentScale -= zoomDelta;
    drawImage();
});

canvas.onmousedown = function (e) {
    var pos = getMousePos(canvas, e);
    startX = pos.x;
    startY = pos.y;
    isDown = true;
}

canvas.onmousemove = function (e) {
    if (isDown === true) {
        var pos = getMousePos(canvas, e);
        var x = pos.x;
        var y = pos.y;

        element.translate(x - startX, y - startY);
        drawImage();
        
        startX = x;
        startY = y;
    }
}
canvas.onmouseup = function (e) {
    isDown = false;
}

function drawImage() {
    clear();
    element.save();
    element.scale(currentScale, currentScale);
    element.rotate(currentAngle * Math.PI / 180);
    element.drawImage(image, -image.width / 2, -image.width / 2);
    element.restore();
}

function clear() {
    element.clearRect(-image.width / 2 - 2, -image.width / 2 - 2, image.width + 4, image.height + 4);
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
});