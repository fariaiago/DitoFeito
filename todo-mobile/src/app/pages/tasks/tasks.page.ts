import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { TaskFormComponent } from 'src/app/components/task-form/task-form.component';

@Component({
	selector: 'app-tasks',
	templateUrl: 'tasks.page.html',
	standalone: true,
	imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
	providers: [Storage, TaskService]
})
export class TasksPage implements OnInit {
	private userIdSubject = new BehaviorSubject<number>(0);
	tasks: Task[] = [];

	constructor(
		private taskService: TaskService,
		private storage: Storage,
		private alertController: AlertController,
		private modalController: ModalController
	) {}

	async ngOnInit() {
		await this.storage.create();
		this.storage.get('user').then((user) => {
			this.userIdSubject.next(user.id);
		})
		.then(() => this.storage.get('auth_token'))
		.then((token) => {
			this.taskService.setToken(token);
			this.loadTasks();
		})
	}

	loadTasks() {
		this.taskService.getTasks().subscribe({
		next: (tasks) => {
			this.tasks = tasks.filter((v, i) => v.user == this.userIdSubject.value)
				.sort((a, b) => +a.completed - +b.completed);
		},
		error: () => {
			// Handle error
		}
		});
	}

	toggleTaskCompletion(task: Task) {
		this.taskService.toggleTaskCompletion(task).subscribe({
		next: () => {
			this.loadTasks();
		}
		});
	}

	ionViewWillEnter() {
		console.log('kdjsljfdfho');
		this.storage.get('auth_token').then((token) => {
			this.taskService.setToken(token);
			this.loadTasks();
		})
	}

	async openTaskForm() {
		const modal = await this.modalController.create({
		component: TaskFormComponent,
		componentProps: {
			user_id: this.userIdSubject.value,
			token: this.taskService.authTokenSubject.value,
			onTaskCreated: () => this.loadTasks()
		}
		});
		await modal.present();
	}
}