#!/bin/sh
if [ "$DB_NAME" = "transcendence" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

python manage.py flush --no-input
python manage.py makemigrations
python manage.py makemigrations users
python manage.py migrate

# python manage.py runserver 0.0.0.0:8000
daphne -e ssl:8000:privateKey=./ssl/nginx.key:certKey=./ssl/nginx.crt back.routing:application
