import { Component, OnInit } from '@angular/core';
import { RoomModel } from '../../../../my-space/models/room.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-rooms-container',
  standalone: false,
  templateUrl: './rooms-container.component.html',
  styleUrl: './rooms-container.component.scss'
})
export class RoomsContainerComponent implements OnInit {

  public rooms$!: Observable<RoomModel[]>; // this will emit fetched rooms (filtered or all)
  public isLoading$!: Observable<boolean>;
  // activeFilter$!: Observable<'joined' | 'saved' | 'completed'>;

  userId!: number ;
  
  constructor(private store: Store){}

  // when the component initializes we will fetch all rooms
  ngOnInit(): void {
    // here we will dispatch an action to get all rooms
  }
}
