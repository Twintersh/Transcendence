import { Component } from '@angular/core';
import { User } from 'src/app/models/user.model'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
	friends!: User[];

	constructor() {
		this.friends = [
			{ id: 1, username: 'Jack', avatar: 'https://www.w3schools.com/howto/img_avatar.png', isActive: true},
			{ id: 2, username: 'Titi', avatar: 'https://www.w3schools.com/howto/img_avatar.png', isActive: true},
			{ id: 3, username: 'Back', avatar: 'https://www.w3schools.com/howto/img_avatar.png', isActive: true},
			{ id: 4, username: 'Toto', avatar: 'https://www.w3schools.com/howto/img_avatar.png', isActive: true},
			{ id: 5, username: 'Tack', avatar: 'https://www.w3schools.com/howto/img_avatar.png', isActive: true},
			{ id: 6, username: 'Tutu', avatar: 'https://www.w3schools.com/howto/img_avatar.png', isActive: true},
			{ id: 7, username: 'Jack', avatar: 'https://www.w3schools.com/howto/img_avatar.png', isActive: true},
			{ id: 8, username: 'Titi', avatar: 'https://www.w3schools.com/howto/img_avatar.png', isActive: true},
			{ id: 9, username: 'Back', avatar: 'https://www.w3schools.com/howto/img_avatar.png', isActive: true},
			{ id: 10, username: 'Toto', avatar: 'https://www.w3schools.com/howto/img_avatar.png', isActive: true},
			{ id: 11, username: 'Tack', avatar: 'https://www.w3schools.com/howto/img_avatar.png', isActive: true},
			{ id: 12, username: 'Tutu', avatar: 'https://www.w3schools.com/howto/img_avatar.png', isActive: true},
			{ id: 13, username: 'Jack', avatar: 'https://www.w3schools.com/howto/img_avatar.png', isActive: true},
			{ id: 14, username: 'Titi', avatar: 'https://www.w3schools.com/howto/img_avatar.png', isActive: true},
			{ id: 15, username: 'Back', avatar: 'https://www.w3schools.com/howto/img_avatar.png', isActive: true},
			{ id: 16, username: 'Toto', avatar: 'https://www.w3schools.com/howto/img_avatar.png', isActive: true},
			{ id: 17, username: 'Tack', avatar: 'https://www.w3schools.com/howto/img_avatar.png', isActive: true},
			{ id: 18, username: 'Tutu', avatar: 'https://www.w3schools.com/howto/img_avatar.png', isActive: true},
		];

		console.log('Friends:', this.friends);
		console.log('Friends:', this.friends.length);
	}
}