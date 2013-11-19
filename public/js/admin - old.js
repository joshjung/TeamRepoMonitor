$( document ).ready(function() {
	$("#go").on( "click", function() {
		urlValidate();
	});
	$("#urlBox").keypress(function(e) {
		if(e.which == 13) {
			urlValidate();
		}
	});
	$("#dir").on("click", ".listItem", function(e) {
		//console.log($(this).attr('data-dir'));
		urlValidate($(this).attr('data-dir'));
	});
	$("#monitorBtn").on( "click", function() {
		monitorBtn();
	});
});

function getListing(url){
	var uniqueQuery = '/getlist?url=' + url;

	$("#urlBox").val(url);

	$.getJSON(uniqueQuery, function (data) {
		if (!data || data[0] == "") { 
			$('#dir').empty().append("<div class='alert alert-danger'>"+url+" has no sub-directory(s) or its not a valid Subversion URL!</div>");
			return; 
		}
		//console.log(data);
		$("#dir").empty();
		for (var i = 0; i < data.length; i++) {
			$('#dir').append("<li><input id='dir"+i+"'' class='listCheck' type='checkbox'> <a class='listItem' data-dir='"+data[i]+"' href='#'>"+data[i]+"</a></li>");
		}
	});
}

function urlValidate(suburl){
	var input = $("#urlBox").val();

	if (suburl != "" && suburl){
		input += suburl;
	}

	if (input ==  "" ){
		alert("Please enter an url!");
	}
	else {
		getListing(input);
	}
}

function monitorBtn(){
	var watchTheseDirs = [];
	$(".listCheck:checkbox:checked").each(function () {
		watchTheseDirs.push(input = $("#urlBox").val() + $(this).siblings(".listItem").attr('data-dir'));
	});
	console.log(watchTheseDirs);
	for (var i = 0; i < watchTheseDirs; i++){
		
	}
}