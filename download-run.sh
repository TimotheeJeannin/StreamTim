#!/bin/sh

sudo ln -sf /lib/$(arch)-linux-gnu/libudev.so.1 /lib/$(arch)-linux-gnu/libudev.so.0

wget http://192.168.1.192:8000/stream-tim/linux64/icudtl.dat
wget http://192.168.1.192:8000/stream-tim/linux64/libffmpegsumo.so
wget http://192.168.1.192:8000/stream-tim/linux64/nw.pak
wget http://192.168.1.192:8000/stream-tim/linux64/stream-tim

sudo chmod +x stream-tim

sudo ./stream-tim

