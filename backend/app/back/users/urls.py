from django.urls import re_path, include
from .views import *


urlpatterns = [
    re_path('login/', login),
    re_path('signup/', signup),
    re_path('updateCredential/', updateCredential),
    re_path('logout', logout),
    re_path('getUserInfo', getUserInfo),
	re_path('getUserAvatar', getUserAvatar),
    # re_path('getUserMatches', getUserMatches),
    # re_path('createMatch/', createMatch),
    re_path('sendFriendRequest/', sendFriendRequest),
    re_path('acceptFriendRequest/', acceptFriendRequest),
    re_path('getSentRequests/', getSentFriendRequests),
    re_path('getReceivedRequests', getReceivedFriendRequests),
    re_path('getUserFriends/', getUserFriends),
    re_path('uploadAvatar/', uploadAvatar),
	re_path('isAuth/', isAuth)
]
