from django.db import models

class Resume(models.Model):
    file = models.FileField(upload_to='resumes/')
    name = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    parsed_data = models.JSONField(null=True, blank=True)
    
    def __str__(self):
        return self.name


class ParsedResume(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    skills = models.JSONField()  # Stores the list of skills as JSON
    score = models.IntegerField(default=0)  # Score out of 100
    
    class Education(models.Model):
        parsed_resume = models.ForeignKey('ParsedResume', on_delete=models.CASCADE, related_name='education')
        institution = models.CharField(max_length=255)
        dates = models.CharField(max_length=50)  # Using CharField as the date format may vary
    
    class Experience(models.Model):
        parsed_resume = models.ForeignKey('ParsedResume', on_delete=models.CASCADE, related_name='experience')
        title = models.CharField(max_length=255)
        dates = models.CharField(max_length=50)
        location = models.CharField(max_length=255)
        organization = models.CharField(max_length=255)

    def calculate_score(self, required_skills, preferred_skills):
        """
        Calculate the score based on required and preferred skills.
        Returns 0 if any required skill is missing.
        Otherwise returns a score between 50 and 100 based on preferred skills.
        """
        # Convert all skills to lowercase for case-insensitive comparison
        resume_skills = [skill.lower() for skill in self.skills]
        required_skills = [skill.lower() for skill in required_skills]
        preferred_skills = [skill.lower() for skill in preferred_skills]
        
        # Check if all required skills are present
        for skill in required_skills:
            if skill not in resume_skills:
                return 0
        
        # If we have all required skills, calculate score based on preferred skills
        if not preferred_skills:
            return 100  # If no preferred skills, perfect score
        
        # Count how many preferred skills are present
        matching_preferred = sum(1 for skill in preferred_skills if skill in resume_skills)
        
        # Calculate score: 50 points base + up to 50 points for preferred skills
        score = 50 + (matching_preferred / len(preferred_skills)) * 50
        
        return int(score)

    def __str__(self):
        return f"Parsed Resume for {self.name}"
