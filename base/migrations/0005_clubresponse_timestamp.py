# Generated by Django 5.0.1 on 2024-04-01 14:07

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_useremail'),
    ]

    operations = [
        migrations.AddField(
            model_name='clubresponse',
            name='timestamp',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]