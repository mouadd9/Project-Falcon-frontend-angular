import { Component, OnInit } from '@angular/core';
import { RoomModel } from '../../../../my-space/models/room.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { JwtService } from '../../../../auth/services/jwt.service';
import {
  selectRooms,
  selectRoomsloadingState,
} from '../../../state/rooms/rooms.selectors';
import { RoomsActions } from '../../../state/rooms/rooms.actions';

@Component({
  selector: 'app-rooms-container',
  standalone: false,
  templateUrl: './rooms-container.component.html',
  styleUrl: './rooms-container.component.scss',
})
export class RoomsContainerComponent implements OnInit {
  
  public rooms$!: Observable<RoomModel[]>;
  public isLoading$!: Observable<boolean>;

  userId!: number;

  constructor(private store: Store, private jwtService: JwtService) {}

  // when the component initializes we will fetch all rooms
  ngOnInit(): void {
    this.setUserId(); 
    this.selectState(); // select state slices
    this.dispatchActionsToLoadData(this.userId); // dispatch actions to load data (joined, saved and completed rooms)  }
  }

  private setUserId(): void {
    const token: any = localStorage.getItem('access-token'); // first retrieve token from local storage
    const decoded: any = this.jwtService.decodeToken(token);
    this.userId = decoded.userId;
  }

  private selectState(): void {
    this.rooms$ = this.store.select(selectRooms);
    this.isLoading$ = this.store.select(selectRoomsloadingState);
  }

  private dispatchActionsToLoadData(userId: number): void {
    this.store.dispatch(RoomsActions.load({ userId: userId }));
  }

}
