from django.db import models
from django.conf import settings
from .choices import RoomType


class Feature(models.Model):
    """
    Model representing a hotel feature or amenity
    """
    name = models.CharField(
        max_length=255,
        unique=True,
    )
    is_amenity = models.BooleanField(
        default=False,
        help_text="True if this is an amenity, False if it's a feature",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Hotel(models.Model):
    """
    Model representing a hotel, linked to a user with the 'HOTEL' role.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="hotel",
        limit_choices_to={'role': 'HOTEL'}
    )
    name = models.CharField(
        max_length=255,
    )
    is_approved = models.BooleanField(
        default=False,
        help_text="Whether this hotel has been approved by an admin",
    )
    stars = models.IntegerField(
        default=0,
    )
    price_per_night = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
    )
    availability_start_date = models.DateField(
        blank=True,
        null=True,
    )
    availability_end_date = models.DateField(
        blank=True,
        null=True,
    )
    features = models.ManyToManyField(
        Feature,
        related_name='hotels',
        blank=True,
    )
    address = models.TextField()
    website = models.URLField(
        blank=True,
        null=True,
    )
    description = models.TextField(
        blank=True,
        null=True,
    )
    guest_score = models.FloatField(
        blank=True,
        null=True,
    )
    distance_to_center = models.FloatField(
        blank=True,
        null=True,
    )
    contact_phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
    )
    contact_email = models.EmailField(
        blank=True,
        null=True,
    )
    number_of_adults = models.IntegerField(
        blank=True,
        null=True,
    )
    check_in_time = models.TimeField(
        blank=True,
        null=True,
    )
    check_out_time = models.TimeField(
        blank=True,
        null=True,
    )

    def update_average_price(self):
        """
        Calculate and update the average price per night based on all rooms
        """
        rooms = self.rooms.all()
        if rooms:
            avg_price = sum(room.price for room in rooms) / len(rooms)
            self.price_per_night = avg_price
        else:
            self.price_per_night = None
        self.save(update_fields=['price_per_night'])

    def __str__(self):
        return self.name


class HotelImage(models.Model):
    hotel = models.ForeignKey(
        Hotel,
        related_name='images',
        on_delete=models.CASCADE
    )
    image = models.ImageField(
        upload_to='hotel_images/',
    )

    def __str__(self):
        return f"Image for {self.hotel.name}"


class Room(models.Model):
    hotel = models.ForeignKey(
        Hotel,
        related_name='rooms',
        on_delete=models.CASCADE
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )
    description = models.TextField(
        blank=True,
        null=True,
    )
    bed_count = models.IntegerField(
        default=1,
    )
    max_adults = models.IntegerField(
        default=1,
    )
    room_type = models.CharField(
        max_length=20,
        choices=RoomType.choices,
        default=RoomType.SINGLE,
    )

    def is_available(self, start_date, end_date, booking_id=None):
        """
        Check if the room is available for a given date range,
        optionally excluding a specific booking.
        """
        # Check for any bookings that overlap with the desired date range
        overlapping_bookings = self.bookings.filter(
            start_date__lt=end_date,
            end_date__gt=start_date,
        )
        if booking_id:
            overlapping_bookings = overlapping_bookings.exclude(id=booking_id)
        return not overlapping_bookings.exists()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update the hotel's average price whenever a room is saved
        self.hotel.update_average_price()

    def delete(self, *args, **kwargs):
        hotel = self.hotel
        super().delete(*args, **kwargs)
        # Update the hotel's average price whenever a room is deleted
        hotel.update_average_price()

    def __str__(self):
        return f"Room for {self.hotel.name}"


class Booking(models.Model):
    """
    Model to store booking information for a room.
    """
    room = models.ForeignKey(
        Room,
        related_name='bookings',
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='bookings',
        on_delete=models.CASCADE
    )
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('confirmed', 'Confirmed'),
            ('cancelled', 'Cancelled'),
            ('completed', 'Completed')
        ],
        default='pending'
    )

    def __str__(self):
        return f"Booking for {self.room} from {self.start_date} to {self.end_date}"


class RoomImage(models.Model):
    room = models.ForeignKey(
        Room,
        related_name='images',
        on_delete=models.CASCADE
    )
    image = models.ImageField(
        upload_to='room_images/',
    )

    def __str__(self):
        return f"Image for {self.room}"


class FavoriteHotel(models.Model):
    """
    Model to store a user's favorite hotels.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='favorite_hotels'
    )
    hotel = models.ForeignKey(
        Hotel,
        on_delete=models.CASCADE,
        related_name='favorited_by'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'hotel')

    def __str__(self):
        return f"{self.user.username}'s favorite: {self.hotel.name}"


class Review(models.Model):
    """
    Model for storing user reviews and ratings for hotels.
    """
    hotel = models.ForeignKey(
        Hotel,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    rating = models.IntegerField(
        choices=[(i, i) for i in range(1, 6)],
        help_text="Rating from 1 to 5"
    )
    comment = models.TextField(
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        unique_together = ('hotel', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.user.username} for {self.hotel.name}"
