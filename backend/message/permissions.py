from rest_framework import permissions

class MessageAccessPermission(permissions.BasePermission):
    def has_permission(self, request, message):
        if message.sender == request.user or message.recipient == request.user:
            return True
        return False