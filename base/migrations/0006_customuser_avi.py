# Generated by Django 4.2.7 on 2024-01-15 11:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_alter_customuser_date_joined'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='avi',
            field=models.ImageField(blank=True, default='/amber.jpeg', null=True, upload_to=''),
        ),
    ]