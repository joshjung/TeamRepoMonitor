var svnMonitor = require("svnmonitor");
var sqlite3 = require("sqlite3").verbose();
var paths = new sqlite3.Database("paths.db");
var monitor = new sqlite3.Database("monitor.db");
var moment = require("moment");
//var async = require('async');

monitor.run("DROP TABLE IF EXISTS Monitor");
monitor.run("CREATE TABLE IF NOT EXISTS Monitor (rowid INTEGER PRIMARY KEY, dir TEXT, revision INTEGER unique, author TEXT, date TEXT, unixdate INTEGER, message TEXT)");

var svnMon = new svnMonitor(
        "http://www.ineedthisurlherefornow.com", //URL
        "", //User Name
        "" //Password
        );

//Get latest commits
exports.getcommits = function (req, res) {

	svnMon.url = req.query.url;

	svnMon.getLatestCommits(req.query.limit, function(err, log){
		if(err){
			console.log(err);
			return;
		}
		res.send(log);
	});
};

//Grab DB URLs and insert changes into Monitored
exports.getrev = function (req, res) {

	var query = "SELECT dir FROM Paths ORDER BY rowid ASC";

	paths.all(query, function (err, rows) {

		for(var i in rows) { 
			getCommitList(req.query.limit, rows[i].dir, function(list, url) {

				for (var j = 0; j < list.length; j++)
				{
					unixdate = moment(list[j].date).unix();

					author = list[j].author.replace(/^\s+|\s+$/g,'')
					monitor.prepare("INSERT OR IGNORE INTO Monitor (dir, revision, author, date, unixdate, message) VALUES (?, ?, ?, ?, ?, ?)", url, list[j].revision, author, list[j].date, unixdate, list[j].message).run();
				}
			});
			res.send(rows);
		};
	});
};

//Display ALL Monitored changes
//monitorjson : display all
//monitorjson?url=  : displays that url
//monitorjson?url= &author=0 : display author list ranked by most contribution
//monitorjson?url= &author=author : display all by that author from that url   
exports.monitorjson = function (req, res) {

	var query = "SELECT * FROM Monitor ORDER BY rowid ASC";
	if (req.query.url) {
		query = "SELECT * FROM Monitor WHERE dir = '" + req.query.url + "' ORDER BY rowid ASC";
		if (req.query.author == 0) {
			query = "SELECT author, COUNT(*) AS Changes FROM Monitor WHERE dir = '" + req.query.url + "' GROUP BY author ORDER BY Changes DESC ";
		}
		if (req.query.author && req.query.author != 0) {
			query = "SELECT * FROM Monitor WHERE dir = '" + req.query.url + "' AND author = '" + req.query.author + "' ORDER BY revision DESC";
		}
	} 

	monitor.all(query, function (err, rows) {
		res.send({ Monitor: rows });
	});
};

//Retrieves all commits from the last day, NOT TAKING INTO CONSIDERATION DAYLIGHT SAVING (NOT ALL DAYS ARE EQUAL)
//activity : display all commits ordered by unixdate
//activity?url= : display all commits from last day  
//activity?option=1 : display all commits from last day
//acitivty?option=2 : display all dir order by commits from last day
exports.activity = function (req, res) {
	var lastday = moment().unix() - (24*60*60);

	var query = "SELECT * FROM Monitor ORDER BY unixdate DESC";

	if (req.query.url) {
		query = "SELECT * FROM Monitor WHERE dir = '" + req.query.url + "' AND unixdate > " + lastday + " ORDER BY unixdate DESC";
	}

	if (req.query.option == 1) {
		query = "SELECT dir, COUNT(*) AS COUNT FROM Monitor WHERE unixdate > " + lastday + " GROUP BY dir ORDER BY COUNT DESC";
	}

	if (req.query.option == 2) {
		query = "SELECT * FROM Monitor WHERE unixdate > " + lastday + " ORDER BY unixdate DESC"
	}

	monitor.all(query, function (err, rows) {
		res.send({ Monitor: rows });
	});
};


function getCommitList (limit, url, callback){
	svnMon.url = url;
	svnMon.getLatestCommits(limit, function(err, log){
		if(err){
			console.log(err);
			return;
		}
		callback(log, url);
	});
}