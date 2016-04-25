from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.forms import ModelForm
from django.forms import TextInput
from django.forms import modelformset_factory
import json
from datetime import datetime
from .models import Workout

## Class for model workout form
class WorkoutForm(ModelForm):
    class Meta:
        model = Workout
        fields = '__all__'
        widgets = {
            'name':TextInput(attrs={'size':5}),
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

## Show year view
def year_view(request):
    years = get_years()
    context = {'years': years}
    return render(request, 'year.html', context)

## Show month view
def month_view(request, year): 
    months = get_months(year)
    context = {'months': months, 'year': year}
    return render(request, 'month.html', context)

## Show workout view
def workout_view(request, year,  month):
    ## Get month number for model filter
    m = datetime.strptime(month,'%b').month
    workouts = Workout.objects.filter(date__year=year, date__month=m)
    workout_dates = get_dates()
    ## Create formset from form class
    form = WorkoutForm()
    WorkoutFormset = modelformset_factory(Workout, form=WorkoutForm,
                         can_delete=True, can_order=True, extra=0)
    formset = WorkoutFormset(queryset=workouts.order_by('-date'))   
    context = {'workouts': workouts, 'formset': formset, 
                'year':year, 'month': month}
    return render(request, 'workout.html', context)

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


def get_dates():
    workout_dates = []
    years = []
    all_workouts = Workout.objects.all()
    for w in all_workouts:
        y = w.date.year
        m = get_months(y)
        date = {'year':y,'months':m}
        if date not in workout_dates:
            workout_dates.append(date)
    return workout_dates

## Get years containing workouts
def get_years():
    years_group = []
    years = []
    for w in Workout.objects.all():
        year = w.date.year
        if year not in years:
            years.append(year)    
    for y in years:
        workouts = len(Workout.objects.filter(date__year=y))
        group = {'year': y,'workouts': workouts}
        years_group.append(group)
    return years_group

## Get month with given year containing workouts
def get_months(year):
    workouts = Workout.objects.filter(date__year=year)
    months_group = []
    months = []
    for w in workouts:
        month = w.date.strftime('%b')
        if month not in months:
            months.append(month)
    for m in months:
        month=datetime.strptime(m,'%b').month
        workouts = len(Workout.objects.filter(date__year=year,
                        date__month=month))
        group = {'month':m,'workouts':workouts}
        months_group.append(group)
    return months_group
