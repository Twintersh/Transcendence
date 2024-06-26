import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { MatchComponent } from './components/match/match.component';
import { EditOffcanvasComponent } from './components/edit-offcanvas/edit-offcanvas.component';

@NgModule({
  declarations: [
    UserProfileComponent,
    MatchComponent,
    EditOffcanvasComponent
  ],
  imports: [
    CommonModule,
	ReactiveFormsModule
  ]
})
export class UserModule { }
