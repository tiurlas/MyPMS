#!/bin/bash

__PORT="$1"
SUDO="/usr/bin/sudo"
__PID="/tmp/SIAB_$__PORT.pid"
__PROCESS=`cat $__PID`
KILL="/bin/kill"
RM="/bin/rm"

$KILL $__PROCESS
if [ $? -eq 0 ]; then
    K=0
fi

$RM -f $__PID
if [ $? -eq 0 ]; then
    R=0
fi

echo $K$R