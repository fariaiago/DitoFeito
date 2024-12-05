import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TaskiaryService } from 'src/app/services/taskiary.service';
import { Storage } from '@ionic/storage-angular';

@Component({
	selector: 'app-taskiary',
	templateUrl: 'taskiary.page.html',
	standalone: true,
	imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
	providers: [Storage, TaskiaryService],
})
export class TaskiaryPage implements OnInit {
	tasks: Task[] = [];

	constructor(
		private taskiaryService: TaskiaryService,
		private storage: Storage,
	) {}

	async ngOnInit() {
		await this.storage.create();
		this.storage.get('auth_token')
		.then((token) => {
			this.taskiaryService.setToken(token);
			this.loadTasks();
		})
	}

	loadTasks() {
		this.taskiaryService.getTasks().subscribe({
		next: (tasks) => {
			this.tasks = tasks.filter((v, i) => v.completed);
		},
		error: () => {
			// Handle error
		}
		});
	}
}