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

    def __str__(self):
        return f"Parsed Resume for {self.name}"
