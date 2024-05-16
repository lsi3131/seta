from rest_framework import permissions

class AccountVIEWPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return not request.user.is_authenticated
        elif request.method in ['PUT', 'DELETE']:
            return request.user.is_authenticated
        return False