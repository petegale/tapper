Tapper
======

Tapper is used for counting switch tapping frequency for measuring cognitive load in usability tests.

Tapper ~~uses Resin.io and their wifi-connect module, and~~ handles all the serving of pages and timing of stuff in Node. There's instructions to configure a PiZeroW as an access point below. This makes it easy to connect to the UI when using it.

Usage:
Turn on the Rpi - if it has wifi crednetials, it will connect automatically, if not, it will create an access point (TapperAP) to allow you to connect and configure wifi.

Once connected - open a browser on the IP address of Tapper to manage file recording and viewing.

Putting the hardware together
-----------------------------

No docs yet :(

Installing the software
-----------------------

This is installing from a base of Raspbian Stretch Lite.

First of all let's enable i2C and SPI

```
sudo raspi-config
```
Got to the interfaces option, then enable i2c and SPI
Now let's provide details of the wireless network we're using during setup:
```
sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
```

Add the following to this file:
```
network={
    ssid="testing"
    psk="testingPassword"
}
```
Save and exit (Ctrl-X then Y then Enter)

Strongly recomend that you change the default password at this point, by typing passwd

Now reboot:
```
sudo reboot
```
Now check you're online with:
```
ping www.google.com
```
If that's working (not timing out), you can Ctrl-C to stop the ping.

At this point it might be easier to log in via ssh (use ifconfig to find your ip, then ssh pi@[YOUR IP ADDRESS])

Now we download a bash script from github gist, and execute it. The rest is automatic

```
wget https://gist.githubusercontent.com/petegale/87fb0d81fc57f754c13c45c686ea11d1/raw/48043b8e86067f8db9a8ea2474d7d2e6624c52c1/tapperinstall.sh
sudo chmod -x tapperinstall.sh
sudo ./tapperinstall.sh
```

That should have done everything, just need to reboot

```
sudo reboot
```

You should be able to see the access point wifi network now, called TapperAP. Join with the password: tapperaccess