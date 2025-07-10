from django.urls import path, include
from api import views as api_views

urlpatterns = [
    path('', api_views.getRoutes, name='routes'),
    path('accounts/', include('accounts.urls')),
] 