Tapper
======

Tapper is used for counting switch tapping frequency for measuring cognitive load in usability tests, it's based on the article by Tomer Sharon here: 
https://medium.com/@tsharon/measuring-cognitive-load-with-a-tapping-test-f07065854e46

Tapper ~~uses Resin.io and their wifi-connect module, and~~ handles all the serving of pages and timing of stuff in Node. There's instructions to configure a PiZeroW as an access point below. This makes it easy to connect to the UI when using it.

Usage:
Turn on the Rpi, it will create an access point (TapperAP). Connect to this (pwd: tapperaccess). Try some random URLs, the access point should intercept your requests and bring up the control interface.

Once connected - open a browser on the IP address of Tapper to manage file recording and viewing.

Putting the hardware together
-----------------------------

No docs yet :(

Installing the software
-----------------------

Install the Raspbian OS (this was tested with Raspbian Stretch Light) onto an SD card:

https://www.raspberrypi.org/documentation/installation/installing-images/

Before you put the SD card into the Pi, download the installation script (zip) from here:
https://gist.github.com/petegale/87fb0d81fc57f754c13c45c686ea11d1
Unzip it and place the tapperinstall.sh file into the boot partition on the SD card.

Put the SD card into the Pi, with a keyboard and monitor connected, log in (user:pi pass:raspberry)

Now execute the install script, providing it with your wifi details, to allow the pi to download everything it needs. The rest is automatic:

```
cd /boot
sudo chmod -x tapperinstall.sh
sudo ./tapperinstall.sh wifiPassword wifiSSID
```

That should have done everything, just need to reboot

```
sudo reboot
```

You should be able to see the access point wifi network now, called TapperAP. Join with the password: tapperaccess