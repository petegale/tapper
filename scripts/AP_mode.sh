#!/bin/bash

# REVERT TO STANDARD WIFI MODE

sudo update-rc.d hostpad enable
sudo update-rc.d dnsmasq enable

ln -f /etc/pi-ap/ap-mode-config /etc/network/interfaces

wpa_cli -i wlan0 reconfigure
sudo service networking restart