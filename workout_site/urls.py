from django.conf.urls import include, url
from django.contrib import admin
import workout.views

urlpatterns = [
        url(r'^$', workout.views.year_view),
        url(r'^(?P<year>\d+)/$', workout.views.month_view),
        url(r'^(?P<year>\d+)/(?P<month>\w+)/$', workout.views.workout_view),
        url(r'^(?P<year>\d+)/(?P<month>\w+)/(?P<pk>\d+)/delete/$', workout.views.delete),
	url(r'^(?P<year>\d+)/(?P<month>\w+)/update/$', workout.views.update),
    	url(r'^admin/', include(admin.site.urls)),
]
