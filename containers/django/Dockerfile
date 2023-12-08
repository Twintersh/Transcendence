# Use an official Node runtime as a parent image
FROM python:3.8

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

# Start the Django development server
EXPOSE 8000

ENTRYPOINT ["/usr/bin/django-entrypoint.sh"]
