import datetime
import sys
import os

def add_workout(workout):
    w = Workout.objects.get_or_create(name=workout[1],
        date=workout[0], calories=workout[2], heartrate=workout[3], 
        peak=workout[4], cardio=workout[5], fatburn=workout[6], distance=workout[7], 
        hours=workout[8], minutes=workout[9], seconds=workout[10])
    print (str(w))
   
## Scrap data from fitbit site, return workout list
def get_workout(dt):
   
    ## Set workout list and return
    workout=[dt, 'workout', '315', '110', '0', '10', 
        '20', '0.0', '01', '12', '15']
    return workout 
               

def check_workout_date(workout, current_date):
    if workout not in current_date:
        return True
    else: return False

# Main Loop
if __name__ == '__main__':
    print ("Starting Workouts Test population script...")
    ## Set environament varibles
    sys.path.append("~/workout_site/workout")
    os.environ['DJANGO_SETTINGS_MODULE'] =  'workout_site.settings'
    ## Import models from django
    import django
    django.setup()
    from workout.models import Workout
   
    ## Get list of all workout dates within db
    ## to check against new workouts being added
    current_dates = []
    for d in Workout.objects.all().order_by('-date'):
        dt = d.date.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]
        current_dates.append(dt)
    
    ## Add workouts
    ## Count for script progress
#    years = ['2012','2013','2014','2015']
#    months = ['01','02','03','04','05','06','07','08','09','10','11','12']
    year = ['2012']
    month = ['11']
    days = [] 
    count = 1
    max_count = 22
    while count <= max_count:
        if count<10:
            count_str = '0'+str(count)
        else:
            count_str = str(count)
        days.append(count_str)
        count = count+1
    
    for y in year:
        for m in month:
            for d in days:
                cur_date = datetime.datetime.now()
                tm = cur_date.strftime('%I:%M:%S.%f')
                

                dt_str = "%s-%s-%s %s" % (y,m,d,tm)               
                dt = datetime.datetime.strptime(dt_str,
                   '%Y-%m-%d %I:%M:%S.%f')

                ## Get list of all workouts
                workout = get_workout(dt) 
                ## Check against current_dates to avoid duplicates
                if check_workout_date(workout[0], current_dates):
                    ## Add workout to db
                    add_workout(workout)
