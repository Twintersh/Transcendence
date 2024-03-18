import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WinModalComponent } from './components/win-modal/win-modal.component';
import { GameComponent } from './components/game/game.component';



@NgModule({
  declarations: [
    WinModalComponent,
	GameComponent
  ],
  imports: [
    CommonModule
  ]
})
export class GameModule { }
