from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg
from .models import Review, Hotel

@receiver([post_save, post_delete], sender=Review)
def update_hotel_rating(sender, instance, **kwargs):
    """
    Updates the hotel's average guest score whenever a review is saved or deleted.
    """
    hotel = instance.hotel
    average_rating = hotel.reviews.aggregate(Avg('rating'))['rating__avg']
    
    if average_rating is not None:
        hotel.guest_score = average_rating
    else:
        hotel.guest_score = None
        
    hotel.save() 