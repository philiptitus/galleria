from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from base.models import *
from notifications.models import *
from base.serializers import *
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


import pusher

pusher_client = pusher.Pusher(
  app_id='1745267',
  key='2b30bd9cc69e9a56af92',
  secret='ff9b390cc01e34018603',
  cluster='ap2',
  ssl=True
)

from rest_framework.pagination import PageNumberPagination


class UserNotices(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Retrieve all notices for the authenticated user
        notices = Notice.objects.filter(user=user).order_by('-created_at')

        # Mark all unread notices as read
        unread_notices = notices.filter(is_read=False)
        unread_notices.update(is_read=True)


        paginator = PageNumberPagination()
        paginator.page_size = 10  # Set the number of posts per page
        result_page = paginator.paginate_queryset(notices, request)


        # Serialize the notices
        serializer = NoticeSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


\



from rest_framework.response import Response

@permission_classes([IsAuthenticated])
class Chat(APIView):

    def post(self, request):
        sender = request.user
        receiver_id = request.data.get('receiver_id')
        content = request.data.get('content')

        # Ensure that the receiver_id is provided and it corresponds to an existing user
        if not receiver_id or not CustomUser.objects.filter(id=receiver_id).exists():
            return Response({'detail': 'Invalid receiver_id'}, status=400)

        receiver = CustomUser.objects.get(id=receiver_id)

        # Check if the sender and receiver are the same user
        if sender == receiver:
            return Response({'detail': "Can't message yourself silly"}, status=400)

        # Create the message
        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            content=content
        )



        return Response(MessageSerializer(message).data)


@permission_classes([IsAuthenticated])
class ChatList(APIView):

    def get(self, request):
        user = request.user

        # Retrieve all messages involving the user
        messages = Message.objects.filter(models.Q(sender=user) | models.Q(receiver=user)).order_by('-timestamp')

        paginator = PageNumberPagination()
        paginator.page_size = 10  # Set the number of posts per page
        result_page = paginator.paginate_queryset(messages, request)


        serializer = MessageSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)



@permission_classes([IsAuthenticated])
class ChatDetail(APIView):

    def get(self, request, pk):
        user = request.user

        # Retrieve the specific message by its primary key (id)
        message = Message.objects.get(id=pk)

        # Check if the user is part of the message (either sender or receiver)
        if user == message.sender or user == message.receiver:
            serializer = MessageSerializer(message)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Permission denied'}, status=403)




class AllMessagesWithUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        # Make sure the other user exists
        other_user = get_object_or_404(CustomUser, id=pk)

        # Retrieve all messages between the authenticated user and the other user
        messages = Message.objects.filter(
            (Q(sender=request.user, receiver=other_user) |
             Q(sender=other_user, receiver=request.user))
        ).order_by('-timestamp')

        # Update is_read only for messages where request.user is the receiver
        for message in messages.filter(receiver=request.user):
            message.is_read = True
            message.save()



        paginator = PageNumberPagination()
        paginator.page_size = 10  # Set the number of posts per page
        result_page = paginator.paginate_queryset(messages, request)


        # Serialize the messages
        serializer = MessageSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)





from django.shortcuts import get_object_or_404
from django.views import View
from django.http import JsonResponse


class DeleteUnreadMessageView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, pk):
        # Get the message object or return a 404 response if not found
        message = get_object_or_404(Message, id=pk)

        # Check if the message is unread

        if request.user == message.sender:
            # Check if the message is unread
            if not message.is_read:
                # Delete the message
                message.delete()
                return JsonResponse({"message": "Message deleted successfully."})
            else:
                return JsonResponse({"error": "Cannot delete read messages."}, status=400)
        else:
            return JsonResponse({"error": "You are not authorized to delete this message."}, status=403)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from datetime import datetime
from django.utils import timezone






class UsersEngagedInConversation(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get a list of unique users with whom the authenticated user has exchanged messages
        # Both as sender and receiver
        users = CustomUser.objects.filter(
            Q(sent_messages__receiver=request.user) |
            Q(received_messages__sender=request.user)
        ).distinct()

        # Serialize the users
        serialized_users = UserSerializer(users, many=True, context={'request': request}).data

        # Add unread_count and last_message_timestamp fields to each user data
        for user_data in serialized_users:
            user = CustomUser.objects.get(pk=user_data['id'])

            # Check if the last message sent between the two users had request.user as a receiver
            last_message = Message.objects.filter(
                Q(sender=request.user, receiver=user) | Q(sender=user, receiver=request.user)
            ).order_by('-timestamp').first()

            if last_message and last_message.receiver == request.user:
                user_data['unread_count'] = Message.get_unread_count(request.user, user)
                user_data['last_message_timestamp'] = last_message.timestamp
            else:
                user_data['unread_count'] = 0
                user_data['last_message_timestamp'] = None

        # Sort the list of users based on the last_message_timestamp in descending order
        serialized_users = sorted(
            serialized_users,
            key=lambda x: x['last_message_timestamp'] if x['last_message_timestamp'] is not None else timezone.now(),
            reverse=True
        )
        # Apply pagination
        paginator = PageNumberPagination()
        paginator.page_size = 10
        result_page = paginator.paginate_queryset(serialized_users, request)

        return paginator.get_paginated_response(result_page)







class RegisterPushTokenView(APIView):

    def post(self, request, *args, **kwargs):
        print("I am being Called")
        token = request.data.get('token')
        user = request.user

        if token:
            ExpoPushToken.objects.update_or_create(user=user, defaults={'token': token})
            return Response({'message': 'Token registered successfully'}, status=status.HTTP_201_CREATED)

        return Response({'error': 'Token not provided'}, status=status.HTTP_400_BAD_REQUEST)
