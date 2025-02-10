import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsTabsComponent } from './my-rooms-tabs.component';

describe('RoomsTabsComponent', () => {
  let component: RoomsTabsComponent;
  let fixture: ComponentFixture<RoomsTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoomsTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomsTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
