# Generated by Django 5.0.1 on 2024-04-14 17:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0006_club_primary_paragraph_alter_club_primary_highlights_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='club_primary',
            name='paragraph',
        ),
        migrations.RemoveField(
            model_name='club_primary',
            name='qr_code_data',
        ),
        migrations.AddField(
            model_name='club_primary',
            name='brief_info',
            field=models.TextField(default='null'),
        ),
        migrations.AddField(
            model_name='club_primary',
            name='contacts',
            field=models.TextField(default='null'),
        ),
        migrations.AddField(
            model_name='club_primary',
            name='events',
            field=models.TextField(default='null'),
        ),
        migrations.AddField(
            model_name='club_primary',
            name='links',
            field=models.TextField(default='null'),
        ),
    ]
