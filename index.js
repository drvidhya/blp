(function(){

	var drWr = $('#draggable-wrapper');
	var rsWr = $('#resizable-wrapper');
	var elem = $('#elem-wrapper');
	elem.resizable({
		aspectRatio: 333 / 758,
		handles: 'ne, nw, se, sw'
	});
	drWr.draggable();
	elem.parent().rotatable();
	drWr.css("top", 200).css("left", 900);
	
	$("body").bind("keydown", function(e){
		var pos = drWr.position();
		var mod = e.shiftKey ? 10 : 1;
		switch (e.keyCode) {
			case 38:
				drWr.css("top", pos.top - 1 * mod);
				break;
			case 40:
				drWr.css("top", pos.top + 1 * mod);
				break;
			case 39:
				drWr.css("left", pos.left + 1 * mod);
				break;
			case 37:
				drWr.css("left", pos.left - 1 * mod);
				break;
		}
	});
	
	// Functions needed for Step 1
	$("#imageBox").click(function(){
		document.getElementById("imgUpload").click();
	});
	
	$("#imgUpload").change(function(e){
		var files = this.files;
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			var imageType = /image.*/;
			if (!file.type.match(imageType)) {
				var text = $("#imageBox").html();
				$("#imageBox").html("<span style = 'color:red'>Please upload an image file<span>");
				window.setTimeout(function(){
					$("#imageBox").html(text);
				}, 5000);
				continue;
			}
			var reader = new FileReader();
			reader.onload = function(e){
				loadImage(e.target.result);
			};
			reader.readAsDataURL(file);
		}
	});
	
	$("#sampleImage").click(function(){
		loadImage("images/bg.jpg");
		return false;
	});
	
	var loadImage = function(img){
		$(".modal").hide();
		$("#positioner").show();
		$("#positioner #resizable-wrapper, #positioner .ui-wrapper, #positioner #elem-wrapper").width(100).height(227);
		$("#cast").attr("src", img);
	};
	
	$("#cast").load(function(e){
		var positioner = $("#positioner").show();
		var cast = $(this);
		var dim = {
			width: positioner.width(),
			height: positioner.height()
		};
		positioner.show();
		if (cast.width < cast.height) {
			cast.css("width", "100%");
		} else {
			cast.css("height", "100%");
		}
		moveStep("calibrate");
	});
	
	// Actions on Calibrate step
	$("#calibrate button.done").click(function(){
		$(".ui-resizable-handle").hide();
		moveStep("position");
	});
	
	$("#calibrate button.cancel").click(function(){
		if (confirm("Are you sure you want to cancel? All your work will be lost")) {
			window.location.reload();
		}
	});
	
	// Actions on Position step
	$("#position button.done").click(function(){
		save();
		$("#saver").show();
		$("#positioner").hide();
		moveStep("save");
	});
	
	$("#position button.cancel").click(function(){
		$(".ui-resizable-handle").show();
		moveStep("calibrate");
	});
	
	var save = function(){
		var transform = $("#elem-wrapper").parent().css("-webkit-transform") || $("#elem-wrapper").parent().css("-moz-transform");
		var a = transform.substring("matrix(".length, transform.length - 1).split(",");
		var castPosition = $("#cast").offset();
		var elemPosition = $("#draggable-wrapper").offset();
		var c = $("<canvas>").attr("width", $("#cast").width()).attr("height", $("#cast").height()).css("display", "none").appendTo("body");
		var ctx = c[0].getContext("2d");
		ctx.drawImage($("#cast")[0], 0, 0, c.width(), c.height());
		ctx.save();
		ctx.translate(elemPosition.left - castPosition.left + elem.width() / 2, elemPosition.top - castPosition.top + elem.height() / 2);
		ctx.transform(a[0], a[1], a[2], a[3], 0, 0);
		ctx.drawImage($("#elem-wrapper")[0], -$("#elem-wrapper").width() / 2, -$("#elem-wrapper").height() / 2, $("#elem-wrapper").width(), $("#elem-wrapper").height());
		ctx.restore();
		$("#saveImage").attr("src", c[0].toDataURL("image/jpeg"))//.replace("image/png", "image/octet-stream");
		c.remove();
	};
	
	var moveStep = function(stepName){
		$("#steps li").removeClass("selected");
		$("#" + stepName).addClass("selected");
		$(".help-section").hide();
		$("#help-" + stepName).show();
	};
	moveStep("upload");
})();


