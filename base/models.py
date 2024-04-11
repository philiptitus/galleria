from django.contrib.auth.models import AbstractUser, BaseUserManager, Permission
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken
from notifications.models import Notice
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _





class CustomUserManager(BaseUserManager):
    def email_validator(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError(_("please enter a valid email address"))

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

from django.db import models

class Follower(models.Model):
    user = models.ForeignKey('CustomUser', related_name='followers', default=1, on_delete=models.CASCADE)
    follower = models.ForeignKey('CustomUser', related_name='following_relations', on_delete=models.CASCADE)
    follower_name = models.CharField(max_length=264, null=True, blank=True)
    custom_id = models.IntegerField(null=True, blank=True)

    @property
    def follower_avi(self):
        return self.follower.avi if self.follower else None

    def __str__(self):
        return self.follower.email

    def save(self, *args, **kwargs):
        if self.follower:
            self.follower_name = self.follower.username
            self.custom_id = self.follower.id
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ("user", "follower")


@receiver(post_save, sender=Follower)
def update_following(sender, instance, created, **kwargs):
    if created:
        Following.objects.get_or_create(
            user=instance.follower,
            following=instance.user
        )


class Following(models.Model):
    user = models.ForeignKey('CustomUser', related_name='following', default=1, on_delete=models.CASCADE)
    following = models.ForeignKey('CustomUser', related_name='follower_relations', on_delete=models.CASCADE)
    following_name = models.CharField(max_length=264, null=True, blank=True)
    custom_id = models.IntegerField(null=True, blank=True)
    following_avi = models.ImageField(null=True, blank=True, default='/meganfox.webp')

    def __str__(self):
        return self.following.email
    
    def save(self, *args, **kwargs):
        if self.following:
            self.following_name = self.following.username
            self.custom_id = self.following.id
            self.following_avi = self.following.avi
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ("user", "following")



AUTH_PROVIDERS ={'email':'email', 'google':'google', 'github':'github', 'linkedin':'linkedin'}
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    bio = models.TextField(null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    avi = models.ImageField(null=True, blank=True, default='/avatar.png')
    isPrivate = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    auth_provider=models.CharField(max_length=50, blank=False, null=False, default=AUTH_PROVIDERS.get('email'))


    objects = CustomUserManager()
    user_permissions = models.ManyToManyField(Permission, verbose_name='user permissions', blank=True)

    class Meta(AbstractUser.Meta):
        swappable = 'AUTH_USER_MODEL'

    def __str__(self):
        return self.email
    
    def tokens(self):    
        refresh = RefreshToken.for_user(self)
        return {
            "refresh":str(refresh),
            "access":str(refresh.access_token)
        }

    def get_unread_notification_count(self):
        return Notice.objects.filter(user=self, is_read=False).count()
    

class FollowRequest(models.Model):
    requester = models.ForeignKey(CustomUser, related_name='sent_follow_requests', on_delete=models.CASCADE)
    receiver = models.ForeignKey(CustomUser, related_name='received_follow_requests', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending')
    timestamp = models.DateTimeField(auto_now_add=True)


    @property
    def avi(self):
        return self.requester.avi if self.requester else None
    

    @property
    def name(self):
        return self.requester.email if self.requester else None




    class Meta:
        ordering = ['timestamp']




class Category(models.Model):
    name = models.CharField(max_length=264, null=True, blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


from .validators import *


class Post(models.Model):
    caption = models.CharField(max_length=50)
    description = models.TextField(max_length=264)
    image = models.ImageField(null=True, blank=True,)
    video=models.FileField(validators=[file_size], null=True, blank=True)
    user = models.ForeignKey(CustomUser,  on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now=True)
    isSlice = models.BooleanField(default=False)


    @property
    def user_avi(self):
        return self.user.avi if self.user else None
    

    @property
    def user_name(self):
        return self.user.email if self.user else None



    def __str__(self):
        return self.caption
    


    class Meta:
        ordering = ['-created_date']



class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name = "albums")
    album = models.ImageField( null=True, blank=True)


class Video(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name = "videos")
    video=models.FileField(validators=[file_size])

        




class Like(models.Model):
    liker = models.ForeignKey(CustomUser, related_name='liker',on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now=True)


    @property
    def liker_avi(self):
        return self.liker.avi if self.liker else None
    

    @property
    def liker_name(self):
        return self.liker.username if self.liker else None
    
    class Meta:
        ordering = ['-created_date']



class Bookmark(models.Model):
    booker = models.ForeignKey(CustomUser, related_name='booker',on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now=True)

    @property
    def booker_avi(self):
        return self.booker.avi if self.booker else None
    

    @property
    def booker_name(self):
        return self.booker.username if self.booker else None


    class Meta:
        ordering = ['-created_date']


class Comment(models.Model):
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=True)
    message = models.TextField()
    post = models.ForeignKey(Post,on_delete=models.CASCADE,null=True,blank=True)


    @property
    def comment_avi(self):
        return self.user.avi if self.user else None
    
    @property
    def comment_email(self):
        return self.user.email if self.user else None


    def __str__(self):
        return self.message
    

    class Meta:
        ordering = ['-created_at']




class OneTimePassword(models.Model):
    user=models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    otp=models.CharField(max_length=6)


    def __str__(self):
        return f"{self.user.first_name} - otp code"
