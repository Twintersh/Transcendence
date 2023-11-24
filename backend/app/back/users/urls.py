from django.urls import re_path, include
from .views import *

urlpatterns = [
    re_path('login/', login),
    re_path('signup/', signup),
    re_path('test_token/', test_token),
    re_path('updateCredential/', updateCredential),
    re_path('logout', logout),
    re_path('getUserMatches', getUserMatches),
    re_path('createMatch/', createMatch)
]
