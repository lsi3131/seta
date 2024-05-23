from rest_framework import permissions

class MessageAccessPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.sender == request.user or obj.recipient == request.user