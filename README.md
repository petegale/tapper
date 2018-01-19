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
It's makes things simpler to rename the directory that this has created. If you type ls and hit enter, you will see a name like petegale-tapper-90680a6, let's just rename this to 'tapper':
```
mv petegale-tapper-* tapper
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


PACKAGES
The first step is to install the required packages: sudo apt-get install dnsmasq hostapd

I'll go into a little detail about the two:

hostapd - This is the package that allows you to use the built in WiFi as an access point
dnsmasq - This is a combined DHCP and DNS server that's very easy to configure


CONFIGURE YOUR INTERFACES
The first thing you'll need to do is to configure your wlan0 interface with a static IP.

If you're connected to the Pi via WiFi, connect via ethernet/serial/keyboard first.

In newer Raspian versions, interface configuration is handled by dhcpcd by default. We need to tell it to ignore wlan0, as we will be configuring it with a static IP address elsewhere. So open up the dhcpcd configuration file with ```sudo nano /etc/dhcpcd.conf``` and add the following line to the bottom of the file:
```
denyinterfaces wlan0 
``` 
Note: This must be ABOVE any interface lines you may have added!

Now we need to configure our static IP. To do this open up the interface configuration file with ```sudo nano /etc/network/interfaces``` and edit the wlan0 section so that it looks like this:
```
allow-hotplug wlan0  
iface wlan0 inet static  
    address 172.24.1.1
    netmask 255.255.255.0
    network 172.24.1.0
    broadcast 172.24.1.255
#    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
```
Restart dhcpcd with ```sudo service dhcpcd restart``` and then reload the configuration for wlan0 with ```sudo ifdown wlan0; sudo ifup wlan0```.

CONFIGURE HOSTAPD
Next, we need to configure hostapd. Create a new configuration file with ```sudo nano /etc/hostapd/hostapd.conf``` with the following contents:
```
# This is the name of the WiFi interface we configured above
interface=wlan0

# Use the nl80211 driver with the brcmfmac driver
driver=nl80211

# This is the name of the network
ssid=TapperAP

# Use the 2.4GHz band
hw_mode=g

# Use channel 6
channel=6

# Enable 802.11n
ieee80211n=1

# Enable WMM
wmm_enabled=1

# Enable 40MHz channels with 20ns guard interval
ht_capab=[HT40][SHORT-GI-20][DSSS_CCK-40]

# Accept all MAC addresses
macaddr_acl=0

# Use WPA authentication
auth_algs=1

# Require clients to know the network name
ignore_broadcast_ssid=0

# Use WPA2
wpa=2

# Use a pre-shared key
wpa_key_mgmt=WPA-PSK

# The network passphrase
wpa_passphrase=raspberry

# Use AES, instead of TKIP
rsn_pairwise=CCMP
```
We can check if it's working at this stage by running ```sudo /usr/sbin/hostapd /etc/hostapd/hostapd.conf```. If it's all gone well thus far, you should be able to see to the network TapperAP! If you try connecting to it, you will see some output from the Pi, but you won't receive and IP address until we set up dnsmasq in the next step. Use Ctrl+C to stop it.

We aren't quite done yet, because we also need to tell hostapd where to look for the config file when it starts up on boot. Open up the default configuration file with ```sudo nano /etc/default/hostapd``` and find the line #DAEMON_CONF="" and replace it with ```DAEMON_CONF="/etc/hostapd/hostapd.conf"```.

CONFIGURE DNSMASQ
The shipped dnsmasq config file contains a wealth of information on how to use it, but the majority of it is largely redundant for our purposes. I'd advise moving it (rather than deleting it), and creating a new one with
```
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig  
sudo nano /etc/dnsmasq.conf  
```

Paste the following into the new file:
```
interface=wlan0      # Use interface wlan0  
listen-address=172.24.1.1 # Explicitly specify the address to listen on  
bind-interfaces      # Bind to the interface to make sure we aren't sending things elsewhere  
server=8.8.8.8       # Forward DNS requests to Google DNS  
domain-needed        # Don't forward short names  
bogus-priv           # Never forward addresses in the non-routed address spaces.  
dhcp-range=172.24.1.50,172.24.1.150,12h # Assign IP addresses between 172.24.1.50 and 172.24.1.150 with a 12 hour lease time 
```

SET UP IPV4 FORWARDING
One of the last things that we need to do before we send traffic anywhere is to enable packet forwarding.

To do this, open up the sysctl.conf file with ```sudo nano /etc/sysctl.conf```, and remove the # from the beginning of the line containing ```net.ipv4.ip_forward=1```. This will enable it on the next reboot, but because we are impatient, activate it immediately with : 
```
sudo sh -c "echo 1 > /proc/sys/net/ipv4/ip_forward"
```

We also need to share our Pi's internet connection to our devices connected over WiFi by the configuring a NAT between our wlan0 interface and our eth0 interface. We can do this using the following commands:
```
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE  
sudo iptables -A FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT  
sudo iptables -A FORWARD -i wlan0 -o eth0 -j ACCEPT  
```
However, we need these rules to be applied every time we reboot the Pi, so run 
```
sudo sh -c "iptables-save > /etc/iptables.ipv4.nat"
```
to save the rules to the file /etc/iptables.ipv4.nat. 
Now we need to run this after each reboot, so open the rc.local file with ```sudo nano /etc/rc.local``` and just above the line exit 0, add the following line:
```
iptables-restore < /etc/iptables.ipv4.nat 
```
WE'RE ALMOST THERE!
Now we just need to start our services:
```
sudo service hostapd start  
sudo service dnsmasq start  
```
And that's it! You should now be able to connect to the internet through your Pi, via the on-board WiFi!

To double check we have got everything configured correctly, reboot with ```sudo reboot```.










