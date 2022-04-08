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

echo "Executando entrypoint"

/usr/local/bin/docker-php-entrypoint
/usr/local/bin/apache2-foreground

echo "Definindo permissões"

chown www-data:www-data /var/www/html
chmod -R 777 /var/www/html/

/bin/bash
