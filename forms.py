from django import forms
from .models import Response

class MyForm(forms.Form):
    name = forms.CharField(max_length=100)
    email = forms.EmailField()
    # ... other form fields and validation rules


class QuizForm(forms.ModelForm):
    class Meta:
        model = Response
        fields = ['question', 'user_id', 'answer']