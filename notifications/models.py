from django.db import models
from notifications.pusher import pusher_client


# Create your models here.
class Notification(models.Model):
    NOTIFICATION_TYPES = ((1, 'Server Invitation'), (2, 'Joining Request'))

    to_user = models.ForeignKey('base.CustomUser', on_delete=models.CASCADE, related_name='noti_to_user')
    from_user = models.ForeignKey('base.CustomUser', on_delete=models.CASCADE, related_name='noti_fr_user')
    to_server = models.ForeignKey('base.Post', on_delete=models.CASCADE, related_name='noti_server')
    notification_type = models.IntegerField(choices=NOTIFICATION_TYPES)

from django.db import models
from pusher import pusher_client

class Notice(models.Model):
    NOTIFICATION_TYPES = (
        ('follow', 'Follow Request'),
        ('like', 'Like Notification'),
        ('comment', 'Comment Notification'),
        ('chat', 'Chat Notification'),
        ('account', 'Account Notification'),
        # Add other types as needed
    )

    user = models.ForeignKey('base.CustomUser', on_delete=models.CASCADE)
    message = models.TextField(default='Default message')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default="like")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_read = models.BooleanField(default=False)

    # Add other fields as needed

    def __str__(self):
        return f'{self.user.username} - {self.message}'

    def save(self, *args, **kwargs):
        
        super().save(*args, **kwargs)

        # Trigger Pusher after saving the notice



from django.db.models import Q


class Message(models.Model):
    sender = models.ForeignKey('base.CustomUser', on_delete=models.CASCADE, related_name='sent_messages',blank=True, null=True)
    receiver = models.ForeignKey('base.CustomUser', on_delete=models.CASCADE, related_name='received_messages', blank=True, null=True)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)

    @property
    def name(self):
        return self.sender.username if self.sender else None

    @classmethod
    def get_unread_count(cls, user1, user2):
        """
        Get the total number of unread messages between two users.
        """
        unread_count = cls.objects.filter(
            Q(sender=user1, receiver=user2, is_read=False) |
            Q(sender=user2, receiver=user1, is_read=False)
        ).count()
        return unread_count

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f'{self.sender} to {self.receiver}: {self.content}'
