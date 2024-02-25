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
from .forms import UserFeedbackForm
from .models import UserFeedback
import random
from django.core.mail import send_mail

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


# views.py



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
            # send_mail(
            #         'Quiz Completed',
            #         'Thank you for completing the quiz.',
            #         'dhruvsadhale.cis@gmail.com',  # Sender's email
            #         ['dhruvsadhale.cis@gmail.com'],  # List of recipient emails (user's email)
            #         fail_silently=False,
            # )
            # print("reaching here?")
            print([request.user.email])

            return redirect('dashboard')  # Redirect to the dashboard

    else:
        # Retrieve questions from the database
        questions = Question.objects.all()
        
        # Create a form with dynamic fields
        form = QuestionnaireForm(questions=questions)
       
    return render(request, 'base/questionnaire.html', {'form': form})

def send_email_notification(user, recommended_clubs):
    subject = 'Club Recommendation Notification'
    message = f"Hello {user.username},\n\n" \
              f"We have received your club recommendations. The recommended clubs are: {', '.join(recommended_clubs)}.\n" \
              f"Thank you for using our platform!\n\n" \
              f"Best regards,\nThe Club Navigator Team"

    from_email = 'your_email@example.com'  # Replace with your email
    to_email = [user.email]  # Use the user's email

    send_mail(subject, message, from_email, to_email)

def dashboard(request):
    # Retrieve the user's ID from the session
    user_id = request.session.get('user_id')

    # Check if user_id is present in the session
    if user_id is not None:
        # Fetch the user's responses to display on the dashboard
        user_responses = QuizResponse.objects.get(user_id=user_id)

        # Add logic to determine recommended clubs based on user_responses
        recommended_clubs = get_recommended_clubs(user_responses)
        # send_email_notification(request.user, recommended_clubs)
        return render(request, 'base/dashboard.html', {'recommended_clubs': recommended_clubs})
    else:
        # Redirect to the login page if user_id is not present
        return redirect('login')

def loginPage(request):
    page='login'
    if request.user.is_authenticated:
        return redirect('home')
    
    if request.method =='POST':
        username  = request.POST.get('username').lower()
        password = request.POST.get('password')
        try:
            user= User.objects.get(username= username)
        except User.DoesNotExist:
            messages.error(request, 'User does not exist')
            return redirect('login')
        user = authenticate(request, username= username, password=password)

        if user is not None:
            login(request, user)
            # return render(request, 'base/dashboard.html')
            request.session['user_id'] = user.id
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

def satisfaction(request):
    satisfied = request.GET.get('satisfied', '')

    if satisfied.lower() == 'no':
        # User is not satisfied, present feedback form
        if request.method == 'POST':
            feedback_form = UserFeedbackForm(request.POST)
            if feedback_form.is_valid():
                # Save user feedback
                feedback = feedback_form.save(commit=False)
                feedback.user = request.user
                feedback.save()
                return redirect('questionnaire')  
        else:
            feedback_form = UserFeedbackForm()

        return render(request, 'base/feedback_form.html', {'feedback_form': feedback_form})
    else:
        # User is satisfied, redirect to the questionnaire or any other page
        return redirect('dashboard')  # Adjust the URL as needed