# Generated by Django 5.0.1 on 2024-04-11 05:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0005_clubresponse_timestamp'),
    ]

    operations = [
        migrations.AddField(
            model_name='club_primary',
            name='paragraph',
            field=models.TextField(default='null'),
        ),
        migrations.AlterField(
            model_name='club_primary',
            name='highlights',
            field=models.TextField(default='null'),
        ),
        migrations.AlterField(
            model_name='club_primary',
            name='motto',
            field=models.TextField(default='null'),
        ),
    ]
