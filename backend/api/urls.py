from django.urls import path
from api import views as api_views
from accounts import views as accounts_views
from rest_framework.authtoken import views as auth_views
from accounts.views import LoginView


urlpatterns = [
    path('', api_views.getRoutes, name='routes'),
    path('register/', accounts_views.RegisterView.as_view(), name='register'),
    path('user/', accounts_views.get_user, name='get_user'),
    path('login/', accounts_views.LoginView.as_view(), name='login'),
    path('users/profile/', accounts_views.user_profile, name='user_profile'),
] 