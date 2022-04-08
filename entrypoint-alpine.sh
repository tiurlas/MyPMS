#!/bin/bash

echo "Configurando conexão com Banco de Dados"

CONFIG1=/var/www/html/mypms/db/doConn.php
CONFIG2=/var/www/html/mypms/index.php

# Configurando remedydb.php
sed -i "s,HOSTBANCO,$DBHOST,g" ${CONFIG1}
sed -i "s,NOMEBANCO,$DBNAME,g" ${CONFIG1}
sed -i "s,USERBANCO,$DBUSER,g" ${CONFIG1}
sed -i "s,SENHABANCO,$DBPASS,g" ${CONFIG1}

sed -i "s,SUPBARLINK,$SUPBARLINK,g" ${CONFIG2}

/usr/sbin/apachectl  -D   FOREGROUND

/bin/bash
