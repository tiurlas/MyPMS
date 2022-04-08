FROM php:5.6-apache
MAINTAINER Gabriel Guimarães Correa <spgabriel08@hotmail.com>

RUN docker-php-ext-install mysql && \
    docker-php-ext-install mysqli && \	
    docker-php-ext-install pdo && \
    docker-php-ext-install pdo_mysql

RUN apt-get update -qqy && \
    apt-get install -y ldap-utils libldap2-dev && \
    rm -rf /var/lib/apt/lists/* && \
    docker-php-ext-configure ldap --with-libdir=lib/x86_64-linux-gnu/ && \
    docker-php-ext-install ldap && \
    rm -rf /var/lib/apt/lists/*

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf    
    
ADD src/ /var/www/html/mypms/

COPY entrypoint.sh /opt/run

WORKDIR /var/www/html/mypms

EXPOSE 80

ENTRYPOINT ["/opt/run"]


