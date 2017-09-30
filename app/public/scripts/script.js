var socket = io();

window.addEventListener("load", function(){
  var createButton = document.getElementById('create');
  
  createButton.addEventListener('click', function() {
    //data can be an object by doing this:
    var FileObj = {};
    FileObj.name = document.getElementById('name').value;
    FileObj.desc = document.getElementById('desc').value;
    //socket.emit("command",{variable,variable});
    socket.emit("create",FileObj);
  });
  
});

