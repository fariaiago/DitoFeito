import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TabsPage } from './pages/tabs/tabs.page';
import { AuthGuard } from './guards/auth.guard';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},
	{
		path: 'login',
		loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
	},
	{
		path: 'home',
		loadComponent: () => import('./home/home.page').then(m => m.HomePage),
	},
	{
		path: 'tasks',
		component: TabsPage,
		children: [
			{
				path: '',
				canActivate: [AuthGuard],
				loadComponent: () => import('./pages/tasks/tasks.page').then(m => m.TasksPage)
			},
			{
				path: 'taskiary',
				canActivate: [AuthGuard],
				loadComponent: () => import('./pages/taskiary/taskiary.page').then(m => m.TaskiaryPage)
			},
			{
				path: 'logout',
				canActivate: [AuthGuard],
				loadComponent: () => import('./pages/logout/logout.page').then(m => m.LogoutPage)
			},
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule],
	providers: [provideHttpClient(withFetch())],
})
export class AppRoutingModule { }