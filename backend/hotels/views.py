from datetime import datetime
from rest_framework import generics, viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import Hotel, Room, Booking, FavoriteHotel, Review
from .serializers import (
    HotelSerializer, 
    RoomSerializer, 
    BookingSerializer, 
    FavoriteHotelSerializer,
    ReviewSerializer
)
from rest_framework import viewsets, permissions
from rest_framework import serializers
from .models import RoomImage
from rest_framework.decorators import action
from datetime import datetime
from django.db import IntegrityError
from .models import Feature

class HotelViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A simple ViewSet for viewing hotels.
    """
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        try:
            # Get all query parameters
            city = self.request.query_params.get('city')
            beds_str = self.request.query_params.get('beds')
            adults_str = self.request.query_params.get('adults')
            check_in_str = self.request.query_params.get('check_in')
            check_out_str = self.request.query_params.get('check_out')

            # Start with all hotels
            queryset = Hotel.objects.all()

            # Display only approved hotels to non-admin users
            user = getattr(self.request, 'user', None)
            if not user or not getattr(user, 'is_staff', False):
                queryset = queryset.filter(is_approved=True)

            # Filter by city first (if provided)
            if city:
                queryset = queryset.filter(address__icontains=city)

            # Only apply room-based filters if room search parameters are provided
            if any([beds_str, adults_str, check_in_str, check_out_str]):
                # Start with a base queryset of all rooms
                eligible_rooms = Room.objects.all()

                # Filter rooms by bed count
                if beds_str and beds_str.isdigit():
                    eligible_rooms = eligible_rooms.filter(bed_count__gte=int(beds_str))

                # Filter rooms by adult capacity
                if adults_str and adults_str.isdigit():
                    eligible_rooms = eligible_rooms.filter(max_adults__gte=int(adults_str))

                # Exclude rooms that are unavailable for the selected dates
                if check_in_str and check_out_str:
                    try:
                        check_in_date = datetime.strptime(check_in_str, '%Y-%m-%d').date()
                        check_out_date = datetime.strptime(check_out_str, '%Y-%m-%d').date()

                        # Find IDs of rooms that have conflicting bookings
                        booked_room_ids = Booking.objects.filter(
                            start_date__lt=check_out_date,
                            end_date__gt=check_in_date
                        ).values_list('room_id', flat=True)

                        # Exclude these booked rooms
                        eligible_rooms = eligible_rooms.exclude(id__in=booked_room_ids)
                    except (ValueError, TypeError):
                        # Ignore invalid date formats
                        pass
                
                # Get the IDs of hotels that have at least one eligible room
                hotel_ids_with_available_rooms = eligible_rooms.values_list('hotel_id', flat=True).distinct()

                # Filter to only include hotels that have available rooms matching the criteria
                queryset = queryset.filter(id__in=hotel_ids_with_available_rooms)

            return queryset.distinct()
        except Exception as e:
            print(f"Error in get_queryset: {str(e)}")  # Log the error
            return Hotel.objects.none()  # Return empty queryset on error


class MyHotelView(viewsets.ViewSet):
    """
    ViewSet for managing the hotel associated with the current user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        """
        Get the hotel associated with the current user.
        """
        try:
            if hasattr(request.user, 'hotel'):
                serializer = HotelSerializer(request.user.hotel, context={'request': request})
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(
                {"error": "No hotel found for this user."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=['put'])
    def update_hotel(self, request):
        """
        Update the hotel associated with the current user.
        """
        try:
            if not hasattr(request.user, 'hotel'):
                return Response(
                    {"error": "No hotel found for this user."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            
            hotel = request.user.hotel
            serializer = HotelSerializer(hotel, data=request.data, partial=True, context={'request': request})
            
            if serializer.is_valid():
                serializer.save()

                # Handle updating features from a comma-separated list of names
                features_input = request.data.get('features')
                if features_input is not None:
                    try:
                        if isinstance(features_input, list):
                            feature_names = [str(name).strip() for name in features_input if str(name).strip()]
                        else:
                            feature_names = [name.strip() for name in str(features_input).split(',') if name.strip()]

                        # Create or fetch Feature objects for non-amenities
                        non_amenity_features = []
                        for name in feature_names:
                            feature_obj, _ = Feature.objects.get_or_create(
                                name=name,
                                defaults={'is_amenity': False}
                            )
                            # If an existing amenity with same name exists but marked as amenity,
                            # we keep its current is_amenity flag.
                            non_amenity_features.append(feature_obj)

                        # Preserve existing amenities and only replace non-amenity features
                        existing_amenities = hotel.features.filter(is_amenity=True)
                        combined_features = list(existing_amenities) + non_amenity_features
                        hotel.features.set(combined_features)
                    except Exception as e:
                        return Response(
                            {"error": f"Failed to update features: {str(e)}"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                
                # Handle image uploads
                images_data = request.FILES.getlist('images')
                if images_data:
                    from .models import HotelImage
                    import logging
                    logger = logging.getLogger(__name__)
                    
                    for image_data in images_data:
                        try:
                            hotel_image = HotelImage.objects.create(hotel=hotel, image=image_data)
                            logger.info(f"Successfully created hotel image: {hotel_image.image.url}")
                        except Exception as e:
                            logger.error(f"Failed to save hotel image: {str(e)}")
                            return Response(
                                {"error": f"Failed to save image: {str(e)}"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                            )
                # Re-serialize to reflect updated features/images
                refreshed = HotelSerializer(hotel, context={'request': request})
                return Response(refreshed.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=['get'])
    def bookings(self, request):
        """
        Get all bookings for the hotel.
        """
        try:
            if not hasattr(request.user, 'hotel'):
                return Response(
                    {"error": "No hotel found for this user."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            
            # Get all rooms for this hotel
            rooms = request.user.hotel.rooms.all()
            # Get all bookings for these rooms
            bookings = Booking.objects.filter(room__in=rooms).order_by('-start_date')
            serializer = BookingSerializer(bookings, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class BookingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows bookings to be viewed or edited.
    """
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Booking.objects.all()
        user = getattr(self.request, 'user', None)
        if user and getattr(user, 'is_authenticated', False):
            if hasattr(user, 'hotel'):
                # If user is a hotel owner, return bookings for their hotel
                rooms = user.hotel.rooms.all()
                return queryset.filter(room__in=rooms)
            # If user is a regular user, return their bookings
            return queryset.filter(user=user)
        return Booking.objects.none()

    def perform_create(self, serializer):
        # Prevent hotel users from creating bookings
        if hasattr(self.request.user, 'hotel'):
            raise serializers.ValidationError({
                "detail": "Hotel owners cannot create bookings. Only guests can book rooms."
            })
            
        room = serializer.validated_data['room']
        start_date = serializer.validated_data['start_date']
        end_date = serializer.validated_data['end_date']

        if start_date >= end_date:
            raise serializers.ValidationError({
                "detail": "Start date must be before end date."
            })

        if start_date < datetime.now().date():
            raise serializers.ValidationError({
                "detail": "Start date cannot be in the past."
            })

        if end_date < datetime.now().date():
            raise serializers.ValidationError({
                "detail": "End date cannot be in the past."
            })

        if not room.is_available(start_date, end_date):
            raise serializers.ValidationError({
                "detail": "This room is not available for the selected dates."
            })
            
        serializer.save(user=self.request.user, status='pending')

    def partial_update(self, request, *args, **kwargs):
        booking = self.get_object()
        
        # Only allow hotel owners to update status
        if not hasattr(request.user, 'hotel') or booking.room.hotel != request.user.hotel:
            return Response(
                {"error": "You don't have permission to update this booking."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Only allow updating the status field
        if 'status' not in request.data:
            return Response(
                {"error": "Only status field can be updated."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate status value
        valid_statuses = ['pending', 'confirmed', 'cancelled', 'completed']
        if request.data['status'] not in valid_statuses:
            return Response(
                {"error": f"Status must be one of: {', '.join(valid_statuses)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return super().partial_update(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def reschedule(self, request, pk=None):
        """
        Reschedule a booking to a new date range.
        """
        booking = self.get_object()
        start_date_str = request.data.get('start_date')
        end_date_str = request.data.get('end_date')

        if not start_date_str or not end_date_str:
            return Response(
                {"detail": "Both start_date and end_date are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {"detail": "Invalid date format. Use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not booking.room.is_available(start_date, end_date, booking_id=booking.id):
            return Response(
                {"detail": "This room is not available for the selected dates."},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.start_date = start_date
        booking.end_date = end_date
        booking.save()
        return Response(BookingSerializer(booking).data)

    def perform_destroy(self, instance):
        """
        Cancel a booking by setting its status to 'cancelled'.
        """
        instance.status = 'cancelled'
        instance.save()
            
class RoomViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows rooms to be viewed or edited.
    """
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the rooms
        for the currently authenticated user's hotel.
        """
        user = getattr(self.request, 'user', None)
        if user and hasattr(user, 'hotel'):
            return Room.objects.filter(hotel=user.hotel)
        return Room.objects.none()

    def perform_create(self, serializer):
        """
        Associate the room with the logged-in user's hotel.
        """
        if hasattr(self.request.user, 'hotel'):
            room = serializer.save(hotel=self.request.user.hotel)
            images_data = self.request.FILES.getlist('images')
            for image_data in images_data:
                RoomImage.objects.create(room=room, image=image_data)
        else:
            raise serializers.ValidationError("You are not associated with a hotel.")

    def update(self, request, *args, **kwargs):
        """
        Update a room's details and add new images.
        """
        room = self.get_object()
        serializer = self.get_serializer(room, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        images_data = self.request.FILES.getlist('images')
        for image_data in images_data:
            RoomImage.objects.create(room=room, image=image_data)

        return Response(serializer.data)

    @action(detail=True, methods=['delete'], url_path='images/(?P<image_id>[^/.]+)')
    def delete_image(self, request, pk=None, image_id=None):
        """
        Delete a specific image from a room.
        """
        room = self.get_object()
        try:
            image = room.images.get(id=image_id)
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except RoomImage.DoesNotExist:
            return Response(
                {"error": "Image not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
            

class FavoriteHotelViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to view and manage their favorite hotels.
    """
    queryset = FavoriteHotel.objects.all()
    serializer_class = FavoriteHotelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the favorite hotels
        for the currently authenticated user.
        """
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """
        Create a new favorite hotel entry.
        """
        # Get the hotel ID from the request data
        hotel_id = request.data.get('hotel')
        if not hotel_id:
            return Response(
                {"detail": "Hotel ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Get the hotel instance
            hotel = Hotel.objects.get(id=hotel_id)
        except Hotel.DoesNotExist:
            return Response(
                {"detail": "Hotel not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            # Create the favorite
            favorite = FavoriteHotel.objects.create(
                user=request.user,
                hotel=hotel
            )
            serializer = self.get_serializer(favorite)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response(
                {"detail": "This hotel is already in your favorites."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"detail": "Failed to add hotel to favorites."},
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_create(self, serializer):
        """
        Associate the favorite hotel with the logged-in user.
        """
        serializer.save(user=self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows reviews to be viewed, created, or edited.
    """
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Review.objects.all()
        hotel_id = self.request.query_params.get('hotel_id')
        if hotel_id:
            queryset = queryset.filter(hotel_id=hotel_id)
        return queryset

    def create(self, request, *args, **kwargs):
        """
        Create a review with detailed error handling.
        If a review already exists, update it instead.
        """
        print("Received review data:", request.data)  # Debug print
        
        existing_review = None  # Initialize the variable
        
        # Check if review already exists
        try:
            existing_review = Review.objects.get(
                user=request.user,
                hotel_id=request.data.get('hotel')
            )
            print("Found existing review, updating...")  # Debug print
            serializer = self.get_serializer(existing_review, data=request.data)
        except Review.DoesNotExist:
            print("Creating new review...")  # Debug print
            serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            print("Serializer validated data:", serializer.validated_data)  # Debug print
            
            if existing_review:
                self.perform_update(serializer)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                self.perform_create(serializer)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
                
        except serializers.ValidationError as e:
            print("Validation error:", e.detail)  # Debug print
            return Response({"detail": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Unexpected error:", str(e))  # Debug print
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_create(self, serializer):
        """
        Associate the review with the logged-in user.
        """
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            print("Error in perform_create:", str(e))  # Debug print
            raise

    def perform_update(self, serializer):
        """
        Update the existing review.
        """
        try:
            serializer.save()
        except Exception as e:
            print("Error in perform_update:", str(e))  # Debug print
            raise
            