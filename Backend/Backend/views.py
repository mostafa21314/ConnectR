import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os

@csrf_exempt
def parse_resume(request):
    if request.method == 'POST' and request.FILES.get('file'):
        resume_file = request.FILES['file']
        
        # Call the APILayer resume parsing service directly
        api_key = os.environ.get('VITE_APP_RESUME_PARSER_API_KEY')
        
        response = requests.post(
            'https://api.apilayer.com/resume_parser/upload',
            headers={
                'Content-Type': 'application/octet-stream',
                'apikey': api_key
            },
            data=resume_file.read()
        )
        
        return JsonResponse(response.json())
    
    return JsonResponse({'error': 'Invalid request'}, status=400)
