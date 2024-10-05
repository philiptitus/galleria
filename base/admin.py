from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *
from notifications.models import *

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'username', 'is_staff', 'is_active', 'bio', 'date_joined', 'avi', 'display_followers', 'isPrivate', 'is_verified')
    list_filter = ('email', 'username', 'is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal Info', {'fields': ('bio', 'date_joined', 'avi')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'user_permissions', 'isPrivate', 'is_verified')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser', 'isPrivate','user_permissions', 'bio', 'avi', 'is_verified'),
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
admin.site.register(Message)
admin.site.register(Video)
admin.site.register(PostImage)










class FollowerAdmin(admin.ModelAdmin):
    list_display = ('user', 'follower')

admin.site.register(Follower, FollowerAdmin)
