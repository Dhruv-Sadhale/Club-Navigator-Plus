from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required 
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, get_object_or_404
from .models import Club_Primary
from .forms import QuestionnaireForm
from .models import QuizResponse
from django import forms
from .models import Question  # Import the Question model
from django.contrib.auth.decorators import login_required
#from django.http import HttpResponse
# Create your views here.
# utils.py
import random


# def questionnaire(request):
#     # Retrieve all questions from the database
#     questions = Question.objects.all()

#     # Render the questionnaire template with questions
#     return render(request, 'base/questionnaire.html', {'questions': questions})

def get_recommended_clubs(user_responses):
    # Define some random clubs for testing
    clubs = [
        {"name": "Club A", "factors": {"Factor1": random.randint(1, 5), "Factor2": random.randint(1, 5), "Factor3": random.randint(1, 5)}},
        {"name": "Club B", "factors": {"Factor1": random.randint(1, 5), "Factor2": random.randint(1, 5), "Factor3": random.randint(1, 5)}},
        {"name": "Club C", "factors": {"Factor1": random.randint(1, 5), "Factor2": random.randint(1, 5), "Factor3": random.randint(1, 5)}},
        # Add more random clubs as needed
    ]

    # Access the fields directly from the user_responses object
    factors = ["Factor1", "Factor2", "Factor3"]
    user_vector = [getattr(user_responses, factor, 1) for factor in factors]

    # Calculate similarity scores
    similarities = [(club["name"], sum(user * club["factors"][factor] for factor, user in zip(factors, user_vector))) for club in clubs]

    # Sort clubs by similarity
    sorted_clubs = sorted(similarities, key=lambda x: x[1], reverse=True)

    # Extract the top 3 recommended clubs
    recommended_clubs = [club for club, _ in sorted_clubs[:3]]

    return recommended_clubs

@login_required(login_url='login')  # Use the appropriate URL for your login view
def questionnaire(request):
    if request.method == 'POST':
        form = QuestionnaireForm(request.POST)
        if form.is_valid():
            # Check if a QuizResponse already exists for the user
            existing_response = QuizResponse.objects.filter(user=request.user).first()

            if existing_response:
                # If a response exists, update the existing response
                existing_response.question1 = form.cleaned_data['question1']
                existing_response.question2 = form.cleaned_data['question2']
                existing_response.question3 = form.cleaned_data['question3']
                existing_response.question4 = form.cleaned_data['question4']
                existing_response.question5 = form.cleaned_data['question5']
                existing_response.question6 = form.cleaned_data['question6']
                existing_response.question7 = form.cleaned_data['question7']
                existing_response.question8 = form.cleaned_data['question8']
                existing_response.question9 = form.cleaned_data['question9']
                existing_response.question10 = form.cleaned_data['question10']
               
                # Update other questions similarly
                existing_response.save()
            else:
                # If no response exists, create a new one
                quiz_response = form.save(commit=False)
                quiz_response.user = request.user
                quiz_response.save()

            return redirect('dashboard')  # Redirect to the dashboard

    else:
        # Retrieve questions from the database
        questions = Question.objects.all()
        
        # Create a form with dynamic fields
        form = QuestionnaireForm(questions=questions)
       
    return render(request, 'base/questionnaire.html', {'form': form})

def dashboard(request):
    # Fetch the user's responses to display on the dashboard
    print("here?")
    user_responses = QuizResponse.objects.get(user=request.user)
    # Add logic to determine recommended clubs based on user_responses
    recommended_clubs = get_recommended_clubs(user_responses)

    return render(request, 'base/dashboard.html', {'recommended_clubs': recommended_clubs})

def quiz_success(request):
    return render(request, 'base/quiz_success.html')

def loginPage(request):
    page='login'
    if request.user.is_authenticated:
        return redirect('home')
    
    if request.method =='POST':
        username  = request.POST.get('username').lower()
        password = request.POST.get('password')
        try:
            user= User.objects.get(username= username)
        except:
            messages.error(request, 'user does not exist')
        user = authenticate(request, username= username, password=password)

        if user is not None:
            login(request, user)
            # return render(request, 'base/dashboard.html')
            return redirect('dashboard')
        else:
            messages.error(request, "username or password does not exist")
    context= {'page':page}
    return render(request , 'base/login_register.html', context)

def logoutUser(request):
    logout(request)
    return redirect('home')

def registerPage(request):
        
        # page='register'
        form= UserCreationForm()
        if request.method =='POST':
            form= UserCreationForm(request.POST)
            if form.is_valid():
                user= form.save(commit=False)
                user.username=user.username.lower()
                user.save()
                login(request, user)
                return redirect('home')
            else:
                messages.error(request, "an error occured during registration")
        return render(request, 'base/login_register.html', {'form':form})
def home(request): 
   
    return render(request, 'base/home.html')


def explore(request, pk):
     club_object = get_object_or_404(Club_Primary, club=pk)
     return render(request, 'base/explore.html', {'club_object': club_object})

def aptitude_test(request):
    return render(request,'base/aptitude_test.html' )


#after this is trial

# your_app/views.py
# from django.contrib.auth import authenticate, login
# from django.shortcuts import render, redirect
# from django.views import View
# from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

# class SignUpView(View):
#     def get(self, request):
#         form = UserCreationForm()
#         return render(request, 'signup.html', {'form': form})

#     def post(self, request):
#         form = UserCreationForm(request.POST)
#         if form.is_valid():
#             form.save()
#             return redirect('login')
#         return render(request, 'signup.html', {'form': form})

# class LoginView(View):
#     def get(self, request):
#         form = AuthenticationForm()
#         return render(request, 'login.html', {'form': form})

#     def post(self, request):
#         form = AuthenticationForm(request, data=request.POST)
#         if form.is_valid():
#             username = form.cleaned_data.get('username')
#             password = form.cleaned_data.get('password')
#             user = authenticate(username=username, password=password)
#             if user:
#                 login(request, user)
#                 return redirect('dashboard')
#         return render(request, 'login.html', {'form': form})

# class DashboardView(View):
#     def get(self, request):
#         # Add logic for displaying user dashboard
#         return render(request, 'dashboard.html')
