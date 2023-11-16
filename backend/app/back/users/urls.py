from django.urls import re_path, include
from .views import *

urlpatterns = [
    re_path('login/', login),
    re_path('signup/', signup),
    re_path('test_token/', test_token),
    re_path('updatePassword/', updatePassword),
    re_path('logout', logout)
]
