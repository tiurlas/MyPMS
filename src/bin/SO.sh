#!/bin/bash

if [ $# -ne 3 ]; then
  echo "Uso: $0 username hostname password"
  exit 1
fi

/usr/local/bin/sshpass -p $3 ssh -q -o StrictHostKeyChecking=no $1@$2 uname -s 2> /dev/null