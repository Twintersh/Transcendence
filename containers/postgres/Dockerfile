# Use an official Node runtime as a parent image
FROM postgres:latest
RUN apt-get update && apt-get upgrade -y && apt-get install netcat-openbsd -y

RUN chmod 755 ./volumes/db
RUN chmod 755 /var/lib/postgresql/data

STOPSIGNAL SIGTERM