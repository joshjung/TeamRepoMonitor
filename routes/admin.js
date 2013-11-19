var svnMonitor = require('svnmonitor');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("paths.db");

db.run("DROP TABLE IF EXISTS Paths");
db.run("CREATE TABLE IF NOT EXISTS Paths (rowid INTEGER PRIMARY KEY, dir TEXT unique, status INTEGER)");

// db.run("DROP TABLE IF EXISTS Admin");
// db.run("CREATE TABLE IF NOT EXISTS Admin (rowid INTEGER PRIMARY KEY, rooturl TEXT unique)");

var svnMon = new svnMonitor(
        "http://www.ineedthisurlherefornow.com", //URL
        "", //User Name
        "" //Password
        );

//Directory listing
exports.getlist = function (req, res) {

	svnMon.url = req.query.url;

	svnMon.getList(function(err, list){
		if(err){
			console.log('Error: ' + err);
			return;
		}
		res.send(list);
	});
};


//Insert into DB
exports.insert = function (req, res) {
	if (!req.query.url || req.query.url == ""){
		console.log("error!");
	}
	else {
		db.prepare("INSERT OR IGNORE INTO Paths (dir, status) VALUES (?, ?)", req.query.url, 0).run();
		res.send("success");
	}
};

//Remove from DB
exports.remove = function (req, res) {
	if (!req.query.url || req.query.url == ""){
		console.log("error!");
	}
	else {
		db.prepare("DELETE FROM Paths WHERE dir='"+req.query.url+"'").run();
		res.send("success");
	}
};

//Inputting admin information
// exports.admin = function (req, res) {
// 	if (!req.query.root || req.query.root == ""){
// 		console.log("error!");
// 	}
// 	else {
// 		db.prepare("INSERT OR IGNORE INTO Admin (rooturl) VALUES (?)", req.query.root).run();
// 		res.send("success");
// 	}
// };


//Update status
exports.status = function (req, res) {
  //console.log('id: ' + getID);
  var query = "UPDATE Paths SET status = " + req.query.status + " WHERE text = " + req.query.id;
  db.all(query, function (err, rows) {
  	res.send(err);
  });
};

//SHOW DB data
exports.paths = function (req, res) {
	db.all("SELECT * FROM Paths ORDER BY rowid ASC", function (err, rows) {
		res.send({ Paths: rows });
	});
};


