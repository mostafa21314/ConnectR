import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def parse_resume(request):
    if request.method != 'POST' or not request.FILES.get('file'):
        logger.warning("Invalid request: Not a POST or no file provided")
        return JsonResponse({'error': 'Invalid request: Must be POST with a file'}, status=400)

    resume_file = request.FILES['file']
    api_key = os.environ.get('VITE_APP_RESUME_PARSER_API_KEY')

    if not api_key:
        logger.error("API key not found in environment variables")
        return JsonResponse({'error': 'Server configuration error: API key missing'}, status=500)

    logger.info(f"Processing file: {resume_file.name}, size: {resume_file.size}")

    try:
        response = requests.post(
            'https://api.apilayer.com/resume_parser/upload',
            headers={
                'Content-Type': 'application/octet-stream',
                'apikey': api_key
            },
            data=resume_file.read()
        )
        logger.info(f"API response status: {response.status_code}")
        logger.info(f"API response text: {response.text[:500]}")  # Limit to 500 chars for readability

        if response.status_code == 200 and response.text:
            try:
                parsed_data = response.json()
                logger.info(f"Parsed data: {parsed_data}")
                return JsonResponse(parsed_data)
            except json.JSONDecodeError as e:
                logger.error(f"JSON decode error: {str(e)}")
                return JsonResponse({'error': 'Invalid JSON response from API'}, status=500)
        else:
            logger.error(f"API failed with status {response.status_code}: {response.text[:200]}")
            return JsonResponse({
                'error': f'API returned status {response.status_code}',
                'details': response.text[:200]
            }, status=500)

    except requests.RequestException as e:
        logger.error(f"Request exception: {str(e)}")
        return JsonResponse({'errorI error': 'Network Error', 'status': 500})
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return JsonResponse({'error': 'Internal server error'}, status=500)