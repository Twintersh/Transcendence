# Use an official Node runtime as a parent image
FROM python:3.8

# Set the working directory in the container
WORKDIR /var/www/backend

# Copy the package.json and package-lock.json files
COPY django-entrypoint.sh /usr/bin

# Copy the requirements file to the container
COPY ./requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Start the Angular development server
EXPOSE 8000

ENTRYPOINT ["django-entrypoint.sh"]