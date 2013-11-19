//Module dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./routes');
var admin = require('./routes/admin.js');
var monitor = require('./routes/monitor.js');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));

//Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/display', routes.display);

//Admin.js
app.get('/getlist', admin.getlist);
app.get('/insert', admin.insert);
app.get('/remove', admin.remove);
// app.get('/admin', admin.admin);
app.get('/status', admin.status);
app.get('/dbjson', admin.paths);

//Monitor.js
app.get('/getcommits', monitor.getcommits);
app.get('/getrev', monitor.getrev);
app.get('/monitorjson', monitor.monitorjson);
app.get('/activity', monitor.activity);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});