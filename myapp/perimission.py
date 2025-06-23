from rest_framework.permissions import BasePermission

class IsRoleAdminOrStaff(BasePermission):
    """
    Allows access to users with role 'admin' or is_staff True.
    """
    def has_permission(self, request, view):
        user = request.user
        return bool(
            user and user.is_authenticated and
            (getattr(user, 'role', None) == 'admin' or user.is_staff)
        )
