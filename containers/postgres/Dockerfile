# Use an official Node runtime as a parent image
FROM postgres:latest
RUN apt-get update && apt-get upgrade -y && apt-get install netcat-openbsd -y
STOPSIGNAL SIGTERM