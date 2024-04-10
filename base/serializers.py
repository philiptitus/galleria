from rest_framework import serializers
from .models import CustomUser as Userr
from .models import *
from rest_framework_simplejwt.tokens import RefreshToken
import json
from dataclasses import field
from rest_framework import serializers
from string import ascii_lowercase, ascii_uppercase
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .utils import *
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework import serializers
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from .utils import *


class GoogleSignInSerializer(serializers.Serializer):
    access_token=serializers.CharField(min_length=6)


    def validate_access_token(self, access_token):
        user_data=Google.validate(access_token)
        try:
            user_data['sub']
            
        except:
            raise serializers.ValidationError("this token has expired or invalid please try again")
        
        if user_data['aud'] != settings.GOOGLE_CLIENT_ID:
                raise AuthenticationFailed('Could not verify user.')

        user_id=user_data['sub']
        email=user_data['email']
        first_name=user_data['given_name']
        last_name=user_data['family_name']
        provider='google'

        return register_social_user(provider, email, first_name, last_name)


class GithubLoginSerializer(serializers.Serializer):
    code = serializers.CharField()

    def validate_code(self, code):   
        access_token = Github.exchange_code_for_token(code)

        if access_token:
            user_data=Github.get_github_user(access_token)

            full_name=user_data['name']
            email=user_data['email']
            names=full_name.split(" ")
            firstName=names[1]
            lastName=names[0]
            provider='github'
            return register_social_user(provider, email, firstName, lastName)


class LikeSerializer(serializers.ModelSerializer):

    liker_avi = serializers.ImageField(read_only=True)
    liker_name = serializers.CharField(read_only=True)
    class Meta:
        model = Like
        fields = '__all__'


class FollowRequestSerializer(serializers.ModelSerializer):
    avi = serializers.ImageField(read_only=True)
    name = serializers.CharField(read_only=True)
    class Meta:
        model = FollowRequest
        fields = '__all__'


# Change FolllowingSerializer to FollowingSerializer
class BookmarkSerializer(serializers.ModelSerializer):

    booker_avi = serializers.ImageField(read_only=True)
    booker_name = serializers.CharField(read_only=True)
    class Meta:
        model = Bookmark
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    comment_avi = serializers.ImageField(read_only=True)
    comment_email = serializers.CharField(read_only=True)


    class Meta:
        model = Comment
        fields = '__all__'



class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = '__all__' 


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__' 





class PostSerializer(serializers.ModelSerializer):
    albums = PostImageSerializer(many=True, read_only=True)
    videos = VideoSerializer(many=True, read_only=True)



    uploaded_albums = serializers.ListField(
        child = serializers.ImageField(max_length = 1000000, allow_empty_file = False, use_url = False),
        write_only=True)
    bookers = serializers.SerializerMethodField(read_only=True)
    likers = serializers.SerializerMethodField(read_only=True)
    comments = serializers.SerializerMethodField(read_only=True)
    total_bookmarks = serializers.SerializerMethodField(read_only=True)
    total_likes = serializers.SerializerMethodField(read_only=True)
    total_comments = serializers.SerializerMethodField(read_only=True)
    user_avi = serializers.ImageField(read_only=True)
    user_name = serializers.CharField(read_only=True)




    class Meta:
        model = Post
        fields = '__all__' 





    def create(self, validated_data):
        uploaded_albums = validated_data.pop("uploaded_albums")
        post = Post.objects.create(**validated_data)
        for album in uploaded_albums:
            newpost_album = PostImage.objects.create(post=post, album=album)
        return post
        

        
        

    def get_bookers(self, obj):
        bookers = obj.bookmark_set.all()
        serializer = BookmarkSerializer(bookers, many=True)
        return serializer.data

    
    def get_likers(self, obj):
        likers = obj.like_set.all()
        serializer = LikeSerializer(likers, many=True)
        return serializer.data
    
    def get_comments(self, obj):
        comments = obj.comment_set.all()
        serializer = CommentSerializer(comments, many=True)
        return serializer.data

    
    def get_total_bookmarks(self, obj):
        return obj.bookmark_set.count()

    def get_total_likes(self, obj):
        return obj.like_set.count()
    
    def get_total_comments(self, obj):
        return obj.comment_set.count()
         # Update with actual fields from the Product model
# Change FolllowersSerializer to FollowersSerializer
    










class FollowersSerializer(serializers.ModelSerializer):
    follower_avi = serializers.ImageField(read_only=True)

    class Meta:
        model = Follower
        fields = ['user', 'follower', 'follower_name', 'custom_id', 'follower_avi']

# Change FolllowingSerializer to FollowingSerializer
class FollowingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Following
        fields = ['following_name','custom_id','following_avi']


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    bio = serializers.SerializerMethodField(read_only=True)
    date_joined = serializers.SerializerMethodField(read_only=True)
    followers = serializers.SerializerMethodField(read_only=True)
    following = serializers.SerializerMethodField(read_only=True)
    total_followers = serializers.SerializerMethodField(read_only=True)
    total_following = serializers.SerializerMethodField(read_only=True)
    unread_notification_count = serializers.SerializerMethodField(read_only=True)



    




    class Meta:
        model = Userr
        fields = '__all__'


    def get_unread_notification_count(self, obj):
        return obj.get_unread_notification_count()

    def get__id(self, obj):
        return obj.id
    
    def get_isAdmin(self, obj):
        return obj.is_staff

        
    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email

        return name
    
    def get_bio(self, obj):
        bio = obj.bio


        return bio
    
    def get_avi(self, obj):
        avi = obj.avi


        return avi


    def get_date_joined(self, obj):
        date_joined = obj.date_joined


        return date_joined
    
    def get_followers(self, obj):
        followers = obj.followers.exclude(custom_id=obj.id)
        serializer = FollowersSerializer(followers, many=True)
        return serializer.data

    def get_following(self, obj):
        following = obj.following.exclude(custom_id=obj.id)
        serializer = FollowingSerializer(following, many=True)
        return serializer.data

    
    def get_total_followers(self, obj):
        return obj.followers.count() - 1

    def get_total_following(self, obj):
        return obj.following.count() - 1



from datetime import datetime
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers
import jwt
from pytz import timezone  # Import timezone from pytz
from datetime import timedelta


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)
    expiration_time = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Userr
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'bio', 'token' , 'expiration_time']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
    
    def get_expiration_time(self, obj):
        token = RefreshToken.for_user(obj)
        access_token = str(token.access_token)
        decoded_token = jwt.decode(access_token, options={"verify_signature": False})  # Decode token without verification
        expiration_timestamp = decoded_token['exp']  # Get the expiration time from the decoded token
        expiration_datetime_utc = datetime.utcfromtimestamp(expiration_timestamp)  # Convert expiration timestamp to UTC datetime
        expiration_datetime_local = expiration_datetime_utc.astimezone(timezone('Africa/Nairobi'))  # Convert to Nairobi timezone
        expiration_datetime_local += timedelta(hours=3)  # Add three hours to the expiration time
        return expiration_datetime_local.strftime('%Y-%m-%d %H:%M:%S %Z')  # 

    





# class PasswordResetRequestSerializer(serializers.Serializer):
#     email = serializers.EmailField(max_length=255)

#     class Meta:
#         fields = ['email']

#     def validate(self, attrs):
#         email = attrs.get('email')
#         if Userr.objects.filter(email=email).exists():
#             user = Userr.objects.get(email=email)
#             uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
#             token = PasswordResetTokenGenerator().make_token(user)
#             request = self.context.get('request')
#             abslink = f"http://localhost:3000/#/password-reset-confirm/{uidb64}/{token}/"
#             print(abslink)
#             email_body = f"Hi {user.first_name}, use the link below to reset your password: {abslink} Hurry Up The Link Expires in Two Minutes"
#             data = {
#                 'email_body': email_body,
#                 'email_subject': "Reset your Password",
#                 'to_email': user.email
#             }
#             send_normal_email(data)

#         return super().validate(attrs)



class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

    def validate(self, attrs):
        email = attrs.get('email')
        user = Userr.objects.get(email=email)
        if user.is_verified:

            

            if Userr.objects.filter(email=email).exists():

                uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
                token = PasswordResetTokenGenerator().make_token(user)
                request = self.context.get('request')
                abslink = f"http://localhost:3000/#/password-reset-confirm/{uidb64}/{token}/"
                print(abslink)
                email_body = f"Hi {user.first_name}, use the link below to reset your password: {abslink} Hurry Up The Link Expires in Two Minutes"
                data = {
                    'email_body': email_body,
                    'email_subject': "Reset your Password",
                    'to_email': user.email
                }
                send_normal_email(data)

            return attrs
        else:

             raise serializers.ValidationError({'detail': "This account is not verified. Sorry, we cannot help you."})





from notifications.models import *

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError

class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=100, min_length=6, write_only=True)
    confirm_password = serializers.CharField(max_length=100, min_length=6, write_only=True)
    uidb64 = serializers.CharField(min_length=1, write_only=True)
    token = serializers.CharField(min_length=3, write_only=True)

    class Meta:
        fields = ['password', 'confirm_password', 'uidb64', 'token']

    def validate(self, attrs):
        try:
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')
            password = attrs.get('password')
            confirm_password = attrs.get('confirm_password')

            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = Userr.objects.get(id=user_id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed("Reset link is invalid or has expired", 401)

            if password != confirm_password:
                raise AuthenticationFailed("Passwords do not match")

            # Validate password using Django's password validators
            try:
                validate_password(password, user)
            except ValidationError as e:
                raise ValidationError(detail=str(e))

            user.set_password(password)
            user.save()

            # Send email notifying the user of the password change
            email_body = f"Hi {user.first_name}, your password For GALLERY has been successfully changed If This Was Not You Change It Back Immediately."
            email_subject = "Password Change Notification"
            to_email = user.email
            data = {
                'email_body': email_body,
                'email_subject': email_subject,
                'to_email': to_email
            }
            send_normal_email(data)

            return user
        except Exception as e:
            raise AuthenticationFailed("Link is invalid or has expired")
class MessageSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)
    unread_count = serializers.SerializerMethodField()


    class Meta:
        model = Message
        fields = '__all__'

    def get_unread_count(self, obj):
        # Assuming obj.sender and obj.receiver are instances of CustomUser
        return Message.get_unread_count(obj.sender, obj.receiver)



class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = '__all__'