from datetime import date
from rest_framework import serializers
from .models import Hotel, HotelImage, Room, Booking, RoomImage, FavoriteHotel, Review, Feature
from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()

class ReviewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role']

class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ['id', 'name', 'is_amenity']


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
    user = ReviewUserSerializer(read_only=True)
    hotel = serializers.PrimaryKeyRelatedField(
        queryset=Hotel.objects.all(),
        write_only=True
    )
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'hotel', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']

    def validate(self, data):
        print("Validating review data:", data)  # Debug print
        if 'hotel' not in data:
            raise serializers.ValidationError({"hotel": "This field is required."})
        if 'rating' not in data:
            raise serializers.ValidationError({"rating": "This field is required."})
        if not isinstance(data['rating'], int) or not (1 <= data['rating'] <= 5):
            raise serializers.ValidationError({"rating": "Rating must be an integer between 1 and 5."})
        if 'comment' not in data or not data['comment'].strip():
            raise serializers.ValidationError({"comment": "This field is required and cannot be empty."})
        return data

    def create(self, validated_data):
        print("Creating review with data:", validated_data)  # Debug print
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError({"detail": "You have already reviewed this hotel."})
        except Exception as e:
            print("Error creating review:", str(e))  # Debug print
            raise

class HotelSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    features = FeatureSerializer(many=True, read_only=True)
    amenities = serializers.SerializerMethodField()
    rooms = RoomSerializer(many=True, read_only=True)
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = [
            'id', 'name', 'stars', 'price_per_night', 'availability_start_date',
            'availability_end_date', 'features', 'amenities', 'address', 'website',
            'description', 'guest_score', 'distance_to_center', 'contact_phone',
            'contact_email', 'number_of_adults', 'check_in_time', 'check_out_time',
            'images', 'rooms', 'photo_url'
        ]

    def get_images(self, obj):
        return [{'id': img.id, 'image': img.image.url} for img in obj.images.all()]

    def get_photo_url(self, obj):
        if obj.images.exists():
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.images.first().image.url)
            return obj.images.first().image.url
        return None

    def get_amenities(self, obj):
        return [
            feature.name for feature in obj.features.filter(is_amenity=True)
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Convert features to just a list of feature names (non-amenities)
        data['features'] = [
            feature['name'] 
            for feature in data['features'] 
            if not feature['is_amenity']
        ]
        return data

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