from amadeus import Client, ResponseError
from django.conf import settings

amadeus = Client(
    client_id=settings.AMADEUS_CLIENT_ID,
    client_secret=settings.AMADEUS_CLIENT_SECRET,
    hostname='test' if settings.AMADEUS_TEST_ENV else 'production',
    log_level='debug'  # Enable debug logging
) 