// TapWatcher.js

const EventEmitter = require('events')
const util = require('util')
var threshold = 200;
try {
  var mpu9250 = require('mpu9250');
  var mpu = new mpu9250();
} catch (er) {
  mpu = null;
}

try {
  var button = require("pi-pins").connect(17);
  button.mode('in');
} catch (er) {
  button=null;
}
if (button) {
  console.log("button object OK")
}
if (mpu.initialize()) {
  console.log("mpu object OK")
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
  var r=mpu.getMotion9()
  console.log("Accel r:"+m9 +"|"+ m9[1] +"|"+ m9[2]);
  return m9[2];
}


module.exports = TapWatcher