from django.template import loader
from django.http import HttpResponseForbidden

def handler403(request, exception):
    template = loader.get_template('admin/403.html')
    context = {
        'user': request.user,
        'request': request,
        'exception': exception,
    }
    return HttpResponseForbidden(template.render(context, request)) 