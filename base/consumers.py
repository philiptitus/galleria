import base64
import json
import re

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.files.base import  ContentFile
from django.db.models import Q, Exists, OuterRef
from django.db.models.functions import Coalesce


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        user = self.scope['user']
        print(f"username: {user.username}")
        if not user.is_authenticated:
            return

        #save username to use as a group name for this user
        # Sanitize username for group name
        self.username = re.sub(r'[^a-zA-Z0-9._-]', '', user.username) #remove invalid characters
        self.username = self.username[:99] #truncate to max length

        #join this user to a group with their username
        async_to_sync(self.channel_layer.group_add)(
            self.username, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        #leave room/group
        async_to_sync(self.channel_layer.group_discard)(
            self.username, self.channel_name
        )


#HANDLE REQUESTS
    def receive(self, text_data):
        # Receive message from websocket
        data = json.loads(text_data)
        # Pretty print  python dict
        print('receive', json.dumps(data, indent=2))

        # Send messages
		if data_source == 'create_chat':
			self.create_chat(data)


    def create_chat(self, data):
            sender = self.scope['user']
            receiver_id = data.get('chat').get('receiver_id')
            content = data.get('chat').get('content')

            try:
                if not receiver_id or not CustomUser.objects.filter(id=receiver_id).exists():
                    self.send(text_data=json.dumps({'error': 'Invalid receiver_id'}, cls=DjangoJSONEncoder))
                    return

                receiver = CustomUser.objects.get(id=receiver_id)

                if sender == receiver:
                    self.send(text_data=json.dumps({'error': "Can't message yourself"}, cls=DjangoJSONEncoder))
                    return

                message = Message.objects.create(sender=sender, receiver=receiver, content=content)

                # Serialize the message using your existing serializer
                serialized_message = MessageSerializer(message).data

                # Send the serialized message to both sender and receiver groups
                async_to_sync(self.channel_layer.group_send)(
                    self.username,
                    {'type': 'chat_message', 'message': serialized_message}
                )
                async_to_sync(self.channel_layer.group_send)(
                    receiver.username,
                    {'type': 'chat_message', 'message': serialized_message}
                )

            except Exception as e:
            self.send(text_data=json.dumps({'error': str(e)}, cls=DjangoJSONEncoder))


    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))


