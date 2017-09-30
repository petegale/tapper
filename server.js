//setup express & socket.io
console.log("Node server coming up..."+getDateTime());

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/app/public'));
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');

var fs = require('fs');

//setup config variables
var config = require("./lib/config.json");
var data = {};
data = config;
data.foo="bar";

//test and configure for where it's running
var www_port=config.dev_port;
var isPi = require('detect-rpi');
if (isPi()) {
  //setup specific to rPi
  www_port = config.prod_port;  
  //provision the gpio pins 22 for the led output and 17 for the button input
  var button = require("pi-pins").connect(17);
  button.mode('in');
} else {
  //setup test variables for running on laptop
}

//basic socket.io listener
io.on('connection', function(socket){
  console_log("connected");
  socket.on('disconnect', function(){
    console_log(" disconnected")
  });
});

// reply to request
app.get('/', function (req, res) {
  console.log("request for / .. reading data files");
  var path = "sample";
  var file_titles=[];
  var file;
  fs.readdir(path, function(err, items) {
      for (var i=0; i<items.length; i++) {
          file=JSON.parse(fs.readFileSync(path+"/"+items[i], 'utf8'));
          file_titles[i]=file.name;
      }
      data.file_titles=file_titles;
      res.render('index',data);
  });
});

app.get('/view', function (req, res) {
  var fileid = req.query.id;
  console.log("QS"+fileid);
  var path = "sample";
  var file;
  fs.readdir(path, function(err, items) {
    file=JSON.parse(fs.readFileSync(path+"/"+items[fileid], 'utf8'));
    data.file=file;
    res.render('view',data);
  });
});

//start a server  and log its start to our console
var server = app.listen(www_port, function () {

  var port = server.address().port;
  console.log('Example app listening on port ', port);

});

//button event handler
button.on('rise', function () {
  console.log("button pressed: "+ (++pressCount) +" time(s)");
});

//Some utility functions

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}
