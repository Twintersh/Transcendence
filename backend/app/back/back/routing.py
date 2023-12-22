from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter
from channels.security.websocket import AllowedHostsOriginValidator
from game.consumers import GameConsumer

import chat.routing
import game.routing
from django.core.asgi import get_asgi_application

application = ProtocolTypeRouter(
	{
		"http": get_asgi_application(),
		"websocket": AllowedHostsOriginValidator(
			AuthMiddlewareStack(
				URLRouter(
					chat.routing.websocket_urlpatterns +
					game.routing.websocket_urlpatterns
				)
			),
		),
		"channel": ChannelNameRouter(
			{
				"game_consumer": GameConsumer.as_asgi(),
			}
		),
	}
)