#!/bin/bash
echo "customised startup of wifi manager"
# Enable i2c 
modprobe i2c-dev

# Start resin-wifi-connect
export DBUS_SYSTEM_BUS_ADDRESS=unix:path=/host/run/dbus/system_bus_socket
sleep 1
node resin-wifi-connect/src/app.js --clear=true

# At this point the WiFi connection has been configured and the device has
# internet - unless the configured WiFi connection is no longer available.

# Start the main application
echo "starting node"
node server.js
