# Generated by Django 4.2.6 on 2023-11-30 09:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_rename_lostmatchescount_user_matchescount'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='gameRatio',
            field=models.DecimalField(decimal_places=1, default=0.0, max_digits=2),
        ),
    ]