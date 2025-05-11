import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RoomModel } from '../../../../../../core/models/room.model';

@Component({
  selector: 'app-rooms-list',
  standalone: false,
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomsListComponent {
  // Receive rooms and loading state from parent
  @Input() rooms: RoomModel[] | null = [];
  @Input() isLoading : boolean | null = false;
}
