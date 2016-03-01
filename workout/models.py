from django.db import models

class Workout(models.Model):
    name = models.CharField(max_length=20)
    date = models.DateTimeField(auto_now=False,auto_now_add=False)
    calories = models.SmallIntegerField()
    distance = models.DecimalField(max_digits=5, decimal_places=2)
    hours = models.SmallIntegerField()
    minutes = models.SmallIntegerField()
    seconds = models.SmallIntegerField()
    heartrate = models.SmallIntegerField()
    peak = models.SmallIntegerField()
    cardio = models.SmallIntegerField()
    fatburn = models.SmallIntegerField()

    def __str__(self):
        return self.name


