$(document).ready(function () {
  $("#go").on("click", function () {
    updateListing($("#urlBox").val());
  });

  $("#urlBox").keypress(function (e) {
    if (e.which == 13) {
      updateListing($("#urlBox").val());
    }
  });

  $("#dir").on("click", ".listItem", function (e) {
    updateListing($("#urlBox").val(), $(this).attr('data-dir'));
  });

  $("#monitorBtn").on("click", function () {
    monitorBtn();
  });

  //Probably refractor this into a function and pass in #directory and +/-
  $("#dir").on("click", "#dir>li>.listbtn", function (e) {
    $(this).parent().remove();
    $("#select").append($(this).parent());
    $("#select>li>.listbtn").text("-");
  });

  $("#select").on("click", "#select>li>.listbtn", function (e) {
    $(this).parent().remove();
    $("#dir").append($(this).parent());
    $("#dir>li>.listbtn").text("+");
  });

});

function updateListing(domain, subdir) {
  // Domain is not optional
  if (!domain || domain == "") {
    alert("Please enter a url!");
    return;
  }

  // Optional subdirectory not given
  if (!subdir) { subdir = ""; }

  // Remove trailing / from domain
  if (domain[domain.length - 1] == "/") {
    domain = domain.substring(0, domain.length - 1);
  }

  // Remove preceeding / from subdirectory
  if (subdir.length > 0 && subdir[0] == "/") {
    subdir = subdir.substring(1);
  }

  // Recombine domain/subdirectory
  var url = domain + "/" + subdir;
  var uniqueQuery = '/getlist?url=' + url;

  $("#urlBox").val(url);  // Update urlbox with the new path

  // Rebuild directory listing with new path
  $.getJSON(uniqueQuery, function (data) {
    if (!data || data[0] == "") {
      $("#messageBox, #dir").empty();
      $("#messageBox").append("<div class='alert alert-danger'>" + url + " has no sub-directory(s) or its not a valid Subversion URL!</div>");
      return;
    }
    //console.log(data);
    $("#messageBox, #dir").empty();
    for (var i = 0; i < data.length; i++) {
      $('#dir').append("<li><button type='button' id='dir" + i + "' class='listbtn btn btn-xs btn-default'>+</button><a class='listItem' data-dir='" + data[i] + "' href='#'> " + data[i] + "</a></li>");
    }
    /*
    for (var i = 0; i < data.length; i++) {
      $('#dir').append("<li><input id='dir" + i + "'' class='listCheck' type='checkbox'> <a class='listItem' data-dir='" + data[i] + "' href='#'>" + data[i] + "</a></li>");
    }
    */
  });
}

function plusBtn() {

}

function monitorBtn() {
  var watchTheseDirs = [];
  $(".listbtn:checkbox:checked").each(function () {
    // Do you really need "input ="?
    watchTheseDirs.push($("#urlBox").val() + $(this).siblings(".listItem").attr('data-dir'));
  });
  console.log(watchTheseDirs);
  /*
  for (var i = 0; i < watchTheseDirs; i++) {

  }*/
}
