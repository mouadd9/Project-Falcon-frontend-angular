import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRoomCardComponent } from './my-room-card.component';

describe('MyRoomCardComponent', () => {
  let component: MyRoomCardComponent;
  let fixture: ComponentFixture<MyRoomCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyRoomCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRoomCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
