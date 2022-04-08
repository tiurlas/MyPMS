#!/bin/bash

__IP="$1"
__USER="$2"
__PASSWD="$3"
__PORT="$4"
SIAB="/usr/local/shellBox/bin/shellinaboxd"
SP="/usr/local/bin/sshpass"
NETST="/bin/netstat"
GREP="/bin/grep"
WC="/usr/bin/wc"
SUDO="/usr/bin/sudo"
FREE=`$NETST -na |$GREP -w $__PORT |$WC -l`

while [ $FREE -ne 0 ]; do
    FREE=`$NETST -na |$GREP -w $__PORT |$WC -l`
    __PORT=`expr $__PORT + 1`
    if [ $__PORT == "42100" ]; then
        __PORT="42000"
    fi
done

__PID="/tmp/SIAB_$__PORT.pid"

CMD="$SIAB -t -s /:LOGIN -s /conn:apache:apache:/:\"$SP -p '$__PASSWD' ssh -o 'StrictHostKeyChecking no' $__USER@$__IP\" --port=$__PORT --css=/usr/local/shellBox/bin/white-on-black.css --background=$__PID"

echo $CMD |xargs nohup $SUDO

echo "$__PORT"