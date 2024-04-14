from django.db import models
from django.contrib.auth.models import User
# Create your models here.
# models.py
from django.utils import timezone




class Question(models.Model):
    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text
class UserFeedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    feedback_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class UserEmail(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField()

    def __str__(self):
        return self.email

class QuizResponse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question_number = models.IntegerField(default=1)
    selected_option = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.user.username} - Question {self.question_number}: {self.selected_option}'

class ClubResponse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    club = models.CharField(max_length=255)
    timestamp = models.DateTimeField(default=timezone.now)  # Add this line
    def __str__(self):
        return f'{self.user.username} - Club: {self.club}'

class Club_Primary(models.Model):
    club=models.CharField(max_length=100, default='null')
    motto=models.TextField(default='null')
    highlights=models.TextField(default='null')
    brief_info=models.TextField(default='null')
    events=models.TextField(default='null')
    links=models.TextField(default='null')
    contacts=models.TextField(default='null')
    updated = models.DateTimeField(auto_now=True)
    created= models.DateTimeField(auto_now_add= True)

    def __str__(self):
        return self.club
    def save(self, *args, **kwargs):
        # Set default values for fields if they are not provided
        if not self.club:
            self.club = 'default_club'
        if not self.motto:
            self.motto = 'default_motto'
        if not self.highlights:
            self.highlights = 'default_highlights'
        if not self.paragraph:
            self.paragraph = 'default_paragraph'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.club


class Attendance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    club = models.ForeignKey(Club_Primary, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.club.club} - {self.timestamp}'

class Notification(models.Model):
    club = models.ForeignKey(Club_Primary, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{self.club.club} - {self.message}'