from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from datetime import date, timedelta
from .models import Hotel, Room, Booking, Review, Feature
from .choices import RoomType

User = get_user_model()

class HotelModelTests(TestCase):
    def setUp(self):
        self.hotel_user = User.objects.create_user(
            email='hotel@example.com',
            username='hotel@example.com',  # Set email as username
            password='testpass123',
            first_name='Hotel',
            last_name='Owner',
            role='HOTEL'
        )
        self.hotel = Hotel.objects.create(
            user=self.hotel_user,
            name='Test Hotel',
            stars=4,
            address='123 Test St',
            description='A test hotel'
        )

    def test_hotel_creation(self):
        """Test creating a new hotel"""
        self.assertEqual(self.hotel.name, 'Test Hotel')
        self.assertEqual(self.hotel.stars, 4)
        self.assertEqual(self.hotel.user, self.hotel_user)
        self.assertFalse(self.hotel.is_approved)

    def test_hotel_str_method(self):
        """Test the string representation of the hotel"""
        self.assertEqual(str(self.hotel), 'Test Hotel')

    def test_update_average_price(self):
        """Test updating average price when rooms are added"""
        Room.objects.create(
            hotel=self.hotel,
            price=100,
            bed_count=1,
            room_type=RoomType.SINGLE
        )
        Room.objects.create(
            hotel=self.hotel,
            price=200,
            bed_count=2,
            room_type=RoomType.DOUBLE
        )
        self.hotel.update_average_price()
        self.assertEqual(self.hotel.price_per_night, 150)

class RoomModelTests(TestCase):
    def setUp(self):
        self.hotel_user = User.objects.create_user(
            email='hotel@example.com',
            username='hotel@example.com',  # Set email as username
            password='testpass123',
            role='HOTEL'
        )
        self.hotel = Hotel.objects.create(
            user=self.hotel_user,
            name='Test Hotel',
            stars=4,
            address='123 Test St'
        )
        self.room = Room.objects.create(
            hotel=self.hotel,
            price=100,
            bed_count=2,
            max_adults=2,
            room_type=RoomType.DOUBLE
        )

    def test_room_creation(self):
        """Test creating a new room"""
        self.assertEqual(self.room.price, 100)
        self.assertEqual(self.room.bed_count, 2)
        self.assertEqual(self.room.room_type, RoomType.DOUBLE)

    def test_room_availability(self):
        """Test room availability checking"""
        start_date = date.today()
        end_date = start_date + timedelta(days=2)
        
        # Room should be available initially
        self.assertTrue(self.room.is_available(start_date, end_date))
        
        # Create a booking
        Booking.objects.create(
            room=self.room,
            user=self.hotel_user,
            start_date=start_date,
            end_date=end_date
        )
        
        # Room should not be available for the same dates
        self.assertFalse(self.room.is_available(start_date, end_date))

class BookingModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='user@example.com',
            username='user@example.com',  # Set email as username
            password='testpass123'
        )
        self.hotel_user = User.objects.create_user(
            email='hotel@example.com',
            username='hotel@example.com',  # Set email as username
            password='testpass123',
            role='HOTEL'
        )
        self.hotel = Hotel.objects.create(
            user=self.hotel_user,
            name='Test Hotel',
            stars=4,
            address='123 Test St'
        )
        self.room = Room.objects.create(
            hotel=self.hotel,
            price=100,
            bed_count=2,
            room_type=RoomType.DOUBLE
        )
        self.booking = Booking.objects.create(
            room=self.room,
            user=self.user,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=2)
        )

    def test_booking_creation(self):
        """Test creating a new booking"""
        self.assertEqual(self.booking.user, self.user)
        self.assertEqual(self.booking.room, self.room)
        self.assertEqual(self.booking.status, 'pending')

    def test_booking_str_method(self):
        """Test the string representation of the booking"""
        expected_str = f"Booking for {self.room} from {self.booking.start_date} to {self.booking.end_date}"
        self.assertEqual(str(self.booking), expected_str)

class HotelAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='user@example.com',
            username='user@example.com',  # Set email as username
            password='testpass123'
        )
        self.hotel_user = User.objects.create_user(
            email='hotel@example.com',
            username='hotel@example.com',  # Set email as username
            password='testpass123',
            role='HOTEL'
        )
        self.hotel = Hotel.objects.create(
            user=self.hotel_user,
            name='Test Hotel',
            stars=4,
            address='123 Test St',
            is_approved=True
        )
        self.hotels_url = reverse('hotel-list')
        self.hotel_detail_url = reverse('hotel-detail', args=[self.hotel.id])

    def test_list_hotels(self):
        """Test listing hotels"""
        response = self.client.get(self.hotels_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_search_hotels(self):
        """Test searching hotels"""
        response = self.client.get(f"{self.hotels_url}?city=Test")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        response = self.client.get(f"{self.hotels_url}?city=NonExistent")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_hotel_detail(self):
        """Test retrieving hotel detail"""
        response = self.client.get(self.hotel_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.hotel.name)

class BookingAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='user@example.com',
            username='user@example.com',  # Set email as username
            password='testpass123'
        )
        self.hotel_user = User.objects.create_user(
            email='hotel@example.com',
            username='hotel@example.com',  # Set email as username
            password='testpass123',
            role='HOTEL'
        )
        self.hotel = Hotel.objects.create(
            user=self.hotel_user,
            name='Test Hotel',
            stars=4,
            address='123 Test St'
        )
        self.room = Room.objects.create(
            hotel=self.hotel,
            price=100,
            bed_count=2,
            room_type=RoomType.DOUBLE
        )
        self.client.force_authenticate(user=self.user)
        self.bookings_url = reverse('booking-list')

    def test_create_booking(self):
        """Test creating a new booking"""
        booking_data = {
            'room': self.room.id,
            'start_date': date.today() + timedelta(days=1),
            'end_date': date.today() + timedelta(days=3)
        }
        response = self.client.post(self.bookings_url, booking_data, format='json')  # Use format='json'
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), 1)

    def test_list_user_bookings(self):
        """Test listing user's bookings"""
        Booking.objects.create(
            room=self.room,
            user=self.user,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=2)
        )
        response = self.client.get(self.bookings_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_unauthorized_booking(self):
        """Test booking creation without authentication"""
        self.client.force_authenticate(user=None)
        booking_data = {
            'room': self.room.id,
            'start_date': date.today(),
            'end_date': date.today() + timedelta(days=2)
        }
        response = self.client.post(self.bookings_url, booking_data, format='json')  # Use format='json'
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
