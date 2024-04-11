# Generated by Django 4.2.7 on 2024-02-08 14:45

import base.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0031_video'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='video',
            field=models.FileField(blank=True, null=True, upload_to='', validators=[base.validators.file_size]),
        ),
    ]
