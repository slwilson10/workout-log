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

## Show workout view


day_default = date.today()+relativedelta(days=-7)
day_default = day_default.day
month_default = date.today().month
year_default = date.today().year
def main(request, year=year_default, month=month_default,
                    day=day_default):
    date_cur = date.today()
    date_past = (int(year),int(month),int(day))
    date_past = date(*date_past)
    past_week = date_cur+relativedelta(days=-7)
    past_week = past_week.strftime('%Y %m %d')
    past_month = date_cur+relativedelta(months=-1)
    past_month = past_month.strftime('%Y %m %d')
    past_year = date_cur+relativedelta(years=-1)
    past_year = past_year.strftime('%Y %m %d')
    workouts = Workout.objects.filter(date__lte=date_cur,
                                    date__gte=date_past).order_by('-date')
    ## Create formset from form class
    form = WorkoutForm()
    WorkoutFormset = modelformset_factory(Workout, form=WorkoutForm,
                         can_delete=True, can_order=True, extra=0)
    formset = WorkoutFormset(queryset=workouts.order_by('-date'))   
    context = {'workouts': workouts, 'formset': formset,
                'date_cur': date_cur,
                'past_week':past_week, 'past_month':past_month,
                'past_year':past_year}
    if request.is_ajax():
        return  render(request, 'range.html', context)
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

