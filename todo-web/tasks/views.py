from django.shortcuts import render, redirect, HttpResponse
from django.urls import reverse_lazy
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout, authenticate
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.views.generic.edit import CreateView
from django.views.generic import View, UpdateView
from .models import Task
from .forms import TaskForm, UserRegisterForm
from .serializers import TaskSerializer, LoginSerializer
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, GenericAPIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication

@login_required
def create_task(request):
	if request.method == 'POST':
		form = TaskForm(request.POST)
		if form.is_valid():
			task = form.save(commit=False)
			task.user = request.user
			task.save()
			return redirect('task_list')
	else:
		form = TaskForm()
	return render(request, 'tasks/create_task.html', {'form': form})

@login_required
def task_list(request):
	# Get all tasks
	tasks = Task.objects.filter(user=request.user).order_by('-created_at')

	# Get completed tasks by all users
	completed_tasks = tasks.filter(completed=True).order_by('-created_at')

	return render(request, 'tasks/task_list.html', {
		'tasks': tasks,
		'completed_tasks': completed_tasks
	})

@login_required
def taskiary(request):

	# Get completed tasks by all users
	completed_tasks = Task.objects.filter(completed=True).order_by('-created_at')

	return render(request, 'tasks/taskiary.html', {
		'completed_tasks': completed_tasks
	})

@login_required
def toggle_task_complete(request, pk):
	task = Task.objects.get(id=pk)
	task.completed = not task.completed
	task.save()
	return redirect('task_list')

@login_required
def delete_task(request, pk):
	task = Task.objects.get(id=pk)
	task.delete()
	return redirect('task_list')

class TaskEditView(LoginRequiredMixin, UpdateView):
	model = Task
	template_name = 'tasks/task.html'
	form_class = TaskForm
	success_url = reverse_lazy('task_list')

class LogoutView(View):
	def get(self, request):
		logout(request)
		return redirect(reverse_lazy('login'))

class RegisterView(SuccessMessageMixin, CreateView):
	template_name = 'register.html'
	success_url = reverse_lazy('login')
	form_class = UserRegisterForm
	success_message = "Your profile was created successfully"

class APILoginView(GenericAPIView):
	serializer_class = LoginSerializer
	authentication_classes = [TokenAuthentication]

	def post(self, request):
		serializer = LoginSerializer(data = request.data)
		if serializer.is_valid(raise_exception=True):
			user = authenticate(username=serializer.data['username'], password=serializer.data['password'])
			if user:
				token, created = Token.objects.get_or_create(user=user)
				return Response({'user': {'id': user.pk, 'username': user.username, 'password': user.password}, 'token': token.key}, status=201 if created else 200 )
			return HttpResponse(status=403)

class APITaskListCreate(ListCreateAPIView):
	serializer_class = TaskSerializer
	authentication_classes = [TokenAuthentication]
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return Task.objects.all()

class APITaskRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
	serializer_class = TaskSerializer
	authentication_classes = [TokenAuthentication]
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return Task.objects.all()