import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RoomModel } from '../../../../../core/models/room.model';
import {
  myRoomsloadingState,
  selectActiveFilter,
  selectFilteredRooms,
} from '../../../state/my-rooms.selectors';
import {
  CompletedRoomsActions,
  JoinedRoomsActions,
  RoomsFilterActions,
  SavedRoomsActions,
} from '../../../state/my-rooms.actions';
import { JwtService } from '../../../../../core/services/jwt.service';

// this component will :
// Select data from the store
// Dispatch actions on initialization and in response to events
// Pass data to dumb components
@Component({
  selector: 'app-my-rooms',
  standalone: false,
  templateUrl: './my-rooms.component.html',
  styleUrl: './my-rooms.component.scss',
})
export class MyRoomsComponent implements OnInit {
  filteredRooms$!: Observable<RoomModel[]>;
  activeFilter$!: Observable<'joined' | 'saved' | 'completed'>;
  isLoading$!: Observable<boolean>;
  userId!: number ;

  constructor(private store: Store, private jwtService: JwtService) {}

  ngOnInit(): void {
    this.setUserId(); 
    this.selectState(); // select state slices
    this.dispatchActionsToLoadData(this.userId); // dispatch actions to load data (joined, saved and completed rooms)
  }

  private setUserId(): void {
    const token: any = localStorage.getItem('access-token'); // first retrieve token from local storage
    const decoded: any = this.jwtService.decodeToken(token);
    this.userId = decoded.userId;
  }

  // 1. Select state observables from the store
  private selectState(): void {
    // initial state will have the active filter property set to 'joined' by default, this observable will initially emit joinedRooms by default
    this.filteredRooms$ = this.store.select(selectFilteredRooms);
    // this emits the active filter, this will initially emit 'joined'
    this.activeFilter$ = this.store.select(selectActiveFilter);
    // this is initially set to false, but will be set to true when we dispatch load data actions
    this.isLoading$ = this.store.select(myRoomsloadingState);
  }

  // here when we dispatch an action to get rooms we should specify the id of the user
  // 2. Dispatch actions to load all room types when component initializes
  private dispatchActionsToLoadData(userId: number): void {
    this.store.dispatch(JoinedRoomsActions.load({userId: userId}));
    this.store.dispatch(SavedRoomsActions.load({userId: userId}));
    this.store.dispatch(CompletedRoomsActions.load({userId: userId}));
    // note :
    // the data is relatively static during a user session.
    // It only changes when a user performs actions elsewhere in the app (joining, saving, or completing rooms).
  }

  // 3. Method to handle filter change events from the tabs component
  onFilterChanged(filter: 'joined' | 'saved' | 'completed'): void {
    this.store.dispatch(RoomsFilterActions.set({ filter }));
  }

  // when a user clicks a tab , an event occurs and is processed by this method
  // this method takes in the filter, and dispatches the actions that changes the filter
  // then the state changes and the selector that returns an array of rooms according to the filter will return a new reference of a new array
  // then its observable emits the new array, and its passed down to the room grid and shown
}
