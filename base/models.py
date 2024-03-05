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

class QuizResponse(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    question1 = models.IntegerField(default=0)
    question2 = models.IntegerField(default=0)
    question3 = models.IntegerField(default=0)
    question4 = models.IntegerField(default=0)
    question5 = models.IntegerField(default=0)
    question6 = models.IntegerField(default=0)
    question7 = models.IntegerField(default=0)
    question8 = models.IntegerField(default=0)
    question9 = models.IntegerField(default=0)
    question10 = models.IntegerField(default=0) 


class Club_Primary(models.Model):
    club=models.CharField(max_length=100, default='null')
    motto=models.TextField()
    highlights=models.TextField()
    qr_code_data = models.CharField(max_length=255, blank=True, null=True)
    updated = models.DateTimeField(auto_now=True)
    created= models.DateTimeField(auto_now_add= True)
    def generate_qrcode_data(self):
        if not self.qr_code_data:
            self.qr_code_data = f'club_attendance_{self.id}'
            self.save()
        return self.qr_code_data

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