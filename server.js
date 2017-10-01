var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
global.RecObj = {};
global.RecObj.RecStatus = false;

app.use(express.static(__dirname + '/app/public'));
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');

var fs = require('fs');

//setup config variables
var config = require("./lib/config.json");
var data = {};
data = config;
data.foo="bar";
var path = "/data";

//test and configure for where it's running
var www_port=config.dev_port;
var isPi = require('detect-rpi');
if (isPi()) {
  //setup specific to rPi
  www_port = config.prod_port;  
  //provision the gpio pins 22 for the led output and 17 for the button input
  var button = require("pi-pins").connect(17);
  button.mode('in');
  
  //GPIO button event handler
  button.on('rise', function () {
    console.log("button handler"); 
    tap();
  });
  
} else {
  //setup test variables for running on laptop
}

//start a server  and log its start to our console
http.listen(www_port, function () {
  var port = http.address().port;
  console.log('Example app listening on port ', port);

});

//basic socket.io listener
io.on('connection', function(socket){
  console.log("socket.io connected");
  socket.on('disconnect', function(){
    console.log("socket.io disconnected")
  });
  
  
  socket.on('start', function(data){
    global.RecObj=data;
    global.RecObj.date=getDateTime(":");
    global.RecObj.RecStatus = true;
    global.RecObj.data = [];
    global.RecObj.lastclick=new Date().getTime();
    console.log("starting");
    console.log(global.RecObj);
    //store the object persistently
  });
  
  socket.on('stop', function(data){
    console.log("stopping recording");
    //store the object persistently
    var fpath="/data/"+getDateTime("")+".json";
    fs.writeFile(fpath, JSON.stringify(global.RecObj), (err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log("File has been created");
    });
  });
  
  socket.on('test', function(data){
    tap();
  });  
  
});

// reply to request
app.get('/', function (req, res) {
  var action = req.query.action;
  var fileid = req.query.id;
  if (action=="delete") {
    fs.readdir(path, function(err, items) {
      fs.unlinkSync(path+"/"+items[data.fileid]);
    });
  }
  var file_titles=[];
  var file;
  fs.readdir(path, function(err, items) {
    if (items) {
      for (var i=0; i<items.length; i++) {
          file=JSON.parse(fs.readFileSync(path+"/"+items[i], 'utf8'));
          file_titles[i]=file.name;
      }
      data.hasfiles=true;
    } else {
      data.hasfiles=false;
    }
      data.file_titles=file_titles;
      res.render('index',data);
  });
});

app.get('/view', function (req, res) {
  data.fileid = req.query.id;
  console.log("QS"+fileid);
  var file;
  fs.readdir(path, function(err, items) {
    file=JSON.parse(fs.readFileSync(path+"/"+items[data.fileid], 'utf8'));
    data.file=file;
    res.render('view',data);
  });
});




//Some utility functions

function tap() {
  if (global.RecObj.RecStatus) {
    var now = new Date().getTime();
    var diff = now - global.RecObj.lastclick;
    global.RecObj.lastclick = now;
    global.RecObj.data.push(diff);
    io.sockets.emit("tap","active");
  } else {
    console.log("not recording"); 
  }
}

function getDateTime(delim) {
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
    return year + delim + month + delim + day + delim + hour + delim + min + delim + sec;

}
