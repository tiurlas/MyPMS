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
LSDEV=`chkPath lsdev`
LSCONF=`chkPath lsconf`
ENTSTAT=`chkPath entstat`
GETCONF=`chkPath getconf`
OSLEVEL=`chkPath oslevel`

### Set default delimiter back
unset IFS

case "$1" in
        "sys")
            o=`$UNAME -s`; r=`$OSLEVEL -s`
            echo $o $r
            ;;
        "nic")
            NIC=`$LSDEV -Cc if |$AWK '{print $1}' |$GREP -v lo`
            for nic in $NIC; do
                tmp=`$IFCONF $nic 2>/dev/null |$GREP -w inet |$AWK '{print $2}' |$HEAD -n 1`
                if [ ! -z $tmp ]; then
                  tmpMAC=`$ENTSTAT $nic |$GREP "Hardware Address" |$AWK '{print $3}'`
                  echo $nic$c"&"$tmp"&"$tmpMAC
                fi
                i=1
                while [[ $i -lt 10 ]]; do 
                  tmp=`$IFCONF $nic:$i 2>/dev/null |$GREP -w inet |$AWK '{print $2}' |$HEAD -n 1`
                  if [ ! -z $tmp ]; then
                    echo $nic:$i"&"$tmp
                  fi
                  i=`expr $i + 1`
                done
            done
            ;;
    
    "cpuphy")
        echo `$LSCONF 2> /dev/null |$GREP Processors |$CUT -d ":" -f 2`
        ;;
    
    "cpu")
        echo `$LSCONF 2> /dev/null |$GREP Speed |$CUT -d ":" -f 2`
        ;;
    
    "mem")
        tmem=`$LSCONF 2> /dev/null |$GREP "^Memory Size" |$CUT -d ":" -f 2 |$AWK '{print $1}'`
        if [ $tmem -ge 1024 ]; then
          echo `expr $tmem / 1000`"GB"
        else
          echo $tmem"MB"
        fi
        ;;
    
    "dsk")
        for dsk in `$LSCONF |$GREP active |$AWK '{print $1}'`; do
            tdsk=`$GETCONF DISK_SIZE /dev/$dsk`
            expr $tdsk / 1000 >>/tmp/$$.tmp
        done
        for i in `cat /tmp/$$.tmp |sort -u`; do
            x=`$GREP $i /tmp/$$.tmp |$WC -l`
            echo $x"x"$i"GB"
        done
        rm -f /tmp/$$.tmp
        ;;
    
    "swap")
        t=`lsconf |grep "Total Paging Space" |awk -F":" '{print $2}' |tr -d ' '`
        echo $t
        ;;    
esac