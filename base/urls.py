from django.urls import path
from . import views
# from .views import SignUpView, LoginView, DashboardView


urlpatterns = [
    path('login/', views.loginPage, name="login"),
    path('logout/', views.logoutUser, name="logout"),
    path('register/', views.registerPage, name="register"),   
    path('',views.home, name="home" ),
   
    path('explore/<str:pk>/',views.explore,name='explore'),
    path('aptitude-test/', views.aptitude_test, name="aptitude_test"),
    path('quiz/', views.quiz_view, name='quiz_view'),
    path('quiz/success/', views.quiz_success, name='quiz_success'),
    
]

