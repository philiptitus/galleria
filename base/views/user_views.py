
from datetime import datetime, timedelta
import jwt
from pytz import timezone  # Import timezone from pytz
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from pusher import Pusher
from notifications.models import *
from base.utils import *
from base.core.google_utils import *
from rest_framework import generics
from ..serializers import *
from django.db import IntegrityError
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from ..models import CustomUser  as Userr
from ast import Expression
from multiprocessing import context
from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination


# Create your views here.

from django.http import JsonResponse
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.crypto import get_random_string
from django.conf import settings






class GoogleAuthView(APIView):
    def post(self, request, *args, **kwargs):
        auth_code = request.data.get("auth_code")
        if not auth_code:
            return Response(
                {"error": "Missing authentication code"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Exchange auth code for tokens
        token_response = exchange_code_for_tokens(auth_code)
        if not token_response:
            return Response({'detail': 'Invalid authorization code'}, status=status.HTTP_400_BAD_REQUEST)

        access_token = token_response.get('access_token')
        if not access_token:
            return Response({'detail': 'Access token missing'}, status=status.HTTP_400_BAD_REQUEST)

        # Get user info using the access token
        user_info = get_user_info(access_token)
        if not user_info:
            return Response({'detail': 'Failed to fetch user info'}, status=status.HTTP_400_BAD_REQUEST)

        # Extract email from Google user info
        email = user_info.get('email')

        # Check if the user exists
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            # Create new user if not exists
            try:
                user = CustomUser.objects.create(
                    email=email,
                    username=email,
                    first_name=user_info.get('given_name', ''),
                    last_name=user_info.get('family_name', ''),
                    bio=user_info.get('bio', ''),
                    isPrivate=user_info.get('isPrivate', False),
                    auth_provider='google',
                )
            except IntegrityError:
                return Response({'detail': 'Error creating user'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate tokens for the user
        refresh = RefreshToken.for_user(user)
        user_serializer = UserSerializer(user)

        # Decode the access token to get the expiration time
        access_token_str = str(refresh.access_token)
        decoded_token = jwt.decode(access_token_str, options={"verify_signature": False})  # Decode token without verification
        expiration_timestamp = decoded_token['exp']  # Get the expiration time from the decoded token
        expiration_datetime_utc = datetime.utcfromtimestamp(expiration_timestamp)  # Convert expiration timestamp to UTC datetime
        expiration_datetime_local = expiration_datetime_utc.astimezone(timezone('Africa/Nairobi'))  # Convert to Nairobi timezone
        expiration_datetime_local += timedelta(hours=3)  # Add three hours to the expiration time
        expiration_time_str = expiration_datetime_local.strftime('%Y-%m-%d %H:%M:%S %Z')  # Format the expiration time

        # Filter the user data and construct the response
        filtered_user_data = {
            'id': user_serializer.data['id'],
            '_id': user_serializer.data['id'],
            'username': user_serializer.data['username'],
            'email': user_serializer.data['email'],
            'name': user_serializer.data['first_name'],
            'isAdmin': user_serializer.data['is_staff'],
            'bio': user_serializer.data['bio'],
            'date_joined': user_serializer.data['date_joined'],
            'token': access_token_str,
            'expiration_time': expiration_time_str,  # Include the expiration time
        }

        return Response({
            'refresh': str(refresh),
            'access': access_token_str,
            **filtered_user_data,
        }, status=status.HTTP_200_OK)




@permission_classes([IsAuthenticated])
class Createotp(APIView):
    def post(self, request):
        user = request.user
        try:
            otp_instance = OneTimePassword.objects.get(user=user)
            otp_instance.delete()
        except OneTimePassword.DoesNotExist:
            pass

        otp = get_random_string(length=6, allowed_chars='0123456789')
        OneTimePassword.objects.create(user=user, otp=otp)

        # Send OTP to user's email
        subject = 'Your One Time Password'
        message = f'Your One Time Password is: {otp}'
        from_email = settings.EMAIL_HOST_USER
        to_email = user.email

        send_mail(subject, message, from_email, [to_email])

        return JsonResponse({'message': 'OTP created and sent successfully.'})





@permission_classes([IsAuthenticated])
class VerifyUserEmail(GenericAPIView):
    def post(self, request):
        try:
            passcode = request.data.get('otp')
            print(passcode)
            user_pass_obj=OneTimePassword.objects.get(otp=passcode)
            user=user_pass_obj.user

            if not user.is_verified:
                user.is_verified=True
                user.save()
                return Response({
                    'message':'account email verified successfully'
                }, status=status.HTTP_200_OK)
            return Response({'detail':'passcode is invalid user is already verified'}, status=status.HTTP_204_NO_CONTENT)
        except OneTimePassword.DoesNotExist as identifier:
            return Response({'detail':'passcode invalid'}, status=status.HTTP_400_BAD_REQUEST)






class GoogleOauthSignInview(GenericAPIView):
    serializer_class=GoogleSignInSerializer

    def post(self, request):
        print(request.data)
        serializer=self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data=((serializer.validated_data)['access_token'])
        return Response(data, status=status.HTTP_200_OK)






class GithubOauthSignInView(GenericAPIView):
    serializer_class=GithubLoginSerializer

    def post(self, request):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            data=((serializer.validated_data)['code'])
            return Response(data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from typing import Dict, Any


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        return data
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer







class GetRouteView(APIView):
    def get(self, request):
        return Response({'message': 'Hello'})

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from notifications.pusher import pusher_client

@permission_classes([IsAuthenticated])
class Follow(APIView):
    def post(self, request, pk):
        follower = request.user
        user = Userr.objects.get(id=pk)

        # Check if the user being followed has a private account
        if user.isPrivate:
            # Check if the follower is already following the user
            already_following = Follower.objects.filter(user=user, follower=follower).exists()

            if already_following:
                # If already following, unfollow the private account
                Follower.objects.filter(user=user, follower=follower).delete()
                Following.objects.filter(user=follower, following=user).delete()
                return Response('Now Unfollowed')

            # If not following, send a follow request
            follow_request_exists = FollowRequest.objects.filter(requester=follower, receiver=user, status='pending').exists()

            if follow_request_exists:
                return Response('Follow request already sent', status=status.HTTP_400_BAD_REQUEST)

            follow_request = FollowRequest.objects.create(
                requester=follower,
                receiver=user,
                status='pending',
            )

            pusher_client.trigger('chat', 'message', {
                'username': follow_request.requester.username,
                'message': f'{follow_request.receiver.username} sent you a follow request.',
            })

            return Response('Follow request sent successfully')

        # If the user being followed does not have a private account, proceed with direct follow
        already_exists = Follower.objects.filter(user=user, follower=follower).exists()

        if already_exists:
            # If Follower already exists, delete it (unfollow)
            Follower.objects.filter(user=user, follower=follower).delete()
            Following.objects.filter(user=follower, following=user).delete()
            return Response('Now Unfollowed')

        else:
            # If Follower doesn't exist, create it (follow)
            follow = Follower.objects.create(
                user=user,
                follower=follower,
            )

            if user == follower:
                return Response('Now Following')

            # Send a notification to the user being followed
            pusher_client.trigger('chat', 'message', {
                'username': user.username,
                'message': f'{follower.username} started following you.',
            })


            o_message=f"{follower.username} Started Following You",
            o_user = user,
            o_type = 'Follow',

            notice = Notice.objects.create(
                user=user,
                message=o_message,
                notification_type=o_type
            )


            # Fetch the Expo push token for the user
            try:
                expo_token = ExpoPushToken.objects.get(user=user).token
                send_push_notification(expo_token, message={
                    'title': 'Follow',
                    'body': f"{follower.username} Started Following You",
                })
            except ExpoPushToken.DoesNotExist:
                pass  # Handle the case where the token does not exist


            return Response('Now Following')



from rest_framework.response import Response
from django.db.models import Q






from django.db.models import Case, When, Value, IntegerField

from django.db.models import Q, F
from rest_framework.pagination import PageNumberPagination

@permission_classes([IsAuthenticated])
class GetUsersView(APIView):
    def get(self, request):
        users = Userr.objects.exclude(id=request.user.id)
        name = request.query_params.get('name')

        if name is not None:
            users = users.filter(Q(first_name__icontains=name) | Q(email__icontains=name))

            # Order the results so that the item with the searched username appears first


        paginator = PageNumberPagination()
        paginator.page_size = 10  # Set the number of users per page

        # If a search query is present, reset the page to 1
        if name:
            request.GET = request.GET.copy()
            request.GET['page'] = 1

        # Use the paginate_queryset method to get the paginated result
        result_page = paginator.paginate_queryset(users, request)

        # Serialize the paginated users
        serializer = UserSerializer(result_page, many=True)

        # Use the get_paginated_response method to get the paginated response
        return paginator.get_paginated_response(serializer.data)





@permission_classes([IsAuthenticated])
class GetUserById(APIView):
    def get(self, request, pk):
        users = Userr.objects.get(id=pk)
        serializer = UserSerializer(users, many=False)
        pagination_class = LimitOffsetPagination


        if users == request.user:
            return Response(serializer.data)
        o_message=f"{request.user.username} Viewed Your Profile",
        o_user = users,
        o_type = 'Account',

        notice = Notice.objects.create(
            user=users,
            message=o_message,
            notification_type=o_type
        )


        # Fetch the Expo push token for the user
        try:
            expo_token = ExpoPushToken.objects.get(user=users).token
            send_push_notification(expo_token, message={
                'title': 'Account',
                'body': f"{request.user.username} Viewed Your Profile",
            })
        except ExpoPushToken.DoesNotExist:
            pass  # Handle the case where the token does not exist


        return Response(serializer.data)


from base.utils import upload_file_to_supabase
import logging
from rest_framework.parsers import MultiPartParser, FormParser

logger = logging.getLogger(__name__)
class uploadImage(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        try:
            data = request.data

            user_id = data['user_id']
            user = Userr.objects.get(id=user_id)

            avi = request.FILES.get('avi')
            avi_url = upload_file_to_supabase(avi, BUCKET_NAME, f"pfp/{avi.name}")
            user.avi = avi_url
            user.save()

            return Response({'detail': 'Image was uploaded successfully'})
        except Exception as e:
            return Response({'detail': f'Error uploading image: {str(e)}'}, status=500)
from rest_framework.parsers import MultiPartParser, FormParser

@permission_classes([IsAdminUser])
class UpdateUser(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request, pk):
        try:
            user = Userr.objects.get(id=pk)
            data = request.data

            # Update user profile details
            user.first_name = data.get('name', user.first_name)
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)
            user.is_staff = data.get('isAdmin', user.is_staff)


            user.save()

            serializer = UserSerializer(user, many=False)

            # Return updated user data
            return Response(serializer.data)

        except Userr.DoesNotExist:
            return Response({'detail': 'User not found'}, status=404)
        except Exception as e:
            return Response({'detail': f'Error updating user profile: {str(e)}'}, status=500)

from django.contrib.auth.validators import UnicodeUsernameValidator

class RegisterUser(APIView):

    def post(self, request):
        data = request.data

        # Check password length
        if len(data['password']) < 8:
            content = {'detail': 'Password must be at least 8 characters long.'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        # Check password for username and email
        username_validator = UnicodeUsernameValidator()
        if username_validator(data['password']):
            content = {'detail': 'Password cannot contain username or email.'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        # Check for minimum number of upper and lowercase characters
        uppercase_count = sum(1 for c in data['password'] if c.isupper())
        lowercase_count = sum(1 for c in data['password'] if c.islower())
        if uppercase_count < 1 or lowercase_count < 1:
            content = {'detail': 'Password must contain at least one uppercase and lowercase character.'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        # Check for minimum number of digits and special characters
        digit_count = sum(1 for c in data['password'] if c.isdigit())
        special_count = sum(1 for c in data['password'] if not c.isalnum())
        if digit_count < 1 or special_count < 1:
            content = {'detail': 'Password must contain at least one digit and one special character.'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        # Create user
        try:
            user = Userr.objects.create_user(
                first_name=data['name'],
                username=data['email'],
                email=data['email'],
                password=data['password'],
            )

            send_generated_otp_to_email(user.email, request)

            Follower.objects.create(user=user, follower=user)

            o_message=f"Hi , {user.username}  Welcome To Galleria Hope You Enjoy The App",
            o_type = 'Account',
            o_user = user,



            notice = Notice.objects.create(
                        user=user,
                        message=o_message,
                        notification_type=o_type
                    )


            # Fetch the Expo push token for the user
            try:
                expo_token = ExpoPushToken.objects.get(user=user).token
                send_push_notification(expo_token, message={
                    'title': 'Account',
                    'body': f"Hi , {user.username}  Welcome To Galleria Hope You Enjoy The App",
                })
            except ExpoPushToken.DoesNotExist:
                pass  # Handle the case where the token does not exist


            email_body = f"Hi {user.first_name}, Welcome To Galleria The Best Social App ! Remember To Leave A Review On Your Experience."
            email_subject = "WELCOME HOME"
            to_email = user.email
            data = {
                'email_body': email_body,
                'email_subject': email_subject,
                'to_email': to_email
            }
            # send_normal_email(data)
        except IntegrityError:
            message = {'detail': 'User with this email already exists.'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)



class VerifyUserEmail(GenericAPIView):
    def post(self, request):
        try:
            passcode = request.data.get('otp')
            user_pass_obj=OneTimePassword.objects.get(otp=passcode)
            user=user_pass_obj.user
            if not user.is_verified:
                user.is_verified=True
                user.save()
                return Response({
                    'message':'account email verified successfully'
                }, status=status.HTTP_200_OK)
            return Response({'message':'passcode is invalid user is already verified'}, status=status.HTTP_204_NO_CONTENT)
        except OneTimePassword.DoesNotExist as identifier:
            return Response({'message':'passcode not provided'}, status=status.HTTP_400_BAD_REQUEST)




@permission_classes([IsAuthenticated])
class GetUserProfile(APIView):

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user, many=False)


        return Response(serializer.data)

@permission_classes([IsAuthenticated])
class UpdateUserProfile(APIView):

    def put(self, request):
        user = request.user
        serializer = UserSerializerWithToken(user, many=False)
        data = request.data

        # Update password if provided
        if 'password' in data and data['password'] != '':
            # Add password strength checks here
            if len(data['password']) < 8:
                content = {'detail': 'Password must be at least 8 characters long.'}
                return Response(content, status=status.HTTP_400_BAD_REQUEST)

            uppercase_count = sum(1 for c in data['password'] if c.isupper())
            lowercase_count = sum(1 for c in data['password'] if c.islower())
            if uppercase_count < 1 or lowercase_count < 1:
                content = {'detail': 'Password must contain at least one uppercase and lowercase character.'}
                return Response(content, status=status.HTTP_400_BAD_REQUEST)

            digit_count = sum(1 for c in data['password'] if c.isdigit())
            special_count = sum(1 for c in data['password'] if not c.isalnum())
            if digit_count < 1 or special_count < 1:
                content = {'detail': 'Password must contain at least one digit and one special character.'}
                return Response(content, status=status.HTTP_400_BAD_REQUEST)

            user.password = make_password(data['password'])

            o_message=f"Hi {user.username}, Your Password Was Changed If This Was NOt You Change It Immediately!",
            o_user = user,
            o_type = 'Account',




            notice = Notice.objects.create(
                user=user,
                message=o_message,
                notification_type=o_type
            )


            # Fetch the Expo push token for the user
            try:
                expo_token = ExpoPushToken.objects.get(user=user).token
                send_push_notification(expo_token, message={
                    'title': 'Account',
                    'body': f"Hi {user.username}, Your Password Was Changed If This Was NOt You Change It Immediately!",
                })
            except ExpoPushToken.DoesNotExist:
                pass  # Handle the case where the token does not exist


        # Update user profile details
        user.first_name = data.get('name', user.first_name)
        user.username = data.get('email', user.username)
        user.email = data.get('email', user.email)
        user.bio = data.get('bio', user.bio)
        user.isPrivate = data.get('isPrivate', user.bio)




        # Save updated user profile
        user.save()

        # Return updated user data
        return Response(serializer.data)



@permission_classes([IsAuthenticated])
class deleteAccount(APIView):
    def delete(self, request):
        # Use request.user to get the authenticated user
        user_for_deletion = request.user



        # Delete the user
        user_for_deletion.delete()

        return Response("The user was deleted successfully")


@permission_classes([IsAdminUser])
class deleteUser(APIView):
    def delete(self, request, pk):
        userForDeletion = Userr.objects.get(id=pk)
        userForDeletion.delete()
        return Response("The user Was Deleted Successfully")





class PasswordResetRequestView(APIView):
    serializer_class=PasswordResetRequestSerializer

    def post(self, request):
        serializer=self.serializer_class(data=request.data, context={'request':request})
        serializer.is_valid(raise_exception=True)
        return Response({'message':'we have sent you a link to reset your password'}, status=status.HTTP_200_OK)
        # return Response({'message':'user with that email does not exist'}, status=status.HTTP_400_BAD_REQUEST)




class PasswordResetConfirm(APIView):

    def get(self, request, uidb64, token):
        try:
            user_id=smart_str(urlsafe_base64_decode(uidb64))
            user=Userr.objects.get(id=user_id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'message':'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({'success':True, 'message':'credentials is valid', 'uidb64':uidb64, 'token':token}, status=status.HTTP_200_OK)

        except DjangoUnicodeDecodeError as identifier:
            return Response({'message':'token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)

class SetNewPasswordView(GenericAPIView):
    serializer_class=SetNewPasswordSerializer

    def patch(self, request):
        serializer=self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response({'success':True, 'message':"password reset is succesful"}, status=status.HTTP_200_OK)




from django.shortcuts import get_object_or_404





from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from notifications.pusher import pusher_client
from rest_framework.permissions import IsAuthenticated

@permission_classes([IsAuthenticated])
class FollowRequestAction(APIView):
    def post(self, request, pk):
        # Get the FollowRequest instance
        follow_request = get_object_or_404(FollowRequest, id=pk, status='pending', receiver=request.user)

        # Check if the 'action' is provided in the form data
        action = request.data.get('action')

        # Check if the action is valid (either 'accept' or 'decline')
        if action not in ['accept', 'decline']:
            return Response({'detail': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

        if action == 'accept':
            # Perform the requested action (accept)
            follower_instance, created = Follower.objects.get_or_create(user=follow_request.receiver, follower=follow_request.requester)

            if created:
                # Send a notification to the follower
                pusher_client.trigger('chat', 'message', {
                    'username': follow_request.requester.username,
                    'message': f'{follow_request.receiver.username} accepted your follow request.',
                })
                o_message=f"{follow_request.receiver.username} Accepted Your Follow Request",
                o_user = follow_request.requester,
                o_type = 'Follow',






                notice = Notice.objects.create(
                    user=user,
                    message=o_message,
                    notification_type=o_type
                )

                # Fetch the Expo push token for the user
                try:
                    expo_token = ExpoPushToken.objects.get(user=user).token
                    send_push_notification(expo_token, message={
                        'title': 'Follow',
                        'body': f"{follow_request.receiver.username} Accepted Your Follow Request",
                    })
                except ExpoPushToken.DoesNotExist:
                    pass  # Handle the case where the token does not exist


        elif action == 'decline':
            # Perform the requested action (decline)
            # Send a notification to the follower
            pusher_client.trigger('chat', 'message', {
                'username': follow_request.requester.username,
                'message': f'{follow_request.receiver.username} declined your follow request.',
            })

            o_message=f"{follow_request.receiver.username} Declined Your Follow Request",
            o_user = follow_request.requester,
            o_type = 'Follow',



            notice = Notice.objects.create(
                user=user,
                message=o_message,
                notification_type=o_type
            )


            # Fetch the Expo push token for the user
            try:
                expo_token = ExpoPushToken.objects.get(user=user).token
                send_push_notification(expo_token, message={
                    'title': 'Follow',
                    'body': f"{follow_request.receiver.username} Declined Your Follow Request",
                })
            except ExpoPushToken.DoesNotExist:
                pass  # Handle the case where the token does not exist




        # Delete the FollowRequest instance (whether accepted or declined)
        follow_request.delete()

        return Response('Action performed successfully')



@permission_classes([IsAuthenticated])
class FollowRequestsList(APIView):
    def get(self, request):
        # Retrieve all follow requests made to the authenticated user
        follow_requests = FollowRequest.objects.filter(receiver=request.user, status='pending')

        # Use Django REST framework's built-in pagination
        paginator = PageNumberPagination()
        paginator.page_size = 10  # Set the number of follow requests per page
        result_page = paginator.paginate_queryset(follow_requests, request)

        # Serialize the paginated follow requests
        serializer = FollowRequestSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)