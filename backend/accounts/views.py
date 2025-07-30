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


class RegisterView(APIView):
    """
    View to handle user registration.
    """
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        # Create a mutable copy of the data
        data = request.data.copy()
        
        # Extract hotel data if present
        hotel_data = data.pop('hotel', None)
        
        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            
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
                except Exception as e:
                    # If hotel creation fails, rollback the transaction
                    raise serializers.ValidationError({
                        'hotel': str(e)
                    })
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView):
    """
    View to handle user login.
    """
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(email=email, password=password)
            
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': UserSerializer(user).data
                })
            
            return Response(
                {'error': 'Email or password is incorrect'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
    if request.method == 'GET':
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Ensure user has a profile
        if not hasattr(request.user, 'profile'):
            UserProfile.objects.create(user=request.user)

        # Handle profile picture
        profile_picture = request.FILES.get('profile_picture')
        if profile_picture:
            request.user.profile.profile_picture = profile_picture
            request.user.profile.save()

        # Handle profile data
        profile_data = {}
        for field in ['phone_number', 'date_of_birth', 'bio']:
            if field in request.data:
                profile_data[field] = request.data[field]
        
        if profile_data:
            for key, value in profile_data.items():
                setattr(request.user.profile, key, value)
            request.user.profile.save()

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

