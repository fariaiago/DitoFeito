from rest_framework import serializers
from .models import Task
from django.contrib.auth.models import User

class TaskSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = Task
		exclude = []

class LoginSerializer(serializers.Serializer):
	username = serializers.CharField(max_length=150)
	password = serializers.CharField(max_length=128)

	class Meta:
		model = User
		fields = ('username', 'password',)