from django.urls import path, include
from api import views as api_views
from accounts import views as accounts_views

urlpatterns = [
    path('', api_views.getRoutes, name='routes'),
    path('user/', accounts_views.get_user, name='get_user'),
    path('accounts/', include('accounts.urls')),
] 