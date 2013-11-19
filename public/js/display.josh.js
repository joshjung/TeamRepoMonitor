var urlactivity = [[]];

$(document).ready(function () {

	retrieveURL();
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

function retrieveActivityCount(url){

	$("#messageBox, #display").empty();

	$.getJSON("/activity?url="+url, function (db) {
		if (checkEmpty(db)){
			console.log(db.Monitor.length);
			urlactivity[url][db.Monitor.length] = ;
		}
	});	
}

function retrieveURL(){
	$.getJSON("/dbjson", function (db) {
		if (checkEmpty(db)) {
			for (var i = 0; i < db.Paths.length; i++) {
				retrieveActivityCount(db.Paths[i].dir);	
			}
		}
	});
}