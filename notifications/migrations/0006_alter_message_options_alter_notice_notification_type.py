# Generated by Django 4.2.7 on 2024-01-31 10:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0005_alter_notice_notification_type_message'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='message',
            options={'ordering': ['-timestamp']},
        ),
        migrations.AlterField(
            model_name='notice',
            name='notification_type',
            field=models.CharField(choices=[('follow', 'Follow Request'), ('like', 'Like Notification'), ('comment', 'Comment Notification'), ('chat', 'Chat Notification'), ('account', 'Account Notification')], default='like', max_length=20),
        ),
    ]
