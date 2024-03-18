import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';

@NgModule({
declarations: [
	PageNotFoundComponent
],
imports: [
	NgbModule,
	CommonModule,
	FormsModule,
	ReactiveFormsModule
],
exports: [
	PageNotFoundComponent
]
})
export class SharedModule {
}
