# chat/routing.py

from django.urls import path, re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'^ws/chat/(?P<room_name>[^/]+)/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'^ws/draw/(?P<room_name>[^/]+)/$', consumers.DrawConsumer.as_asgi()),
]