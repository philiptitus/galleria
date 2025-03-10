import json
import re
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.serializers.json import DjangoJSONEncoder
from base.models import *
from base.serializers import *


class ChatConsumer(WebsocketConsumer):
    online_users = {}  # Class-level attribute to track online users

    def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            self.close()
            return

        # Clean username if needed
        self.username = re.sub(r'[^a-zA-Z0-9._-]', '', self.user.username)[:99]
        
        # Join the personal conversation group for real-time updates
        self.conversation_group_name = f"conversations_{self.user.id}"
        async_to_sync(self.channel_layer.group_add)(
            self.conversation_group_name,
            self.channel_name
        )

        # Mark the user as online
        ChatConsumer.online_users[self.user.id] = True
        print(f"User {self.user.id} is online")

        self.accept()

    def disconnect(self, close_code):
        # Leave conversation group
        async_to_sync(self.channel_layer.group_discard)(
            self.conversation_group_name,
            self.channel_name
        )
        # If joined a chat group, leave it
        if hasattr(self, 'group_name'):
            async_to_sync(self.channel_layer.group_discard)(
                self.group_name,
                self.channel_name
            )

        # Mark the user as offline
        if self.user.id in ChatConsumer.online_users:
            del ChatConsumer.online_users[self.user.id]
            print(f"User {self.user.id} is offline")

    def receive(self, text_data):
        data = json.loads(text_data)
        print('receive', json.dumps(data, indent=2))

        if data.get('source') == 'create_chat':
            self.create_chat(data)
        elif data.get('source') == 'join_chat_group':
            self.join_chat_group(data)
        elif data.get('source') == 'check_users_online':
            self.check_users_online(data)

    def create_chat(self, data):
        sender = self.scope['user']
        receiver_id = data.get('chat', {}).get('receiver_id')
        content = data.get('chat', {}).get('content')

        try:
            # Validate receiver
            if not receiver_id or not CustomUser.objects.filter(id=receiver_id).exists():
                self.send(text_data=json.dumps({'error': 'Invalid receiver_id'}, cls=DjangoJSONEncoder))
                return

            receiver = CustomUser.objects.get(id=receiver_id)
            if sender == receiver:
                self.send(text_data=json.dumps({'error': "Can't message yourself"}, cls=DjangoJSONEncoder))
                return

            # Create a unique chat group name
            user_ids = sorted([sender.id, receiver.id])
            self.group_name = f"chat_{user_ids[0]}_{user_ids[1]}"

            # Ensure the sender joins the chat group
            async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)

            # Create and save the message
            message = Message.objects.create(sender=sender, receiver=receiver, content=content)
            serialized_message = MessageSerializer(message).data

            # Send message to the chat group
            async_to_sync(self.channel_layer.group_send)(
                self.group_name,
                {'type': 'chat_message', 'message': serialized_message}
            )

            # Prepare conversation update data
            # For sender, the conversation update will show the receiver info
            conversation_data_sender = {
                'user_id': receiver.id,
                'name': receiver.username,
                'avi': receiver.avi,
                'last_message_timestamp': message.timestamp.isoformat(),
                # For sender, you can set unread_count to 0 since they just sent the message
                'unread_count': 0
            }
            # For receiver, the conversation update will show the sender info
            conversation_data_receiver = {
                'user_id': sender.id,
                'name': sender.username,
                'avi': sender.avi,
                'last_message_timestamp': message.timestamp.isoformat(),
                'unread_count': Message.get_unread_count(receiver, sender)
            }

            # Broadcast the update to the sender's conversation group
            async_to_sync(self.channel_layer.group_send)(
                f"conversations_{sender.id}",
                {'type': 'conversation_update', 'conversation': conversation_data_sender}
            )

            # Broadcast the update to the receiver's conversation group
            async_to_sync(self.channel_layer.group_send)(
                f"conversations_{receiver.id}",
                {'type': 'conversation_update', 'conversation': conversation_data_receiver}
            )

        except Exception as e:
            self.send(text_data=json.dumps({'error': str(e)}, cls=DjangoJSONEncoder))

    def join_chat_group(self, data):
        user = self.scope['user']
        other_user_id = data.get('chat', {}).get('other_user_id')

        try:
            print(f"User {user.id} is attempting to join chat group with user {other_user_id}")

            # Validate other user
            if not other_user_id or not CustomUser.objects.filter(id=other_user_id).exists():
                self.send(text_data=json.dumps({'error': 'Invalid other_user_id'}, cls=DjangoJSONEncoder))
                print(f"Invalid other_user_id: {other_user_id}")
                return

            other_user = CustomUser.objects.get(id=other_user_id)
            if user == other_user:
                self.send(text_data=json.dumps({'error': "Can't join a chat group with yourself"}, cls=DjangoJSONEncoder))
                print("User is trying to join a chat group with themselves")
                return

            # Create a unique chat group name
            user_ids = sorted([user.id, other_user.id])
            self.group_name = f"chat_{user_ids[0]}_{user_ids[1]}"
            print(f"Generated group name: {self.group_name}")

            # Ensure the user joins the chat group
            async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
            print(f"User {user.id} joined chat group {self.group_name}")

            # Initialize or update the active users list
            if not hasattr(self, 'active'):
                self.active = []
            if user.id not in self.active:
                self.active.append(user.id)
                print(f"Active users in group {self.group_name}: {self.active}")

            self.send(text_data=json.dumps({'success': f'Joined chat group {self.group_name}'}, cls=DjangoJSONEncoder))

            # Check if both users are online
            # self.check_users_online({'chat': {'sender_id': user.id, 'receiver_id': other_user.id}})

        except Exception as e:
            self.send(text_data=json.dumps({'error': str(e)}, cls=DjangoJSONEncoder))
            print(f"Error joining chat group: {str(e)}")

    def chat_message(self, event):
        message = event['message']
        print(f"Sending chat message: {json.dumps(message, indent=2)}")
        self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    def conversation_update(self, event):
        conversation = event['conversation']
        print(f"Sending conversation update: {json.dumps(conversation, indent=2)}")
        self.send(text_data=json.dumps({'conversation': conversation}, cls=DjangoJSONEncoder))



    def check_users_online(self, data):
        sender_id = data.get('chat', {}).get('sender_id')
        receiver_id = data.get('chat', {}).get('receiver_id')

        print(f"Checking online status for sender_id: {sender_id}, receiver_id: {receiver_id}")

        try:
            sender = CustomUser.objects.get(id=sender_id)
            receiver = CustomUser.objects.get(id=receiver_id)

            # Check if both users are in the online users list
            sender_online = ChatConsumer.online_users.get(sender.id, False)
            receiver_online = ChatConsumer.online_users.get(receiver.id, False)

            if sender_online:
                print(f"Sender {sender.username} is online")
            else:
                print(f"Sender {sender.username} is not online")

            if receiver_online:
                print(f"Receiver {receiver.username} is online")
            else:
                print(f"Receiver {receiver.username} is not online")

            self.send(text_data=json.dumps({
                'sender_online': sender_online,
                'receiver_online': receiver_online
            }, cls=DjangoJSONEncoder))

        except CustomUser.DoesNotExist:
            self.send(text_data=json.dumps({'error': 'User does not exist'}, cls=DjangoJSONEncoder))



