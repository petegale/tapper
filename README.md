Tapper
======

Tapper is used for counting switch tapping frequency for measuring cognitive load in usability tests.

Tapper uses Resin.io and their wifi-connect module, and handles all the serving of pages and timing of stuff in Node.

Usage:
Turn on the Rpi - if it has wifi crednetials, it will connect automatically, if not, it will create an access point (TapperAP) to allow you to connect and configure wifi.

Once connected - open a browser on the IP address of Tapper to manage file recording and viewing.

Putting the hardware together
-----------------------------

No docs yet :(

Installing the software
-----------------------

First of all let's enable ssh, i2C and SPI

```
sudo raspi-config
```
Got to the interfaces option, then enable i2c, SSH and SPI
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

Now we're going to update the raspbian install we've just done (this takes some time...)

```
sudo apt-get update
sudo apt-get upgrade
```

Now we'll install node.js so that we can run the code in this Github repository

```
wget http://node-arm.herokuapp.com/node_latest_armhf.deb 
sudo dpkg -i node_latest_armhf.deb
rm node_latest_armhf.deb
```

To test this install, type:

```
node -v
```

If everything has worked, this should return the version number

OK, now it's time to download the code in this repo, and unzip it
```
wget -O tapper https://github.com/petegale/tapper/zipball/master
unzip tapper
rm tapper
```
It's makes things simpler to rename the directory that this has created. If you type ls and hit enter, you will see a name like petegale-tapper-90680a6, let's just rename this to 'tapper', so modify the code below to match the name of the directory you've created:
```
mv petegale-tapper-90680a6 tapper
```
Use ls again to check this worked.

to install the node modules required:
```
cd tapper
npm install
```

Test that the server is running ok (before you do so, you can find out the ip with ifconfig)
```
sudo node server.js
```


To configure node to run this code on start-up, we need to add an instruction to /etc/rc.local:
```
sudo nano /etc/rc.local
```

And add the following on the line before it says exit 0 

```
su pi -c 'sudo node /home/pi/tapper/server.js < /dev/null &'
```
Ctrl-X then Y then Enter to save and exit


Install all the required software in one go with this command:

```
sudo apt-get install dnsmasq hostapd
```
Since the configuration files are not ready yet, turn the new software off as follows:
```
sudo systemctl stop dnsmasq
sudo systemctl stop hostapd
```
Configuring a static IP

We are configuring a standalone network to act as a server, so the Raspberry Pi needs to have a static IP address assigned to the wireless port. This documentation assumes that we are using the standard 192.168.x.x IP addresses for our wireless network, so we will assign the server the IP address 192.168.0.1. It is also assumed that the wireless device being used is wlan0.

To configure the static IP address, edit the dhcpcd configuration file with:
```
sudo nano /etc/dhcpcd.conf
```
Go to the end of the file and edit it so that it looks like the following:
```
interface wlan0
    static ip_address=192.168.4.1/24
```
Now restart the dhcpcd daemon and set up the new `wlan0` configuration:
```
sudo service dhcpcd restart
```

Configuring the DHCP server (dnsmasq)

The DHCP service is provided by dnsmasq. By default, the configuration file contains a lot of information that is not needed, and it is easier to start from scratch. Rename this configuration file, and edit a new one:
```
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig  
sudo nano /etc/dnsmasq.conf
```
Type or copy the following information into the dnsmasq configuration file and save it:
```
interface=wlan0      # Use the require wireless interface - usually wlan0
  dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h
```
So for wlan0, we are going to provide IP addresses between 192.168.4.2 and 192.168.4.20, with a lease time of 24 hours. If you are providing DHCP services for other network devices (e.g. eth0), you could add more sections with the appropriate interface header, with the range of addresses you intend to provide to that interface.

There are many more options for dnsmasq; see the dnsmasq documentation for more details.

Configuring the access point host software (hostapd)

You need to edit the hostapd configuration file, located at /etc/hostapd/hostapd.conf, to add the various parameters for your wireless network. After initial install, this will be a new/empty file.
```
sudo nano /etc/hostapd/hostapd.conf
```
Add the information below to the configuration file. This configuration assumes we are using channel 7, with a network name of NameOfNetwork, and a password AardvarkBadgerHedgehog. Note that the name and password should not have quotes around them.
```
interface=wlan0
driver=nl80211
ssid=NameOfNetwork
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=AardvarkBadgerHedgehog
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
```
We now need to tell the system where to find this configuration file.
```
sudo nano /etc/default/hostapd
```
Find the line with #DAEMON_CONF, and replace it with this:
```
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```
Start it up

Now start up the remaining services:
```
sudo service hostapd start  
sudo service dnsmasq start  
```

Configure dnsmasq and hostapd to start on boot:
```
update-rc.d dnsmasq defaults
update-rc.d hostapd defaults
```








