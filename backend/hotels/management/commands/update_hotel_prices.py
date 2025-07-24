from django.core.management.base import BaseCommand
from hotels.models import Hotel

class Command(BaseCommand):
    help = 'Updates all hotel price_per_night fields based on the average of their room prices'

    def handle(self, *args, **kwargs):
        hotels = Hotel.objects.all()
        updated_count = 0

        for hotel in hotels:
            hotel.update_average_price()
            updated_count += 1
            self.stdout.write(f"Updated price for hotel: {hotel.name}")

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully updated prices for {updated_count} hotels'
            )
        ) 