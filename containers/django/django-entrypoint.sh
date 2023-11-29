#! /bin/bash

echo Starting Django app
echo Starting Migrations
python manage.py makemigrations
python manage.py migrate
echo Migrations Done
echo Starting Django Server
python3 manage.py runserver 0.0.0.0:8000