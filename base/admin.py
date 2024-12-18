from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *
from notifications.models import *

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

# base/admin.py
from django.contrib import admin
from django.contrib.admin import helpers
from django.contrib.messages import constants as messages
from django.core.exceptions import PermissionDenied
from django.shortcuts import render

# ... (other imports)
class MessageAdmin(admin.ModelAdmin):
    actions = ['delete_messages']
    model = Message

    def delete_messages(self, request, queryset):
        if not self.has_delete_permission(request):
            raise PermissionDenied

        if request.POST.get('post'):
            for obj in queryset:
                # First, try to find and delete related Notice objects
                try:
                    notice = Notice.objects.get(message=obj)
                    notice.delete()
                except Notice.DoesNotExist:
                    pass  # No Notice to delete
                obj.delete()

            self.message_user(request, f"Successfully deleted {queryset.count()} message(s).", messages.SUCCESS)
            return None  # Prevents the default delete action from running

        opts = self.model._meta

        if len(queryset) == 1:
            objects_name = opts.verbose_name
        else:
            objects_name = opts.verbose_name_plural

        context = {
            **self.admin_site.each_context(request),
            'title': f"Are you sure?",
            'objects_name': objects_name,
            'queryset': queryset,
            'opts': opts,
            "action_checkbox_name": helpers.ACTION_CHECKBOX_NAME,
            'media': self.media,
        }

        return render(
            request,
            'admin/delete_confirmation.html',  # Use the default confirmation template
            context,
        )

admin.site.register(Message, MessageAdmin)

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'username', 'auth_provider', 'is_staff', 'is_active', 'is_tutorial', 'bio', 'date_joined', 'avi', 'display_followers', 'isPrivate', 'is_verified')
    list_filter = ('email', 'username', 'is_staff', 'is_active', 'auth_provider',)
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal Info', {'fields': ('bio', 'date_joined', 'avi', 'auth_provider')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'user_permissions', 'isPrivate', 'is_verified', 'is_tutorial')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser', 'is_tutorial', 'isPrivate', 'user_permissions', 'bio', 'avi', 'auth_provider', 'is_verified'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)
    readonly_fields = ('date_joined',)  # Make date_joined non-editable

    def display_followers(self, obj):
        return ", ".join([follower.user.username for follower in obj.followers.all()])

    display_followers.short_description = 'Followers'

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Category)
admin.site.register(Following)
admin.site.register(Post)
admin.site.register(Like)
admin.site.register(Bookmark)
admin.site.register(Comment)
admin.site.register(FollowRequest)
admin.site.register(Notice)
admin.site.register(Video)
admin.site.register(OneTimePassword)
admin.site.register(PostImage)

class FollowerAdmin(admin.ModelAdmin):
    list_display = ('user', 'follower')

admin.site.register(Follower, FollowerAdmin)
