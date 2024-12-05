from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from tasks import views

urlpatterns = [
	path('admin/', admin.site.urls),
	path('tasks/', views.task_list, name='task_list'),
	path('tasks/create/', views.create_task, name='create_task'),
	path('tasks/taskiary/', views.taskiary, name='taskiary'),
	path('tasks/toggle/<int:pk>/', views.toggle_task_complete, name='toggle_complete'),
	path('tasks/edit/<int:pk>/', views.TaskEditView.as_view(), name='edit_task'),
	path('tasks/delete/<int:pk>/', views.delete_task, name='delete_task'),
	path('', auth_views.LoginView.as_view(template_name='login.html', redirect_authenticated_user=True), name='login'),
	path('register/', views.RegisterView.as_view(), name='register'),
	path('logout/', views.LogoutView.as_view(), name='logout'),
	path('api/login/', views.APILoginView.as_view(), name='api_login'),
	path('api/', views.APITaskListCreate.as_view(), name='api_task_list_create'),
	path('api/<int:pk>/', views.APITaskRetrieveUpdateDestroy.as_view(), name='api_task_retrieve_update_destroy'),
]