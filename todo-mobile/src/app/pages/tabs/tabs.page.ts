import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { add, documentOutline, libraryOutline, logOutOutline } from 'ionicons/icons';

@Component({
	selector: 'app-tabs',
	templateUrl: 'tabs.page.html',
	styleUrls: ['tabs.page.scss'],
	standalone: true,
	imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
	})
export class TabsPage implements OnInit {
	constructor() {
		addIcons({ add, documentOutline, libraryOutline, logOutOutline });
	}

	ngOnInit(): void {
	}
}