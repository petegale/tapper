var socket = io();

window.addEventListener("load", function(){
  var startButton = document.getElementById('start');
  var stopButton = document.getElementById('stop');
  var testButton = document.getElementById('test');
  stopButton.disabled = true;
  
  startButton.addEventListener('click', function() {
    //data can be an object by doing this:
    var RecObj = {};
    RecObj.name = document.getElementById('name').value;
    RecObj.desc = document.getElementById('desc').value;
    //socket.emit("command",{variable,variable});
    socket.emit("start",RecObj);
    startButton.disabled = true;
    stopButton.disabled = false;
  });
  
  stopButton.addEventListener('click', function() {
    socket.emit("stop","stop");
    startButton.disabled = false;
    stopButton.disabled = true;
  });
  
  testButton.addEventListener('click', function() {
    socket.emit("test","click");
  });
  
});

