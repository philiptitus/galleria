# Generated by Django 4.2.7 on 2024-02-03 09:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0027_alter_bookmark_options_alter_like_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='avi',
            field=models.ImageField(blank=True, default='/avatar.png', null=True, upload_to=''),
        ),
    ]
