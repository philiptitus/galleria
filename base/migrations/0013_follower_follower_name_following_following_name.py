# Generated by Django 4.2.7 on 2024-01-17 08:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0012_alter_follower_unique_together_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='follower',
            name='follower_name',
            field=models.CharField(blank=True, max_length=264, null=True),
        ),
        migrations.AddField(
            model_name='following',
            name='following_name',
            field=models.CharField(blank=True, max_length=264, null=True),
        ),
    ]
