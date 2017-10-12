// TapWatcher.js


//Black: gnd
//Red: Vdd
//White: SDA
//GReen / brown: SCL

const EventEmitter = require('events')
const util = require('util')
try {
  var mpu9250 = require('mpu9250');
  var mpu = new mpu9250();
} catch (er) {
  console.log(er);
  mpu = null;
}

try {
  var button = require("pi-pins").connect(global.config.GPIO_pin);
  button.mode('in');
  global.led = require('pi-pins').connect(18);
  global.led.mode('high');
  global.ledOn=true;
} catch (er) {
  console.log(er);
  button=null;
}
if (button) {
  console.log("button object OK")
}
if (mpu.initialize()) {
  console.log("mpu object OK")
  //mpu.printAccelSettings();
}
//flash the LED if we're recording
setInterval(function() {
  if (global.RecObj.RecStatus) {
    global.led.value(global.ledOn);
    if (global.ledOn) {
      global.ledOn=false;
    } else {
      global.ledOn=true;
    }
  }
}, 200);

// get a random string and emit the appropriate event every 3 seconds
function TapWatcher(watchwhat, threshold) {
  EventEmitter.call(this)
  const that = this
    if (mpu) {
      //do the accelerometer thing
      console.log("monitoring the accelerometer");
      var lastVal=0
      setInterval(function () {
        //test for high g reading
        var a = getAccel();
          if ((a-lastVal)> threshold) {
            that.emit('tap',a);
          }
          lastVal=a;
      }, 20)
    } else {
      console.log("Unable to access accelerometer");
    }
    if (button) {
      console.log("monitoring the switch");
      button.on('rise', function () {
        console.log("button handler"); 
        that.emit('tap')
      });
    } else {
      console.log("Unable to access switch");
    }
}  

// conventionally, NodeJs uses util.inherits() for inheritance
util.inherits(TapWatcher, EventEmitter)

// simple function to randomly select a string from an array
function getAccel () {
  var r=mpu.getAccel();
  //console.log("Accel r:"+r[0]+"|"+ r[1] +"|"+ r[2]);
  return r[2];
}


module.exports = TapWatcher