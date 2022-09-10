#!/bin/sh

PREFIX="[PEFCL]"
RESOURCE="pefcl"

echo "$PREFIX Creating pre-release"
## Create temporary folder and move files into it. Keeping same structure according to fxmanifest.lua
mkdir -p ./temp/$RESOURCE/src/client
mkdir -p ./temp/$RESOURCE/web
cp LICENSE README.md config.json import.sql fxmanifest.lua ./temp/$RESOURCE
cp -r ./src/dist ./temp/$RESOURCE/src/dist # Copy resource files
cp -r ./src/client/lua/ ./temp/$RESOURCE/src/client/lua # Copy Lua files
cp -r ./web/dist ./temp/$RESOURCE/web/dist # Copy web files

echo "$PREFIX Zipping it up: $RESOURCE-pre-$GITHUB_SHA_SHORT.zip"

cd temp && zip -r $RESOURCE-pre-$GITHUB_SHA_SHORT.zip ./$RESOURCE
