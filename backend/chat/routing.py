# chat/routing.py

from django.urls import path, re_path
from . import consumers
from . import game_consumers

websocket_urlpatterns = [
    re_path(r'^ws/chat/(?P<room_name>[^/]+)/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'^ws/game/(?P<room_name>[^/]+)/$', game_consumers.GameConsumer.as_asgi()),
]