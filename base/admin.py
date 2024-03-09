from django.contrib import admin
from .models import  Club_Primary
from .models import  QuizResponse, Question, UserFeedback,Notification, Attendance, ClubResponse
# base/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin


admin.site.register(ClubResponse)

admin.site.register(Attendance)
admin.site.register(Notification)
admin.site.register(Club_Primary)
admin.site.register(QuizResponse)
admin.site.register(Question)
admin.site.register(UserFeedback)



