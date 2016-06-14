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

## Returns list of days from current to past date
def get_date_range(date_cur,date_past):
    date_range = []
    
    while date_cur != date_past:
        date_range.append(date_cur)
        date_cur = date_cur+relativedelta(days=-1)
    date_range.append(date_cur)
    return date_range


def listify_workout_objs(workout_objs): 
    workouts = [] 
    for w in workout_objs:
        workout = {
            'date':w.date.strftime('%Y %m %d'),'name':w.name,
            'calories':w.calories,'heartrate':w.heartrate, 
            'peak':w.peak, 'cardio':w.cardio,'fatburn':w.fatburn, 
            'hours':w.hours, 'minutes':w.minutes,
            'seconds':w.seconds, 'distance':w.distance}
        workouts.append(workout)
    return workouts


## Turns workout objects into workout lists of dicts   
def get_workouts(date_range, workout_objs):
    workouts = []
    workouts_list = listify_workout_objs(workout_objs)
    
    ## Loops through date_range, adds empty workouts for dates not found in workout_list
    for d in date_range:
        workout =  next((item for item in workouts_list if item['date'] == d.strftime('%Y %m %d')), None)
        if workout != None:
            workouts.append(workout)
        else:
                workouts.append({
                    'date':d.strftime('%Y %m %d'),'name':' ','calories':0,
                    'heartrate':0, 'peak':0, 'cardio':0,
                    'fatburn':0, 'hours':0, 'minutes':0,
                    'seconds':0, 'distance':0}) 
    return workouts

def get_total(workouts, field):
    if field == 'duration':
        times = []
        total = timedelta(0,0)
        for w in workouts:
            hours = int(w.get('hours', None))
            minutes = int(w.get('minutes', None))
            seconds = int(w.get('seconds', None))
            time = timedelta(0, (hours*3600+minutes*60+seconds))
            times.append(time)
        for t in times:
            total = total+t   
        return total       
    else:
        total = 0
        for w in workouts:
            count = int(w.get(field, None))
            total = total + count
    return total

def main(request):
    date_cur = date.today()
    date_past = date.today()+relativedelta(days=-7)

    past_week = date_cur+relativedelta(days=-7)
    past_month = date_cur+relativedelta(months=-1)
    past_year = date_cur+relativedelta(years=-1)

    context = { 'date_cur': date_cur, 'date_past': date_past,
                'past_week':past_week,
                'past_month':past_month,
                'past_year':past_year}

    return render(request, 'main.html', context)


## Set default date for if none is passed to chart_data view
date_default = date.today()+relativedelta(days=-7)
day_default = date_default.day
month_default = date_default.month
year_default = date_default.year

## Chart Data
def chart_data(request, year=year_default, month=month_default,
                    day=day_default):
    date_cur = date.today()
    date_past = date(int(year), int(month), int(day))
    date_range = get_date_range(date_cur,date_past) 
    workout_objs = Workout.objects.filter(date__gte=date_past).order_by('-date')
    if len(date_range) > 8:
        workouts = listify_workout_objs(workout_objs)
    else:
        workouts = get_workouts(date_range, workout_objs)
    
    ## Get Totals for each field
    total_workouts = len(workout_objs)
    total_calories = get_total(workouts, 'calories')
    total_duration = get_total(workouts, 'duration')

    ## Create formset from form class
    form = WorkoutForm()
    WorkoutFormset = modelformset_factory(Workout, form=WorkoutForm,
                         can_delete=True, can_order=True, extra=0)
    formset = WorkoutFormset(queryset=workout_objs.order_by('-date'))   
    
    context = {'workouts': workouts, 'formset': formset,
                'date_cur': date_cur, 'date_past': date_past,
                'total_calories': total_calories, 'total_workouts': total_workouts,
                'total_duration': total_duration}
 
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

