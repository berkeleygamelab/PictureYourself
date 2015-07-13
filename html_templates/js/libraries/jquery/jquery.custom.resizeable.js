(function($, undefined ) {

	$.widget("custom.resizeable", $.ui.mouse, {

		options: {
			handle: false
		},

		handle: function(handle) {
			if (handle === undefined) {
				return this.options.handle;
			}
			this.options.handle = handle;
		},

		_create: function() {
			if (!this.options.handle) {
				this.options.handle = $(document.createElement('div'));
			}
			var handle = this.options.handle;
			handle.addClass('ui-resizeable-handle');
			handle.draggable({ helper: 'clone',
				start: dragStart });
			handle.on('mousedown', startResize);
			handle.appendTo(this.element);
			this.element.data('size', $( this.element ).css( "width" ));
		}
	});

	var elementBeingResized, mouseStartSize, elementStartSize;
	$(document).on('mouseup', stopResize);

	function getElementCenter(el) {
		var elementOffset = getElementOffset(el); // !!!!!!!!!!!
		var elementCentreX = elementOffset.left + el.width() / 2;
		var elementCentreY = elementOffset.top + el.height() / 2;
		return Array(elementCentreX, elementCentreY);
	};

	function performResize(el, width) {
		el.css('width', width);
	};

	function dragStart(event) {
		if (elementBeingResized) return false;
	};

	function resizeElement(event) {
		if (!elementBeingResized) return false;

		var center = getElementCenter(
			elementBeingResized);
		var xFromCenter = event.pageX - center[0];
		var yFromCenter = event.pageY - center[1];
		var mouseDistance = distance(xFromCenter, yFromCenter);
		var resizeSize = (mouseDistance / mouseStartSize) * elementStartSize;

		performResize(elementBeingResized, resizeSize);
		elementBeingResized.data('width', resizeSize);

		return false;
	};

	function startResize(event) {
		elementBeingResized = $(this).parent();
		var center = getElementCenter(
			elementBeingResized);
		var startXFromCenter = event.pageX - center[0];
		var startYFromCenter = event.pageY - center[1];
		mouseStartSize = distance(startXFromCenter, startYFromCenter);
		elementStartSize = elementBeingResized.data('width');

		$(document).on('mousemove', resizeElement);

		return false;
	};

	function stopResize(event) {
		if (!elementBeingResized) return;
		$(document).unbind('mousemove');
		setTimeout( function() { elementBeingResized = false; }, 10 );
		return false;
	};

	function distance(x, y) {
		return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
	};

})(jQuery);


























