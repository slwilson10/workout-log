from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.forms import ModelForm
from django.forms import TextInput
from django.forms import formset_factory
import json
from .models import Workout

class WorkoutForm(ModelForm):
    class Meta:
        model = Workout
        fields = '__all__'
        widgets = {
            'peak':TextInput(attrs={'size':1}),
            'cardio':TextInput(attrs={'size':1}),
            'fatburn':TextInput(attrs={'size':1}),
            'calories':TextInput(attrs={'size':2}),
            'heartrate':TextInput(attrs={'size':2}),
            'hours':TextInput(attrs={'size':1}),
            'minutes':TextInput(attrs={'size':1}),
            'seconds':TextInput(attrs={'size':1}),
            'distance':TextInput(attrs={'size':2}),
        }

def list(request, template='list.html'):    
    form = WorkoutForm()
    workouts = Workout.objects.all()
    WorkoutFormset = formset_factory(WorkoutForm)
    formset = WorkoutFormset()   
    context = {'workouts': workouts,
            'formset': formset,
            'form': form }
    return render(request, template, context)
	
def delete(request, pk):
    workout = get_object_or_404(Workout, pk=pk)
    if request.method == 'DELETE':
        workout.delete()
        data = {'Delete':'ok'}
        return HttpResponse(json.dumps(data), content_type='application/json')
    return redirect('list')

def update(request, pk):
    workout = get_object_or_404(Workout, pk=pk)
    form = WorkoutForm(request.POST or None, instance=workout)
    if form.is_valid():
        form.save()
        return redirect('list')
    return redirect('list')
