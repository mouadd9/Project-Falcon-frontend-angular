import { Component, Input } from '@angular/core';
import { RoomModel } from '../../../../../my-space/models/room.model';

@Component({
  selector: 'app-rooms-list',
  standalone: false,
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.scss',
})
export class RoomsListComponent {
  // Receive rooms and loading state from parent
  @Input() rooms: RoomModel[] | null = [];
  @Input() isLoading : boolean | null = false;
}
