from django.urls import path

from . import views

urlpatterns = [
	path("getRoomName/", views.getRoomName, name="getRoomName"),
]
