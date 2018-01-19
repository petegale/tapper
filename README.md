Tapper
======

Tapper is used for counting switch tapping frequency for measuring cognitive load in usability tests.

Tapper uses Resin.io and their wifi-connect module, and handles all the serving of pages and timing of stuff in Node.

Usage:
Turn on the Rpi - if it has wifi crednetials, it will connect automatically, if not, it will create an access point (TapperAP) to allow you to connect and configure wifi.

Once connected - open a browser on the IP address of Tapper to manage file recording and viewing.

Installation
------------
First of all let's enable ssh

```
touch /ssh
```
Now let's enable i2C
```
sudo raspi-config
```
Got to the interfaces option, then enable i2c
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
Save ond exit (Ctrl-X then Y then Enter)

Now reboot:
```
sudo reboot
```

