FROM php:8.2-apache

# PHP needs mysqli to talk to MySQL
RUN docker-php-ext-install mysqli

# Production settings: PHP warnings are logged instead of printed into the JSON
RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Only the API goes into the web folder
COPY api/ /var/www/html/api/