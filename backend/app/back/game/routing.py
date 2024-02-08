from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/game/(?P<game>[0-9a-f-]+)/$", consumers.PlayerConsumer.as_asgi()),
    re_path(r"ws/game/queue/", consumers.QueueManager.as_asgi()),
]
