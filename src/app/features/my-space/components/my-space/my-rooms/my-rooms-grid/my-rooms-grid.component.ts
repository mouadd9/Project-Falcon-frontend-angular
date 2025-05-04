import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RoomModel } from '../../../../models/room.model';

// dumb component
@Component({
  selector: 'app-my-rooms-grid',
  standalone: false,
  templateUrl: './my-rooms-grid.component.html',
  styleUrl: './my-rooms-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyRoomsGridComponent {
  // Receive rooms and loading state from parent
  @Input() rooms: RoomModel[] | null = [];
  @Input() isLoading : boolean | null = false;
}
