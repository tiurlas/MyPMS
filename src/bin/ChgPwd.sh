#!/bin/bash

# Verifica numero de argumentos
if [ ! $# -eq 4 ]; then
  echo "Uso: $0 <hostname> <user> <old pass> <new pass>"
  exit 1
fi

# Dados para conectar
__HOSTNAME="$1"
__USER="$2"
__OLDPWD="$3"
__NEWPWD="$4"

/usr/bin/expect<<EOF
  log_user 0
  exp_internal 0
  set timeout 5

  spawn ssh -o StrictHostKeyChecking=no $__USER@$__HOSTNAME
  expect {
    -re "(P|p)assword: " { send "$__OLDPWD\r" }
    -re ".*Connection refused.*" { puts "Connection Refused"; exit 10 }
    -re ".*Connection closed" { puts "Connection Closed"; exit 11 }
    -re "no address.*" { puts "Failed to reach host"; exit 12 }
    -re ".*not known" { puts "Hostname unknown"; exit 13 }
  }

  match_max [expr 32 * 1024]

  expect -re ".*Your password has expired." {
    expect "*?ld*" { send -- "$__OLDPWD\r" }
    expect "?ew*?assword" { send -- "$__NEWPWD\r" }
    expect "?ew*?assword" { send -- "$__NEWPWD\r" }
    expect eof {
      catch wait rc
        set exit_status [lindex $rc 3]
      }
    exit $exit_status
  }
  
  expect -re "(P|p)assword: " { puts "Current password do not match!"; exit 14 }
      
  expect {
    -re ".*\>" { send -- "uname -s\r" }
    -re ".*\$" { send -- "uname -s\r" }
    -re ".*\#" { send -- "uname -s\r" }
    -re ".*\%" { send -- "uname -s\r" }
    timeout { puts "No prompt available!"; exit 15 }
  }

  expect {
    -re "AIX" {
      send -- "passwd $__USER\r"
      expect "*?ld*" { send -- "$__OLDPWD\r" }
      expect "?ew*?assword" { send -- "$__NEWPWD\r" }
      expect "?ew*?assword" { send -- "$__NEWPWD\r" }
      expect eof {
        catch wait rc
        set exit_status [lindex $rc 3]
      }
      exit $exit_status
    }
    -re "Linux" {
      send -- "passwd\r"
      expect "*?ld*" { send -- "$__OLDPWD\r" }
      expect "*current*" { send -- "$__OLDPWD\r" }
      expect "?ew*?assword" { send -- "$__NEWPWD\r" }
      expect "?ew*?assword" { send -- "$__NEWPWD\r" }
      expect eof {
        catch wait rc
        set exit_status [lindex $rc 3]
      }
      exit $exit_status
    }
    -re "SunOS" {
      send -- "passwd $__USER\r"
      expect "*exist*" { send -- "$__OLDPWD\r" }
      expect "?ew*?assword" { send -- "$__NEWPWD\r" }
      expect "?ew*?assword" { send -- "$__NEWPWD\r" }
      expect eof {
        catch wait rc
        set exit_status [lindex $rc 3]
      }
      exit $exit_status
    }
    timeout { puts "Connection time out"; exit 16 }
  } 
EOF