# Generated by Django 4.2.7 on 2025-07-29 16:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hotels', '0013_alter_hotel_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='hotel',
            name='is_approved',
            field=models.BooleanField(default=False, help_text='Whether this hotel has been approved by an admin'),
        ),
    ]
