from django.core.asgi import get_asgi_application
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "back.settings")
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
import chat.routing
import game.routing
from .middlewares import TokenAuthMiddleWare


application = ProtocolTypeRouter(
	{
		"http": django_asgi_app,
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