# Generated by Django 4.2.7 on 2024-01-17 15:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0017_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='user_avi',
            field=models.ImageField(blank=True, default='/meganfox.webp', null=True, upload_to=''),
        ),
    ]
