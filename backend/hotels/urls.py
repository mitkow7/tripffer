from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HotelViewSet, 
    MyHotelView, 
    BookingViewSet, 
    RoomViewSet, 
    FavoriteHotelViewSet,
    ReviewViewSet
)

router = DefaultRouter()
router.register(r"search", HotelViewSet, basename="hotel")
router.register(r"bookings", BookingViewSet, basename="booking")
router.register(r"rooms", RoomViewSet, basename="room")
router.register(r"favorites", FavoriteHotelViewSet, basename="favoritehotel")
router.register(r"reviews", ReviewViewSet, basename="review")

urlpatterns = [
    path("my-hotel/", MyHotelView.as_view(), name="my-hotel"),
    path("", include(router.urls)),
] 