from django.shortcuts import render
from django.http import HttpResponse

from .models import Workout

def index(request):
    workouts = Workout.objects.all()
    return render(request, 'list.html',{'workouts':workouts})
	
# Create your views here.
