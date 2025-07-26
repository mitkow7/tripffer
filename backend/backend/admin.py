from datetime import datetime, timedelta
from django.contrib.admin import AdminSite
from django.db.models import Count, Q, Avg, Sum
from django.utils.timezone import now
from hotels.models import Hotel, Booking, Review
from django.contrib import admin
from django.db.models.functions import TruncMonth, ExtractMonth
from django.contrib.auth import get_user_model


AppUser = get_user_model()


class CustomAdminSite(AdminSite):
    def get_app_list(self, request, app_label=None):
        app_list = super().get_app_list(request, app_label)
        return app_list

    def index(self, request, extra_context=None):
        extra_context = extra_context or {}
        return super().index(request, dashboard_callback(request, extra_context))


admin.site = CustomAdminSite()


def get_monthly_bookings():
    """Get booking counts for the last 6 months"""
    end_date = now().date()
    start_date = end_date - timedelta(days=180)  # Last 6 months
    
    bookings = (
        Booking.objects
        .filter(start_date__gte=start_date)
        .annotate(month=TruncMonth('start_date'))
        .values('month')
        .annotate(count=Count('id'))
        .order_by('month')
    )
    
    # Create a dict with all months initialized to 0
    months_dict = {}
    current_date = start_date
    while current_date <= end_date:
        months_dict[current_date.strftime('%b')] = 0
        current_date = (current_date.replace(day=1) + timedelta(days=32)).replace(day=1)
    
    # Fill in actual values
    for booking in bookings:
        month_name = booking['month'].strftime('%b')
        months_dict[month_name] = booking['count']
    
    return {
        'labels': list(months_dict.keys()),
        'data': list(months_dict.values())
    }


def get_revenue_distribution():
    """Get revenue distribution across different categories"""
    # Get total booking value
    total_bookings_value = (
        Booking.objects
        .filter(status='completed')
        .aggregate(
            total=Sum('room__price')
        )['total'] or 0
    )
    
    # Get total number of active hotels
    total_hotels = Hotel.objects.filter(user__is_active=True).count()
    
    # Get total number of reviews
    total_reviews = Review.objects.count()
    
    # Calculate percentages
    total = total_bookings_value + total_hotels + total_reviews
    if total == 0:
        return {
            'labels': ['Hotels', 'Bookings', 'Reviews'],
            'data': [33, 33, 34]  # Default even distribution
        }
    
    return {
        'labels': ['Hotels', 'Bookings', 'Reviews'],
        'data': [
            round((total_hotels / total) * 100),
            round((total_bookings_value / total) * 100),
            round((total_reviews / total) * 100)
        ]
    }


def dashboard_callback(request, context):
    """
    Custom dashboard callback for Django Unfold admin
    """
    # Get current date and time ranges
    today = now().date()
    this_month = today.replace(day=1)
    last_month = (this_month - timedelta(days=1)).replace(day=1)
    
    # User statistics
    total_users = AppUser.objects.all().count()
    new_users_this_month = AppUser.objects.filter(date_joined__gte=this_month).count()
    hotel_owners = AppUser.objects.filter(role='HOTEL').count()
    regular_users = AppUser.objects.filter(role='USER').count()
    
    # Hotel statistics
    total_hotels = Hotel.objects.all().count()
    active_hotels = Hotel.objects.filter(user__is_active=True).count()
    
    # Booking statistics
    total_bookings = Booking.objects.all().count()
    pending_bookings = Booking.objects.filter(status='pending').count()
    confirmed_bookings = Booking.objects.filter(status='confirmed').count()
    cancelled_bookings = Booking.objects.filter(status='cancelled').count()
    this_month_bookings = Booking.objects.filter(start_date__gte=this_month).count()
    
    # Review statistics
    total_reviews = Review.objects.all().count()
    avg_rating = Review.objects.aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0
    
    # Recent activity
    recent_users = AppUser.objects.order_by('-date_joined')[:5]
    recent_bookings = Booking.objects.select_related('room__hotel', 'user').order_by('-start_date')[:5]
    recent_reviews = Review.objects.select_related('hotel', 'user').order_by('-id')[:5]
    
    # Top performing hotels
    top_hotels = Hotel.objects.filter(user__is_active=True).order_by('-stars', '-guest_score')[:5]
    
    # Get analytics data
    monthly_bookings = get_monthly_bookings()
    revenue_distribution = get_revenue_distribution()
    
    # Add custom context data
    context.update({
        'dashboard_stats': {
            'users': {
                'total': total_users,
                'new_this_month': new_users_this_month,
                'hotel_owners': hotel_owners,
                'regular_users': regular_users,
            },
            'hotels': {
                'total': total_hotels,
                'active': active_hotels,
            },
            'bookings': {
                'total': total_bookings,
                'pending': pending_bookings,
                'confirmed': confirmed_bookings,
                'cancelled': cancelled_bookings,
                'this_month': this_month_bookings,
            },
            'reviews': {
                'total': total_reviews,
                'avg_rating': avg_rating,
            },
        },
        'recent_activity': {
            'users': recent_users,
            'bookings': recent_bookings,
            'reviews': recent_reviews,
        },
        'top_hotels': top_hotels,
        'analytics': {
            'monthly_bookings': monthly_bookings,
            'revenue_distribution': revenue_distribution,
        }
    })
    
    return context


# Badge count functions for sidebar
def user_count(request):
    """Return total user count for badge"""
    return AppUser.objects.all().count()


def hotel_count(request):
    """Return total hotel count for badge"""
    return Hotel.objects.all().count()


def pending_bookings_count(request):
    """Return pending bookings count for badge"""
    return Booking.objects.filter(status='pending').count() 