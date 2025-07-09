from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.serializers import RegisterSerializer, UserSerializer, LoginSerializer
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from datetime import timedelta
from accounts.models import UserProfile


class RegisterView(APIView):
    """
    View to handle user registration.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        print("Registration data received:", request.data)  # Debug print
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        print("Registration validation errors:", serializer.errors)  # Debug print
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
            user = authenticate(request, email=email, password=password)
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
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    """
    View to get the authenticated user's details.
    """
    serializer = UserSerializer(request.user, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


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
        profile_picture = request.FILES.get('profile_picture')

        if profile_picture and not is_settings_update:
            return Response(
                {"error": "Profile picture can only be updated from settings"},
                status=status.HTTP_403_FORBIDDEN
            )

        if profile_picture and is_settings_update:
            if not hasattr(request.user, 'profile'):
                UserProfile.objects.create(user=request.user)
            request.user.profile.profile_picture = profile_picture
            request.user.profile.save()

        serializer = UserSerializer(request.user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
