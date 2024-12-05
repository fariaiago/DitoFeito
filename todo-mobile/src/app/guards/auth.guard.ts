import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { provideHttpClient, withFetch } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(
		private authService: AuthService,
		private router: Router
	) {
		provideHttpClient(withFetch());
	}

	canActivate(): Observable<boolean> {
		return this.authService.isAuthenticated.pipe(
			take(1),
			map(isAuthenticated => {
				if (!isAuthenticated) {
					this.router.navigate(['/login']);
					return false;
				}
			return true;
		})
		);
	}
}