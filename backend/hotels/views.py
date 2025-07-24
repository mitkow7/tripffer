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
        # Get all query parameters
        city = self.request.query_params.get('city')
        beds_str = self.request.query_params.get('beds')
        adults_str = self.request.query_params.get('adults')
        check_in_str = self.request.query_params.get('check_in')
        check_out_str = self.request.query_params.get('check_out')

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

        # Start with the base hotel queryset
        queryset = Hotel.objects.all()

        # Filter by city
        if city:
            queryset = queryset.filter(address__icontains=city)

        # Final filtering: only include hotels that have available rooms matching the criteria
        queryset = queryset.filter(id__in=hotel_ids_with_available_rooms)

        return queryset.distinct()


class MyHotelView(APIView):
    """
    API view for managing the hotel associated with the current user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            hotel = Hotel.objects.get(user=request.user)
            serializer = HotelSerializer(hotel, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Hotel.DoesNotExist:
            return Response(
                {"error": "Hotel not found for this user."},
                status=status.HTTP_404_NOT_FOUND,
            )
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
        if self.request.user.is_authenticated:
            queryset = queryset.filter(user=self.request.user)
        return queryset

    def perform_create(self, serializer):
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
            
        serializer.save(user=self.request.user, status='confirmed')

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
        user = self.request.user
        if hasattr(user, 'hotel'):
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

    def perform_create(self, serializer):
        """
        Associate the review with the logged-in user and a hotel.
        """
        hotel_id = self.request.data.get('hotel_id')
        try:
            hotel = Hotel.objects.get(id=hotel_id)
            serializer.save(user=self.request.user, hotel=hotel)
        except IntegrityError:
            raise serializers.ValidationError({"detail": "You have already reviewed this hotel."})
        except Hotel.DoesNotExist:
            raise serializers.ValidationError({"detail": "Hotel not found."})
            