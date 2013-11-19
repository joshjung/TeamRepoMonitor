$(document).ready(function () {

	populateURLDropDown();

	$("#urlDropdown").on("change", function (e) {
		populateDisplay(e.target.options[e.target.selectedIndex].text);
	});

	$("#expand").on("click", function () {
		$(".collapse").collapse("show");
	});

	$("#author").on("click", ".revAuthor", function () {
		authorPicker(this);
	});
	
});

function checkEmpty(db){ 
	if (!db || db[Object.keys(db)[0]].length == 0) {
		console.log("No data from call!");

		$("#messageBox, #display").empty();
		$("#messageBox").append("<div class='alert alert-danger'> No revision (/getrev) call made, or no revision(s) detected.</div>");
		return false;
	}
	return true;
}

function populateURLDropDown(){
	$.getJSON("/dbjson", function (db) {
		if (checkEmpty(db)) {
			populateDisplay(db.Paths[0].dir);
			$("#urlDropdown").empty();
			for (var i = 0; i < db.Paths.length; i++) {
				$("#urlDropdown").append("<option data-dir='" + db.Paths[i].dir  + "'> " + db.Paths[i].dir + "</option>");
			}
		}
	});
}

function authorPicker(target){
	var author = "."+$(target).attr("data-author");
	if ($(author).hasClass("selected")){
		$(author).removeClass("selected")
	}
	else {
		$(author).addClass("selected")
	}
}

function populateDisplay(url){

	$("#messageBox, #display").empty();

	$.getJSON("/monitorjson?url="+url, function (db) {
		if (checkEmpty(db)){
			populateLastCount(db.Monitor.length);
			populateLastRev(db.Monitor[0].date);
			for (var i = 0; i < db.Monitor.length; i++) {
				var head = "<div class='panel-heading "+ db.Monitor[i].author +"'><h4 class='panel-title'><a data-toggle='collapse' data-parent='#accordion' href='#collapse"+i+"'>" + db.Monitor[i].revision + "</a></h4></div>";
				var body = "<p><strong>Author</strong>: " + db.Monitor[i].author +"</p><p><strong>Date:</strong> " + db.Monitor[i].date+"</p><p><strong>Comments:</strong> " + db.Monitor[i].message+"</p>";
				$('#display').append(
					"<div class='panel panel-default'>" + head + "<div id='collapse" + i + "' class='panel-collapse collapse'><div class='panel-body'>" + body + "</div></div></div>"
					);
			}
		}
	});	
	populateAuthor(url);
}

function populateLastCount(count){
	$("#lastCount").replaceWith("<span id='lastCount'> " + count + "</span>");
}

function populateLastRev(rev){
	$("#lastRev").replaceWith("<span id='lastRev'> " + rev + "</span>");
}

function populateAuthor(url){
	$("#author").empty();
	$.getJSON("/monitorjson?url="+url+"&author=0", function (db) {
		//console.log(db);
		checkEmpty(db);
		for (var i = 0; i < db.Monitor.length; i++) {
			$("#author").append("<a class='revAuthor' data-author='"+db.Monitor[i].author+"' href='#'>" + db.Monitor[i].author + "(" + db.Monitor[i].Changes + ")</a>, ");
		}
	});	
}