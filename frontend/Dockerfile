# Stage 1: Build Angular Application
FROM node:18.17.1 AS build
WORKDIR /app
COPY ./angular .
RUN npm install
RUN npm run build --prod

# Stage 2: Setup NGINX
FROM nginx:alpine
COPY --from=build /app/dist/* /usr/share/nginx/html/
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]