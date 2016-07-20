from django.conf.urls import include, url
from . import views

urlpatterns = [
        url(r'^list/(?P<start_date>[-\w]+)/(?P<end_date>[-\w]+)/$', views.list),
        url(r'^chart/(?P<start_date>[-\w]+)/(?P<end_date>[-\w]+)/$', views.chart),
        url(r'^(?P<year>\d+)/(?P<month>\w+)/(?P<pk>\d+)/delete/$', views.delete),
	url(r'^(?P<year>\d+)/(?P<month>\w+)/update/$', views.update),
        url(r'^$', views.main),
]
