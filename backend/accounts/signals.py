from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import AppUser, UserProfile


@receiver(post_save, sender=AppUser)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    """
    Signal to automatically create or update user profile
    """
    UserProfile.objects.get_or_create(user=instance)
