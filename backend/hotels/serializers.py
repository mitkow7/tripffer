from datetime import date
from rest_framework import serializers
from .models import Hotel, HotelImage, Room, Booking, RoomImage, FavoriteHotel, Review

class AmenitiesField(serializers.Field):
    def to_representation(self, value):
        if value:
            return [amenity.strip() for amenity in value.split(',')]
        return []

    def to_internal_value(self, data):
        if isinstance(data, list):
            return ','.join(str(item) for item in data)
        return str(data)

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelImage
        fields = ('id', 'image')

class RoomImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomImage
        fields = ('id', 'image')

class RoomSerializer(serializers.ModelSerializer):
    images = RoomImageSerializer(many=True, read_only=True)
    hotel_name = serializers.CharField(source='hotel.name', read_only=True)
    hotel_address = serializers.CharField(source='hotel.address', read_only=True)
    hotel_id = serializers.IntegerField(source='hotel.id', read_only=True)

    class Meta:
        model = Room
        fields = ('id', 'price', 'description', 'bed_count', 'max_adults', 'room_type', 'images', 'hotel_name', 'hotel_address', 'hotel_id')

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Review
        fields = ('id', 'user', 'rating', 'comment', 'created_at')

class HotelSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    rooms = RoomSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    photo_url = serializers.SerializerMethodField()
    amenities = AmenitiesField()

    class Meta:
        model = Hotel
        fields = (
            'id', 'name', 'stars', 'address', 'website', 'description', 
            'price_per_night', 'availability_start_date', 'availability_end_date', 
            'features', 'images', 'rooms', 'photo_url', 'guest_score', 
            'distance_to_center', 'amenities', 'contact_phone', 'contact_email',
            'number_of_adults', 'check_in_time', 'check_out_time', 'reviews'
        )

    def get_photo_url(self, obj):
        if obj.images.exists():
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.images.first().image.url)
            return obj.images.first().image.url
        return None

class BookingSerializer(serializers.ModelSerializer):
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = ('id', 'user', 'room', 'start_date', 'end_date', 'status', 'total_price')
        read_only_fields = ('user',)

    def get_total_price(self, obj):
        if obj.start_date and obj.end_date and obj.room and obj.room.price:
            num_nights = (obj.end_date - obj.start_date).days
            if num_nights > 0:
                return num_nights * obj.room.price
        return 0

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.room:
            representation['room'] = RoomSerializer(instance.room).data
        return representation


class FavoriteHotelSerializer(serializers.ModelSerializer):
    """
    Serializer for the FavoriteHotel model.
    """
    hotel = HotelSerializer(read_only=True)
    hotel_id = serializers.PrimaryKeyRelatedField(
        queryset=Hotel.objects.all(),
        write_only=True,
        source='hotel'
    )

    class Meta:
        model = FavoriteHotel
        fields = ('id', 'user', 'hotel', 'hotel_id', 'created_at')
        read_only_fields = ('user', 'created_at')