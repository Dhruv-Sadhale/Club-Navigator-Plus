from django.contrib import admin
from .models import  Club_Primary
from .models import  QuizResponse, Question
# from django.forms.forms import  QuestionnaireForm

admin.site.register(Club_Primary)
admin.site.register(QuizResponse)
admin.site.register(Question)

# admin.site.register(QuestionnaireForm)

