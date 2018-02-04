#!/bin/bash

# REVERT TO STANDARD WIFI MODE

sudo update-rc.d hostpad disable
sudo update-rc.d dnsmasq disable

ln -f /etc/pi-ap/standard-config /etc/network/interfaces

wpa_cli -i wlan0 reconfigure
sudo service networking restart