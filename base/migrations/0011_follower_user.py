# Generated by Django 4.2.7 on 2024-01-16 07:12

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0010_alter_customuser_options_customuser_followers_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='follower',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
