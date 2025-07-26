from django.db import models
from django.contrib.auth.models import AbstractUser
from accounts.validators import PhoneNumberValidator


class UserType(models.TextChoices):
    USER = "USER", "User"
    HOTEL = "HOTEL", "Hotel"


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

    role = models.CharField(
        max_length=10,
        choices=UserType.choices,
        default=UserType.USER,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    @property
    def is_hotel(self):
        return self.role == UserType.HOTEL


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

    @property
    def full_name(self):
        return f"{self.user.first_name} {self.user.last_name}"

    def __str__(self):
        return f"{self.full_name}'s Profile"