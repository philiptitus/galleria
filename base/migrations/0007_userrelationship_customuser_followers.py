# Generated by Django 4.2.7 on 2024-01-15 16:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0006_customuser_avi'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserRelationship',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('follower', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='follower_relationship', to=settings.AUTH_USER_MODEL)),
                ('following', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='following_relationship', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('follower', 'following')},
            },
        ),
        migrations.AddField(
            model_name='customuser',
            name='followers',
            field=models.ManyToManyField(related_name='following', through='base.UserRelationship', to=settings.AUTH_USER_MODEL),
        ),
    ]
