var socket = io();

  var flip=true;

function tap() {
  var x = document.getElementById('recording');
  if (flip==true) {
      x.style.backgroundColor = '#f9f9f9';
      flip=false;
  } else {
      x.style.backgroundColor = '#ffffff';
      flip=true;
  }
}

socket.on('tap', function(data) {
  tap();
});

window.addEventListener("load", function(){
  var startButton = document.getElementById('start');
  var stopButton = document.getElementById('stop');
  var createLink = document.getElementById('toggle');
  if (stopButton) {
    stopButton.disabled = true;
  }
  if (startbutton) {
    startButton.addEventListener('click', function() {
      //data can be an object by doing this:
      var RecObj = {};
      RecObj.name = document.getElementById('name').value;
      RecObj.desc = document.getElementById('desc').value;
      //socket.emit("command",{variable,variable});
      socket.emit("start",RecObj);
      startButton.disabled = true;
      stopButton.disabled = false;
      document.getElementById('recording').style.display = 'block';
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

  
  document.getElementById('recording').style.display = 'none';
  
  document.getElementById('createpanel').style.display = 'none';
  
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

