import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-task-form',
  templateUrl: 'task-form.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  styleUrls: ['task-form.component.scss'],
  providers: [TaskService],
})
export class TaskFormComponent {
	user_id: number = 0;
	token: string = '';
	task: Task = {
		id: 0,
		title: '',
		description: '',
		created_at: '',
		completed: false,
		user: 0,
	};

	constructor(
		private modalController: ModalController,
		private taskService: TaskService,
	) {}

	isFormValid(): boolean {
		return !!this.task.title.trim();
	}

	createTask() {
		if (this.isFormValid()) {
			this.taskService.setToken(this.token);
			this.taskService.createTask(this.user_id, this.task).subscribe({
				next: () => {
					this.dismiss(true);
				},
				error: (err) => {
					// Handle error (you might want to show an error toast)
					console.error('Error creating task', err);
				}
			});
		}
	}

	dismiss(dataChanged: boolean = false) {
		this.modalController.dismiss({
			dataChanged
		});
	}
}