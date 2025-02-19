import json
import re
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.serializers.json import DjangoJSONEncoder
from base.models import *
from base.serializers import *


class ChatConsumer(WebsocketConsumer):
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

    def receive(self, text_data):
        data = json.loads(text_data)
        print('receive', json.dumps(data, indent=2))

        if data.get('source') == 'create_chat':
            self.create_chat(data)

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
                'last_message_timestamp': message.timestamp.isoformat(),
                # For sender, you can set unread_count to 0 since they just sent the message
                'unread_count': 0
            }
            # For receiver, the conversation update will show the sender info
            conversation_data_receiver = {
                'user_id': sender.id,
                'name': sender.username,
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

    def chat_message(self, event):
        message = event['message']
        print(f"Sending chat message: {json.dumps(message, indent=2)}")
        self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))

    def conversation_update(self, event):
        conversation = event['conversation']
        print(f"Sending conversation update: {json.dumps(conversation, indent=2)}")
        self.send(text_data=json.dumps({'conversation': conversation}, cls=DjangoJSONEncoder))