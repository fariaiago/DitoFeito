import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',

})
export class AuthService {
	private authTokenSubject = new BehaviorSubject<string>('');
	private BASE_URL = 'http://localhost:8000/api';  // Django backend URL

	constructor(
		private http: HttpClient,
		private storage: Storage
	) {
		this.storage.create();
		this.loadToken();
	}

	private loadToken() {
		from(this.storage.get('auth_token')).subscribe(token => {
			this.authTokenSubject.next(token);
		});
	}

	login(username: string, password: string): Observable<any> {
		return this.http.post(`${this.BASE_URL}/login/`, { username, password }).pipe(
			switchMap((response: any) => {
				return from(this.storage.set('auth_token', response.token)).pipe(
					map(() => {
						this.authTokenSubject.next(response.token);
						return response;
					})
				);
			})
		);
	}

	logout() {
		return from(this.storage.remove('auth_token')).pipe(
			map(() => {
				this.authTokenSubject.next('');
			})
		);
	}

	get isAuthenticated(): Observable<boolean> {
		return this.authTokenSubject.pipe(
			map(token => token != '')
		);
	}

	getToken(): string {
		return this.authTokenSubject.value;
	}
}