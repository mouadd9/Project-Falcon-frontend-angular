import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public showNavBar: boolean = false;
  private authSubscription: Subscription | undefined;

  constructor(private router: Router) {}

  ngOnInit(): void {


  }

}
