from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.forms import ModelForm
from django.forms import TextInput
from django.forms import modelformset_factory
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

def list(request):    
    workouts = Workout.objects.all()
    form = WorkoutForm()
    WorkoutFormset = modelformset_factory(Workout, form=WorkoutForm,
                         can_delete=True, can_order=True)
    formset = WorkoutFormset(queryset=Workout.objects.all().order_by('-date'))   
    context = {'workouts': workouts,
            'formset': formset}
    return render(request, 'list.html', context)
	
def delete(request, pk):
    workout = get_object_or_404(Workout, pk=pk)
    if request.method == 'DELETE':
        workout.delete()
        data = {'Delete':'ok'}
        return HttpResponse(json.dumps(data), content_type='application/json')
    return redirect('list')

def edit(request):
    WorkoutFormset = modelformset_factory(Workout, form=WorkoutForm)
    if request.method == 'POST':
        formset = WorkoutFormset(request.POST)
        data = {'Edit':'ok'}
        if formset.is_valid():
            formset.save()
        else: print('Not Valid')
        return redirect('list')
#        return HttpResponse(json.dumps(data), content_type='application/json')       
    else:
        print ('NOT POST')
        return redirect('list')       
