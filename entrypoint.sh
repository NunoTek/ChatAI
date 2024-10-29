#!/bin/sh
SERVER_JSON=`jq -n 'env | with_entries (select(.key | startswith("SERVER_")))'`
echo "writting server/settings.json with values : $SERVER_JSON"
echo "$SERVER_JSON" > /app/settings.json

WEB_JSON=`jq -n 'env | with_entries (select(.key | startswith("WEB_")))'`
echo "writting web/settings.json with values : $WEB_JSON"
echo "$WEB_JSON" > /app/web/settings.json

node server.js
