from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile, HotelProfile, UserType, HotelImage

User = get_user_model()

class HotelImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelImage
        fields = ('id', 'image')

class HotelProfileSerializer(serializers.ModelSerializer):
    images = HotelImageSerializer(many=True, read_only=True)
        
    class Meta:
        model = HotelProfile
        fields = ('hotel_name', 'hotel_stars', 'address', 'website', 'description', 'price_per_night', 'availability_start_date', 'availability_end_date', 'features', 'images')

class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None

    class Meta:
        model = UserProfile
        fields = ('phone_number', 'date_of_birth', 'bio', 'profile_picture')

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)
    hotel_profile = HotelProfileSerializer(required=False)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'is_active', 'role', 'profile', 'hotel_profile')
        read_only_fields = ('id', 'date_joined', 'role')
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'email': {'required': False},
        }

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        hotel_profile_data = validated_data.pop('hotel_profile', None)
        
        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update or create profile
        if profile_data:
            profile, created = UserProfile.objects.get_or_create(user=instance)
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()

        if hotel_profile_data and instance.role == UserType.HOTEL:
            images_data = self.context['request'].FILES.getlist('images')
            hotel_profile, created = HotelProfile.objects.get_or_create(user=instance)
            for attr, value in hotel_profile_data.items():
                setattr(hotel_profile, attr, value)
            hotel_profile.save()

            if images_data:
                for image_data in images_data:
                    HotelImage.objects.create(hotel_profile=hotel_profile, image=image_data)

        return instance


class RegisterSerializer(serializers.ModelSerializer):
    hotel_profile = HotelProfileSerializer(required=False)
    password = serializers.CharField(
        write_only=True, 
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'password_confirm', 'role', 'hotel_profile')
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'role': {'required': False}
        }

    def validate_email(self, value):
        """
        Check that the email is unique
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate(self, attrs):
        """
        Check that the two password entries match
        """
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        """
        Create and return a new user instance
        """
        validated_data.pop('password_confirm')
        role = validated_data.pop('role', 'USER')
        hotel_profile_data = validated_data.pop('hotel_profile', None)

        user = User.objects.create_user(**validated_data, role=role)
        
        if role == UserType.HOTEL and hotel_profile_data:
            HotelProfile.objects.create(user=user, **hotel_profile_data)
        else:
            UserProfile.objects.get_or_create(user=user)
            
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True,
        style={'input_type': 'password'}
    )
    remember_me = serializers.BooleanField(required=False, default=False)

    def validate_email(self, value):
        """
        Check that the email exists
        """
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user found with this email address.")
        return value


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        required=True,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    new_password_confirm = serializers.CharField(
        required=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        """
        Check that the two new password entries match
        """
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs

    def validate_old_password(self, value):
        """
        Check that the old password is correct
        """
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value