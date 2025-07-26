from django.contrib import admin
from django.contrib.auth import get_user_model
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from unfold.admin import ModelAdmin, TabularInline
from django.contrib.admin import SimpleListFilter
from unfold.decorators import display
from .models import UserProfile

User = get_user_model()


class UserProfileInline(TabularInline):
    model = UserProfile
    extra = 0
    fields = ('phone_number', 'date_of_birth', 'bio', 'profile_picture')
    

@admin.register(User)
class UserAdmin(ModelAdmin):
    list_display = (
        'id', 
        'username', 
        'email', 
        'display_name', 
        'role_badge', 
        'is_active_badge',
        'date_joined',
        'hotel_link'
    )
    list_display_links = ('id', 'username', 'email')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    list_filter = (
        'role',
        'is_active',
        'is_staff',
        'is_superuser',
        'date_joined',
    )
    ordering = ('-date_joined',)
    readonly_fields = ('id', 'date_joined', 'last_login')
    inlines = [UserProfileInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('username', 'email', 'first_name', 'last_name', 'role')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
        ('Important dates', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',)
        }),
    )
    
    filter_horizontal = ('groups', 'user_permissions')
    
    actions = ['activate_users', 'deactivate_users']
    
    @display(description="Display Name", label=True)
    def display_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username
    
    @display(description="Role", label=True)
    def role_badge(self, obj):
        color = "success" if obj.role == "HOTEL" else "info"
        return format_html(
            '<span class="badge badge-{}">{}</span>',
            color,
            obj.get_role_display()
        )
    
    @display(description="Status", boolean=True)
    def is_active_badge(self, obj):
        return obj.is_active
    
    @display(description="Hotel")
    def hotel_link(self, obj):
        if obj.role == "HOTEL" and hasattr(obj, 'hotel'):
            url = reverse('admin:hotels_hotel_change', args=[obj.hotel.id])
            return format_html('<a href="{}">{}</a>', url, obj.hotel.name)
        return "-"
    
    def activate_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} users were successfully activated.')
    activate_users.short_description = "Activate selected users"
    
    def deactivate_users(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} users were successfully deactivated.')
    deactivate_users.short_description = "Deactivate selected users"


@admin.register(UserProfile)
class UserProfileAdmin(ModelAdmin):
    list_display = ('user', 'phone_number', 'date_of_birth', 'has_profile_picture')
    search_fields = ('user__username', 'user__email', 'phone_number')
    list_filter = (
        'date_of_birth',
    )
    
    @display(description="Has Profile Picture", boolean=True)
    def has_profile_picture(self, obj):
        return bool(obj.profile_picture)
