import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';

@Component({
	selector: 'app-login',
	templateUrl: 'login.page.html',
	styleUrls: ['login.page.scss'],
	standalone: true,
	imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
	providers: [Storage, AuthService],
})
export class LoginPage {

	constructor(
		private authService: AuthService,
		private http: HttpClient,
		private storage: Storage,
		private navController: NavController,
		private alertController: AlertController,
		private loadingController: LoadingController
	) {}

	async ngOnInit() {
		await this.storage.create();
	}

	public instance: { username: string, password: string } = {
		username: '',
		password: ''
	}

	async login() {
		const loading = await this.loadingController.create({ message: 'Logging in...', duration: 15000 });
		await loading.present();

		this.authService.login(this.instance.username, this.instance.password).subscribe({
		next: async (response: any) => {
			await loading.dismiss();
			console.log(response)
			let user: User = Object.assign(new User(), response.user);
			await this.storage.set('user', user);
			this.navController.navigateRoot('/tasks');
		},
		error: async (err) => {
			await loading.dismiss();
			const alert = await this.alertController.create({
			header: 'Login Failed',
			message: 'Invalid username or password',
			buttons: ['OK']
			});
			await alert.present();
		}
		});
	}
}