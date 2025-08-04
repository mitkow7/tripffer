from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'profile']
        read_only_fields = ['role']

    def get_profile(self, obj):
        try:
            if not hasattr(obj, 'profile'):
                from accounts.models import UserProfile
                UserProfile.objects.create(user=obj)
                obj.refresh_from_db()

            # Get profile picture URL properly
            profile_picture_url = None
            if obj.profile.profile_picture:
                try:
                    profile_picture_url = obj.profile.profile_picture.url
                except Exception:
                    # If URL generation fails (e.g., file doesn't exist), return None
                    profile_picture_url = None

            return {
                'id': obj.profile.id,
                'phone_number': obj.profile.phone_number or '',
                'date_of_birth': obj.profile.date_of_birth or None,
                'bio': obj.profile.bio or '',
                'profile_picture': profile_picture_url
            }
        except Exception as e:
            # Log the error for debugging
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error getting profile for user {obj.id}: {str(e)}")
            # Return a default profile if there's an error
            return {
                'id': None,
                'phone_number': '',
                'date_of_birth': None,
                'bio': '',
                'profile_picture': None
            }

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'password_confirm', 'first_name', 'last_name', 'role']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        try:
            validate_password(attrs['password'])
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})

        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        # Use email as username
        validated_data['username'] = validated_data['email']
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    new_password_confirm = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        
        try:
            validate_password(attrs['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})

        return attrs