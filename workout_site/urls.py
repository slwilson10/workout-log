from django.conf.urls import include, url
from django.contrib import admin
import workout.views

urlpatterns = [
        url(r'^list/All/$', workout.views.all),
        url(r'^list/(?P<year>\d+)/(?P<month>\w+)$', workout.views.month),
        url(r'^delete/(?P<year>\d+)/(?P<month>\w+)/(?P<pk>\d+)$', workout.views.delete),
	url(r'^update/(?P<year>\d+)/(?P<month>\w+)$', workout.views.update),
    	url(r'^admin/', include(admin.site.urls)),
]
