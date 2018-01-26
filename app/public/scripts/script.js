var socket = io();

  var flip=true;

function tap(data) {
  var x = document.getElementById('recording');
  var w = data<2000 ? (data/2000 * 100) : 100;
  setwidth(w);
  if (flip==true) {
      x.style.backgroundColor = '#f9f9f9';
      flip=false;
  } else {
      x.style.backgroundColor = '#ffffff';
      flip=true;
  }
}
function setwidth(val) {
  console.log(val);
  var vu = document.getElementById('vu');;
  vu.style.width = val + "%";
}

socket.on('tap', function(data) {
  tap(data);
});

window.addEventListener("load", function(){
  var startButton = document.getElementById('start');
  var stopButton = document.getElementById('stop');
  if (stopButton) { stopButton.disabled = true; }
  var createLink = document.getElementById('toggle');
  
  var recording = document.getElementById('recording')
  if (recording) {recording.style.display = 'none';}
  
  var createpanel = document.getElementById('createpanel');
  if (createpanel) {createpanel.style.display = 'none';}
  var testButton = document.getElementById('test');
  
  if (testButton) {
    testButton.addEventListener('click', function() {
      socket.emit("tap","tap");
    });
  }
  if (startButton) {
    startButton.addEventListener('click', function() {
      //data can be an object by doing this:
      var RecObj = {};
      RecObj.name = document.getElementById('name').value;
      RecObj.desc = document.getElementById('desc').value;
      if (RecObj.name=="") {
        alert ("Please name your recording, and try again")
      } else {
        socket.emit("start",RecObj);
        startButton.disabled = true;
        stopButton.disabled = false;
        document.getElementById('recording').style.display = 'block';
      }
      //socket.emit("command",{variable,variable});
    });
  }
  
  if (stopButton) {
    stopButton.addEventListener('click', function() {
      socket.emit("stop","stop");
      startButton.disabled = false;
      stopButton.disabled = true;
      location.reload();
    });
  }
  
  if (createLink) {
    createLink.addEventListener('click', function() {
      var x = document.getElementById('createpanel');
      if (x.style.display === 'none') {
          x.style.display = 'block';
      } else {
          x.style.display = 'none';
      }
    });
  }
  
});

