from django.urls import path
from . import views
# from .views import SignUpView, LoginView, DashboardView
from .views import home, submit_notification


urlpatterns = [
    path('login/', views.loginPage, name="login"),
    path('logout/', views.logoutUser, name="logout"),
    path('register/', views.registerPage, name="register"),
    path('home/',views.home, name="home" ),

    path('',views.home, name="home" ),
   path('submit-notification/', submit_notification, name='submit_notification'),
    path('clubs/explore/<str:pk>/',views.explore,name='explore'),

    path('questionnaire/', views.questionnaire, name='questionnaire'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('satisfaction/', views.satisfaction, name='satisfaction'),
    # path('generate_qrcode/<str:club_name>/', views.generate_qrcode, name='generate_qrcode'),
    path('attend_club/<str:club_name>/', views.attend_club, name='attend_club'),
    path('api/record_response/', views.record_response, name='record_response'),
    path('api/record_club/', views.record_club, name='record_club'),
    path('clubs/', views.clubs, name='clubs'),
    
]

