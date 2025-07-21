from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from accounts.models import HotelProfile
from accounts.serializers import HotelProfileSerializer

class HotelListView(APIView):
    """
    Provides a list of all hotels registered on the platform.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        """
        Handles the GET request to retrieve all hotel profiles.
        """
        try:
            # Retrieve all hotel profiles
            hotels = HotelProfile.objects.all()
            
            # Serialize the hotel data
            # The 'context' is passed to the serializer to construct full image URLs
            serializer = HotelProfileSerializer(hotels, many=True, context={'request': request})
            
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            # Handle potential exceptions, e.g., database errors
            return Response(
                {'error': f'An unexpected error occurred: {e}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            