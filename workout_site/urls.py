from django.conf.urls import include, url
from django.contrib import admin
import workout.views

urlpatterns = [
   	# Examples:
#    	url(r'^$', workout.views.index),
	url(r'^list/', workout.views.list),
        url(r'^delete/(?P<pk>\d+)$', workout.views.delete),
	url(r'^update/$', workout.views.update),
	#url(r'^all/', workout.views.all_workouts),
    	url(r'^admin/', include(admin.site.urls)),
]
