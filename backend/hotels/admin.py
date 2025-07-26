from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Avg, Count
from unfold.admin import ModelAdmin, TabularInline, StackedInline
from django.contrib.admin import SimpleListFilter
from unfold.decorators import display
from .models import Hotel, Room, Booking, Review, HotelImage, RoomImage, FavoriteHotel, Feature


class HotelImageInline(TabularInline):
    model = HotelImage
    extra = 1
    fields = ('image',)


class RoomInline(StackedInline):
    model = Room
    extra = 0
    fields = ('room_type', 'description', 'price', 'bed_count', 'max_adults')
    show_change_link = True


class RoomImageInline(TabularInline):
    model = RoomImage
    extra = 1
    fields = ('image',)


@admin.register(Hotel)
class HotelAdmin(ModelAdmin):
    list_display = (
        'id',
        'name',
        'owner_link',
        'star_rating',
        'location',
        'rooms_count',
        'bookings_count',
        'avg_rating',
        'is_active',
        'created_date'
    )
    list_display_links = ('id', 'name')
    search_fields = ('name', 'address', 'user__email', 'user__first_name', 'user__last_name')
    list_filter = (
        'stars',
        'price_per_night',
        'guest_score',
        'features',
        'user__is_active',
    )
    ordering = ('-id',)
    inlines = [HotelImageInline, RoomInline]
    filter_horizontal = ('features',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'name', 'stars', 'address', 'website', 'description')
        }),
        ('Contact Information', {
            'fields': ('contact_email', 'contact_phone'),
        }),
        ('Pricing & Availability', {
            'fields': ('price_per_night', 'availability_start_date', 'availability_end_date'),
        }),
        ('Features & Amenities', {
            'fields': ('features',),
        }),
        ('Location & Scoring', {
            'fields': ('distance_to_center', 'guest_score', 'number_of_adults'),
            'classes': ('collapse',)
        }),
        ('Check-in/Check-out', {
            'fields': ('check_in_time', 'check_out_time'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['activate_hotels', 'deactivate_hotels', 'reset_guest_scores']
    
    @display(description="Owner")
    def owner_link(self, obj):
        if obj.user:
            url = reverse('admin:accounts_appuser_change', args=[obj.user.id])
            return format_html('<a href="{}">{}</a>', url, obj.user.get_full_name() or obj.user.username)
        return "-"
    
    @display(description="Stars")
    def star_rating(self, obj):
        stars = '⭐' * obj.stars if obj.stars else '-'
        return format_html('<span title="{} stars">{}</span>', obj.stars, stars)
    
    @display(description="Location")
    def location(self, obj):
        return obj.address[:50] + "..." if len(obj.address) > 50 else obj.address
    
    @display(description="Rooms")
    def rooms_count(self, obj):
        count = obj.rooms.count()
        if count > 0:
            url = reverse('admin:hotels_room_changelist') + f'?hotel__id__exact={obj.id}'
            return format_html('<a href="{}">{} rooms</a>', url, count)
        return "0 rooms"
    
    @display(description="Bookings")
    def bookings_count(self, obj):
        count = Booking.objects.filter(room__hotel=obj).count()
        if count > 0:
            url = reverse('admin:hotels_booking_changelist') + f'?room__hotel__id__exact={obj.id}'
            return format_html('<a href="{}">{} bookings</a>', url, count)
        return "0 bookings"
    
    @display(description="Avg Rating")
    def avg_rating(self, obj):
        avg = obj.reviews.aggregate(avg_rating=Avg('rating'))['avg_rating']
        if avg:
            return f"{avg:.1f}/5.0"
        return "-"
    
    @display(description="Active", boolean=True)
    def is_active(self, obj):
        return obj.user.is_active if obj.user else False
    
    @display(description="Created")
    def created_date(self, obj):
        return obj.user.date_joined.strftime("%Y-%m-%d") if obj.user else "-"
    
    def activate_hotels(self, request, queryset):
        for hotel in queryset:
            if hotel.user:
                hotel.user.is_active = True
                hotel.user.save()
        self.message_user(request, f'{queryset.count()} hotels were activated.')
    activate_hotels.short_description = "Activate selected hotels"
    
    def deactivate_hotels(self, request, queryset):
        for hotel in queryset:
            if hotel.user:
                hotel.user.is_active = False
                hotel.user.save()
        self.message_user(request, f'{queryset.count()} hotels were deactivated.')
    deactivate_hotels.short_description = "Deactivate selected hotels"
    
    def reset_guest_scores(self, request, queryset):
        updated = queryset.update(guest_score=0)
        self.message_user(request, f'{updated} hotel guest scores were reset.')
    reset_guest_scores.short_description = "Reset guest scores"


@admin.register(Room)
class RoomAdmin(ModelAdmin):
    list_display = ('id', 'hotel_link', 'room_type', 'price_display', 'bed_count', 'max_adults', 'bookings_count')
    list_display_links = ('id', 'room_type')
    search_fields = ('room_type', 'description', 'hotel__name')
    list_filter = (
        'price',
        'bed_count',
        'max_adults',
        'hotel__stars',
    )
    ordering = ('hotel', 'room_type')
    inlines = [RoomImageInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('hotel', 'room_type', 'description')
        }),
        ('Capacity & Pricing', {
            'fields': ('bed_count', 'max_adults', 'price')
        }),
    )
    
    @display(description="Hotel")
    def hotel_link(self, obj):
        url = reverse('admin:hotels_hotel_change', args=[obj.hotel.id])
        return format_html('<a href="{}">{}</a>', url, obj.hotel.name)
    
    @display(description="Price")
    def price_display(self, obj):
        return f"${obj.price}/night" if obj.price else "-"
    
    @display(description="Bookings")
    def bookings_count(self, obj):
        count = obj.bookings.count()
        if count > 0:
            url = reverse('admin:hotels_booking_changelist') + f'?room__id__exact={obj.id}'
            return format_html('<a href="{}">{}</a>', url, count)
        return "0"


@admin.register(Booking)
class BookingAdmin(ModelAdmin):
    list_display = (
        'id',
        'user_link',
        'hotel_link',
        'room_link',
        'date_range',
        'status_badge',
        'total_nights',
        'total_price_display'
    )
    list_display_links = ('id',)
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'room__hotel__name')
    list_filter = (
        'status',
        'start_date',
        'end_date',
        'room__hotel__stars',
    )
    ordering = ('-start_date',)
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Booking Information', {
            'fields': ('user', 'room', 'start_date', 'end_date', 'status')
        }),
    )
    
    actions = ['confirm_bookings', 'cancel_bookings']
    
    @display(description="Guest")
    def user_link(self, obj):
        url = reverse('admin:accounts_appuser_change', args=[obj.user.id])
        return format_html('<a href="{}">{}</a>', url, obj.user.get_full_name() or obj.user.email)
    
    @display(description="Hotel")
    def hotel_link(self, obj):
        url = reverse('admin:hotels_hotel_change', args=[obj.room.hotel.id])
        return format_html('<a href="{}">{}</a>', url, obj.room.hotel.name)
    
    @display(description="Room")
    def room_link(self, obj):
        url = reverse('admin:hotels_room_change', args=[obj.room.id])
        return format_html('<a href="{}">{}</a>', url, obj.room.room_type)
    
    @display(description="Dates")
    def date_range(self, obj):
        return f"{obj.start_date} to {obj.end_date}"
    
    @display(description="Status")
    def status_badge(self, obj):
        colors = {
            'pending': 'warning',
            'confirmed': 'success',
            'cancelled': 'danger',
            'completed': 'info'
        }
        color = colors.get(obj.status, 'secondary')
        return format_html(
            '<span class="badge badge-{}">{}</span>',
            color,
            obj.get_status_display()
        )
    
    @display(description="Nights")
    def total_nights(self, obj):
        if obj.start_date and obj.end_date:
            return (obj.end_date - obj.start_date).days
        return "-"
    
    @display(description="Total Price")
    def total_price_display(self, obj):
        total = obj.total_price if hasattr(obj, 'total_price') else None
        if total:
            return f"${total}"
        elif obj.room and obj.room.price and obj.start_date and obj.end_date:
            nights = (obj.end_date - obj.start_date).days
            return f"${obj.room.price * nights}"
        return "-"
    
    def confirm_bookings(self, request, queryset):
        updated = queryset.update(status='confirmed')
        self.message_user(request, f'{updated} bookings were confirmed.')
    confirm_bookings.short_description = "Confirm selected bookings"
    
    def cancel_bookings(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} bookings were cancelled.')
    cancel_bookings.short_description = "Cancel selected bookings"


@admin.register(Review)
class ReviewAdmin(ModelAdmin):
    list_display = ('id', 'user_link', 'hotel_link', 'rating_stars', 'comment_preview', 'created_display')
    list_display_links = ('id',)
    search_fields = ('user__email', 'hotel__name', 'comment')
    list_filter = (
        'rating',
        'hotel__stars',
    )
    ordering = ('-created_at',) if hasattr(Review, 'created_at') else ('-id',)
    
    fieldsets = (
        ('Review Information', {
            'fields': ('user', 'hotel', 'rating', 'comment')
        }),
    )
    
    @display(description="Reviewer")
    def user_link(self, obj):
        url = reverse('admin:accounts_appuser_change', args=[obj.user.id])
        return format_html('<a href="{}">{}</a>', url, obj.user.get_full_name() or obj.user.email)
    
    @display(description="Hotel")
    def hotel_link(self, obj):
        url = reverse('admin:hotels_hotel_change', args=[obj.hotel.id])
        return format_html('<a href="{}">{}</a>', url, obj.hotel.name)
    
    @display(description="Rating")
    def rating_stars(self, obj):
        return '⭐' * obj.rating
    
    @display(description="Comment")
    def comment_preview(self, obj):
        if obj.comment:
            return obj.comment[:50] + "..." if len(obj.comment) > 50 else obj.comment
        return "-"
    
    @display(description="Created")
    def created_display(self, obj):
        if hasattr(obj, 'created_at'):
            return obj.created_at.strftime("%Y-%m-%d %H:%M")
        return "-"


@admin.register(Feature)
class FeatureAdmin(ModelAdmin):
    list_display = ('id', 'name', 'is_amenity_badge', 'hotels_count')
    search_fields = ('name',)
    list_filter = ('is_amenity',)
    
    @display(description="Type")
    def is_amenity_badge(self, obj):
        label = "Amenity" if obj.is_amenity else "Feature"
        color = "success" if obj.is_amenity else "info"
        return format_html('<span class="badge badge-{}">{}</span>', color, label)
    
    @display(description="Hotels Count")
    def hotels_count(self, obj):
        count = obj.hotels.count()
        if count > 0:
            url = reverse('admin:hotels_hotel_changelist') + f'?features__id__exact={obj.id}'
            return format_html('<a href="{}">{}</a>', url, count)
        return "0"


@admin.register(FavoriteHotel)
class FavoriteHotelAdmin(ModelAdmin):
    list_display = ('id', 'user_link', 'hotel_link', 'created_at')
    search_fields = ('user__email', 'hotel__name')
    list_filter = ('created_at',)
    
    @display(description="User")
    def user_link(self, obj):
        url = reverse('admin:accounts_appuser_change', args=[obj.user.id])
        return format_html('<a href="{}">{}</a>', url, obj.user.email)
    
    @display(description="Hotel")
    def hotel_link(self, obj):
        url = reverse('admin:hotels_hotel_change', args=[obj.hotel.id])
        return format_html('<a href="{}">{}</a>', url, obj.hotel.name)


# Badge count functions for admin dashboard
def user_count(request):
    from accounts.models import AppUser
    return AppUser.objects.count()


def hotel_count(request):
    return Hotel.objects.count()


def pending_bookings_count(request):
    return Booking.objects.filter(status='pending').count()