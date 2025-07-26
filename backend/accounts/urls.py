from django.urls import path
from accounts.views import RegisterView, LoginView, PasswordChangeView, user_profile, DeleteAccountView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('change-password/', PasswordChangeView.as_view(), name='change-password'),
    path('profile/', user_profile, name='user-profile'),
    path('delete/', DeleteAccountView.as_view(), name='delete-account'),
]