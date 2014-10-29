#!/bin/bash
# Generate PhoneGap icon and splash screens.
# Copyright 2013 Tom Vincent <http://tlvince.com/contact>

usage() { echo "usage: $0 icon" exit 1; }

[ "$1" ] || usage

devices=android,bada,bada-wac,blackberry,ios,webos,windows-phone
eval mkdir -p "$1" "www/res/{icon,screen}/{$devices}"

# Show the user some progress by outputing all commands being run.
set -x

# Explicitly set background in case image is transparent (see: #3)
convert="convert -antialias -background #101D38"
$convert -density 512 -resize 512x512 "$1" "www/res/icon/icon-512.png"
$convert -density 128 -resize 128x128 "$1" "www/res/icon/icon.png"
$convert -density 36 -resize 36x36 "$1" "www/res/icon/android/icon-36-ldpi.png"
$convert -density 72 -resize 72x72 "$1" "www/res/icon/android/icon-72-hdpi.png"
$convert -density 48 -resize 48x48 "$1" "www/res/icon/android/icon-48-mdpi.png"
$convert -density 96 -resize 96x96 "$1" "www/res/icon/android/icon-96-xhdpi.png"
$convert -density 128 -resize 128x128 "$1" "www/res/icon/bada/icon-128.png"
$convert -density 48 -resize 48x48 "$1" "www/res/icon/bada-wac/icon-48-type5.png"
$convert -density 80 -resize 80x80 "$1" "www/res/icon/bada-wac/icon-80-type4.png"
$convert -density 50 -resize 50x50 "$1" "www/res/icon/bada-wac/icon-50-type3.png"
$convert -density 80 -resize 80x80 "$1" "www/res/icon/blackberry/icon-80.png"
$convert -density 29 -resize 29x29 "$1" "www/res/icon/ios/icon-29.png"
$convert -density 40 -resize 40x40 "$1" "www/res/icon/ios/icon-40.png"
$convert -density 50 -resize 50x50 "$1" "www/res/icon/ios/icon-50.png"
$convert -density 57 -resize 57x57 "$1" "www/res/icon/ios/icon-57.png"
$convert -density 58 -resize 58x58 "$1" "www/res/icon/ios/icon-58.png"
$convert -density 72 -resize 72x72 "$1" "www/res/icon/ios/icon-72.png"
$convert -density 76 -resize 76x76 "$1" "www/res/icon/ios/icon-76.png"
$convert -density 80 -resize 80x80 "$1" "www/res/icon/ios/icon-80.png"
$convert -density 100 -resize 100x100 "$1" "www/res/icon/ios/icon-100.png"
$convert -density 144 -resize 144x144 "$1" "www/res/icon/ios/icon-144.png"
$convert -density 114 -resize 114x114 "$1" "www/res/icon/ios/icon-114.png"
$convert -density 120 -resize 120x120 "$1" "www/res/icon/ios/icon-120.png"
$convert -density 152 -resize 152x152 "$1" "www/res/icon/ios/icon-152.png"
$convert -density 64 -resize 64x64 "$1" "www/res/icon/webos/icon-64.png"
$convert -density 48 -resize 48x48 "$1" "www/res/icon/windows-phone/icon-48.png"
$convert -density 173 -resize 173x173 "$1" "www/res/icon/windows-phone/icon-173-tile.png"
$convert -density 62 -resize 62x62 "$1" "www/res/icon/windows-phone/icon-62-tile.png"

$convert -density 128 -resize 128x128 "$1" "www/icon.png"
$convert -density 200 -resize 170x200 "$1" "www/img/logo.png"

convert="convert -antialias -background #101D38 -gravity center"
$convert -resize 512x512 -extent 1280x720 "$1" "www/res/screen/android/screen-xhdpi-landscape.png"
$convert -resize 256x256 -extent 480x800 "$1" "www/res/screen/android/screen-hdpi-portrait.png"
$convert -resize 128x128 -extent 320x200 "$1" "www/res/screen/android/screen-ldpi-landscape.png"
$convert -resize 512x512 -extent 720x1280 "$1" "www/res/screen/android/screen-xhdpi-portrait.png"
$convert -resize 256x256 -extent 320x480 "$1" "www/res/screen/android/screen-mdpi-portrait.png"
$convert -resize 256x256 -extent 480x320 "$1" "www/res/screen/android/screen-mdpi-landscape.png"
$convert -resize 128x128 -extent 200x320 "$1" "www/res/screen/android/screen-ldpi-portrait.png"
$convert -resize 256x256 -extent 800x480 "$1" "www/res/screen/android/screen-hdpi-landscape.png"
$convert -resize 256x256 -extent 480x800 "$1" "www/res/screen/bada/screen-portrait.png"
$convert -resize 128x128 -extent 320x480 "$1" "www/res/screen/bada-wac/screen-type3.png"
$convert -resize 256x256 -extent 480x800 "$1" "www/res/screen/bada-wac/screen-type4.png"
$convert -resize 128x128 -extent 240x400 "$1" "www/res/screen/bada-wac/screen-type5.png"
$convert -resize 256x256 -extent 480x800 "$1" "www/res/screen/bada-wac/screen-type5.png"
$convert -resize 128x128 -extent 225x225 "$1" "www/res/screen/blackberry/screen-225.png"
$convert -resize 256x256 -extent 320x480 "$1" "www/res/screen/ios/screen-iphone-portrait.png"
$convert -resize 256x256 -extent 960x640 "$1" "www/res/screen/ios/screen-iphone-landscape-2x.png"
$convert -resize 256x256 -extent 480x320 "$1" "www/res/screen/ios/screen-iphone-landscape.png"
$convert -resize 512x512 -extent 768x1004 "$1" "www/res/screen/ios/screen-ipad-portrait.png"
$convert -resize 1024x1024 -extent 1536x2008 "$1" "www/res/screen/ios/screen-ipad-portrait-2x.png"
$convert -resize 512x512 -extent 1024x783 "$1" "www/res/screen/ios/screen-ipad-landscape.png"
$convert -resize 256x256 -extent 640x960 "$1" "www/res/screen/ios/screen-iphone-portrait-2x.png"
$convert -resize 1024x1024 -extent 2008x1536 "$1" "www/res/screen/ios/screen-ipad-landscape-2x.png"
$convert -resize 64x64 "$1" "www/res/screen/webos/screen-64.png"
$convert -resize 256x256 -extent 480x800 "$1" "www/res/screen/windows-phone/screen-portrait.jpg"
