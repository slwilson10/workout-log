from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.forms import ModelForm
from django.forms import TextInput
from django.forms import modelformset_factory
import json
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
cur_date = date.today()
past_date = cur_date+relativedelta(months=-1)
var_date_range= (cur_date,past_date)
def main(request, date_range=var_date_range):
    dates_range = {'cur':date_range[0],'past':date_range[1]}
    workouts = Workout.objects.filter(date__range=[date_range[0],date_range[1]])
    ## Create formset from form class
    form = WorkoutForm()
    WorkoutFormset = modelformset_factory(Workout, form=WorkoutForm,
                         can_delete=True, can_order=True, extra=0)
    formset = WorkoutFormset(queryset=workouts.order_by('-date'))   
    context = {'workouts': workouts, 'formset': formset,
                'date_range':dates_range}
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

