from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required 
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, get_object_or_404
from .models import Club_Primary
from .models import QuizResponse
from django import forms
from .models import Question  # Import the Question model
from django.contrib.auth.decorators import login_required
from .forms import UserFeedbackForm
from .models import UserFeedback
import random
from django.core.mail import send_mail
# views.py
from django.shortcuts import render, redirect
from .models import Notification
from .forms import NotificationForm
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import QuizResponse

# views.py

import qrcode
from django.shortcuts import render, redirect
from django.http import HttpResponse
from io import BytesIO
from .models import Club_Primary, Attendance
from django.contrib.auth.decorators import login_required


def explore(request, pk):
     club_object = get_object_or_404(Club_Primary, club=pk)
     return render(request, 'base/explore.html', {'club_object': club_object})

@login_required(login_url='login')  # Adjust login URL
def generate_qrcode(request, club_name):
    club = Club_Primary.objects.get(club=club_name)
    qr_code_data = club.generate_qrcode_data()

    # Create a QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )

    # Add data to the QR code
    qr.add_data(qr_code_data)
    qr.make(fit=True)

    # Create an image from the QR code instance
    img = qr.make_image(fill_color="black", back_color="white")

    # Create a BytesIO buffer to store the image
    buffer = BytesIO()
    img.save(buffer)
    buffer.seek(0)

    # Return the image as an HTTP response
    return HttpResponse(buffer.read(), content_type="image/png")

@login_required(login_url='login')  # Adjust login URL
def attend_club(request,club_name):
    user = request.user
    club = Club_Primary.objects.get(club=club_name)

    # Check if the user has already attended
    if not Attendance.objects.filter(user=user, club=club).exists():
        # Record attendance
        Attendance.objects.create(user=user, club=club)

    # Redirect to the explore/club page
    return HttpResponse(f'Attendance recorded for {request.user} in {club_name}')






def home(request): 
   
    return render(request, 'base/home.html')
def home(request):
    notifications = Notification.objects.all().order_by('-timestamp')[:10]
    if(notifications):
        print(notifications)
    else:
        print("NOT WORKING!!!!")
    return render(request, 'base/home.html', {'notifications': notifications})
    
def submit_notification(request):
    if request.method == 'POST':
        form = NotificationForm(request.POST)
        if form.is_valid():
            notification = form.save(commit=False)
            notification.club = request.user.club  # Assuming clubs are associated with users
            notification.save()
            return redirect('home')
    else:
        form = NotificationForm()
    return render(request, 'base/submit_notification.html', {'form': form})

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
        #user_responses = QuizResponse.objects.get(user_id=user_id)

        # Add logic to determine recommended clubs based on user_responses
        # recommended_clubs = get_recommended_clubs(user_responses)
        # send_email_notification(request.user, recommended_clubs)
        return render(request, 'base/dashboard.html')
    else:
        # Redirect to the login page if user_id is not present
        return redirect('login')

@login_required(login_url='login')  # Use the appropriate URL for your login view

def questionnaire(request):
    return render(request, 'base/index.html')


@csrf_exempt
def record_response(request):
    if request.method == 'POST':
        data_list = json.loads(request.body)
        print('Received data:', data_list)  # Add this line for debugging

        for data in data_list:
            question_number = data.get('question_number')
            selected_option = data.get('selected_option')

            # Process and save the response to the QuizResponse model
            QuizResponse.objects.create(
                user=request.user,  # Assuming you're using Django authentication
                question_number=question_number,
                selected_option=selected_option,
            )

        return JsonResponse({'status': 'success'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


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