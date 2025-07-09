from django.db import models
from django.contrib.auth.models import AbstractUser
from accounts.validators import PhoneNumberValidator


class AppUser(AbstractUser):
    """
    Custom user model that extends Django's AbstractUser.
    """

    first_name = models.CharField(
        max_length=30,
    )

    last_name = models.CharField(
        max_length=30,
    )

    email = models.EmailField(
        unique=True,
        error_messages={
            "unique": "A user with that email already exists.",
        },
    )

    is_email_verified = models.BooleanField(
        default=False,
    )

    email_verification_token = models.CharField(
        max_length=255,
        blank=True,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name", "last_name"]


class UserProfile(models.Model):
    """
    User profile model that extends the AppUser model.
    """

    user = models.OneToOneField(
        AppUser,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    phone_number = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        validators=[
            PhoneNumberValidator(),
        ]
    )

    date_of_birth = models.DateField(
        blank=True,
        null=True,
    )

    bio = models.TextField(
        blank=True,
        null=True,
    )

    profile_picture = models.ImageField(
        upload_to="profile_pictures/",
        blank=True,
        null=True,
    )

    def __str__(self):
        return f"{self.user.username}'s Profile"

