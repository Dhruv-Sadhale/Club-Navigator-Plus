# clubselector/forms.py

from django import forms

class QuizResponseForm(forms.Form):
    question1 = forms.IntegerField(min_value=1, max_value=10)
    question2 = forms.IntegerField(min_value=1, max_value=10)
    # ... add fields for other questions (question3, question4, ..., question15)
# clubselector/forms.py


