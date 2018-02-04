#!/bin/bash

wget -q --spider https://github.com/petegale/tapper/zipball/master
if [ $? -eq 0 ]; then
    echo '>>>Downloading & installing package'
    cd /home/pi
    sudo rm -r /home/pi/tapper
    wget -O tapper https://github.com/petegale/tapper/zipball/master
    unzip tapper
    rm tapper
    mv petegale-tapper-* tapper
    cd tapper
    sudo npm install --unsafe-perm

else
    echo ">>>Unable to download tapper package: exit script, please try again"
    exit 1
fi
