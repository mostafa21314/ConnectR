import requests
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Resume, ParsedResume

@csrf_exempt
def upload_resume(request):
    if request.method == 'POST' and request.FILES.get('file'):
        resume_file = request.FILES['file']
        
        # Create a new Resume object
        resume = Resume.objects.create(
            file=resume_file,
            name=resume_file.name
        )
        
        return JsonResponse({
            'id': resume.id,
            'name': resume.name,
            'uploaded_at': resume.uploaded_at.isoformat()
        })
    
    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def parse_resume(request):
    if request.method == 'POST' and request.FILES.get('file'):
        resume_file = request.FILES['file']
        
        # First save the resume
        resume = Resume.objects.create(
            file=resume_file,
            name=resume_file.name
        )
        
        # Call the APILayer resume parsing service
        api_key = os.environ.get('VITE_APP_RESUME_PARSER_API_KEY')
        
        try:
            response = requests.post(
                'https://api.apilayer.com/resume_parser/upload',
                headers={
                    'Content-Type': 'application/octet-stream',
                    'apikey': api_key
                },
                data=resume_file.read()
            )
            
            if response.status_code == 200:
                parsed_data = response.json()
                
                # Save the parsed data to the Resume model
                resume.parsed_data = parsed_data
                resume.save()
                
                # Create a ParsedResume object
                parsed_resume = ParsedResume.objects.create(
                    name=parsed_data.get('name', ''),
                    email=parsed_data.get('email', ''),
                    skills=parsed_data.get('skills', [])
                )
                
                # Add education entries
                for edu in parsed_data.get('education', []):
                    ParsedResume.Education.objects.create(
                        parsed_resume=parsed_resume,
                        institution=edu.get('name', ''),
                        dates=edu.get('dates', '')
                    )
                
                # Add experience entries
                for exp in parsed_data.get('experience', []):
                    ParsedResume.Experience.objects.create(
                        parsed_resume=parsed_resume,
                        title=exp.get('title', ''),
                        dates=exp.get('dates', ''),
                        location=exp.get('location', ''),
                        organization=exp.get('organization', '')
                    )
                
                return JsonResponse(parsed_data)
            else:
                return JsonResponse({'error': 'Failed to parse resume'}, status=500)
                
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Invalid request'}, status=400)
