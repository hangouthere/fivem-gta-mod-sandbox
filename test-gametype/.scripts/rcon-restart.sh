#!/bin/ash

(rcon -c 'restart test-gametype' localhost:30120 $RCON_PASSWORD > /dev/null || echo 'Failed to connect to RCON') \
    && echo '~~~ Restarted Resource via RCON'
