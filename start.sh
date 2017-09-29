#!/bin/bash
echo "this one, really"
# Enable i2c - needed for the Display-O-Tron HAT
#prolly not needed, but may leave for future GPIO
modprobe i2c-dev

# Run one process loop
#python src/process.py

# Start resin-wifi-connect
export DBUS_SYSTEM_BUS_ADDRESS=unix:path=/host/run/dbus/system_bus_socket
sleep 1
node resin-wifi-connect/src/app.js --clear=false

# At this point the WiFi connection has been configured and the device has
# internet - unless the configured WiFi connection is no longer available.

# Start the main application
echo "starting node"
node server.js
