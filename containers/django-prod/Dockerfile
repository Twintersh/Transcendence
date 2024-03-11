# Use an official Node runtime as a parent image
FROM python:3.8

RUN apt-get update && apt-get upgrade -y && apt-get install netcat-openbsd -y

# Set the working directory in the container
WORKDIR /var/www/backend

# 
COPY django-entrypoint.sh /usr/bin

# 
RUN chmod 755 /usr/bin/django-entrypoint.sh

# Copy the requirements file to the container
COPY ./requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install -U 'Twisted[tls,http2]'
#  Start the Django development server
EXPOSE 8000

ENV DJANGO_SETTINGS_MODULE=back.settings

CMD daphne -e ssl:port=8000:privateKey=./ssl/nginx.key:certKey=./ssl/nginx.crt back.routing:application

ENTRYPOINT ["/usr/bin/django-entrypoint.sh"]
