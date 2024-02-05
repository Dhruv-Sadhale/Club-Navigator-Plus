from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class QuizResponse(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    question1 = models.IntegerField()
    question2 = models.IntegerField() 


class Club_Primary(models.Model):
    club=models.CharField(max_length=100, default='null')
    motto=models.TextField()
    highlights=models.TextField()
    updated = models.DateTimeField(auto_now=True)
    created= models.DateTimeField(auto_now_add= True)
    