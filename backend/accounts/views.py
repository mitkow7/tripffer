from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.serializers import RegisterSerializer, UserSerializer, LoginSerializer, PasswordChangeSerializer
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from datetime import timedelta
from accounts.models import UserProfile, HotelProfile


class RegisterView(APIView):
    """
    View to handle user registration.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
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

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            # Pass both email as username and email to support both login methods
            user = authenticate(request, username=email, email=email, password=password)
            remember_me = serializer.validated_data.get('remember_me', False)
            
            if user is not None:
                refresh = RefreshToken.for_user(user)
                if remember_me:
                    refresh.set_exp(lifetime=timedelta(days=30))
                    refresh.access_token.set_exp(lifetime=timedelta(days=7))
                else:
                    refresh.set_exp(lifetime=timedelta(days=7))
                    refresh.access_token.set_exp(lifetime=timedelta(hours=12))
                return Response({
                    'user': UserSerializer(user).data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
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
        is_settings_update = request.headers.get('X-Settings-Update', 'false') == 'true'
        
        # Handle regular profile picture
        profile_picture = request.FILES.get('profile_picture')
        if profile_picture and is_settings_update:
            if not hasattr(request.user, 'profile'):
                UserProfile.objects.create(user=request.user)
            request.user.profile.profile_picture = profile_picture
            request.user.profile.save()

        # Handle hotel image
        hotel_image = request.FILES.get('hotel_profile.hotel_image')
        if hotel_image and is_settings_update and request.user.role == 'HOTEL':
            if not hasattr(request.user, 'hotel_profile'):
                HotelProfile.objects.create(user=request.user)
            request.user.hotel_profile.hotel_image = hotel_image
            request.user.hotel_profile.save()

        serializer = UserSerializer(request.user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

