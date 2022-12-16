#!/bin/ash

if [ -n "$RCON_PASSWORD" ]; then
    source ./.scripts/rcon-restart.sh
elif [ -n "$FTP_STRING" ]; then
    $($FTP_STRING)
else
    echo "No Mod Restart Configured"
fi
