# file to convert model instances to JSON so that the frontend can work with the received data easily.

from rest_framework import serializers
from .models import Todo

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo # specify the model we want to work with
        fields = ('id','name','completed') # specify the fields to work with
