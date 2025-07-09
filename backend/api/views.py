from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def getRoutes(request):
    routes = [
        {
            'endpoint': '/api/',
            'method': 'GET',
            'description': 'Returns available API routes',
            'body': None
        },
        {
            'endpoint': '/api/hello/',
            'method': 'GET',
            'description': 'Returns a hello message',
            'body': None
        },
    ]
    return Response(routes)

@api_view(['GET'])
def hello_world(request):
    return Response({
        'message': 'How are you doing?',
        'status': 'success'
    })