import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectNavBarState } from './features/auth/state/auth.selectors';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showNavBar$!: Observable<Boolean>;

  constructor(private store : Store) {}

  ngOnInit(): void {
   this.showNavBar$ = this.store.select(selectNavBarState);
  }

}
