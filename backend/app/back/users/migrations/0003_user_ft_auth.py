# Generated by Django 3.2.10 on 2024-02-16 17:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_avatar_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='ft_auth',
            field=models.BooleanField(default=False),
        ),
    ]
