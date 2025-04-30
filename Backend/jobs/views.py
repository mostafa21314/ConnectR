from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Job
from resume_parser.models import Resume, ParsedResume
import json
import re
import requests
import os

def extract_number(text):
    # Remove any non-digit characters except decimal points
    numbers = re.findall(r'\d+', text)
    return int(numbers[0]) if numbers else 0

def format_salary(salary):
    # Convert string to int and format with $ and commas
    try:
        salary_num = int(salary)
        return f"${salary_num:,}"
    except (ValueError, TypeError):
        return salary

def format_experience(experience):
    # Add "years" to the number
    try:
        exp_num = int(experience)
        return f"{exp_num} years"
    except (ValueError, TypeError):
        return experience

# Create your views here.

@csrf_exempt
def create_job(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # Extract numbers from salary and experience
        salary = extract_number(data['salary'])
        experience = extract_number(data['experience'])
        
        job = Job.objects.create(
            title=data['title'],
            company=data['company'],
            location=data['location'],
            description=data['description'],
            required_skills=data['requiredSkills'],
            preferred_skills=data['preferredSkills'],
            experience=str(experience),  # Store as string number
            salary=str(salary),  # Store as string number
            created_by=None  # Temporarily set to None since we're not requiring login
        )
        return JsonResponse({
            'id': job.id,
            'title': job.title,
            'company': job.company,
            'message': 'Job created successfully'
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def list_jobs(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    jobs = Job.objects.all()
    jobs_data = [{
        'id': job.id,
        'title': job.title,
        'company': job.company,
        'location': job.location,
        'requiredSkills': job.required_skills,
        'experience': format_experience(job.experience),  # Format for display
        'salary': format_salary(job.salary),  # Format for display
        'created_at': job.created_at.isoformat()
    } for job in jobs]
    
    return JsonResponse({'jobs': jobs_data})

def get_job_details(request, job_id):
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        job = Job.objects.get(id=job_id)
        job_data = {
            'id': job.id,
            'title': job.title,
            'company': job.company,
            'location': job.location,
            'description': job.description,
            'requiredSkills': job.required_skills,
            'preferredSkills': job.preferred_skills,
            'experience': format_experience(job.experience),  # Format for display
            'salary': format_salary(job.salary),  # Format for display
            'created_at': job.created_at.isoformat()
        }
        return JsonResponse(job_data)
    except Job.DoesNotExist:
        return JsonResponse({'error': 'Job not found'}, status=404)

@csrf_exempt
def upload_job_resume(request, job_id):
    if request.method == 'POST' and request.FILES.get('file'):
        try:
            job = Job.objects.get(id=job_id)
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
                    
                    # Calculate and save the score
                    score = parsed_resume.calculate_score(
                        job.required_skills,
                        job.preferred_skills
                    )
                    parsed_resume.score = score
                    parsed_resume.save()
                    
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
                    
                    return JsonResponse({
                        'parsed_data': parsed_data,
                        'score': score
                    })
                else:
                    return JsonResponse({'error': 'Failed to parse resume'}, status=500)
                    
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
                
        except Job.DoesNotExist:
            return JsonResponse({'error': 'Job not found'}, status=404)
            
    return JsonResponse({'error': 'Invalid request'}, status=400)
