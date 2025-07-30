from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import UserProfile, UserType

User = get_user_model()

class UserModelTests(TestCase):
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'username': 'test@example.com'  # Set email as username
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_create_user(self):
        """Test creating a new user"""
        self.assertEqual(self.user.email, self.user_data['email'])
        self.assertEqual(self.user.username, self.user_data['email'])  # Username should match email
        self.assertEqual(self.user.first_name, self.user_data['first_name'])
        self.assertEqual(self.user.last_name, self.user_data['last_name'])
        self.assertTrue(self.user.check_password(self.user_data['password']))
        self.assertEqual(self.user.role, UserType.USER)
        self.assertFalse(self.user.is_staff)
        self.assertFalse(self.user.is_superuser)

    def test_create_superuser(self):
        """Test creating a new superuser"""
        admin_user = User.objects.create_superuser(
            email='admin@example.com',
            username='admin@example.com',  # Set email as username
            password='admin123',
            first_name='Admin',
            last_name='User'
        )
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)

    def test_user_str_method(self):
        """Test the string representation of the user"""
        self.assertEqual(str(self.user.email), self.user_data['email'])

    def test_user_profile_creation(self):
        """Test that a UserProfile is created automatically"""
        self.assertTrue(hasattr(self.user, 'profile'))
        self.assertIsInstance(self.user.profile, UserProfile)

class UserProfileTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            username='test@example.com',  # Set email as username
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.profile = self.user.profile

    def test_profile_str_method(self):
        """Test the string representation of the profile"""
        expected_str = f"{self.user.first_name} {self.user.last_name}'s Profile"
        self.assertEqual(str(self.profile), expected_str)

    def test_profile_full_name(self):
        """Test the full_name property"""
        expected_name = f"{self.user.first_name} {self.user.last_name}"
        self.assertEqual(self.profile.full_name, expected_name)

class AuthenticationAPITests(APITestCase):
    def setUp(self):
        self.client = Client()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.user_data = {
            'email': 'test@example.com',
            'username': 'test@example.com',  # Set email as username
            'password': 'testpass123',
            'password_confirm': 'testpass123',  # Add password confirmation
            'first_name': 'Test',
            'last_name': 'User'
        }

    def test_user_registration(self):
        """Test user registration endpoint"""
        response = self.client.post(self.register_url, self.user_data, format='json')
        print("Registration response:", response.data)  # Add this line
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email=self.user_data['email']).exists())

    def test_user_login(self):
        """Test user login endpoint"""
        # Create a user first
        user_data = self.user_data.copy()
        user_data.pop('password_confirm')  # Remove password_confirm for user creation
        User.objects.create_user(**user_data)
        
        # Attempt login
        response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        response = self.client.post(self.login_url, {
            'email': 'wrong@example.com',
            'password': 'wrongpass'
        }, format='json')  # Use format='json'
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class UserProfileAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            username='test@example.com',  # Set email as username
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.client.force_authenticate(user=self.user)
        self.profile_url = reverse('user-profile')  # Update URL name

    def test_get_profile(self):
        """Test retrieving user profile"""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)
        self.assertEqual(response.data['first_name'], self.user.first_name)

    def test_update_profile(self):
        """Test updating user profile"""
        update_data = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'phone_number': '+1234567890'
        }
        response = self.client.put(self.profile_url, update_data, format='json')  # Use PUT instead of PATCH
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, update_data['first_name'])
        self.assertEqual(self.user.last_name, update_data['last_name'])
        self.assertEqual(self.user.profile.phone_number, update_data['phone_number'])

    def test_unauthorized_access(self):
        """Test unauthorized access to profile"""
        self.client.force_authenticate(user=None)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
