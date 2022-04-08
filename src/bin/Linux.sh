#!/bin/bash

### Options for PATH
optPATH="/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:/opt/freeware/bin:/usr/sfw/bin"

### Change default delimiter
export IFS=":"

### Function that looks for an App PATH
chkPath() {
  for dir in $optPATH; do
    if [ -x $dir/$1 ]; then
      echo "$dir/$1"
      break;
    fi
  done
}

### Set Apps var
NTSTAT=`chkPath "netstat"`
GREP=`chkPath "grep"`
AWK=`chkPath "awk"`
IFCONF=`chkPath "ifconfig"`
SORT=`chkPath "sort"`
HEAD=`chkPath "head"`
CUT=`chkPath "cut"`
WC=`chkPath "wc"`
SWAP=`chkPath "swap"`
BC=`chkPath "bc"`
UNAME=`chkPath "uname"`
SWAPON=`chkPath swapon`

### Set default delimiter back
unset IFS

case "$1" in
        "sys")
            echo `$UNAME -sr`
            ;;
        "nic")
            NIC=`cat /proc/net/dev |$GREP ":" |$GREP -v "lo" |$GREP -v "tun" |$AWK -F: '{print $1}'`
            for nic in $NIC; do
                if [ "`$IFCONF $nic 2>/dev/null |$GREP -w inet |$GREP -w addr`" == "" ]; then
                  tmp=`$IFCONF $nic 2>/dev/null |$GREP -w inet |$AWK '{print $2}'`
                else
                  tmp=`$IFCONF $nic 2>/dev/null |$GREP -w inet |$AWK -F":" '{print $2}' |$AWK '{print $1}'`
                fi
                if [ ! -z $tmp ]; then
                  if [ "`$IFCONF $nic 2>/dev/null |$GREP HWaddr`" == "" ]; then
                    tmpMAC=`$IFCONF $nic 2>/dev/null |$GREP ether |$AWK '{print $2}'`
                  else
                    tmpMAC=`$IFCONF $nic 2>/dev/null |$GREP HWaddr |$AWK '{print $5}'`
                  fi
                  echo $nic$c"&"$tmp"&"$tmpMAC
                fi
                i=1
                while [[ $i -lt 10 ]]; do
                  if [ "`$IFCONF $nic 2>/dev/null |$GREP -w inet |$GREP -w addr`" == "" ]; then
                    tmp=`$IFCONF $nic:$i 2>/dev/null |$GREP -w inet |$AWK '{print $2}'`
                  else
                    tmp=`$IFCONF $nic:$i 2>/dev/null |$GREP -w inet |$AWK -F":" '{print $2}' |$AWK '{print $1}'`
                  fi
                  if [ ! -z $tmp ]; then
                    echo $nic:$i"&"$tmp
                  fi
                  i=`expr $i + 1`
                done
            done
            ;;
    
    "cpuphy")
        t=`cat /proc/cpuinfo |$GREP "physical id" |$SORT -u |$WC -l`
        if [ $t -eq 0 ]; then
            t=`cat /proc/cpuinfo |$GREP -w "processor" |$WC -l`
        fi
        echo $t
        ;;
    
    "cpu")
        echo `$GREP "MHz" /proc/cpuinfo |$CUT -d ":" -f 2 |$HEAD -n 1` MHz
        ;;
    
    "mem")
        tmem=`$GREP MemTotal /proc/meminfo |$CUT -d ":" -f 2 |$AWK '{print $1}'`
        if [ $tmem -ge 1024 ]; then
          echo `expr $tmem / 1000 / 1000`GB
        else
          echo `expr $tmem / 1000`MB
        fi
        ;;
    
    "dsk")
        for dsk in `ls /sys/block/sd*/size 2> /dev/null; ls /sys/block/hd*/size 2> /dev/null; ls /sys/block/cc*/size 2> /dev/null`; do
            tdsk=`cat $dsk`
            echo "$tdsk / 1.86 / 1024 / 1024" |$BC >>/tmp/$$.tmp
        done
        for i in `cat /tmp/$$.tmp |sort -u`; do
            x=`$GREP $i /tmp/$$.tmp |$WC -l`
            echo $x"x"$i"GB"
        done
        rm -f /tmp/$$.tmp
        ;;
    
    "swap")
        t=`$SWAPON -s |$GREP -v "Type" |$AWK '{print $3}'`
        x=`echo "($t / 1000 / 1000)" |$BC`
        echo $x"GB"
        ;;    
esac