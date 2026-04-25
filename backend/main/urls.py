from django.urls import path
from . import views

urlpatterns = [
    path("questions/", views.questions_api, name="questions_api"),
    path("result/", views.result_api, name="result_api"),
]