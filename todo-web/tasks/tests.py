from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase, force_authenticate, APIRequestFactory
from tasks.models import Task
from tasks.forms import TaskForm

class TestsViewTasksList(TestCase):
	def setUp(self):
		self.user = User.objects.create(username='Teste', password='12345@teste')
		self.client.force_login(self.user)
		self.url = reverse('task_list')
		Task(title='Tarefa', description='Tarefa a ser feita', user=self.user).save()
	
	def test_get(self):
		response = self.client.get(self.url)
		self.assertEqual(response.status_code, 200)
		self.assertEqual(len(response.context.get('tasks')), 1)

class TestesViewTaskCreate(TestCase):
	def setUp(self):
		self.user = User.objects.create(username='teste', password='12345@teste')
		self.client.force_login(self.user)
		self.url = reverse('create_task')
	
	def test_get(self):
		response = self.client.get(self.url)
		self.assertEqual(response.status_code, 200)
		self.assertIsInstance(response.context.get('form'), TaskForm)
	
	def test_post(self):
		data = {'title': 'Tarefa', 'description': 'Tarefa a ser feita', 'user': self.user}
		response = self.client.post(self.url, data)

		self.assertEqual(response.status_code, 302)
		self.assertRedirects(response, reverse('task_list'))

		self.assertEqual(Task.objects.count(), 1)
		self.assertEqual(Task.objects.first().title, 'Tarefa')

class TestesViewTaskEdit(TestCase):
	def setUp(self):
		self.user = User.objects.create(username='teste', password='12345@teste')
		self.client.force_login(self.user)
		self.task = Task.objects.create(title='Tarefa', description='Tarefa a ser feita', user=self.user)
		self.url = reverse('edit_task', kwargs={'pk': self.task.pk})
	
	def test_get(self):
		response = self.client.get(self.url)
		self.assertEqual(response.status_code, 200)
		self.assertIsInstance(response.context.get('object'), Task)
		self.assertIsInstance(response.context.get('form'), TaskForm)
		self.assertEqual(response.context.get('object').pk, self.task.pk)
		self.assertEqual(response.context.get('object').description, self.task.description)
	
	def test_post(self):
		data = {'title': 'Tarefa', 'description': 'Tarefa que será feita', 'user': self.user}
		response = self.client.post(self.url, data)

		self.assertEqual(response.status_code, 302)
		self.assertRedirects(response, reverse('task_list'))

		self.assertEqual(Task.objects.count(), 1)
		self.assertEqual(Task.objects.first().description, 'Tarefa que será feita')
		self.assertEqual(Task.objects.first().pk, self.task.pk)

class TestesViewTaskDelete(TestCase):
	def setUp(self):
		self.user = User.objects.create(username='teste', password='12345@teste')
		self.client.force_login(self.user)
		self.task = Task.objects.create(title='Tarefa', description='Tarefa a ser feita', user=self.user)
		self.url = reverse('delete_task', kwargs={'pk': self.task.pk})
	
	def test_post(self):
		response = self.client.post(self.url)

		self.assertEqual(response.status_code, 302)
		self.assertRedirects(response, reverse('task_list'))

		self.assertEqual(Task.objects.count(), 0)

class TestesViewTaskToggle(TestCase):
	def setUp(self):
		self.user = User.objects.create(username='teste', password='12345@teste')
		self.client.force_login(self.user)
		self.task = Task.objects.create(title='Tarefa', description='Tarefa a ser feita', user=self.user)
		self.url = reverse('toggle_complete', kwargs={'pk': self.task.pk})
	
	def test_post(self):
		response = self.client.post(self.url)

		self.assertEqual(response.status_code, 302)
		self.assertRedirects(response, reverse('task_list'))

		self.assertEqual(Task.objects.count(), 1)
		self.assertEqual(Task.objects.first().completed, True)

class TestesAPITaskListCreate(APITestCase):
	def setUp(self):
		self.user = User.objects.create_superuser(username='admin', email='admin@mail.com', password='12345@teste')
		self.token = Token.objects.create(user=self.user)
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
		self.url = reverse('api_task_list_create')
	
	def test_get(self):
		Task(title='Tarefa', description='Tarefa a ser feita', user=self.user).save()
		response = self.client.get(self.url, format='json')

		self.assertEqual(response.status_code, 200)
		self.assertEqual(len(response.json()), 1)
	
	def test_post(self):
		data = {'title': 'Tarefa', 'description': 'Tarefa a ser feita', 'user': self.user.pk}
		self.client.post(self.url, data, format='json')
		self.assertEqual(Task.objects.count(), 1)
		self.assertEqual(Task.objects.first().title, 'Tarefa')
		self.assertEqual(Task.objects.first().description, 'Tarefa a ser feita')

class TestesAPITaskRetrieveUpdateDestroy(APITestCase):
	def setUp(self):
		self.user = User.objects.create_superuser(username='admin', email='admin@mail.com', password='12345@teste')
		self.token = Token.objects.create(user=self.user)
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
		self.task = Task.objects.create(title='Tarefa', description='Tarefa a ser feita', user=self.user)
		self.url = reverse('api_task_retrieve_update_destroy', kwargs={'pk': self.task.pk})
	
	def test_get(self):
		response = self.client.get(self.url)

		self.assertEqual(response.status_code, 200)
		self.assertEqual(len(response.json()), 6)

		self.assertEqual(response.json()['id'], self.task.pk)
		self.assertEqual(response.json()['title'], self.task.title)
		self.assertEqual(response.json()['description'], self.task.description)
		self.assertEqual(response.json()['user'], self.task.user.pk)
		
	def test_put(self):
		data = {'id': self.task.pk, 'title': 'Tarefa', 'description': 'Tarefa foi feita', 'created_at': self.task.created_at, 'user': self.user.pk}
		response = self.client.put(self.url, data)
		
		self.assertEqual(response.status_code, 200)
		self.assertEqual(len(response.json()), 6)
		
		self.assertEqual(response.json()['id'], data['id'])
		self.assertEqual(response.json()['title'], data['title'])
		self.assertEqual(response.json()['description'], data['description'])
		self.assertEqual(response.json()['user'], data['user'])
		
	def test_delete(self):
		response = self.client.delete(self.url)

		self.assertEqual(response.status_code, 204)
		self.assertEqual(Task.objects.count(), 0)