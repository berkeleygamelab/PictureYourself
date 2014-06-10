//function helpers

//returns mouse position centered at mouse point
// args: e = event, container = KineticJS stage element
function getMousePos(e, container){
	var center = 0;
	//grab the position of the event, minus the offset of the container, add the center value to place in middle of mouse
	return {"x":e.pageX - $(container).offset().left + center, "y":e.pageY - $(container).offset().top + center};
}

