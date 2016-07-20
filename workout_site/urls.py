from django.conf.urls import include, url, patterns
from django.contrib import admin

urlpatterns = [
	url(r'^workout/', include('workout.urls')),
        url(r'^admin/', include(admin.site.urls)),

]

