var socket = io();

window.addEventListener("load", function(){
  var createButton = document.getElementById('create');
}

createButton.addEventListener('click', function() {
  alert("foo");
  //data can be an object by doing this:
  //socket.emit("command",{variable,variable});
  socket.emit("command","data");
});