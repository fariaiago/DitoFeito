import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})
export class TaskiaryService {
	private authTokenSubject = new BehaviorSubject<string>('');
	private BASE_URL = 'http://localhost:8000/api/';

	constructor(
		private http: HttpClient,
	) {}

	setToken(token: string) {
		this.authTokenSubject.next(token);
	}

	private getHeaders(): HttpHeaders {
		return new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Token ${this.authTokenSubject.value}`
		});
	}

	getTasks(): Observable<Task[]> {
		return this.http.get<Task[]>(this.BASE_URL, { 
		headers: this.getHeaders() 
		});
	}
}