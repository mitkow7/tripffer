from django.db import migrations

def remove_duplicate_profiles(apps, schema_editor):
    UserProfile = apps.get_model('accounts', 'UserProfile')
    # Get all profiles
    profiles = UserProfile.objects.all()
    # Keep track of seen users
    seen_users = set()
    # Remove duplicates
    for profile in profiles:
        if profile.user_id in seen_users:
            profile.delete()
        else:
            seen_users.add(profile.user_id)

class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0002_alter_appuser_first_name_alter_appuser_last_name'),
    ]

    operations = [
        migrations.RunPython(remove_duplicate_profiles, reverse_code=migrations.RunPython.noop),
    ] 