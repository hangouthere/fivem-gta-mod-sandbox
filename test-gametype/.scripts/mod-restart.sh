#!/bin/ash

if [ -n "$RCON_PASSWORD" ]; then
    source ./.scripts/rcon-restart.sh
elif [ -n "$MOD_UPDATE_EXEC" ]; then
   sh -c "${MOD_UPDATE_EXEC}"
else
    echo "No Mod Restart Configured"
fi
