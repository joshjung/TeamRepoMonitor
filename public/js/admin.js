var currentURL;

$(document).ready(function () {

  rebuildSelectList();

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

  $("#select").on("click", ".listItem", function (e) {
    updateListing($(this).attr('data-dir'));
  });

  $("#back").on("click", function () {
    var a = currentURL.split("/");
    a.splice(-2,2);
    var b = a.join("/");
    updateListing(b);
  });

  $("#dir").on("click", "#dir>li>.listbtn", function (e) {
    var target = this;
    $.ajax('/insert?url=' + currentURL + $(this).siblings(".listItem").attr('data-dir'), {
      complete: function (httpobject, status) {
        $(target).addClass("checked disabled").text("✓");
        rebuildSelectList();
      }
    });
  });

  $("#select").on("click", "#select>li>.listbtn", function (e) {
    var target = this;
    $.ajax('/remove?url=' + $(this).siblings(".listItem").attr('data-dir'), {
      complete: function (httpobject, status) {
        $("#dirr>li>.listbtn").text("+");
        updateListing($("#urlBox").val());
        rebuildSelectList();
      }
    });
  });
});

/*
 *  Moves the selected item out of the current container and
 *    updates the overall listing.
 */
 /*function moveSelection(item, location, isSelected) {
  $(item).parent().remove();
  $("#" + location).append($(item).parent());
  getSelected(function (data) {
    rebuildDirectoryList(data);
    rebuildSelectList(data);
  });
  $("#" + location + ">li>.listbtn").text((isSelected ? "+" : "-"));

  updateListing($("#urlBox").val());
}
*/

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
  currentURL = domain + "/" + subdir;

  $("#urlBox").val(currentURL);   // Update urlbox with the new path

  getSelected(function (data) {
    rebuildDirectoryList(data);
  });
}

function rebuildDirectoryList(monitored) {
  //console.log("List of monitored objects passed into rebuildDirectoryList: ");
  //console.log(monitored);

  // Rebuild directory listing with new path
  var uniqueQuery = '/getlist?url=' + currentURL;
  $.getJSON(uniqueQuery, function (data) {
    if (!data || data[0] == "") {
      $("#messageBox, #dir").empty();
      $("#messageBox").append("<div class='alert alert-danger'>" + currentURL
        + " has no sub-directory(s) or its not a valid Subversion URL!</div>");
      return;
    }

    $("#messageBox, #dir").empty();

    // Add items to the directory listing only if they are NOT in the monitored list
    for (var i = 0; i < data.length; i++) {

      var url = currentURL + data[i];
      var button;
      if ($.inArray(url, monitored) == -1) {
        button = "<button type='button' id='dir"
        + i + "' class='listbtn btn btn-xs btn-default'>+</button>";
      }
      else {
        button = "<button type='button' id='dir"
        + i + "' class='listbtn checked disabled btn btn-xs btn-default'>✓</button>";
      }
      $('#dir').append("<li>"+button+"<a "
        + "class='listItem' data-dir='" + data[i] + "' href='#'> "
        + data[i] + "</a></li>");
    }
  });
}

function rebuildSelectList(){
  $("#select").empty();

  getSelected(function (data){
    if (!data || data == "") {
      console.log("no data");}
      for (var i in data) {
        $("#select").append("<li><button type='button' class='listbtn btn btn-xs btn-default'>-</button><a class='listItem' data-dir='" + data[i] + "' href='#'> "
          + data[i] + "</a></li>");}
      })
}

/*
 *  Returns a "Set" with a list of all items currently
 *    being monitored by the server.
 */
 function getSelected(callback) {
  $.getJSON('/dbjson', function (db) {
    var temp = [];
    if (db != null && db.Paths.length > 0) {
      var data = db.Paths;
      for (var i = 0; i < data.length; i++) {
        temp[i] = data[i].dir;
      }
    }
    callback(temp);
  });
}
