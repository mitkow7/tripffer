# Generated by Django 5.2.4 on 2025-07-07 15:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appuser',
            name='first_name',
            field=models.CharField(max_length=30),
        ),
        migrations.AlterField(
            model_name='appuser',
            name='last_name',
            field=models.CharField(max_length=30),
        ),
    ]
