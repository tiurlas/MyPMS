#!/usr/bin/ksh

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
KSTAT=`chkPath "kstat"`
NTSTAT=`chkPath "netstat"`
GREP=`chkPath "grep"`
AWK=`chkPath "awk"`
IFCONF=`chkPath "ifconfig"`
PINFO=`chkPath "psrinfo"`
SORT=`chkPath "sort"`
HEAD=`chkPath "head"`
TAIL=`chkPath "tail"`
PCONF=`chkPath "prtconf"`
PDIAG=`chkPath "prtdiag"`
CUT=`chkPath "cut"`
IOSTAT=`chkPath "iostat"`
WC=`chkPath "wc"`
SWAP=`chkPath "swap"`
BC=`chkPath "bc"`
UNAME=`chkPath "uname"`

### Set default delimiter back
unset IFS

case "$1" in
        "sys")
            echo `$UNAME -srv`
            ;;
        "nic")
            NIC=`$KSTAT -p :::link* |$GREP duplex |$AWK -F: '{print $1}' |$SORT -u`
            for nic in $NIC; do
                c=0
                while [[ $c -le 15 ]]; do
                  tmp=`$IFCONF $nic$c 2>/dev/null |$GREP inet |$AWK '{print $2}'`
                  if [ ! -z $tmp ]; then
                    tmpMAC=`$NTSTAT -pn |$GREP SP |$GREP $nic$c |$AWK '{print $5}' | $SORT -u`
                    echo $nic$c"&"$tmp"&"$tmpMAC
                  fi
                  i=1
                  while [[ $i -lt 10 ]]; do 
                    tmp=`$IFCONF $nic$c:$i 2>/dev/null |$GREP inet |$AWK '{print $2}'`
                    if [ ! -z $tmp ]; then
                      echo $nic$c:$i"&"$tmp
                    fi
                    i=`expr $i + 1`
                  done
                c=`expr $c + 1`
                done
            done
            ;;
    
    "cpuphy")
        echo `$PINFO 2> /dev/null -p`
        ;;
    
    "cpu")
        if [ `uname -r` == "5.9" ]; then
          cpuTmp=`$PINFO 2> /dev/null -v |$GREP operates |$AWK '{print $6}' |sort -u |$HEAD -n 1`
        else
          cpuTmp=`$PINFO 2> /dev/null -pv |$GREP clock |$AWK '{print $9}' |$SORT -u |$HEAD -n 1`
        fi
        if [ "$cpuTmp" == "" ]; then
          cpuTmp=`$PDIAG 2> /dev/null |$GREP MHz |$TAIL -1 |$AWK '{print $2}'`
        fi
        echo "$cpuTmp MHz"
        ;;
    
    "mem")
        tmem=`$PCONF 2> /dev/null |$GREP "Memory size" |$CUT -d ":" -f 2 |$AWK '{print $1}'`
        if [ $tmem -ge 1024 ]; then
          echo `expr $tmem / 1024`GB
        else
          echo $tmemMB
        fi
        ;;
    
    "dsk")
        DISK=`$IOSTAT -E |$GREP Size |$GREP -vw "0 bytes" |$AWK -F: '{print $2}' |$AWK '{print $1}' |$SORT -u`
        for dsk in $DISK; do
          qdsk=`$IOSTAT -E |$GREP Size |$GREP -vw "0 bytes" |$AWK -F: '{print $2}' |$AWK '{print $1}' |$GREP $dsk |$WC -l`
          echo $qdsk"x"$dsk
        done
        ;;
    
    "swap")
        t=`$SWAP -l |awk '{print $4}' |$GREP -v blocks`
        x=`echo "($t * 0.000000477)" |$BC`
        echo $x |$AWK -F. '{i=$1;f=$2; if (substr(f,1,1) >= 5)  print i+1"GB"; else print i"GB"}'
        ;;    
esac