# Generated by Django 3.2.10 on 2024-02-14 15:26

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='id',
            field=models.UUIDField(default=uuid.UUID('b2fc2e9f-1122-4b59-91b9-bee0b5031e08'), editable=False, primary_key=True, serialize=False),
        ),
    ]
