"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
import chat.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})

# application = ProtocolTypeRouter({
#     'http': get_asgi_application(),
#     # (http->django views is added by default)
#     # 만약에 websocket protocol 이라면, AuthMiddlewareStack
#     'websocket': AllowedHostsOriginValidator(
#         AuthMiddlewareStack(URLRouter(chat.routing.websocket_urlpatterns))
#         # URLRouter 로 연결, 소비자의 라우트 연결 HTTP path를 조사
#     ),
# })