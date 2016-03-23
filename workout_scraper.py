import urllib.request
import re
import json
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import time
from time import localtime, strftime
import datetime
from datetime import date, datetime, time, timedelta
import os
import sys
from decimal import Decimal

def get_ids(browser):
    wait = WebDriverWait(browser, 10)
    element = wait.until(
        EC.presence_of_element_located((By.XPATH, '//*[@id="contentBody"]/section[2]/div/div/form/button'))
    )
    element.click()
    table = wait.until(
        EC.presence_of_element_located((By.XPATH, '//*[@id="contentBody"]/section[2]/div/div/table/tbody[20]'))
    )
    ids = []
    body = browser.find_element(By.XPATH,'//*[@id="contentBody"]/section[2]/div/div')
    stuff = body.find_element(By.TAG_NAME,'table').find_elements(By.TAG_NAME,'tbody')
    for i in stuff:
        id = i.get_attribute('data-log-id')
        ids.append(id)
            
    return (ids)
    
def add_workout(workout):
    w = Workout.objects.get_or_create(name=workout[1],
        date=workout[0], calories=workout[2], heartrate=workout[3], 
        peak=workout[4], cardio=workout[5], fatburn=workout[6], distance=workout[7], 
        hours=workout[8], minutes=workout[9], seconds=workout[10])
    print (str(w))

def check_workout_date(workout, current_date):
    if workout not in current_date:
        return True
    else: return False
    
## Grabs some of the data from Activities page
def get_workout(i, browser, url):
    ### FIND ELELEMNTS BY SLECTORS NOT DIV PLACEMENT ###
    browser.get(url+'/exercise/'+i)
    regex = re.compile(r'([^\s]+)')
    stats = browser.find_element_by_xpath("/html/body/main/div/section[1]/header/div/div")
    zones = browser.find_element_by_xpath('/html/body/main/div/div/div/div/div/div/section[2]/div[1]/dl')
    
    try:
        datetime = stats.find_element_by_tag_name('time').get_attribute('datetime')
    except NoSuchElementException:
        datetime = datetime.datetime.now()
    try:
        name = stats.find_element_by_css_selector("span.container").text
        name = regex.split(name)[1]
    except NoSuchElementException:
        name = 'N/A'
    try:
        if name == 'Run':
            calories = browser.find_element_by_xpath('/html/body/main/div/section[2]/div/div/ul/li[2]/b').text
            calories = calories[1:]
        else:
            calories = stats.find_element_by_css_selector("b.total-calories").text
        if len(calories)>2:
          calories = int(calories.replace(',',''))
        else: calories=int(calories)	
    except NoSuchElementException:
        calories = 0
    try:
        duration = stats.find_element_by_css_selector("b.duration").text
        if len(duration) < 7:
            duration = '00:' + duration
        duration = duration.split(':') 
        hours=int(duration[0])
        minutes=int(duration[1])
        seconds=int(duration[2])
    except NoSuchElementException:
        hours = 0
        minutes = 0
        seconds = 0
    try:
        if name == 'Run':
            heartrate = int(browser.find_element_by_xpath(
                            '/html/body/main/div/div/div/div/div/div/section[3]/div[1]/dl/dd/b').text)
        else:
            heartrate = int(stats.find_element_by_css_selector("b.average-heart-rate").text)
    except NoSuchElementException:
        heartrate = 0
    try:
        if name == 'Run':
            zones = browser.find_element_by_xpath('/html/body/main/div/div/div/div/div/div/section[4]/div[1]/dl')
        peak = zones.find_element_by_css_selector("dd.peak-minutes").find_element_by_tag_name("span").text 
    except NoSuchElementException:
        peak = 0
    try:
        cardio = zones.find_element_by_css_selector("dd.cardio-minutes").find_element_by_tag_name("span").text 
        
    except NoSuchElementException:
        cardio = 0
    try:
        fatburn = zones.find_element_by_css_selector("dd.fat-burn-minutes").find_element_by_tag_name("span").text 
        
    except NoSuchElementException:
        fatburn = 0
    try:
        distance = stats.find_element_by_css_selector("b.distance").text
        if distance == '--':
            distance = 0.00
        distance = Decimal(distance)
    except NoSuchElementException:
        distance = 0.00
    
    workout=[datetime, name, calories, heartrate, peak, cardio, 
                fatburn, distance, hours, minutes, seconds]
    return workout 
               
# Start execution here!
if __name__ == '__main__':
    print ("Starting Workouts population script...")
    sys.path.append("~/workout_site/workout")
    os.environ['DJANGO_SETTINGS_MODULE'] =  'workout_site.settings'
    import django
    django.setup()
    from workout.models import Workout
    ## Set scraper variables
    url = 'https://www.fitbit.com/activities'
    email = 'slwilson10@gmail.com'
    password = 'Foreshadow3821'

    ## Start brower and login
    # chromedriver = 'C:/Users/eGenesis/Programming/python/scraper/chromedriver.exe'
    # browser = webdriver.Chrome(chromedriver)
    browser = webdriver.PhantomJS()
    browser.get(url)
    browser.find_element(By.XPATH,'//*[@id="loginForm"]/fieldset/dl/dd[1]/input').send_keys(email)
    browser.find_element(By.XPATH,'//*[@id="loginForm"]/fieldset/dl/dd[2]/input').send_keys(password)
    browser.find_element(By.XPATH, '//*[@id="loginForm"]/div[1]/button').click()
    ids = get_ids(browser)
    current_dates = []
    for d in Workout.objects.all().order_by('-date'):
        datetime = d.date.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]
        current_dates.append(datetime)
    count = 1 
    for i in ids:
        print('*' * count)
        workout = get_workout(i, browser, url) 
        if check_workout_date(workout[0], current_dates):
            add_workout(workout)
        count = count + 1

