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

def get_date_range(date_cur,date_past):
    date_range = []
    while date_cur != date_past:
        date_range.append(date_cur)
        date_cur = date_cur+relativedelta(days=-1)
    date_range.append(date_cur)
    return date_range
    
def get_workouts(date_range, workout_objs):
    workouts = []
    stamp = '%Y %m %d'
    def listify_workout_objs(workout_objs): 
        workouts = []
        
        for w in workout_objs:
            workout = {
                'date':w.date.strftime(stamp),'name':w.name,
                'calories':w.calories,'heartrate':w.heartrate, 
                'peak':w.peak, 'cardio':w.cardio,'fatburn':w.fatburn, 
                'hours':w.hours, 'minutes':w.minutes,
                'seconds':w.seconds, 'distance':w.distance}
            workouts.append(workout)
        return workouts
    
    workouts_list = listify_workout_objs(workout_objs)
    for d in date_range:
        workout =  next((item for item in workouts_list if item['date'] == d.strftime(stamp)), None)
        if workout != None:
            workouts.append(workout)
        else:
                workouts.append({
                    'date':d.strftime(stamp),'name':' ','calories':0,
                    'heartrate':0, 'peak':0, 'cardio':0,
                    'fatburn':0, 'hours':0, 'minutes':0,
                    'seconds':0, 'distance':0}) 
    return workouts

date_default = date.today()+relativedelta(days=-7)
day_default = date_default.day
month_default = date_default.month
year_default = date_default.year
def main(request, year=year_default, month=month_default,
                    day=day_default):
    date_cur = date.today()
    date_past = (int(year),int(month),int(day))
    date_past = date(*date_past)
    date_range = get_date_range(date_cur,date_past)
    
    
    past_week = date_cur+relativedelta(days=-7)
    past_week = past_week.strftime('%Y %m %d')
    
    past_month = date_cur+relativedelta(months=-1)
    past_month = past_month.strftime('%Y %m %d')
  
    past_year = date_cur+relativedelta(years=-1)
    past_year = past_year.strftime('%Y %m %d')
    workout_objs = Workout.objects.filter(date__gte=date_past).order_by('-date')
    workouts = get_workouts(date_range, workout_objs)

## Create formset from form class
    form = WorkoutForm()
    WorkoutFormset = modelformset_factory(Workout, form=WorkoutForm,
                         can_delete=True, can_order=True, extra=0)
    formset = WorkoutFormset(queryset=workout_objs.order_by('-date'))   
    context = {'workouts': workouts, 'formset': formset,
                'date_cur': date_cur,
                'past_week':past_week,
                'past_month':past_month,
                'past_year':past_year}
    if request.is_ajax():
        return  render(request, 'chart.html', context)
    return render(request, 'main.html', context)

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

