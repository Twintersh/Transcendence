from .middlewares import TokenAuthMiddleWare
from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter
from channels.security.websocket import AllowedHostsOriginValidator

import chat.routing
import game.routing
from django.core.asgi import get_asgi_application

application = ProtocolTypeRouter(
	{
		"http": get_asgi_application(),
		"websocket": AllowedHostsOriginValidator(
			TokenAuthMiddleWare(
				URLRouter(
					chat.routing.websocket_urlpatterns +
					game.routing.websocket_urlpatterns
				)
			),
		)
	}
)
