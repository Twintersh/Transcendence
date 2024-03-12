# Use an official Node runtime as a parent image
FROM node:18.17.1

# Set the working directory in the container
WORKDIR /var/www/frontend

# Copy the package.json and package-lock.json files
COPY angular-entrypoint.sh /usr/bin

# Install the Angular CLI globally
RUN chmod 755 /usr/bin/angular-entrypoint.sh

# Start the Angular development server
EXPOSE 4200

ENTRYPOINT ["/usr/bin/angular-entrypoint.sh"]
