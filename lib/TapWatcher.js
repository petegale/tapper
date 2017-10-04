// TapWatcher.js

const EventEmitter = require('events')
const util = require('util')
var threshold = 2;
try {
  var mpu = require('mpu-9250');
} catch (er) {
  mpu = null;
}

try {
  var button = require("pi-pins").connect(17);
  button.mode('in');
} catch (er) {
  button=null;
}

// get a random string and emit the appropriate event every 3 seconds
function TapWatcher(watchwhat) {
  EventEmitter.call(this)
  const that = this
  if (watchwhat=="MPU") {
    if (mpu) {
      //do the accelerometer thing
      console.log("monitoring the accelerometer");
      setInterval(function () {
          //test for high g reading
          if (getAccel()>threshold) {
            that.emit('tap')
          }
      }, 20)
    } else {
      console.log("Unable to access accelerometer");
    }
  } else if (watchwhat=="GPIO") {
    if (button) {
      console.log("monitoring the switch");
      button.on('rise', function () {
        console.log("button handler"); 
        that.emit('tap')
      });
    } else {
      console.log("Unable to access switch");
    }
  } else {
    console.log("Nothing to watch");
  } 
}  

// conventionally, NodeJs uses util.inherits() for inheritance
util.inherits(TapWatcher, EventEmitter)

// simple function to randomly select a string from an array
function getAccel () {
  //read the g value from the accelerometer
  return 3;
}


module.exports = TapWatcher