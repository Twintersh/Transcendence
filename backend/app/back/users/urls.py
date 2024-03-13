from django.urls import re_path
from . import views


urlpatterns = [
    re_path('login/', views.login),
    re_path('callback', views.callback, name="callback"),
    re_path('signup/', views.signup),
    re_path('updateCredential/', views.updateCredential),
    re_path('logout', views.logout),
    re_path('getUserInfoById', views.getUserInfoById),
	re_path('getUserInfo', views.getUserInfo, name="getUserInfo"),
    re_path('getUserAvatar', views.getUserAvatar),
    re_path('getUserMatches', views.getUserMatches),
    re_path('sendFriendRequest/', views.sendFriendRequest),
    re_path('acceptFriendRequest/', views.acceptFriendRequest),
    re_path('getSentRequests/', views.getSentFriendRequests),
    re_path('getReceivedRequests', views.getReceivedFriendRequests),
    re_path('getUserFriends/', views.getUserFriends),
    re_path('getBlockedUsers/', views.getBlockedUsers),
    re_path('blockUser/', views.blockUser),
    re_path('unBlockUser/', views.unBlockUser),
    re_path('uploadAvatar/', views.uploadAvatar),
    re_path('isAuth/', views.isAuth)
]