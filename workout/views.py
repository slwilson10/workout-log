from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.forms import ModelForm
from django.forms import TextInput
from django.forms import modelformset_factory
import json
import time
import datetime
from datetime import date
from datetime import timedelta
from dateutil.relativedelta import relativedelta
from .models import Workout
from rest_framework import serializers

## Class for model workout form
class WorkoutForm(ModelForm):
    class Meta:
        model = Workout
        fields = '__all__'
        widgets = {
            'name':TextInput(attrs={'size':5}),
            'peak':TextInput(attrs={'style':'width:1.5em'}),
            'cardio':TextInput(attrs={'style':'width:1.5em'}),
            'fatburn':TextInput(attrs={'style':'width:1.5em'}),
            'calories':TextInput(attrs={'style':'width:3em'}),
            'heartrate':TextInput(attrs={'style':'width:2em'}),
            'hours':TextInput(attrs={'style':'width:1em'}),
            'minutes':TextInput(attrs={'style':'width:1em'}),
            'seconds':TextInput(attrs={'style':'width:1em'}),
            'distance':TextInput(attrs={'size':2}),
        }

## Serialize the workout model
class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'

def get_totals(workouts):
    times = []
    duration = timedelta(0,0)
    for w in workouts.values():
        hours = int(w.get('hours'))
        minutes = int(w.get('minutes'))
        seconds = int(w.get('seconds'))
        time = timedelta(0, (hours*3600+minutes*60+seconds))
        times.append(time)
    for t in times:
        duration = duration+t

    calories = 0
    for w in workouts.values():
        count = int(w.get('calories'))
        calories = calories + count
    return {'workouts': len(workouts), 'calories': calories, 'duration': duration}

def main(request):
    return render(request, 'main.html')


def chart(request, start_date, end_date):
    data_list = []
    query = Workout.objects.filter(date__gte=start_date,
                                    date__lte=end_date).order_by('-date')
    for q in query:
        data_list.append(WorkoutSerializer(q).data)
    return HttpResponse(json.dumps(data_list), content_type='application/json')


## List View
def list(request, start_date, end_date):
    workouts = Workout.objects.filter(date__gte=start_date,
                                    date__lte=end_date).order_by('-date')

    ## Get Totals for each field
    total = get_totals(workouts)

    ## Create formset from form class
    form = WorkoutForm()
    WorkoutFormset = modelformset_factory(Workout, form=WorkoutForm,
                         can_delete=True, can_order=True, extra=0)
    formset = WorkoutFormset(queryset=workouts.order_by('-date'))

    context = {'workouts':workouts, 'total': total,
                'formset': formset,
                'start_date': start_date, 'end_date': end_date}
    return render(request, 'list.html', context)

## Delete workout
def delete(request, year, month, pk):
    workout = get_object_or_404(Workout, pk=pk)
    if request.method == 'DELETE':
        workout.delete()
        data = {'Delete':'ok'}
        return HttpResponse(json.dumps(data), content_type='application/json')
    return redirect('list/'+year+'/'+month)

## Update workout
def update(request, year, month):
    WorkoutFormset = modelformset_factory(Workout, form=WorkoutForm)
    if request.method == 'POST':
        formset = WorkoutFormset(request.POST)
        if formset.is_valid():
            print ('POSTED')
            formset.save()
        return redirect('/list/'+year+'/'+month)
    else: print('NOT VALID')
    return redirect('/list/'+year+'/'+month)

