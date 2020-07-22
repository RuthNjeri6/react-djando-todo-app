from django.shortcuts import render
from .models import Todo
from rest_framework import viewsets
from .serializers import TodoSerializer


# Create your views here.
class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()
