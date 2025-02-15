import json
import re
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.serializers.json import DjangoJSONEncoder
from base.models import *
from base.serializers import *

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        user = self.scope['user']
        print(f"username: {user.username}")

        if not user.is_authenticated:
            return

        self.username = re.sub(r'[^a-zA-Z0-9._-]', '', user.username)[:99]

        # Accept WebSocket connection
        self.accept()

    def disconnect(self, close_code):
        # Leave all groups on disconnect
        async_to_sync(self.channel_layer.group_discard)(self.group_name, self.channel_name)

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
            if not receiver_id or not CustomUser.objects.filter(id=receiver_id).exists():
                self.send(text_data=json.dumps({'error': 'Invalid receiver_id'}, cls=DjangoJSONEncoder))
                return

            receiver = CustomUser.objects.get(id=receiver_id)

            if sender == receiver:
                self.send(text_data=json.dumps({'error': "Can't message yourself"}, cls=DjangoJSONEncoder))
                return

            # **Create a unique group name for the chat**
            user_ids = sorted([sender.id, receiver.id])  # Ensure consistency
            self.group_name = f"chat_{user_ids[0]}_{user_ids[1]}"

            # **Ensure sender joins the group**
            async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)

            # **Create and save the message**
            message = Message.objects.create(sender=sender, receiver=receiver, content=content)
            serialized_message = MessageSerializer(message).data

            # **Send message to the group**
            async_to_sync(self.channel_layer.group_send)(
                self.group_name,
                {'type': 'chat_message', 'message': serialized_message}
            )

        except Exception as e:
            self.send(text_data=json.dumps({'error': str(e)}, cls=DjangoJSONEncoder))

    def chat_message(self, event):
        message = event['message']
        print(f"Sending to frontend: {json.dumps(message, indent=2)}")

        self.send(text_data=json.dumps({'message': message}, cls=DjangoJSONEncoder))
