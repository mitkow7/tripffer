from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def getRoutes(request):
    routes = [
        {
            'endpoint': '/api/accounts/',
            'method': 'GET/POST',
            'description': 'User management endpoints',
            'body': None
        },
        {
            'endpoint': '/api/hotels/',
            'method': 'GET/POST',
            'description': 'Hotel management endpoints',
            'body': None
        },
    ]
    return Response(routes)