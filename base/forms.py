# forms.py
from django import forms
from .models import QuizResponse, Question

class QuestionnaireForm(forms.ModelForm):
    class Meta:
        model = QuizResponse
        fields = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6', 'question7', 'question8', 'question9', 'question10']

    def __init__(self, *args, **kwargs):
        questions = kwargs.pop('questions', None)
        super(QuestionnaireForm, self).__init__(*args, **kwargs)

        if questions:
            for i, question in enumerate(questions, start=1):
                field_name = f'question{i}'
                # self.fields[field_name] = forms.CharField(label=question.text)
                self.fields[field_name] = forms.IntegerField(
                label=question.text,
                widget=forms.NumberInput(attrs={'min': '0'}),
                )
