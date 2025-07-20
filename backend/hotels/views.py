from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .amadeus_client import amadeus, ResponseError
from datetime import datetime


class HotelSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            # Required parameters
            city_code = request.query_params.get('city_code')
            check_in = request.query_params.get('check_in')
            check_out = request.query_params.get('check_out')
            
            # Optional parameters with defaults
            adults = int(request.query_params.get('adults', 1))
            rooms = int(request.query_params.get('rooms', 1))
            roomQuantity = int(request.query_params.get('roomQuantity', 1))
            currency = request.query_params.get('currency', 'EUR')

            if not all([city_code, check_in, check_out]):
                return Response(
                    {'error': 'Missing required parameters: city_code, check_in, check_out'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                # Validate dates
                check_in_date = datetime.strptime(check_in, '%Y-%m-%d')
                check_out_date = datetime.strptime(check_out, '%Y-%m-%d')

                if check_in_date >= check_out_date:
                    return Response({
                        'error': 'Check-in date must be before check-out date'
                    }, status=status.HTTP_400_BAD_REQUEST)

                if adults < 1 or rooms < 1:
                    return Response({
                        'error': 'Number of adults and rooms must be at least 1'
                    }, status=status.HTTP_400_BAD_REQUEST)

            except ValueError:
                return Response({
                    'error': 'Invalid date format. Please use YYYY-MM-DD'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                # Step 1: Get list of hotels in the city
                hotel_list_response = amadeus.reference_data.locations.hotels.by_city.get(
                    cityCode=city_code
                )

                if not hotel_list_response.data:
                    return Response({
                        'error': f'No hotel IDs found for city {city_code}. The Amadeus API did not return any hotels for this location.'
                    }, status=status.HTTP_404_NOT_FOUND)

                hotel_details_map = {h['hotelId']: h for h in hotel_list_response.data}
                hotel_ids = list(hotel_details_map.keys())[:20]

                # Step 2: Get offers for the hotels
                response = amadeus.shopping.hotel_offers_search.get(
                    hotelIds=','.join(hotel_ids),
                    checkInDate=check_in,
                    checkOutDate=check_out,
                    adults=adults,
                    roomQuantity=roomQuantity,
                    currency=currency,
                    bestRateOnly=True
                )

                hotels = []
                if response.data:
                    for hotel_data in response.data:
                        try:
                            hotel_id = hotel_data['hotel']['hotelId']
                            details = hotel_details_map.get(hotel_id)

                            if not details:
                                continue

                            hotel = {
                                'id': hotel_id,
                                'name': details.get('name', 'No name found'),
                                'address': details.get('address', {}),
                                'amenities': details.get('amenities', []),
                                'offers': []
                            }

                            for offer in hotel_data.get('offers', []):
                                room_info = offer.get('room', {})
                                room_type_info = room_info.get('typeEstimated', {})
                                
                                offer_data = {
                                    'id': offer.get('id', ''),
                                    'room_type': room_info.get('description', {}).get('text', 'Standard Room'),
                                    'bed_type': room_type_info.get('bedType', ''),
                                    'description': room_info.get('description', {}).get('text', ''),
                                    'price': {
                                        'total': offer['price'].get('total', '0'),
                                        'currency': offer['price'].get('currency', currency),
                                        'base': offer['price'].get('base', '0'),
                                        'variations': offer['price'].get('variations', {})
                                    },
                                    'guests': {
                                        'adults': offer.get('guests', {}).get('adults', adults)
                                    },
                                    'policies': offer.get('policies', {}),
                                    'amenities': []
                                }
                                
                                hotel['offers'].append(offer_data)

                            if hotel['offers']:
                                hotels.append(hotel)
                        except KeyError as e:
                            continue

                if not hotels:
                    return Response({
                        'error': 'No available offers found for the selected dates and criteria'
                    }, status=status.HTTP_404_NOT_FOUND)

                return Response(hotels, status=status.HTTP_200_OK)

            except ResponseError as error:
                error_message = str(error)
                if hasattr(error, 'response') and hasattr(error.response, 'body'):
                    error_message = f"{error_message} - {error.response.body}"
                return Response({
                    'error': f"API Error: {error_message}"
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            