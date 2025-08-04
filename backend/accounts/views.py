from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.serializers import RegisterSerializer, UserSerializer, LoginSerializer, PasswordChangeSerializer
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from datetime import timedelta
from accounts.models import UserProfile
from hotels.models import Hotel, HotelImage
from django.db import transaction
from rest_framework import serializers
from .utils import send_welcome_email
from django.contrib.auth import get_user_model
import logging

logger = logging.getLogger('accounts')


UserModel = get_user_model()


class RegisterView(APIView):
    """
    View to handle user registration.
    """
    authentication_classes = []  # No authentication needed for registration
    permission_classes = [AllowAny]  # Allow any user to register

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            # Create a mutable copy of the data
            data = request.data.copy()
            
            # Extract hotel data if present
            hotel_data = data.pop('hotel', None)
            
            # Validate registration data
            serializer = RegisterSerializer(data=data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            try:
                user = serializer.save()
            except Exception as user_error:
                return Response({
                    'error': 'Failed to create user',
                    'detail': str(user_error)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Create hotel if user role is HOTEL and hotel data is provided
            if user.role == 'HOTEL' and hotel_data:
                try:
                    hotel = Hotel.objects.create(
                        user=user,
                        name=hotel_data.get('name', ''),
                        address=hotel_data.get('address', ''),
                        website=hotel_data.get('website', ''),
                        description=hotel_data.get('description', '')
                    )
                    
                    # Add amenities
                    if 'amenities' in hotel_data:
                        hotel.amenities = hotel_data['amenities']
                        hotel.save()
                except Exception as hotel_error:
                    # If hotel creation fails, rollback the transaction
                    return Response({
                        'error': 'Failed to create hotel',
                        'detail': str(hotel_error)
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Send welcome email
            try:
                send_welcome_email(user)
            except Exception:
                # Silently continue if welcome email fails
                pass
            
            try:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': UserSerializer(user).data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_201_CREATED)
            except Exception as token_error:
                return Response({
                    'error': 'Failed to generate authentication tokens',
                    'detail': str(token_error)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            return Response({
                'error': 'Registration failed',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class LoginView(APIView):
    """
    View to handle user login.
    """
    authentication_classes = []  # No authentication needed for login
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        try:
            # Remove any existing auth headers to prevent interference
            if 'HTTP_AUTHORIZATION' in request.META:
                del request.META['HTTP_AUTHORIZATION']
            
            # Validate request data
            serializer = self.serializer_class(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            # Check if user exists
            try:
                user = UserModel.objects.get(email=email)
            except UserModel.DoesNotExist:
                return Response(
                    {'error': 'No user found with this email'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            except Exception as e:
                return Response(
                    {'error': 'Database error', 'detail': str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Try to authenticate
            try:
                logger.info(f"Login attempt for email: {email}")
                authenticated_user = authenticate(
                    request=request,
                    username=email,  # Django might use username internally
                    email=email,
                    password=password
                )
                logger.info(f"Authentication result for {email}: {'success' if authenticated_user else 'failed'}")
                
                if authenticated_user is None:
                    # Check if password is correct
                    if user.check_password(password):
                        logger.error(f"Password correct but authentication failed for {email}")
                    return Response(
                        {'error': 'Invalid email or password'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
                if not authenticated_user.is_active:
                    logger.warning(f"Login attempt by inactive user: {email}")
                    return Response(
                        {'error': 'This account is inactive'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
            except Exception as auth_error:
                print(f"Authentication error: {str(auth_error)}")  # Debug log
                return Response(
                    {'error': 'Authentication failed', 'detail': str(auth_error)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Generate tokens
            try:
                logger.info(f"Creating/verifying profile for user: {authenticated_user.email}")
                # Ensure user has a profile before serializing
                if not hasattr(authenticated_user, 'profile'):
                    UserProfile.objects.create(user=authenticated_user)
                    authenticated_user.refresh_from_db()

                logger.info(f"Generating tokens for user: {authenticated_user.email}")
                # Generate tokens
                refresh = RefreshToken.for_user(authenticated_user)
                
                logger.info(f"Serializing user data for: {authenticated_user.email}")
                # Serialize user data
                user_data = UserSerializer(authenticated_user).data
                
                response_data = {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': user_data
                }
                logger.info(f"Login successful for user: {authenticated_user.email}")
                return Response(response_data)
            except Exception as token_error:
                logger.error(f"Token/serialization error for {authenticated_user.email}: {str(token_error)}")
                return Response(
                    {'error': 'Failed to generate tokens', 'detail': str(token_error)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
        except Exception as e:
            return Response(
                {'error': 'Login failed', 'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PasswordChangeSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({'detail': 'Password successfully changed'}, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    GET: Get the authenticated user's profile
    PUT: Update the authenticated user's profile
    """
    try:
        if request.method == 'GET':
            # Ensure user has a profile
            if not hasattr(request.user, 'profile'):
                UserProfile.objects.create(user=request.user)
                request.user.refresh_from_db()
            
            serializer = UserSerializer(request.user, context={'request': request})
            return Response(serializer.data)
        
        elif request.method == 'PUT':
            # Ensure user has a profile
            if not hasattr(request.user, 'profile'):
                UserProfile.objects.create(user=request.user)
                request.user.refresh_from_db()

            # Handle profile data first
            profile_data = {}
            for field in ['phone_number', 'bio']:
                if field in request.data:
                    profile_data[field] = request.data[field]
            
            # Handle date_of_birth separately with validation
            if 'date_of_birth' in request.data:
                date_value = request.data['date_of_birth']
                # Set to None if empty string, null, or undefined
                if not date_value or date_value in ['', 'null', 'undefined']:
                    profile_data['date_of_birth'] = None
                else:
                    try:
                        # Validate date format
                        from datetime import datetime
                        datetime.strptime(date_value, '%Y-%m-%d')
                        profile_data['date_of_birth'] = date_value
                    except ValueError:
                        return Response(
                            {'date_of_birth': ['Invalid date format. Use YYYY-MM-DD format.']},
                            status=status.HTTP_400_BAD_REQUEST
                        )

            # Update profile data first
            if profile_data:
                for key, value in profile_data.items():
                    setattr(request.user.profile, key, value)
                request.user.profile.save()

            # Handle profile picture with better error handling
            try:
                profile_picture = request.FILES.get('profile_picture')
                if profile_picture:
                    # Delete old profile picture if it exists
                    if request.user.profile.profile_picture:
                        request.user.profile.profile_picture.delete(save=False)
                    # Save new profile picture
                    request.user.profile.profile_picture = profile_picture
                    request.user.profile.save()
                    logger.info(f"Profile picture updated for user: {request.user.email}")
            except Exception as e:
                # Log the error and return it to the client
                error_msg = f"Error handling profile picture: {str(e)}"
                logger.error(error_msg)
                return Response(
                    {'error': error_msg},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Handle user data
            user_data = {}
            for field in ['first_name', 'last_name', 'email']:
                if field in request.data:
                    user_data[field] = request.data[field]

            if user_data:
                serializer = UserSerializer(request.user, data=user_data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Return updated user data
            serializer = UserSerializer(request.user, context={'request': request})
            return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class DeleteAccountView(APIView):
    """
    View to handle account deletion.
    """
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def delete(self, request):
        user = request.user
        
        # Delete associated hotel if user is a hotel owner
        if user.role == "HOTEL":
            try:
                hotel = Hotel.objects.get(user=user)
                hotel.delete()
            except Hotel.DoesNotExist:
                pass

        # Delete user profile and user
        if hasattr(user, 'profile'):
            user.profile.delete()
        user.delete()

        return Response({"detail": "Account successfully deleted"}, status=status.HTTP_200_OK)